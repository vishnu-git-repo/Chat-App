import mongoose from "mongoose";

export const connectDB = async ()=>{
    try{
        const conn = await mongoose.connect(process.env.DB_URI);
        console.log("Connected to MongoDB : " + conn.connection.host);
    }
    catch(error){
        console.error("Error connecting to MongoDB:", error);
    }
}



