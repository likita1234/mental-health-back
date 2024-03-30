const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const User = require('../models/user-model');
const catchAsync = require('../utils/catch-async');
const AppError = require('../utils/app-errors');

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    surname: req.body.surname,
    email: req.body.email,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword,
  });

  // Create a token
  const token = signToken(newUser._id);

  res.status(201).json({
    status: 'success',
    token,
    data: {
      user: newUser,
    },
  });
});

const promisifyJWTToken = promisify(jwt.verify);

exports.signin = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  //   check if email and password exists
  if (!email || !password) {
    return next(new AppError('Please provide email and password!', 400));
  }
  // check if the user exFists and the password is correct
  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Invalid credentials', 401));
  }
  // if everything is good then send token to the client
  const token = signToken(user._id);
  res.status(200).json({
    status: 'success',
    token,
  });
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
  // console.log('token', token);
  console.log('Decoding token');
  // 2) Verification Token
  const decodedToken = await promisifyJWTToken(token, process.env.JWT_SECRET);

  // 3) Check if user still exists
  // set active 0 part here later
  const userExists = await User.findById(decodedToken.id);
  if (!userExists) {
    return next(new AppError("The user doesn't exist"));
  }

  // 4) Check if user changed password after token was used
  // iat is the issued at token timestamp of our json webtoken
  if (userExists.changedPasswordAfter(decodedToken.iat)) {
    return next(
      new AppError(
        'User recently changed password. Please re login to continue.',
        401,
      ),
    );
  }
  // Grant Access to the Protected Route
  next();
});
