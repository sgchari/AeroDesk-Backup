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
 * Real-time collection hook with deep-equality protection.
 * Prevents re-render loops in dashboard environments.
 */
export function useCollection<T = any>(
    memoizedQuery: (CollectionReference<DocumentData> | Query<DocumentData>) | null | undefined,
    demoPath?: string
): UseCollectionResult<T> {
  const [data, setData] = useState<WithId<T>[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<FirestoreError | Error | null>(null);
  
  const { user, isUserLoading } = useUser();
  const mountedRef = useRef(true);
  const prevDataStringRef = useRef<string>('');

  useEffect(() => {
    mountedRef.current = true;
    return () => { mountedRef.current = false; };
  }, []);

  const isDemoMode = !memoizedQuery || (memoizedQuery.firestore as any)?._isMock || process.env.NEXT_PUBLIC_DEMO_MODE !== 'false';

  const updateDataIfChanged = useCallback((newData: WithId<T>[] | null) => {
    if (!mountedRef.current) return;
    const dataString = JSON.stringify(newData);
    if (dataString !== prevDataStringRef.current) {
      setData(newData);
      prevDataStringRef.current = dataString;
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (!mountedRef.current || isUserLoading) return;
    
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
    
    if (isDemoMode && demoPath) {
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
