import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const auth = {
  register: async (data: any) => {
    const response = await api.post('/auth/register', data);
    return response.data;
  },
  
  login: async (data: any) => {
    const response = await api.post('/auth/login', data);
    return response.data;
  },
};

export const waterIntake = {
  addIntake: async (amount: number) => {
    const response = await api.post('/water-intake', { amount });
    return response.data;
  },
  
  getTodayIntake: async () => {
    const response = await api.get('/water-intake/today');
    return response.data;
  },
  
  getHistory: async (startDate: string, endDate: string) => {
    const response = await api.get('/water-intake/history', {
      params: { start_date: startDate, end_date: endDate },
    });
    return response.data;
  },
};

export const badges = {
  getBadges: async () => {
    const response = await api.get('/badges');
    return response.data;
  },
};

export default api;