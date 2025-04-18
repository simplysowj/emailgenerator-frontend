// src/App.js
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import EmailCampaignList from './components/EmailCampaignList';
import EmailCampaignDetail from './components/EmailCampaignDetail';
import CreateCampaign from './components/CreateCampaign';
import HomePage from './components/HomePage';
import Login from "./components/Login.jsx";
import './styles/global.css'; // Add this import

const App = () => {
  useEffect(() => {
    // Check if the page is being refreshed
    if (window.location.pathname === '/') {
      // Optional: Can add logic to check for any active sessions, etc.
    } else {
      // Navigate to home if not already on it.
      window.location.replace('/');
    }
  }, []);
  return (
    <Router>
      <Routes>
        <Route path="/campaigns" element={<EmailCampaignList />} />
        <Route path="/" element={<Login />} />
        <Route path="/Homepage" element={<HomePage />} />
        <Route path="/create" element={<CreateCampaign />} />
        <Route path="/campaigns/:id" element={<EmailCampaignDetail />} />
      </Routes>
    </Router>
  );
};

export default App;
