'use client';

import { useState, useEffect, useRef } from 'react';
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
 * Optimized to prevent redundant re-renders and hydration mismatches.
 */
export function useCollection<T = any>(
    memoizedTargetRefOrQuery: ((CollectionReference<DocumentData> | Query<DocumentData>) & {__memo?: boolean})  | null | undefined,
    demoPath?: string
): UseCollectionResult<T> {
  const [data, setData] = useState<WithId<T>[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<FirestoreError | Error | null>(null);
  const { user, isLoading: isUserLoading } = useUser();
  const mountedRef = useRef(true);
  
  const isDemoMode = !memoizedTargetRefOrQuery || !memoizedTargetRefOrQuery.firestore?.app || (memoizedTargetRefOrQuery.firestore as any)._isMock;

  useEffect(() => {
    mountedRef.current = true;
    return () => { mountedRef.current = false; };
  }, []);

  useEffect(() => {
    if (!isDemoMode && memoizedTargetRefOrQuery) {
      setIsLoading(true);
      const unsubscribe = onSnapshot(memoizedTargetRefOrQuery, 
        (snapshot) => {
          if (!mountedRef.current) return;
          const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as WithId<T>));
          setData(items);
          setIsLoading(false);
        },
        (err) => {
          if (!mountedRef.current) return;
          setError(err);
          setIsLoading(false);
        }
      );
      return () => unsubscribe();
    }
    
    const fetchDemoData = () => {
        if (isUserLoading || !mountedRef.current) return;

        const path = demoPath;
        if (!path) {
            setIsLoading(false);
            return;
        }

        try {
            const mockData = mockStore.getCollection(path, user);
            // Only update if data changed to prevent infinite render loops in simulation
            setData(prev => {
                if (JSON.stringify(prev) === JSON.stringify(mockData)) return prev;
                return mockData as WithId<T>[];
            });
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
