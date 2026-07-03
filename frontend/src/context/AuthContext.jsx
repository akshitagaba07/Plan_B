import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI, profileAPI } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const fetchUser = async () => {
    try {
      const response = await authAPI.getMe();
      setUser(response.data);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Failed to fetch authenticated user profile:', error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('plan_b_token');
    if (token) {
      fetchUser();
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const response = await authAPI.login(email, password);
      localStorage.setItem('plan_b_token', response.data.access_token);
      await fetchUser();
      return true;
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  const signup = async (email, password) => {
    setLoading(true);
    try {
      const response = await authAPI.register(email, password);
      localStorage.setItem('plan_b_token', response.data.access_token);
      await fetchUser();
      return true;
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  const googleLogin = async (email, name, picture) => {
    setLoading(true);
    try {
      const response = await authAPI.googleLogin(email, name, picture);
      localStorage.setItem('plan_b_token', response.data.access_token);
      await fetchUser();
      return true;
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('plan_b_token');
    setUser(null);
    setIsAuthenticated(false);
    setLoading(false);
  };

  const updateProfile = async (profileData) => {
    try {
      const response = await profileAPI.updateProfile(profileData);
      setUser(prev => ({
        ...prev,
        profile: {
          ...prev.profile,
          ...response.data
        }
      }));
      return response.data;
    } catch (error) {
      console.error('Error updating profile context:', error);
      throw error;
    }
  };

  const updateProfilePicture = async (formData) => {
    try {
      const response = await profileAPI.uploadPicture(formData);
      setUser(prev => ({
        ...prev,
        profile: {
          ...prev.profile,
          profile_pic: response.data.profile_pic
        }
      }));
      return response.data;
    } catch (error) {
      console.error('Error uploading profile picture:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      isAuthenticated,
      login,
      signup,
      googleLogin,
      logout,
      updateProfile,
      updateProfilePicture,
      setUser
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
