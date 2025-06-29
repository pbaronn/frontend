import api from './api';
import { jwtDecode } from 'jwt-decode';

export const login = async (email, password) => {
  const { data } = await api.post('/auth/login', { email, password });
  localStorage.setItem('token', data.token);
  return data.token;
};

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('privateKey');
};

export const getCurrentUser = () => {
  try {
    if (typeof window === 'undefined') return null;
    const token = localStorage.getItem('token');
    if (!token) return null;
    const decoded = jwtDecode(token);
    if (decoded.exp && Date.now() >= decoded.exp * 1000) {
      logout();
      return null;
    }
    return decoded.user || decoded;
  } catch (error) {
    return null;
  }
};