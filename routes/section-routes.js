const express = require('express');

const authController = require('../controller/auth-controller');
const sectionController = require('../controller/section-controller');

const router = express.Router();

router.get('/', authController.validateToken, sectionController.getAllSections);

router.post('/', authController.validateToken, sectionController.addSection);

router.post(
  '/:sectionId',
  authController.validateToken,
  sectionController.updateSection
);

module.exports = router;
