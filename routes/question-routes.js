const express = require('express');

const authController = require('../controller/auth-controller');
const questionController = require('../controller/question-controller');

const router = express.Router();

/**
 * @swagger
 *  /api/v1/question:
 *   get:
 *     summary: Get all questions
 *     tags:
 *       - Question
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: (default is 1)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: (default is 10)
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *         description: Sort the results by one or more fields
 *       - in: query
 *         name: fields
 *         schema:
 *           type: array
 *           items:
 *              type: string
 *              enum:
 *                - title
 *                - description
 *                - label
 *         description: Specify which fields to be returned (e.g., title,description)
 *       - in: query
 *         name: label
 *         schema:
 *           type: string
 *         description: Filter by label
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *         description: Filter by question type
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             example:
 *               status: success
 *               total: 5
 *               data:
 *                 questions: []
 */
router.get(
  '/',
  authController.validateToken,
  questionController.getAllQuestions,
);

/**
 * @swagger
 * /api/v1/question/add:
 *   post:
 *     summary: Add a new question
 *     tags:
 *       - Question
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: Question details
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             title: "Sample Question"
 *             description: "This is a sample question"
 *             label: "Sample Label"
 *             type: "multiple_choice"
 *             options: [{ optionName: "Option 1", optionValue: "Value 1" }]
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             example:
 *               status: success
 *               data:
 *                 question: {}
 */
router.post(
  '/add',
  authController.validateToken,
  //   authController.restrictTo('admin', 'superadmin'),
  questionController.addQuestion,
);

module.exports = router;
