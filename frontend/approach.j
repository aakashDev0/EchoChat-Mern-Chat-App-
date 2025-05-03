mkdir e:\Mern-Chat_Application-main\Mern-Chat_Application-main\backend\uploads

cd e:\Mern-Chat_Application-main\Mern-Chat_Application-main\backend
npm install multer

import mongoose from "mongoose";

const messageModel = new mongoose.Schema({
    senderId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    receiverId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    message:{
        type:String,
        required:true
    },
    file: {
        filename: String,
        path: String,
        originalname: String,
        mimetype: String
    }
}, {timestamps:true});

export const Message = mongoose.model("Message", messageModel);


import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const fileUpload = multer({ 
    storage: storage,
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB limit
    }
});

export default fileUpload;



// Add file handling to sendMessage controller
export const sendMessage = async (req, res) => {
    try {
        const { message } = req.body;
        const { id: receiverId } = req.params;
        const senderId = req.user._id;

        let newMessage = {
            senderId,
            receiverId,
            message
        };

        // Handle file if present
        if (req.file) {
            newMessage.file = {
                filename: req.file.filename,
                path: req.file.path,
                originalname: req.file.originalname,
                mimetype: req.file.mimetype
            };
        }

        const message = await Message.create(newMessage);
        
        // Update conversation
        await Conversation.findOneAndUpdate(
            {
                participants: { $all: [senderId, receiverId] }
            },
            {
                $push: { messages: message._id },
            }
        );

        // Socket.io implementation
        const receiverSocketId = getRecieverSocketId(receiverId);
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("newMessage", message);
        }

        res.status(201).json({ newMessage: message });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal server error" });
    }
};

import fileUpload from '../middleware/fileUpload.js';

router.post("/send/:id", isAuthenticated, fileUpload.single('file'), sendMessage);



import React, { useState } from 'react';
import { IoSendOutline } from "react-icons/io5";
import { IoAttach } from "react-icons/io5";
import axios from "axios";
import { useDispatch, useSelector } from 'react-redux';
import { setMessages } from '../redux/messagesSlice.jsx';

const SendInput = () => {
    const [message, setMessage] = useState("");
    const [file, setFile] = useState(null);
    const dispatch = useDispatch();
    const { selectedUser } = useSelector(store => store.user);
    const { messages } = useSelector(store => store.message);

    const onSubmitHandler = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            formData.append('message', message);
            if (file) {
                formData.append('file', file);
            }

            const res = await axios.post(
                `http://localhost:8080/api/v1/message/send/${selectedUser._id}`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    },
                    withCredentials: true
                }
            );

            dispatch(setMessages([...messages, res.data.newMessage]));
            setMessage("");
            setFile(null);
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <form onSubmit={onSubmitHandler} className='px-4 my-3'>
            <div className='w-full relative flex items-center'>
                <input
                    type="file"
                    id="file"
                    className="hidden"
                    onChange={(e) => setFile(e.target.files[0])}
                />
                <label htmlFor="file" className='cursor-pointer text-white mr-2'>
                    <IoAttach size={20} />
                </label>
                <input
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    type="text"
                    placeholder='Send a message...'
                    className='border text-sm rounded-lg block w-full p-3 border-zinc-500 text-white bg-gray-500'
                />
                <button type="submit" className='absolute flex inset-y-0 end-0 items-center pr-4 text-white'>
                    <IoSendOutline />
                </button>
            </div>
            {file && (
                <div className='text-sm text-white mt-1'>
                    Selected file: {file.name}
                </div>
            )}
        </form>
    );
};

export default SendInput;


import React, { useEffect, useRef } from 'react';
import { useSelector } from "react-redux";

const Message = ({ message }) => {
    const scroll = useRef();
    const { authUser, selectedUser } = useSelector(store => store.user);

    useEffect(() => {
        scroll.current?.scrollIntoView({ behavior: "smooth" });
    }, [message]);

    const renderFileContent = () => {
        if (!message.file) return null;

        const { mimetype, filename } = message.file;
        const fileUrl = `http://localhost:8080/uploads/${filename}`;

        if (mimetype.startsWith('image/')) {
            return <img src={fileUrl} alt="shared" className="max-w-[200px] rounded-md" />;
        } else {
            return (
                <a href={fileUrl} target="_blank" rel="noopener noreferrer" 
                   className="text-blue-400 underline">
                    Download File
                </a>
            );
        }
    };

    return (
        <div ref={scroll} className={`chat ${message?.senderId === authUser?._id ? 'chat-end' : 'chat-start'}`}>
            <div className="chat-image avatar">
                <div className="w-10 rounded-full">
                    <img alt="User avatar" src={message?.senderId === authUser?._id ? authUser?.profilePhoto : selectedUser?.profilePhoto} />
                </div>
            </div>
            <div className="chat-header">
                <time className="text-xs opacity-50 text-white">12:45</time>
            </div>
            <div className={`chat-bubble ${message?.senderId !== authUser?._id ? 'bg-gray-200 text-black' : ''}`}>
                {message.message}
                {renderFileContent()}
            </div>
        </div>
    );
};

export default Message;
