import jwt  from "jsonwebtoken";


export const verifyTheToken= (req,res,next)=>{

    const token = req.cookies?.token;

    if(!token) return res.status(401).json("You aren't verified")


    //agar idhar aa gya mean token hai
    jwt.verify(token, process.env.JWT_SECRET, (err,user)=>{
        if(err) return res.status(401).json("You aren't verified") 

        
        //will reach here if everything is ok mean user is verified
        req.user=user;
        next();
    })  
}