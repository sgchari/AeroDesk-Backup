
'use client';

import React, { createContext, useContext, ReactNode, useState, useEffect, useCallback } from 'react';
import type { User as AppUser } from '@/lib/types';
import { mockUsers, mockCorporateTravelDesks } from '@/lib/data';

interface UserContextType {
  user: AppUser | null;
  isLoading: boolean;
  error: Error | null;
  login: (uid: string) => void;
  logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null);
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Memoized fetch function to ensure stability
  const fetchUser = useCallback(() => {
    setLoading(true);
    setError(null);
    try {
        const demoUserId = typeof window !== 'undefined' ? localStorage.getItem('demoUserId') : null;
        if (demoUserId) {
            const foundUser = mockUsers.find(u => u.id === demoUserId);
            if (foundUser) {
                // If the user is part of a corporate desk, find their company name
                if (['CTD Admin', 'Corporate Admin', 'Requester'].includes(foundUser.role) && foundUser.ctdId) {
                    const ctd = mockCorporateTravelDesks.find(d => d.id === foundUser.ctdId);
                    const userWithCompany = {
                        ...foundUser,
                        company: ctd?.companyName || "Corporate Inc."
                    };
                    setUser(userWithCompany as AppUser);
                } else {
                    setUser(foundUser as AppUser);
                }
            } else {
                setError(new Error("Demo user session invalid. Please log in again."));
                localStorage.removeItem('demoUserId');
                setUser(null);
            }
        } else {
            setUser(null);
        }
    } catch(e: any) {
        setError(e);
    } finally {
        setLoading(false);
    }
  }, []);

  // Initialize once on mount
  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const login = (uid: string) => {
    localStorage.setItem('demoUserId', uid);
    fetchUser();
  };

  const logout = () => {
    localStorage.removeItem('demoUserId');
    setUser(null);
  };

  const value = { user, isLoading, error, login, logout };

  return (
    <UserContext.Provider value={value}>
        {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}
