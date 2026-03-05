'use client';
    
import { useState, useEffect, useRef } from 'react';
import {
  DocumentReference,
  DocumentData,
  FirestoreError,
  onSnapshot
} from 'firebase/firestore';
import { mockStore } from '@/lib/mock-store';

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
  const mountedRef = useRef(true);
  
  const isDemoMode = !memoizedDocRef || !memoizedDocRef.firestore?.app || (memoizedDocRef.firestore as any)._isMock;

  useEffect(() => {
    mountedRef.current = true;
    return () => { mountedRef.current = false; };
  }, []);

  useEffect(() => {
    if (!isDemoMode && memoizedDocRef) {
      setIsLoading(true);
      const unsubscribe = onSnapshot(memoizedDocRef, 
        (docSnap) => {
          if (!mountedRef.current) return;
          if (docSnap.exists()) {
            setData({ id: docSnap.id, ...docSnap.data() } as WithId<T>);
          } else {
            setData(null);
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

    if (isDemoMode) {
        const path = demoPath;
        if (!path) {
            setIsLoading(false);
            return;
        }
        
        const fetchDemoData = () => {
            if (!mountedRef.current) return;
            try {
                const docData = mockStore.getDoc(path);
                setData(prev => {
                    if (JSON.stringify(prev) === JSON.stringify(docData)) return prev;
                    return docData as WithId<T> | null;
                });
            } catch (e: any) {
                setError(e);
            } finally {
                setIsLoading(false);
            }
        };
        
        fetchDemoData();
        const unsubscribe = mockStore.subscribe(fetchDemoData);
        return () => unsubscribe();
    }

  }, [memoizedDocRef, isDemoMode, demoPath]);

  return { data, isLoading, error };
}
