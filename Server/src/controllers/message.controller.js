import cloudinary from "../lib/cloudinary.js";
import Message from "../models/message.model.js";
import User from "../models/user.model.js";
import { getReceiverSocketId, io } from "../lib/socket.js";



export const getAllUsers = async (req,res) => {
    try{
        const currentUserId = req.user._id;
        const filteredUsers = await User.find( { _id : { $ne : currentUserId }}).select("-password");
        res.status(200).json(filteredUsers);
    }catch(error){
        console.log("Error in getUsersForSidebar :\n",error.message);
        res.status(500).json({error :"Internal server error"});
    }
}

export const getRecentUsers = async (req,res) => {
    try{
        const currentUserId = req.user._id;
        const filteredUsers = await User.find( { _id : currentUserId })
            .select("recentUsers")
            .populate("recentUsers","-password");
        res.status(200).json(filteredUsers[0].recentUsers);
    } catch (error) {
        console.log("Error in getRecentUsers :\n",error.message);
        res.status(500).json({error :"Internal server error"});
    }
}

export const setRecentUsers = async (req,res) => {
    try{
        const currentUserId = req.user._id;
        const { recentUsers } = req.body; 
        console.log(recentUsers);
        console.log(typeof(recentUsers));

        const users = await User.findByIdAndUpdate(
            currentUserId, 
            {recentUsers: recentUsers}
        );
        // console.log(users);
        res.status(200).json(users);
    } catch (error) {
        console.log("Error in setRecentUsers :\n",error.message);
        res.status(500).json({error :"Internal server error"});
    }
}

export const getMessages = async (req,res) => {
    try{
        const {id : _receiverId} = req.params;
        const _senderId = req.user._id;

        const messages = await Message.find({
            $or: [
                {
                    senderId: _senderId, 
                    receiverId: _receiverId,
                },
                {
                    senderId: _receiverId,
                    receiverId : _senderId,
                }
            ]
        })
        res.status(200).json(messages);
    }catch(error){
        console.log("Error in getMessages message controller : \n",error.message)
        res.status(500).json({ error: "Internal Server Error"})
    }

}

export const sendMessage = async (req,res) => {
    try{
        const {id: receiverId} = req.params;
        const {text,image} = req.body;
        const senderId = req.user._id;

        let imageUrl;
        if (image) {
            const response = await cloudinary.uploader.upload(image);
            imageUrl = response.secure_url;
        }

        const newMessage = new Message({
            senderId,
            receiverId,
            text,
            image : imageUrl,
        })
 
        await newMessage.save();

        const receiverSocketId = getReceiverSocketId(receiverId);
        if(receiverSocketId){
            io.to(receiverSocketId).emit("newMessage", newMessage);
        }

        res.status(200).json(newMessage);

    }catch(error){
        console.log("Error in sendMessage message controller : \n",error.message)
        res.status(500).json({error: "Internal server error"})
    }
}