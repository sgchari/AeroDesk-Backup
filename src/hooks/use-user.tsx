'use client';

import React, { createContext, useContext, ReactNode, useState, useEffect, useCallback } from 'react';
import type { User as AppUser } from '@/lib/types';
import { mockUsers, mockCorporates, mockOperators, mockAgencies, mockHotelPartners } from '@/lib/data';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { initializeFirebase } from '@/firebase';
import { doc, getDoc, getFirestore } from 'firebase/firestore';

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

  const isDemoMode = process.env.NEXT_PUBLIC_DEMO_MODE !== 'false';

  const fetchUser = useCallback(async () => {
    setLoading(true);
    setError(null);

    // Production Path: Real Firebase Auth
    if (!isDemoMode) {
        const auth = getAuth();
        const firestore = getFirestore();
        
        onAuthStateChanged(auth, async (fbUser) => {
            if (fbUser) {
                try {
                    // Fetch extended profile from institutional roles
                    const userDoc = await getDoc(doc(firestore, 'users', fbUser.uid));
                    if (userDoc.exists()) {
                        setUser({ id: fbUser.uid, ...userDoc.data() } as AppUser);
                    } else {
                        // Fallback for new auth users without a profile
                        setUser({ id: fbUser.uid, email: fbUser.email || '', firstName: 'User', role: 'Customer' } as any);
                    }
                } catch (e: any) {
                    console.error("Auth context failed:", e);
                    setError(e);
                }
            } else {
                setUser(null);
            }
            setLoading(false);
        });
        return;
    }

    // Simulation Path: Local Demo Identities
    try {
        const demoUserId = typeof window !== 'undefined' ? localStorage.getItem('demoUserId') : null;
        if (demoUserId) {
            const foundUser = mockUsers.find(u => u.id === demoUserId);
            if (foundUser) {
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
  }, [isDemoMode]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const login = (uid: string) => {
    if (isDemoMode) {
        localStorage.setItem('demoUserId', uid);
        fetchUser();
    }
  };

  const logout = () => {
    if (isDemoMode) {
        localStorage.removeItem('demoUserId');
        setUser(null);
    } else {
        getAuth().signOut();
    }
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
