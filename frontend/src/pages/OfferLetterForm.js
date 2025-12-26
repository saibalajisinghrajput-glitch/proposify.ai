import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import API_CONFIG from '../config/api';

const OfferLetterForm = () => {
  const [formData, setFormData] = useState({
    candidateName: '',
    position: '',
    employmentType: '',
    companyName: '',
    startDate: '',
    stipend: '',
    duration: '',
    country: '',
    hrContactDetails: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [generatedContent, setGeneratedContent] = useState('');
  const navigate = useNavigate();
  const baseURL = API_CONFIG.getBaseURL();

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

    try {

      // Use demo endpoint (no authentication required)
      const response = await axios.post(`${baseURL}/offer-letters/demo/generate`, formData);

      setGeneratedContent(response.data.offerLetter.content);
      
      // Store in localStorage for viewing later
      localStorage.setItem('generatedOfferLetter', JSON.stringify({
        content: response.data.offerLetter.content,
        candidateName: formData.candidateName,
        position: formData.position,
        companyName: formData.companyName,
        timestamp: new Date().toISOString()
      }));

    } catch (err) {
      setError(err.response?.data?.message || 'Failed to generate offer letter');
    } finally {
      setLoading(false);
    }
  };

  const handleViewOfferLetter = () => {
    navigate('/offer-letter-view');
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">AI Offer Letter Generator</h2>
        <Link
          to="/dashboard"
          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
        >
          ← Back to Dashboard
        </Link>
      </div>

      {/* Demo Mode Notice */}
      <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-6">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-purple-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-purple-800">
              Demo Mode Active
            </h3>
            <p className="mt-1 text-sm text-purple-700">
              Generate professional offer letters instantly without signup. Your content will be generated using advanced AI templates.
            </p>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {generatedContent && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-green-800">
                ✅ Offer Letter Generated Successfully!
              </h3>
              <p className="mt-1 text-sm text-green-700">
                Your professional offer letter has been created. View it below or download as PDF.
              </p>
            </div>
            <button
              onClick={handleViewOfferLetter}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded text-sm font-medium"
            >
              View Offer Letter
            </button>
          </div>
        </div>
      )}

      {!generatedContent && (
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Candidate Name *
              </label>
              <input
                type="text"
                name="candidateName"
                value={formData.candidateName}
                onChange={handleChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="John Doe"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Position *
              </label>
              <input
                type="text"
                name="position"
                value={formData.position}
                onChange={handleChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Software Engineer"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Employment Type *
              </label>
              <select
                name="employmentType"
                value={formData.employmentType}
                onChange={handleChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select type</option>
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Internship">Internship</option>
                <option value="Contract">Contract</option>
                <option value="Freelance">Freelance</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Company Name *
              </label>
              <input
                type="text"
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Tech Solutions Inc."
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Start Date *
              </label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Annual Stipend/Salary *
              </label>
              <input
                type="text"
                name="stipend"
                value={formData.stipend}
                onChange={handleChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="$75,000"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Duration (if applicable)
              </label>
              <input
                type="text"
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="12 months"
              />
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Country *
              </label>

              <select
                name="country"
                value={formData.country}
                onChange={handleChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select country</option>
                <option value="United States">United States</option>
                <option value="Canada">Canada</option>
                <option value="United Kingdom">United Kingdom</option>
                <option value="Australia">Australia</option>
                <option value="India">India</option>
                <option value="Germany">Germany</option>
                <option value="France">France</option>
                <option value="Netherlands">Netherlands</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                HR Contact Details
              </label>
              <textarea
                name="hrContactDetails"
                value={formData.hrContactDetails}
                onChange={handleChange}
                rows={3}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Sarah Johnson, HR Manager&#10;Email: sarah.johnson@company.com&#10;Phone: +1 (555) 987-6543"
              />
            </div>
          </div>

          <div className="flex items-center justify-between mt-6">
            <button
              type="submit"
              disabled={loading}
              className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Generating Offer Letter...' : 'Generate AI Offer Letter'}
            </button>
            <p className="text-sm text-gray-600">
              * Required fields
            </p>
          </div>
        </form>
      )}

      {generatedContent && (
        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-4">Generated Offer Letter Preview:</h3>
          <div className="bg-gray-50 border rounded-lg p-6 max-h-96 overflow-y-auto">
            <pre className="whitespace-pre-wrap text-sm text-gray-800 font-mono">
              {generatedContent}
            </pre>
          </div>
          <div className="flex gap-4 mt-4">
            <button
              onClick={handleViewOfferLetter}
              className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded font-medium"
            >
              View Full Offer Letter
            </button>
            <button
              onClick={() => {
                setGeneratedContent('');
                setFormData({
                  candidateName: '',
                  position: '',
                  employmentType: '',
                  companyName: '',
                  startDate: '',
                  stipend: '',
                  duration: '',
                  country: '',
                  hrContactDetails: ''
                });
              }}
              className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded font-medium"
            >
              Generate Another
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default OfferLetterForm;
