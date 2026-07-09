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

  const decodeJwt = (token) => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      return JSON.parse(jsonPayload);
    } catch (e) {
      console.error("JWT decoding failed:", e);
      return null;
    }
  };

  const handleGoogleLoginSuccess = async (credentialResponse) => {
    setError('');
    setLoading(true);
    try {
      const decoded = decodeJwt(credentialResponse.credential);
      if (!decoded) {
        throw new Error('Invalid credential token');
      }
      const { email, name, picture } = decoded;
      await googleLogin(email, name, picture);
      
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

  React.useEffect(() => {
    const initializeGoogleSignIn = () => {
      if (window.google) {
        window.google.accounts.id.initialize({
          client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID || "1028746672392-7l2fbgmcfmdnca123df7a78a78a78a78.apps.googleusercontent.com",
          callback: handleGoogleLoginSuccess
        });
        window.google.accounts.id.renderButton(
          document.getElementById("googleSignInDiv"),
          { theme: "outline", size: "large", width: 380, text: "signup_with", shape: "rectangular" }
        );
      }
    };

    if (!window.google) {
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = initializeGoogleSignIn;
      document.body.appendChild(script);
    } else {
      initializeGoogleSignIn();
    }
  }, []);

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
      navigate('/profile');
    } catch (err) {
      setError(err.response?.data?.detail || 'Registration failed. Try a different email.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center px-6 py-12 relative overflow-hidden font-outfit text-white">
      {/* Background Floating Orbs */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-purple-900/10 blur-[120px] animate-aurora-slow" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-[#DFFE00]/5 blur-[130px] animate-aurora-medium" />
      </div>

      {/* Back to landing */}
      <Link to="/" className="absolute top-6 left-6 flex items-center gap-2 font-bold text-xs uppercase tracking-wider text-slate-400 hover:text-white transition-colors duration-200 z-10">
        ← BACK HOME
      </Link>

      <motion.div 
        className="w-full max-w-md glass-card p-8 md:p-10 border-white/5 relative z-10 bg-black/45"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        {/* Header Logo */}
        <div className="text-center space-y-2 mb-8">
          <div className="mx-auto h-12 w-12 rounded-xl bg-[#DFFE00] flex items-center justify-center shadow-lg shadow-[#DFFE00]/10 mb-4">
            <span className="text-black font-extrabold text-2xl tracking-tighter">B</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-syne font-extrabold uppercase tracking-tight text-white">Create <span className="text-neon-glow text-[#DFFE00]">Account</span></h2>
          <p className="text-[#DFFE00] font-extrabold text-[10px] uppercase tracking-widest mt-1">Start discovering new people</p>
        </div>

        {/* Error Alert */}
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

          <div className="space-y-1 text-left">
            <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 pl-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-3.5 h-5 w-5 text-slate-500 stroke-[1.8px]" />
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
            <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 pl-1">Confirm Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-3.5 h-5 w-5 text-slate-500 stroke-[1.8px]" />
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
            className="w-full btn-primary py-3.5 mt-4 flex items-center justify-center disabled:opacity-50 tracking-wider uppercase"
          >
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>

        <div className="relative my-6 text-center">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/5"></div></div>
          <span className="relative bg-slate-950 px-3 text-[9px] font-extrabold uppercase tracking-widest text-slate-500">Or sign up with</span>
        </div>

        <div className="flex justify-center w-full mt-4">
          <div id="googleSignInDiv" className="w-full min-h-[44px]"></div>
        </div>

        <p className="text-center text-xs font-semibold text-slate-400 mt-8 uppercase tracking-wider">
          Already have an account? <Link to="/login" className="text-[#DFFE00] hover:underline font-bold">Sign in</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Signup;
