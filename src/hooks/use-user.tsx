
'use client';

import React, { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { useUser as useFirebaseAuthUser, useFirestore, errorEmitter, FirestorePermissionError } from '@/firebase';
import type { User as AppUser, UserRole } from '@/lib/types';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';

interface UserContextType {
  user: AppUser | null;
  isLoading: boolean;
  error: Error | null;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

// Maps a user role to the collection where their full profile is stored.
const getCollectionPathForRole = (role: UserRole, ctdId?: string): string | null => {
    switch (role) {
        case 'Admin': return 'platformAdmins';
        case 'Customer': return 'customers';
        case 'Operator': return 'operators';
        case 'Authorized Distributor': return 'distributors';
        case 'Hotel Partner': return 'hotelPartners';
        // CTD roles are nested under corporateTravelDesks.
        case 'CTD Admin':
        case 'Corporate Admin':
        case 'Requester':
            return ctdId ? `corporateTravelDesks/${ctdId}/users` : null;
        default:
            return null;
    }
};


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
      
      try {
        // This is a simplified approach for the demo. In a production app,
        // you would ideally have a single 'users' collection with a 'role' field to query.
        const userCollections: { role: UserRole, path: string }[] = [
            { role: 'Admin', path: 'platformAdmins' },
            { role: 'Customer', path: 'customers' },
            { role: 'Operator', path: 'operators' },
            { role: 'Authorized Distributor', path: 'distributors' },
            { role: 'Hotel Partner', path: 'hotelPartners' },
        ];
        
        let userProfile: AppUser | null = null;

        // 1. Check top-level collections
        for (const { path } of userCollections) {
            const userDocRef = doc(firestore, path, authUser.uid);
            const userDocSnap = await getDoc(userDocRef);
            if (userDocSnap.exists()) {
                userProfile = userDocSnap.data() as AppUser;
                break;
            }
        }
        
        // 2. If not found, check all corporate travel desks
        if (!userProfile) {
            const ctdsCollectionRef = collection(firestore, 'corporateTravelDesks');
            const ctdsSnapshot = await getDocs(ctdsCollectionRef);

            for (const ctdDoc of ctdsSnapshot.docs) {
                const ctdUserDocRef = doc(firestore, `corporateTravelDesks/${ctdDoc.id}/users`, authUser.uid);
                const ctdUserDocSnap = await getDoc(ctdUserDocRef);
                if (ctdUserDocSnap.exists()) {
                    userProfile = ctdUserDocSnap.data() as AppUser;
                    break;
                }
            }
        }

        if (userProfile) {
            setAppUser(userProfile);
        } else {
            throw new Error("User profile not found in any collection. Please complete your registration or contact support.");
        }

      } catch (error: any) {
        if (error.code === 'permission-denied') {
          errorEmitter.emit('permission-error', new FirestorePermissionError({
              operation: 'get',
              path: `profile/${authUser.uid}`, // Generic path
          }));
        }
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
