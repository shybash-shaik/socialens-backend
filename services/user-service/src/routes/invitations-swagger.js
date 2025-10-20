/**
 * @swagger
 * tags:
 *   name: Invitations
 *   description: User invitation management endpoints
 */

/**
 * @swagger
 * /api/invitations:
 *   post:
 *     summary: Create user invitation
 *     description: Create an invitation for a new user (super_admin can invite client_admin, client_admin can invite client_user)
 *     tags: [Invitations]
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateInvitationRequest'
 *     responses:
 *       201:
 *         description: Invitation created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   format: uuid
 *                   description: Invitation ID
 *                 token:
 *                   type: string
 *                   description: Invitation token
 *                 expiresAt:
 *                   type: string
 *                   format: date-time
 *                   description: Expiration date
 *       400:
 *         description: Invalid role target
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Insufficient permissions
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /api/invitations/{token}:
 *   get:
 *     summary: Get invitation details
 *     description: Retrieve invitation information using token (public endpoint)
 *     tags: [Invitations]
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *         description: Invitation token
 *     responses:
 *       200:
 *         description: Invitation details retrieved
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Invitation'
 *       404:
 *         description: Invitation not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       410:
 *         description: Invitation expired
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       409:
 *         description: Invitation already accepted
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /api/invitations/accept:
 *   post:
 *     summary: Accept invitation
 *     description: Accept user invitation and create account (public endpoint)
 *     tags: [Invitations]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AcceptInvitationRequest'
 *     responses:
 *       200:
 *         description: Invitation accepted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 userId:
 *                   type: string
 *                   format: uuid
 *                   description: Created user ID
 *       400:
 *         description: Invalid request or invitation expired
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
