import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../axios';
import styles from './EmailCampaignDetail.module.css';
import ProcessRepliesButton from './ProcessRepliesButton';


const EmailCampaignDetail = () => {
  const { id } = useParams();
  const [campaign, setCampaign] = useState(null);
  const [generatedEmail, setGeneratedEmail] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [recipientFile, setRecipientFile] = useState(null);
  const [attachmentFiles, setAttachmentFiles] = useState([]);

  useEffect(() => {
    const fetchCampaignData = async () => {
      try {
        const response = await api.get(`campaigns/${id}/`);
        setCampaign(response.data);
        fetchGeneratedEmail();
      } catch (error) {
        setError('Failed to fetch campaign details');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchCampaignData();
  }, [id]);

  const handleImportRecipients = async (event) => {
    event.preventDefault();
    if (!recipientFile) {
      alert('Please select a file first');
      return;
    }

    const formData = new FormData();
    formData.append('file', recipientFile);

    try {
      const response = await api.post(`campaigns/${id}/import_recipients/`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      alert(response.data.message);
      const updatedCampaign = await api.get(`campaigns/${id}/`);
      setCampaign(updatedCampaign.data);
    } catch (error) {
      alert('Error importing recipients');
      console.error(error);
    }
  };

  const handleGenerateContent = async () => {
    try {
      await api.post(`campaigns/${id}/generate_content/`);
      alert('Email content generated');
      fetchGeneratedEmail();
    } catch (error) {
      alert('Error generating content');
      console.error(error);
    }
  };

  const fetchGeneratedEmail = async () => {
    try {
      const response = await api.get(`campaigns/${id}/preview/`);
      setGeneratedEmail(response.data);
    } catch (error) {
      setGeneratedEmail(null);
      console.error(error);
    }
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    
    const validFiles = files.filter(file => {
      if (file.size > 25 * 1024 * 1024) {
        alert(`File ${file.name} is too large (max 25MB)`);
        return false;
      }
      
      const validExtensions = ['.pdf', '.doc', '.docx', '.xls', '.xlsx', 
                             '.jpg', '.jpeg', '.png', '.txt', '.csv'];
      const isValid = validExtensions.some(ext => 
        file.name.toLowerCase().endsWith(ext)
      );
      
      if (!isValid) {
        alert(`Unsupported file type: ${file.name}`);
        return false;
      }
      
      return true;
    });
    
    setAttachmentFiles(prev => [...prev, ...validFiles]);
  };

  const removeAttachment = (index) => {
    setAttachmentFiles(prev => prev.filter((_, i) => i !== index));
  };

  const clearAttachments = () => {
    setAttachmentFiles([]);
  };

  const handleSendEmails = async () => {
    if (!window.confirm('Are you sure you want to send this campaign to all recipients?')) {
      return;
    }

    const formData = new FormData();
    attachmentFiles.forEach(file => formData.append('attachments', file));

    try {
      const response = await api.post(
        `campaigns/${id}/generate_and_send/`, 
        formData, 
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );
      
      alert(response.data.message);
      clearAttachments();
      const updatedCampaign = await api.get(`campaigns/${id}/`);
      setCampaign(updatedCampaign.data);
    } catch (error) {
      alert('Error sending emails');
      console.error(error);
    }
  };

  if (loading) return <div className={styles.loading}>Loading campaign details...</div>;
  if (error) return <div className={styles.error}>{error}</div>;
  if (!campaign) return <div className={styles.error}>No campaign data found</div>;

  return (
    <div className={styles.container}>
      
      <div className={styles.header}>
        <div className={styles.campaignInfo}>
          <h1 className={styles.campaignName}>{campaign.name}</h1>
          <div className={styles.meta}>
            <span className={styles.topic}>{campaign.topic}</span>
            <span className={styles.status}>{campaign.status || 'Draft'}</span>
          </div>
          <p className={styles.details}>{campaign.details}</p>
        </div>
      </div>

      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2>Recipients</h2>
          <span className={styles.count}>
            {campaign.recipients?.length || 0} recipients
          </span>
        </div>
        
        {campaign.recipients?.length > 0 ? (
          <div className={styles.recipientsList}>
            {campaign.recipients.map((recipient) => (
              <div key={recipient.id} className={styles.recipient}>
                <div className={styles.recipientInfo}>
                  <span className={styles.recipientName}>{recipient.name}</span>
                  <span className={styles.recipientEmail}>{recipient.email}</span>
                </div>
                <div className={`${styles.statusBadge} ${recipient.is_sent ? styles.sent : styles.pending}`}>
                  {recipient.is_sent ? 'Sent' : 'Pending'}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className={styles.emptyState}>
            <p>No recipients added yet</p>
          </div>
        )}

        <div className={styles.importSection}>
          <h3>Import Recipients( csv file with column names email,name)</h3>
          <form onSubmit={handleImportRecipients} className={styles.importForm}>
            <label className={styles.fileInputLabel}>
              <input 
                type="file" 
                id="fileInput"
                onChange={(e) => setRecipientFile(e.target.files[0])} 
                className={styles.fileInput}
                accept=".csv,.xlsx,.xls"
              />
              <span>{recipientFile ? recipientFile.name : 'No file selected'}</span>
              <button 
                type="button" 
                className={styles.browseButton}
                onClick={() => document.getElementById('fileInput').click()}
              >
                Browse
              </button>
            </label>
            <button 
              type="submit" 
              className={styles.importButton}
              disabled={!recipientFile}
            >
              Import
            </button>
          </form>
          <p className={styles.fileHint}>Supports CSV or Excel files</p>
        </div>
      </div>

      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2>Email Content</h2>
          {!generatedEmail && (
            <button 
              onClick={handleGenerateContent} 
              className={styles.generateButton}
            >
              Generate Content
            </button>
          )}
        </div>

        {generatedEmail ? (
          <>
            <div className={styles.emailContent}>
              <div className={styles.emailSubject}>
                <h4>Subject:</h4>
                <p>{generatedEmail.subject}</p>
              </div>
              
              <div className={styles.emailBody}>
                <h4>Text Version:</h4>
                <div className={styles.textContent}>
                  <pre>{generatedEmail.body_text}</pre>
                </div>
              </div>
              
              <div className={styles.emailBody}>
                <h4>HTML Version:</h4>
                <div 
                  className={styles.htmlContent} 
                  dangerouslySetInnerHTML={{ __html: generatedEmail.body_html }} 
                />
              </div>
            </div>

            <div className={styles.sendSection}>
              <h3>Attachments (Optional)</h3>
              <div className={styles.attachmentControls}>
                <label className={styles.fileInputLabel}>
                  <input 
                    type="file" 
                    id="attachmentInput"
                    onChange={handleFileChange}
                    multiple
                    className={styles.fileInput}
                    accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png,.txt,.csv"
                  />
                  <button 
                    type="button" 
                    className={styles.browseButton}
                    onClick={() => document.getElementById('attachmentInput').click()}
                  >
                    Add Files
                  </button>
                </label>
                
                {attachmentFiles.length > 0 && (
                  <div className={styles.attachmentList}>
                    {attachmentFiles.map((file, index) => (
                      <div key={index} className={styles.attachmentItem}>
                        <span className={styles.fileName}>{file.name}</span>
                        <button
                          type="button"
                          onClick={() => removeAttachment(index)}
                          className={styles.removeButton}
                        >
                          ×
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={clearAttachments}
                      className={styles.clearAllButton}
                    >
                      Clear All
                    </button>
                  </div>
                )}
              </div>
              
              <button 
                onClick={handleSendEmails} 
                className={styles.sendButton}
                disabled={!campaign.recipients?.length}
              >
                {attachmentFiles.length > 0 
                  ? 'Send Campaign with Attachments' 
                  : 'Send Campaign'}
              </button>
            </div>
          </>
        ) : (
          <div className={styles.emptyState}>
            <p>No content generated yet. Click "Generate Content" to create your email.</p>
          </div>
        )}
      </div>
      <div className={`${styles.section} ${styles.replySection}`}>
        <div className={styles.sectionHeader}>
          <h2>Reply Management</h2>
        </div>
        <ProcessRepliesButton campaignId={id} />
      </div>
      
    </div>
  );
};

export default EmailCampaignDetail;
