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
  .patch(
    authController.validateToken,
    dashboardController.updateDashboardDetails
  );

router
  .route('/:dashboardId/data')
  .get(authController.validateToken, dashboardController.getDashboardData);

router
  .route('/personal/overall')
  .get(
    authController.validateToken,
    dashboardController.getOverallPersonalData
  );
router
  .route('/personal/overall/:userId')
  .get(
    authController.validateToken,
    dashboardController.getOverallPersonalData
  );

module.exports = router;
