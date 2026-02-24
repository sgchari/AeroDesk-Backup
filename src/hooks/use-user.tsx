
'use client';

import React, { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { useUser as useFirebaseAuthUser, useFirestore, errorEmitter, FirestorePermissionError } from '@/firebase';
import type { User as AppUser } from '@/lib/types';
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
      const userDocRef = doc(firestore, 'users', authUser.uid);

      try {
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          setAppUser(userDocSnap.data() as AppUser);
        } else {
          // This can happen if registration is incomplete or if there's a data consistency issue.
          throw new Error("User profile not found. Please complete your registration or contact support.");
        }
      } catch (error: any) {
        if (error.code === 'permission-denied') {
          // The most likely cause for a permission error here is the security rule for /users/{userId} is incorrect.
          // This component will emit the error to be caught by the global error handler.
          errorEmitter.emit('permission-error', new FirestorePermissionError({
              operation: 'get',
              path: userDocRef.path,
          }));
        }
        // Set the error state to be displayed in the UI.
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
