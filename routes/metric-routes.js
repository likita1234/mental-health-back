const express = require('express');

const authController = require('../controller/auth-controller');
const metricController = require('../controller/metric-controller');

const router = express.Router();

router
  .route('/')
  .get(authController.validateToken, metricController.getAllMetrics)
  .post(authController.validateToken, metricController.addMetric);

// =================> Question wise generic data analysis
router.get('/:metricId/data', metricController.getMetricData);

// ______________________________________________________
// ======================================================

// =================> WHO-5 Summation Calculation data analysis

// =================> Section Wise :- All Questions Included analysis (Filter out open end)

// =================> All Sections Ratings Questions based :- Correlation analysis (Pearson) and Regression Analysis

module.exports = router;
