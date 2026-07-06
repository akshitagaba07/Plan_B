import React, { useState, useEffect, useRef } from 'react';
import { useChat } from '../context/ChatContext';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { 
  Send, MessageSquare 
} from 'lucide-react';

const ChatPage = () => {
  const { user } = useAuth();
  const { 
    contacts, activeContactId, messages, loadingContacts, loadingMessages,
    selectContact, sendMessage
  } = useChat();

  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef(null);

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
    <div className="glass-card flex border-white/5 bg-black/45 h-[calc(100vh-140px)] min-h-[480px] overflow-hidden font-outfit text-left text-white">
      
      {/* Left Contacts Bar */}
      <div className="w-full md:w-80 border-r border-white/5 shrink-0 flex flex-col h-full bg-black/30">
        <div className="p-4 border-b border-white/5">
          <h3 className="font-syne font-extrabold text-xs uppercase tracking-wider text-slate-500 pl-1">Chats</h3>
        </div>

        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {loadingContacts ? (
            <div className="space-y-2 p-2">
              {[1, 2, 3].map(n => (
                <div key={n} className="h-14 w-full bg-white/5 border border-white/10 rounded-xl animate-pulse" />
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
                      ? 'bg-[#DFFE00] text-black shadow-sm shadow-[#DFFE00]/10'
                      : 'hover:bg-white/5 text-slate-300'
                  }`}
                >
                  <img 
                    src={contact.profile_pic || `https://api.dicebear.com/7.x/adventurer/svg?seed=${contact.name}`} 
                    alt={contact.name} 
                    className={`h-11 w-11 rounded-xl object-cover bg-slate-900 shrink-0 border ${isActive ? 'border-black/15' : 'border-white/10'}`}
                  />
                  <div className="flex-1 min-w-0 text-left">
                    <div className="flex justify-between items-baseline">
                      <h4 className="font-extrabold text-xs leading-tight line-clamp-1">{contact.name}</h4>
                      {contact.last_message_time && (
                        <span className={`text-[8px] font-bold shrink-0 uppercase tracking-wider ${isActive ? 'text-black/80' : 'text-slate-500'}`}>
                          {new Date(contact.last_message_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      )}
                    </div>
                    <p className={`text-[10px] font-semibold truncate mt-1 ${isActive ? 'text-black/70' : 'text-slate-400'}`}>
                      {contact.last_message}
                    </p>
                  </div>
                </button>
              );
            })
          ) : (
            <div className="text-center py-10 px-4 space-y-3">
              <MessageSquare className="h-8 w-8 text-slate-600 mx-auto" />
              <p className="text-[10px] text-slate-500 font-extrabold uppercase tracking-wider">No conversations</p>
              <p className="text-[10px] text-slate-400 leading-relaxed font-semibold">
                Go to Discovery to swipe on candidates and build active connections.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Right Chat Conversations Area */}
      <div className="flex-1 min-w-0 flex flex-col h-full bg-black/10">
        {activeContact ? (
          <>
            {/* Active Contact Header */}
            <div className="p-4 border-b border-white/5 flex justify-between items-center bg-black/40 shrink-0">
              <div className="flex items-center gap-3">
                <img 
                  src={activeContact.profile_pic || `https://api.dicebear.com/7.x/adventurer/svg?seed=${activeContact.name}`} 
                  alt={activeContact.name} 
                  className="h-10 w-10 rounded-xl object-cover bg-slate-900 border border-white/10"
                />
                <div className="text-left">
                  <h4 className="font-extrabold text-sm text-white">{activeContact.name}</h4>
                  <span className="text-[9px] text-[#DFFE00] font-extrabold uppercase tracking-wider flex items-center gap-1 mt-0.5">
                    ● connected
                  </span>
                </div>
              </div>
            </div>

            {/* Chat Messages Stream */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {loadingMessages ? (
                <div className="space-y-4 py-8">
                  <div className="h-8 w-32 bg-white/5 border border-white/10 rounded-2xl animate-pulse" />
                  <div className="h-8 w-44 bg-white/5 border border-white/10 rounded-2xl animate-pulse ml-auto" />
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
                            ? 'bg-[#DFFE00] text-black rounded-br-none font-bold' 
                            : 'bg-white/5 border border-white/5 text-slate-200 rounded-bl-none'
                        }`}
                      >
                        <p>{msg.message}</p>
                        <span className={`block text-[8px] mt-1.5 text-right font-bold uppercase tracking-wider ${isMe ? 'text-black/60' : 'text-slate-500'}`}>
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
            <form onSubmit={handleSend} className="p-4 border-t border-white/5 shrink-0 bg-black/40 flex gap-2">
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
            <div className="h-16 w-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[#DFFE00]">
              <MessageSquare className="h-8 w-8 stroke-[2px]" />
            </div>
            <h4 className="font-syne font-extrabold text-base text-white uppercase tracking-tight">Select a conversation</h4>
            <p className="text-xs text-slate-400 font-semibold max-w-xs leading-relaxed">
              Choose a connection from the left menu panel or swipe right inside discover matches to establish new chats.
            </p>
          </div>
        )}
      </div>

    </div>
  );
};

export default ChatPage;
