
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

// --- DEMO MODE ---
const DEMO_MODE = true; // Set to true to use mock data

/**
 * React hook to subscribe to a single Firestore document in real-time.
 * In demo mode, it returns a mock document from '@/lib/data'.
 * @template T Optional type for document data. Defaults to any.
 * @param {DocumentReference<DocumentData> | null | undefined} docRef -
 * The Firestore DocumentReference.
 * @returns {UseDocResult<T>} Object with data, isLoading, error.
 */
export function useDoc<T = any>(
  memoizedDocRef: (DocumentReference<DocumentData> & {__memo?: boolean}) | null | undefined,
): UseDocResult<T> {
  const [data, setData] = useState<WithId<T> | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<FirestoreError | Error | null>(null);

  useEffect(() => {
    if (!DEMO_MODE) {
      // Original Firebase logic would go here.
      setIsLoading(false);
      return;
    }

    // --- DEMO MODE LOGIC ---
    if (!memoizedDocRef) {
        setIsLoading(false);
        return;
    }
    
    // Simulate async data fetching
    setTimeout(() => {
        const { path } = memoizedDocRef;
        const [collection, docId] = path.split('/');

        let resultData: any = null;

        if (collection === 'users' || collection === 'platformAdmins' || collection === 'customers' || collection === 'operators' || collection === 'distributors' || collection === 'hotelPartners') {
           resultData = mockUsers.find(u => u.id === docId);
        } else if (path.includes('corporateTravelDesks') && path.includes('users')) {
            const parts = path.split('/');
            const id = parts[parts.length - 1];
            resultData = mockUsers.find(u => u.id === id);
        }
        else {
             console.warn(`useDoc: No mock data handler for path: ${path}`);
        }
        
        setData(resultData as WithId<T> | null);
        setIsLoading(false);
    }, 300);

  }, [memoizedDocRef]);

  return { data, isLoading, error };
}
