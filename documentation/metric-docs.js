/**
 * @swagger
 * tags:
 *   - name: Metric
 *
 * /api/v1/metric:
 *   get:
 *     summary: Get all metric
 *     tags:
 *       - Metric
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     metric:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Metric'
 *                     total:
 *                       type: integer
 *
 *   post:
 *     summary: Create a new metric
 *     tags:
 *       - Metric
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Metric'
 *     responses:
 *       '201':
 *         description: Successfully created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/Metric'
 */

/**
 * @swagger
 * /api/v1/metric/{metricId}/data:
 *   get:
 *     summary: Get Metric Data
 *     description: Retrieve data for a specific metric. Make data analysis on the basis of individual question representing a particular form.
 *     tags:
 *       - Metric
 *     parameters:
 *       - in: path
 *         name: metricId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the metric to retrieve data for.
 *     security:
 *       - bearerAuth: []  # Specify that this endpoint requires authentication
 *     responses:
 *       '200':
 *         description: Metric data retrieved successfully.
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
 *                     id:
 *                       type: string
 *                       description: The ID of the metric.
 *                     title:
 *                       type: string
 *                       description: The title of the metric.
 *                     description:
 *                       type: string
 *                       description: The description of the metric.
 *                     chartType:
 *                       type: string
 *                       description: The type of chart to display.
 *                     metricData:
 *                       type: object
 *                       properties:
 *                         totalCount:
 *                           type: number
 *                           description: The total count of data entries.
 *                         data:
 *                           type: array
 *                           items:
 *                             type: object
 *                             properties:
 *                               label:
 *                                 type: string
 *                                 description: The label for the data entry.
 *                               count:
 *                                 type: number
 *                                 description: The count of occurrences for the label.
 *                               percent:
 *                                 type: number
 *                                 description: The percentage of occurrences for the label.
 *                         labels:
 *                           type: array
 *                           items:
 *                             type: string
 *                           description: Labels associated with the metric data.
 *       '400':
 *         description: Bad request, metric details not found.
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
 * 
 * /metric/api/keywords-analysis/{formId}/{questionId}:
 *   get:
 *     summary: Get Keywords Analysis by Question
 *     description: Retrieve keywords analysis for a specific question in a form.
 *     tags:
 *       - Metric
 *     parameters:
 *       - in: path
 *         name: formId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the form.
 *       - in: path
 *         name: questionId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the question.
 *     security:
 *       - bearerAuth: []  # Specify that this endpoint requires authentication
 *     responses:
 *       '200':
 *         description: Keywords analysis retrieved successfully.
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
 *                     keywords:
 *                       type: object
 *                       description: Keywords analysis data.
 *                       example:
 *                         accustomed: 6
 *                         adapt: 6
 *                         attended: 8
 *                     answers:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                             description: The ID of the answer.
 *                           answer:
 *                             type: string
 *                             description: The answer text.
 *       '400':
 *         description: Bad request, invalid question ID.
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
 * 
 * 
 * /metric/api/v1/{formId}/{sectionId}/data:
 *   get:
 *     summary: Get Table Analysis by Form and Section
 *     description: Retrieve table analysis for a specific section in a form.
 *     tags:
 *       - Metric
 *     parameters:
 *       - in: path
 *         name: formId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the form.
 *       - in: path
 *         name: sectionId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the section.
 *     security:
 *       - bearerAuth: []  # Specify that this endpoint requires authentication
 *     responses:
 *       '200':
 *         description: Table analysis retrieved successfully.
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
 *                     sectionDetails:
 *                       type: object
 *                       description: Details of the section.
 *                       properties:
 *                         active:
 *                           type: boolean
 *                           description: Indicates if the section is active.
 *                         _id:
 *                           type: string
 *                           description: The ID of the section.
 *                         title:
 *                           type: object
 *                           description: Title of the section.
 *                           properties:
 *                             _id:
 *                               type: string
 *                               description: The ID of the title.
 *                             english:
 *                               type: string
 *                               description: The English title.
 *                             nepali:
 *                               type: string
 *                               description: The Nepali title.
 *                         description:
 *                           type: object
 *                           description: Description of the section.
 *                           properties:
 *                             _id:
 *                               type: string
 *                               description: The ID of the description.
 *                             english:
 *                               type: string
 *                               description: The English description.
 *                             nepali:
 *                               type: string
 *                               description: The Nepali description.
 *                         questions:
 *                           type: array
 *                           description: List of questions in the section.
 *                           items:
 *                             type: object
 *                             properties:
 *                               _id:
 *                                 type: string
 *                                 description: The ID of the question.
 *                               order:
 *                                 type: integer
 *                                 description: The order of the question within the section.
 *                               questionId:
 *                                 type: object
 *                                 description: Details of the question.
 *                                 properties:
 *                                   options:
 *                                     type: array
 *                                     description: List of options for the question.
 *                                     items:
 *                                       type: object
 *                                       properties:
 *                                         _id:
 *                                           type: string
 *                                           description: The ID of the option.
 *                                         title:
 *                                           type: object
 *                                           description: Title of the option.
 *                                           properties:
 *                                             _id:
 *                                               type: string
 *                                               description: The ID of the title.
 *                                             english:
 *                                               type: string
 *                                               description: The English title.
 *                                             nepali:
 *                                               type: string
 *                                               description: The Nepali title.
 *                                         optionValue:
 *                                           type: integer
 *                                           description: The value of the option.
 *                                         createdAt:
 *                                           type: string
 *                                           format: date-time
 *                                           description: The creation date of the option.
 *                                         updatedDate:
 *                                           type: string
 *                                           format: date-time
 *                                           description: The last update date of the option.
 *                                   active:
 *                                     type: boolean
 *                                     description: Indicates if the question is active.
 *                                   answer:
 *                                     type: string
 *                                     description: The answer to the question.
 *                                   required:
 *                                     type: boolean
 *                                     description: Indicates if the question is required.
 *                                   title:
 *                                     type: object
 *                                     description: Title of the question.
 *                                     properties:
 *                                       _id:
 *                                         type: string
 *                                         description: The ID of the title.
 *                                       english:
 *                                         type: string
 *                                         description: The English title.
 *                                       nepali:
 *                                         type: string
 *                                         description: The Nepali title.
 *                                   description:
 *                                     type: object
 *                                     description: Description of the question.
 *                                     properties:
 *                                       _id:
 *                                         type: string
 *                                         description: The ID of the description.
 *                                       english:
 *                                         type: string
 *                                         description: The English description.
 *                                       nepali:
 *                                         type: string
 *                                         description: The Nepali description.
 *                         metricData:
 *                           type: object
 *                           description: Metric data for the section.
 *                           example: {}  # Add an example of the metric data
 *       '400':
 *         description: Bad request, invalid form or section ID.
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
 * 
 * 
 * components:
 *   schemas:
 *     Metric:
 *       type: object
 *       required:
 *         - title
 *         - description
 *         - type
 *         - chartType
 *         - formId
 *       properties:
 *         title:
 *           type: string
 *           description: Title of the metric
 *         description:
 *           type: string
 *           description: Description of the metric
 *         type:
 *           type: string
 *           enum:
 *             - question
 *             - section
 *           description: Type of the metric
 *         chartType:
 *           type: string
 *           enum:
 *             - table
 *             - bar
 *             - pie
 *             - line
 *             - combo
 *             - ratings
 *             - question-options-summation
 *           description: Chart type for the metric
 *         author:
 *           type: string
 *           description: ID of the author (User)
 *         formId:
 *           type: string
 *           description: ID of the assessment form associated with the metric
 *         questionId:
 *           type: string
 *           description: ID of the question associated with the metric
 *         sectionId:
 *           type: string
 *           description: ID of the section associated with the metric
 *         createdDate:
 *           type: string
 *           format: date-time
 *           description: Date of creation
 *         updatedDate:
 *           type: string
 *           format: date-time
 *           description: Date of last update
 *         active:
 *           type: boolean
 *           description: Indicates if the metric is active
 */
