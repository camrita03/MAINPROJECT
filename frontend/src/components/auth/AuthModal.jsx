import React, { useState } from 'react';
import API from '../../utils/api';
import { Mail, Lock, User, X, LogIn, UserPlus } from 'lucide-react';
import { Button } from '../ui/Button';

export const AuthModal = ({ isOpen, onClose, onSuccess }) => {
  const [isLogin, setIsLogin] = useState(false); // default mode signup as requested
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const normalizedEmail = formData.email.toLowerCase().trim();

    try {
      let result;
      // SMART AUTH FLOW:
      // When user submits, first try login
      try {
        const { data } = await API.post("/auth/login", { 
          email: normalizedEmail, 
          password: formData.password 
        });
        result = data;
      } catch (loginError) {
        // Only automatically attempt signup if the user literally doesn't exist
        if (loginError.response?.data?.message === "Email not registered") {
          const { data } = await API.post("/auth/register", {
            name: formData.name || 'User', // dynamic fallback
            email: normalizedEmail,
            password: formData.password
          });
          result = data;
        } else {
          // If it's "Invalid password" or standard error, we throw it to be caught normally
          throw loginError;
        }
      }

      // Success: Save token and redirect
      localStorage.setItem("token", result.token);
      onSuccess(result.token);
      onClose();
      
      // Navigate to profile page exactly as requested
      window.location.href = '/profile';
      
    } catch (finalError) {
      setError(finalError.response?.data?.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm">
      <div 
        className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100 p-8 pt-10 animate-in fade-in zoom-in duration-300"
        onClick={e => e.stopPropagation()}
      >
        <button 
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 transition"
        >
          <X size={24} />
        </button>

        <div className="text-center mb-8">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-linear-to-br from-[#4A90E2] to-[#3B82F6] flex items-center justify-center text-white shadow-lg mb-4">
            <span className="text-2xl font-black italic">Y</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900">
            {isLogin ? 'Welcome Back' : 'Create an Account'}
          </h2>
          <p className="text-sm text-slate-500 mt-2">
            Unlock personalized AI career guidance
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-50 text-red-600 text-sm font-medium text-center border border-red-100">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={formData.name}
                onChange={handleChange}
                className="w-full h-12 pl-12 pr-4 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-hidden focus:border-[#4A90E2] transition-colors"
                required={!isLogin}
              />
            </div>
          )}

          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              className="w-full h-12 pl-12 pr-4 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-hidden focus:border-[#4A90E2] transition-colors"
              required
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full h-12 pl-12 pr-4 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-hidden focus:border-[#4A90E2] transition-colors"
              required
              minLength={6}
            />
          </div>

          <Button type="submit" isLoading={loading} className="w-full h-12 !rounded-xl !mt-6 shadow-md text-base">
            {isLogin ? (
              <>Login <LogIn className="ml-2 w-5 h-5" /></>
            ) : (
              <>Sign Up <UserPlus className="ml-2 w-5 h-5" /></>
            )}
          </Button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-sm text-slate-500">
            {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
            <button 
              onClick={() => {
                setIsLogin(!isLogin);
                setError('');
              }}
              className="font-bold text-[#4A90E2] hover:text-[#3B82F6] transition"
            >
              {isLogin ? "Sign up" : "Login"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};
