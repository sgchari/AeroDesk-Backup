
'use client';
    
import { useState, useEffect } from 'react';
import {
  DocumentReference,
  DocumentData,
  FirestoreError,
} from 'firebase/firestore';
import { mockUsers } from '@/lib/data';

/** Utility type to add an 'id' field to a given type T. */
type WithId<T> = T & { id: string };

/**
 * Interface for the return value of the useDoc hook.
 * @template T Type of the document data.
 */
export interface UseDocResult<T> {
  data: WithId<T> | null; // Document data with ID, or null.
  isLoading: boolean;       // True if loading.
  error: FirestoreError | Error | null; // Error object, or null.
}

/**
 * React hook to subscribe to a single Firestore document in real-time.
 * In demo mode, it returns a mock document from '@/lib/data'.
 * @template T Optional type for document data. Defaults to any.
 * @param {DocumentReference<DocumentData> | null | undefined} docRef -
 * The Firestore DocumentReference.
 * @param {string} [demoPath] - The path to the document for demo mode.
 * @returns {UseDocResult<T>} Object with data, isLoading, error.
 */
export function useDoc<T = any>(
  memoizedDocRef: (DocumentReference<DocumentData> & {__memo?: boolean}) | null | undefined,
  demoPath?: string,
): UseDocResult<T> {
  const [data, setData] = useState<WithId<T> | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<FirestoreError | Error | null>(null);
  const isDemoMode = !memoizedDocRef?.firestore?.app;

  useEffect(() => {
    if (!isDemoMode) {
      // Original Firebase logic would go here but is not implemented for this demo.
      setIsLoading(false);
      console.warn("Live mode for useDoc is not implemented in this demo.");
      return;
    }

    // --- DEMO MODE LOGIC ---
    const path = demoPath;
    if (!path) {
        if (memoizedDocRef) { // Allow silent fail if no ref is passed.
            console.warn(`useDoc called in demo mode without a demoPath.`);
        }
        setIsLoading(false);
        return;
    }
    
    // Simulate async data fetching
    setTimeout(() => {
        const pathSegments = path.split('/');
        const collection = pathSegments[0];
        const docId = pathSegments[1];

        let resultData: any = null;

        if (collection === 'users' || collection === 'platformAdmins' || collection === 'customers' || collection === 'operators' || collection === 'distributors' || collection === 'hotelPartners') {
           resultData = mockUsers.find(u => u.id === docId);
        } else if (collection === 'corporateTravelDesks' && pathSegments[2] === 'users') {
            const ctdUserId = pathSegments[3];
            resultData = mockUsers.find(u => u.id === ctdUserId);
        }
        else {
             console.warn(`useDoc: No mock data handler for path: ${path}`);
        }
        
        setData(resultData as WithId<T> | null);
        setIsLoading(false);
    }, 300);

  }, [memoizedDocRef, isDemoMode, demoPath]);

  return { data, isLoading, error };
}
