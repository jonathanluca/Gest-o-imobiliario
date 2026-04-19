const TOKEN_KEY = 'erp_token';
const USER_KEY = 'erp_user';

export type AuthUser = {
  id: string;
  full_name: string | null;
  email: string | null;
  role: string | null;
};

export function saveAuth(token: string, user: AuthUser) {
  if (typeof window !== 'undefined') {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }
}

export function getToken(): string | null {
  if (typeof window !== 'undefined') return localStorage.getItem(TOKEN_KEY);
  return null;
}

export function getUser(): AuthUser | null {
  if (typeof window !== 'undefined') {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  }
  return null;
}

export function clearAuth() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  }
}
