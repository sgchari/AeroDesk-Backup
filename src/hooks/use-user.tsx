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
  
  const authListenerAttached = useRef(false);
  const isDemoMode = process.env.NEXT_PUBLIC_DEMO_MODE !== 'false';

  const fetchUser = useCallback(async (uid?: string, roleKey?: string) => {
    if (!isDemoMode) return;
    
    setLoading(true);
    try {
        const demoUserId = uid || (typeof window !== 'undefined' ? localStorage.getItem('demoUserId') : null);
        const currentRoleKey = roleKey || (typeof window !== 'undefined' ? localStorage.getItem('activeDemoRole') : null);
        
        if (!demoUserId) {
            setUser(null);
            return;
        }

        let foundUser = mockUsers.find(u => u.id === demoUserId);
        
        // Fallback for role-based demo IDs
        if (!foundUser) {
            const idMap: Record<string, string> = {
                'admin': 'admin-demo',
                'operator': 'operator-demo',
                'agency': 'agency-demo',
                'corporate': 'corporate-demo',
                'customer': 'customer-demo',
                'hotel': 'hotel-demo'
            };
            foundUser = mockUsers.find(u => u.id === (idMap[demoUserId] || demoUserId));
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
                    mappedUser = { ...mappedUser, role: mapped.role, platformRole: mapped.platform, ...mapped.firmIds };
                }
            }

            // Sync Company Name
            let firmName = mappedUser.company || "";
            if (mappedUser.corporateId) firmName = mockCorporates.find(d => d.id === mappedUser.corporateId)?.companyName || "Stark Industries";
            else if (mappedUser.operatorId) firmName = mockOperators.find(o => o.id === mappedUser.operatorId)?.companyName || "FlyCo Charter";
            else if (mappedUser.agencyId) firmName = mockAgencies.find(a => a.id === mappedUser.agencyId)?.companyName || "Sky Distributors";
            else if (mappedUser.hotelPartnerId) firmName = mockHotelPartners.find(h => h.id === mappedUser.hotelPartnerId)?.companyName || "Grand Hotels Group";

            setUser({ ...mappedUser, company: firmName } as AppUser);
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
    if (isDemoMode) {
        fetchUser();
        return;
    }

    if (authListenerAttached.current) return;
    authListenerAttached.current = true;

    const unsubscribe = onAuthStateChanged(getAuth(), async (fbUser) => {
        setLoading(true);
        if (fbUser) {
            try {
                const userDoc = await getDoc(doc(getFirestore(), 'users', fbUser.uid));
                if (userDoc.exists()) {
                    setUser({ id: fbUser.uid, ...userDoc.data() } as AppUser);
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

    return () => unsubscribe();
  }, [isDemoMode, fetchUser]);

  const login = (uid: string) => {
    if (typeof window !== 'undefined') localStorage.setItem('demoUserId', uid);
    fetchUser(uid);
  };

  const logout = () => {
    if (typeof window !== 'undefined') {
        localStorage.removeItem('demoUserId');
        localStorage.removeItem('activeDemoRole');
    }
    setUser(null);
    if (!isDemoMode) getAuth().signOut();
  };

  const setDemoRole = (roleKey: string) => {
    if (typeof window !== 'undefined') localStorage.setItem('activeDemoRole', roleKey);
    fetchUser(undefined, roleKey);
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
  if (context === undefined) throw new Error('useUser must be used within a UserProvider');
  return context;
}
