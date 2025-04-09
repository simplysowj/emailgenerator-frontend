import axios from 'axios';

// Create an Axios instance with default settings
const api = axios.create({
  baseURL: 'https://email-backend-bee9bjdec6gkhuf3.eastus2-01.azurewebsites.net/api/', // Make sure this points to your Django API
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
