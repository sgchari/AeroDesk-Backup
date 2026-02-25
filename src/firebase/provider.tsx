
'use client';

import React, { DependencyList, createContext, useContext, ReactNode, useMemo } from 'react';
import { FirebaseApp } from 'firebase/app';
import { Firestore } from 'firebase/firestore';
import { Auth, User } from 'firebase/auth';
import { FirebaseStorage } from 'firebase/storage';
import { FirebaseErrorListener } from '@/components/FirebaseErrorListener'
import { useUser as useAppUser } from '@/hooks/use-user'; // Use the demo-mode compatible user hook

// This file provides the Firebase context, but in demo mode, most of its live functionality is unused.
// The hooks are kept for structural integrity, but the user state is managed by use-user.tsx.

interface FirebaseProviderProps {
  children: ReactNode;
  firebaseApp: FirebaseApp | null; // Allow null for demo mode
  firestore: Firestore | null;
  auth: Auth | null;
  storage: FirebaseStorage | null;
}

// Combined state for the Firebase context
export interface FirebaseContextState {
  areServicesAvailable: boolean; 
  firebaseApp: FirebaseApp | null;
  firestore: Firestore | null;
  auth: Auth | null;
  storage: FirebaseStorage | null;
  // User authentication state is now primarily from useAppUser
  user: User | null;
  isUserLoading: boolean;
  userError: Error | null;
}

// Return type for useFirebase()
export interface FirebaseServicesAndUser {
  firebaseApp: FirebaseApp | null;
  firestore: Firestore | null;
  auth: Auth | null;
  storage: FirebaseStorage | null;
  user: User | null;
  isUserLoading: boolean;
  userError: Error | null;
}

// Return type for useUser() from this provider (distinct from the main app's useUser)
export interface UserHookResult { 
  user: User | null;
  isUserLoading: boolean;
  userError: Error | null;
}

// React Context
export const FirebaseContext = createContext<FirebaseContextState | undefined>(undefined);

/**
 * FirebaseProvider manages and provides Firebase services.
 * In demo mode, it provides null services but still renders children.
 */
export const FirebaseProvider: React.FC<FirebaseProviderProps> = ({
  children,
  firebaseApp,
  firestore,
  auth,
  storage,
}) => {
  const { user, isLoading, error } = useAppUser();

  const contextValue = useMemo((): FirebaseContextState => {
    const servicesAvailable = !!(firebaseApp && firestore && auth && storage);
    return {
      areServicesAvailable: servicesAvailable,
      firebaseApp: servicesAvailable ? firebaseApp : null,
      firestore: servicesAvailable ? firestore : null,
      auth: servicesAvailable ? auth : null,
      storage: servicesAvailable ? storage : null,
      user: user as User | null, // Cast AppUser to Firebase User for compatibility
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

/**
 * Hook to access core Firebase services and user authentication state.
 * Gracefully handles null services in demo mode.
 */
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

/** Hook to access Firebase Auth instance. May be null in demo mode. */
export const useAuth = (): Auth | null => {
  const { auth } = useFirebaseContext();
  return auth;
};

/** Hook to access Firestore instance. May be null in demo mode. */
export const useFirestore = (): Firestore | null => {
  const { firestore } = useFirebaseContext();
  return firestore;
};

/** Hook to access Firebase App instance. May be null in demo mode. */
export const useFirebaseApp = (): FirebaseApp | null => {
  const { firebaseApp } = useFirebaseContext();
  return firebaseApp;
};

/** Hook to access Firebase Storage instance. May be null in demo mode. */
export const useStorage = (): FirebaseStorage | null => {
    const { storage } = useFirebaseContext();
    return storage;
};

type MemoFirebase <T> = T & {__memo?: boolean};

export function useMemoFirebase<T>(factory: () => T, deps: DependencyList): T | (MemoFirebase<T>) {
  const memoized = useMemo(factory, deps);
  
  if(typeof memoized !== 'object' || memoized === null) return memoized;
  // This is a bit of a hack to check if the object was memoized.
  // It's used in useCollection/useDoc to prevent infinite loops.
  (memoized as MemoFirebase<T>).__memo = true;
  
  return memoized;
}

/**
 * Legacy hook for firebase user. Use the main useUser from @/hooks/use-user instead.
 * @deprecated
 */
export const useUser = (): UserHookResult => { 
  const { user, isUserLoading, userError } = useFirebaseContext();
  return { user, isUserLoading, userError };
};
