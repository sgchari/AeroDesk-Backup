
'use client';

import { useState, useEffect } from 'react';
import {
  Query,
  DocumentData,
  FirestoreError,
  CollectionReference,
} from 'firebase/firestore';
import { getMockDataForRole, mockUsers } from '@/lib/data';
import { useUser } from '@/hooks/use-user';
import type { UserRole } from '@/lib/types';


/** Utility type to add an 'id' field to a given type T. */
export type WithId<T> = T & { id: string };

/**
 * Interface for the return value of the useCollection hook.
 * @template T Type of the document data.
 */
export interface UseCollectionResult<T> {
  data: WithId<T>[] | null; // Document data with ID, or null.
  isLoading: boolean;       // True if loading.
  error: FirestoreError | Error | null; // Error object, or null.
}

// --- DEMO MODE ---
const DEMO_MODE = true; // Set to true to use mock data

/**
 * React hook to subscribe to a Firestore collection or query in real-time.
 * In demo mode, it returns mock data from '@/lib/data'.
 * @template T Optional type for document data. Defaults to any.
 * @param {CollectionReference<DocumentData> | Query<DocumentData> | null | undefined} targetRefOrQuery -
 * The Firestore CollectionReference or Query.
 * @returns {UseCollectionResult<T>} Object with data, isLoading, error.
 */
export function useCollection<T = any>(
    memoizedTargetRefOrQuery: ((CollectionReference<DocumentData> | Query<DocumentData>) & {__memo?: boolean})  | null | undefined,
): UseCollectionResult<T> {
  const [data, setData] = useState<WithId<T>[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<FirestoreError | Error | null>(null);
  const { user } = useUser();

  useEffect(() => {
    if (!DEMO_MODE) {
      // Original Firebase logic would go here.
      // For this demo, we do nothing if DEMO_MODE is off.
      setIsLoading(false);
      return;
    }
    
    // --- DEMO MODE LOGIC ---
    if (!user || !memoizedTargetRefOrQuery) {
        setIsLoading(false);
        return;
    }
    
    // Simulate async data fetching
    setTimeout(() => {
        const { path } = memoizedTargetRefOrQuery as CollectionReference;
        const mockData = getMockDataForRole(user.role as UserRole);

        let resultData: any[] = [];
        
        if (path.startsWith('operators/') && path.endsWith('/aircrafts')) {
            resultData = mockData.aircrafts.filter(ac => ac.operatorId === user.id);
        } else {
            switch(path) {
                case 'charterRFQs':
                    resultData = mockData.rfqs.filter(rfq => (user.role === 'Customer' && rfq.customerId === user.id) || user.role === 'Operator' || user.role === 'Admin');
                    break;
                case 'emptyLegs':
                     resultData = mockData.emptyLegs.filter(leg => (user.role === 'Operator' && leg.operatorId === user.id) || (user.role !== 'Operator'));
                    break;
                case 'auditTrails':
                    resultData = mockData.auditLogs;
                    break;
                case 'operators':
                    resultData = mockUsers.filter(u => u.role === 'Operator');
                    break;
                case 'customers':
                    resultData = mockUsers.filter(u => u.role === 'Customer');
                    break;
                case 'platformAdmins':
                    resultData = mockUsers.filter(u => u.role === 'Admin');
                    break;
                case 'distributors':
                     resultData = mockUsers.filter(u => u.role === 'Authorized Distributor');
                    break;
                case 'hotelPartners':
                     resultData = mockUsers.filter(u => u.role === 'Hotel Partner');
                    break;
                case 'corporateTravelDesks':
                    // In a real app, this would be more complex. Here, just find the CTD admin's company.
                    const ctdAdmin = mockUsers.find(u => u.role === 'CTD Admin');
                    if (ctdAdmin) {
                        resultData = [{ id: ctdAdmin.ctdId, companyName: ctdAdmin.company }];
                    }
                    break;
                 case 'accommodationRequests':
                    resultData = mockData.accommodationRequests.filter(req => req.hotelPartnerId === user.id);
                    break;
                default:
                    // For nested CTD users, e.g., corporateTravelDesks/{id}/users
                    if (path.includes('corporateTravelDesks') && path.includes('/users')) {
                         resultData = mockUsers.filter(u => u.ctdId && path.includes(u.ctdId));
                    } else {
                        console.warn(`useCollection: No mock data handler for path: ${path}`);
                    }
            }
        }
        
        setData(resultData as WithId<T>[]);
        setIsLoading(false);
    }, 500); // 500ms delay to simulate network

  }, [memoizedTargetRefOrQuery, user]);

  return { data, isLoading, error };
}
