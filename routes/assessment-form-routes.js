const express = require('express');

const authController = require('../controller/auth-controller');
const formController = require('../controller/assessment-form-controller');

const router = express.Router();

router
  .route('/')
  .get(authController.validateToken, formController.getAllAssessmentForms)
  .post(authController.validateToken, formController.addAssessmentForm);

router
  .route('/:id')
  .get(formController.getAssessmentFormDetails)
  .patch(authController.validateToken, formController.updateAssessmentForm)
  .delete(authController.validateToken, formController.deleteAssessmentForm);

router
  .route('/pollSwitch/:id')
  .patch(authController.validateToken, formController.toggleAssessmentPoll);
module.exports = router;
