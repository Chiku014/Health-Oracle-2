import axios from 'axios';
import { auth } from '../config/firebase';
import { getAuth } from 'firebase/auth';

const BASE_URL = 'http://localhost:3000/api';

// Mock data for development
const MOCK_PROFILE = {
  name: "John Doe",
  email: "john@example.com",
  age: 30,
  biologicalAge: 28,
  weight: 75,
  height: 175,
  gender: "Male",
  bmi: 24.5,
  bodyFat: 18,
};

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use(async (config) => {
  const user = getAuth().currentUser;
  if (user) {
    const token = await user.getIdToken();
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const healthService = {
  // Profile endpoints
  getUserProfile: async () => {
    const user = getAuth().currentUser;
    if (!user) {
      throw new Error('No authenticated user');
    }

    // Get the user's display name and email from Firebase
    const name = user.displayName || 'User';
    const email = user.email || '';

    // Return the actual user data
    return {
      name,
      email,
      age: 30, // Default values for now
      biologicalAge: 28,
      weight: 75,
      height: 175,
      gender: "Male",
      bmi: 24.5,
      bodyFat: 18,
    };
  },
  updateUserProfile: async (data: any) => {
    const response = await api.put('/profile', data);
    return response.data;
  },

  // Health data endpoints
  getDailyActivity: async () => {
    const response = await api.get('/health/activity');
    return response.data;
  },
  getSleepData: async () => {
    const response = await api.get('/health/sleep');
    return response.data;
  },
  getHeartRateData: async () => {
    const response = await api.get('/health/heart-rate');
    return response.data;
  },

  // Prediction endpoints
  getDiabetesPrediction: async () => {
    const response = await api.get('/predictions/diabetes');
    return response.data;
  },
  getHeartDiseasePrediction: async () => {
    const response = await api.get('/predictions/heart-disease');
    return response.data;
  },
  getSleepQualityPrediction: async () => {
    const response = await api.get('/predictions/sleep-quality');
    return response.data;
  },

  // Alerts endpoints
  getRecentAlerts: async () => {
    const response = await api.get('/alerts');
    return response.data;
  },
};

export default api; 