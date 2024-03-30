const express = require('express');

// const authController = require('../controller/auth-controller');
const answerController = require('../controller/answer-controller');

const router = express.Router();

router.route('/').get(answerController.getAllAnswers);

module.exports = router;
