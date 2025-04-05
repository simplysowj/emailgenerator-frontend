import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../axios';

const EmailCampaignDetail = () => {
  const { id } = useParams();
  const [campaign, setCampaign] = useState(null);
  const [generatedEmail, setGeneratedEmail] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch campaign details
    api.get(`campaigns/${id}/`)
      .then(response => {
        setCampaign(response.data);
        fetchGeneratedEmail();
      })
      .catch(error => {
        setError('Failed to fetch campaign details');
        console.error(error);
      });
  }, [id]);

  const handleImportRecipients = (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append('file', event.target.file.files[0]);

    api.post(`campaigns/${id}/import_recipients/`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data', // Explicitly setting the content type if needed
      },
    })
      .then(response => {
        alert(response.data.message);
      })
      .catch(error => {
        alert('Error importing recipients');
        console.error(error);
      });
  };

  const handleGenerateContent = () => {
    api.post(`campaigns/${id}/generate_content/`)
      .then(response => {
        alert('Email content generated');
        fetchGeneratedEmail(); // Fetch the generated email after content is generated
      })
      .catch(error => {
        alert('Error generating content');
        console.error(error);
      });
  };

  // Fetch generated email content
  const fetchGeneratedEmail = () => {
    api.get(`campaigns/${id}/preview/`) // This calls your preview endpoint
      .then(response => {
        setGeneratedEmail(response.data); // Set the response data to the state
      })
      .catch(error => {
        setGeneratedEmail(null); // Reset generated email content on error
        console.error(error);
      });
  };

  const handleSendEmails = () => {
    api.post(`campaigns/${id}/send_emails/`)
      .then(response => {
        alert(response.data.message);
      })
      .catch(error => {
        alert('Error sending emails');
        console.error(error);
      });
  };

  if (error) {
    return <div>{error}</div>;
  }

  if (!campaign) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>{campaign.name}</h1>
      <p>{campaign.topic}</p>
      <p>{campaign.details}</p>

      <h2>Recipients</h2>
      {campaign.recipients && campaign.recipients.length > 0 ? (
        <ul>
          {campaign.recipients.map((recipient) => (
            <li key={recipient.id}>
              {recipient.name} ({recipient.email}) - {recipient.is_sent ? 'Sent' : 'Not Sent'}
            </li>
          ))}
        </ul>
      ) : (
        <p>No recipients yet.</p>
      )}

      <h3>Import Recipients</h3>
      <form onSubmit={handleImportRecipients}>
        <input type="file" name="file" />
        <button type="submit">Import</button>
      </form>

      {/* Render generated email content or message based on availability */}
      {generatedEmail ? (
        <div>
          <h3>Generated Content</h3>
          <h4>Subject: {generatedEmail.subject}</h4>
          <h5>Body (Text):</h5>
          <pre>{generatedEmail.body_text}</pre>
          <h5>Body (HTML):</h5>
          <div dangerouslySetInnerHTML={{ __html: generatedEmail.body_html }} />
        </div>
      ) : (
        <div>
          <h4>No content generated yet.</h4>
          <button onClick={handleGenerateContent}>Generate Content</button>
        </div>
      )}

      {/* Send emails button */}
      {generatedEmail && (
        <button onClick={handleSendEmails}>Send Emails</button>
      )}
    </div>
  );
};

export default EmailCampaignDetail;
