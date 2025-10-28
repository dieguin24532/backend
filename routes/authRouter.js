import express from  'express';
import { getRoleLoginUser, isAuth, login, logout } from '../controllers/authController.js';

const router = express.Router();
/**
 * @swagger
 * tags:
 *  - name: Auth
 *    description: Operaciones de autenticación del usuario
 */


router.get('/logout', logout);
router.get('/isauth', isAuth);
router.get('/rol', getRoleLoginUser);

/**
 * @swagger
 * /auth/login:
 *  post:
 *    summary: Autenticación del usuario
 *    security:
 *      - cookieAuth: []
 *    tags: [Auth]
 *    requestBody:
 *      required: true
 *      content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *    responses:
 *      200:
 *        description: Realiza la autenticación del usuario
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                type: object
 *                properties:
 *                  email:
 *                    type: string
 *                  password:
 *                    type: string
 */
router.post('/login', login);

export default router;