const express = require('express');

const authController = require('../controller/auth-controller');
const questionController = require('../controller/question-controller');

const router = express.Router();

router
  .route('/')
  .get(authController.validateToken, questionController.getAllQuestions)
  .post(
    authController.validateToken,
    //   authController.restrictTo('admin', 'superadmin'),
    questionController.addQuestion
  );

router
  .route('/:id')
  .get(authController.validateToken, questionController.getQuestionDetails)
  .patch(authController.validateToken, questionController.updateQuestion)
  .delete(
    authController.validateToken,
    // authController.restrictTo('admin'),
    questionController.deleteQuestion
  );
module.exports = router;
