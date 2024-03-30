const express = require('express');

const authController = require('../controller/auth-controller');
const dashboardController = require('../controller/dashboard-controller');

const router = express.Router();

router
  .route('/')
  .post(authController.validateToken, dashboardController.createDashboard);

module.exports = router;
