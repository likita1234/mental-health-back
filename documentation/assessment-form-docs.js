/**
 * @swagger
 * tags:
 *   - name: Assessment Forms
 *     description:
 *
 * /api/v1/assessmentForm:
 *   get:
 *     summary: Get all existing assessment forms
 *     tags:
 *       - Assessment Forms
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
 *                 assessmentForms: []
 *   post:
 *     summary: Add a new assessment form
 *     tags:
 *       - Assessment Forms
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: Assessment Form details
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             name: "Sample Name"
 *             title: "Sample Assessment Form"
 *             description: "This is a sample assessmentForm"
 *             sections: []
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             example:
 *               status: success
 *               data:
 *                 assessmentForm: {}
 *
 *
 * /api/v1/assessmentForm/{id}:
 *   get:
 *     summary: Get Assessment Form Details
 *     description: Retrieve details of a specific assessment form by ID
 *     tags:
 *       - Assessment Forms
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Assessment Form Id
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Assessment Form details retrieved successfully
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
 *                   description: Assessment Form details
 *               example:
 *                 status: 'success'
 *                 data: {}
 *       '404':
 *         description: No assessmentForm found with the provided ID
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 * 
 *   patch:
 *     summary: Update an assessment form
 *     description: Update details of an assessment form
 *     tags:
 *       - Assessment Forms
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the assessment form to update
 *         schema:
 *           type: string
 *     requestBody:
 *       description: Assessment Form details
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *              name: "Assessment Form Name"
 *              title: "Assessment Form Title"
 *              description: "Assessment Form Description"
 *              sections: ["sectionObjectId"]
 *     responses:
 *       '200':
 *         description: Successful update
 *         content:
 *           application/json:
 *             example:
 *               status: success
 *               data:
 *                name: "Assessment Form name"
 *                title: "Assessment Form title"
 *                description: "Assessment Form description"
 *                sections: []
 *
 *   delete:
 *     summary: Delete an assessment form by ID
 *     description: Delete a specific assessment form by ID
 *     tags:
 *       - Assessment Forms
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the Assessment Form to be deleted
 *         schema:
 *           type: string
 *     responses:
 *       '204':
 *         description: Assessment Form deleted successfully
 *       '404':
 *         description: No assessmentForm found with the provided ID
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *
 */
