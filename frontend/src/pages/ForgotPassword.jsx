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
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center px-6 py-12 relative overflow-hidden font-outfit text-white">
      {/* Background Floating Orbs */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-purple-900/10 blur-[120px] animate-aurora-slow" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-[#DFFE00]/5 blur-[130px] animate-aurora-medium" />
      </div>

      {/* Back to login */}
      <Link to="/login" className="absolute top-6 left-6 flex items-center gap-2 font-bold text-xs uppercase tracking-wider text-slate-400 hover:text-white transition-colors duration-200 z-10">
        ← BACK TO LOGIN
      </Link>

      <motion.div 
        className="w-full max-w-md glass-card p-8 md:p-10 border-white/5 relative z-10 bg-black/45"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        {!success ? (
          <>
            {/* Header */}
            <div className="text-center space-y-2 mb-8">
              <div className="mx-auto h-12 w-12 rounded-xl bg-[#DFFE00] flex items-center justify-center shadow-lg shadow-[#DFFE00]/10 mb-4">
                <span className="text-black font-extrabold text-2xl tracking-tighter">B</span>
              </div>
              <h2 className="text-2xl font-syne font-extrabold uppercase tracking-tight text-white">Recover Password</h2>
              <p className="text-slate-400 font-semibold text-xs leading-relaxed mt-2">
                Enter your registered email below, and we will send instructions to reset your password.
              </p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-semibold rounded-2xl flex items-center gap-3">
                <ShieldAlert className="h-5 w-5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1 text-left">
                <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 pl-1">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-3.5 h-5 w-5 text-slate-500 stroke-[1.8px]" />
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
                className="w-full btn-primary py-3.5 mt-4 flex items-center justify-center disabled:opacity-50 tracking-wider uppercase"
              >
                {loading ? 'Sending Recovery Email...' : 'Send Recovery Email'}
              </button>
            </form>
          </>
        ) : (
          <div className="text-center py-6 space-y-6">
            <div className="mx-auto h-16 w-16 rounded-full bg-[#DFFE00]/10 border border-[#DFFE00]/20 flex items-center justify-center text-[#DFFE00] mb-2">
              <CheckCircle2 className="h-10 w-10 stroke-[2px]" />
            </div>
            
            <div className="space-y-2">
              <h2 className="text-2xl font-syne font-extrabold uppercase tracking-tight text-white">Check your email</h2>
              <p className="text-slate-400 font-semibold text-sm leading-relaxed px-4 mt-2">
                We've sent a password recovery link to <span className="text-[#DFFE00] font-bold">{email}</span>. Please verify your inbox and spam folder.
              </p>
            </div>

            <Link to="/login" className="w-full btn-primary py-3.5 inline-block text-sm font-extrabold uppercase tracking-wider">
              Return to Login
            </Link>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default ForgotPassword;
