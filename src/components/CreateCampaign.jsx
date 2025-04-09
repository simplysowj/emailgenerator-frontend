import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './CreateCampaign.module.css';

const CreateCampaign = () => {
  const [formData, setFormData] = useState({
    name: '',
    topic: '',
    details: '',
    tone: '',
  });
  const [files, setFiles] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    
    // Validate files
    for (const file of selectedFiles) {
      if (file.size > 10 * 1024 * 1024) {
        setError(`File ${file.name} is too large (max 10MB)`);
        return;
      }
      if (!['.pdf', '.doc', '.docx', '.jpg', '.jpeg', '.png']
        .some(ext => file.name.toLowerCase().endsWith(ext))) {
        setError(`Unsupported file type: ${file.name}`);
        return;
      }
    }
    
    setFiles(selectedFiles);
    setError(null);
  };

  const removeFile = (index) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.name || !formData.topic || !formData.details) {
      setError('Please fill in all required fields');
      return;
    }
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      const formDataToSend = new FormData();
      
      // Append form data
      Object.entries(formData).forEach(([key, value]) => {
        formDataToSend.append(key, value);
      });
      
      // Append files
      files.forEach((file) => {
        formDataToSend.append('attachments', file);
      });

      const res = await fetch('https://email-backend-bee9bjdec6gkhuf3.eastus2-01.azurewebsites.net/api/campaigns/', {
        method: 'POST',
        body: formDataToSend,
      });

      if (res.ok) {
        const data = await res.json();
        navigate(`/campaigns/${data.id}`);
      } else {
        const errorData = await res.json().catch(() => ({}));
        setError(errorData.message || errorData.detail || 'Error creating campaign');
      }
    } catch (err) {
      setError('Network error. Please check your connection and try again.');
      console.error('Request failed:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.header}>
          <h1>Create New Campaign</h1>
          <p>Fill in the details below to launch your email campaign</p>
        </div>

        {error && <div className={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit} className={styles.form} encType="multipart/form-data">
          <div className={styles.formGroup}>
            <label htmlFor="name">Campaign Name *</label>
            <input
              type="text"
              id="name"
              name="name"
              placeholder="e.g. Summer Sale Announcement"
              value={formData.name}
              onChange={handleChange}
              required
              className={styles.input}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="topic">Campaign Topic *</label>
            <input
              type="text"
              id="topic"
              name="topic"
              placeholder="e.g. New Product Launch"
              value={formData.topic}
              onChange={handleChange}
              required
              className={styles.input}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="details">Campaign Details *</label>
            <textarea
              id="details"
              name="details"
              placeholder="Describe your campaign goals, target audience, and key messages..."
              value={formData.details}
              onChange={handleChange}
              required
              className={styles.textarea}
              rows="5"
            />
            <p className={styles.hint}>Be specific about what you want to communicate</p>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="tone">Email Tone</label>
            <select
              id="tone"
              name="tone"
              value={formData.tone}
              onChange={handleChange}
              className={styles.select}
            >
              <option value="">Select a tone for your emails</option>
              <option value="friendly">Friendly</option>
              <option value="professional">Professional</option>
              <option value="excited">Excited</option>
              <option value="informative">Informative</option>
              <option value="urgent">Urgent</option>
            </select>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="attachments">Attachments</label>
            <input
              type="file"
              id="attachments"
              name="attachments"
              onChange={handleFileChange}
              multiple
              className={styles.input}
            />
            <p className={styles.hint}>Supported formats: PDF, DOC, DOCX, JPG, PNG (max 10MB each)</p>
            
            {files.length > 0 && (
              <div className={styles.fileList}>
                <p>Selected files:</p>
                <ul>
                  {files.map((file, index) => (
                    <li key={index}>
                      {file.name} 
                      <button 
                        type="button" 
                        onClick={() => removeFile(index)}
                        className={styles.removeFile}
                      >
                        ×
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className={styles.buttonGroup}>
            <button 
              type="submit" 
              className={styles.submitButton}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className={styles.spinner}></span>
                  Creating...
                </>
              ) : (
                'Create Campaign'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateCampaign;
