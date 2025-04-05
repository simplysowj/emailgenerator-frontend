import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CreateCampaign = () => {
  const [formData, setFormData] = useState({
    name: '',
    topic: '',
    details: '',
    tone: '',
  });
  const navigate = useNavigate(); // For navigation after campaign creation

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:8000/api/campaigns/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Add Authorization if using JWT
          // 'Authorization': `Bearer ${your_token}`
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (res.ok) {
        alert('Campaign created successfully!');
        console.log('Created:', data);
        // Navigate to campaign detail page after successful creation
        navigate(`/campaigns/${data.id}`);
      } else {
        alert('Error creating campaign.');
        console.error(data);
      }
    } catch (err) {
      console.error('Request failed:', err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="campaign-form">
      <input
        type="text"
        name="name"
        placeholder="Campaign Name"
        value={formData.name}
        onChange={handleChange}
        required
      />
      <input
        type="text"
        name="topic"
        placeholder="Topic"
        value={formData.topic}
        onChange={handleChange}
        required
      />
      <textarea
        name="details"
        placeholder="Details"
        value={formData.details}
        onChange={handleChange}
        required
      />
      <select
        name="tone"
        value={formData.tone}
        onChange={handleChange}
        required
      >
        <option value="">Select Tone</option>
        <option value="friendly">Friendly</option>
        <option value="professional">Professional</option>
        <option value="excited">Excited</option>
      </select>
      <button type="submit">Create Campaign</button>
    </form>
  );
};

export default CreateCampaign;
