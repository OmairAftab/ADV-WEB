import mongoose from "mongoose";

const userSchema=new mongoose.Schema({
    username:{
        type:String,
        required:true,
        unique:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    avatar:{
// authcontroller.js main jo googleController function likha hai na us main user ki picture b leni hai na to bs us k liye ye kaam kia h
        type: String,
        default: "https://media.istockphoto.com/id/2171382633/vector/user-profile-icon-anonymous-person-symbol-blank-avatar-graphic-vector-illustration.jpg?s=612x612&w=0&k=20&c=ZwOF6NfOR0zhYC44xOX06ryIPAUhDvAajrPsaZ6v1-w="
    }

},{timestamps: true});
// by using timestamps: true Mongoose automatically adds two extra fields to your documents: createdAt AND updatedAt



//make model
const userModel=mongoose.model('user' ,userSchema);

export default userModel;