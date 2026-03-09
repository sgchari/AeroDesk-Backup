'use client';
    
import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import {
  DocumentReference,
  DocumentData,
  FirestoreError,
  onSnapshot
} from 'firebase/firestore';
import { mockStore } from '@/lib/mock-store';
import { useUser } from '@/hooks/use-user';

/** Utility type to add an 'id' field to a given type T. */
type WithId<T> = T & { id: string };

export interface UseDocResult<T> {
  data: WithId<T> | null; 
  isLoading: boolean;       
  error: FirestoreError | Error | null; 
}

/**
 * React hook to subscribe to a single document in real-time.
 * Optimized for dashboard stability and performance.
 */
export function useDoc<T = any>(
  memoizedDocRef: (DocumentReference<DocumentData> & {__memo?: boolean}) | null | undefined,
  demoPath?: string,
): UseDocResult<T> {
  const [data, setData] = useState<WithId<T> | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<FirestoreError | Error | null>(null);
  
  const { isLoading: isUserLoading } = useUser();
  
  const mountedRef = useRef(true);
  const prevDataStringRef = useRef<string>('');
  
  const isDemoMode = useMemo(() => {
    if (!memoizedDocRef) return true;
    const firestore = memoizedDocRef.firestore;
    if (!firestore || !firestore.app || (firestore as any)._isMock) return true;
    return false;
  }, [memoizedDocRef]);

  useEffect(() => {
    mountedRef.current = true;
    return () => { mountedRef.current = false; };
  }, []);

  const fetchDemoData = useCallback(() => {
    if (!mountedRef.current || !demoPath) return;
    
    if (isUserLoading) return;

    try {
        const docData = mockStore.getDoc(demoPath) as WithId<T> | null;
        const currentString = JSON.stringify(docData);
        
        if (currentString !== prevDataStringRef.current) {
            setData(docData);
            prevDataStringRef.current = currentString;
        }
    } catch (e: any) {
        if (mountedRef.current) setError(e);
    } finally {
        if (mountedRef.current) {
            setIsLoading(false);
        }
    }
  }, [demoPath, isUserLoading]);

  useEffect(() => {
    if (!mountedRef.current) return;
    setIsLoading(true);

    if (!isDemoMode && memoizedDocRef) {
      const unsubscribe = onSnapshot(memoizedDocRef, 
        (docSnap) => {
          if (!mountedRef.current) return;
          if (docSnap.exists()) {
            const item = { id: docSnap.id, ...docSnap.data() } as WithId<T>;
            const currentString = JSON.stringify(item);
            if (currentString !== prevDataStringRef.current) {
                setData(item);
                prevDataStringRef.current = currentString;
            }
          } else {
            setData(null);
            prevDataStringRef.current = 'null';
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
        const unsubscribe = mockStore.subscribe(() => {
            fetchDemoData();
        });
        return () => unsubscribe();
    } else {
        if (mountedRef.current) {
            setIsLoading(false);
        }
    }

  }, [isDemoMode, demoPath, memoizedDocRef, fetchDemoData]);

  return { data, isLoading, error };
}
