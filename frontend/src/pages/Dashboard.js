
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import API_CONFIG from '../config/api';

const Dashboard = () => {
  const [projects, setProjects] = useState([]);
  const [resumes, setResumes] = useState([]);
  const [offerLetters, setOfferLetters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('projects');
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const baseURL = API_CONFIG.getBaseURL();


  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }

    fetchData();
  }, [navigate]);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');

      // Fetch projects
      const projectsResponse = await axios.get(`${baseURL}/projects`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProjects(projectsResponse.data);

      // Fetch resumes
      const resumesResponse = await axios.get(`${baseURL}/resumes`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setResumes(resumesResponse.data.resumes);

      // Fetch offer letters
      const offerLettersResponse = await axios.get(`${baseURL}/offer-letters`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOfferLetters(offerLettersResponse.data.offerLetters);

    } catch (err) {
      setError('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };


  const handleGenerateProposal = async (projectId) => {
    try {
      const token = localStorage.getItem('token');

      const response = await axios.post(`${baseURL}/proposals/generate`, {
        projectId
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      navigate(`/proposal/${response.data.proposal._id}`);
    } catch (err) {
      setError('Failed to generate proposal');
    }
  };

  const handleGenerateContract = async (projectId) => {
    try {
      const token = localStorage.getItem('token');

      const response = await axios.post(`${baseURL}/contracts/generate`, {
        projectId
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      navigate(`/contract/${response.data.contract._id}`);
    } catch (err) {
      setError('Failed to generate contract');
    }
  };

  const handleViewResume = (resumeId) => {
    navigate(`/resume/${resumeId}`);
  };

  const handleViewOfferLetter = (offerLetterId) => {
    navigate(`/offer-letter/${offerLetterId}`);
  };

  if (loading) {
    return <div className="text-center">Loading...</div>;
  }


  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <div className="flex space-x-2">
          <Link
            to="/project/new"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            New Project
          </Link>
          <Link
            to="/resume/new"
            className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
          >
            New Resume
          </Link>
          <Link
            to="/offer-letter/new"
            className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
          >
            New Offer Letter
          </Link>
        </div>
      </div>

      {user && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-xl font-semibold mb-4">Subscription & Usage</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-sm text-gray-600">Subscription</p>
              <p className="text-lg font-semibold capitalize">{user.subscription || 'free'}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600">Resumes This Month</p>
              <p className="text-lg font-semibold">{user.usage?.resumesGenerated || 0}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600">Offer Letters This Month</p>
              <p className="text-lg font-semibold">{user.usage?.offerLettersGenerated || 0}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600">AI Tokens Used</p>
              <p className="text-lg font-semibold">{user.usage?.aiTokensUsed || 0}</p>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('projects')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'projects'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Projects ({projects.length})
          </button>
          <button
            onClick={() => setActiveTab('resumes')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'resumes'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Resumes ({resumes.length})
          </button>
          <button
            onClick={() => setActiveTab('offerLetters')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'offerLetters'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Offer Letters ({offerLetters.length})
          </button>
        </nav>
      </div>

      {/* Content based on active tab */}
      {activeTab === 'projects' && (
        <div>
          {projects.length === 0 ? (
            <div className="text-center py-12">
              <h2 className="text-2xl font-semibold mb-4">No projects yet</h2>
              <p className="text-gray-600 mb-6">Create your first project to get started with AI-powered proposals and contracts.</p>

              <Link
                to="/project/new"
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
              >
                Create Project
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project) => (
                <div key={project._id} className="bg-white p-6 rounded-lg shadow-md">
                  <h3 className="text-xl font-semibold mb-2">{project.name}</h3>
                  <p className="text-gray-600 mb-2">{project.description}</p>
                  <div className="text-sm text-gray-500 mb-4">
                    <p>Industry: {project.clientIndustry}</p>
                    <p>Country: {project.country}</p>
                    <p>Budget: ${project.budget}</p>
                    <p>Timeline: {project.timeline}</p>
                  </div>

                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleGenerateProposal(project._id)}
                      className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
                    >
                      Generate Proposal
                    </button>
                    <button
                      onClick={() => handleGenerateContract(project._id)}
                      className="bg-purple-600 text-white px-3 py-1 rounded text-sm hover:bg-purple-700"
                    >
                      Generate Contract
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'resumes' && (
        <div>
          {resumes.length === 0 ? (
            <div className="text-center py-12">
              <h2 className="text-2xl font-semibold mb-4">No resumes yet</h2>
              <p className="text-gray-600 mb-6">Create your first AI-powered resume to get started.</p>
              <Link
                to="/resume/new"
                className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700"
              >
                Create Resume
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {resumes.map((resume) => (
                <div key={resume._id} className="bg-white p-6 rounded-lg shadow-md">
                  <h3 className="text-xl font-semibold mb-2">{resume.candidateName}</h3>
                  <p className="text-gray-600 mb-2">{resume.jobRole}</p>
                  <div className="text-sm text-gray-500 mb-4">
                    <p>Experience: {resume.experienceLevel}</p>
                    <p>Type: {resume.resumeType}</p>
                    <p>Country: {resume.country}</p>
                    <p>Created: {new Date(resume.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleViewResume(resume._id)}
                      className="bg-indigo-600 text-white px-3 py-1 rounded text-sm hover:bg-indigo-700"
                    >
                      View Resume
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'offerLetters' && (
        <div>
          {offerLetters.length === 0 ? (
            <div className="text-center py-12">
              <h2 className="text-2xl font-semibold mb-4">No offer letters yet</h2>
              <p className="text-gray-600 mb-6">Create your first AI-powered offer letter to get started.</p>
              <Link
                to="/offer-letter/new"
                className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700"
              >
                Create Offer Letter
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {offerLetters.map((offerLetter) => (
                <div key={offerLetter._id} className="bg-white p-6 rounded-lg shadow-md">
                  <h3 className="text-xl font-semibold mb-2">{offerLetter.candidateName}</h3>
                  <p className="text-gray-600 mb-2">{offerLetter.position}</p>
                  <div className="text-sm text-gray-500 mb-4">
                    <p>Company: {offerLetter.companyName}</p>
                    <p>Type: {offerLetter.employmentType}</p>
                    <p>Start Date: {new Date(offerLetter.startDate).toLocaleDateString()}</p>
                    <p>Created: {new Date(offerLetter.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleViewOfferLetter(offerLetter._id)}
                      className="bg-purple-600 text-white px-3 py-1 rounded text-sm hover:bg-purple-700"
                    >
                      View Offer Letter
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
