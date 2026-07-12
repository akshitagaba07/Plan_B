import React, { createContext, useContext, useState } from 'react';

const MatchContext = createContext();

const AUTO_REPLIES = [
  "Hey! Great to match with you 👋",
  "That sounds fun! When are you free? 😄",
  "I'd love to catch up! Let's plan something 🙌",
  "We have so much in common — we should hang out!",
  "Nice to meet you on Plan B!",
  "I was hoping someone would reach out 😊",
  "Let's make plans! What's your schedule like?",
  "That's awesome, tell me more!",
  "So glad we matched! 🎉",
  "Looking forward to hanging out with you!",
];

export const MatchProvider = ({ children }) => {
  const [matches, setMatches] = useState([]);
  const [messages, setMessages] = useState({});   // { [profileId]: [ { id, text, fromMe, timestamp } ] }
  const [activeMatchId, setActiveMatchId] = useState(null);

  const addMatch = (profile) => {
    setMatches(prev => {
      if (prev.find(m => m.id === profile.id)) return prev;
      return [profile, ...prev];
    });
  };

  const sendMessage = (toId, text) => {
    const outgoing = {
      id: Date.now(),
      text,
      fromMe: true,
      timestamp: new Date().toISOString(),
    };
    setMessages(prev => ({
      ...prev,
      [toId]: [...(prev[toId] || []), outgoing],
    }));

    // Simulate a reply after 1–2 seconds
    const delay = 1000 + Math.random() * 1200;
    setTimeout(() => {
      const reply = {
        id: Date.now() + 1,
        text: AUTO_REPLIES[Math.floor(Math.random() * AUTO_REPLIES.length)],
        fromMe: false,
        timestamp: new Date().toISOString(),
      };
      setMessages(prev => ({
        ...prev,
        [toId]: [...(prev[toId] || []), reply],
      }));
    }, delay);
  };

  return (
    <MatchContext.Provider value={{
      matches,
      messages,
      activeMatchId,
      setActiveMatchId,
      addMatch,
      sendMessage,
    }}>
      {children}
    </MatchContext.Provider>
  );
};

export const useMatches = () => useContext(MatchContext);
