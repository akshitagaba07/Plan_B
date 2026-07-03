import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, CheckCircle2, ShieldAlert } from 'lucide-react';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    
    if (!email) {
      setError('Please provide your email address');
      return;
    }
    
    setLoading(true);
    // Simulate API delay
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-gradient-mesh dark:bg-slate-950 flex flex-col justify-center items-center px-6 py-12 relative overflow-hidden font-outfit">
      {/* Back to login */}
      <Link to="/login" className="absolute top-6 left-6 flex items-center gap-2 font-bold text-sm text-primary-500 hover:text-primary-800 dark:text-slate-400 dark:hover:text-white transition-colors duration-200">
        ← Back to Login
      </Link>

      <motion.div 
        className="w-full max-w-md glass-card p-8 md:p-10 border-white/30 dark:border-slate-800"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        {!success ? (
          <>
            {/* Header */}
            <div className="text-center space-y-2 mb-8">
              <div className="mx-auto h-12 w-12 rounded-2xl bg-gradient-to-tr from-primary-900 to-secondary-500 flex items-center justify-center shadow-lg mb-4">
                <span className="text-white font-extrabold text-2xl">B</span>
              </div>
              <h2 className="text-2xl font-extrabold tracking-tight">Recover Password</h2>
              <p className="text-primary-400 dark:text-slate-400 font-semibold text-xs leading-relaxed">
                Enter your registered email below, and we will send instructions to reset your password.
              </p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-500 text-sm font-semibold rounded-2xl flex items-center gap-3">
                <ShieldAlert className="h-5 w-5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1 text-left">
                <label className="text-xs font-bold uppercase tracking-wider text-primary-400 dark:text-slate-400 pl-1">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-3.5 h-5 w-5 text-primary-400 dark:text-slate-500 stroke-[1.8px]" />
                  <input 
                    type="email" 
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="glass-input pl-12"
                  />
                </div>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full btn-primary py-3.5 mt-2 flex items-center justify-center disabled:opacity-50 font-semibold text-sm"
              >
                {loading ? 'Sending Recovery Email...' : 'Send Recovery Email'}
              </button>
            </form>
          </>
        ) : (
          <div className="text-center py-6 space-y-6">
            <div className="mx-auto h-16 w-16 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500 mb-2">
              <CheckCircle2 className="h-10 w-10 stroke-[2px]" />
            </div>
            
            <div className="space-y-2">
              <h2 className="text-2xl font-extrabold tracking-tight">Check your email</h2>
              <p className="text-primary-400 dark:text-slate-400 font-semibold text-sm leading-relaxed px-4">
                We've sent a password recovery link to <span className="text-primary-800 dark:text-slate-200 font-bold">{email}</span>. Please verify your inbox and spam folder.
              </p>
            </div>

            <Link to="/login" className="w-full btn-primary py-3.5 inline-block text-sm font-semibold">
              Return to Login
            </Link>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default ForgotPassword;
