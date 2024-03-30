const express = require('express');

const authController = require('../controller/auth-controller');
const metricController = require('../controller/metric-controller');

const router = express.Router();

router
  .route('/')
  .post(authController.validateToken, metricController.addMetric);

module.exports = router;
