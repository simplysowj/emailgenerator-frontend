import React, { useState } from 'react';
import axios from 'axios';

const ProcessRepliesButton = ({ campaignId }) => {
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState(null);
  const [error, setError] = useState(null);

  const fetchStats = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/api/campaigns/${campaignId}/reply_stats/`);
      setStats(response.data);
    } catch (err) {
      console.error("Error fetching stats:", err);
    }
  };

  const handleProcessReplies = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post(`http://localhost:8000/api/campaigns/${campaignId}/process_replies/`);
      
      setStats(response.data.stats);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to process replies');
    } finally {
      setLoading(false);
    }
  };

  // Load initial stats
  React.useEffect(() => {
    fetchStats();
  }, [campaignId]);

  return (
    <div className="reply-processor">
      <div className="stats-panel">
        {stats && (
          <>
            <div>Total Replies: <strong>{stats.total_replies}</strong></div>
            {stats.pending_replies > 0 && (
              <div className="text-warning">
                Pending Replies: <strong>{stats.pending_replies}</strong>
              </div>
            )}
            <div>Replied To: <strong>{stats.sent_replies}</strong></div>
          </>
        )}
      </div>
      
      <button
        onClick={handleProcessReplies}
        disabled={loading}
        className={`process-btn ${loading ? 'loading' : ''}`}
      >
        {loading ? (
          <>
            <span className="spinner"></span> Processing...
          </>
        ) : (
          'Check & Send Replies'
        )}
      </button>
      
      {error && (
        <div className="error-message">
          {error}
        </div>
      )}
    </div>
  );
};

export default ProcessRepliesButton;