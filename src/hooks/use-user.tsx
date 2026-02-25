
'use client';

import React, { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import type { User as AppUser } from '@/lib/types';
import { mockUsers } from '@/lib/data';

interface UserContextType {
  user: AppUser | null;
  isLoading: boolean;
  error: Error | null;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null);
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // In demo mode, we check localStorage to see which user is "logged in".
    setLoading(true);
    try {
        const demoUserId = localStorage.getItem('demoUserId');
        if (demoUserId) {
            const foundUser = mockUsers.find(u => u.id === demoUserId);
            if (foundUser) {
                // In a real app, you'd fetch the full profile. Here, we use the mock.
                // We add the company name for CTD users for the demo dashboard.
                 if (foundUser.role === 'CTD Admin') {
                    const ctdAdminWithCompany = {
                        ...foundUser,
                        company: "Corporate Inc." // Add mock company name
                    };
                    setUser(ctdAdminWithCompany as AppUser);
                } else {
                    setUser(foundUser as AppUser);
                }

            } else {
                setError(new Error("Demo user not found. Please log in again."));
                localStorage.removeItem('demoUserId');
            }
        }
        // If no demoUserId, user remains null (logged out state).
    } catch(e: any) {
        setError(e);
    } finally {
        setLoading(false);
    }
  }, []);

  const value = { user, isLoading, error };

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
