import type { ApiResponse } from '../types/api';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1';

class ApiClient {
  private getToken(): string | null {
    return localStorage.getItem('whatsappmsg_token') || localStorage.getItem('chatflow_token');
  }

  private getRefreshToken(): string | null {
    return localStorage.getItem('whatsappmsg_refresh_token') || localStorage.getItem('chatflow_refresh_token');
  }

  private setTokens(accessToken: string, refreshToken?: string): void {
    localStorage.setItem('whatsappmsg_token', accessToken);
    localStorage.setItem('chatflow_token', accessToken);
    if (refreshToken) {
      localStorage.setItem('whatsappmsg_refresh_token', refreshToken);
      localStorage.setItem('chatflow_refresh_token', refreshToken);
    }
  }

  private getHeaders(isFormData = false): HeadersInit {
    const token = this.getToken();
    const headers: Record<string, string> = {
      'X-Request-ID': `web_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
    if (!isFormData) {
      headers['Content-Type'] = 'application/json';
    }
    return headers;
  }

  private async handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
    const contentType = response.headers.get('content-type');
    let data: ApiResponse<T>;

    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      const text = await response.text();
      data = {
        success: response.ok,
        data: {} as T,
        message: text || response.statusText,
      };
    }

    if (!response.ok || !data.success) {
      const errorMessage = data.message || `Request failed with status ${response.status}`;
      const err = new Error(errorMessage);
      (err as any).statusCode = response.status;
      (err as any).errorCode = data.errorCode;
      (err as any).errors = data.errors;
      throw err;
    }

    return data;
  }

  private async requestWithRefresh<T>(
    endpoint: string,
    options: RequestInit,
    isRetry = false
  ): Promise<ApiResponse<T>> {
    try {
      const url = endpoint.startsWith('http') ? endpoint : `${BASE_URL}${endpoint}`;
      const isFormData = typeof FormData !== 'undefined' && options.body instanceof FormData;
      const response = await fetch(url, {
        ...options,
        headers: {
          ...this.getHeaders(isFormData),
          ...options.headers,
        },
      });

      // Handle token expiration retry
      if (response.status === 401 && !isRetry) {
        const refreshToken = this.getRefreshToken();
        if (refreshToken) {
          try {
            const refreshRes = await fetch(`${BASE_URL}/auth/refresh`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ refreshToken }),
            });
            const refreshData = await refreshRes.json();
            if (refreshRes.ok && refreshData.success && refreshData.data?.accessToken) {
              this.setTokens(refreshData.data.accessToken, refreshData.data.refreshToken);
              // Retry original request once
              return this.requestWithRefresh<T>(endpoint, options, true);
            }
          } catch {
            // If refresh fails, let it fall through
          }
        }
      }

      return await this.handleResponse<T>(response);
    } catch (error: any) {
      // Re-throw handled API errors
      if (error.statusCode || error.errorCode) {
        throw error;
      }
      // Network or connection error fallback
      throw new Error(error.message || 'Unable to connect to WhatsApp API server.');
    }
  }

  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.requestWithRefresh<T>(endpoint, { method: 'GET' });
  }

  async post<T>(endpoint: string, body?: unknown): Promise<ApiResponse<T>> {
    return this.requestWithRefresh<T>(endpoint, {
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  async upload<T>(endpoint: string, formData: FormData): Promise<ApiResponse<T>> {
    return this.requestWithRefresh<T>(endpoint, {
      method: 'POST',
      body: formData,
    });
  }

  async patch<T>(endpoint: string, body?: unknown): Promise<ApiResponse<T>> {
    return this.requestWithRefresh<T>(endpoint, {
      method: 'PATCH',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  async put<T>(endpoint: string, body?: unknown): Promise<ApiResponse<T>> {
    return this.requestWithRefresh<T>(endpoint, {
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.requestWithRefresh<T>(endpoint, { method: 'DELETE' });
  }
}

export const apiClient = new ApiClient();
