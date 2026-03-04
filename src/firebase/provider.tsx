'use client';

import React, { DependencyList, createContext, useContext, ReactNode, useMemo } from 'react';
import { FirebaseApp } from 'firebase/app';
import { Firestore } from 'firebase/firestore';
import { Auth, User } from 'firebase/auth';
import { FirebaseStorage } from 'firebase/storage';
import { FirebaseErrorListener } from '@/components/FirebaseErrorListener'
import { useUser as useAppUser } from '@/hooks/use-user';

// This file provides the Firebase context. In demo mode, it allows individual
// services to be provided independently.

interface FirebaseProviderProps {
  children: ReactNode;
  firebaseApp: FirebaseApp | null;
  firestore: Firestore | null;
  auth: Auth | null;
  storage: FirebaseStorage | null;
}

export interface FirebaseContextState {
  areServicesAvailable: boolean; 
  firebaseApp: FirebaseApp | null;
  firestore: Firestore | null;
  auth: Auth | null;
  storage: FirebaseStorage | null;
  user: User | null;
  isUserLoading: boolean;
  userError: Error | null;
}

export interface FirebaseServicesAndUser {
  firebaseApp: FirebaseApp | null;
  firestore: Firestore | null;
  auth: Auth | null;
  storage: FirebaseStorage | null;
  user: User | null;
  isUserLoading: boolean;
  userError: Error | null;
}

export interface UserHookResult { 
  user: User | null;
  isUserLoading: boolean;
  userError: Error | null;
}

export const FirebaseContext = createContext<FirebaseContextState | undefined>(undefined);

export const FirebaseProvider: React.FC<FirebaseProviderProps> = ({
  children,
  firebaseApp,
  firestore,
  auth,
  storage,
}) => {
  const { user, isLoading, error } = useAppUser();

  const contextValue = useMemo((): FirebaseContextState => {
    // In simulation mode, we provide whatever services are passed, 
    // typically just the mock Firestore.
    return {
      areServicesAvailable: !!firestore,
      firebaseApp,
      firestore,
      auth,
      storage,
      user: user as User | null,
      isUserLoading: isLoading,
      userError: error,
    };
  }, [firebaseApp, firestore, auth, storage, user, isLoading, error]);

  return (
    <FirebaseContext.Provider value={contextValue}>
      <FirebaseErrorListener />
      {children}
    </FirebaseContext.Provider>
  );
};

const useFirebaseContext = () => {
    const context = useContext(FirebaseContext);
    if (context === undefined) {
        throw new Error('useFirebase hook must be used within a FirebaseProvider.');
    }
    return context;
}

export const useFirebase = (): FirebaseServicesAndUser => {
    const context = useFirebaseContext();
    return {
        firebaseApp: context.firebaseApp,
        firestore: context.firestore,
        auth: context.auth,
        storage: context.storage,
        user: context.user,
        isUserLoading: context.isUserLoading,
        userError: context.userError,
    };
};

export const useAuth = (): Auth | null => {
  const { auth } = useFirebaseContext();
  return auth;
};

export const useFirestore = (): Firestore | null => {
  const { firestore } = useFirebaseContext();
  return firestore;
};

export const useFirebaseApp = (): FirebaseApp | null => {
  const { firebaseApp } = useFirebaseContext();
  return firebaseApp;
};

export const useStorage = (): FirebaseStorage | null => {
    const { storage } = useFirebaseContext();
    return storage;
};

type MemoFirebase <T> = T & {__memo?: boolean};

export function useMemoFirebase<T>(factory: () => T, deps: DependencyList): T | (MemoFirebase<T>) {
  const memoized = useMemo(factory, deps);
  if(typeof memoized !== 'object' || memoized === null) return memoized;
  (memoized as MemoFirebase<T>).__memo = true;
  return memoized;
}

export const useUser = (): UserHookResult => { 
  const { user, isUserLoading, userError } = useFirebaseContext();
  return { user, isUserLoading, userError };
};
