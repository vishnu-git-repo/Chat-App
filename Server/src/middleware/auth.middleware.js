import jwt from "jsonwebtoken";
import User from "../models/user.model.js";


export const protectedRoute = async (req, res, next) => {
    try{
        const token = req.cookies.token;
        if(!token){
            return res.status(401).json({message : "Unauthorized : Token not provided"});
        }
        
        const decodeToken = jwt.verify(token,process.env.JWT_SECRET);
        if(!decodeToken){
            return res.status(401).json({message : "Unauthorized : Token not verified"});
        }
        
        const user =await User.findById(decodeToken.userId).select("-password");
        if(!user){
            return res.status(404).json({message : "User not found"});
        }
       
        req.user = user;
        next();

    }
    catch(error){
        console.log("error in Protected Route",error.message);
        return res.status(400).json({message : error.message});
    }
}


