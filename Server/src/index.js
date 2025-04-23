import express from "express";
import dotenv from "dotenv";
dotenv.config();
import cookieParser from "cookie-parser";
import cors from "cors";
import bodyParser from "body-parser";

import { connectDB } from "./lib/db.js";
import authRouter from "./routes/auth.route.js";
import messageRouter from "./routes/message.route.js";
import { app, server} from "./lib/socket.js";


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

   
const PORT = process.env.PORT;
server.listen(PORT,()=>{
    console.log("Server is running on port: " + PORT);
    connectDB();
})