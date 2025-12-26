
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import API_CONFIG from '../config/api';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      setLoading(false);
      return;
    }



    try {
      const baseURL = API_CONFIG.getBaseURL();
      const signupURL = `${baseURL}/auth/signup`;
      
      console.log('🔍 Attempting signup to:', signupURL);
      console.log('📊 Form data:', {
        name: formData.name,
        email: formData.email,
        password: formData.password ? '***' : ''
      });

      const response = await axios.post(signupURL, {
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password
      }, {
        timeout: 15000,
        headers: {
          'Content-Type': 'application/json'
        }
      });

      console.log('✅ Signup successful!', {
        status: response.status,
        hasToken: !!response.data.token,
        hasUser: !!response.data.user,
        userEmail: response.data.user?.email
      });

      // Store auth data
      if (response.data.token && response.data.user) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        console.log('💾 Auth data stored in localStorage');
        
        // Navigate to dashboard
        navigate('/dashboard');
        console.log('🧭 Navigating to dashboard...');
      } else {
        throw new Error('Invalid response: missing token or user data');
      }
      
    } catch (err) {
      console.error('❌ Signup failed:', {
        message: err.message,
        status: err.response?.status,
        data: err.response?.data,
        code: err.code
      });
      
      if (err.response?.status === 400) {
        setError(err.response.data.message || 'Invalid input data');
      } else if (err.response?.status === 409) {
        setError('User already exists with this email');
      } else if (err.response?.status >= 500) {
        setError('Server error. Please try again later.');
      } else if (err.code === 'ECONNREFUSED') {
        setError('Cannot connect to server. Is the backend running on port 5001?');
      } else if (err.code === 'NETWORK_ERROR' || err.message.includes('Network Error')) {
        setError('Network error. Check if the backend server is running on http://localhost:5001');
      } else {
        setError(`Signup failed: ${err.message}`);
      }
    }

    setLoading(false);
  };

  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-center mb-6">Sign Up for ProposifyAI</h2>


      {/* Development mode indicator */}
      {process.env.NODE_ENV === 'development' && (
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded">
          <p className="text-blue-800 text-sm">
            🔧 <strong>Development Mode:</strong> API endpoint configured from environment
          </p>
          <p className="text-blue-600 text-xs mt-1">
            Using: {API_CONFIG.getBaseURL()}
          </p>
        </div>
      )}

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
            Full Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
            minLength="2"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
            minLength="6"
          />
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="confirmPassword">
            Confirm Password
          </label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
            minLength="6"
          />
        </div>

        <div className="flex items-center justify-between">
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50"
          >
            {loading ? 'Signing up...' : 'Sign Up'}
          </button>
          <Link
            to="/login"
            className="inline-block align-baseline font-bold text-sm text-blue-600 hover:text-blue-800"
          >
            Already have an account?
          </Link>
        </div>
      </form>
    </div>
  );
};

export default Signup;
