import mongoose from "mongoose";

const messageModel = new mongoose.Schema({
    senderId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    receiverId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    message:{
        type: String,
        required: false // Changed from true to false
    },
    file: {
        filename: String,
        path: String,
        originalname: String,
        mimetype: String
    }
}, {timestamps: true});

export const Message = mongoose.model("Message", messageModel);
