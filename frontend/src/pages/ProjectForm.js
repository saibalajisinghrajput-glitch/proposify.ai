import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import API_CONFIG from '../config/api';

const ProjectForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    clientName: '',
    clientCompany: '',
    clientPhone: '',
    clientEmail: '',
    clientIndustry: '',
    customIndustry: '',
    country: '',
    budget: '',
    currency: 'INR',
    timeline: '',
    serviceType: '',
    customService: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [generatedProposal, setGeneratedProposal] = useState('');
  const [generatedContract, setGeneratedContract] = useState('');
  const navigate = useNavigate();

  // Complete list of countries
  const countries = [
    'Afghanistan', 'Albania', 'Algeria', 'Andorra', 'Angola', 'Antigua and Barbuda', 'Argentina', 'Armenia', 'Australia', 'Austria',
    'Azerbaijan', 'Bahamas', 'Bahrain', 'Bangladesh', 'Barbados', 'Belarus', 'Belgium', 'Belize', 'Benin', 'Bhutan',
    'Bolivia', 'Bosnia and Herzegovina', 'Botswana', 'Brazil', 'Brunei', 'Bulgaria', 'Burkina Faso', 'Burundi', 'Cabo Verde', 'Cambodia',
    'Cameroon', 'Canada', 'Central African Republic', 'Chad', 'Chile', 'China', 'Colombia', 'Comoros', 'Congo', 'Costa Rica',
    'Croatia', 'Cuba', 'Cyprus', 'Czech Republic', 'Denmark', 'Djibouti', 'Dominica', 'Dominican Republic', 'Ecuador', 'Egypt',
    'El Salvador', 'Equatorial Guinea', 'Eritrea', 'Estonia', 'Eswatini', 'Ethiopia', 'Fiji', 'Finland', 'France', 'Gabon',
    'Gambia', 'Georgia', 'Germany', 'Ghana', 'Greece', 'Grenada', 'Guatemala', 'Guinea', 'Guinea-Bissau', 'Guyana',
    'Haiti', 'Holy See', 'Honduras', 'Hungary', 'Iceland', 'India', 'Indonesia', 'Iran', 'Iraq', 'Ireland',
    'Israel', 'Italy', 'Jamaica', 'Japan', 'Jordan', 'Kazakhstan', 'Kenya', 'Kiribati', 'Kuwait', 'Kyrgyzstan',
    'Laos', 'Latvia', 'Lebanon', 'Lesotho', 'Liberia', 'Libya', 'Liechtenstein', 'Lithuania', 'Luxembourg', 'Madagascar',
    'Malawi', 'Malaysia', 'Maldives', 'Mali', 'Malta', 'Marshall Islands', 'Mauritania', 'Mauritius', 'Mexico', 'Micronesia',
    'Moldova', 'Monaco', 'Mongolia', 'Montenegro', 'Morocco', 'Mozambique', 'Myanmar', 'Namibia', 'Nauru', 'Nepal',
    'Netherlands', 'New Zealand', 'Nicaragua', 'Niger', 'Nigeria', 'North Korea', 'North Macedonia', 'Norway', 'Oman', 'Pakistan',
    'Palau', 'Palestine', 'Panama', 'Papua New Guinea', 'Paraguay', 'Peru', 'Philippines', 'Poland', 'Portugal', 'Qatar',
    'Romania', 'Russia', 'Rwanda', 'Saint Kitts and Nevis', 'Saint Lucia', 'Saint Vincent and the Grenadines', 'Samoa', 'San Marino', 'Sao Tome and Principe', 'Saudi Arabia',
    'Senegal', 'Serbia', 'Seychelles', 'Sierra Leone', 'Singapore', 'Slovakia', 'Slovenia', 'Solomon Islands', 'Somalia', 'South Africa',
    'South Korea', 'South Sudan', 'Spain', 'Sri Lanka', 'Sudan', 'Suriname', 'Sweden', 'Switzerland', 'Syria', 'Tajikistan',
    'Tanzania', 'Thailand', 'Timor-Leste', 'Togo', 'Tonga', 'Trinidad and Tobago', 'Tunisia', 'Turkey', 'Turkmenistan', 'Tuvalu',
    'Uganda', 'Ukraine', 'United Arab Emirates', 'United Kingdom', 'United States of America', 'Uruguay', 'Uzbekistan', 'Vanuatu', 'Venezuela', 'Vietnam',
    'Yemen', 'Zambia', 'Zimbabwe'
  ];

  // Get user's locale to suggest default country
  const getUserCountry = () => {
    return 'India'; // Default to India as requested
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };


  const handleGenerateProposal = async () => {
    setLoading(true);
    setError('');

    try {
      // First, create the project
      const baseURL = API_CONFIG.getBaseURL();
      const token = localStorage.getItem('token');
      
      if (!token) {
        setError('Please login to generate proposals');
        return;
      }

      // Create project first
      const projectData = {
        name: formData.name,
        description: formData.description,
        clientName: formData.clientName,
        clientCompany: formData.clientCompany,
        clientPhone: formData.clientPhone,
        clientEmail: formData.clientEmail,
        clientIndustry: formData.clientIndustry === 'Other' ? formData.customIndustry : formData.clientIndustry,
        country: formData.country,
        budget: formData.budget,
        currency: formData.currency,
        timeline: formData.timeline,
        serviceType: formData.serviceType === 'Other' ? formData.customService : formData.serviceType
      };

      console.log('🚀 Creating project...');
      const projectResponse = await axios.post(`${baseURL}/projects`, projectData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const projectId = projectResponse.data.project._id;
      console.log('✅ Project created:', projectId);

      // Now generate proposal using authenticated endpoint
      console.log('🚀 Generating proposal...');
      const proposalResponse = await axios.post(`${baseURL}/proposals/generate`, {
        projectId: projectId
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      console.log('✅ Proposal generated successfully');
      setGeneratedProposal(proposalResponse.data.proposal.content);
      
      // Store in localStorage for viewing later
      localStorage.setItem('generatedProposal', JSON.stringify({
        content: proposalResponse.data.proposal.content,
        clientName: formData.clientName,
        clientCompany: formData.clientCompany,
        projectName: formData.name,
        timestamp: new Date().toISOString(),
        projectId: projectId,
        proposalId: proposalResponse.data.proposal._id
      }));

    } catch (err) {
      console.error('❌ Proposal generation error:', err);
      
      if (err.response?.status === 401) {
        setError('Session expired. Please login again.');
        localStorage.removeItem('token');
        navigate('/login');
        return;
      }
      
      if (err.response?.status === 403) {
        const message = err.response?.data?.message || 'Generation limit reached';
        setError(`${message} Please upgrade your plan.`);
        return;
      }
      
      setError(err.response?.data?.message || 'Failed to generate proposal');
    } finally {
      setLoading(false);
    }
  };


  const handleGenerateContract = async () => {
    setLoading(true);
    setError('');

    try {
      // First, create the project
      const baseURL = API_CONFIG.getBaseURL();
      const token = localStorage.getItem('token');
      
      if (!token) {
        setError('Please login to generate contracts');
        return;
      }

      // Create project first
      const projectData = {
        name: formData.name,
        description: formData.description,
        clientName: formData.clientName,
        clientCompany: formData.clientCompany,
        clientPhone: formData.clientPhone,
        clientEmail: formData.clientEmail,
        clientIndustry: formData.clientIndustry === 'Other' ? formData.customIndustry : formData.clientIndustry,
        country: formData.country,
        budget: formData.budget,
        currency: formData.currency,
        timeline: formData.timeline,
        serviceType: formData.serviceType === 'Other' ? formData.customService : formData.serviceType
      };

      console.log('🚀 Creating project...');
      const projectResponse = await axios.post(`${baseURL}/projects`, projectData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const projectId = projectResponse.data.project._id;
      console.log('✅ Project created:', projectId);

      // Now generate contract using authenticated endpoint
      console.log('🚀 Generating contract...');
      const contractResponse = await axios.post(`${baseURL}/contracts/generate`, {
        projectId: projectId
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      console.log('✅ Contract generated successfully');
      setGeneratedContract(contractResponse.data.contract.content);
      
      // Store in localStorage for viewing later
      localStorage.setItem('generatedContract', JSON.stringify({
        content: contractResponse.data.contract.content,
        clientName: formData.clientName,
        clientCompany: formData.clientCompany,
        projectName: formData.name,
        timestamp: new Date().toISOString(),
        projectId: projectId,
        contractId: contractResponse.data.contract._id
      }));

    } catch (err) {
      console.error('❌ Contract generation error:', err);
      
      if (err.response?.status === 401) {
        setError('Session expired. Please login again.');
        localStorage.removeItem('token');
        navigate('/login');
        return;
      }
      
      if (err.response?.status === 403) {
        const message = err.response?.data?.message || 'Generation limit reached';
        setError(`${message} Please upgrade your plan.`);
        return;
      }
      
      setError(err.response?.data?.message || 'Failed to generate contract');
    } finally {
      setLoading(false);
    }
  };

  const handleViewProposal = () => {
    navigate('/proposal-view');
  };

  const handleViewContract = () => {
    navigate('/contract-view');
  };

  return (
    <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-md">
      <h1 className="text-3xl font-bold mb-6">AI Document Generator</h1>


      {/* Authentication Notice */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-800">
              Authentication Required for AI Generation
            </h3>
            <p className="mt-1 text-sm text-blue-700">
              Please login to generate AI-powered proposals and contracts. Create a free account or login to continue.
            </p>
            <div className="mt-2">
              <button
                onClick={() => navigate('/login')}
                className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm font-medium mr-2"
              >
                Login
              </button>
              <button
                onClick={() => navigate('/signup')}
                className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-1 rounded text-sm font-medium"
              >
                Signup
              </button>
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Generated Content Display */}
      {generatedProposal && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-blue-800">
                ✅ Proposal Generated Successfully!
              </h3>
              <p className="mt-1 text-sm text-blue-700">
                Your professional proposal has been created. View it below or download as PDF.
              </p>
            </div>
            <button
              onClick={handleViewProposal}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm font-medium"
            >
              View Proposal
            </button>
          </div>
        </div>
      )}

      {generatedContract && (
        <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-indigo-800">
                ✅ Contract Generated Successfully!
              </h3>
              <p className="mt-1 text-sm text-indigo-700">
                Your professional contract has been created. View it below or download as PDF.
              </p>
            </div>
            <button
              onClick={handleViewContract}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded text-sm font-medium"
            >
              View Contract
            </button>
          </div>
        </div>
      )}

      {/* Form */}
      <form onSubmit={(e) => { e.preventDefault(); }}>
        {/* Project Basic Details */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Project Details</h2>
          
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
              Project Name *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="3"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
        </div>

        {/* Client Contact Details */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Client Contact Details</h2>
          

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="clientName">
                Client Name *
              </label>
              <input
                type="text"
                id="clientName"
                name="clientName"
                value={formData.clientName}
                onChange={handleChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="clientCompany">
                Company Name *
              </label>
              <input
                type="text"
                id="clientCompany"
                name="clientCompany"
                value={formData.clientCompany}
                onChange={handleChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="clientPhone">
                Client Phone (with country code) *
              </label>
              <input
                type="tel"
                id="clientPhone"
                name="clientPhone"
                value={formData.clientPhone}
                onChange={handleChange}
                placeholder="+91 98765 43210"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
              />
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="clientEmail">
              Client Email
            </label>
            <input
              type="email"
              id="clientEmail"
              name="clientEmail"
              value={formData.clientEmail}
              onChange={handleChange}
              placeholder="client@example.com"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
        </div>

        {/* Business Details */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Business Details</h2>
          
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="clientIndustry">
              Client Industry *
            </label>
            <select
              id="clientIndustry"
              name="clientIndustry"
              value={formData.clientIndustry}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            >
              <option value="">Select Industry</option>
              <option value="Technology">Technology</option>
              <option value="Healthcare">Healthcare</option>
              <option value="Finance">Finance</option>
              <option value="Education">Education</option>
              <option value="Retail">Retail</option>
              <option value="Manufacturing">Manufacturing</option>
              <option value="Consulting">Consulting</option>
              <option value="E-commerce">E-commerce</option>
              <option value="Real Estate">Real Estate</option>
              <option value="Food & Beverage">Food & Beverage</option>
              <option value="Automotive">Automotive</option>
              <option value="Travel & Tourism">Travel & Tourism</option>
              <option value="Fashion">Fashion</option>
              <option value="Sports">Sports</option>
              <option value="Entertainment">Entertainment</option>
              <option value="Non-profit">Non-profit</option>
              <option value="Government">Government</option>
              <option value="Agriculture">Agriculture</option>
              <option value="Energy">Energy</option>
              <option value="Telecommunications">Telecommunications</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {formData.clientIndustry === 'Other' && (
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="customIndustry">
                Specify Industry *
              </label>
              <input
                type="text"
                id="customIndustry"
                name="customIndustry"
                value={formData.customIndustry}
                onChange={handleChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required={formData.clientIndustry === 'Other'}
              />
            </div>
          )}

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="country">
              Country *
            </label>
            <select
              id="country"
              name="country"
              value={formData.country || getUserCountry()}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            >
              <option value="">Select Country</option>
              {countries.map((country) => (
                <option key={country} value={country}>{country}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Project Requirements */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Project Requirements</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="budget">
                Budget (INR ₹) *
              </label>
              <select
                id="budget"
                name="budget"
                value={formData.budget}
                onChange={handleChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
              >
                <option value="">Select Budget Range</option>
                <option value="₹10,000 – ₹25,000">₹10,000 – ₹25,000</option>
                <option value="₹25,000 – ₹50,000">₹25,000 – ₹50,000</option>
                <option value="₹50,000 – ₹1,00,000">₹50,000 – ₹1,00,000</option>
                <option value="₹1,00,000 – ₹5,00,000">₹1,00,000 – ₹5,00,000</option>
                <option value="₹5,00,000+">₹5,00,000+</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="timeline">
                Timeline *
              </label>
              <select
                id="timeline"
                name="timeline"
                value={formData.timeline}
                onChange={handleChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
              >
                <option value="">Select Timeline</option>
                <option value="1 week">1 week</option>
                <option value="2 weeks">2 weeks</option>
                <option value="1 month">1 month</option>
                <option value="3 months">3 months</option>
                <option value="6 months">6 months</option>
                <option value="1 year">1 year</option>
              </select>
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="serviceType">
              Service Type *
            </label>
            <select
              id="serviceType"
              name="serviceType"
              value={formData.serviceType}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            >
              <option value="">Select Service Type</option>
              <option value="Web Development">Web Development</option>
              <option value="Mobile App Development">Mobile App Development</option>
              <option value="Digital Marketing">Digital Marketing</option>
              <option value="UI/UX Design">UI/UX Design</option>
              <option value="AI / Automation">AI / Automation</option>
              <option value="Consulting">Consulting</option>
              <option value="SEO Services">SEO Services</option>
              <option value="Content Writing">Content Writing</option>
              <option value="E-commerce Solutions">E-commerce Solutions</option>
              <option value="Cloud Solutions">Cloud Solutions</option>
              <option value="Cybersecurity">Cybersecurity</option>
              <option value="Data Analytics">Data Analytics</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {formData.serviceType === 'Other' && (
            <div className="mt-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="customService">
                Specify Service Type *
              </label>
              <input
                type="text"
                id="customService"
                name="customService"
                value={formData.customService}
                onChange={handleChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required={formData.serviceType === 'Other'}
              />
            </div>
          )}
        </div>

        {/* Generate Buttons */}
        <div className="flex items-center justify-between">
          <div className="flex gap-4">
            <button
              type="button"
              onClick={handleGenerateProposal}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded focus:outline-none focus:shadow-outline disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Generating...' : 'Generate AI Proposal'}
            </button>
            <button
              type="button"
              onClick={handleGenerateContract}
              disabled={loading}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded focus:outline-none focus:shadow-outline disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Generating...' : 'Generate AI Contract'}
            </button>
          </div>
          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Cancel
          </button>
        </div>
      </form>

      {/* Generated Content Preview */}
      {generatedProposal && (
        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-4">Generated Proposal Preview:</h3>
          <div className="bg-gray-50 border rounded-lg p-6 max-h-96 overflow-y-auto">
            <pre className="whitespace-pre-wrap text-sm text-gray-800 font-mono">
              {generatedProposal.substring(0, 500)}...
            </pre>
          </div>
        </div>
      )}

      {generatedContract && (
        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-4">Generated Contract Preview:</h3>
          <div className="bg-gray-50 border rounded-lg p-6 max-h-96 overflow-y-auto">
            <pre className="whitespace-pre-wrap text-sm text-gray-800 font-mono">
              {generatedContract.substring(0, 500)}...
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectForm;
