'use client';

import React, { createContext, useContext, ReactNode, useState, useEffect, useCallback, useRef } from 'react';
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
  
  const authListenerAttached = useRef(false);
  const prevUserStringRef = useRef<string>('');
  const isFetchingRef = useRef(false);

  const isDemoMode = process.env.NEXT_PUBLIC_DEMO_MODE !== 'false';

  // Persistent role detection
  useEffect(() => {
    if (typeof window !== 'undefined') {
        const saved = localStorage.getItem('activeDemoRole');
        if (saved) setActiveDemoRole(saved);
    }
  }, []);

  const fetchUser = useCallback(async (roleKeyOverride?: string) => {
    if (!isDemoMode) return;
    if (isFetchingRef.current && !roleKeyOverride) return;

    isFetchingRef.current = true;
    setLoading(true);
    setError(null);

    try {
        const demoUserId = typeof window !== 'undefined' ? localStorage.getItem('demoUserId') : null;
        const currentRoleKey = roleKeyOverride || (typeof window !== 'undefined' ? localStorage.getItem('activeDemoRole') : null);
        
        if (demoUserId) {
            let foundUser = mockUsers.find(u => u.id === demoUserId);
            
            if (!foundUser) {
                const idMap: Record<string, string> = {
                    'admin': 'admin-demo',
                    'operator': 'operator-demo',
                    'agency': 'agency-demo',
                    'corporate': 'corporate-demo',
                    'customer': 'customer-demo',
                    'hotel': 'hotel-demo'
                };
                const realId = idMap[demoUserId] || demoUserId;
                foundUser = mockUsers.find(u => u.id === realId);
            }

            if (foundUser) {
                let mappedUser = { ...foundUser };
                
                if (mappedUser.role === 'demo_super_user' && currentRoleKey) {
                    const mapping: Record<string, {role: string, platform: PlatformRole, firmIds: any}> = {
                        'customer': { role: 'Customer', platform: 'individual', firmIds: {} },
                        'operator': { role: 'Operator', platform: 'operator', firmIds: { operatorId: 'op-west-01' } },
                        'agency': { role: 'Travel Agency', platform: 'agency', firmIds: { agencyId: 'ag-west-01' } },
                        'corporate': { role: 'CTD Admin', platform: 'corporate', firmIds: { corporateId: 'corp-west-01', ctdId: 'corp-west-01' } },
                        'hotel': { role: 'Hotel Partner', platform: 'hotel', firmIds: { hotelPartnerId: 'hotel-01' } },
                        'admin': { role: 'Admin', platform: 'admin', firmIds: {} },
                    };
                    const mapped = mapping[currentRoleKey];
                    if (mapped) {
                        mappedUser = {
                            ...mappedUser,
                            role: mapped.role,
                            platformRole: mapped.platform,
                            ...mapped.firmIds
                        };
                    }
                }

                let firmName = mappedUser.company || "";
                if (mappedUser.corporateId) {
                    firmName = mockCorporates.find(d => d.id === mappedUser.corporateId)?.companyName || "Stark Industries";
                } else if (mappedUser.operatorId) {
                    firmName = mockOperators.find(o => o.id === mappedUser.operatorId)?.companyName || "FlyCo Charter";
                } else if (mappedUser.agencyId) {
                    firmName = mockAgencies.find(a => a.id === mappedUser.agencyId)?.companyName || "Sky Distributors";
                } else if (mappedUser.hotelPartnerId) {
                    firmName = mockHotelPartners.find(h => h.id === mappedUser.hotelPartnerId)?.companyName || "Grand Hotels Group";
                }

                const finalUser = { ...mappedUser, company: firmName } as AppUser;
                const userString = JSON.stringify(finalUser);
                
                if (userString !== prevUserStringRef.current) {
                    setUser(finalUser);
                    prevUserStringRef.current = userString;
                }
            } else {
                if (typeof window !== 'undefined') localStorage.removeItem('demoUserId');
                setUser(null);
                prevUserStringRef.current = 'null';
            }
        } else {
            setUser(null);
            prevUserStringRef.current = 'null';
        }
    } catch(e: any) {
        setError(e);
    } finally {
        setLoading(false);
        isFetchingRef.current = false;
    }
  }, [isDemoMode]);

  useEffect(() => {
    if (isDemoMode) {
        fetchUser();
        return;
    }

    if (authListenerAttached.current) return;
    authListenerAttached.current = true;

    const auth = getAuth();
    const firestore = getFirestore();
    
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
        setLoading(true);
        if (fbUser) {
            try {
                const userDoc = await getDoc(doc(firestore, 'users', fbUser.uid));
                if (userDoc.exists()) {
                    const userData = { id: fbUser.uid, ...userDoc.data() } as AppUser;
                    setUser(userData);
                } else {
                    setUser({ id: fbUser.uid, email: fbUser.email || '', firstName: 'User', role: 'Customer' } as any);
                }
            } catch (e: any) {
                setError(e);
            }
        } else {
            setUser(null);
        }
        setLoading(false);
    });

    return () => {
        unsubscribe();
        authListenerAttached.current = false;
    };
  }, [isDemoMode, fetchUser]);

  const login = (uid: string) => {
    if (isDemoMode) {
        if (typeof window !== 'undefined') localStorage.setItem('demoUserId', uid);
        fetchUser();
    }
  };

  const logout = () => {
    if (isDemoMode) {
        if (typeof window !== 'undefined') {
            localStorage.removeItem('demoUserId');
            localStorage.removeItem('activeDemoRole');
        }
        setActiveDemoRole(null);
        setUser(null);
        prevUserStringRef.current = 'null';
    } else {
        getAuth().signOut();
    }
  };

  const setDemoRole = (roleKey: string) => {
    if (typeof window !== 'undefined') localStorage.setItem('activeDemoRole', roleKey);
    setActiveDemoRole(roleKey);
    fetchUser(roleKey); 
  };

  const value = React.useMemo(() => ({ 
    user, isLoading, error, login, logout, setDemoRole 
  }), [user, isLoading, error]);

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
