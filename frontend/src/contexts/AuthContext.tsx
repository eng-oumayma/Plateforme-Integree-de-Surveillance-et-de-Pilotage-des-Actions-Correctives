// import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
// import type { User } from '../types';
// import { authService } from '../services/authService';

// const INACTIVITY_LIMIT = 30 * 60 * 1000; // 30 min
// const WARNING_BEFORE = 2 * 60 * 1000;    // warn 2 min before

// interface AuthContextValue {
//   user: User | null;
//   loading: boolean;
//   login: (email: string, password: string) => Promise<void>;
//   logout: () => Promise<void>;
//   refreshUser: () => Promise<void>;
//   showInactivityWarning: boolean;
//   extendSession: () => void;
// }

// const AuthContext = createContext<AuthContextValue | null>(null);

// export function AuthProvider({ children }: { children: React.ReactNode }) {
//   const [user, setUser] = useState<User | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [showInactivityWarning, setShowInactivityWarning] = useState(false);

//   const inactivityTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
//   const warningTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

//   const logout = useCallback(async () => {
//     await authService.logout();
//     setUser(null);
//     clearTimeout(inactivityTimer.current!);
//     clearTimeout(warningTimer.current!);
//   }, []);

//   const resetInactivityTimers = useCallback(() => {
//     setShowInactivityWarning(false);
//     clearTimeout(inactivityTimer.current!);
//     clearTimeout(warningTimer.current!);

//     warningTimer.current = setTimeout(() => {
//       setShowInactivityWarning(true);
//     }, INACTIVITY_LIMIT - WARNING_BEFORE);

//     inactivityTimer.current = setTimeout(() => {
//       logout();
//     }, INACTIVITY_LIMIT);
//   }, [logout]);

//   const extendSession = useCallback(() => {
//     setShowInactivityWarning(false);
//     resetInactivityTimers();
//   }, [resetInactivityTimers]);

//   const refreshUser = useCallback(async () => {
//     try {
//       const me = await authService.getMe();
//       setUser(me);
//     } catch {
//       setUser(null);
//     }
//   }, []);

//   useEffect(() => {
//     const token = localStorage.getItem('accessToken');
//     if (token) {
//       authService.getMe()
//         .then((me) => { setUser(me); resetInactivityTimers(); })
//         .catch(() => { localStorage.clear(); })
//         .finally(() => setLoading(false));
//     } else {
//       setLoading(false);
//     }
//   }, [resetInactivityTimers]);

//   // Track activity
//   useEffect(() => {
//     if (!user) return;
//     const events = ['mousemove', 'keydown', 'click', 'scroll'];
//     events.forEach((e) => window.addEventListener(e, resetInactivityTimers));
//     return () => events.forEach((e) => window.removeEventListener(e, resetInactivityTimers));
//   }, [user, resetInactivityTimers]);

//   const login = async (email: string, password: string) => {
//     const { tokens, user: me } = await authService.login({ email, password });
//     localStorage.setItem('accessToken', tokens.accessToken);
//     localStorage.setItem('refreshToken', tokens.refreshToken);
//     setUser(me);
//     resetInactivityTimers();
//   };

//   return (
//     <AuthContext.Provider value={{ user, loading, login, logout, refreshUser, showInactivityWarning, extendSession }}>
//       {children}
//     </AuthContext.Provider>
//   );
// }

// export function useAuth() {
//   const ctx = useContext(AuthContext);
//   if (!ctx) throw new Error('useAuth must be used within AuthProvider');
//   return ctx;
// }

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
} from 'react';

import type { User } from '../types';
import { authService } from '../services/authService';
import type { ReactNode } from 'react';

const INACTIVITY_LIMIT = 30 * 60 * 1000;
const WARNING_BEFORE = 2 * 60 * 1000;

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  showInactivityWarning: boolean;
  extendSession: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [showInactivityWarning, setShowInactivityWarning] = useState(false);

  // const inactivityTimer = useRef<NodeJS.Timeout | null>(null);
  // const warningTimer = useRef<NodeJS.Timeout | null>(null);
  const inactivityTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
const warningTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const logout = useCallback(async () => {
    await authService.logout();
    setUser(null);
    if (inactivityTimer.current) clearTimeout(inactivityTimer.current);
    if (warningTimer.current) clearTimeout(warningTimer.current);
  }, []);

  const resetInactivityTimers = useCallback(() => {
    setShowInactivityWarning(false);

    if (inactivityTimer.current) clearTimeout(inactivityTimer.current);
    if (warningTimer.current) clearTimeout(warningTimer.current);

    warningTimer.current = setTimeout(() => {
      setShowInactivityWarning(true);
    }, INACTIVITY_LIMIT - WARNING_BEFORE);

    inactivityTimer.current = setTimeout(() => {
      logout();
    }, INACTIVITY_LIMIT);
  }, [logout]);

  const extendSession = useCallback(() => {
    setShowInactivityWarning(false);
    resetInactivityTimers();
  }, [resetInactivityTimers]);

  const refreshUser = useCallback(async () => {
    try {
      const me = await authService.getMe();
      setUser(me);
    } catch {
      setUser(null);
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('access_token');

    if (token) {
      authService
        .getMe()
        .then((me) => {
          setUser(me);
          resetInactivityTimers();
        })
        .catch(() => localStorage.clear())
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [resetInactivityTimers]);

  useEffect(() => {
    if (!user) return;

    const events = ['mousemove', 'keydown', 'click', 'scroll'];

    events.forEach((e) =>
      window.addEventListener(e, resetInactivityTimers)
    );

    return () =>
      events.forEach((e) =>
        window.removeEventListener(e, resetInactivityTimers)
      );
  }, [user, resetInactivityTimers]);

  const login = async (email: string, password: string) => {
    const { tokens, user: me } = await authService.login({ email, password });

    localStorage.setItem('access_token', tokens.accessToken);
    localStorage.setItem('refresh_token', tokens.refreshToken);

    setUser(me);
    resetInactivityTimers();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        refreshUser,
        showInactivityWarning,
        extendSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
