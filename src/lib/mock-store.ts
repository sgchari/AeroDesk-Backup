import {
  mockUsers,
  mockOperators,
  mockAgencies,
  mockCorporates,
  mockRfqs,
  mockAircrafts,
  mockQuotations,
  mockEmptyLegs,
  mockSeatRequests,
  mockAuditLogs,
  mockAccommodationRequests,
  mockFeatureFlags,
  mockPolicyFlags,
  mockProperties,
  mockRoomCategories,
  mockTaxConfig,
  mockPlatformInvoices,
  mockPlatformChargeRules,
  mockBillingLedger,
  mockCommissionRules,
  mockRevenueShareConfigs,
  mockCommissionLedger,
  mockSettlementRecords
} from './data';
import { User, EmptyLeg, SeatAllocation, InventoryLogAction } from './types';

const deepCopy = <T>(obj: T): T => JSON.parse(JSON.stringify(obj));

let db = {
  users: deepCopy(mockUsers),
  operators: deepCopy(mockOperators),
  travelAgencies: deepCopy(mockAgencies),
  distributors: deepCopy(mockAgencies), // Alias
  corporateTravelDesks: deepCopy(mockCorporates),
  charterRFQs: deepCopy(mockRfqs),
  charterRequests: deepCopy(mockRfqs), // Alias
  aircrafts: deepCopy(mockAircrafts),
  quotations: deepCopy(mockQuotations),
  emptyLegs: deepCopy(mockEmptyLegs),
  emptyLegFlights: deepCopy(mockEmptyLegs), // Alias
  seatAllocations: deepCopy(mockSeatRequests),
  seatAllocationRequests: deepCopy(mockSeatRequests), // Alias
  seatInventoryLogs: [],
  auditTrails: deepCopy(mockAuditLogs),
  auditLogs: deepCopy(mockAuditLogs),
  accommodationRequests: deepCopy(mockAccommodationRequests),
  featureFlags: deepCopy(mockFeatureFlags),
  policyFlags: deepCopy(mockPolicyFlags),
  properties: deepCopy(mockProperties),
  roomCategories: deepCopy(mockRoomCategories),
  taxConfig: deepCopy(mockTaxConfig),
  platformInvoices: deepCopy(mockPlatformInvoices),
  platformChargeRules: deepCopy(mockPlatformChargeRules),
  entityBillingLedger: deepCopy(mockBillingLedger),
  commissionRules: deepCopy(mockCommissionRules),
  revenueShareConfigs: deepCopy(mockRevenueShareConfigs),
  commissionLedger: deepCopy(mockCommissionLedger),
  settlementRecords: deepCopy(mockSettlementRecords)
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

const resolveCollectionKey = (path: string): string => {
    if (!path) return '';
    const segments = path.split('/');
    const key = segments[0];
    const mappings: Record<string, string> = {
        'charterRequests': 'charterRFQs',
        'auditTrails': 'auditLogs',
        'distributors': 'travelAgencies',
        'platformAdmins': 'users',
        'emptyLegFlights': 'emptyLegs'
    };
    
    // Subcollection routing
    if (path.includes('seatAllocationRequests') || path.includes('seatAllocations')) return 'seatAllocations';
    if (path.includes('aircrafts')) return 'aircrafts';
    
    return mappings[key] || key;
};

const getCollection = (path: string, currentUser?: User | null): any[] => {
    const collectionName = resolveCollectionKey(path);
    const dataSet = (db as any)[collectionName] || [];

    if (!currentUser) return dataSet;
    if (currentUser.platformRole === 'admin') return dataSet;

    // Institutional isolation logic
    switch(collectionName) {
        case 'users':
            if (currentUser.operatorId) return dataSet.filter((u: any) => u.operatorId === currentUser.operatorId);
            if (currentUser.agencyId) return dataSet.filter((u: any) => u.agencyId === currentUser.agencyId);
            if (currentUser.corporateId) return dataSet.filter((u: any) => u.corporateId === currentUser.corporateId);
            if (currentUser.hotelPartnerId) return dataSet.filter((u: any) => u.hotelPartnerId === currentUser.hotelPartnerId);
            return [currentUser];
        case 'operators':
            return currentUser.operatorId ? dataSet.filter((o: any) => o.id === currentUser.operatorId) : [];
        case 'charterRFQs':
            if (currentUser.operatorId) return dataSet.filter((r: any) => r.operatorId === currentUser.id || r.status === 'Bidding Open');
            if (currentUser.agencyId) return dataSet.filter((r: any) => r.requesterExternalAuthId === currentUser.id);
            if (currentUser.corporateId) return dataSet.filter((r: any) => r.company === currentUser.company);
            return dataSet.filter((r: any) => r.customerId === currentUser.id || r.requesterExternalAuthId === currentUser.id);
        case 'aircrafts':
            return currentUser.operatorId ? dataSet.filter((a: any) => a.operatorId === currentUser.operatorId) : [];
        case 'seatAllocations':
            if (currentUser.operatorId) {
                return dataSet.filter((r: any) => r.operatorId === currentUser.operatorId);
            }
            if (currentUser.agencyId) {
                return dataSet.filter((r: any) => r.agencyId === currentUser.agencyId);
            }
            return dataSet.filter((r: any) => r.customerId === currentUser.id);
        case 'emptyLegs':
            if (currentUser.operatorId) return dataSet.filter((l: any) => l.operatorId === currentUser.operatorId);
            return dataSet.filter((l: any) => l.status === 'live' || l.status === 'Published' || l.status === 'Approved');
        default:
            return dataSet;
    }
}

const getDoc = (path: string): any | null => {
    const segments = path.split('/');
    const collectionName = resolveCollectionKey(segments[0]);
    const docId = segments.length > 2 ? segments[segments.length - 1] : segments[1];
    
    const dataSet = (db as any)[collectionName];
    if (!dataSet) return null;
    return dataSet.find((d: any) => d.id === docId) || null;
}

const addDoc = (path: string, data: any) => {
    const collectionName = resolveCollectionKey(path);
    const newDoc = { ...data, id: `demo-${Date.now()}` };
    
    if ((db as any)[collectionName]) {
        (db as any)[collectionName].unshift(newDoc);
    }
    notify();
};

const updateDoc = (collectionPath: string, docId: string, data: any) => {
    const collectionName = resolveCollectionKey(collectionPath);
    const dataSet = (db as any)[collectionName];
    if (!dataSet) return;
    
    const index = dataSet.findIndex((d: any) => d.id === docId);
    if (index > -1) {
        dataSet[index] = { ...dataSet[index], ...data, updatedAt: new Date().toISOString() };
        notify();
    }
};

const deleteDoc = (collectionPath: string, docId: string) => {
    const collectionName = resolveCollectionKey(collectionPath);
    const dataSet = (db as any)[collectionName];
    if (!dataSet) return;
    (db as any)[collectionName] = dataSet.filter((d: any) => d.id !== docId);
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
