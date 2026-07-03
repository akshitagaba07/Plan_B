import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { chatAPI } from '../services/api';
import { useAuth } from './AuthContext';

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [contacts, setContacts] = useState([]);
  const [activeContactId, setActiveContactId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loadingContacts, setLoadingContacts] = useState(false);
  const [loadingMessages, setLoadingMessages] = useState(false);
  
  const pollingRef = useRef(null);

  // Fetch all chat contacts
  const fetchContacts = async () => {
    if (!isAuthenticated) return;
    try {
      setLoadingContacts(true);
      const res = await chatAPI.getContacts();
      setContacts(res.data);
    } catch (err) {
      console.error('Failed to load chat contacts:', err);
    } finally {
      setLoadingContacts(false);
    }
  };

  // Fetch chat history with specific user
  const fetchMessages = async (otherId) => {
    if (!isAuthenticated || !otherId) return;
    try {
      const res = await chatAPI.getHistory(otherId);
      setMessages(res.data);
    } catch (err) {
      console.error(`Failed to load chat history with user ${otherId}:`, err);
    }
  };

  // Select a contact and load message history
  const selectContact = async (contactId) => {
    setActiveContactId(contactId);
    setLoadingMessages(true);
    await fetchMessages(contactId);
    setLoadingMessages(false);
  };

  // Send a message
  const sendMessage = async (messageText) => {
    if (!isAuthenticated || !activeContactId || !messageText.trim()) return;
    try {
      const res = await chatAPI.sendMessage(activeContactId, messageText);
      // Append message instantly for responsiveness
      setMessages(prev => [...prev, res.data]);
      
      // Update the contact's last message text
      setContacts(prev => prev.map(c => {
        if (c.user_id === activeContactId) {
          return {
            ...c,
            last_message: messageText,
            last_message_time: res.data.timestamp
          };
        }
        return c;
      }));
    } catch (err) {
      console.error('Failed to send direct message:', err);
    }
  };

  // Initial load
  useEffect(() => {
    if (isAuthenticated) {
      fetchContacts();
    } else {
      setContacts([]);
      setMessages([]);
      setActiveContactId(null);
    }
  }, [isAuthenticated]);

  // Set up polling interval for messages and contacts
  useEffect(() => {
    if (isAuthenticated) {
      pollingRef.current = setInterval(() => {
        // Silently pull contacts
        chatAPI.getContacts().then(res => setContacts(res.data)).catch(err => {});
        
        // Silently pull messages if a contact is active
        if (activeContactId) {
          chatAPI.getHistory(activeContactId).then(res => {
            // Only update state if length changed or timestamps changed to avoid infinite re-renders
            setMessages(prev => {
              if (res.data.length !== prev.length) {
                return res.data;
              }
              return prev;
            });
          }).catch(err => {});
        }
      }, 3000); // Poll every 3 seconds for simulated real-time chat
    }

    return () => {
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
      }
    };
  }, [isAuthenticated, activeContactId]);

  return (
    <ChatContext.Provider value={{
      contacts,
      activeContactId,
      messages,
      loadingContacts,
      loadingMessages,
      fetchContacts,
      selectContact,
      sendMessage,
      setActiveContactId
    }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => useContext(ChatContext);
