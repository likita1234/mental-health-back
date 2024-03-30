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
    confirmPassword: req.body.password,
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
