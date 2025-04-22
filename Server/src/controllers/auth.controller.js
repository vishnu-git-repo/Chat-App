import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../lib/utils.js";
import cloudinary from "../lib/cloudinary.js";


export const signup = async (req, res) => {
    try{
        const { name, email, password } = req.body || {};
        if(!name || !password || !email){
            return res.status(400).json({message : "Please fill all the fields"});
        }

        const existingUser = await User.findOne({email});
        if(existingUser){
            return res.status(400).json({message : "User already exists"});
        }

        const hashedPassword = await bcrypt.hash(password, await bcrypt.genSalt(10));
        const newUser = new User({
            name,
            email,
            password : hashedPassword,
        })
        if(newUser){
            generateToken(newUser._id,res);
            await newUser.save();
            res.status(200).json(
                {
                    _id : newUser._id,
                    name : newUser.name,
                    email : newUser.email,
                    profilePic : newUser.profilePic,
                }
            );
        }
        else{
            return res.status(400).json({message : "Invalid User Credentials"});
        }

    }catch(error){
        console.log("error in Signup Auth Controller",error.message);
        return res.status(400).json({message : error.message});
    }
    

};

export const login = async (req, res) => {
    try{
        const { email, password } = req.body || {};
        if(!email || !password){
            return res.status(400).json({message : "Please fill all the fields"});
        }

        const existingUser = await User.findOne({email});
        if(!existingUser){
            return res.status(400).json({message : "User does not exist"});
        }

        const checkPassword = await bcrypt.compare(password, existingUser.password);
        if(!checkPassword){
            return res.status(400).json({message : "Invalid Password"});
        }
        generateToken(existingUser._id,res);
        return res.status(200).json(
            {
                _id : existingUser._id,
                name : existingUser.name,
                email : existingUser.email,
                profilePic : existingUser.profilePic,
            }
        );
    }
    catch(error){
        console.log("error in Login Auth Controller",error.message);
        return res.status(400).json({message : error.message});
    }
};

export const logout = (req, res) => {
    try{
        res.cookie("token", "", {maxAge : 0});
        return res.status(200).json({message : "success"});
    }
    catch(error){
        console.log("error in Logout Auth Controller",error.message);
        return res.status(400).json({message : error.message});
    }
};

export const updateProfile = async (req,res) => {
    try{
        const { profilePic } = req.body;
        const userId = req.user._id;
        
        if(!profilePic){
            return res.status(400).json({ message: "Profile pic is required" })
        }

        const response = await cloudinary.uploader.upload(profilePic);
        const updateUser = await User.findByIdAndUpdate(
            userId, 
            {profilePic: response.secure_url},
            { new: true }
        )
        res.status(200).json(updateUser)

    }catch(error){ 
        console.log("error in UpdateProfile Auth Controller",error.message);
        res.status(500).json({message:error.message});
    }
};

export const checkAuth = (req, res) => {
    try {
        res.status(200).json(req.user);
    } catch (error) {
        console.log("Error in checkAuth controller", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};