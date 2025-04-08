// src/components/HomePage.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import styles from './HomePage.module.css';

const HomePage = () => {
  return (
    <div className={styles.container}>
      {/* Background elements */}
      <div className={`${styles.bgElement} ${styles.bgElement1}`}></div>
      <div className={`${styles.bgElement} ${styles.bgElement2}`}></div>
      
      {/* Content */}
      <div className={styles.contentWrapper}>
        <h1 className={styles.title}>Welcome to Email Campaign Manager</h1>
        <p className={styles.subtitle}>
          Create, manage, and track beautiful email campaigns with our intuitive platform. 
          Perfect for marketing teams, businesses, and individuals looking to engage their audience.
        </p>
        <div className={styles.buttonGroup}>
          <Link to="/create">
            <button className={styles.primaryButton}>Create Campaign</button>
          </Link>
          <Link to="/campaigns">
            <button className={styles.secondaryButton}>View Campaigns</button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HomePage;