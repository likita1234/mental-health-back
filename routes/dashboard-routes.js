const express = require('express');

const authController = require('../controller/auth-controller');
const dashboardController = require('../controller/dashboard-controller');

const router = express.Router();

router
  .route('/')
  .post(authController.validateToken, dashboardController.createDashboard);

router
  .route('/:dashboardId/data')
  .get(authController.validateToken, dashboardController.getDashboardData);

module.exports = router;
