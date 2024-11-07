import { Router } from 'express';
import { loginAuth, signupAuth } from '../controller/userAuth';

const router = Router();

router.post('/signup', signupAuth);
router.post('/login', loginAuth);

export default router;