/**
 * @swagger
 * /api/v1/survey:
 *   get:
 *     summary: Get All Survey Forms
 *     description: Retrieve all assessment forms along with their details.
 *     tags:
 *       - Survey
 *     parameters: []
 *     security:
 *       - bearerAuth: []  # Specify that this endpoint requires authentication
 *     responses:
 *       '200':
 *         description: Assessment forms retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   description: Status of the response.
 *                 data:
 *                   type: object
 *                   properties:
 *                     forms:
 *                       type: array
 *                       description: List of assessment forms.
 *                       items:
 *                         type: object
 *                         properties:
 *                           type:
 *                             type: string
 *                             description: The type of the form.
 *                           active:
 *                             type: boolean
 *                             description: Indicates if the form is active.
 *                           pollActive:
 *                             type: boolean
 *                             description: Indicates if the form is poll active.
 *                           submissions:
 *                             type: integer
 *                             description: The number of submissions for the form.
 *                           _id:
 *                             type: string
 *                             description: The ID of the form.
 *                           title:
 *                             type: object
 *                             description: Title of the form.
 *                             properties:
 *                               _id:
 *                                 type: string
 *                                 description: The ID of the title.
 *                               english:
 *                                 type: string
 *                                 description: The English title.
 *                               nepali:
 *                                 type: string
 *                                 description: The Nepali title.
 *                           description:
 *                             type: object
 *                             description: Description of the form.
 *                             properties:
 *                               _id:
 *                                 type: string
 *                                 description: The ID of the description.
 *                               english:
 *                                 type: string
 *                                 description: The English description.
 *                               nepali:
 *                                 type: string
 *                                 description: The Nepali description.
 *                           sections:
 *                             type: array
 *                             description: List of sections in the form.
 *                             items:
 *                               type: object
 *                               properties:
 *                                 _id:
 *                                   type: string
 *                                   description: The ID of the section.
 *                                 order:
 *                                   type: integer
 *                                   description: The order of the section.
 *                                 sectionId:
 *                                   type: string
 *                                   description: The ID of the section.
 *                           createdDate:
 *                             type: string
 *                             format: date-time
 *                             description: The creation date of the form.
 *                           updatedDate:
 *                             type: string
 *                             format: date-time
 *                             description: The last update date of the form.
 *                     total:
 *                       type: integer
 *                       description: Total number of assessment forms.
 *       '401':
 *         description: Unauthorized, authentication token not provided.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *
 *   post:
 *     summary: Submit Form Answer
 *     description: Submit answers for a form.
 *     tags:
 *       - Survey
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               formId:
 *                 type: string
 *                 description: The ID of the form.
 *               userId:
 *                 type: string
 *                 description: The ID of the user submitting the form.
 *               answers:
 *                 type: array
 *                 description: Array of answers submitted for the form.
 *                 items:
 *                   type: object
 *                   properties:
 *                     questionId:
 *                       type: string
 *                       description: The ID of the question.
 *                     answer:
 *                       type: string
 *                       description: The answer provided for the question.
 *     security:
 *       - bearerAuth: []  # Specify that this endpoint requires authentication
 *     responses:
 *       '201':
 *         description: Form answers submitted successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   description: Status of the response.
 *                 data:
 *                   type: object
 *                   properties:
 *                     answers:
 *                       type: array
 *                       description: List of answers submitted.
 *                       items:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                             description: The ID of the answer.
 *                           formId:
 *                             type: string
 *                             description: The ID of the form.
 *                           userId:
 *                             type: string
 *                             description: The ID of the user submitting the answer.
 *                           questionId:
 *                             type: string
 *                             description: The ID of the question.
 *                           answer:
 *                             type: string
 *                             description: The submitted answer.
 *       '400':
 *         description: Bad request, invalid input provided.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       '401':
 *         description: Unauthorized, authentication token not provided.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
