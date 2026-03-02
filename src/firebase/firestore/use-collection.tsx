'use client';

import { useState, useEffect } from 'react';
import {
  Query,
  DocumentData,
  FirestoreError,
  CollectionReference,
} from 'firebase/firestore';
import { mockStore } from '@/lib/mock-store';
import { useUser } from '@/hooks/use-user';

/** Utility type to add an 'id' field to a given type T. */
export type WithId<T> = T & { id: string };

/**
 * Interface for the return value of the useCollection hook.
 * @template T Type of the document data.
 */
export interface UseCollectionResult<T> {
  data: WithId<T>[] | null; // Document data with ID, or null.
  isLoading: boolean;       // True if loading.
  error: FirestoreError | Error | null; // Error object, or null.
}

/**
 * React hook to subscribe to a Firestore collection or query in real-time.
 * In demo mode, it returns mock data from '@/lib/data'.
 * @template T Optional type for document data. Defaults to any.
 * @param {CollectionReference<DocumentData> | Query<DocumentData> | null | undefined} targetRefOrQuery -
 * The Firestore CollectionReference or Query.
 * @param {string} [demoPath] - The path to the collection for demo mode.
 * @returns {UseCollectionResult<T>} Object with data, isLoading, error.
 */
export function useCollection<T = any>(
    memoizedTargetRefOrQuery: ((CollectionReference<DocumentData> | Query<DocumentData>) & {__memo?: boolean})  | null | undefined,
    demoPath?: string
): UseCollectionResult<T> {
  const [data, setData] = useState<WithId<T>[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<FirestoreError | Error | null>(null);
  const { user, isLoading: isUserLoading } = useUser();
  
  // Safe detection of demo mode even if ref is null
  const isDemoMode = !memoizedTargetRefOrQuery || !memoizedTargetRefOrQuery.firestore?.app || (memoizedTargetRefOrQuery.firestore as any)._isMock;

  useEffect(() => {
    // If not in demo mode, use live data (currently not implemented in this branch)
    if (!isDemoMode) {
        console.warn("Live mode for useCollection is not implemented in this demo.");
        setIsLoading(false);
        return;
    }
    
    // --- DEMO MODE LOGIC ---
    const path = demoPath;
    if (!path) {
        setIsLoading(false);
        return;
    }
    
    const fetchData = () => {
        if (isUserLoading) {
            // Don't do anything until we know if there is a user or not.
            return;
        }

        const publicPaths = ['emptyLegs', 'operators'];
        if (!user && !publicPaths.includes(path)) {
            // For private collections, if there's no user, clear data and stop.
            setIsLoading(false);
            setData(null);
            return;
        }

        try {
            const mockData = mockStore.getCollection(path, user);
            setData(mockData as WithId<T>[]);
        } catch (e: any) {
            setError(e);
        } finally {
            setIsLoading(false);
        }
    };
    
    fetchData(); // Initial fetch

    // Subscribe to changes in the mock store
    const unsubscribe = mockStore.subscribe(fetchData);

    // Unsubscribe on cleanup
    return () => unsubscribe();

  }, [user, isUserLoading, isDemoMode, demoPath]);

  return { data, isLoading, error };
}
