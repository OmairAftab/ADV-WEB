import bcrypt from 'bcrypt'
import userModel from '../Models/userModel.js'
import ListingModel from '../Models/listingModel.js'
import connectDB from '../db.js';


export const updateUserController = async (req,res)=>{
// parameter main b id deni hai jo route bnaya hai beshak us main ja k dekh lo
    if(req.user.id!==req.params.id) return res.status(401).json("Unaunthentiacted")
    
        try{

            await connectDB();    //This is exactly what is needed for Vercel (serverless)

            const updatePayload = {
                username: req.body.username,
                email: req.body.email,
                avatar: req.body.avatar,
            }

            if(req.body.password){
                updatePayload.password = await bcrypt.hash(req.body.password,5)
            }

            const updateduser=await userModel.findByIdAndUpdate(req.params.id, {
                $set: updatePayload                                    //jo jo cheezen update hui hon gi un ko upadte kre ga

            },{new:true}) //new: true save new updateduser details
            

            if (!updateduser) {
                return res.status(404).json({ success: false, message: 'User not found' })
            }

            const { password, ...rest } = updateduser._doc
            return res.status(200).json({
                success: true,
                message: 'User updated successfully',
                user: rest,
            })
        }

       

        catch(err){
            return res.status(500).json({ success: false, message: err.message || 'Internal server error' })
        }
    
    }










export const deleteUserController= async (req,res)=>{

// req.user.id jo middleware use kiya hai "verifythetoken" routes main wahan se aarhi hai and req.params.id wo hogi jo /delete/___ yahan jo aaye gi jo test b ki hai postman pe
    if(req.user.id!==req.params.id) return res.status(401).json("Unaunthentiacted")

        await connectDB();    //This is exactly what is needed for Vercel (serverless)
        
    try{
        await userModel.findByIdAndDelete(req.params.id)
        res.status(200).json("User deleted successfuly")
    }
    catch(err){
        return res.status(500).json({ success: false, message: err.message || 'Internal server error' })

    }
}








export const getUserListings= async(req,res)=>{

    await connectDB();    //This is exactly what is needed for Vercel (serverless)

    if (!req.user?.id) {
        return res.status(401).json({ success: false, message: 'Unauthorized' })
    }

    if (req.user.id !== req.params.id) {
        return res.status(403).json({ success: false, message: 'Forbidden' })
    }

    try{
        const listings=await ListingModel.find({userRef: req.params.id})
        return res.status(200).json(listings)
    }
    catch(err){
        return res.status(500).json({ success: false, message: err.message || 'Failed to fetch listings' })
    }
}









export const getUser = async(req,res,next) =>{
  try {
    await connectDB();    //This is exactly what is needed for Vercel (serverless)

    const user = await userModel.findById(req.params.id)
  
    if(!user) return next(errorHandler(404,'User not found!'))
  
    const {password:pass,...rest} = user._doc;
    res.status(200).json(rest)
    
  } catch (error) {
    next(error);
  }
} 