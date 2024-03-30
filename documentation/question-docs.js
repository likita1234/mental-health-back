
/**
 * @swagger
 * tags:
 *   - name: Questions
 *     description:
 * 
 * /api/v1/question:
 *   get:
 *     summary: Get all questions
 *     tags:
 *       - Questions
 *     security:
 *       - BearerAuth: []
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
 * 
 * /api/v1/question/add:
 *   post:
 *     summary: Add a new question
 *     tags:
 *       - Questions
 *     security:
 *       - BearerAuth: []
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

