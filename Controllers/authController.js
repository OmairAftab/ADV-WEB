import UserModel from "../Models/userModel.js";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import connectDB from '../db.js';



// FUNCTION FOR SIGNUP
export const signup= async (req,res)=>{

    await connectDB();   //This is exactly what is needed for Vercel (serverless)

    const {username,email,password} =req.body;

    if(!username || !email || !password){
        return res.status(400).json("Name , email and password are required")
    }

    try{

    //check if user already exist
    const existinguser=await UserModel.findOne({email});
    if(existinguser){
        return res.status(409).json({success: false, message: "User already exists"})
    }

    // hash the password
    const hashedpassword= await bcrypt.hash(password, 5); //await zrur lgana yahan wrna error aaye ga :   "message": "user validation failed: password: Cast to string failed for value \"Promise { <pending> }\" (type Promise) at path \"password\""


    //create new user and save it
    const newUser=new UserModel({username, email, password : hashedpassword})
    await newUser.save();


    return res.status(200).json({success: true, message: "User Registered successfully"})

    }
    catch(err){
        res.status(400).json({success: false, message: err.message || "An error occurred"})
    }
}










//FUNCTIOn FOR signin OF USERS
export const signin= async (req,res)=>{

    await connectDB();    //This is exactly what is needed for Vercel (serverless)

    const {email,password}=req.body;

    if(!email || !password){
        return res.status(400).json({success: false, message: "Both email and password are required"});
    }


    try{

        const user =await UserModel.findOne({email});

        if(!user){
            return res.status(404).json({success: false, message: "Invalid email. User doesn't exist"});
        }

        const isMatch=await bcrypt.compare(password, user.password);

        if(!isMatch){
            return res.status(400).json({success: false, message: "Invalid password"})
        }


        //yahan agar  pohancha mean user exist and password is correct and now we will generate token and using it user will be authenticated and logged in website
        const token=jwt.sign({id: user._id} , process.env.JWT_SECRET , {expiresIn: '7d'}) ///user.id jo bnti hai db main like ._id
        

        //now we have to send this token to user in res and  we will send bby cookie
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days in milliseconds
        });

        
    //    Updated authController.js so /api/auth/signin returns user data (without password), enabling avatar display for normal sign-in too.
        const { password: userPassword, ...userData } = user._doc;
        return res.status(200).json({ success: true, message: "User logged in successfully", user: userData });



    }catch(err){
        return res.status(500).json({ success: false, message: err.message || 'An error occurred' })
       
    }

}










export const googleController = async(req,res)=>{
    try{

        await connectDB();    //This is exactly what is needed for Vercel (serverless)

        const { name, email, photo } = req.body;

        if (!email || !name) {
            return res.status(400).json({ success: false, message: 'Name and email are required' });
        }

        const user = await UserModel.findOne({ email });

//mean if it already exist we need to signin him
        if(user){
            const token=jwt.sign({id: user._id},process.env.JWT_SECRET);

            //now we have to send this token to user in res and  we will send bby cookie
            res.cookie('token', token, {
               httpOnly: true,
               secure: process.env.NODE_ENV === 'production',
               sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
               maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days in milliseconds
        });

                const { password: userPassword, ...userData } = user._doc;
                return res.status(200).json({ success: true, message: 'Google sign-in successful', user: userData });

        }
        else{ //mean user nhi exist krta bna k save krna pre ga

         

//genearte a random password for initially saving user
            const generatedPassword=Math.random().toString(36).slice(-8);
            const hashedpassword=await bcrypt.hash(generatedPassword,5);
            const newUser=new UserModel({username: name.split(" ").join("").toLowerCase(), email , password: hashedpassword, avatar: photo})  //q k req.body.name se jo hum display name le rhe the wo kuch aesa aa rha tha jese mera M. Omair Aftab  to bs us ko hi username k liye modify kiya ab aese aaye ga momairaftab
            await newUser.save();

            const token=jwt.sign({id: newUser._id},process.env.JWT_SECRET);
            res.cookie('token', token, {
               httpOnly: true,
               secure: process.env.NODE_ENV === 'production',
               sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
               maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days in milliseconds
        });

            const { password: userPassword, ...userData } = newUser._doc;
            return res.status(200).json({ success: true, message: 'Google account created successfully', user: userData });
            
        }
    }
    catch(err){
        return res.status(500).json({ success: false, message: err.message || 'Internal server error' });
    }
}
















export const signout= async(req,res)=>{
    try{
        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
        });

        return res.status(200).json({ success: true, message: 'User signed out successfully' })

    }
    catch(err){
        return res.status(500).json({ success: false, message: err.message || 'Failed to sign out' })
    }
}