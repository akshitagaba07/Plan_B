import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, MessageSquare, Compass, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useMatches } from '../context/MatchContext';

const ChatPage = () => {
  const { matches, messages, activeMatchId, setActiveMatchId, sendMessage } = useMatches();
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const activeMatch = matches.find(m => m.id === activeMatchId);
  const activeMessages = activeMatchId ? (messages[activeMatchId] || []) : [];

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeMessages]);

  // Show "typing..." indicator while waiting for auto-reply
  useEffect(() => {
    const lastMsg = activeMessages[activeMessages.length - 1];
    if (lastMsg?.fromMe) {
      setIsTyping(true);
      const t = setTimeout(() => setIsTyping(false), 2400);
      return () => clearTimeout(t);
    }
  }, [activeMessages.length]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputText.trim() || !activeMatchId) return;
    sendMessage(activeMatchId, inputText.trim());
    setInputText('');
  };

  const formatTime = (iso) =>
    new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="glass-card flex border-white/5 bg-black/45 h-[calc(100vh-140px)] min-h-[500px] overflow-hidden font-outfit text-white rounded-[24px]">

      {/* ── Left: Contacts ── */}
      <div className="w-full md:w-72 border-r border-white/5 shrink-0 flex flex-col h-full bg-black/25">
        <div className="p-4 border-b border-white/5">
          <h3 className="font-syne font-extrabold text-xs uppercase tracking-wider text-slate-500">Messages</h3>
          <p className="text-[9px] text-slate-600 font-semibold mt-0.5 uppercase tracking-wider">{matches.length} match{matches.length !== 1 ? 'es' : ''}</p>
        </div>

        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {matches.length > 0 ? (
            matches.map(match => {
              const isActive = match.id === activeMatchId;
              const matchMessages = messages[match.id] || [];
              const lastMsg = matchMessages[matchMessages.length - 1];

              return (
                <motion.button
                  key={match.id}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  onClick={() => setActiveMatchId(match.id)}
                  className={`w-full flex items-center gap-3 p-3 rounded-2xl transition-all text-left ${
                    isActive
                      ? 'bg-[#DFFE00] text-black shadow-sm shadow-[#DFFE00]/10'
                      : 'hover:bg-white/5 text-slate-300'
                  }`}
                >
                  <div className="relative shrink-0">
                    <img
                      src={match.profile_pic}
                      alt={match.name}
                      className={`h-11 w-11 rounded-xl object-cover bg-slate-900 border ${isActive ? 'border-black/15' : 'border-white/10'}`}
                    />
                    {/* Online dot */}
                    <span className={`absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 ${isActive ? 'border-[#DFFE00]' : 'border-slate-900'} bg-[#00D47C]`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline">
                      <h4 className="font-extrabold text-xs leading-tight">{match.name}</h4>
                      {lastMsg && (
                        <span className={`text-[8px] font-bold uppercase tracking-wider shrink-0 ${isActive ? 'text-black/70' : 'text-slate-600'}`}>
                          {formatTime(lastMsg.timestamp)}
                        </span>
                      )}
                    </div>
                    <p className={`text-[10px] font-semibold truncate mt-0.5 ${isActive ? 'text-black/65' : 'text-slate-500'}`}>
                      {lastMsg ? (lastMsg.fromMe ? `You: ${lastMsg.text}` : lastMsg.text) : 'Tap to say hi! 👋'}
                    </p>
                  </div>
                </motion.button>
              );
            })
          ) : (
            <div className="text-center py-10 px-4 space-y-4">
              <div className="h-14 w-14 rounded-full bg-white/5 border border-white/8 flex items-center justify-center mx-auto">
                <Heart className="h-6 w-6 text-slate-600" />
              </div>
              <p className="text-[10px] text-slate-500 font-extrabold uppercase tracking-wider">No matches yet</p>
              <p className="text-[10px] text-slate-400 leading-relaxed font-semibold">
                Go to Discover and swipe right to start chatting!
              </p>
              <Link
                to="/discover"
                className="inline-block btn-primary py-2 px-4 text-[10px] uppercase tracking-wider font-extrabold"
              >
                Start Swiping
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* ── Right: Chat Area ── */}
      <div className="flex-1 min-w-0 flex flex-col h-full bg-black/10">
        {activeMatch ? (
          <>
            {/* Contact Header */}
            <div className="p-4 border-b border-white/5 flex items-center gap-3 bg-black/35 shrink-0">
              <img
                src={activeMatch.profile_pic}
                alt={activeMatch.name}
                className="h-10 w-10 rounded-xl bg-slate-900 border border-white/10 object-cover"
              />
              <div className="flex-1 min-w-0">
                <h4 className="font-extrabold text-sm text-white">{activeMatch.name}, {activeMatch.age}</h4>
                <div className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#00D47C] animate-pulse" />
                  <span className="text-[9px] text-[#00D47C] font-extrabold uppercase tracking-wider">
                    Active now · {activeMatch.city}
                  </span>
                </div>
              </div>
              <div className="flex flex-wrap gap-1 justify-end max-w-[130px] hidden sm:flex">
                {activeMatch.interests.slice(0, 2).map(tag => (
                  <span key={tag} className="text-[8px] bg-[#DFFE00]/10 border border-[#DFFE00]/20 text-[#DFFE00] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {/* Match banner */}
              <div className="flex flex-col items-center gap-1 py-4">
                <img src={activeMatch.profile_pic} alt="" className="h-12 w-12 rounded-xl border-2 border-[#DFFE00] bg-slate-900" />
                <p className="text-[10px] font-extrabold text-[#DFFE00] uppercase tracking-wider">You matched with {activeMatch.name}!</p>
                <p className="text-[9px] text-slate-500 font-semibold">Say hello and break the ice 👋</p>
              </div>

              <AnimatePresence initial={false}>
                {activeMessages.map(msg => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                    className={`flex ${msg.fromMe ? 'justify-end' : 'justify-start'} items-end gap-2`}
                  >
                    {!msg.fromMe && (
                      <img src={activeMatch.profile_pic} alt="" className="h-6 w-6 rounded-lg bg-slate-900 border border-white/10 shrink-0 mb-0.5" />
                    )}
                    <div
                      className={`max-w-[72%] rounded-2xl px-4 py-2.5 text-xs font-semibold leading-relaxed shadow-sm ${
                        msg.fromMe
                          ? 'bg-[#DFFE00] text-black rounded-br-none font-bold'
                          : 'bg-white/8 border border-white/8 text-slate-200 rounded-bl-none'
                      }`}
                    >
                      <p>{msg.text}</p>
                      <span className={`block text-[8px] mt-1.5 text-right font-bold uppercase tracking-wider ${msg.fromMe ? 'text-black/50' : 'text-slate-600'}`}>
                        {formatTime(msg.timestamp)}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* Typing indicator */}
              <AnimatePresence>
                {isTyping && (
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="flex items-end gap-2"
                  >
                    <img src={activeMatch.profile_pic} alt="" className="h-6 w-6 rounded-lg bg-slate-900 border border-white/10 shrink-0" />
                    <div className="bg-white/8 border border-white/8 rounded-2xl rounded-bl-none px-4 py-2.5 flex gap-1 items-center">
                      {[0, 1, 2].map(i => (
                        <motion.span
                          key={i}
                          className="h-1.5 w-1.5 rounded-full bg-slate-400"
                          animate={{ y: [0, -4, 0] }}
                          transition={{ repeat: Infinity, duration: 0.8, delay: i * 0.15 }}
                        />
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div ref={messagesEndRef} />
            </div>

            {/* Input Bar */}
            <form onSubmit={handleSend} className="p-4 border-t border-white/5 shrink-0 bg-black/35 flex gap-2">
              <input
                type="text"
                placeholder={`Message ${activeMatch.name}...`}
                value={inputText}
                onChange={e => setInputText(e.target.value)}
                className="glass-input text-xs py-2.5 flex-1"
                autoComplete="off"
              />
              <button
                type="submit"
                disabled={!inputText.trim()}
                className="btn-primary py-2.5 px-5 text-xs flex items-center justify-center shrink-0 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-8 space-y-4">
            <div className="h-16 w-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[#DFFE00]">
              <MessageSquare className="h-8 w-8 stroke-[2px]" />
            </div>
            <h4 className="font-syne font-extrabold text-base text-white uppercase tracking-tight">
              {matches.length > 0 ? 'Select a chat' : 'No matches yet'}
            </h4>
            <p className="text-xs text-slate-400 font-semibold max-w-xs leading-relaxed">
              {matches.length > 0
                ? 'Pick a match from the left to start chatting.'
                : 'Swipe right on Discover to start making connections!'}
            </p>
            {matches.length === 0 && (
              <Link to="/discover" className="btn-primary py-2.5 px-6 text-xs uppercase tracking-wider font-extrabold flex items-center gap-2">
                <Compass className="h-4 w-4" /> Go Discover
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatPage;
