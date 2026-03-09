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

type WithId<T> = T & { id: string };

export interface UseDocResult<T> {
  data: WithId<T> | null; 
  isLoading: boolean;       
  error: FirestoreError | Error | null; 
}

/**
 * Real-time document hook with deep-equality protection.
 * Ensures referential stability for dashboard widgets and prevents re-render loops.
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
  
  useEffect(() => {
    mountedRef.current = true;
    return () => { mountedRef.current = false; };
  }, []);

  const updateDataIfChanged = useCallback((newData: WithId<T> | null) => {
    if (!mountedRef.current) return;
    const dataString = JSON.stringify(newData);
    if (dataString !== prevDataStringRef.current) {
      setData(newData);
      prevDataStringRef.current = dataString;
    }
    setIsLoading(false);
  }, []);

  const isDemoMode = useMemo(() => {
    if (!memoizedDocRef) return true;
    const firestore = memoizedDocRef.firestore;
    if (!firestore || (firestore as any)._isMock) return true;
    return process.env.NEXT_PUBLIC_DEMO_MODE !== 'false';
  }, [memoizedDocRef]);

  useEffect(() => {
    if (!mountedRef.current || isUserLoading) return;

    if (!isDemoMode && memoizedDocRef) {
      setIsLoading(true);
      const unsubscribe = onSnapshot(memoizedDocRef, 
        (docSnap) => {
          if (docSnap.exists()) {
            updateDataIfChanged({ id: docSnap.id, ...docSnap.data() } as WithId<T>);
          } else {
            updateDataIfChanged(null);
          }
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
        setIsLoading(true);
        const fetchDemoData = () => {
            try {
                const docData = mockStore.getDoc(demoPath) as WithId<T> | null;
                updateDataIfChanged(docData);
            } catch (e: any) {
                if (mountedRef.current) setError(e);
                setIsLoading(false);
            }
        };
        
        fetchDemoData();
        const unsubscribe = mockStore.subscribe(fetchDemoData);
        return () => unsubscribe();
    }

    setIsLoading(false);
  }, [isDemoMode, demoPath, memoizedDocRef, isUserLoading, updateDataIfChanged]);

  return { data, isLoading, error };
}
