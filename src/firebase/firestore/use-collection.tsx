'use client';

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
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
 * Real-time collection hook with robust identity protection.
 * Prevents re-render loops by using stable data strings and memoized state.
 */
export function useCollection<T = any>(
    memoizedQuery: (CollectionReference<DocumentData> | Query<DocumentData>) | null | undefined,
    demoPath?: string
): UseCollectionResult<T> {
  const [data, setData] = useState<WithId<T>[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<FirestoreError | Error | null>(null);
  
  const { user, isLoading: isUserLoading } = useUser();
  const mountedRef = useRef(true);
  const prevDataStringRef = useRef<string>('');

  useEffect(() => {
    mountedRef.current = true;
    return () => { mountedRef.current = false; };
  }, []);

  const updateDataIfChanged = useCallback((newData: WithId<T>[] | null) => {
    if (!mountedRef.current) return;
    const dataString = JSON.stringify(newData);
    if (dataString !== prevDataStringRef.current) {
      setData(newData);
      prevDataStringRef.current = dataString;
    }
    setIsLoading(false);
  }, []);

  const isDemoMode = useMemo(() => {
    // If no query or explicitly in demo environment, use simulation store
    if (!memoizedQuery) return true;
    const fs = (memoizedQuery as any).firestore;
    if (fs && fs._isMock) return true;
    return process.env.NEXT_PUBLIC_DEMO_MODE !== 'false';
  }, [memoizedQuery]);

  useEffect(() => {
    if (!mountedRef.current || isUserLoading) return;
    
    // LIVE MODE: Real-time Firestore Sync
    if (!isDemoMode && memoizedQuery) {
      setIsLoading(true);
      const unsubscribe = onSnapshot(memoizedQuery, 
        (snapshot) => {
          const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as WithId<T>));
          updateDataIfChanged(items);
        },
        (err) => {
          if (!mountedRef.current) return;
          setError(err);
          setIsLoading(false);
        }
      );
      return () => unsubscribe();
    }
    
    // DEMO MODE: Simulation Store Sync
    if (isDemoMode && demoPath) {
        setIsLoading(true);
        const fetchDemo = () => {
            const mockData = mockStore.getCollection(demoPath, user);
            updateDataIfChanged(mockData);
        };
        
        fetchDemo();
        const unsub = mockStore.subscribe(fetchDemo);
        return () => unsub();
    }

    setIsLoading(false);
  }, [memoizedQuery, demoPath, user, isUserLoading, isDemoMode, updateDataIfChanged]);

  return { data, isLoading, error };
}
