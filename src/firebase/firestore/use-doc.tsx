'use client';
    
import { useState, useEffect } from 'react';
import {
  DocumentReference,
  DocumentData,
  FirestoreError,
} from 'firebase/firestore';
import { mockStore } from '@/lib/mock-store';

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
  
  // Safe detection of demo mode even if ref is null
  const isDemoMode = !memoizedDocRef || !memoizedDocRef.firestore?.app || (memoizedDocRef.firestore as any)._isMock;

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
        setIsLoading(false);
        return;
    }
    
    const fetchData = () => {
        try {
            const docData = mockStore.getDoc(path);
            setData(docData as WithId<T> | null);
        } catch (e: any) {
            setError(e);
        } finally {
            setIsLoading(false);
        }
    };
    
    fetchData(); // Initial fetch

    const unsubscribe = mockStore.subscribe(fetchData);
    
    return () => unsubscribe();


  }, [memoizedDocRef, isDemoMode, demoPath]);

  return { data, isLoading, error };
}
