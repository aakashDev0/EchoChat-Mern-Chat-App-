import { useEffect, useCallback, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setMessages, deleteMessage } from "../redux/messagesSlice";
import { getSocket } from "../App";

const useGetRealTimeMessage = () => {
  const { messages } = useSelector(store => store.message);
  const { selectedUser } = useSelector(store => store.user);
  const dispatch = useDispatch();
  const socketRef = useRef(null);

  const handleNewMessage = useCallback((newMessage) => {
    console.log("New message received:", newMessage);
    
    if (!messages) {
      dispatch(setMessages([newMessage]));
      return;
    }

    if (
      (newMessage.senderId._id === selectedUser?._id) || 
      (newMessage.receiverId._id === selectedUser?._id)
    ) {
      const messageExists = messages.some(msg => msg._id === newMessage._id);
      if (!messageExists) {
        dispatch(setMessages([...messages, newMessage]));
      }
    }
  }, [messages, dispatch, selectedUser]);

  const handleMessageDeleted = useCallback((messageId) => {
    console.log("Message deleted:", messageId);
    dispatch(deleteMessage(messageId));
  }, [dispatch]);

  useEffect(() => {
    const socket = getSocket();
    socketRef.current = socket;

    if (!socket || !selectedUser) return;

    socket.on("newMessage", handleNewMessage);
    socket.on("messageSent", handleNewMessage);
    socket.on("messageDeleted", handleMessageDeleted);

    return () => {
      if (socketRef.current) {
        socketRef.current.off("newMessage", handleNewMessage);
        socketRef.current.off("messageSent", handleNewMessage);
        socketRef.current.off("messageDeleted", handleMessageDeleted);
      }
    };
  }, [selectedUser, handleNewMessage, handleMessageDeleted]);
};

export default useGetRealTimeMessage;