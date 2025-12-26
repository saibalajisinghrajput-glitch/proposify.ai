import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Subscription = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubscribe = async (plan) => {
    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');

      const response = await axios.post('http://localhost:5001/api/payments/create-subscription', {
        plan
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Redirect to Stripe Checkout
      window.location.href = response.data.url;
    } catch (err) {
      setError('Failed to create subscription');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-center mb-8">Choose Your Plan</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white p-8 rounded-lg shadow-md border-2 border-gray-200">
          <h2 className="text-2xl font-bold mb-4">Free Trial</h2>
          <p className="text-4xl font-bold mb-4">$0<span className="text-lg font-normal">/month</span></p>
          <ul className="mb-6 space-y-2">
            <li>✓ 30-day free trial</li>
            <li>✓ 5 projects</li>
            <li>✓ Basic AI proposals</li>
            <li>✓ PDF export</li>
            <li>✗ Advanced AI features</li>
            <li>✗ Priority support</li>
          </ul>
          <button
            onClick={() => navigate('/dashboard')}
            className="w-full bg-gray-600 text-white py-2 px-4 rounded hover:bg-gray-700 disabled:opacity-50"
            disabled={loading}
          >
            Current Plan
          </button>
        </div>

        <div className="bg-white p-8 rounded-lg shadow-md border-2 border-blue-500 relative">
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <span className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
              Most Popular
            </span>
          </div>
          <h2 className="text-2xl font-bold mb-4">Premium</h2>
          <p className="text-4xl font-bold mb-4">$29<span className="text-lg font-normal">/month</span></p>
          <ul className="mb-6 space-y-2">
            <li>✓ Unlimited projects</li>
            <li>✓ Advanced AI proposals</li>
            <li>✓ AI contract generation</li>
            <li>✓ PDF export</li>
            <li>✓ Country-specific clauses</li>
            <li>✓ Priority support</li>
          </ul>
          <button
            onClick={() => handleSubscribe('premium')}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:opacity-50"
            disabled={loading}
          >
            {loading ? 'Processing...' : 'Subscribe'}
          </button>
        </div>

        <div className="bg-white p-8 rounded-lg shadow-md border-2 border-gray-200">
          <h2 className="text-2xl font-bold mb-4">Enterprise</h2>
          <p className="text-4xl font-bold mb-4">$99<span className="text-lg font-normal">/month</span></p>
          <ul className="mb-6 space-y-2">
            <li>✓ Everything in Premium</li>
            <li>✓ Custom AI training</li>
            <li>✓ White-label solutions</li>
            <li>✓ Dedicated account manager</li>
            <li>✓ API access</li>
            <li>✓ 24/7 phone support</li>
          </ul>
          <button
            onClick={() => handleSubscribe('enterprise')}
            className="w-full bg-purple-600 text-white py-2 px-4 rounded hover:bg-purple-700 disabled:opacity-50"
            disabled={loading}
          >
            {loading ? 'Processing...' : 'Subscribe'}
          </button>
        </div>
      </div>

      <div className="text-center mt-8">
        <button
          onClick={() => navigate('/dashboard')}
          className="bg-gray-600 text-white px-6 py-3 rounded hover:bg-gray-700"
        >
          Back to Dashboard
        </button>
      </div>
    </div>
  );
};

export default Subscription;
