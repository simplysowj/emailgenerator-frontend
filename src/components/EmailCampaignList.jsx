// src/components/EmailCampaignList.jsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../axios';

const EmailCampaignList = () => {
  const [campaigns, setCampaigns] = useState([]);

  useEffect(() => {
    // Fetch campaigns data from the Django API
    api.get('campaigns/')
      .then(response => {
        setCampaigns(response.data);
      })
      .catch(error => {
        console.error('Error fetching campaigns:', error);
      });
  }, []);

  return (
    <div>
      <h1>Email Campaigns</h1>
      <ul>
        {campaigns.map((campaign) => (
          <li key={campaign.id}>
            <Link to={`/campaigns/${campaign.id}`}>{campaign.name}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default EmailCampaignList;
