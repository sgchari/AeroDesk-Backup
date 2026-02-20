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
    if (isAuthLoading || !firestore) return;
    if (!authUser) {
      setAppUser(null);
      setProfileLoading(false);
      return;
    }

    const findUserProfile = async () => {
      setProfileLoading(true);
      setProfileError(null);
      const uid = authUser.uid;

      // Defines the mapping from a user role to its Firestore collection.
      // Note: 'CTD Admin' and other CTD roles are handled separately as they are in a subcollection.
      const roleCollections: { [key in UserRole]?: string } = {
        'Admin': 'platformAdmins',
        'Customer': 'customers',
        'Operator': 'operators',
        'Authorized Distributor': 'distributors',
        'Hotel Partner': 'hotelPartners',
      };

      try {
        // 1. Check standard top-level collections for user profile
        for (const [role, collectionName] of Object.entries(roleCollections)) {
          if (!collectionName) continue;
          const docRef = doc(firestore, collectionName, uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            // The role is implicit from the collection it was found in.
            // We add it to the user object for use throughout the app.
            const profileData = { ...docSnap.data(), id: uid, role: role as UserRole } as AppUser;
            setAppUser(profileData);
            setProfileLoading(false);
            return;
          }
        }

        // 2. If not found, check for a CTD User profile in the 'users' subcollection group.
        // This query is efficient as it searches across all `corporateTravelDesks/*/users`.
        const ctdUsersQuery = query(collectionGroup(firestore, 'users'), where('externalAuthId', '==', uid));
        const ctdUsersSnap = await getDocs(ctdUsersQuery);
        if (!ctdUsersSnap.empty) {
          const userDoc = ctdUsersSnap.docs[0];
          // The role is part of the document data for CTD users.
          const profileData = { ...userDoc.data(), id: uid } as AppUser;
          setAppUser(profileData);
          setProfileLoading(false);
          return;
        }
        
        // 3. If no profile is found in any designated collection.
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
