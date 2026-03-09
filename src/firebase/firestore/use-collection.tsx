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

export function useCollection<T = any>(
    memoizedQuery: (CollectionReference<DocumentData> | Query<DocumentData>) | null | undefined,
    demoPath?: string
): UseCollectionResult<T> {
  const [data, setData] = useState<WithId<T>[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<FirestoreError | Error | null>(null);
  const { user } = useUser();
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => { mountedRef.current = false; };
  }, []);

  useEffect(() => {
    if (!mountedRef.current) return;
    
    // Determine mode
    const isDemo = !memoizedQuery || (memoizedQuery.firestore as any)?._isMock || process.env.NEXT_PUBLIC_DEMO_MODE !== 'false';

    if (!isDemo && memoizedQuery) {
      setIsLoading(true);
      const unsubscribe = onSnapshot(memoizedQuery, 
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
    
    if (isDemo && demoPath) {
        setIsLoading(true);
        const fetchDemo = () => {
            if (!mountedRef.current) return;
            const mockData = mockStore.getCollection(demoPath, user);
            setData(mockData);
            setIsLoading(false);
        };
        
        fetchDemo();
        const unsub = mockStore.subscribe(fetchDemo);
        return () => unsub();
    }

    setIsLoading(false);
  }, [memoizedQuery, demoPath, user]);

  return { data, isLoading, error };
}
