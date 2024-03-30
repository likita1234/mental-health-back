const express = require('express');

// const authController = require('../controller/auth-controller');
const answerController = require('../controller/answer-controller');

const router = express.Router();

router.route('/').get(answerController.getAllAnswers);

// router.get('/:category', answerController.aggregateGenderData);

// =================> Question wise generic data analysis
// _________________> Params:- formId and questionId and expected chart type:- table, pie, bar, ratings, radar
router.get('/question', answerController.questionWiseDataAnalysis);

// ______________________________________________________
// ======================================================

// =================> WHO-5 Summation Calculation data analysis

// =================> Section Wise :- All Questions Included analysis (Filter out open end)

// =================> All Sections Ratings Questions based :- Correlation analysis (Pearson) and Regression Analysis

module.exports = router;
