
'use client';

import React, { type ReactNode } from 'react';
import { FirebaseProvider } from '@/firebase/provider';
// In demo mode, we don't initialize a live Firebase connection.
// We pass null services to the provider.

interface FirebaseClientProviderProps {
  children: ReactNode;
}

const DEMO_MODE = true;

export function FirebaseClientProvider({ children }: FirebaseClientProviderProps) {
  // In demo mode, the firebase services are not needed as data is mocked.
  // We pass null to the provider to prevent initialization attempts.
  const services = {
    firebaseApp: null,
    auth: null,
    firestore: null,
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
