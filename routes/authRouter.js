import express from  'express';
import { isAuth, login, logout } from '../controllers/authController.js';

const router = express.Router();

router.post('/login', login);
router.get('/logout', logout);
router.get('/isauth', isAuth);

export default router;