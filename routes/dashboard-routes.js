const express = require('express');

const authController = require('../controller/auth-controller');
const dashboardController = require('../controller/dashboard-controller');

const router = express.Router();

router
  .route('/')
  .get(authController.validateToken, dashboardController.getAllDashboards)
  .post(authController.validateToken, dashboardController.createDashboard);

router
  .route('/:dashboardId')
  .get(authController.validateToken, dashboardController.getDashboardDetails)
  .patch(authController.validateToken, dashboardController.updateDashboardDetails);

module.exports = router;
