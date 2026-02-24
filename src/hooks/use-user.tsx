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

      try {
        const collectionsToSearch: Array<{ name: string, role: UserRole }> = [
          { name: 'platformAdmins', role: 'Admin' },
          { name: 'customers', role: 'Customer' },
          { name: 'operators', role: 'Operator' },
          { name: 'distributors', role: 'Authorized Distributor' },
          { name: 'hotelPartners', role: 'Hotel Partner' },
        ];

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
        
        // 2. If not found, check if it's a CTD Admin who created their own desk.
        // This is a convention based on the registration logic where ctdId is 'ctd_' + user.uid.
        const ctdIdForAdmin = `ctd_${uid}`;
        const ctdAdminUserDocRef = doc(firestore, `corporateTravelDesks/${ctdIdForAdmin}/users`, uid);
        const ctdAdminDocSnap = await getDoc(ctdAdminUserDocRef);

        if (ctdAdminDocSnap.exists()) {
            const profileData = { ...ctdAdminDocSnap.data(), id: uid } as AppUser;
            // Also fetch company name from the parent desk.
            const ctdDocRef = doc(firestore, 'corporateTravelDesks', ctdIdForAdmin);
            const ctdDocSnap = await getDoc(ctdDocRef);
            if (ctdDocSnap.exists()) {
                profileData.company = ctdDocSnap.data().companyName;
            }
            setAppUser(profileData);
            setProfileLoading(false);
            return; // Profile found.
        }


        // 3. If still not found, it might be another type of CTD user (e.g., Requester).
        // The collectionGroup query is kept as a fallback, but it requires permissive security rules to work for non-admins.
        const ctdUsersQuery = query(collectionGroup(firestore, 'users'), where('externalAuthId', '==', uid));
        const ctdUsersSnap = await getDocs(ctdUsersQuery);

        if (!ctdUsersSnap.empty) {
            const userDoc = ctdUsersSnap.docs[0];
            const profileData = { ...userDoc.data(), id: uid } as AppUser;
            
            // For CTD users, we also fetch the company name from the parent desk.
            if ((profileData.role === 'Corporate Admin' || profileData.role === 'CTD Admin' || profileData.role === 'Requester') && (profileData as any).ctdId) {
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
        
        // 4. If we've reached here, the profile was not found in any location.
        throw new Error("User profile not found in any known collection. Please complete your registration or contact support.");

      } catch (e: any) {
        // This single catch block will handle any error.
        // If a 'permission-denied' error happens, it's most likely from the collectionGroup query, 
        // which is an expected failure for non-corporate users. We can treat this as "profile not found".
        if (e.code === 'permission-denied') {
            console.warn("A permission error occurred during profile search. This may mean the user's profile document doesn't exist or rules are blocking access.", e);
            // We create a more user-friendly error to display.
            const notFoundError = new Error("User profile not found. Please complete your registration or contact support.");
            setProfileError(notFoundError);
        } else {
            // For any other type of error (e.g., network issues), report it directly.
            console.error("An unexpected error occurred while fetching user profile:", e);
            setProfileError(e);
        }
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
