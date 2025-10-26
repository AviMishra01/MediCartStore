import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

export default function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/');
    } else {
      setLoading(false);
    }
  }, [user, navigate]);

  const onLogout = async () => {
    setLoggingOut(true);
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
      setLoggingOut(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-sm text-gray-600">Loading profile...</p>
      </div>
    );
  }

  const addresses = [
    {
      label: 'Home',
      line1: '123 Main Street',
      line2: 'Apt 4B',
      city: 'New York',
      state: 'NY',
      zip: '10001',
      country: 'USA',
    },
    {
      label: 'Work',
      line1: '456 Market St',
      line2: 'Floor 10',
      city: 'San Francisco',
      state: 'CA',
      zip: '94105',
      country: 'USA',
    },
  ];

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* Profile Info */}
        <div className="md:col-span-1 bg-white rounded-lg border p-6 shadow-sm flex flex-col items-center text-center">
          <img
            src={user.avatarUrl || 'https://via.placeholder.com/100'}
            alt="Avatar"
            className="h-24 w-24 rounded-full object-cover border"
          />
          <h2 className="mt-4 text-xl font-semibold text-gray-800">{user.name || 'No Name'}</h2>
          <p className="text-sm text-gray-500">{user.email || 'No Email'}</p>
          <p className="text-sm text-gray-500 mt-1">{user.phone || 'No phone number'}</p>

          <button
            onClick={onLogout}
            disabled={loggingOut}
            className={`mt-6 w-full inline-flex justify-center items-center rounded-md border border-gray-300 px-4 py-2 text-sm font-medium transition ${
              loggingOut ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white hover:bg-gray-50 text-gray-700'
            }`}
          >
            {loggingOut ? 'Logging out...' : 'Log out'}
          </button>

          {/* Optional: CEO Story Link */}
          <Link
            to="/my-profile"
            className="mt-4 text-blue-600 hover:underline text-sm flex items-center gap-1"
          >
            🌟 Meet Our Founder & CEO
          </Link>
        </div>

        {/* Address Info */}
        <div className="md:col-span-2 bg-white rounded-lg border p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-800">Saved Addresses</h3>
            <button className="text-sm text-blue-600 hover:underline">+ Add New Address</button>
          </div>

          {addresses.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2">
              {addresses.map((addr, index) => (
                <div key={index} className="border border-gray-200 rounded-md p-4 text-sm">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-medium text-gray-700">{addr.label}</span>
                    <button className="text-xs text-blue-600 hover:underline">Edit</button>
                  </div>
                  <p>{addr.line1}</p>
                  <p>{addr.line2}</p>
                  <p>
                    {addr.city}, {addr.state} {addr.zip}
                  </p>
                  <p>{addr.country}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">No addresses saved.</p>
          )}
        </div>
      </div>
    </div>
  );
}
