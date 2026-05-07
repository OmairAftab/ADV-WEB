import ListingModel from "../Models/listingModel.js"
import mongoose from "mongoose"
import connectDB from '../db.js';




export const createListing= async(req,res)=>{
    try{

        await connectDB();   

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
        await connectDB();    

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

    await connectDB();    

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

    await connectDB();    

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











export const getListings = async (req, res) => {

    await connectDB();

    try {

        const listings = await ListingModel.find()
            .sort({ createdAt: -1 });

        return res.status(200).json(listings);
        
    } catch (err) {

        return res.status(500).json({
            success: false,
            message: err.message || 'Failed to fetch listings'
        });
    }
}