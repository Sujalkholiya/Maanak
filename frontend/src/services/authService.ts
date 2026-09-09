import { api } from './api';

export interface UserProfile {
  id: string;
  userName: string;
  email: string;
  role: 'Officer' | 'Admin' | 'Inspector' | 'User';
  fullName?: string;
  officerId?: string;
  badgeNumber?: string;
  department?: string;
  jurisdiction?: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  token?: string;
  user?: UserProfile;
  Post?: UserProfile;
}

export interface LoginCredentials {
  identifier: string; // officerId, username, or email
  password: string;
}

export interface RegisterPayload {
  userName: string;
  email: string;
  password: string;
  fullName?: string;
  officerId?: string;
  role?: string;
  badgeNumber?: string;
}

const TOKEN_KEY = 'maanak_token';
const USER_KEY = 'maanak_user';

export const authService = {
  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  },

  getUser(): UserProfile | null {
    const raw = localStorage.getItem(USER_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  },

  saveSession(token?: string, user?: UserProfile) {
    if (token) localStorage.setItem(TOKEN_KEY, token);
    if (user) localStorage.setItem(USER_KEY, JSON.stringify(user));
  },

  clearSession() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  },

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const payload = {
      UserName: credentials.identifier,
      Password: credentials.password,
    };
    const res = await api.post<AuthResponse>('/api/auth/login', payload);
    const user = res.user || res.Post;
    if (res.token || user) {
      this.saveSession(res.token, user);
    }
    return res;
  },

  async register(data: RegisterPayload): Promise<AuthResponse> {
    const payload = {
      UserName: data.userName,
      Email: data.email,
      Password: data.password,
      fullName: data.fullName,
      officerId: data.officerId,
      Role: data.role || 'Officer',
      badgeNumber: data.badgeNumber,
    };
    const res = await api.post<AuthResponse>('/api/auth/register', payload);
    const user = res.user || res.Post;
    if (res.token || user) {
      this.saveSession(res.token, user);
    }
    return res;
  },

  async getMe(): Promise<UserProfile | null> {
    try {
      const res = await api.get<{ success: boolean; user: UserProfile }>('/api/auth/me');
      if (res && res.user) {
        this.saveSession(undefined, res.user);
        return res.user;
      }
    } catch (e) {
      console.warn('getMe session check failed:', e);
    }
    return this.getUser();
  },

  async logout(): Promise<void> {
    try {
      await api.post('/api/auth/logout');
    } catch (e) {
      console.warn('Logout API warning:', e);
    } finally {
      this.clearSession();
    }
  },
};
