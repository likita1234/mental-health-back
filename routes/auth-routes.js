const express = require('express');
const authController = require('../controller/auth-controller');

const router = express.Router();

router.post('/signup', authController.signup);
  
module.exports = router;
