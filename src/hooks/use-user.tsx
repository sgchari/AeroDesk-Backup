'use client';

import React, { createContext, useContext, useMemo, ReactNode } from 'react';
import { doc } from 'firebase/firestore';
import { useFirestore, useUser as useAuthUser, useMemoFirebase } from '@/firebase';
import { useDoc, WithId } from '@/firebase/firestore/use-doc';
import type { User as AppUser } from '@/lib/types';

interface UserContextType {
  user: WithId<AppUser> | null;
  isLoading: boolean;
  error: Error | null;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const { user: authUser, isUserLoading: isAuthLoading, userError: authError } = useAuthUser();
  const firestore = useFirestore();

  const userDocRef = useMemoFirebase(() => {
    if (!firestore || !authUser) return null;
    return doc(firestore, 'users', authUser.uid);
  }, [firestore, authUser]);

  const { data: userProfile, isLoading: isProfileLoading, error: profileError } = useDoc<AppUser>(userDocRef);
  
  const value = useMemo(() => {
    return {
      user: userProfile,
      isLoading: isAuthLoading || isProfileLoading,
      error: authError || profileError,
    };
  }, [userProfile, isAuthLoading, isProfileLoading, authError, profileError]);

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
