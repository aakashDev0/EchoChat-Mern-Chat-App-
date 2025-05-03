import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);
// Update the CORS configuration
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true
  }
});

const userSocketMap = new Map(); // Using Map for better performance

io.on("connection", (socket) => {
    console.log("a user connected", socket.id);

    const userId = socket.handshake.query.userId;
    if (userId) {
        userSocketMap.set(userId, socket.id);
        io.emit("getOnlineUsers", Array.from(userSocketMap.keys()));
    }

    socket.on("disconnect", () => {
        console.log("user disconnected", socket.id);
        for (const [key, value] of userSocketMap.entries()) {
            if (value === socket.id) {
                userSocketMap.delete(key);
            }
        }
        io.emit("getOnlineUsers", Array.from(userSocketMap.keys()));
    });
});

const getRecieverSocketId = (receiverId) => {
    return userSocketMap.get(receiverId);
};

export { app, io, server, getRecieverSocketId };
