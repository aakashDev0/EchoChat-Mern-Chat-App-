import React, { useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from "react-redux";
// Import icons for different file types
import { FaFile, FaFilePdf, FaFileWord, FaFileExcel, FaFileImage, FaFileAudio, FaFileVideo } from "react-icons/fa";
import { BsThreeDotsVertical } from "react-icons/bs";
import { FaTrash } from "react-icons/fa";
import axios from "axios";
import { setMessages } from '../redux/messagesSlice.jsx';

const Message = ({message}) => {
    const scroll = useRef();
    const menuRef = useRef(null);
    const [showMenu, setShowMenu] = useState(false);
    const { authUser } = useSelector(store => store.user);
    const { messages } = useSelector(store => store.message);
    const dispatch = useDispatch();

    useEffect(() => {
        scroll.current?.scrollIntoView({behavior: "smooth"});
    }, [message]);

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setShowMenu(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);
  
    const isOwnMessage = message?.senderId?._id === authUser?._id;

    const getFileIcon = (mimetype) => {
        // Changed icon color to red by adding className="text-red-500"
        if (!mimetype) return <FaFile size={24} className="text-red-500" />;
        
        if (mimetype.startsWith('image/')) return <FaFileImage size={24} className="text-red-500" />;
        if (mimetype.startsWith('audio/')) return <FaFileAudio size={24} className="text-red-500" />;
        if (mimetype.startsWith('video/')) return <FaFileVideo size={24} className="text-red-500" />;
        if (mimetype.includes('pdf')) return <FaFilePdf size={24} className="text-red-500" />;
        if (mimetype.includes('word') || mimetype.includes('document')) return <FaFileWord size={24} className="text-red-500" />;
        if (mimetype.includes('excel') || mimetype.includes('spreadsheet')) return <FaFileExcel size={24} className="text-red-500" />;
        
        return <FaFile size={24} className="text-red-500" />;
    };

    const deleteMessage = async () => {
        try {
            await axios.delete(`http://localhost:8080/api/v1/message/delete/${message._id}`, {
                withCredentials: true
            });
            
            // Update messages in Redux store
            if (messages) {
                const updatedMessages = messages.filter(msg => msg._id !== message._id);
                dispatch(setMessages(updatedMessages));
            }
            
            setShowMenu(false);
        } catch (error) {
            console.error("Error deleting message:", error);
        }
    };

    const renderFileContent = () => {
        if (!message?.file) return null;

        const { mimetype, filename, originalname } = message.file;
        const fileUrl = `http://localhost:8080/uploads/${filename}`;

        if (mimetype?.startsWith('image/')) {
            return <img src={fileUrl} alt="shared" className="max-w-full md:max-w-[200px] rounded-md mt-2" />;
        } else {
            // Updated to match WhatsApp style with white background and better spacing
            return (
                <a href={fileUrl} target="_blank" rel="noopener noreferrer" 
                   className="flex items-center gap-2 md:gap-3 mt-2 p-2 md:p-3 bg-white rounded-md hover:bg-gray-100 transition-colors shadow-sm">
                    <div className="flex-shrink-0">
                        {getFileIcon(mimetype)}
                    </div>
                    <div className="flex flex-col flex-grow">
                        <span className="text-xs md:text-sm font-medium text-gray-800 truncate max-w-[120px] md:max-w-[150px]">{originalname}</span>
                        <span className="text-xs text-gray-500 uppercase">{mimetype?.split('/')[1] || 'FILE'}</span>
                    </div>
                </a>
            );
        }
    };
  
    return (
        <div ref={scroll} className={`chat ${!isOwnMessage ? 'chat-end' : 'chat-start'} relative group mb-2`}>
            <div className="chat-image avatar relative">
                <div className="w-8 md:w-10 rounded-full ring-1 ring-gray-300/20">
                    <img 
                        alt="User avatar" 
                        src={!isOwnMessage ? authUser?.profilePhoto : message?.senderId?.profilePhoto} 
                    />
                </div>
                
                {isOwnMessage && (
                    <button 
                        onClick={() => setShowMenu(!showMenu)}
                        className="absolute -left-5 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                    >
                        <BsThreeDotsVertical className="text-gray-300 hover:text-white" />
                    </button>
                )}
            </div>
            <div className="chat-header mb-1">
                <span className="text-xs md:text-sm font-medium">
                    {!isOwnMessage ? 'You' : message?.senderId?.fullName}
                </span>
                <time className="text-xs opacity-70 text-gray-300 ml-2">
                    {new Date(message?.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </time>
            </div>
            <div className={`chat-bubble ${isOwnMessage ? 'bg-gray-800 text-white' : 'bg-gray-700 text-white'} shadow-sm max-w-[75vw] md:max-w-md`}>
                {message?.message}
                {renderFileContent()}
            </div>
            
            {showMenu && isOwnMessage && (
                <div 
                    ref={menuRef}
                    className="absolute right-0 top-full mt-1 bg-gray-800 bg-opacity-90 backdrop-blur-sm shadow-lg rounded-md py-1 px-2 z-10 border border-gray-700/50"
                >
                    <button 
                        onClick={deleteMessage}
                        className="flex items-center gap-1 text-sm text-white hover:text-red-400 transition-colors py-1 px-2"
                    >
                        <FaTrash size={10} />
                        Delete
                    </button>
                </div>
            )}
        </div>
    )
}

export default Message;