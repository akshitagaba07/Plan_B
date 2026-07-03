import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { eventsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar, MapPin, Clock, Users, ArrowLeft, Award, CheckCircle, ShieldAlert 
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
      await loadEventDetails(); // Reload content
      
      setSuccessMsg(res.data.message);
      setTimeout(() => setSuccessMsg(''), 2500);
    } catch (err) {
      console.error("Failed to join event:", err);
      alert(err.response?.data?.detail || "Could not complete operation.");
    }
  };

  return (
    <div className="space-y-6 pb-24 font-outfit text-left relative">
      
      {/* Toast Alert */}
      <AnimatePresence>
        {successMsg && (
          <motion.div 
            className="fixed top-6 right-6 bg-emerald-500 text-white font-bold px-6 py-3 rounded-2xl shadow-xl flex items-center gap-3 z-50 border border-emerald-400"
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
        <Link to="/events" className="inline-flex items-center gap-2 font-bold text-xs text-primary-500 hover:text-primary-900 dark:text-slate-400 dark:hover:text-white transition-colors duration-200">
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Events</span>
        </Link>
      </div>

      <AnimatePresence mode="wait">
        {loading ? (
          <div className="glass-card p-10 h-[400px] animate-pulse border-white/20 dark:border-slate-800" />
        ) : event ? (
          <motion.div 
            className="grid grid-cols-1 lg:grid-cols-3 gap-6"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {/* Event core info */}
            <div className="lg:col-span-2 space-y-6">
              <div className="glass-card p-6 md:p-8 border-white/20 dark:border-slate-800/40">
                <span className="inline-block text-[10px] bg-primary-100 dark:bg-slate-800 text-primary-600 dark:text-slate-300 font-extrabold uppercase py-0.5 px-2.5 rounded-md border border-primary-200/20 mb-3">
                  {event.category}
                </span>

                <h3 className="text-2xl md:text-3xl font-extrabold tracking-tight leading-tight mb-4">
                  {event.title}
                </h3>

                <p className="text-primary-500 dark:text-slate-400 text-xs md:text-sm font-semibold leading-relaxed whitespace-pre-line mb-8">
                  {event.description}
                </p>

                {/* Logistics */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-primary-100/30 dark:bg-slate-900/30 border border-primary-200/10 dark:border-slate-800/80 rounded-2xl text-xs font-bold">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-secondary-500 shrink-0" />
                    <div className="text-left">
                      <p className="text-[10px] text-primary-400 uppercase tracking-wider">Date</p>
                      <p className="mt-0.5">{event.date}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-secondary-500 shrink-0" />
                    <div className="text-left">
                      <p className="text-[10px] text-primary-400 uppercase tracking-wider">Time</p>
                      <p className="mt-0.5">{event.time}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-accent-coral shrink-0" />
                    <div className="text-left">
                      <p className="text-[10px] text-primary-400 uppercase tracking-wider">Location</p>
                      <p className="mt-0.5 line-clamp-1">{event.location}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Participants list */}
              <div className="glass-card p-6 border-white/20 dark:border-slate-800/40">
                <div className="flex justify-between items-center mb-6">
                  <h4 className="font-extrabold text-sm uppercase tracking-wider">Participants ({event.participants.length})</h4>
                  <span className="text-[10px] text-primary-400 font-bold">Limit: {event.max_participants} people</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {event.participants.map((p, idx) => (
                    <div key={idx} className="p-3 bg-white/40 dark:bg-slate-900/40 border border-primary-100/50 dark:border-slate-800/80 rounded-2xl flex flex-col items-center text-center">
                      <img 
                        src={p.profile?.profile_pic || `https://api.dicebear.com/7.x/adventurer/svg?seed=${p.user_id}`} 
                        alt={p.profile?.name || 'User'} 
                        className="h-12 w-12 rounded-xl object-cover bg-slate-100 border shadow-sm mb-2"
                      />
                      <span className="text-xs font-bold line-clamp-1">{p.profile?.name || 'Vibe Seeker'}</span>
                      <span className="text-[9px] text-primary-400 font-semibold line-clamp-1 mt-0.5">
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
              <div className="glass-card p-6 border-white/20 dark:border-slate-800/40 text-center flex flex-col items-center">
                <p className="text-[10px] text-primary-400 font-bold uppercase tracking-widest mb-4">Event Host</p>
                
                <img 
                  src={event.host_profile?.profile_pic || "https://api.dicebear.com/7.x/adventurer/svg?seed=Host"} 
                  alt="Host" 
                  className="h-20 w-20 rounded-2xl object-cover bg-slate-100 border-2 border-white shadow-md mb-3"
                />

                <h4 className="font-extrabold text-sm md:text-base">{event.host_profile?.name || 'Host'}, {event.host_profile?.age || 25}</h4>
                <p className="text-[10px] text-secondary-500 font-bold uppercase tracking-wider mt-0.5">{event.host_profile?.occupation || 'Organizer'}</p>

                <p className="text-xs text-primary-400 dark:text-slate-400 font-semibold leading-relaxed mt-4 px-2">
                  "{event.host_profile?.bio || 'Let\'s get together and coordinate meetups!'}"
                </p>

                {event.host_profile?.university && (
                  <div className="text-[10px] text-primary-400 font-bold mt-4 pt-3 border-t border-primary-100/50 w-full">
                    Alumnus: {event.host_profile.university}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="glass-card p-6 border-white/20 dark:border-slate-800/40 text-center">
                {event.host_id === user.id ? (
                  <div className="space-y-2">
                    <span className="w-full bg-amber-500/10 text-amber-500 border border-amber-500/20 font-extrabold py-3 px-4 rounded-xl flex items-center justify-center gap-2 text-xs">
                      <Award className="h-4.5 w-4.5" />
                      <span>You are hosting this event</span>
                    </span>
                  </div>
                ) : (
                  <button
                    onClick={handleJoinToggle}
                    className={`w-full font-extrabold py-3 px-6 rounded-2xl text-sm transition-all duration-200 ${
                      event.participants.some(p => p.user_id === user.id)
                        ? 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-md shadow-emerald-500/10'
                        : 'bg-gradient-to-r from-primary-900 to-slate-800 dark:from-white dark:to-slate-100 text-white dark:text-primary-950 hover:opacity-95'
                    }`}
                  >
                    {event.participants.some(p => p.user_id === user.id) ? 'Joined ✓ Leave Meetup' : 'Join Meetup'}
                  </button>
                )}

                <p className="text-[10px] text-primary-400 font-semibold leading-relaxed mt-3">
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
