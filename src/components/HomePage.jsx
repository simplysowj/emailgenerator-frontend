// src/components/HomePage.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <div>
      <h1>Welcome to Email Campaign Manager</h1>
      <div>
        <Link to="/create">
          <button>Create Campaign</button>
        </Link>
        <Link to="/campaigns">
          <button>View All Campaigns</button>
        </Link>
      </div>
    </div>
  );
};

export default HomePage;
