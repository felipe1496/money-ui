import axios from 'axios';
import { env } from '../utils/functions';

export const API = axios.create({
  baseURL: env().API_URL,
});

API.defaults.headers.post['Content-Type'] = 'application/json';

API.interceptors.request.use((config) => {
  const access_token = localStorage.getItem('access_token');

  if (access_token) {
    config.headers.Authorization = `Bearer ${localStorage.getItem('access_token')}`;
  }

  return config;
});
