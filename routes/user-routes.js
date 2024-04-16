const express = require('express');
const authController = require('../controller/auth-controller');
const userController = require('../controller/user-controller');

const router = express.Router();

router.get(
  '/',
  authController.validateToken,
  authController.restrictTo('superadmin', 'admin'),
  userController.getAllUsers
);

router.patch(
  '/update',
  authController.validateToken,
  authController.restrictTo('superadmin', 'admin'),
  userController.updateLoggedUserDetails
);

router.delete(
  '/:userId',
  authController.validateToken,
  authController.restrictTo('admin', 'superadmin'),
  userController.deleteUser
);

module.exports = router;
