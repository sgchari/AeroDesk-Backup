'use client';

import React, { type ReactNode, useEffect, useState } from 'react';
import { FirebaseProvider } from '@/firebase/provider';
import { initializeFirebase } from '@/firebase';

interface FirebaseClientProviderProps {
  children: ReactNode;
}

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

  const mockFirestore = {
    _isMock: true,
    app: { name: '[DEMO]', automaticDataCollectionEnabled: false },
  };

  const services = {
    firebaseApp: sdks?.firebaseApp || null,
    firestore: isDemoMode ? (mockFirestore as any) : (sdks?.firestore || null),
    auth: sdks?.auth || null,
    storage: sdks?.storage || null,
  };

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
