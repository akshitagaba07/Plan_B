import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { eventsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar, MapPin, Clock, ArrowLeft, Award, CheckCircle 
} from 'lucide-react';

const EventDetails = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [successMsg, setSuccessMsg] = useState('');

  const loadEventDetails = async () => {
    try {
      setLoading(true);
      const res = await eventsAPI.getEventDetails(eventId);
      setEvent(res.data);
    } catch (err) {
      console.error("Failed to load event detailed specifications:", err);
      alert("Failed to find details for this event.");
      navigate('/events');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEventDetails();
  }, [eventId]);

  const handleJoinToggle = async () => {
    if (!event) return;
    try {
      const res = await eventsAPI.joinEvent(event.id);
      await loadEventDetails();
      
      setSuccessMsg(res.data.message);
      setTimeout(() => setSuccessMsg(''), 2500);
    } catch (err) {
      console.error("Failed to join event:", err);
      alert(err.response?.data?.detail || "Could not complete operation.");
    }
  };

  return (
    <div className="space-y-6 pb-24 font-outfit text-left text-white relative">
      
      {/* Toast Alert */}
      <AnimatePresence>
        {successMsg && (
          <motion.div 
            className="fixed top-6 right-6 bg-[#DFFE00] text-black font-extrabold px-6 py-3 rounded-2xl shadow-xl flex items-center gap-3 z-50 border border-[#DFFE00]"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
          >
            <CheckCircle className="h-5 w-5 stroke-[2.5px]" />
            <span>{successMsg}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Back button */}
      <div>
        <Link to="/events" className="inline-flex items-center gap-2 font-bold text-xs uppercase tracking-wider text-slate-400 hover:text-white transition-colors duration-200">
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Events</span>
        </Link>
      </div>

      <AnimatePresence mode="wait">
        {loading ? (
          <div className="glass-card p-10 h-[400px] animate-pulse border-white/5 bg-black/45" />
        ) : event ? (
          <motion.div 
            className="grid grid-cols-1 lg:grid-cols-3 gap-6"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {/* Event core info */}
            <div className="lg:col-span-2 space-y-6">
              <div className="glass-card p-6 md:p-8 border-white/5 bg-black/45">
                <span className="inline-block text-[10px] bg-[#DFFE00]/10 text-[#DFFE00] border border-[#DFFE00]/25 font-extrabold uppercase py-0.5 px-2.5 rounded-md mb-3">
                  {event.category}
                </span>

                <h3 className="text-2xl md:text-3xl font-syne font-extrabold uppercase tracking-tight leading-tight mb-4 text-white">
                  {event.title}
                </h3>

                <p className="text-slate-300 text-xs md:text-sm font-semibold leading-relaxed whitespace-pre-line mb-8">
                  {event.description}
                </p>

                {/* Logistics */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-white/5 border border-white/5 rounded-2xl text-xs font-bold">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-[#DFFE00] shrink-0" />
                    <div>
                      <p className="text-[10px] text-slate-400 uppercase tracking-wider">Date</p>
                      <p className="mt-0.5 text-white">{event.date}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-[#DFFE00] shrink-0" />
                    <div>
                      <p className="text-[10px] text-slate-400 uppercase tracking-wider">Time</p>
                      <p className="mt-0.5 text-white">{event.time}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-[#DFFE00] shrink-0" />
                    <div>
                      <p className="text-[10px] text-slate-400 uppercase tracking-wider">Location</p>
                      <p className="mt-0.5 text-white line-clamp-1">{event.location}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Participants list */}
              <div className="glass-card p-6 border-white/5 bg-black/45">
                <div className="flex justify-between items-center mb-6">
                  <h4 className="font-syne font-extrabold text-sm uppercase tracking-wider text-white">Participants ({event.participants.length})</h4>
                  <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider">Limit: {event.max_participants} people</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {event.participants.map((p, idx) => (
                    <div key={idx} className="p-3 bg-white/5 border border-white/5 rounded-2xl flex flex-col items-center text-center">
                      <img 
                        src={p.profile?.profile_pic || `https://api.dicebear.com/7.x/adventurer/svg?seed=${p.user_id}`} 
                        alt={p.profile?.name || 'User'} 
                        className="h-12 w-12 rounded-xl object-cover bg-slate-900 border border-white/10 shadow-sm mb-2"
                      />
                      <span className="text-xs font-bold text-white line-clamp-1">{p.profile?.name || 'Vibe Seeker'}</span>
                      <span className="text-[9px] text-slate-400 font-extrabold uppercase tracking-wider line-clamp-1 mt-1">
                        {p.profile?.occupation || 'Member'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar host info & actions */}
            <div className="space-y-6">
              {/* Host details */}
              <div className="glass-card p-6 border-white/5 bg-black/45 text-center flex flex-col items-center">
                <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest mb-4">Event Host</p>
                
                <img 
                  src={event.host_profile?.profile_pic || "https://api.dicebear.com/7.x/adventurer/svg?seed=Host"} 
                  alt="Host" 
                  className="h-20 w-20 rounded-2xl object-cover bg-slate-900 border-2 border-[#DFFE00] shadow-md shadow-[#DFFE00]/10 mb-3"
                />

                <h4 className="font-extrabold text-sm md:text-base text-white">{event.host_profile?.name || 'Host'}, {event.host_profile?.age || 25}</h4>
                <p className="text-[10px] text-[#DFFE00] font-extrabold uppercase tracking-wider mt-1">{event.host_profile?.occupation || 'Organizer'}</p>

                <p className="text-xs text-slate-400 font-semibold leading-relaxed mt-4 px-2">
                  "{event.host_profile?.bio || 'Let\'s get together and coordinate meetups!'}"
                </p>

                {event.host_profile?.university && (
                  <div className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider mt-4 pt-3 border-t border-white/5 w-full">
                    Alumnus: {event.host_profile.university}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="glass-card p-6 border-white/5 bg-black/45 text-center">
                {event.host_id === user.id ? (
                  <div className="space-y-2">
                    <span className="w-full bg-[#DFFE00]/10 text-[#DFFE00] border border-[#DFFE00]/25 font-extrabold py-3 px-4 rounded-xl flex items-center justify-center gap-2 text-xs uppercase tracking-wider">
                      <Award className="h-4.5 w-4.5" />
                      <span>You are hosting this event</span>
                    </span>
                  </div>
                ) : (
                  <button
                    onClick={handleJoinToggle}
                    className={`w-full font-extrabold py-3 px-6 rounded-2xl text-sm transition-all duration-200 uppercase tracking-wider ${
                      event.participants.some(p => p.user_id === user.id)
                        ? 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-md shadow-emerald-500/10'
                        : 'btn-primary'
                    }`}
                  >
                    {event.participants.some(p => p.user_id === user.id) ? 'Joined ✓ Leave Meetup' : 'Join Meetup'}
                  </button>
                )}

                <p className="text-[10px] text-slate-500 font-semibold leading-relaxed mt-3 uppercase tracking-wider">
                  Please show up on time! Hosts coordinate meetups locally. Respect safety procedures.
                </p>
              </div>
            </div>
          </motion.div>
        ) : (
          <div />
        )}
      </AnimatePresence>
    </div>
  );
};

export default EventDetails;
