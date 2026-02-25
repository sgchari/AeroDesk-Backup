
'use client';

import React, { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { useUser as useFirebaseAuthUser, useFirestore, errorEmitter, FirestorePermissionError } from '@/firebase';
import type { User as AppUser, UserRole, CorporateTravelDesk } from '@/lib/types';
import { doc, getDoc } from 'firebase/firestore';

interface UserContextType {
  user: AppUser | null;
  isLoading: boolean;
  error: Error | null;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const { user: authUser, isUserLoading: isAuthLoading, userError } = useFirebaseAuthUser();
  const firestore = useFirestore();
  const [appUser, setAppUser] = useState<AppUser | null>(null);
  const [isProfileLoading, setProfileLoading] = useState(true);
  const [profileError, setProfileError] = useState<Error | null>(null);

  useEffect(() => {
    if (isAuthLoading) {
      setProfileLoading(true);
      return;
    }
    if (!authUser || !firestore) {
      setAppUser(null);
      setProfileLoading(false);
      return;
    }

    const fetchUserProfile = async () => {
      setProfileLoading(true);
      setProfileError(null);
      const userMappingRef = doc(firestore, 'users', authUser.uid);
      
      try {
        const userMappingSnap = await getDoc(userMappingRef);
        if (!userMappingSnap.exists()) {
            throw new Error("User profile not found. Please complete your registration or contact support.");
        }

        const userMapping = userMappingSnap.data() as { role: UserRole, ctdId?: string };
        const { role, ctdId } = userMapping;
        
        let collectionPath: string | null = null;
        if (role === 'CTD Admin' || role === 'Corporate Admin' || role === 'Requester') {
            if (!ctdId) throw new Error("Corporate user profile is missing 'ctdId'.");
            collectionPath = `corporateTravelDesks/${ctdId}/users`;
        } else {
            const roleToCollectionMap: Record<UserRole, string> = {
                'Admin': 'platformAdmins',
                'Customer': 'customers',
                'Operator': 'operators',
                'Authorized Distributor': 'distributors',
                'Hotel Partner': 'hotelPartners',
                // CTD roles are handled above
                'CTD Admin': '', 
                'Corporate Admin': '',
                'Requester': ''
            };
            collectionPath = roleToCollectionMap[role];
        }

        if (!collectionPath) {
            throw new Error(`Invalid user role "${role}" found in profile.`);
        }

        const userDocRef = doc(firestore, collectionPath, authUser.uid);
        const userDocSnap = await getDoc(userDocRef);

        if (!userDocSnap.exists()) {
            throw new Error(`User document not found in '${collectionPath}'.`);
        }
        
        let userProfile = userDocSnap.data() as AppUser;

        // If the user is part of a corporate desk, fetch the company name and merge it.
        if (userProfile.ctdId) {
            const ctdDocRef = doc(firestore, 'corporateTravelDesks', userProfile.ctdId);
            const ctdDocSnap = await getDoc(ctdDocRef);
            if (ctdDocSnap.exists()) {
                const ctdData = ctdDocSnap.data() as CorporateTravelDesk;
                // Add company name to the user profile object
                userProfile.company = ctdData.companyName;
            } else {
                 console.warn(`CTD document with ID ${userProfile.ctdId} not found.`);
            }
        }

        setAppUser(userProfile);

      } catch (error: any) {
        setProfileError(error);
        setAppUser(null);
      } finally {
        setProfileLoading(false);
      }
    };

    fetchUserProfile();
  }, [authUser, isAuthLoading, firestore]);

  const value = {
    user: appUser,
    isLoading: isAuthLoading || isProfileLoading,
    error: userError || profileError,
  };

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
