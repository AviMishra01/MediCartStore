import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, User, Phone, Eye, EyeOff, X, Check } from 'lucide-react';
import { useAuth } from "@/context/AuthContext";

export default function Signup() {
  const navigate = useNavigate();
  const { signup } = useAuth();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    agreedToTerms: false,
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  // State for password visibility toggles
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password.length < 8) {
        setError("Password must be at least 8 characters long.");
        return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (!formData.agreedToTerms) {
        setError("You must agree to the Terms and Privacy Policy to proceed.");
        return;
    }

    setLoading(true);

    try {
        await signup(formData.fullName, formData.email, formData.password, formData.phone);
        navigate('/');
    } catch (err: any) {
      const errorMessage = err?.message || "Registration failed. Please try again.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const PasswordToggleIcon = showPassword ? EyeOff : Eye;
  const ConfirmPasswordToggleIcon = showConfirmPassword ? EyeOff : Eye;


  return (
    <div className="container py-12 flex justify-center items-center min-h-[70vh] bg-gray-50">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-gray-100 p-8 md:p-10">
        <div className="text-center mb-8">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Join Medizo Today</h2>
            <p className="text-gray-500">Create your secure account in seconds.</p>
        </div>
        
        {/* Error Message Display */}
        {error && (
          <div className="mb-6 p-4 text-sm font-medium text-red-700 bg-red-100 border border-red-300 rounded-lg flex items-start">
            <X size={16} className="mt-0.5 mr-2 min-w-[16px]" /> 
            {error}
          </div>
        )}

        <form className="space-y-4" onSubmit={handleSubmit}>
          
          {/* Full Name Input Group */}
          <div>
            <div className="relative">
                <User size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input 
                  name="fullName"
                  className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/50 outline-none transition placeholder:text-gray-400" 
                  placeholder="Full Name" 
                  type="text"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                  disabled={loading}
                />
            </div>
          </div>

          {/* Email & Phone Group (Grid Layout for desktop) */}
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            {/* Email Input */}
            <div className="relative">
                <Mail size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input 
                  name="email"
                  className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/50 outline-none transition placeholder:text-gray-400" 
                  placeholder="Email Address" 
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  disabled={loading}
                />
            </div>
            {/* Phone Input */}
            <div className="relative">
                <Phone size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input 
                  name="phone"
                  className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/50 outline-none transition placeholder:text-gray-400" 
                  placeholder="Phone Number (Optional)" 
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  disabled={loading}
                />
            </div>
          </div>

          {/* Password Input Group */}
          <div className="relative">
              <Lock size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
                name="password"
                className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/50 outline-none transition placeholder:text-gray-400" 
                placeholder="Password (Min 8 characters)" 
                type={showPassword ? "text" : "password"} 
                value={formData.password}
                onChange={handleChange}
                minLength={8}
                required
                disabled={loading}
              />
              <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
                  disabled={loading}
              >
                  <PasswordToggleIcon size={20} />
              </button>
          </div>

          {/* Confirm Password Input Group */}
          <div className="relative">
              <Lock size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
                name="confirmPassword"
                className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/50 outline-none transition placeholder:text-gray-400" 
                placeholder="Confirm Password" 
                type={showConfirmPassword ? "text" : "password"} 
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                disabled={loading}
              />
              <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
                  disabled={loading}
              >
                  <ConfirmPasswordToggleIcon size={20} />
              </button>
          </div>
          
          {/* Terms and Privacy Checkbox */}
          <div className="flex items-start pt-2">
            <input
              id="agreedToTerms"
              name="agreedToTerms"
              type="checkbox"
              checked={formData.agreedToTerms}
              onChange={handleChange}
              className="mt-1 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary transition cursor-pointer"
              disabled={loading}
            />
            <label htmlFor="agreedToTerms" className="ml-2 text-sm text-gray-600 select-none">
              I agree to the <Link to="/terms" className="text-primary hover:underline font-medium">Terms of Service</Link> and <Link to="/privacy" className="text-primary hover:underline font-medium">Privacy Policy</Link>.
            </label>
          </div>

          {/* Sign Up Button */}
          <button 
            className="w-full h-12 rounded-lg bg-primary font-bold text-primary-foreground text-lg hover:bg-primary/90 transition disabled:opacity-50 flex items-center justify-center shadow-lg shadow-primary/30"
            type="submit" 
            disabled={loading}
          >
            {loading ? (
                <span className="flex items-center">
                  <svg className="animate-spin h-5 w-5 mr-3 text-white" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path></svg>
                  Processing...
                </span>
            ) : (
                <span className="flex items-center"><Check size={20} className="mr-2" /> Complete Sign Up</span>
            )}
          </button>
        </form>
        
        {/* Social Sign-up Section */}
        <div className="mt-8">
            <div className="relative flex justify-center text-xs uppercase my-6">
                <span className="bg-white px-2 text-gray-400">Or use a social media account</span>
                <div className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-gray-200 -z-10"></div>
            </div>

            <div className="flex gap-4">
                <button 
                    className="flex-1 h-12 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition flex items-center justify-center gap-2 font-medium shadow-sm"
                    onClick={() => console.log('Google Sign-up triggered')} 
                    type="button"
                    disabled={loading}
                >
                    <img src="https://cdn1.iconfinder.com/data/icons/google-s-logo/150/Google_Icons-09-512.png" alt="Google" className="h-5 w-5"/>
                    Google
                </button>
                <button 
                    className="flex-1 h-12 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition flex items-center justify-center gap-2 font-medium shadow-sm"
                    onClick={() => console.log('Facebook Sign-up triggered')} 
                    type="button"
                    disabled={loading}
                >
                    <img src="https://upload.wikimedia.org/wikipedia/commons/5/51/Facebook_f_logo_%282019%29.svg" alt="Facebook" className="h-5 w-5"/>
                    Facebook
                </button>
            </div>
        </div>

        {/* Login Link */}
        <p className="mt-8 text-center text-sm text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-primary hover:underline transition">
              Sign In
            </Link>
        </p>

      </div>
    </div>
  );
}
