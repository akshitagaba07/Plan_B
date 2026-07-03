import React, { useState, useEffect, useRef } from 'react';
import { useChat } from '../context/ChatContext';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Send, Users, MessageSquare, AlertCircle, Compass, ShieldAlert, BadgeInfo 
} from 'lucide-react';

const ChatPage = () => {
  const { user } = useAuth();
  const { 
    contacts, activeContactId, messages, loadingContacts, loadingMessages,
    selectContact, sendMessage, setActiveContactId
  } = useChat();

  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef(null);

  // Scroll to bottom when message log loads/updates
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const activeContact = contacts.find(c => c.user_id === activeContactId);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    await sendMessage(inputText);
    setInputText('');
  };

  return (
    <div className="glass-card flex border-white/20 dark:border-slate-800/40 h-[calc(100vh-140px)] min-h-[480px] overflow-hidden font-outfit text-left">
      
      {/* Left Contacts Bar */}
      <div className="w-full md:w-80 border-r border-primary-200/40 dark:border-slate-800 shrink-0 flex flex-col h-full bg-white/30 dark:bg-slate-900/10">
        <div className="p-4 border-b border-primary-200/40 dark:border-slate-800">
          <h3 className="font-extrabold text-sm uppercase tracking-wider pl-1">Chats</h3>
        </div>

        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {loadingContacts ? (
            <div className="space-y-2 p-2">
              {[1, 2, 3].map(n => (
                <div key={n} className="h-14 w-full bg-primary-100 dark:bg-slate-800/60 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : contacts.length > 0 ? (
            contacts.map((contact) => {
              const isActive = contact.user_id === activeContactId;
              return (
                <button
                  key={contact.user_id}
                  onClick={() => selectContact(contact.user_id)}
                  className={`w-full flex items-center gap-3 p-3 rounded-2xl transition-all ${
                    isActive 
                      ? 'bg-gradient-to-r from-primary-900 to-slate-800 dark:from-white dark:to-slate-100 text-white dark:text-primary-950 shadow-sm'
                      : 'hover:bg-primary-100/50 dark:hover:bg-slate-800/40 text-primary-900 dark:text-slate-100'
                  }`}
                >
                  <img 
                    src={contact.profile_pic || `https://api.dicebear.com/7.x/adventurer/svg?seed=${contact.name}`} 
                    alt={contact.name} 
                    className="h-11 w-11 rounded-xl object-cover bg-slate-100 shrink-0 border"
                  />
                  <div className="flex-1 min-w-0 text-left">
                    <div className="flex justify-between items-baseline">
                      <h4 className="font-extrabold text-xs leading-tight line-clamp-1">{contact.name}</h4>
                      {contact.last_message_time && (
                        <span className={`text-[8px] font-semibold shrink-0 ${isActive ? 'text-primary-200 dark:text-primary-500' : 'text-primary-400'}`}>
                          {new Date(contact.last_message_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      )}
                    </div>
                    <p className={`text-[10px] font-semibold truncate mt-1 ${isActive ? 'text-primary-100 dark:text-primary-700' : 'text-primary-400'}`}>
                      {contact.last_message}
                    </p>
                  </div>
                </button>
              );
            })
          ) : (
            <div className="text-center py-10 px-4 space-y-3">
              <MessageSquare className="h-8 w-8 text-primary-300 dark:text-slate-700 mx-auto" />
              <p className="text-[10px] text-primary-400 dark:text-slate-400 font-bold uppercase tracking-wider">No conversations</p>
              <p className="text-[10px] text-primary-400 leading-relaxed font-semibold">
                Go to Discovery to swipe on candidates and build active connections.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Right Chat Conversations Area */}
      <div className="flex-1 min-w-0 flex flex-col h-full bg-white/20 dark:bg-slate-950/10">
        {activeContact ? (
          <>
            {/* Active Contact Header */}
            <div className="p-4 border-b border-primary-200/40 dark:border-slate-800 flex justify-between items-center bg-white/40 dark:bg-slate-900/20 shrink-0">
              <div className="flex items-center gap-3">
                <img 
                  src={activeContact.profile_pic || `https://api.dicebear.com/7.x/adventurer/svg?seed=${activeContact.name}`} 
                  alt={activeContact.name} 
                  className="h-10 w-10 rounded-xl object-cover bg-slate-100 border"
                />
                <div className="text-left">
                  <h4 className="font-extrabold text-sm">{activeContact.name}</h4>
                  <span className="text-[9px] text-emerald-500 font-extrabold flex items-center gap-0.5">
                    ● connected
                  </span>
                </div>
              </div>
            </div>

            {/* Chat Messages Stream */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {loadingMessages ? (
                <div className="space-y-4 py-8">
                  <div className="h-8 w-32 bg-primary-100 dark:bg-slate-800 rounded-2xl animate-pulse" />
                  <div className="h-8 w-44 bg-primary-100 dark:bg-slate-800 rounded-2xl animate-pulse ml-auto" />
                </div>
              ) : (
                messages.map((msg) => {
                  const isMe = msg.sender_id === user.id;
                  return (
                    <div 
                      key={msg.id}
                      className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                    >
                      <div 
                        className={`max-w-[70%] rounded-2xl px-4 py-2.5 text-xs font-semibold shadow-sm leading-relaxed ${
                          isMe 
                            ? 'bg-gradient-to-tr from-secondary-500 to-sky-400 text-white rounded-br-none' 
                            : 'bg-white dark:bg-slate-900 border border-primary-100/50 dark:border-slate-800/80 text-primary-850 dark:text-slate-200 rounded-bl-none'
                        }`}
                      >
                        <p>{msg.message}</p>
                        <span className={`block text-[8px] mt-1 text-right ${isMe ? 'text-white/80' : 'text-primary-400 dark:text-slate-500'}`}>
                          {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Send Bar */}
            <form onSubmit={handleSend} className="p-4 border-t border-primary-200/40 dark:border-slate-800 shrink-0 bg-white/40 dark:bg-slate-900/20 flex gap-2">
              <input 
                type="text" 
                placeholder="Type a message..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className="glass-input text-xs py-2.5"
                required
              />
              <button 
                type="submit" 
                className="btn-primary py-2.5 px-5 text-xs flex items-center justify-center shrink-0"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </>
        ) : (
          // Empty Vibe selector
          <div className="flex-1 flex flex-col items-center justify-center text-center p-8 space-y-4">
            <div className="h-16 w-16 rounded-full bg-secondary-100/60 dark:bg-slate-900 flex items-center justify-center text-secondary-500">
              <MessageSquare className="h-8 w-8 stroke-[2px]" />
            </div>
            <h4 className="font-extrabold text-base">Select a conversation</h4>
            <p className="text-xs text-primary-400 dark:text-slate-400 font-semibold max-w-xs leading-relaxed">
              Choose a connection from the left menu panel or swipe right inside discover matches to establish new chats.
            </p>
          </div>
        )}
      </div>

    </div>
  );
};

export default ChatPage;
