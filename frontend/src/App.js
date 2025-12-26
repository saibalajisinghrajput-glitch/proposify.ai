
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import PrivateRoute from './components/PrivateRoute';



import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import ProjectForm from './pages/ProjectForm';
import ResumeForm from './pages/ResumeForm';
import ResumeView from './pages/ResumeView';
import OfferLetterForm from './pages/OfferLetterForm';
import OfferLetterView from './pages/OfferLetterView';
import ProposalView from './pages/ProposalView';
import ContractView from './pages/ContractView';
import Subscription from './pages/Subscription';



function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="container mx-auto px-4 py-8">

          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            {/* Public AI Generation Routes - No Authentication Required */}
            <Route path="/project/new" element={<ProjectForm />} />
            <Route path="/contract/new" element={<ContractView />} />
            <Route path="/resume/new" element={<ResumeForm />} />
            <Route path="/offer/new" element={<OfferLetterForm />} />

            {/* Protected Routes - Require Authentication */}
            <Route path="/dashboard" element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            } />

            <Route path="/resume/:id" element={
              <PrivateRoute>
                <ResumeView />
              </PrivateRoute>
            } />
            <Route path="/offer-letter/:id" element={
              <PrivateRoute>
                <OfferLetterView />
              </PrivateRoute>
            } />
            <Route path="/proposal/:id" element={
              <PrivateRoute>
                <ProposalView />
              </PrivateRoute>
            } />
            <Route path="/contract/:id" element={
              <PrivateRoute>
                <ContractView />
              </PrivateRoute>
            } />
            <Route path="/subscription" element={
              <PrivateRoute>
                <Subscription />
              </PrivateRoute>
            } />
            
            {/* Catch all - redirect to home */}
            <Route path="*" element={<Home />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
