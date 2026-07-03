import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { eventsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar, MapPin, Plus, X, Award, ShieldAlert, CheckCircle, Clock, Users 
} from 'lucide-react';

const Events = () => {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState('All');
  
  // Create Event Form states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [location, setLocation] = useState('');
  const [category, setCategory] = useState('Gaming');
  const [maxParticipants, setMaxParticipants] = useState(8);
  const [createLoading, setCreateLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const categories = ['All', 'Gaming', 'Movies', 'Football', 'Cafe', 'Study', 'Anime', 'Other'];

  const loadEvents = async (cat) => {
    try {
      setLoading(true);
      const res = await eventsAPI.getEvents(cat === 'All' ? null : cat);
      setEvents(res.data);
    } catch (err) {
      console.error("Failed to load events list:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEvents(categoryFilter);
  }, [categoryFilter]);

  const handleJoinToggle = async (eventId) => {
    try {
      const res = await eventsAPI.joinEvent(eventId);
      // Re-fetch listing to update participants list and button states
      loadEvents(categoryFilter);
      
      setSuccessMsg(res.data.message);
      setTimeout(() => setSuccessMsg(''), 2500);
    } catch (err) {
      console.error("Failed to toggle join state on event:", err);
      alert(err.response?.data?.detail || "Could not complete registration.");
    }
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    if (!title || !description || !date || !time || !location) {
      alert("Please fill in all details");
      return;
    }
    setCreateLoading(true);
    try {
      await eventsAPI.createEvent({
        title,
        description,
        date,
        time,
        location,
        category,
        max_participants: parseInt(maxParticipants)
      });
      
      setSuccessMsg("Event created successfully!");
      setTimeout(() => setSuccessMsg(''), 2500);
      
      // Reset inputs & close modal
      setTitle('');
      setDescription('');
      setDate('');
      setTime('');
      setLocation('');
      setCategory('Gaming');
      setMaxParticipants(8);
      setShowCreateModal(false);
      
      // Reload list
      loadEvents(categoryFilter);
    } catch (err) {
      console.error("Failed to create event:", err);
      alert("Failed to build event. Verify inputs.");
    } finally {
      setCreateLoading(false);
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
            <CheckCircle className="h-5 w-5 shrink-0 stroke-[2.5px]" />
            <span>{successMsg}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-extrabold tracking-tight">Social Events</h2>
          <p className="text-primary-400 dark:text-slate-400 text-xs font-semibold">Coordinate local meetups with like-minded buddies or create your own circle.</p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="btn-primary py-2.5 px-5 text-xs flex items-center gap-2 self-start shrink-0 shadow-md"
        >
          <Plus className="h-4 w-4 stroke-[2.5px]" />
          <span>Host Event</span>
        </button>
      </div>

      {/* Category filter chips */}
      <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategoryFilter(cat)}
            className={`text-xs font-bold py-2 px-4 rounded-xl border shrink-0 transition-all ${
              categoryFilter === cat
                ? 'bg-gradient-to-r from-primary-900 to-slate-800 dark:from-white dark:to-slate-100 text-white dark:text-primary-950 border-transparent shadow-sm'
                : 'bg-white/40 dark:bg-slate-900/40 border-primary-200/50 dark:border-slate-800/80 text-primary-500 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-900'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Events Listing Grid */}
      <AnimatePresence mode="wait">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map(n => (
              <div key={n} className="glass-card h-[250px] animate-pulse border-white/20 dark:border-slate-800" />
            ))}
          </div>
        ) : events.length > 0 ? (
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {events.map((event) => {
              const isJoined = event.participants.some(p => p.user_id === user.id);
              const isHost = event.host_id === user.id;
              
              return (
                <div 
                  key={event.id}
                  className="glass-card p-6 border-white/20 dark:border-slate-800/40 flex flex-col justify-between hover:shadow-lg transition-all duration-300 relative overflow-hidden"
                >
                  <div>
                    {/* Event top details header */}
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <span className="inline-block text-[9px] bg-primary-100 dark:bg-slate-800 text-primary-600 dark:text-slate-300 font-extrabold uppercase py-0.5 px-2 rounded-md border border-primary-200/20 mb-2">
                          {event.category}
                        </span>
                        <Link to={`/events/${event.id}`}>
                          <h4 className="font-extrabold text-base hover:text-secondary-500 transition-colors line-clamp-1">
                            {event.title}
                          </h4>
                        </Link>
                      </div>

                      <div className="shrink-0 flex items-center gap-1.5" title="Host Profile">
                        <img 
                          src={event.host_profile?.profile_pic || "https://api.dicebear.com/7.x/adventurer/svg?seed=Host"} 
                          alt="Host" 
                          className="h-8 w-8 rounded-lg bg-secondary-50 border border-white object-cover"
                        />
                      </div>
                    </div>

                    <p className="text-xs text-primary-400 dark:text-slate-400 font-semibold line-clamp-2 leading-relaxed mt-2.5">
                      {event.description}
                    </p>
                  </div>

                  {/* Info details footer */}
                  <div className="mt-4 pt-4 border-t border-primary-100/50 dark:border-slate-800/40 space-y-3">
                    <div className="grid grid-cols-2 gap-2 text-xs font-semibold text-primary-500 dark:text-slate-400">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="h-4 w-4 text-secondary-400 shrink-0" />
                        <span className="line-clamp-1">{event.date}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock className="h-4 w-4 text-secondary-400 shrink-0" />
                        <span>{event.time}</span>
                      </div>
                      <div className="flex items-center gap-1.5 col-span-2">
                        <MapPin className="h-4 w-4 text-accent-coral shrink-0" />
                        <span className="line-clamp-1">{event.location}</span>
                      </div>
                    </div>

                    {/* Participant Avatars */}
                    <div className="flex justify-between items-center pt-2">
                      <div className="flex items-center gap-2">
                        <div className="flex -space-x-2">
                          {event.participants.slice(0, 4).map((p, i) => (
                            <img 
                              key={i} 
                              src={p.profile?.profile_pic || `https://api.dicebear.com/7.x/adventurer/svg?seed=${p.user_id}`} 
                              alt="Participant" 
                              className="h-6 w-6 rounded-full border-2 border-white dark:border-slate-900 object-cover bg-slate-100"
                              title={p.profile?.name}
                            />
                          ))}
                        </div>
                        <span className="text-[10px] text-primary-400 font-bold">
                          {event.participants.length}/{event.max_participants} joined
                        </span>
                      </div>

                      {/* Join CTA */}
                      {isHost ? (
                        <span className="text-[10px] bg-amber-500/10 text-amber-500 border border-amber-500/20 font-extrabold px-3 py-1.5 rounded-xl flex items-center gap-1">
                          <Award className="h-3.5 w-3.5" />
                          <span>Hosting</span>
                        </span>
                      ) : (
                        <button
                          onClick={() => handleJoinToggle(event.id)}
                          className={`text-[10px] font-bold px-4 py-2 rounded-xl transition-all duration-200 ${
                            isJoined
                              ? 'bg-emerald-500 text-white shadow-sm'
                              : 'bg-white/80 dark:bg-slate-900/80 border border-primary-200/50 dark:border-slate-800 text-primary-700 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-900'
                          }`}
                        >
                          {isJoined ? 'Joined ✓' : 'Join'}
                        </button>
                      )}
                    </div>
                  </div>

                </div>
              );
            })}
          </motion.div>
        ) : (
          <div className="glass-card p-12 text-center text-primary-400 dark:text-slate-400 font-semibold text-xs leading-relaxed border-white/20 dark:border-slate-800">
            No events scheduled in this category yet. Be the first to host one!
          </div>
        )}
      </AnimatePresence>

      {/* Host Event Dialog Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <div className="fixed inset-0 z-40 flex items-center justify-center bg-primary-950/20 backdrop-blur-sm p-4">
            <motion.div 
              className="glass-card w-full max-w-lg p-6 md:p-8 border-white/30 dark:border-slate-800 relative max-h-[90vh] overflow-y-auto"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
            >
              {/* Modal Header */}
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-extrabold text-lg uppercase tracking-wider">Host a Meetup</h3>
                <button 
                  onClick={() => setShowCreateModal(false)}
                  className="p-1 rounded-lg hover:bg-primary-100 dark:hover:bg-slate-800 text-primary-400"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Form fields */}
              <form onSubmit={handleCreateSubmit} className="space-y-4 text-left">
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-primary-400 dark:text-slate-400 pl-1">Event Title</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Board Games & Espresso"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="glass-input"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold uppercase tracking-wider text-primary-400 dark:text-slate-400 pl-1">Category</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="glass-input bg-transparent"
                    >
                      {categories.slice(1).map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold uppercase tracking-wider text-primary-400 dark:text-slate-400 pl-1">Max Participants</label>
                    <input 
                      type="number" 
                      min="2" 
                      max="100"
                      value={maxParticipants}
                      onChange={(e) => setMaxParticipants(e.target.value)}
                      className="glass-input"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold uppercase tracking-wider text-primary-400 dark:text-slate-400 pl-1">Date</label>
                    <input 
                      type="date" 
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="glass-input"
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold uppercase tracking-wider text-primary-400 dark:text-slate-400 pl-1">Time</label>
                    <input 
                      type="time" 
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                      className="glass-input"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-primary-400 dark:text-slate-400 pl-1">Location / Venue</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Ritual Coffee Roasters, Valencia St"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="glass-input"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-primary-400 dark:text-slate-400 pl-1">Description</label>
                  <textarea 
                    rows="3"
                    placeholder="Provide details about what we will do, what to bring, and how to find the group at the location..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="glass-input resize-none"
                    required
                  />
                </div>

                <button 
                  type="submit" 
                  disabled={createLoading}
                  className="w-full btn-primary py-3.5 mt-2 flex items-center justify-center font-bold text-sm"
                >
                  {createLoading ? 'Publishing Event...' : 'Create Event'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default Events;
