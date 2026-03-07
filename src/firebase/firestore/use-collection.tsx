'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
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
 * Optimized with deep equality checks to prevent re-render storms.
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
  const prevDataStringRef = useRef<string>('');
  
  const isDemoMode = !memoizedTargetRefOrQuery || !memoizedTargetRefOrQuery.firestore?.app || (memoizedTargetRefOrQuery.firestore as any)._isMock;

  useEffect(() => {
    mountedRef.current = true;
    return () => { mountedRef.current = false; };
  }, []);

  const fetchDemoData = useCallback(() => {
    if (isUserLoading || !mountedRef.current || !demoPath) return;

    try {
        const mockData = mockStore.getCollection(demoPath, user) as WithId<T>[];
        const currentString = JSON.stringify(mockData);
        
        if (currentString !== prevDataStringRef.current) {
            setData(mockData);
            prevDataStringRef.current = currentString;
        }
    } catch (e: any) {
        if (mountedRef.current) setError(e);
    } finally {
        if (mountedRef.current) {
            setIsLoading(false);
        }
    }
  }, [demoPath, user, isUserLoading]);

  useEffect(() => {
    if (!isDemoMode && memoizedTargetRefOrQuery) {
      setIsLoading(true);
      const unsubscribe = onSnapshot(memoizedTargetRefOrQuery, 
        (snapshot) => {
          if (!mountedRef.current) return;
          const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as WithId<T>));
          
          const currentString = JSON.stringify(items);
          if (currentString !== prevDataStringRef.current) {
            setData(items);
            prevDataStringRef.current = currentString;
          }
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
    
    if (isDemoMode && demoPath) {
        fetchDemoData();
        const unsubscribe = mockStore.subscribe(fetchDemoData);
        return () => unsubscribe();
    } else {
        setIsLoading(false);
    }

  }, [isDemoMode, demoPath, memoizedTargetRefOrQuery, fetchDemoData]);

  return { data, isLoading, error };
}