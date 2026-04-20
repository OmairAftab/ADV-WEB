import ListingModel from "../Models/listingModel.js"
import mongoose from "mongoose"
import connectDB from '../db.js';




export const createListing= async(req,res)=>{
    try{

        await connectDB();    //This is exactly what is needed for Vercel (serverless)

        // if (!req.user?.id) {
        //     return res.status(401).json({ success: false, message: 'Unauthorized' })
        // }


        const listingPayload = {  //Spreads all form data from req.body..  overwrites/adds userRef with the authenticated user's ID
            ...req.body,
            userRef: req.user.id,
        }

        const listing=await ListingModel.create(listingPayload)
        return res.status(201).json(listing)
    }catch(err){
        const statusCode = err.name === 'ValidationError' ? 400 : 500
        return res.status(statusCode).json({ success: false, message: err.message || 'Failed to create listing' })
    }
}





export const deleteListing= async (req,res)=>{

  
    try{
        await connectDB();    //This is exactly what is needed for Vercel (serverless)

    const listing= await ListingModel.findById(req.params.id);

    if(!listing){
        return res.status(404).json("Listing doesnt exist")
    }


//check if user is owner of listing mean us ki apni hee listing hai na
    if(req.user.id !==listing.userRef){
        return res.status(400).json("You can delete your own listing")
    }



        await ListingModel.findByIdAndDelete(req.params.id)
        return res.status(200).json("Listing deleted")
    }
    catch(err){
        return res.status(500).json({ success: false, message: err.message });
    }
}











export const UpdateListing= async (req,res)=>{

    await connectDB();    //This is exactly what is needed for Vercel (serverless)

    const listing=await ListingModel.findById(req.params.id);

    if(!listing){
        return res.status(404).json("Listing doesnt exist")
    }


    try{
       const listingafterupdate= await ListingModel.findByIdAndUpdate(
            req.params.id,
            req.body,
            {new:true})  //new:true make sure nayi wali jae


        return res.status(200).json({
            success: true,
            message: "Listing updated successfully",
            listing: listingafterupdate,
        })
        
    }
    catch(err){

    }
}








export const getListing = async (req, res) => {

    await connectDB();    //This is exactly what is needed for Vercel (serverless)

    try {
        const listing = await ListingModel.findById(req.params.id)

        if (!listing) {
            return res.status(404).json({ success: false, message: "Listing doesnt exist" })
        }

        return res.status(200).json(listing)
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message || "Failed to fetch listing" })
    }
}










//8:28:00
export const getListings= async (req,res)=>{

    await connectDB();    //This is exactly what is needed for Vercel (serverless)

    try{
        // If MongoDB is offline, return an empty list so the homepage stays usable.
        if (mongoose.connection.readyState !== 1) {
            return res.status(200).json([])
        }

        const limit =parseInt(req.query.limit) || 9;
        const startIndex=parseInt(req.query.startIndex) || 0;

        let offer=req.query.offer;  //jo enable krta tha discount



        if(offer===undefined || offer==='false'){
            offer={$in :[false,true]}                  //If the user does not specify the offer filter, the query will show all products (offer true and offer false).
        } else {
            offer = true
        }


        let parking=req.query.parking;
        
        if(parking===undefined || parking==='false'){
            parking={$in :[false,true]}                  //If the user does not specify the offer filter, the query will show all products (offer true and offer false).
        } else {
            parking = true
        }


        let furnished=req.query.furnished;

        if(furnished===undefined || furnished==='false'){
            furnished={$in :[false,true]}
        } else {
            furnished = true
        }


        let type=req.query.type;
        
        if(type===undefined || type==='all'){
            type={$in :['sale','rent']}                  //If the user does not specify the offer filter, the query will show all products (offer true and offer false).
        }


        const searchTerm=req.query.searchTerm || ''; 
        const sort=req.query.sort || 'createdAt';
        const order=req.query.order || 'desc';


        const listings = await ListingModel.find({
            name: { $regex: searchTerm, $options: 'i' },     //MongoDB query to search text inside the name field. $regex means pattern search (like "contains"). if searchTerm = "phone" then It will match: iPhone, phone cover smartPhone.... 'i' means case-insensitive search. So capital or small letters don't matter.
            offer,
            furnished,
            parking,
            type,
        })
            .sort({ [sort]: order })
            .limit(limit)
            .skip(startIndex);

        return res.status(200).json(listings);

    }
    catch(err){
        const isDbConnectivityIssue =
            err?.name === 'MongooseServerSelectionError' ||
            err?.name === 'MongoNetworkError' ||
            err?.message?.includes('buffering timed out')

        if (isDbConnectivityIssue) {
            return res.status(200).json([])
        }

        return res.status(500).json({ success: false, message: err.message || 'Failed to fetch listings' })
    }
}