import mongoose from "mongoose";

const Schema = new mongoose.Schema(
    {
        email :{
            type : String,
            required : true,
            unique : true,
        },
        name : {
            type : String,
            required : true,    
        },
        password : {
            type : String,
            required : true,
        },
        profilePic : {
            type : String,
            // default : "https://iconarchive.com/download/i108230/Flat-Icons/User-Profile-2.ico",
            default :""
        }
    },
    { 
        timestamps : true 
    }
);

const User = mongoose.model("User", Schema);
export default User;