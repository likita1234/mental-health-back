/**
 * @swagger
 * tags:
 *   - name: Sections
 *     description:
 *
 * /api/v1/section:
 *   post:
 *     summary: Add a new section
 *     tags:
 *       - Sections
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: Section details
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             name: "Sample Name"
 *             title: "Sample Section"
 *             description: "This is a sample section"
 *             questions: []
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             example:
 *               status: success
 *               data:
 *                 section: {}
 *
 *
 *
 */
