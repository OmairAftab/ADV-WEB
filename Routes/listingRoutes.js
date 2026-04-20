import express from "express";
import { createListing , deleteListing, getListing, getListings, UpdateListing} from "../Controllers/listingController.js";
import { verifyTheToken } from "../MiddleWare/VerificationMW.js";


const router=express.Router();


router.post('/create', verifyTheToken, createListing)


 
//listing delete krne k liye jo show listings krne pe show hoti hai
router.delete('/delete/:id', verifyTheToken, deleteListing)



//USED IN fetchListing FUNCTION OF UPDATELISTING.JSX
router.get('/get/:id', getListing)



router.post('/update/:id', verifyTheToken, UpdateListing)


router.get('/get',getListings)

export default router;