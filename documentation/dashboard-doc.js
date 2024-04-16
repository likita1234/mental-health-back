/**
 * @swagger
 * /api/v1/dashboard:
 *   get:
 *     summary: Get All Dashboards
 *     description: Retrieve all dashboards.
 *     tags:
 *       - Dashboard
 *     security:
 *       - bearerAuth: []  # Specify that this endpoint requires authentication
 *     responses:
 *       '200':
 *         description: Dashboards retrieved successfully.
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
 *                     dashboards:
 *                       type: array
 *                       description: List of dashboards.
 *                       items:
 *                         $ref: '#/components/schemas/Dashboard'
 *                     total:
 *                       type: number
 *                       description: Total number of dashboards.
 *       '401':
 *         description: Unauthorized, authentication token not provided.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *   post:
 *     summary: Create Dashboard
 *     description: Create a new dashboard.
 *     tags:
 *       - Dashboard
 *     security:
 *       - bearerAuth: []  # Specify that this endpoint requires authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/DashboardRequest'
 *     responses:
 *       '201':
 *         description: Dashboard created successfully.
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
 *                     dashboard:
 *                       $ref: '#/components/schemas/Dashboard'
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
/**
 * @swagger
 * components:
 *   schemas:
 *     DashboardRequest:
 *       type: object
 *       properties:
 *         title:
 *           type: string
 *           description: The title of the dashboard.
 *         description:
 *           type: string
 *           description: The description of the dashboard.
 *         metrics:
 *           type: array
 *           description: Array of metrics associated with the dashboard.
 *           items:
 *             type: object
 *             properties:
 *               metricId:
 *                 type: string
 *                 description: The ID of the metric.
 *               weight:
 *                 type: number
 *                 description: The weight of the metric.
 *     Dashboard:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: The ID of the dashboard.
 *         title:
 *           type: string
 *           description: The title of the dashboard.
 *         description:
 *           type: string
 *           description: The description of the dashboard.
 *         metrics:
 *           type: array
 *           description: Array of metrics associated with the dashboard.
 *           items:
 *             type: object
 *             properties:
 *               _id:
 *                 type: string
 *                 description: The ID of the metric.
 *               metricId:
 *                 type: string
 *                 description: The ID of the metric.
 *               weight:
 *                 type: number
 *                 description: The weight of the metric.
 *         active:
 *           type: boolean
 *           description: Indicates whether the dashboard is active or not.
 *         createdDate:
 *           type: string
 *           format: date-time
 *           description: The date and time when the dashboard was created.
 *         updatedDate:
 *           type: string
 *           format: date-time
 *           description: The date and time when the dashboard was last updated.
 *
 *
 * /api/v1/dashboard/{dashboardId}:
 *   get:
 *     summary: Get Dashboard Details
 *     description: Retrieve details of a specific dashboard.
 *     tags:
 *       - Dashboard
 *     parameters:
 *       - in: path
 *         name: dashboardId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the dashboard.
 *     security:
 *       - bearerAuth: []  # Specify that this endpoint requires authentication
 *     responses:
 *       '200':
 *         description: Dashboard details retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Dashboard'
 *       '400':
 *         description: Bad request, invalid dashboard ID.
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
 *   patch:
 *     summary: Update Dashboard Details
 *     description: Update details of a specific dashboard.
 *     tags:
 *       - Dashboard
 *     parameters:
 *       - in: path
 *         name: dashboardId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the dashboard.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/DashboardRequest'
 *     security:
 *       - bearerAuth: []  # Specify that this endpoint requires authentication
 *     responses:
 *       '200':
 *         description: Dashboard details updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Dashboard'
 *       '400':
 *         description: Bad request, invalid dashboard ID or request body.
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
