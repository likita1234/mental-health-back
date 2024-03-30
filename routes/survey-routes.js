const express = require('express');

// const authController = require('../controller/auth-controller');
const formController = require('../controller/assessment-form-controller');

const router = express.Router();

// Define a middleware function to set default parameters
const setDefaultParams = (req, res, next) => {
  req.query.type = 'public'; // Set default value for type parameter
  next();
};

router.route('/').get(setDefaultParams, formController.getAllAssessmentForms);

module.exports = router;
