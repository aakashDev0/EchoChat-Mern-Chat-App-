import React, { useEffect, useRef, useState } from 'react';
import { IoMdClose } from "react-icons/io";
import { IoCamera } from "react-icons/io5";

const Camera = ({ onCapture, onClose }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const [cameraMode, setCameraMode] = useState('user'); // 'user' for front camera, 'environment' for back camera

  // Initialize camera when component mounts
  useEffect(() => {
    startCamera();
    
    // Clean up on unmount
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  // Start camera with current mode
  const startCamera = async () => {
    try {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: cameraMode,
          width: { ideal: 640 },
          height: { ideal: 480 }
        } 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
      }
    } catch (error) {
      console.error("Error accessing camera:", error);
      alert("Could not access camera. Please check permissions.");
      onClose();
    }
  };

  // Toggle between front and back camera
  const toggleCameraMode = () => {
    setCameraMode(prev => prev === 'user' ? 'environment' : 'user');
    setTimeout(() => startCamera(), 300); // Small delay to allow state to update
  };

  // Take photo and send it to parent component
  const takePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      
      // Set canvas dimensions to match video
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      // Draw video frame to canvas
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      // Convert canvas to blob
      canvas.toBlob((blob) => {
        // Create a file from the blob
        const capturedImage = new File([blob], `camera_photo_${Date.now()}.jpg`, { type: 'image/jpeg' });
        
        // Send the file to parent component
        onCapture(capturedImage);
      }, 'image/jpeg', 0.9); // Higher quality (0.9)
    }
  };

  // Handle close and clean up
  const handleClose = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-gray-900 rounded-lg overflow-hidden border border-gray-700/50 shadow-2xl" style={{ width: '320px' }}>
        {/* Header */}
        <div className="p-2 flex justify-between items-center bg-gray-800">
          <h3 className="text-white text-sm font-medium">Camera</h3>
          <button 
            onClick={handleClose}
            className="text-gray-400 hover:text-red-400 transition-colors"
          >
            <IoMdClose size={16} />
          </button>
        </div>
        
        {/* Camera View */}
        <div className="relative bg-black">
          <video 
            ref={videoRef} 
            autoPlay 
            playsInline 
            muted
            className="w-full h-full object-cover"
            style={{ height: '240px' }}
          />
          <canvas ref={canvasRef} className="hidden" />
        </div>
        
        {/* Camera Controls */}
        <div className="p-3 flex justify-center items-center bg-gray-800">
          <div className="flex justify-between items-center w-full">
            {/* Switch Camera Button */}
            <button 
              onClick={toggleCameraMode}
              className="bg-gray-700 text-white rounded-full p-2 hover:bg-gray-600 transition-colors"
            >
              <IoCamera size={16} />
            </button>
            
            {/* Capture Button */}
            <button 
              onClick={takePhoto}
              className="bg-white rounded-full p-1 hover:bg-gray-200 focus:outline-none transition-all transform hover:scale-105"
            >
              <div className="w-10 h-10 rounded-full border-2 border-gray-800"></div>
            </button>
            
            {/* Close Button */}
            <button 
              onClick={handleClose}
              className="bg-gray-700 text-white rounded-full p-2 hover:bg-gray-600 transition-colors"
            >
              <IoMdClose size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Camera;