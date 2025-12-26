import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import API_CONFIG from '../config/api';

const ResumeForm = () => {
  const [formData, setFormData] = useState({
    candidateName: '',
    phoneNumber: '',
    email: '',
    education: '',
    skills: '',
    experienceLevel: '',
    jobRole: '',
    country: '',
    resumeType: 'modern'
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
      const response = await axios.post(`${baseURL}/resumes/demo/generate`, {
        ...formData,
        skills: formData.skills.split(',').map(skill => skill.trim())
      });

      setGeneratedContent(response.data.resume.content);
      
      // Store in localStorage for viewing later
      localStorage.setItem('generatedResume', JSON.stringify({
        content: response.data.resume.content,
        candidateName: formData.candidateName,
        timestamp: new Date().toISOString()
      }));

    } catch (err) {
      setError(err.response?.data?.message || 'Failed to generate resume');
    } finally {
      setLoading(false);
    }
  };

  const handleViewResume = () => {
    navigate('/resume-view');
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">AI Resume Generator</h2>
        <Link
          to="/dashboard"
          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
        >
          ← Back to Dashboard
        </Link>
      </div>

      {/* Demo Mode Notice */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-800">
              Demo Mode Active
            </h3>
            <p className="mt-1 text-sm text-blue-700">
              Generate professional resumes instantly without signup. Your content will be generated using advanced AI templates.
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
                ✅ Resume Generated Successfully!
              </h3>
              <p className="mt-1 text-sm text-green-700">
                Your professional resume has been created. View it below or download as PDF.
              </p>
            </div>
            <button
              onClick={handleViewResume}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded text-sm font-medium"
            >
              View Resume
            </button>
          </div>
        </div>
      )}

      {!generatedContent && (
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Full Name *
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
                Phone Number *
              </label>
              <input
                type="tel"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="+1 (555) 123-4567"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Email Address *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="john.doe@email.com"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Education *
              </label>
              <textarea
                name="education"
                value={formData.education}
                onChange={handleChange}
                rows={3}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Bachelor of Science in Computer Science&#10;University of Technology&#10;2018-2022&#10;GPA: 3.8/4.0"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Skills (comma-separated) *
              </label>
              <input
                type="text"
                name="skills"
                value={formData.skills}
                onChange={handleChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="JavaScript, React, Node.js, Python, SQL"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Experience Level *
              </label>
              <select
                name="experienceLevel"
                value={formData.experienceLevel}
                onChange={handleChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select experience level</option>
                <option value="Fresher">Fresher</option>
                <option value="Entry Level (0-2 years)">Entry Level (0-2 years)</option>
                <option value="Mid Level (2-5 years)">Mid Level (2-5 years)</option>
                <option value="Senior Level (5-10 years)">Senior Level (5-10 years)</option>
                <option value="Executive Level (10+ years)">Executive Level (10+ years)</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Job Role *
              </label>
              <input
                type="text"
                name="jobRole"
                value={formData.jobRole}
                onChange={handleChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Software Engineer"
                required
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

            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Resume Type *
              </label>
              <select
                name="resumeType"
                value={formData.resumeType}
                onChange={handleChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="modern">Modern</option>
                <option value="classic">Classic</option>
                <option value="professional">Professional</option>
                <option value="creative">Creative</option>
              </select>
            </div>
          </div>

          <div className="flex items-center justify-between mt-6">
            <button
              type="submit"
              disabled={loading}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Generating Resume...' : 'Generate AI Resume'}
            </button>
            <p className="text-sm text-gray-600">
              * Required fields
            </p>
          </div>
        </form>
      )}

      {generatedContent && (
        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-4">Generated Resume Preview:</h3>
          <div className="bg-gray-50 border rounded-lg p-6 max-h-96 overflow-y-auto">
            <pre className="whitespace-pre-wrap text-sm text-gray-800 font-mono">
              {generatedContent}
            </pre>
          </div>
          <div className="flex gap-4 mt-4">
            <button
              onClick={handleViewResume}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-medium"
            >
              View Full Resume
            </button>
            <button
              onClick={() => {
                setGeneratedContent('');
                setFormData({
                  candidateName: '',
                  phoneNumber: '',
                  email: '',
                  education: '',
                  skills: '',
                  experienceLevel: '',
                  jobRole: '',
                  country: '',
                  resumeType: 'modern'
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

export default ResumeForm;
