const express = require('express');

const authController = require('../controller/auth-controller');
const sectionController = require('../controller/section-controller');

const router = express.Router();

router.post('/', authController.validateToken, sectionController.addSection);


module.exports = router