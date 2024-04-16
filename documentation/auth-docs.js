/**
 * @swagger
 * components:
 *  securitySchemes:
 *    bearerAuth:
 *      type: http
 *      scheme: bearer
 *
 * security:
 * - bearerAuth:[]
 */

/**
 * @swagger
 * /api/v1/auth/signup:
 *   post:
 *     summary: User SignUp
 *     description: This API is used for user sign up
 *     tags:
 *        - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SignUpRequest'
 *     responses:
 *       '201':
 *         description: User signup successful
 *       '400':
 *         description: Bad request, validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */ /**
 * @swagger
 * /api/v1/auth/login:
 *   post:
 *     summary: User Login
 *     description: This API is used for user login
 *     tags:
 *        - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             properties:
 *               username:
 *                 type: string
 *                 description: User's username
 *               password:
 *                 type: string
 *                 format: password
 *                 description: User's password
 *             required:
 *               - username
 *               - password
 *           example:
 *              username: 'testuser2'
 *              password: '123456789'
 *
 *     responses:
 *       '200':
 *         description: User login successful
 *       '400':
 *         description: Bad request, validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       '401':
 *         description: Invalid credentials
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

// /**
//  * @swagger
//  * /api/v1/auth/forgotPassword:
//  *   post:
//  *     summary: Forgot Password
//  *     description: Request to reset user's password
//  *     tags:
//  *        - Authentication
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             properties:
//  *               email:
//  *                 type: string
//  *                 format: email
//  *                 description: User's email
//  *             required:
//  *               - email
//  *     responses:
//  *       '200':
//  *         description: Password reset token sent to email
//  *       '404':
//  *         description: User not found with the provided email
//  *         content:
//  *           application/json:
//  *             schema:
//  *               $ref: '#/components/schemas/ErrorResponse'
//  *       '500':
//  *         description: Error sending email
//  *         content:
//  *           application/json:
//  *             schema:
//  *               $ref: '#/components/schemas/ErrorResponse'
//  */

// /**
//  * @swagger
//  * /api/v1/auth/updatePassword:
//  *   patch:
//  *     summary: Update Password
//  *     description: Update user's password after successful login
//  *     tags:
//  *        - Authentication
//  *     security:
//  *       - bearerAuth: []
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             properties:
//  *               currentPassword:
//  *                 type: string
//  *                 format: password
//  *                 description: Current password
//  *               newPassword:
//  *                 type: string
//  *                 format: password
//  *                 description: New password
//  *               confirmPassword:
//  *                 type: string
//  *                 format: password
//  *                 description: Confirm new password
//  *             required:
//  *               - currentPassword
//  *               - newPassword
//  *               - confirmPassword
//  *     responses:
//  *       '201':
//  *         description: Password update successful
//  *       '400':
//  *         description: Invalid current password or validation error
//  *         content:
//  *           application/json:
//  *             schema:
//  *               $ref: '#/components/schemas/ErrorResponse'
//  */

/**
 * @swagger
 * components:
 *   schemas:
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         status:
 *           type: string
 *           description: Error status
 *         message:
 *           type: string
 *           description: Error message
 *       example:
 *         status: 'error'
 *         message: 'Error message here'
 *
 *     SignUpRequest:
 *       type: object
 *       properties:
 *         username:
 *           type: string
 *           description: User's username
 *         email:
 *           type: string
 *           format: email
 *           description: User's email
 *         password:
 *           type: string
 *           format: password
 *           description: User's password
 *         confirmPassword:
 *           type: string
 *           format: password
 *           description: Confirm password
 *       example:
 *         username: JohnDoe123
 *         email: john.doe@example.com
 *         password: mypassword
 *         confirmPassword: mypassword
 */
