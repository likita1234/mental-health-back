const User = require('../models/user-model');
const AppError = require('../utils/app-errors');
const catchAsync = require('../utils/catch-async');

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  console.log(newObj);
  return newObj;
};

exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find({});

  // Send Response
  res.status(200).json({
    status: 'success',
    totalRecords: users.length,
    data: {
      users,
    },
  });
});

exports.updateLoggedUserDetails = catchAsync(async (req, res, next) => {
  // fetch User details
  const { name, surname, email } = req.body;
  // 1) Create error if user POSTS password details
  if (req.body.password || req.body.confirmPassword) {
    return next(
      new AppError(
        'You cannot update password here. Please use a different link.',
        400,
      ),
    );
  }

  // 2) Filter the fields first and update into the existing user object
  const filteredUserDetails = filterObj(req.body, 'name', 'surname');
  // 3) Update User details

  const updatedUser = await User.findByIdAndUpdate(
    req.loggedUser._id,
    filteredUserDetails,
    { new: true, runValidators: true },
  );

  res.status(200).json({
    message: 'User details updated successfully',
    user: updatedUser,
  });
});

// need to refactor this a bit
// currently only the logged user can delete him/her self
// need to be able to delete other users who can do so, like admins, superadmin
exports.deleteUser = catchAsync(async (req, res, next) => {
  // 1) Find user exists and delete-> set active as false

  await User.findByIdAndUpdate(req.user.id, { active: false });

  res.status(204).json({
    status: 'success',
    data: null,
  });
});
