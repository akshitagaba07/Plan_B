import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { assistantAPI, eventsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useChat } from '../context/ChatContext';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Send, Sparkles, Bot, Hash, ArrowRight, UserPlus, CheckCircle 
} from 'lucide-react';
import confetti from 'canvas-confetti';

const Assistant = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { selectContact } = useChat();
  const messagesEndRef = useRef(null);

  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'assistant',
      text: `Hello ${user?.profile?.name || 'Vibe Seeker'}! I'm your AI Social Wellness Companion. 🧘\n\nHow are you feeling today? You can talk to me about feeling lonely, bored, wanting to coordinate soccer/cricket matches, or needing buddy study groups. I'll search Plan B and recommend resources!`,
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text: inputText,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setLoading(true);

    try {
      const res = await assistantAPI.queryAssistant(userMsg.text);
      const data = res.data;
      
      const assistantMsg = {
        id: Date.now() + 1,
        sender: 'assistant',
        text: data.reply,
        suggested_people: data.suggested_people,
        suggested_events: data.suggested_events,
        suggested_communities: data.suggested_communities,
        suggested_activities: data.suggested_activities,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMsg]);
    } catch (err) {
      console.error("AI companion chat failed:", err);
      setMessages(prev => [...prev, {
        id: Date.now() + 2,
        sender: 'assistant',
        text: "I apologize, I'm having trouble connecting to my cognitive services. Please verify the backend endpoint.",
        timestamp: new Date()
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleStartChat = async (userId) => {
    await selectContact(userId);
    navigate('/chat');
  };

  const handleJoinEvent = async (eventId) => {
    try {
      const res = await eventsAPI.joinEvent(eventId);
      setSuccessMsg(res.data.message);
      setTimeout(() => setSuccessMsg(''), 2500);
      confetti({
        particleCount: 50,
        spread: 40
      });
    } catch (err) {
      console.error("Failed to join event:", err);
      alert(err.response?.data?.detail || "Could not register.");
    }
  };

  return (
    <div className="glass-card flex flex-col border-white/5 h-[calc(100vh-140px)] min-h-[480px] overflow-hidden font-outfit text-left text-white bg-black/45 relative">
      
      {/* Toast Alert */}
      <AnimatePresence>
        {successMsg && (
          <motion.div 
            className="fixed top-6 right-6 bg-[#DFFE00] text-black font-extrabold px-6 py-3 rounded-2xl shadow-xl flex items-center gap-3 z-50 border border-[#DFFE00]"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
          >
            <CheckCircle className="h-5 w-5 shrink-0 stroke-[2.5px]" />
            <span>{successMsg}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header bar */}
      <div className="p-4 border-b border-white/5 flex items-center gap-3 bg-black/40 shrink-0">
        <div className="h-10 w-10 rounded-xl bg-[#DFFE00]/10 text-[#DFFE00] flex items-center justify-center shrink-0 shadow-sm border border-[#DFFE00]/25">
          <Bot className="h-5 w-5 stroke-[2px] animate-pulse" />
        </div>
        <div>
          <h4 className="font-syne font-extrabold text-sm flex items-center gap-1.5 uppercase tracking-wide">
            <span>AI Social Wellness Copilot</span>
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping" />
          </h4>
          <span className="text-[9px] text-slate-400 font-extrabold uppercase tracking-wider">companion active</span>
        </div>
      </div>

      {/* Message stream panel */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {messages.map((msg) => {
          const isUser = msg.sender === 'user';
          return (
            <div 
              key={msg.id}
              className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex gap-3 max-w-[85%] ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
                {!isUser && (
                  <div className="h-9 w-9 rounded-xl bg-slate-900 border border-white/10 text-[#DFFE00] flex items-center justify-center shrink-0 shadow-sm mt-1">
                    <Bot className="h-4.5 w-4.5" />
                  </div>
                )}
                
                <div className="space-y-3">
                  {/* Chat bubble text */}
                  <div 
                    className={`rounded-2xl px-4 py-3 text-xs font-semibold shadow-sm leading-relaxed whitespace-pre-wrap ${
                      isUser 
                        ? 'bg-[#DFFE00] text-black rounded-br-none font-bold' 
                        : 'bg-white/5 border border-white/5 text-slate-200 rounded-bl-none'
                    }`}
                  >
                    <p>{msg.text}</p>
                  </div>

                  {/* Recommendations container rendered inside bubble thread */}
                  {!isUser && (
                    <div className="space-y-3">
                      {/* Suggested People Grid */}
                      {msg.suggested_people && msg.suggested_people.length > 0 && (
                        <div className="space-y-1.5">
                          <p className="text-[9px] text-slate-500 font-extrabold uppercase tracking-wider pl-1">Suggested Matches</p>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {msg.suggested_people.map((p) => (
                              <div key={p.user_id} className="p-3 bg-white/5 border border-white/5 rounded-2xl flex justify-between items-center text-xs">
                                <div className="flex items-center gap-2">
                                  <img src={p.profile_pic} className="h-8 w-8 rounded-lg bg-slate-900 border border-white/10 object-cover" alt="User Pic" />
                                  <div>
                                    <h5 className="font-extrabold text-[11px] leading-tight text-white">{p.name}, {p.age}</h5>
                                    <p className="text-[9px] text-slate-400 font-extrabold uppercase tracking-wider">{p.occupation || 'Buddy'}</p>
                                  </div>
                                </div>
                                <button 
                                  onClick={() => handleStartChat(p.user_id)}
                                  className="p-1.5 rounded-lg bg-white/5 border border-white/10 text-[#DFFE00] hover:bg-white/10 shrink-0"
                                >
                                  <UserPlus className="h-3.5 w-3.5" />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Suggested Events Cards */}
                      {msg.suggested_events && msg.suggested_events.length > 0 && (
                        <div className="space-y-1.5">
                          <p className="text-[9px] text-slate-500 font-extrabold uppercase tracking-wider pl-1">Suggested Meetups</p>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {msg.suggested_events.map((e) => (
                              <div key={e.id} className="p-3 bg-white/5 border border-white/5 rounded-2xl flex flex-col justify-between text-xs min-h-[90px]">
                                <div>
                                  <h5 className="font-extrabold text-[11px] leading-tight line-clamp-1 text-white">{e.title}</h5>
                                  <span className="text-[9px] text-slate-400 font-extrabold uppercase tracking-wider mt-0.5 inline-block">{e.date} @ {e.time}</span>
                                </div>
                                <div className="flex justify-between items-center mt-2.5 pt-2 border-t border-white/5">
                                  <span className="text-[9px] text-slate-400 font-extrabold max-w-[80px] truncate uppercase tracking-wider">{e.location}</span>
                                  <button 
                                    onClick={() => handleJoinEvent(e.id)}
                                    className="text-[9px] font-extrabold px-3 py-1 bg-[#DFFE00] text-black rounded-lg uppercase tracking-wider"
                                  >
                                    Join
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Suggested Communities Cards */}
                      {msg.suggested_communities && msg.suggested_communities.length > 0 && (
                        <div className="space-y-1.5">
                          <p className="text-[9px] text-slate-500 font-extrabold uppercase tracking-wider pl-1">Suggested Clubs</p>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {msg.suggested_communities.map((c) => (
                              <div key={c.id} className="p-3 bg-white/5 border border-white/5 rounded-2xl flex justify-between items-center text-xs">
                                <div className="flex items-center gap-2">
                                  <div className="h-7 w-7 rounded-lg bg-[#DFFE00]/10 text-[#DFFE00] flex items-center justify-center shrink-0">
                                    <Hash className="h-4 w-4" />
                                  </div>
                                  <span className="font-extrabold text-[11px] text-white">{c.name}</span>
                                </div>
                                <button 
                                  onClick={() => navigate('/community')}
                                  className="p-1.5 rounded-lg bg-white/5 border border-white/10 text-[#DFFE00] hover:bg-white/10 shrink-0"
                                >
                                  <ArrowRight className="h-3.5 w-3.5" />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Suggested Self Care Actions */}
                      {msg.suggested_activities && msg.suggested_activities.length > 0 && (
                        <div className="p-3 bg-[#DFFE00]/5 border border-[#DFFE00]/15 rounded-2xl text-xs space-y-1.5 max-w-sm">
                          <p className="text-[9px] text-[#DFFE00] font-extrabold uppercase tracking-wider flex items-center gap-1">
                            <Sparkles className="h-3 w-3" />
                            <span>Wellness Activities</span>
                          </p>
                          <ul className="space-y-1 pl-1 text-[11px] font-semibold text-slate-400 leading-normal">
                            {msg.suggested_activities.slice(0, 3).map((act, idx) => (
                              <li key={idx} className="flex gap-1.5 items-start">
                                <span className="text-[#DFFE00]">•</span>
                                <span>{act}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {/* Loading Vibe Indicator */}
        {loading && (
          <div className="flex justify-start">
            <div className="flex gap-3 max-w-[80%] items-start">
              <div className="h-9 w-9 rounded-xl bg-[#DFFE00]/10 border border-[#DFFE00]/20 text-[#DFFE00] flex items-center justify-center shrink-0 animate-bounce">
                <Bot className="h-4.5 w-4.5" />
              </div>
              <div className="rounded-2xl px-4 py-3 bg-white/5 border border-white/5 text-slate-400 text-xs font-semibold flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-[#DFFE00] animate-bounce" style={{ animationDelay: '0s' }} />
                <div className="h-2 w-2 rounded-full bg-[#DFFE00] animate-bounce" style={{ animationDelay: '0.2s' }} />
                <div className="h-2 w-2 rounded-full bg-[#DFFE00] animate-bounce" style={{ animationDelay: '0.4s' }} />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Text Send Form */}
      <form onSubmit={handleSend} className="p-4 border-t border-white/5 shrink-0 bg-black/40 flex gap-2">
        <input 
          type="text" 
          placeholder="Ask me: 'I feel lonely', 'I want someone to play football with'..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          className="glass-input text-xs py-2.5"
          disabled={loading}
          required
        />
        <button 
          type="submit" 
          disabled={loading}
          className="btn-primary py-2.5 px-5 text-xs flex items-center justify-center shrink-0"
        >
          <Send className="h-4 w-4" />
        </button>
      </form>

    </div>
  );
};

export default Assistant;
