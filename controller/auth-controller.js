const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const User = require('../models/user-model');
const catchAsync = require('../utils/catch-async');
const AppError = require('../utils/app-errors');
const SendEmail = require('../utils/email');

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createAndSendToken = (user, statusCode, res) => {
  // Create a token
  const token = signToken(user._id);

  // Set cookie options
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };
  // If its production environment then set cookie options secure true
  if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;
  // Set cookie
  res.cookie('jwt', token, cookieOptions);

  // Remove password visibility from the response
  user.password = undefined;

  // Return response data
  res.status(statusCode).json({
    status: 'success',
    data: {
      token,
      user,
    },
  });
};

const encryptData = async (data) => {
  return await bcrypt.hash(data, 12);
};

const compareEncryptedData = async (email1, email2) => {
  return await bcrypt.compare(email1, email2);
};

exports.signup = catchAsync(async (req, res, next) => {
  const { username, email, password, confirmPassword } = req.body;
  const encryptedEmail = await encryptData(email);

  // Check if the user email already exists
  const user = await User.findOne({ $or: [{ username }, { email }] });
  if (user) {
    return next(
      new AppError(
        'Username or Email has already been taken. Please use another email or username',
        400
      )
    );
  }
  // Create a new user record
  const newUser = await User.create({
    username,
    email: encryptedEmail,
    password,
    confirmPassword,
  });
  // Generate token and send the response
  createAndSendToken(newUser, 201, res);
});

const promisifyJWTToken = promisify(jwt.verify);

exports.signin = catchAsync(async (req, res, next) => {
  const { username, password } = req.body;
  //   check if username and password exists
  if (!username || !password) {
    return next(new AppError('Please provide username and password!', 400));
  }

  // check if the user exists and the password is correct
  const user = await User.findOne({ username }).select('+password');
  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Invalid credentials', 401));
  }
  // if everything is good then send token to the clients
  createAndSendToken(user, 200, res);
});

exports.validateToken = catchAsync(async (req, res, next) => {
  let token;
  // 1) Getting token and check if its there
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }
  if (!token) {
    return next(new AppError('You are not logged in! Please re login ', 401));
  }
  // 2) Verification Token
  const decodedToken = await promisifyJWTToken(token, process.env.JWT_SECRET);

  // 3) Check if user still exists
  // set active 0 part here later
  const currentUser = await User.findById(decodedToken.id);
  if (!currentUser) {
    return next(new AppError("The user doesn't exist", 400));
  }

  // 4) Check if user changed password after token was used
  // iat is the issued at token timestamp of our json webtoken
  if (currentUser.changedPasswordAfter(decodedToken.iat)) {
    return next(
      new AppError(
        'User recently changed password. Please re login to continue.',
        401
      )
    );
  }
  req.loggedUser = currentUser;
  // Grant Access to the Protected Route
  next();
});

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.loggedUser.role)) {
      return next(
        new AppError(
          "User doesn't have enough permissions to perform the action",
          403
        )
      );
    }
    next();
  };
};

exports.forgotPassword = catchAsync(async (req, res, next) => {
  const { email } = req.body;
  // 1) Get user based on req body email
  const user = await User.findOne({ email: email });
  // Check if user exists
  if (!user) {
    return next(new AppError('No user found with that email address', 404));
  }
  // 2) Generate random reset token
  const resetToken = await user.createPasswordResetToken();
  // Avoid validation
  await user.save({ validateBeforeSave: false });
  // 3) Send it to user's email
  const resetURL = `${req.protocol}://${req.get(
    'host'
  )}/api/v1/auth/resetPassword/${resetToken}`;

  const message = `Forgot your password ? Please follow the link below to reset your password:\n ${resetURL}.\n If you didn't reset your password, please ignore this email!`;

  try {
    await SendEmail({
      email: user.email,
      subject: 'Your password reset token (valid for 10 mins)',
      message,
    });

    res.status(200).json({
      status: 'success',
      message: 'Token sent to email',
    });
  } catch (error) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return next(
      new AppError('Error sending the email. Please try again later!', 500)
    );
  }
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  // 1) Get user based on the token
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.passwordResetToken)
    .digest('hex');

  // Find the user with the matching hasedToken as well as check whether the passwordResetExpires has expired or not
  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });
  if (!user) {
    return next(new AppError('Invalid Token', 400));
  }
  // 2) If the token has not expired and there is uer, set the new password
  user.password = req.body.password;
  user.confirmPassword = req.body.confirmPassword;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();
  // 3) Update changedPasswordAt property for the user
  // 4) Log the user in, Send the JWT
  createAndSendToken(user, 200, res);
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  const { currentPassword, newPassword, confirmPassword } = req.body;
  // 1) Get User from the collection
  const currentUser = await User.findById(req.loggedUser.id).select(
    '+password'
  );
  // 2) Check if the current password set is correct or not by comparing its hash code
  const passwordMatches = await currentUser.correctPassword(
    currentPassword,
    currentUser.password
  );
  if (!passwordMatches) {
    return next(new AppError('The current password is incorrect.', 403));
  }
  // 3) Update the password
  currentUser.password = newPassword;
  currentUser.confirmPassword = confirmPassword;
  await currentUser.save();
  // 4) Log user in, send JWT
  createAndSendToken(currentUser, 201, res);
});
