import { Conversation } from "../models/conversationModel.js";
import { Message } from "../models/messageModel.js";
import { getRecieverSocketId, io } from "../socket/socket.js";
 // Add these imports at the top
 import path from 'path';
 import { fileURLToPath } from 'url';
export const sendMessage = async (req, res) => {
    try {
        const senderId = req.id;
        const receiverId = req.params.id;
        const { message } = req.body;

        // Allow empty message if a file is attached
        if (!message && !req.file) {
            return res.status(400).json({ error: "Message content or file is required" });
        }

        let conversation = await Conversation.findOne({
            participants: { $all: [senderId, receiverId] },
        });

        if (!conversation) {
            conversation = await Conversation.create({
                participants: [senderId, receiverId],
                messages: []
            });
        }

        // Create message object
        let newMessageData = {
            senderId,
            receiverId,
            message: message || "" // Use empty string if no message
        };

       
        
        // Get the directory name
        const __filename = fileURLToPath(import.meta.url);
        const __dirname = path.dirname(__filename);
        
        // Then in the sendMessage function, update the file handling part:
        // Add file data if present
        if (req.file) {
            // Store only the filename in the database, not the full path
            newMessageData.file = {
                filename: req.file.filename,
                path: req.file.path.replace(/\\/g, '/'), // Normalize path for both Windows and Unix
                originalname: req.file.originalname,
                mimetype: req.file.mimetype
            };
        }

        const newMessage = await Message.create(newMessageData);

        if (newMessage) {
            conversation.messages.push(newMessage._id);
            await conversation.save();
        }

        const populatedMessage = await Message.findById(newMessage._id)
            .populate("senderId", "fullName profilePhoto")
            .populate("receiverId", "fullName profilePhoto");

        const receiverSocketId = getRecieverSocketId(receiverId);
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("newMessage", populatedMessage);
        }

        return res.status(201).json({
            success: true,
            newMessage: populatedMessage
        });

    } catch (error) {
        console.error("Error in sendMessage:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
}

// export const getMessage = async (req,res) => {
//     try {
//         const receiverId = req.params.id;
//         const senderId = req.id;
//         // Current getMessage implementation only populates senderId
//         const conversation = await Conversation.findOne({
//             participants: { $all: [senderId, receiverId] }
//         }).populate({
//             path: "messages",
//             populate: {
//                 path: "senderId",
//                 select: "fullName profilePhoto _id"
//             }
//         });
        
//         return res.status(200).json(conversation?.messages || []);
//     } catch (error) {
//         console.log(error);
//         return res.status(500).json({ error: "Failed to fetch messages" });
//     }
// }

export const getMessage = async (req,res) => {
    try {
        const receiverId = req.params.id;
        const senderId = req.id;
        // Current getMessage implementation only populates senderId
        const conversation = await Conversation.findOne({
            participants: { $all: [senderId, receiverId] }
        }).populate({
            path: "messages",
            populate: {
                path: "senderId",
                select: "fullName profilePhoto _id"
            }
        });
        
        return res.status(200).json(conversation?.messages || []);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Failed to fetch messages" });
    }
}

// Add this new controller function at the end of the file
export const deleteMessage = async (req, res) => {
    try {
        const messageId = req.params.messageId;
        const userId = req.id; // The authenticated user's ID

        // Find the message
        const message = await Message.findById(messageId);
        
        if (!message) {
            return res.status(404).json({ error: "Message not found" });
        }

        // Check if the user is authorized to delete this message
        if (message.senderId.toString() !== userId) {
            return res.status(403).json({ error: "Not authorized to delete this message" });
        }

        // Find the conversation containing this message
        const conversation = await Conversation.findOne({ messages: messageId });
        
        if (conversation) {
            // Remove the message from the conversation
            conversation.messages = conversation.messages.filter(
                (id) => id.toString() !== messageId
            );
            await conversation.save();
        }

        // Delete the message
        await Message.findByIdAndDelete(messageId);

        // Notify other users about the deletion via socket
        const receiverSocketId = getRecieverSocketId(message.receiverId);
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("messageDeleted", messageId);
        }

        return res.status(200).json({ success: true, message: "Message deleted successfully" });
    } catch (error) {
        console.error("Error in deleteMessage:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};
