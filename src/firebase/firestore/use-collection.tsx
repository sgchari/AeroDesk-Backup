
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

/**
 * React hook to subscribe to a Firestore collection or query in real-time.
 * In demo mode, it returns mock data from '@/lib/data'.
 * @template T Optional type for document data. Defaults to any.
 * @param {CollectionReference<DocumentData> | Query<DocumentData> | null | undefined} targetRefOrQuery -
 * The Firestore CollectionReference or Query.
 * @param {string} [demoPath] - The path to the collection for demo mode.
 * @returns {UseCollectionResult<T>} Object with data, isLoading, error.
 */
export function useCollection<T = any>(
    memoizedTargetRefOrQuery: ((CollectionReference<DocumentData> | Query<DocumentData>) & {__memo?: boolean})  | null | undefined,
    demoPath?: string
): UseCollectionResult<T> {
  const [data, setData] = useState<WithId<T>[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<FirestoreError | Error | null>(null);
  const { user } = useUser();
  const isDemoMode = !memoizedTargetRefOrQuery?.firestore?.app;

  useEffect(() => {
    // If not in demo mode, use live data (currently not implemented in this branch)
    if (!isDemoMode) {
        console.warn("Live mode for useCollection is not implemented in this demo.");
        setIsLoading(false);
        return;
    }
    
    // --- DEMO MODE LOGIC ---
    if (!user) {
        setIsLoading(false);
        return;
    }
    
    // Simulate async data fetching
    setTimeout(() => {
        const path = demoPath;
        if (!path) {
            console.warn(`useCollection called in demo mode without a demoPath.`);
            setIsLoading(false);
            return;
        }

        const mockData = getMockDataForRole(user.role as UserRole);

        let resultData: any[] = [];
        
        // Handle nested collections first
        if (path.startsWith('operators/') && path.endsWith('/aircrafts')) {
            const operatorId = path.split('/')[1];
            resultData = mockData.aircrafts.filter(ac => ac.operatorId === operatorId);
        } else if (path.startsWith('charterRFQs/') && path.endsWith('/quotations')) {
            const rfqId = path.split('/')[1];
            if (rfqId === 'all') { // Handle the dashboard case
                resultData = mockData.quotations;
            } else {
                resultData = mockData.quotations.filter(q => q.rfqId === rfqId);
            }
        } else if (path.startsWith('emptyLegs/') && path.endsWith('/seatAllocationRequests')) {
            const emptyLegId = path.split('/')[1];
            resultData = mockData.seatAllocationRequests.filter(sar => sar.emptyLegId === emptyLegId);
        } else if (path.startsWith('hotelPartners/') && path.endsWith('/properties')) {
            const hotelPartnerId = path.split('/')[1];
            resultData = mockData.properties.filter(p => p.hotelPartnerId === hotelPartnerId);
        } else if (path.includes('/properties/') && path.endsWith('/roomCategories')) {
            const propertyId = path.split('/')[3];
            resultData = mockData.roomCategories.filter(rc => rc.propertyId === propertyId);
        } else if (path.startsWith('corporateTravelDesks/') && path.endsWith('/users')) {
            const ctdId = path.split('/')[1];
            resultData = mockUsers.filter(u => u.ctdId === ctdId);
        }
        // Handle root collections
        else {
            const collectionName = path.split('/')[0];
            switch(collectionName) {
                case 'charterRFQs':
                    resultData = mockData.rfqs.filter(rfq => (user.role === 'Customer' && rfq.customerId === user.id) || (user.role === 'Requester' && rfq.requesterExternalAuthId === user.id) || user.role === 'Operator' || user.role === 'Admin' || (user.role === 'CTD Admin' && rfq.company === user.company));
                    break;
                case 'emptyLegs':
                     resultData = mockData.emptyLegs.filter(leg => (user.role === 'Operator' && leg.operatorId === user.id) || (user.role !== 'Operator'));
                    break;
                case 'auditTrails':
                    resultData = mockData.auditLogs;
                    break;
                case 'operators':
                    resultData = mockData.operators;
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
                    resultData = mockData.corporateTravelDesks;
                    break;
                 case 'accommodationRequests':
                    resultData = mockData.accommodationRequests.filter(req => req.hotelPartnerId === user.id);
                    break;
                default:
                    console.warn(`useCollection: No mock data handler for path: ${path}`);
            }
        }
        
        setData(resultData as WithId<T>[]);
        setIsLoading(false);
    }, 500); // 500ms delay to simulate network

  }, [memoizedTargetRefOrQuery, user, isDemoMode, demoPath]);

  return { data, isLoading, error };
}
