import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { Mail, Lock, ShieldAlert } from 'lucide-react';
import confetti from 'canvas-confetti';

const Signup = () => {
  const navigate = useNavigate();
  const { signup, googleLogin } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!email || !password || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    
    setLoading(true);
    try {
      await signup(email, password);
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.8 }
      });
      navigate('/profile'); // Redirect straight to the profile setup wizard
    } catch (err) {
      setError(err.response?.data?.detail || 'Registration failed. Try a different email.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError('');
    setLoading(true);
    try {
      const randomId = Math.floor(Math.random() * 1000);
      const mockEmail = `google_user_${randomId}@gmail.com`;
      const mockName = `Explorer_${randomId}`;
      const mockPic = `https://api.dicebear.com/7.x/adventurer/svg?seed=${mockName}`;
      
      await googleLogin(mockEmail, mockName, mockPic);
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.8 }
      });
      navigate('/profile');
    } catch (err) {
      setError('Google Sign-in failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-mesh dark:bg-slate-950 flex flex-col justify-center items-center px-6 py-12 relative overflow-hidden font-outfit">
      {/* Back to landing */}
      <Link to="/" className="absolute top-6 left-6 flex items-center gap-2 font-bold text-sm text-primary-500 hover:text-primary-800 dark:text-slate-400 dark:hover:text-white transition-colors duration-200">
        ← Back Home
      </Link>

      <motion.div 
        className="w-full max-w-md glass-card p-8 md:p-10 border-white/30 dark:border-slate-800"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        {/* Header Logo */}
        <div className="text-center space-y-2 mb-8">
          <div className="mx-auto h-12 w-12 rounded-2xl bg-gradient-to-tr from-primary-900 to-secondary-500 flex items-center justify-center shadow-lg mb-4">
            <span className="text-white font-extrabold text-2xl">B</span>
          </div>
          <h2 className="text-2xl font-extrabold tracking-tight">Create Backup Plan</h2>
          <p className="text-primary-400 dark:text-slate-400 font-semibold text-xs uppercase tracking-widest font-outfit">Start discovering new people</p>
        </div>

        {/* Error Alert */}
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

          <div className="space-y-1 text-left">
            <label className="text-xs font-bold uppercase tracking-wider text-primary-400 dark:text-slate-400 pl-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-3.5 h-5 w-5 text-primary-400 dark:text-slate-500 stroke-[1.8px]" />
              <input 
                type="password" 
                placeholder="Password (min 6 characters)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="glass-input pl-12"
              />
            </div>
          </div>

          <div className="space-y-1 text-left">
            <label className="text-xs font-bold uppercase tracking-wider text-primary-400 dark:text-slate-400 pl-1">Confirm Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-3.5 h-5 w-5 text-primary-400 dark:text-slate-500 stroke-[1.8px]" />
              <input 
                type="password" 
                placeholder="Re-enter password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="glass-input pl-12"
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full btn-primary py-3.5 mt-2 flex items-center justify-center disabled:opacity-50"
          >
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>

        <div className="relative my-6 text-center">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-primary-200/50 dark:border-slate-800"></div></div>
          <span className="relative bg-white dark:bg-slate-900 px-3 text-xs font-bold uppercase tracking-wider text-primary-400 dark:text-slate-500">Or sign up with</span>
        </div>

        <button 
          onClick={handleGoogleLogin}
          disabled={loading}
          className="w-full btn-secondary py-3.5 flex items-center justify-center gap-3"
        >
          <svg className="h-5 w-5 shrink-0" viewBox="0 0 24 24" width="24" height="24">
            <g transform="matrix(1, 0, 0, 1, 0, 0)">
              <path d="M21.35,11.1H12v2.7h5.38c-0.24,1.28 -0.96,2.37 -2.04,3.1v2.58h3.3c1.93,-1.78 3.04,-4.4 3.04,-7.48C21.68,11.83 21.56,11.4 21.35,11.1z" fill="#4285F4" />
              <path d="M12,20.62c2.58,0 4.74,-0.85 6.33,-2.32l-3.3,-2.58c-0.91,0.61 -2.08,0.98 -3.03,0.98 -2.33,0 -4.3,-1.57 -5.01,-3.69H3.5v2.67C5.17,16.58 8.37,20.62 12,20.62z" fill="#34A853" />
              <path d="M6.99,12.01c-0.18,-0.54 -0.28,-1.11 -0.28,-1.7s0.1,-1.16 0.28,-1.7V5.94H3.5C2.88,7.18 2.53,8.59 2.53,10.31c0,1.72 0.35,3.13 0.97,4.37l3.49,-2.67Z" fill="#FBBC05" />
              <path d="M12,5.2c1.4,0 2.66,0.48 3.65,1.43l2.74,-2.74C16.73,2.33 14.57,1.48 12,1.48c-3.63,0 -6.83,4.04 -8.5,7.18l3.49,2.67c0.71,-2.12 2.68,-3.69 5.01,-3.69z" fill="#EA4335" />
            </g>
          </svg>
          <span className="font-semibold text-sm">Google Account</span>
        </button>

        <p className="text-center text-xs font-semibold text-primary-400 dark:text-slate-400 mt-8">
          Already have an account? <Link to="/login" className="text-secondary-500 hover:underline font-bold">Sign in</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Signup;
