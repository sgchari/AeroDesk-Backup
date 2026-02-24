
'use client';

import React, { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { useUser as useFirebaseAuthUser, useFirestore } from '@/firebase';
import type { User as AppUser, UserRole } from '@/lib/types';
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

    const findUserProfile = async () => {
      setProfileLoading(true);
      setProfileError(null);
      const uid = authUser.uid;

      try {
        // 1. Fetch the user role mapping from the central 'users' collection
        const userMappingRef = doc(firestore, 'users', uid);
        const userMappingSnap = await getDoc(userMappingRef);

        if (!userMappingSnap.exists()) {
          throw new Error("User role mapping not found. Please complete registration or contact support.");
        }

        const mappingData = userMappingSnap.data();
        const role = mappingData.role as UserRole;
        const ctdId = mappingData.ctdId as string | undefined;

        // 2. Determine the path to the full profile based on the role
        let profilePath: string | null = null;
        switch (role) {
          case 'Admin': profilePath = `platformAdmins/${uid}`; break;
          case 'Customer': profilePath = `customers/${uid}`; break;
          case 'Operator': profilePath = `operators/${uid}`; break;
          case 'Authorized Distributor': profilePath = `distributors/${uid}`; break;
          case 'Hotel Partner': profilePath = `hotelPartners/${uid}`; break;
          case 'CTD Admin':
          case 'Corporate Admin':
          case 'Requester':
            if (ctdId) {
              // For all CTD-related roles, the profile is in the 'users' subcollection of their desk
              profilePath = `corporateTravelDesks/${ctdId}/users/${uid}`;
            }
            break;
          default:
            // This ensures we don't fail silently if a new role is added without being handled here
            const unhandledRole: never = role;
            throw new Error(`Unhandled user role: ${unhandledRole}`);
        }
        
        if (!profilePath) {
          throw new Error(`Could not determine profile path for role: ${role}. CTD ID might be missing.`);
        }
        
        // 3. Fetch the full profile document from its specific location
        const profileDocRef = doc(firestore, profilePath);
        const profileDocSnap = await getDoc(profileDocRef);

        if (!profileDocSnap.exists()) {
          throw new Error(`User profile document not found at path: ${profilePath}`);
        }

        const profileData = { ...profileDocSnap.data(), id: uid, role: role } as AppUser;

        // 4. For CTD users, enrich the profile with the company name from the parent desk
        if (ctdId && (role === 'CTD Admin' || role === 'Corporate Admin' || role === 'Requester')) {
          const ctdDocRef = doc(firestore, 'corporateTravelDesks', ctdId);
          const ctdDocSnap = await getDoc(ctdDocRef);
          if (ctdDocSnap.exists()) {
            profileData.company = ctdDocSnap.data().companyName;
          }
        }
        
        setAppUser(profileData);

      } catch (e: any) {
        console.error("An error occurred while fetching user profile:", e);
        setProfileError(e); // Set the specific error
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
