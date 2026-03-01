
import {
  mockUsers,
  mockRfqs,
  mockAircrafts,
  mockQuotations,
  mockEmptyLegs,
  mockAuditLogs,
  mockAccommodationRequests,
  mockCorporateTravelDesks,
  mockProperties,
  mockRoomCategories,
  mockEmptyLegSeatAllocationRequests,
  mockOperators,
  mockFeatureFlags,
  mockCrew,
  mockManifests,
  mockInvoices,
  mockPayments,
  mockActivityLogs,
  mockPlatformChargeRules,
  mockBillingLedger,
  mockPlatformInvoices,
  mockSubscriptionPlans,
  mockCommissionRules,
  mockRevenueShareConfigs,
  mockCommissionLedger,
  mockSettlementRecords,
  mockPolicyFlags
} from './data';
import { User } from './types';

const deepCopy = <T>(obj: T): T => JSON.parse(JSON.stringify(obj));

let db = {
  users: deepCopy(mockUsers),
  operators: deepCopy(mockOperators),
  charterRFQs: deepCopy(mockRfqs), // Standard naming across governance views
  aircrafts: deepCopy(mockAircrafts),
  quotations: deepCopy(mockQuotations),
  emptyLegs: deepCopy(mockEmptyLegs),
  auditTrails: deepCopy(mockAuditLogs),
  accommodationRequests: deepCopy(mockAccommodationRequests),
  corporateTravelDesks: deepCopy(mockCorporateTravelDesks),
  properties: deepCopy(mockProperties),
  roomCategories: deepCopy(mockRoomCategories),
  seatAllocationRequests: deepCopy(mockEmptyLegSeatAllocationRequests),
  platformAdmins: deepCopy(mockUsers.filter(u => u.role === 'Admin')),
  customers: deepCopy(mockUsers.filter(u => u.role === 'Customer')),
  distributors: deepCopy(mockUsers.filter(u => u.role === 'Travel Agency')),
  hotelPartners: deepCopy(mockUsers.filter(u => u.role === 'Hotel Partner')),
  featureFlags: deepCopy(mockFeatureFlags),
  policyFlags: deepCopy(mockPolicyFlags),
  crew: deepCopy(mockCrew),
  passengerManifests: deepCopy(mockManifests),
  invoices: deepCopy(mockInvoices),
  payments: deepCopy(mockPayments),
  activityLogs: deepCopy(mockActivityLogs),
  commissions: [],
  platformChargeRules: deepCopy(mockPlatformChargeRules),
  entityBillingLedger: deepCopy(mockBillingLedger),
  platformInvoices: deepCopy(mockPlatformInvoices),
  subscriptionPlans: deepCopy(mockSubscriptionPlans),
  commissionRules: deepCopy(mockCommissionRules),
  revenueShareConfigs: deepCopy(mockRevenueShareConfigs),
  commissionLedger: deepCopy(mockCommissionLedger),
  settlementRecords: deepCopy(mockSettlementRecords),
  revenueAuditLogs: [],
};

type Listener = () => void;
const listeners: Set<Listener> = new Set();

const subscribe = (callback: Listener) => {
  listeners.add(callback);
  return () => listeners.delete(callback);
};

const notify = () => {
  listeners.forEach(cb => cb());
};

const resolveCollectionKey = (collectionName: string) => {
    if (collectionName === 'charterRequests') return 'charterRFQs';
    return collectionName;
};

const getCollection = (path: string, currentUser?: User | null): any[] => {
    const pathSegments = path.split('/');
    const collectionName = pathSegments[0];
    const resolvedKey = resolveCollectionKey(collectionName);

    if (path === 'emptyLegs/all/seatAllocationRequests') {
        return db.seatAllocationRequests;
    }

    switch(resolvedKey) {
        case 'charterRFQs':
            if (!currentUser) return [];
            return db.charterRFQs.filter(rfq => 
                (currentUser.role === 'Customer' && rfq.customerId === currentUser.id) ||
                (currentUser.role === 'Requester' && rfq.requesterExternalAuthId === currentUser.id) || 
                (currentUser.role === 'Operator' && rfq.operatorId === currentUser.id) || 
                (currentUser.role === 'Operator' && !rfq.operatorId && (['Bidding Open', 'New'].includes(rfq.status))) || 
                currentUser.role === 'Admin' || 
                (currentUser.role === 'CTD Admin' && rfq.company === currentUser.company) ||
                (currentUser.role === 'Travel Agency' && rfq.requesterExternalAuthId === currentUser.id)
            );
        case 'seatAllocationRequests':
            if (!currentUser) return [];
            return db.seatAllocationRequests.filter(req => 
                req.requesterExternalAuthId === currentUser.id ||
                req.operatorId === currentUser.id
            );
        case 'accommodationRequests':
            if (!currentUser) return [];
            return db.accommodationRequests.filter(req => 
                req.hotelPartnerId === currentUser.id || 
                req.requesterId === currentUser.id
            );
        case 'commissionLedger':
            if (!currentUser) return [];
            if (currentUser.role === 'Admin') return db.commissionLedger;
            return db.commissionLedger.filter(l => l.entityId === currentUser.id);
        case 'settlementRecords':
            if (!currentUser) return [];
            if (currentUser.role === 'Admin') return db.settlementRecords;
            return db.settlementRecords.filter(s => s.entityId === currentUser.id);
        case 'aircrafts':
            if (!currentUser) return [];
            if (currentUser.role === 'Operator') {
                return db.aircrafts.filter(ac => ac.operatorId === currentUser.id);
            }
            return db.aircrafts;
        default:
            return (db as any)[resolvedKey] || [];
    }
}

const getDoc = (path: string): any | null => {
    const pathSegments = path.split('/');
    const collectionName = pathSegments[0];
    const docId = pathSegments[1];
    
    const resolvedKey = resolveCollectionKey(collectionName);
    const dataSet = (db as any)[resolvedKey];
    if (!dataSet) return null;
    
    return dataSet.find((d: any) => d.id === docId) || null;
}

const addDoc = (path: string, data: any) => {
    const pathSegments = path.split('/');
    const collectionName = pathSegments[0];
    const resolvedKey = resolveCollectionKey(collectionName);
    let newDoc = { ...data, id: `demo-${resolvedKey.slice(0, 4)}-${Date.now()}` };

    if ((db as any)[resolvedKey]) {
        (db as any)[resolvedKey].unshift(newDoc as any);
    }
    
    notify();
};

const updateDoc = (collectionPath: string, docId: string, data: any) => {
    const resolvedKey = resolveCollectionKey(collectionPath);
    const dataSet = (db as any)[resolvedKey];
    if (!dataSet) return;
    
    const docIndex = dataSet.findIndex((d: any) => d.id === docId);
    if (docIndex > -1) {
        dataSet[docIndex] = { ...dataSet[docIndex], ...data, updatedAt: new Date().toISOString() };
        notify();
    }
};

const deleteDoc = (collectionPath: string, docId: string) => {
    const resolvedKey = resolveCollectionKey(collectionPath);
    const dataSet = (db as any)[resolvedKey];
    if (!dataSet) return;
    (db as any)[resolvedKey] = dataSet.filter((d: any) => d.id !== docId);
    notify();
};

export const mockStore = {
  subscribe,
  getCollection,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc
};
