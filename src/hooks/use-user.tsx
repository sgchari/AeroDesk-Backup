'use client';

import React, { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { useUser as useFirebaseAuthUser, useFirestore } from '@/firebase';
import type { User as AppUser, UserRole } from '@/lib/types';
import { doc, getDoc, collectionGroup, query, where, getDocs } from 'firebase/firestore';

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

    const findUserProfile = async () => {
      setProfileLoading(true);
      setProfileError(null);
      const uid = authUser.uid;

      const collectionsToSearch: Array<{ name: string, role: UserRole }> = [
        { name: 'platformAdmins', role: 'Admin' },
        { name: 'customers', role: 'Customer' },
        { name: 'operators', role: 'Operator' },
        { name: 'distributors', role: 'Authorized Distributor' },
        { name: 'hotelPartners', role: 'Hotel Partner' },
      ];

      try {
        // 1. Check all standard top-level collections first.
        for (const { name, role } of collectionsToSearch) {
          const docRef = doc(firestore, name, uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const profileData = { ...docSnap.data(), id: uid, role: role } as AppUser;
            setAppUser(profileData);
            setProfileLoading(false);
            return; // Profile found, we're done.
          }
        }

        // 2. If not found in top-level collections, it might be a CTD user.
        // This query requires special permissions that non-admins/non-CTD users won't have.
        // We wrap it in a try-catch to handle the expected permission-denied error.
        try {
          const ctdUsersQuery = query(collectionGroup(firestore, 'users'), where('externalAuthId', '==', uid));
          const ctdUsersSnap = await getDocs(ctdUsersQuery);
          if (!ctdUsersSnap.empty) {
            const userDoc = ctdUsersSnap.docs[0];
            const profileData = { ...userDoc.data(), id: uid } as AppUser;
            
            // For CTD users, we also fetch the company name from the parent desk.
            if (profileData.role === 'Corporate Admin' && (profileData as any).ctdId) {
                const ctdDocRef = doc(firestore, 'corporateTravelDesks', (profileData as any).ctdId);
                const ctdDocSnap = await getDoc(ctdDocRef);
                if (ctdDocSnap.exists()) {
                    profileData.company = ctdDocSnap.data().companyName;
                }
            }
            
            setAppUser(profileData);
            setProfileLoading(false);
            return; // CTD profile found, we're done.
          }
        } catch (e: any) {
          // If a 'permission-denied' error occurs, it's expected for non-admin users.
          // We can safely ignore it and proceed to the final error state.
          if (e.code !== 'permission-denied') {
            throw e; // Re-throw any other unexpected errors.
          }
           console.warn("Permission denied for CTD user search, which is expected for non-admin/non-CTD roles. Continuing.");
        }
        
        // 3. If we've reached here, the profile was not found in any location.
        throw new Error("User profile not found. Please complete your registration or contact support.");

      } catch (e: any) {
        console.error("Error fetching user profile:", e);
        setProfileError(e);
        setAppUser(null);
      } finally {
        setProfileLoading(false);
      }
    };

    findUserProfile();
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
