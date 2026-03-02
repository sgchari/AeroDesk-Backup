'use client';

import React, { createContext, useContext, ReactNode, useState, useEffect, useCallback } from 'react';
import type { User as AppUser } from '@/lib/types';
import { mockUsers, mockCorporates, mockOperators, mockAgencies, mockHotelPartners } from '@/lib/data';

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

  const fetchUser = useCallback(() => {
    if (!user) setLoading(true);
    
    setError(null);
    try {
        const demoUserId = typeof window !== 'undefined' ? localStorage.getItem('demoUserId') : null;
        if (demoUserId) {
            const foundUser = mockUsers.find(u => u.id === demoUserId);
            if (foundUser) {
                // Institutional Firm Mapping
                let firmName = foundUser.company || "";
                
                if (foundUser.corporateId) {
                    const ctd = mockCorporates.find(d => d.id === foundUser.corporateId);
                    firmName = ctd?.companyName || "Stark Industries";
                } else if (foundUser.operatorId) {
                    const op = mockOperators.find(o => o.id === foundUser.operatorId);
                    firmName = op?.companyName || "FlyCo Charter";
                } else if (foundUser.agencyId) {
                    const ag = mockAgencies.find(a => a.id === foundUser.agencyId);
                    firmName = ag?.companyName || "Sky Distributors";
                } else if (foundUser.hotelPartnerId) {
                    const hotel = mockHotelPartners.find(h => h.id === foundUser.hotelPartnerId);
                    firmName = hotel?.companyName || "Grand Hotels Group";
                }

                setUser({
                    ...foundUser,
                    company: firmName
                } as AppUser);
            } else {
                setError(new Error("Demo session invalid."));
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
  }, [user]);

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
