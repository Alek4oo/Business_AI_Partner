import { UserProfile } from '../types';

const API_URL = 'http://localhost:3001/api';

export const api = {
    setToken(token: string) {
        localStorage.setItem('token', token);
    },

    getToken() {
        return localStorage.getItem('token');
    },

    logout() {
        localStorage.removeItem('token');
    },

    async register(data: any) {
        const response = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Registration failed');
        }
        return response.json();
    },

    async login(data: any) {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Login failed');
        }
        return response.json();
    },

    async getProfile() {
        const token = this.getToken();
        if (!token) return null;

        const response = await fetch(`${API_URL}/user/profile`, {
            headers: { 'Authorization': `Bearer ${token}` },
        });
        if (!response.ok) return null;
        return response.json();
    },

    async updateProfile(data: UserProfile) {
        const token = this.getToken();
        if (!token) throw new Error('Not authenticated');

        const response = await fetch(`${API_URL}/user/profile`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(data),
        });
        if (!response.ok) throw new Error('Failed to update profile');
        return response.json();
    }
};
