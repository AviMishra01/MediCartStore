import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, LogIn, X, Eye, EyeOff } from 'lucide-react';
import { useAuth } from "@/context/AuthContext";
import { apiPost } from '@/lib/api';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [requiresCode, setRequiresCode] = useState(false);
  const [code, setCode] = useState('');
  const [showPassword, setShowPassword] = useState(false); // 👈 added state

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.email || !formData.password) {
      setError("Please enter both email and password.");
      return;
    }

    setLoading(true);

    try {
      try {
        const adminRes = await apiPost<{ requiresCode?: boolean }>('/api/admin/login', { email: formData.email, password: formData.password });
        if (adminRes?.requiresCode) {
          setRequiresCode(true);
          return;
        }
      } catch (adminErr: any) {
        const msg = adminErr?.message || String(adminErr || '');
        if (!/401|Invalid credentials/i.test(msg)) {
          throw adminErr;
        }
      }

      await login(formData.email, formData.password);
      navigate('/');
    } catch (err: any) {
      const errorMessage = err?.message || "Sign-in failed. Please try again.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleCodeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await apiPost<{ token?: string }>('/api/admin/verify', { email: formData.email, code });
      if (res?.token) {
        localStorage.setItem('ADMIN_TOKEN', res.token);
        window.location.href = '/admin';
        return;
      }
      setError('Invalid admin code');
    } catch (err: any) {
      setError(err?.message || 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-12 flex justify-center items-center min-h-[70vh]">
      <div className="w-full max-w-md bg-white rounded-xl shadow-2xl border border-gray-100 p-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h2>
          <p className="text-gray-500">Sign in to access your dashboard and manage orders.</p>
        </div>

        {error && (
          <div className="mb-6 p-4 text-sm text-red-700 bg-red-100 border border-red-300 rounded-lg flex items-start">
            <X size={16} className="mt-0.5 mr-2 min-w-[16px]" />
            {error}
          </div>
        )}

        {requiresCode ? (
          <form className="space-y-6" onSubmit={handleCodeSubmit}>
            <div>
              <label htmlFor="code" className="sr-only">6-digit code</label>
              <div className="relative">
                <input
                  id="code"
                  name="code"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/50 outline-none transition"
                  placeholder="Enter 6-digit code"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <button
                className="px-4 py-2 rounded-lg bg-primary text-primary-foreground"
                type="submit"
                disabled={loading}
              >
                Verify code
              </button>
              <button
                type="button"
                onClick={() => { setRequiresCode(false); setLoading(false); }}
                className="text-sm text-gray-600 hover:underline"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Email Input */}
            <div>
              <label htmlFor="email" className="sr-only">Email</label>
              <div className="relative">
                <Mail size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  id="email"
                  name="email"
                  className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/50 outline-none transition"
                  placeholder="name@example.com"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  disabled={loading}
                />
              </div>
            </div>

            {/* Password Input with Toggle */}
            <div>
              <label htmlFor="password" className="sr-only">Password</label>
              <div className="relative">
                <Lock size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  id="password"
                  name="password"
                  className="w-full p-3 pl-10 pr-10 border border-gray-300 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/50 outline-none transition"
                  placeholder="Password"
                  type={showPassword ? "text" : "password"} // 👈 toggle type
                  value={formData.password}
                  onChange={handleChange}
                  required
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)} // 👈 toggle state
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />} {/* 👈 switch icons */}
                </button>
              </div>
            </div>

            <div className="flex justify-end">
              <Link to="/forgot-password" className="text-sm text-gray-600 hover:text-primary hover:underline transition">
                Forgot password?
              </Link>
            </div>

            <button
              className="w-full h-12 rounded-lg bg-primary font-semibold text-primary-foreground text-lg hover:bg-primary/90 transition disabled:opacity-50 flex items-center justify-center shadow-md shadow-primary/20"
              type="submit"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center">
                  <svg className="animate-spin h-5 w-5 mr-3 text-white" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                  </svg>
                  Authenticating...
                </span>
              ) : (
                <span className="flex items-center"><LogIn size={20} className="mr-2" /> Sign In</span>
              )}
            </button>
          </form>
        )}

        <div className="mt-6">
          <div className="relative flex justify-center text-xs uppercase my-6">
            <span className="bg-white px-2 text-gray-400">Or continue with</span>
            <div className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-gray-200 -z-10"></div>
          </div>

          <div className="flex gap-4">
            <button
              className="flex-1 h-12 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition flex items-center justify-center gap-2 font-medium"
              onClick={() => console.log('Google Sign-in triggered')}
              type="button"
            >
              <img src="https://cdn1.iconfinder.com/data/icons/google-s-logo/150/Google_Icons-09-512.png" alt="Google" className="h-5 w-5" />
              Google
            </button>
            <button
              className="flex-1 h-12 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition flex items-center justify-center gap-2 font-medium"
              onClick={() => console.log('Facebook Sign-in triggered')}
              type="button"
            >
              <img src="https://upload.wikimedia.org/wikipedia/commons/5/51/Facebook_f_logo_%282019%29.svg" alt="Facebook" className="h-5 w-5" />
              Facebook
            </button>
          </div>
        </div>

        <p className="mt-8 text-center text-sm text-gray-600">
          Don't have an account?{' '}
          <Link to="/signup" className="font-semibold text-primary hover:underline transition">
            Create a free account
          </Link>
        </p>
      </div>
    </div>
  );
}
