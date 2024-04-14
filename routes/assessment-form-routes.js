const express = require('express');

const authController = require('../controller/auth-controller');
const formController = require('../controller/assessment-form-controller');

const router = express.Router();

router
  .route('/')
  .get(formController.getAllAssessmentForms)
  .post(
    authController.validateToken,
    authController.restrictTo('superadmin', 'admin', 'test-admin'),
    formController.addAssessmentForm
  );

router
  .route('/:id')
  .get(formController.getAssessmentFormDetails)
  .patch(
    authController.validateToken,
    authController.restrictTo('superadmin', 'admin'),
    formController.updateAssessmentForm
  )
  .delete(
    authController.validateToken,
    authController.restrictTo('superadmin', 'admin'),
    formController.deleteAssessmentForm
  );

router
  .route('/pollSwitch/:id')
  .patch(
    authController.validateToken,
    authController.restrictTo('superadmin', 'admin'),
    formController.toggleAssessmentPoll
  );
module.exports = router;
