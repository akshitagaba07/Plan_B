import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { ChatProvider } from './context/ChatContext';

// Import Pages
import Landing from './pages/Landing';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ForgotPassword from './pages/ForgotPassword';
import Profile from './pages/Profile';
import Dashboard from './pages/Dashboard';
import Discover from './pages/Discover';
import Matches from './pages/Matches';
import Events from './pages/Events';
import EventDetails from './pages/EventDetails';
import Community from './pages/Community';
import Chat from './pages/Chat';
import Wellness from './pages/Wellness';
import Assistant from './pages/Assistant';
import Settings from './pages/Settings';

// Import Components
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';

// Private Route Guard
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-mesh dark:bg-slate-950 flex items-center justify-center font-outfit">
        <div className="text-center space-y-4">
          <div className="animate-spin h-10 w-10 border-4 border-secondary-400 border-t-transparent rounded-full mx-auto" />
          <p className="text-primary-400 dark:text-slate-400 font-extrabold text-xs uppercase tracking-widest">Checking Session Vibe...</p>
        </div>
      </div>
    );
  }

  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

// Layout Manager: Show Sidebar/Navbar only when authenticated and inside dashboard routes
const AppLayout = () => {
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  
  const authRoutes = ['/', '/login', '/signup', '/forgot-password'];
  const showChrome = isAuthenticated && !authRoutes.includes(location.pathname);

  return (
    <div className="min-h-screen bg-gradient-mesh dark:bg-slate-950 text-primary-900 dark:text-slate-100 flex flex-col transition-colors duration-300">
      {/* Mobile-only Bottom Tab bar */}
      {showChrome && <Sidebar />}

      {/* Main Content Area */}
      <main className={`flex-1 flex flex-col min-w-0 w-full ${showChrome ? 'p-4 md:p-6' : 'p-0'}`}>
        {showChrome && <Navbar />}
        <Routes>
          {/* Public Views */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          {/* Protected Dashboard Views */}
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/discover" element={<ProtectedRoute><Discover /></ProtectedRoute>} />
          <Route path="/matches" element={<ProtectedRoute><Matches /></ProtectedRoute>} />
          <Route path="/events" element={<ProtectedRoute><Events /></ProtectedRoute>} />
          <Route path="/events/:eventId" element={<ProtectedRoute><EventDetails /></ProtectedRoute>} />
          <Route path="/community" element={<ProtectedRoute><Community /></ProtectedRoute>} />
          <Route path="/chat" element={<ProtectedRoute><Chat /></ProtectedRoute>} />
          <Route path="/wellness" element={<ProtectedRoute><Wellness /></ProtectedRoute>} />
          <Route path="/assistant" element={<ProtectedRoute><Assistant /></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />

          {/* Catch-all Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ChatProvider>
          <Router>
            <AppLayout />
          </Router>
        </ChatProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
