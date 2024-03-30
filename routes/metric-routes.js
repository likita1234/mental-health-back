const express = require('express');

const authController = require('../controller/auth-controller');
const metricController = require('../controller/metric-controller');

const router = express.Router();

router
  .route('/')
  .get(authController.validateToken, metricController.getAllMetrics)
  .post(authController.validateToken, metricController.addMetric);

// ======================================================
// ______________________________________________________

// =================> Question wise generic data analysis
// =================> WHO-5 Summation Calculation data analysis
router.get('/:metricId/data', metricController.getMetricData);

// =================> Section Wise :- All Questions Included analysis (Filter out open end)

// =================> All Sections Ratings Questions based :- Correlation analysis (Pearson) and Regression Analysis

// ______________________________________________________
// ======================================================

module.exports = router;
