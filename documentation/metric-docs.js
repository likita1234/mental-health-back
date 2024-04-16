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
 */

/**
 * @swagger
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
