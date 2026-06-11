/**
 * FastAPI Client Service
 * 
 * Base API client configuration for connecting to the FastAPI backend.
 * Provides helper methods for GET, POST, PUT, DELETE requests with proper typing.
 */

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

export interface ApiResponse<T> {
  data: T;
  status: number;
  message?: string;
}

export const apiService = {
  async get<T>(endpoint: string, headers: HeadersInit = {}): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${BASE_URL}${endpoint}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...headers,
        },
      });
      const data = await response.json();
      return { data, status: response.status };
    } catch (error) {
      console.warn('FastAPI backend not running, returning simulated/local data.', error);
      throw error;
    }
  },

  async post<T>(endpoint: string, body: unknown, headers: HeadersInit = {}): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...headers,
        },
        body: JSON.stringify(body),
      });
      const data = await response.json();
      return { data, status: response.status };
    } catch (error) {
      console.warn('FastAPI backend not running, returning simulated/local data.', error);
      throw error;
    }
  },

  async put<T>(endpoint: string, body: unknown, headers: HeadersInit = {}): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${BASE_URL}${endpoint}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...headers,
        },
        body: JSON.stringify(body),
      });
      const data = await response.json();
      return { data, status: response.status };
    } catch (error) {
      console.warn('FastAPI backend not running, returning simulated/local data.', error);
      throw error;
    }
  },

  async delete<T>(endpoint: string, headers: HeadersInit = {}): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${BASE_URL}${endpoint}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          ...headers,
        },
      });
      const data = await response.json();
      return { data, status: response.status };
    } catch (error) {
      console.warn('FastAPI backend not running, returning simulated/local data.', error);
      throw error;
    }
  }
};
