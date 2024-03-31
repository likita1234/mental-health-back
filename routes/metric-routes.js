const express = require('express');

const authController = require('../controller/auth-controller');
const metricController = require('../controller/metric-controller');

const router = express.Router();

router
  .route('/')
  .get(authController.validateToken, metricController.getAllMetrics)
  .post(authController.validateToken, metricController.addMetric);

// ======================================================
//  Data Aggregations Starts
// ______________________________________________________

// =================> Question wise generic data analysis and   <=================||
// =================> WHO-5 Summation Calculation data analysis <=================||
router
  .route('/:metricId/data')
  .get(authController.validateToken, metricController.getMetricData);
// =================> Question
router
  .route('/keywords-analysis/:questionId')
  .get(authController.validateToken, metricController.getKeywordsAnalysisByQuestion);

// =================> Section Wise :- All Questions Included analysis (Filter out open end) <=================||
router
  .route('/:formId/:sectionId/data')
  .get(
    authController.validateToken,
    metricController.getTableAnalysisByFormAndSection
  );
// =================> All Sections Ratings Questions based :
//  Correlation analysis (Pearson) and Regression Analysis    <=================||

// ______________________________________________________
//  Data Aggregations Ends
// ======================================================

module.exports = router;
