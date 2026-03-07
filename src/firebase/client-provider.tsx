
'use client';

import React, { type ReactNode, useEffect, useState, useMemo } from 'react';
import { FirebaseProvider } from '@/firebase/provider';
import { initializeFirebase } from '@/firebase';

interface FirebaseClientProviderProps {
  children: ReactNode;
}

/**
 * Static mock instance to prevent re-render loops in consumers.
 */
const MOCK_FIRESTORE = {
  _isMock: true,
  app: { name: '[DEMO]', automaticDataCollectionEnabled: false },
};

export function FirebaseClientProvider({ children }: FirebaseClientProviderProps) {
  const [sdks, setSdks] = useState<any>(null);
  const isDemoMode = process.env.NEXT_PUBLIC_DEMO_MODE !== 'false';

  useEffect(() => {
    if (!isDemoMode) {
      try {
        const initialized = initializeFirebase();
        setSdks(initialized);
      } catch (error) {
        console.error("Firebase initialization failed:", error);
      }
    }
  }, [isDemoMode]);

  /**
   * Memoized services object to maintain referential integrity.
   */
  const services = useMemo(() => ({
    firebaseApp: sdks?.firebaseApp || null,
    firestore: isDemoMode ? (MOCK_FIRESTORE as any) : (sdks?.firestore || null),
    auth: sdks?.auth || null,
    storage: sdks?.storage || null,
  }), [sdks, isDemoMode]);

  return (
    <FirebaseProvider
      firebaseApp={services.firebaseApp}
      auth={services.auth}
      firestore={services.firestore}
      storage={services.storage}
    >
      {children}
    </FirebaseProvider>
  );
}
