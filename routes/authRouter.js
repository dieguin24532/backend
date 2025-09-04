import express from  'express';
import { getRoleLoginUser, isAuth, login, logout } from '../controllers/authController.js';

const router = express.Router();

router.post('/login', login);
router.get('/logout', logout);
router.get('/isauth', isAuth);
router.get('/rol', getRoleLoginUser);

export default router;