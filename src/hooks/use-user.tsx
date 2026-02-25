
'use client';

import React, { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import type { User as AppUser } from '@/lib/types';
import { mockUsers } from '@/lib/data';

interface UserContextType {
  user: AppUser | null;
  isLoading: boolean;
  error: Error | null;
  logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null);
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const pathname = usePathname();

  const logout = () => {
    localStorage.removeItem('demoUserId');
    setUser(null);
  };

  useEffect(() => {
    setLoading(true);
    setError(null);
    try {
        const demoUserId = localStorage.getItem('demoUserId');
        if (demoUserId) {
            const foundUser = mockUsers.find(u => u.id === demoUserId);
            if (foundUser) {
                // If the user is part of a corporate desk, find their company name
                if (['CTD Admin', 'Corporate Admin', 'Requester'].includes(foundUser.role)) {
                    const ctd = mockUsers.find(u => u.role === 'CTD Admin' && u.ctdId === foundUser.ctdId);
                    const userWithCompany = {
                        ...foundUser,
                        company: ctd?.company || "Corporate Inc."
                    };
                    setUser(userWithCompany as AppUser);
                } else {
                    setUser(foundUser as AppUser);
                }
            } else {
                setError(new Error("Demo user not found. Please log in again."));
                logout(); // Clear invalid user ID
            }
        } else {
            setUser(null); // No user ID found, so ensure user is logged out
        }
    } catch(e: any) {
        setError(e);
    } finally {
        setLoading(false);
    }
  }, [pathname]); // Re-run this effect whenever the user navigates

  const value = { user, isLoading, error, logout };

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
