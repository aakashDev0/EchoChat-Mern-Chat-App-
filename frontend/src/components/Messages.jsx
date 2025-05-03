import React, { useEffect, useRef } from 'react'
import Message from './Message.jsx'
import useGetMessages from '../hooks/useGetMessages.jsx'
import { useSelector } from 'react-redux';
import useGetRealTimeMessage from '../hooks/useGetRealTimeMessage.jsx';

const Messages = () => {
  const messagesEndRef = useRef(null);
  useGetMessages();
  useGetRealTimeMessage();
  const { messages } = useSelector(store => store.message);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className='px-2 md:px-4 flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar bg-gray-900/30'>
      {messages && messages.length > 0 ? (
        messages.map((message) => (
          <Message key={message._id} message={message} />
        ))
      ) : (
        <div className="flex items-center justify-center h-full">
          <p className="text-gray-400 text-sm">No messages yet. Start the conversation!</p>
        </div>
      )}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default Messages;