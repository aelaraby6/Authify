/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication and user management
 */

/**
 * @swagger
 * /api/auth/signup:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SignUp'
 *     responses:
 *       201:
 *         description: User created successfully
 *       400:
 *         description: Validation error
 */

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login with email and password
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Login'
 *     responses:
 *       200:
 *         description: Logged in successfully
 *       401:
 *         description: Invalid credentials
 */

/**
 * @swagger
 * /api/auth/status:
 *   get:
 *     summary: Check authentication status
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Returns current user session status
 */

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: Logout the current user
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Successfully logged out
 */

/**
 * @swagger
 * /api/auth/forgot-password:
 *   post:
 *     summary: Request password reset OTP
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: OTP sent successfully
 */

/**
 * @swagger
 * /api/auth/verify-reset-otp:
 *   post:
 *     summary: Verify the OTP code for password reset
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: OTP verified successfully
 *       400:
 *         description: Invalid or expired OTP
 */

/**
 * @swagger
 * /api/auth/reset-password:
 *   post:
 *     summary: Reset password using OTP
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Password reset successful
 */

/**
 * @swagger
 * /api/auth/update-password:
 *   post:
 *     summary: Update password (requires authentication)
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Password updated successfully
 */

/**
 * @swagger
 * /api/auth/2FA/setup:
 *   post:
 *     summary: Setup two-factor authentication
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: 2FA setup complete
 */

/**
 * @swagger
 * /api/auth/2FA/verify:
 *   post:
 *     summary: Verify two-factor authentication token
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: 2FA verified successfully
 *       400:
 *         description: Invalid token
 */

/**
 * @swagger
 * /api/auth/2FA/reset:
 *   post:
 *     summary: Reset 2FA configuration
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: 2FA reset successfully
 */

/**
 * @swagger
 * /api/auth/github:
 *   get:
 *     summary: Start GitHub OAuth authentication
 *     tags: [Auth]
 *     responses:
 *       302:
 *         description: Redirects to GitHub OAuth page
 */

/**
 * @swagger
 * /api/auth/github/revoke:
 *   post:
 *     summary: Revoke GitHub authorization and clear cookies
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: GitHub authorization revoked successfully
 */

/**
 * @swagger
 * /api/auth/github/callback:
 *   get:
 *     summary: GitHub OAuth callback
 *     tags: [Auth]
 *     responses:
 *       302:
 *         description: Redirects to dashboard with success token
 */

/**
 * @swagger
 * /api/auth/google:
 *   get:
 *     summary: Start Google OAuth authentication
 *     tags: [Auth]
 *     responses:
 *       302:
 *         description: Redirects to Google OAuth page
 */

/**
 * @swagger
 * /api/auth/google/callback:
 *   get:
 *     summary: Google OAuth callback
 *     tags: [Auth]
 *     responses:
 *       302:
 *         description: Redirects to dashboard with success token
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     SignUp:
 *       type: object
 *       required:
 *         - username
 *         - email
 *         - password
 *       properties:
 *         username:
 *           type: string
 *           example: johndoe
 *         email:
 *           type: string
 *           example: johndoe@email.com
 *         password:
 *           type: string
 *           example: MyStrongPassword123
 *     Login:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           example: johndoe@email.com
 *         password:
 *           type: string
 *           example: MyStrongPassword123
 */
