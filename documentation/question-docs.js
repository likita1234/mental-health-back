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
 *       - bearerAuth: []
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

/**
 * @swagger
 * /api/v1/question:
 *   post:
 *     summary: Add a new question
 *     tags:
 *       - Questions
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
 *             type: "radio"
 *             options: [{ optionName: "Option 1", optionValue: 1 }]
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             example:
 *               status: success
 *               data:
 *                 question: {}
 *
 *
 * /api/v1/question/{id}:
 *   get:
 *     summary: Get Question Details
 *     description: Retrieve details of a specific question by ID
 *     tags:
 *       - Questions
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the question
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Question details retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   description: Request status
 *                 data:
 *                   type: object
 *                   description: Question details
 *               example:
 *                 status: 'success'
 *                 data:
 *
 *       '404':
 *         description: No question found with the provided ID
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *
 *   delete:
 *     summary: Delete Question by ID
 *     description: Delete a specific question by ID
 *     tags:
 *       - Questions
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the Question to be deleted
 *         schema:
 *           type: string
 *     responses:
 *       '204':
 *         description: Question deleted successfully
 *         content:
 *           application/json:
 *             example:
 *               status: success
 *               data: 'Question has been deleted'
 *       '404':
 *         description: No question found with the provided ID
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *
 */
