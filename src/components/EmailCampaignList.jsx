// src/components/EmailCampaignList.jsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../axios';
import styles from './EmailCampaignList.module.css';

const EmailCampaignList = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    api.get('campaigns/')
      .then(response => {
        setCampaigns(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching campaigns:', error);
        setError('Failed to load campaigns. Please try again later.');
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loader}>Loading campaigns...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>{error}</div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Your Email Campaigns</h1>
        <Link to="/create" className={styles.createButton}>
          + Create New Campaign
        </Link>
      </div>
      
      <div className={styles.campaignGrid}>
        {campaigns.length > 0 ? (
          campaigns.map((campaign) => (
            <Link 
              to={`/campaigns/${campaign.id}`} 
              key={campaign.id} 
              className={styles.campaignCard}
            >
              <div className={styles.cardContent}>
                <h3 className={styles.campaignName}>{campaign.name}</h3>
                <p className={styles.campaignTopic}>{campaign.topic || 'No topic specified'}</p>
                <div className={styles.statusBadge}>
                  <span className={styles.badgeText}>
                    {campaign.status || 'Draft'}
                  </span>
                </div>
              </div>
              <div className={styles.cardFooter}>
                <span className={styles.date}>
                  Created: {new Date(campaign.created_at).toLocaleDateString()}
                </span>
              </div>
            </Link>
          ))
        ) : (
          <div className={styles.emptyState}>
            <h3>No campaigns found</h3>
            <p>You haven't created any campaigns yet. Get started by creating one!</p>
            <Link to="/create" className={styles.createButton}>
              Create Your First Campaign
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmailCampaignList;