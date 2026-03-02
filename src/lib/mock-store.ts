import {
  mockUsers,
  mockOperators,
  mockAgencies,
  mockCorporates,
  mockRfqs,
  mockAircrafts,
  mockQuotations,
  mockEmptyLegs,
  mockAuditLogs,
  mockAccommodationRequests,
  mockFeatureFlags,
  mockCrew,
  mockManifests,
  mockInvoices,
  mockPayments,
  mockActivityLogs,
  mockCommissionRules,
  mockRevenueShareConfigs,
  mockCommissionLedger,
  mockSettlementRecords,
  mockPolicyFlags,
  mockProperties,
  mockRoomCategories
} from './data';
import { User } from './types';

const deepCopy = <T>(obj: T): T => JSON.parse(JSON.stringify(obj));

let db = {
  users: deepCopy(mockUsers),
  operators: deepCopy(mockOperators),
  travelAgencies: deepCopy(mockAgencies),
  corporateTravelDesks: deepCopy(mockCorporates),
  charterRFQs: deepCopy(mockRfqs),
  aircrafts: deepCopy(mockAircrafts),
  quotations: deepCopy(mockQuotations),
  emptyLegs: deepCopy(mockEmptyLegs),
  auditLogs: deepCopy(mockAuditLogs),
  accommodationRequests: deepCopy(mockAccommodationRequests),
  featureFlags: deepCopy(mockFeatureFlags),
  policyFlags: deepCopy(mockPolicyFlags),
  crew: deepCopy(mockCrew),
  passengerManifests: deepCopy(mockManifests),
  invoices: deepCopy(mockInvoices),
  payments: deepCopy(mockPayments),
  activityLogs: deepCopy(mockActivityLogs),
  commissionRules: deepCopy(mockCommissionRules),
  revenueShareConfigs: deepCopy(mockRevenueShareConfigs),
  commissionLedger: deepCopy(mockCommissionLedger),
  settlementRecords: deepCopy(mockSettlementRecords),
  properties: deepCopy(mockProperties),
  roomCategories: deepCopy(mockRoomCategories)
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

const getCollection = (path: string, currentUser?: User | null): any[] => {
    const collectionName = path.split('/')[0];
    const dataSet = (db as any)[collectionName] || [];

    if (!currentUser || currentUser.platformRole === 'admin') return dataSet;

    // Firm-based isolation logic
    switch(collectionName) {
        case 'users':
            if (currentUser.operatorId) return dataSet.filter((u: any) => u.operatorId === currentUser.operatorId);
            if (currentUser.agencyId) return dataSet.filter((u: any) => u.agencyId === currentUser.agencyId);
            if (currentUser.corporateId) return dataSet.filter((u: any) => u.corporateId === currentUser.corporateId);
            return [currentUser];
        case 'operators':
            return currentUser.operatorId ? dataSet.filter((o: any) => o.id === currentUser.operatorId) : [];
        case 'travelAgencies':
            return currentUser.agencyId ? dataSet.filter((a: any) => a.id === currentUser.agencyId) : [];
        case 'corporateTravelDesks':
            return currentUser.corporateId ? dataSet.filter((c: any) => c.id === currentUser.corporateId) : [];
        case 'charterRFQs':
            if (currentUser.operatorId) return dataSet.filter((r: any) => r.operatorId === currentUser.operatorId || r.status === 'Bidding Open');
            if (currentUser.agencyId) return dataSet.filter((r: any) => r.agencyId === currentUser.agencyId);
            if (currentUser.corporateId) return dataSet.filter((r: any) => r.corporateId === currentUser.corporateId);
            return dataSet.filter((r: any) => r.customerId === currentUser.id);
        case 'aircrafts':
            return currentUser.operatorId ? dataSet.filter((a: any) => a.operatorId === currentUser.operatorId) : [];
        default:
            return dataSet;
    }
}

const getDoc = (path: string): any | null => {
    const [collectionName, docId] = path.split('/');
    const dataSet = (db as any)[collectionName];
    if (!dataSet) return null;
    return dataSet.find((d: any) => d.id === docId) || null;
}

const addDoc = (path: string, data: any) => {
    const collectionName = path.split('/')[0];
    const newDoc = { ...data, id: `demo-${Date.now()}` };
    if ((db as any)[collectionName]) {
        (db as any)[collectionName].unshift(newDoc);
        // Log Audit
        logAudit('CREATE', collectionName, newDoc.id, 'System', null, newDoc);
    }
    notify();
};

const updateDoc = (collectionPath: string, docId: string, data: any) => {
    const dataSet = (db as any)[collectionPath];
    if (!dataSet) return;
    const index = dataSet.findIndex((d: any) => d.id === docId);
    if (index > -1) {
        const prev = { ...dataSet[index] };
        dataSet[index] = { ...dataSet[index], ...data, updatedAt: new Date().toISOString() };
        logAudit('UPDATE', collectionPath, docId, 'System', prev, dataSet[index]);
        notify();
    }
};

const deleteDoc = (collectionPath: string, docId: string) => {
    const dataSet = (db as any)[collectionPath];
    if (!dataSet) return;
    const prev = dataSet.find((d: any) => d.id === docId);
    (db as any)[collectionPath] = dataSet.filter((d: any) => d.id !== docId);
    logAudit('DELETE', collectionPath, docId, 'System', prev, null);
    notify();
};

const logAudit = (action: string, entity: string, id: string, user: string, prev: any, next: any) => {
    db.auditLogs.unshift({
        id: `audit-${Date.now()}`,
        actionType: action,
        entityType: entity,
        entityId: id,
        changedBy: user,
        previousData: prev,
        newData: next,
        timestamp: new Date().toISOString()
    });
};

export const mockStore = {
  subscribe,
  getCollection,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc
};
