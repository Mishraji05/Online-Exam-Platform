import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

class ApiService {
  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          localStorage.removeItem('token');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  setAuthToken(token) {
    if (token) {
      this.api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete this.api.defaults.headers.common['Authorization'];
    }
  }

  // Auth endpoints
  async login(credentials) {
    return this.api.post('/auth/login', credentials);
  }

  async register(userData) {
    return this.api.post('/auth/register', userData);
  }

  async getUserProfile() {
    return this.api.get('/auth/profile');
  }

  // Exam endpoints
  async getExamQuestions() {
    return this.api.get('/exam/questions');
  }

  // Results endpoints
  async submitExam(examData) {
    return this.api.post('/results/submit', examData);
  }

  async getResult(resultId) {
    return this.api.get(`/results/${resultId}`);
  }

  async getUserResults() {
    return this.api.get('/results');
  }
}

export const apiService = new ApiService();