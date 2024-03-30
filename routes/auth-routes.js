const express = require('express');
const authController = require('../controller/auth-controller');

const router = express.Router();

router.post('/signup', authController.signup);
router.post('/login', authController.signin);

router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);

module.exports = router;
