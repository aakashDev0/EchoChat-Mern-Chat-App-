import React, { useEffect } from 'react';
import './App.css';
import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import Signup from './components/Signup';
import Login from './components/Login';
import HomePage from './components/HomePage';
import { useDispatch, useSelector } from 'react-redux';
import io from "socket.io-client";
import { setSocketId } from './redux/socketSlice';
import { setAuthUser, setOnlineUsers } from './redux/userSlice';

// Create a socket manager to avoid circular dependencies
const socketManager = {
  socket: null,
  getSocket: function() {
    return this.socket;
  },
  setSocket: function(newSocket) {
    this.socket = newSocket;
  }
};

function App() {
  const dispatch = useDispatch();
  const { authUser } = useSelector(store => store.user);

  // Add this effect to clear auth on page refresh/close
  useEffect(() => {
    const handleBeforeUnload = () => {
      // Clear auth user on page refresh/close
      dispatch(setAuthUser(null));
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [dispatch]);

  useEffect(() => {
    if (authUser) {
      // Replace this line
      // const newSocket = io("http://localhost:8081", {
      
      // With this
      const newSocket = io(import.meta.env.VITE_SOCKET_URL || "http://localhost:8081", {
        query: {
          userId: authUser._id,
          tabId: Date.now(), // Unique identifier for each connection
        },
        forceNew: true,
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionAttempts: 5
      });

      socketManager.setSocket(newSocket);

      newSocket.on("connect", () => {
        dispatch(setSocketId(newSocket.id));
        console.log("Socket connected:", newSocket.id);
      });

      newSocket.on("getOnlineUsers", (users) => {
        dispatch(setOnlineUsers(users));
      });

      newSocket.on("connect_error", (error) => {
        console.error("Socket connection error:", error);
      });

      return () => {
        if (socketManager.getSocket()) {
          socketManager.getSocket().disconnect();
          socketManager.setSocket(null);
        }
      };
    }
  }, [authUser, dispatch]);

  const router = createBrowserRouter([
    {
      path: "/",
      element: authUser ? <Navigate to="/home" /> : <Navigate to="/login" />,
    },
    {
      path: "/home",
      element: authUser ? <HomePage/> : <Navigate to="/login" />,
    },
    {
      path: "/register",
      element: <Signup/>,
    },
    {
      path: "/login",
      element: <Login/>,
    },
  ]);
  
  return (
    <div className="p-2 sm:p-4 h-screen w-screen flex items-center justify-center overflow-hidden">
      <RouterProvider router={router} />
    </div>
  );
}

export const getSocket = () => socketManager.getSocket();
export default App;
