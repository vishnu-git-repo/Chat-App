import cloudinary from "../lib/cloudinary.js";
import Message from "../models/message.model.js";
import User from "../models/user.model.js";
import { getReceiverSocketId, io } from "../lib/socket.js";



export const getUsersForSidebar = async (req,res) => {
    try{
        const currentUserId = req.user._id;
        const filteredUsers = await User.find().select("-password");
        res.status(200).json(filteredUsers)
    }catch(error){
        console.log("Error in getUsersForSidebar :\n",error.message);
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