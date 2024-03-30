const express = require('express');
const authController = require('../controller/auth-controller');
const userController = require('../controller/user-controller');

const router = express.Router();

router.get('/', authController.validateToken, userController.getAllUsers);

router.patch(
  '/update',
  authController.validateToken,
  userController.updateUserDetails,
);

module.exports = router;
