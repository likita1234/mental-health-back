/**
 * @swagger
 * tags:
 *   - name: Sections
 *     description:
 *
 * /api/v1/section:
 *   get:
 *     summary: Get all existing sections
 *     tags:
 *       - Sections
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
 *                 sections: []
 */

/**
 * @swagger
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
 * /api/v1/section/{id}:
 *   get:
 *     summary: Get Section Details
 *     description: Retrieve details of a specific section by ID
 *     tags:
 *       - Sections
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Section Id
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Section details retrieved successfully
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
 *                   description: Section details
 *               example:
 *                 status: 'success'
 *                 data: {}
 *       '404':
 *         description: No section found with the provided ID
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *
 *   patch:
 *     summary: Update Section
 *     description: Update details of the section
 *     tags:
 *       - Sections
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the section to update
 *         schema:
 *           type: string
 *     requestBody:
 *       description: Section details
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *              name: "Section Name"
 *              title: "Section Title"
 *              description: "Section Description"
 *              questions: ["questionObjectId"]
 *     responses:
 *       '200':
 *         description: Successful update
 *         content:
 *           application/json:
 *             example:
 *               status: success
 *               data:
 *                name: "Section name"
 *                title: "Section title"
 *                description: "Section description"
 *                questions: []
 *
 *   delete:
 *     summary: Delete Section by ID
 *     description: Delete a specific section by ID
 *     tags:
 *       - Sections
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the Section to be deleted
 *         schema:
 *           type: string
 *     responses:
 *       '204':
 *         description: Section deleted successfully
 *       '404':
 *         description: No section found with the provided ID
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *
 */
