import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import bodyParser from "body-parser";
import path from "path";

import { connectDB } from "./lib/db.js";
import authRouter from "./routes/auth.route.js";
import messageRouter from "./routes/message.route.js";
import { app, server} from "./lib/socket.js";


dotenv.config();

const PORT = process.env.PORT;
const __dirname = path.resolve();

app.use(cookieParser());
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
app.use(express.json());
app.use(cors({
    origin : process.env.CLIENT_URI,
    credentials : true,
    optionSuccessStatus:200,
}))
app.use("/api/auth",authRouter);
app.use("/api/message",messageRouter)


if(process.env.NODE_ENV === "production"){
    app.use(express.static(path.join(__dirname,"../Client/dist")));
    app.get("*",(req,res)=>{
        res.sendFile(path.join(__dirname,"..","Client","dist","index.html"));
    })
}   

server.listen(PORT,()=>{
    console.log("Server is running on port: " + PORT);
    connectDB();
})