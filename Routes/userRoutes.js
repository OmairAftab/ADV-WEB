import express from "express";
import { deleteUserController, updateUserController } from "../Controllers/userController.js";
import { verifyTheToken } from "../MiddleWare/VerificationMW.js";
import { getUserListings, getUser } from '../Controllers/userController.js';

const router = express.Router();

router.get('/test', (req, res) => {
    res.send("MIKE CHCEK")
})

router.post('/update/:id', verifyTheToken, updateUserController)
router.post('/delete/:id', verifyTheToken, deleteUserController)
router.get('/listings/:id', verifyTheToken, getUserListings)
router.get('/:id', getUser)

export default router;