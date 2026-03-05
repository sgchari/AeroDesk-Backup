'use client';

import { useState, useEffect } from 'react';
import {
  Query,
  DocumentData,
  FirestoreError,
  CollectionReference,
  onSnapshot
} from 'firebase/firestore';
import { mockStore } from '@/lib/mock-store';
import { useUser } from '@/hooks/use-user';

export type WithId<T> = T & { id: string };

export interface UseCollectionResult<T> {
  data: WithId<T>[] | null;
  isLoading: boolean;
  error: FirestoreError | Error | null;
}

/**
 * Institutional Hook for managing real-time data collections.
 * Supports both Production (Firestore) and Simulation (Local Store) modes.
 */
export function useCollection<T = any>(
    memoizedTargetRefOrQuery: ((CollectionReference<DocumentData> | Query<DocumentData>) & {__memo?: boolean})  | null | undefined,
    demoPath?: string
): UseCollectionResult<T> {
  const [data, setData] = useState<WithId<T>[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<FirestoreError | Error | null>(null);
  const { user, isLoading: isUserLoading } = useUser();
  
  const isDemoMode = !memoizedTargetRefOrQuery || !memoizedTargetRefOrQuery.firestore?.app || (memoizedTargetRefOrQuery.firestore as any)._isMock;

  useEffect(() => {
    if (!isDemoMode && memoizedTargetRefOrQuery) {
      setIsLoading(true);
      const unsubscribe = onSnapshot(memoizedTargetRefOrQuery, 
        (snapshot) => {
          const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as WithId<T>));
          setData(items);
          setIsLoading(false);
        },
        (err) => {
          setError(err);
          setIsLoading(false);
        }
      );
      return () => unsubscribe();
    }
    
    const fetchDemoData = () => {
        if (isUserLoading) return;

        const path = demoPath;
        if (!path) {
            setIsLoading(false);
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
    
    if (isDemoMode) {
        fetchDemoData();
        const unsubscribe = mockStore.subscribe(fetchDemoData);
        return () => unsubscribe();
    }

  }, [user, isUserLoading, isDemoMode, demoPath, memoizedTargetRefOrQuery]);

  return { data, isLoading, error };
}
