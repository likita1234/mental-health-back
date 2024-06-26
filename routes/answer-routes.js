const express = require('express');

const authController = require('../controller/auth-controller');
const answerController = require('../controller/answer-controller');

const router = express.Router();

router.route('/').get(answerController.getAllAnswers);

router
  .route('/duplicate/:sourceQuestionId/:destinationQuestionId')
  .post(authController.validateToken, answerController.duplicateAnswerData);
// router.get('/:category', answerController.aggregateGenderData);

module.exports = router;
