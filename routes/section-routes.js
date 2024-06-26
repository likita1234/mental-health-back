const express = require('express');

const authController = require('../controller/auth-controller');
const sectionController = require('../controller/section-controller');

const router = express.Router();

router
  .route('/')
  .get(authController.validateToken, sectionController.getAllSections)
  .post(
    authController.validateToken,
    authController.restrictTo('superadmin', 'admin', 'test-admin'),
    sectionController.addSection
  );

router
  .route('/:id')
  .get(authController.validateToken, sectionController.getSectionDetails)
  .patch(
    authController.validateToken,
    authController.restrictTo('superadmin', 'admin'),
    sectionController.updateSection
  )
  .delete(
    authController.validateToken,
    authController.restrictTo('superadmin', 'admin'),
    sectionController.deleteSection
  );
module.exports = router;
