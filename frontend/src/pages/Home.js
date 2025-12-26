import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  useEffect(() => {
    console.log('🏠 Home Page - AI Features Available');
    // Check if user is logged in
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, []);

  return (
    <div className="text-center">
      <div className="bg-gradient-to-r from-blue-600 to-purple-700 text-white py-20 px-4 rounded-lg mb-12">
        <h1 className="text-4xl md:text-6xl font-bold mb-4">
          Welcome to ProposifyAI
        </h1>
        <p className="text-xl md:text-2xl mb-4">
          Generate professional proposals and contracts with AI-powered assistance
        </p>
        <p className="text-lg mb-8 opacity-90">
          🚀 Access all AI features instantly - no signup required!
        </p>

        {/* AI Features - Direct Access */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Link
            to="/project/new"
            className="bg-white text-gray-700 px-6 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 transition duration-300 inline-block shadow-lg transform hover:scale-105"
          >
            📝 AI Proposal Generator
          </Link>
          <Link
            to="/contract/new"
            className="bg-white text-gray-700 px-6 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 transition duration-300 inline-block shadow-lg transform hover:scale-105"
          >
            📄 AI Contract Generator
          </Link>
          <Link
            to="/resume/new"
            className="bg-white text-gray-700 px-6 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 transition duration-300 inline-block shadow-lg transform hover:scale-105"
          >
            💼 AI Resume Generator
          </Link>
          <Link
            to="/offer/new"
            className="bg-white text-gray-700 px-6 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 transition duration-300 inline-block shadow-lg transform hover:scale-105"
          >
            📨 AI Offer Letter Generator
          </Link>
        </div>
        
        {/* Dashboard Button for logged-in users */}
        {isLoggedIn && (
          <div className="mt-8">
            <Link
              to="/dashboard"
              className="bg-gradient-to-r from-yellow-500 to-orange-600 text-white px-8 py-4 rounded-full font-bold text-lg hover:from-yellow-600 hover:to-orange-700 transition duration-300 inline-block shadow-lg transform hover:scale-105"
            >
              📊 Go to Dashboard
            </Link>
          </div>
        )}
        
        {/* Features Benefits */}
        <div className="mt-6 flex flex-wrap justify-center gap-6 text-sm">
          <div className="flex items-center">
            <span className="mr-2">✅</span>
            <span>No Signup Required</span>
          </div>
          <div className="flex items-center">
            <span className="mr-2">✅</span>
            <span>Full AI Generation</span>
          </div>
          <div className="flex items-center">
            <span className="mr-2">✅</span>
            <span>PDF Download</span>
          </div>
          <div className="flex items-center">
            <span className="mr-2">✅</span>
            <span>All Features Free</span>
          </div>
        </div>
      </div>

      {/* AI Features Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <div className="bg-white p-8 rounded-lg shadow-lg border-2 border-blue-100">
          <h3 className="text-2xl font-bold mb-4 text-blue-800">📝 AI Proposal Generator</h3>
          <p className="text-gray-600 mb-4">
            Create winning proposals tailored to your client's industry, budget, and timeline.
          </p>
          <ul className="text-left text-sm text-gray-600 space-y-1">
            <li>• Industry-specific templates</li>
            <li>• Budget and pricing optimization</li>
            <li>• Professional formatting</li>
            <li>• PDF export ready</li>
          </ul>
          <Link
            to="/project/new"
            className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition duration-300 inline-block"
          >
            Start Creating
          </Link>
        </div>
        
        <div className="bg-white p-8 rounded-lg shadow-lg border-2 border-green-100">
          <h3 className="text-2xl font-bold mb-4 text-green-800">📄 AI Contract Generator</h3>
          <p className="text-gray-600 mb-4">
            Generate country-specific contracts with clear terms, payment schedules, and IP rights.
          </p>
          <ul className="text-left text-sm text-gray-600 space-y-1">
            <li>• Country-specific legal compliance</li>
            <li>• Payment terms and schedules</li>
            <li>• Intellectual property clauses</li>
            <li>• Professional contract templates</li>
          </ul>
          <Link
            to="/contract/new"
            className="mt-4 bg-green-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-700 transition duration-300 inline-block"
          >
            Start Creating
          </Link>
        </div>
        
        <div className="bg-white p-8 rounded-lg shadow-lg border-2 border-purple-100">
          <h3 className="text-2xl font-bold mb-4 text-purple-800">💼 AI Resume Generator</h3>
          <p className="text-gray-600 mb-4">
            Generate professional resumes optimized for your industry and target roles.
          </p>
          <ul className="text-left text-sm text-gray-600 space-y-1">
            <li>• Industry-optimized templates</li>
            <li>• ATS-friendly formatting</li>
            <li>• Skills and experience optimization</li>
            <li>• Multiple format options</li>
          </ul>
          <Link
            to="/resume/new"
            className="mt-4 bg-purple-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-purple-700 transition duration-300 inline-block"
          >
            Start Creating
          </Link>
        </div>
        
        <div className="bg-white p-8 rounded-lg shadow-lg border-2 border-orange-100">
          <h3 className="text-2xl font-bold mb-4 text-orange-800">📨 AI Offer Letter Generator</h3>
          <p className="text-gray-600 mb-4">
            Create professional offer letters with competitive compensation and benefits.
          </p>
          <ul className="text-left text-sm text-gray-600 space-y-1">
            <li>• Competitive salary benchmarking</li>
            <li>• Benefits and perks inclusion</li>
            <li>• Legal compliance checking</li>
            <li>• Professional formatting</li>
          </ul>
          <Link
            to="/offer/new"
            className="mt-4 bg-orange-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-orange-700 transition duration-300 inline-block"
          >
            Start Creating
          </Link>
        </div>
      </div>

      {/* How it Works Section */}
      <div className="bg-gray-100 py-12 px-4 rounded-lg mb-12">
        <h2 className="text-3xl font-bold mb-8">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="text-4xl mb-4">1️⃣</div>
            <h3 className="text-xl font-semibold mb-2">Choose Your Generator</h3>
            <p className="text-gray-600">Select from proposals, contracts, resumes, or offer letters</p>
          </div>
          <div className="text-center">
            <div className="text-4xl mb-4">2️⃣</div>
            <h3 className="text-xl font-semibold mb-2">Fill in Details</h3>
            <p className="text-gray-600">Provide basic information about your project or requirements</p>
          </div>
          <div className="text-center">
            <div className="text-4xl mb-4">3️⃣</div>
            <h3 className="text-xl font-semibold mb-2">Generate & Download</h3>
            <p className="text-gray-600">AI creates your document and you can download as PDF</p>
          </div>
        </div>
      </div>

      {/* Optional Dashboard for Logged-in Users */}
      {isLoggedIn && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-8 mb-12">
          <h2 className="text-3xl font-bold mb-6 text-blue-800">🎯 Quick Dashboard Access</h2>
          <p className="text-lg mb-6 text-blue-700">
            Access all your projects, proposals, and contracts from your dashboard
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              to="/dashboard"
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition duration-300 border-l-4 border-blue-500"
            >
              <div className="text-2xl mb-2">📊</div>
              <h3 className="text-lg font-semibold mb-2">View Dashboard</h3>
              <p className="text-gray-600 text-sm">Manage all your projects and documents</p>
            </Link>
            <Link
              to="/project/new"
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition duration-300 border-l-4 border-green-500"
            >
              <div className="text-2xl mb-2">📝</div>
              <h3 className="text-lg font-semibold mb-2">New Project</h3>
              <p className="text-gray-600 text-sm">Create a new project proposal</p>
            </Link>
            <Link
              to="/resume/new"
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition duration-300 border-l-4 border-purple-500"
            >
              <div className="text-2xl mb-2">💼</div>
              <h3 className="text-lg font-semibold mb-2">Resume & Offer</h3>
              <p className="text-gray-600 text-sm">Generate resumes and offer letters</p>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
