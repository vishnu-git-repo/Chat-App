import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);


const io = new Server(server, {
    cors: {
        origin : [process.env.CLIENT_URI],
    },
});

  
const userSocketMap = {};

export const getReceiverSocketId = (userId) => {
    return userSocketMap[userId]?.socketId || null;
}
  
io.on("connection", (socket) => {
    const {userId, email} = socket.handshake.query;
    if (userId) userSocketMap[userId] = {socketId : socket.id, email};
    if(email) {
        console.log("connected => ",email);
    }

    // io.emit() is used to send events to all the connected clients
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  
    socket.on("disconnect", () => {
      if(email) console.log("Disconnected => ", email);
      delete userSocketMap[userId];
      io.emit("getOnlineUsers", Object.keys(userSocketMap));
    });
});
  
export { io, app, server };