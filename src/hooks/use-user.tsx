
'use client';

import React, { createContext, useContext, ReactNode, useState, useEffect, useCallback } from 'react';
import type { User as AppUser, PlatformRole } from '@/lib/types';
import { mockUsers, mockCorporates, mockOperators, mockAgencies, mockHotelPartners } from '@/lib/data';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, getFirestore } from 'firebase/firestore';

interface UserContextType {
  user: AppUser | null;
  isLoading: boolean;
  error: Error | null;
  login: (uid: string) => void;
  logout: () => void;
  setDemoRole: (roleKey: string) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null);
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [activeDemoRole, setActiveDemoRole] = useState<string | null>(null);

  const isDemoMode = process.env.NEXT_PUBLIC_DEMO_MODE !== 'false';

  useEffect(() => {
    const saved = localStorage.getItem('activeDemoRole');
    if (saved) setActiveDemoRole(saved);
  }, []);

  const fetchUser = useCallback(async () => {
    setLoading(true);
    setError(null);

    if (!isDemoMode) {
        const auth = getAuth();
        const firestore = getFirestore();
        
        onAuthStateChanged(auth, async (fbUser) => {
            if (fbUser) {
                try {
                    const userDoc = await getDoc(doc(firestore, 'users', fbUser.uid));
                    if (userDoc.exists()) {
                        setUser({ id: fbUser.uid, ...userDoc.data() } as AppUser);
                    } else {
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

    try {
        const demoUserId = typeof window !== 'undefined' ? localStorage.getItem('demoUserId') : null;
        if (demoUserId) {
            let foundUser = mockUsers.find(u => u.id === demoUserId);
            if (foundUser) {
                let firmName = foundUser.company || "";
                
                // Demo Super User Logic
                if (foundUser.role === 'demo_super_user' && activeDemoRole) {
                    const mapping: Record<string, {role: string, platform: PlatformRole, firmIds: any}> = {
                        'customer': { role: 'Customer', platform: 'individual', firmIds: {} },
                        'operator': { role: 'Operator', platform: 'operator', firmIds: { operatorId: 'op-west-01' } },
                        'agency': { role: 'Travel Agency', platform: 'agency', firmIds: { agencyId: 'ag-west-01' } },
                        'corporate': { role: 'CTD Admin', platform: 'corporate', firmIds: { corporateId: 'corp-west-01', ctdId: 'corp-west-01' } },
                        'hotel': { role: 'Hotel Partner', platform: 'hotel', firmIds: { hotelPartnerId: 'hotel-01' } },
                        'admin': { role: 'Admin', platform: 'admin', firmIds: {} },
                    };
                    const mapped = mapping[activeDemoRole];
                    if (mapped) {
                        foundUser = {
                            ...foundUser,
                            role: mapped.role,
                            platformRole: mapped.platform,
                            ...mapped.firmIds
                        };
                    }
                }

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
  }, [isDemoMode, activeDemoRole]);

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
        localStorage.removeItem('activeDemoRole');
        setActiveDemoRole(null);
        setUser(null);
    } else {
        getAuth().signOut();
    }
  };

  const setDemoRole = (roleKey: string) => {
    setActiveDemoRole(roleKey);
    localStorage.setItem('activeDemoRole', roleKey);
  };

  const value = { user, isLoading, error, login, logout, setDemoRole };

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
