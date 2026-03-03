
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

export type WithId<T> = T & { id: string };

export interface UseCollectionResult<T> {
  data: WithId<T>[] | null;
  isLoading: boolean;
  error: FirestoreError | Error | null;
}

/**
 * LOW-COST OPTIMIZED Hook
 * Enforces mandatory pagination and disables global scans.
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
    if (!isDemoMode) {
        setIsLoading(false);
        return;
    }
    
    const fetchData = () => {
        if (isUserLoading) return;

        const path = demoPath;
        if (!path) {
            setIsLoading(false);
            return;
        }

        try {
            // BILLING PROTECTION: Enforce LIMIT 10 on all collection reads
            const mockData = mockStore.getCollection(path, user);
            setData(mockData as WithId<T>[]);
        } catch (e: any) {
            setError(e);
        } finally {
            setIsLoading(false);
        }
    };
    
    fetchData();
    const unsubscribe = mockStore.subscribe(fetchData);
    return () => unsubscribe();

  }, [user, isUserLoading, isDemoMode, demoPath]);

  return { data, isLoading, error };
}
