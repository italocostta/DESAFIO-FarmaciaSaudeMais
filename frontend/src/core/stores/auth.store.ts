/* eslint-disable @typescript-eslint/no-explicit-any */
// src/core/stores/auth.store.ts
import { create, StateCreator } from 'zustand';

export type Role = 'GERENTE' | 'ATENDENTE' | 'FARMACEUTICO';

type UserLite = {
  id?: number;
  email?: string;
  role?: Role;
  nome?: string;                // opcional (pode vir do funcionário)
};

export type AuthState = {
  token: string | null;
  email: string | null;
  role: Role | null;
  nome: string | null;
  user: UserLite | null;

  login: (args: { token: string; user?: any | null }) => void;
  logout: () => void;
  bootstrap: () => void;
};

function parseJwt<T = any>(token?: string | null): Partial<T> | null {
  try {
    if (!token) return null;
    const [, b64] = token.split('.');
    const json = atob(b64.replace(/-/g, '+').replace(/_/g, '/'));
    return JSON.parse(json);
  } catch {
    return null;
  }
}

const creator: StateCreator<AuthState> = (set) => ({
  token: null,
  email: null,
  role: null,
  nome: null,
  user: null,

  login: ({ token, user }: { token: string; user?: any | null }) => {
    localStorage.setItem('saudemais_token', token);

    const payload = parseJwt<{ email?: string; role?: Role; name?: string }>(token) || {};
    const email = user?.email ?? payload.email ?? null;
    const role = (user?.role as Role | undefined) ?? (payload as any)?.role ?? null;
    const nome = user?.nome ?? user?.funcionario?.nome ?? (payload as any)?.name ?? null;

    set({ token, email, role: role ?? null, nome, user: user ?? null });
  },

  logout: () => {
    localStorage.removeItem('saudemais_token');
    set({ token: null, email: null, role: null, nome: null, user: null });
  },

  bootstrap: () => {
    const token = localStorage.getItem('saudemais_token');
    if (!token) return;
    const payload = parseJwt<{ email?: string; role?: Role; name?: string }>(token) || {};
    set({
      token,
      email: payload.email ?? null,
      role: (payload as any).role ?? null,
      nome: (payload as any).name ?? null,
      user: null,
    });
  },
});

export const useAuthStore = create<AuthState>(creator);
