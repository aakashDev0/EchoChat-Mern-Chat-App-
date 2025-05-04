import React, { useState, useEffect, useRef } from 'react';
import { IoSendOutline } from "react-icons/io5";
import { IoAttach } from "react-icons/io5";
import { FaFile, FaFilePdf, FaFileWord, FaFileExcel, FaFileImage, FaFileAudio, FaFileVideo } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import { BsEmojiSmile } from "react-icons/bs";
import { BsCameraFill } from "react-icons/bs"; // Import camera icon
import axios from "axios";
import { useDispatch, useSelector } from 'react-redux';
import { setMessages } from '../redux/messagesSlice.jsx';
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';
import Camera from './Camera.jsx'; // Import our new Camera component

const SendInput = () => {
  const [message, setMessage] = useState("");
  const [file, setFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const emojiPickerRef = useRef(null);
  const dispatch = useDispatch();
  const { selectedUser } = useSelector(store => store.user);
  const { messages } = useSelector(store => store.message);

  // Close emoji picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target)) {
        setShowEmojiPicker(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Generate preview URL for image files
  useEffect(() => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFilePreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setFilePreview(null);
    }
  }, [file]);

  const getFileIcon = (mimetype) => {
    if (!mimetype) return <FaFile size={16} className="text-red-500" />;
    
    if (mimetype.startsWith('image/')) return <FaFileImage size={16} className="text-red-500" />;
    if (mimetype.startsWith('audio/')) return <FaFileAudio size={16} className="text-red-500" />;
    if (mimetype.startsWith('video/')) return <FaFileVideo size={16} className="text-red-500" />;
    if (mimetype.includes('pdf')) return <FaFilePdf size={16} className="text-red-500" />;
    if (mimetype.includes('word') || mimetype.includes('document')) return <FaFileWord size={16} className="text-red-500" />;
    if (mimetype.includes('excel') || mimetype.includes('spreadsheet')) return <FaFileExcel size={16} className="text-red-500" />;
    
    return <FaFile size={16} className="text-red-500" />;
  };

  const onEmojiSelect = (emoji) => {
    setMessage(prev => prev + emoji.native);
  };

  // Handle captured photo from Camera component
  const handleCapturedPhoto = (capturedImage) => {
    setFile(capturedImage);
    setShowCamera(false);
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    // Check if either message or file is present and a user is selected
    if ((!message.trim() && !file) || !selectedUser) return;

    try {
      const formData = new FormData();
      formData.append('message', message.trim());
      if (file) {
        formData.append('file', file);
      }

      const res = await axios.post(
        `${import.meta.env.VITE_API_URL || 'http://localhost:8080'}/api/v1/message/send/${selectedUser._id}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          },
          withCredentials: true
        }
      );

      dispatch(setMessages(messages ? [...messages, res.data.newMessage] : [res.data.newMessage]));
      setMessage("");
      setFile(null);
      setFilePreview(null);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <div className="px-2 md:px-4 my-3">
      {/* File preview */}
      {file && (
        <div className="flex items-center gap-2 mb-2 p-2 bg-gray-700/80 rounded-md border border-gray-600/50">
          {filePreview ? (
            <div className="flex items-center gap-2 flex-grow">
              <img src={filePreview} alt="Preview" className="h-10 w-10 object-cover rounded" />
              <span className="text-sm text-white truncate max-w-[200px]">{file.name}</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 flex-grow">
              {getFileIcon(file.type)}
              <span className="text-sm text-white truncate max-w-[200px]">{file.name}</span>
            </div>
          )}
          <button 
            onClick={() => {
              setFile(null);
              setFilePreview(null);
            }} 
            className="text-gray-300 hover:text-red-400 transition-colors"
          >
            <IoMdClose size={18} />
          </button>
        </div>
      )}
      
      {/* Camera Component */}
      {showCamera && (
        <Camera 
          onCapture={handleCapturedPhoto} 
          onClose={() => setShowCamera(false)} 
        />
      )}
      
      <div className="relative">
        {showEmojiPicker && (
          <div 
            ref={emojiPickerRef} 
            className="absolute bottom-14 left-0 z-10 shadow-xl rounded-lg overflow-hidden max-w-full"
            style={{ width: window.innerWidth < 640 ? '300px' : 'auto' }}
          >
            <Picker 
              data={data} 
              onEmojiSelect={onEmojiSelect} 
              theme="dark"
              previewPosition="none"
              skinTonePosition="none"
            />
          </div>
        )}
        <form onSubmit={onSubmitHandler} className='w-full relative flex items-center'>
          <div className="flex items-center space-x-1 md:space-x-2 mr-1 md:mr-2">
            <button 
              type="button" 
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className='cursor-pointer text-gray-300 hover:text-white transition-colors p-1 md:p-2 rounded-full hover:bg-gray-700/50'
            >
              <BsEmojiSmile size={16} />
            </button>
            <button 
              type="button" 
              onClick={() => setShowCamera(true)}
              className='cursor-pointer text-gray-300 hover:text-white transition-colors p-1 md:p-2 rounded-full hover:bg-gray-700/50'
            >
              <BsCameraFill size={16} />
            </button>
            <label htmlFor="file" className='cursor-pointer text-gray-300 hover:text-white transition-colors p-1 md:p-2 rounded-full hover:bg-gray-700/50'>
              <IoAttach size={16} />
            </label>
          </div>
          <input
            type="file"
            id="file"
            className="hidden"
            onChange={(e) => setFile(e.target.files[0])}
          />
          <input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            type="text"
            placeholder='Send a message...'
            className='border text-sm rounded-lg block w-full p-3 border-gray-600/50 text-white bg-gray-700/70 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all'
          />
          <button type="submit" className='absolute flex inset-y-0 end-0 items-center pr-4 text-gray-300 hover:text-indigo-400 transition-colors'>
            <IoSendOutline size={18} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default SendInput;