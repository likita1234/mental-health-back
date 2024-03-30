
/**
 * @swagger
 * tags:
 *   name: Users
 * 
 * /api/v1/user:
 *   get:
 *     summary: Get all users
 *     description: Retrieve a list of all users
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Successful response
 *         content:
 *           application/json:
 *             example:
 *               status: success
 *               totalRecords: 5
 *               data:
 *                 users:
 *                   - id: 1
 *                     name: John Doe
 *                   - id: 2
 *                     name: Jane Doe
 * 
 * /api/v1/user/update:
 *   patch:
 *     summary: Update user details
 *     description: Update details of the logged-in user
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               surname:
 *                 type: string
 *             required:
 *               - name
 *               - surname
 *     responses:
 *       '200':
 *         description: Successful update
 *         content:
 *           application/json:
 *             example:
 *               message: User details updated successfully
 *               user:
 *                 id: 1
 *                 name: John Doe
 * 
 * /api/v1/user/{userId}:
 *   delete:
 *     summary: Delete user
 *     description: Delete a user by ID (admin or superadmin only)
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *         description: ID of the user to delete
 *         schema:
 *           type: string
 *     responses:
 *       '204':
 *         description: User successfully deleted
 */