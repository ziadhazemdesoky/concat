// src/components/Chat.js

import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import TypingEffect from './TypingEffect';
import LoadingSpinner from './LoadingSpinner';
import chatman from '../assets/chatman.svg';

const ChatContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100%;
  background-color: #1e1e1e;
  color: #f5f5f5;
  background-image: url(${chatman});
  background-size: 200px;
  background-repeat: no-repeat;
  background-position: center;
  position: relative;
`;

const MessagesContainer = styled.div`
  flex: 1;
  padding: 20px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  background-color: rgba(30, 30, 30, 0.85); /* Semi-transparent background to highlight text */
  border-radius: 20px;
`;

const Message = styled(motion.div)`
  background-color: ${(props) => (props.isUser ? '#0084ff' : '#333')};
  color: ${(props) => (props.isUser ? '#fff' : '#f5f5f5')};
  padding: 10px;
  border-radius: 20px;
  margin-bottom: 10px;
  max-width: 60%;
  align-self: ${(props) => (props.isUser ? 'flex-end' : 'flex-start')};
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
`;

const InputContainer = styled.div`
  display: flex;
  padding: 10px;
  background-color: #333;
  border-top: 1px solid #444;
`;

const Input = styled.input`
  flex: 1;
  padding: 10px;
  border: 1px solid #555;
  border-radius: 20px;
  outline: none;
  background-color: #444;
  color: #f5f5f5;
`;

const SendButton = styled.button`
  padding: 10px 20px;
  margin-right: 10px;
  background-color: #0084ff;
  color: #fff;
  border: none;
  border-radius: 20px;
  cursor: pointer;
  transition: background-color 0.3s;
  &:hover {
    background-color: #005bb5;
  }
`;

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await axios.get('http://localhost:5001/chat/history');
        const history = response.data.chatHistory;
        const messages = history.map(msg => msg.role === 'assistant' ? { text: msg.message , isUser: false } : { text: msg.message , isUser: true });
        setMessages(messages)
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };
    fetchMessages();
  }, [])
  const handleSend = async () => {
    if (input.trim()) {
      const userMessage = { text: input, isUser: true };
      setMessages([...messages, userMessage]);
      setInput('');
      setLoading(true);

      try {
        const response = await axios.post('http://localhost:5001/chat', { message: input });
        const botMessage = { text: response.data.response, isUser: false };
        setMessages((prevMessages) => [...prevMessages, botMessage]);
      } catch (error) {
        console.error('Error sending message:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <ChatContainer>
      <MessagesContainer>
        {messages.map((message, index) => (
          <Message
            key={index}
            isUser={message.isUser}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <TypingEffect text={message.text} />
          </Message>
        ))}
        <div ref={messagesEndRef} />
        <AnimatePresence>
          {loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <LoadingSpinner />
            </motion.div>
          )}
        </AnimatePresence>
      </MessagesContainer>
      <InputContainer>
      <SendButton onClick={handleSend}>ابعت</SendButton>
        <Input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
        />
      </InputContainer>
    </ChatContainer>
  );
};

export default Chat;
