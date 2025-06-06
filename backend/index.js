import express from "express"; 
import dotenv from "dotenv";
import connectDB from "./config/database.js";
import userRoute from "./routes/userRoute.js";
import messageRoute from "./routes/messageRoute.js"
import cookieParser from "cookie-parser";
import cors from "cors"
import { app, server } from "./socket/socket.js";
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

// Add this near the top of your file
const PORT = process.env.PORT || 8080;
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';

// CORS configuration - Keep only this one
const corsOption = {
  origin: CLIENT_URL,
  credentials: true
};

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(cors(corsOption));

// Serve static files from uploads directory with absolute path
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use("/api/v1/user", userRoute);
app.use("/api/v1/message", messageRoute);

// Connect to database
connectDB();

// Start only the Socket.IO server (which includes the Express app)
server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});

// Add this after your other middleware
// app.use('/uploads', express.static('uploads'));
// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Second conflicting configuration (line 49)
// app.use('/uploads', express.static('uploads'));
