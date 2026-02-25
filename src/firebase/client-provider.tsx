
'use client';

import React, { type ReactNode } from 'react';
import { FirebaseProvider } from '@/firebase/provider';

interface FirebaseClientProviderProps {
  children: ReactNode;
}

const isDemoMode = process.env.NEXT_PUBLIC_DEMO_MODE === 'true' || true;

// In demo mode, we need to provide a mock firestore object that can be identified.
const mockFirestore = {
  _isMock: true,
  app: isDemoMode ? { name: '[DEMO]', automaticDataCollectionEnabled: false } : null,
};

export function FirebaseClientProvider({ children }: FirebaseClientProviderProps) {
  const services = {
    firebaseApp: null,
    // Provide a mock firestore object in demo mode.
    firestore: isDemoMode ? (mockFirestore as any) : null,
    auth: null,
    storage: null,
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
