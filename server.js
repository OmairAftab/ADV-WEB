import express from "express";
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from "cors";
import cookieParser from 'cookie-parser';
dotenv.config();


// SEPARATE DB FILE BNANE KI BJAE YAHAN E CONNECTION KR DIYA
mongoose.connect(process.env.MONGODB_URL)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log("DB Error:", err);
  });





const app = express();
app.use(cors({credentials:true, origin: process.env.FRONTEND_URL || 'http://localhost:5173'}));

app.use(express.json()); //used when sending json data in raw in post and put methods in postman 
app.use(cookieParser());



app.get('/',(req,res)=>{
    res.send("Starting...")
})





// IMPORT USER ROUTES
import userRoutes from './Routes/userRoutes.js'
app.use('/api/user', userRoutes)



// IMPORT AUTHENTICATION ROUTES
import authRouter from './Routes/authRoutes.js'
app.use('/api/auth',authRouter)



// IMPORT LISTING ROUTES
import listingRouter from './Routes/listingRoutes.js'
app.use('/api/listing', listingRouter)




const port=process.env.PORT || 8000;

app.listen(port,()=>{console.log("Server Started")})
