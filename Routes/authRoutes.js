import express from 'express'
import { googleController, signin, signout, signup } from '../Controllers/authController.js';
import { verifyTheToken } from '../MiddleWare/VerificationMW.js';

const router=express.Router();

router.post('/signup',signup);
router.post('/signin', signin);

router.post('/google',googleController)

router.get('/signout',signout)


export default router