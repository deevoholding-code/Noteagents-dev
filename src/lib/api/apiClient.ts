export interface RequestConfig {
  headers?: Record<string, string>;
  params?: Record<string, string | number | boolean>;
  timeoutMs?: number;
}

export interface ApiResponse<T> {
  data: T;
  status: number;
  message?: string;
}

class ApiClient {
  private baseUrl: string;
  private token: string | null = null;

  constructor(baseUrl: string = '/api') {
    this.baseUrl = baseUrl;
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('noteagents_auth_token');
    }
  }

  public setToken(token: string | null) {
    this.token = token;
    if (typeof window !== 'undefined') {
      if (token) {
        localStorage.setItem('noteagents_auth_token', token);
      } else {
        localStorage.removeItem('noteagents_auth_token');
      }
    }
  }

  public getToken(): string | null {
    return this.token;
  }

  private getHeaders(customHeaders?: Record<string, string>): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...customHeaders,
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    return headers;
  }

  public async get<T>(url: string, config?: RequestConfig): Promise<ApiResponse<T>> {
    // Prepared for real fetch calls when backend endpoints are mounted
    return {
      data: {} as T,
      status: 200,
    };
  }

  public async post<T>(url: string, body?: unknown, config?: RequestConfig): Promise<ApiResponse<T>> {
    return {
      data: {} as T,
      status: 201,
    };
  }

  public async put<T>(url: string, body?: unknown, config?: RequestConfig): Promise<ApiResponse<T>> {
    return {
      data: {} as T,
      status: 200,
    };
  }

  public async delete<T>(url: string, config?: RequestConfig): Promise<ApiResponse<T>> {
    return {
      data: {} as T,
      status: 200,
    };
  }
}

export const apiClient = new ApiClient();
