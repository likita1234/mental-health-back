const express = require('express');

const authController = require('../controller/auth-controller');
const questionController = require('../controller/question-controller');

const router = express.Router();

router
  .route('/')
  .get(authController.validateToken, questionController.getAllQuestions)
  .post(
    authController.validateToken,
    authController.restrictTo('admin', 'superadmin', 'test-admin'),
    questionController.addQuestion
  );

router
  .route('/:id')
  .get(authController.validateToken, questionController.getQuestionDetails)
  .patch(
    authController.validateToken,
    authController.restrictTo('superadmin', 'admin'),
    questionController.updateQuestion
  )
  .delete(
    authController.validateToken,
    authController.restrictTo('superadmin', 'admin'),
    questionController.deleteQuestion
  );
module.exports = router;
