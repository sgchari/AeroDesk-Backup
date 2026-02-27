
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
  mockBillingRecords,
  mockFeatureFlags,
  mockPolicyFlags,
  mockCrew,
  mockManifests,
  mockInvoices,
  mockPayments,
  mockActivityLogs
} from './data';
import { User, UserRole } from './types';

// Simple deep copy
const deepCopy = <T>(obj: T): T => JSON.parse(JSON.stringify(obj));

let db = {
  users: deepCopy(mockUsers),
  operators: deepCopy(mockOperators),
  charterRequests: deepCopy(mockRfqs), // Mapping mockRfqs to charterRequests
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
  billingRecords: deepCopy(mockBillingRecords),
  featureFlags: deepCopy(mockFeatureFlags),
  policyFlags: deepCopy(mockPolicyFlags),
  crew: deepCopy(mockCrew),
  passengerManifests: deepCopy(mockManifests),
  invoices: deepCopy(mockInvoices),
  payments: deepCopy(mockPayments),
  activityLogs: deepCopy(mockActivityLogs),
};

// Simple event emitter
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
    const pathSegments = path.split('/');
    const collectionName = pathSegments[0];

    // Handle special case for collectionGroup simulation
    if (path === 'emptyLegs/all/seatAllocationRequests') {
        return db.seatAllocationRequests;
    }

    switch(collectionName) {
        case 'charterRequests':
            if (!currentUser) return [];
            return db.charterRequests.filter(rfq => 
                (currentUser.role === 'Customer' && rfq.customerId === currentUser.id) ||
                (currentUser.role === 'Requester' && rfq.requesterExternalAuthId === currentUser.id) || 
                (currentUser.role === 'Operator' && rfq.operatorId === currentUser.id) || 
                (currentUser.role === 'Operator' && !rfq.operatorId && (rfq.status === 'Bidding Open' || rfq.status === 'New')) || 
                currentUser.role === 'Admin' || 
                (currentUser.role === 'CTD Admin' && rfq.company === currentUser.company) ||
                (currentUser.role === 'Travel Agency' && rfq.requesterExternalAuthId === currentUser.id)
            );
        case 'passengerManifests':
            return db.passengerManifests;
        case 'invoices':
            return db.invoices;
        case 'payments':
            return db.payments;
        case 'activityLogs':
            return db.activityLogs;
        case 'operators':
            if (pathSegments.length > 2 && pathSegments[2] === 'aircrafts') {
                const operatorId = pathSegments[1];
                return db.aircrafts.filter(ac => ac.operatorId === operatorId);
            }
            if (pathSegments.length > 2 && pathSegments[2] === 'crew') {
                const operatorId = pathSegments[1];
                return db.crew.filter(c => c.operatorId === operatorId);
            }
            return db.operators;
        case 'emptyLegs':
             return db.emptyLegs.filter(leg => 
                (currentUser && currentUser.role === 'Operator' && leg.operatorId === currentUser.id) || 
                (currentUser?.role !== 'Operator')
             );
        case 'auditTrails': return db.auditTrails;
        case 'customers': return db.users.filter(u => u.role === 'Customer');
        case 'platformAdmins': return db.users.filter(u => u.role === 'Admin');
        case 'distributors': return db.users.filter(u => u.role === 'Travel Agency');
        case 'hotelPartners': return db.users.filter(u => u.role === 'Hotel Partner');
        case 'corporateTravelDesks':
             if (pathSegments.length > 2 && pathSegments[2] === 'users') {
                const ctdId = pathSegments[1];
                return db.users.filter(u => u.ctdId === ctdId);
             }
             if (pathSegments.length > 2 && pathSegments[2] === 'policyFlags') {
                const ctdId = pathSegments[1];
                return db.policyFlags.filter(p => p.ctdId === ctdId);
             }
             return db.corporateTravelDesks;
        case 'accommodationRequests':
            if (!currentUser) return [];
            return db.accommodationRequests.filter(req => 
                req.hotelPartnerId === currentUser.id || 
                req.requesterId === currentUser.id
            );
        case 'users': return db.users; // Generic user collection for all roles
        case 'properties':
            if (!currentUser) return [];
            return db.properties.filter(p => p.hotelPartnerId === currentUser.id);
        case 'roomCategories':
            return db.roomCategories;
        case 'billingRecords': return db.billingRecords;
        case 'featureFlags': return db.featureFlags;
        case 'policyFlags': return db.policyFlags;
        case 'crew': 
            if (currentUser && currentUser.role === 'Operator') {
                return db.crew.filter(c => c.operatorId === currentUser.id);
            }
            return db.crew;
        default:
            console.warn(`Mock Store: No handler for getCollection path: ${path}`);
            return [];
    }
}

const getDoc = (path: string): any | null => {
    const pathSegments = path.split('/');
    const collection = pathSegments[0];
    const docId = pathSegments[1];
    
    let dataSet: any[] = [];
    
    if (collection === 'corporateTravelDesks' && pathSegments.length > 3 && pathSegments[2] === 'users') {
        dataSet = db.users;
        const ctdUserId = pathSegments[3];
        return dataSet.find(d => d.id === ctdUserId) || null;
    } else {
        dataSet = (db as any)[collection] || db.users;
    }
    
    return dataSet.find(d => d.id === docId) || null;
}

const addDoc = (path: string, data: any) => {
    const pathSegments = path.split('/');
    const collectionName = pathSegments[0];
    let newDoc = { ...data, id: `demo-${collectionName.slice(0, 4)}-${Date.now()}` };

    if ((db as any)[collectionName]) {
        (db as any)[collectionName].unshift(newDoc as any);
    } else {
         console.warn(`Mock Store: No handler for addDoc path: ${path}`);
    }
    
    notify();
};

const updateDoc = (collectionPath: string, docId: string, data: any) => {
    const dataSet = (db as any)[collectionPath];

    if (!dataSet) {
        console.warn(`Mock Store: No collection found for update path: ${collectionPath}`);
        return;
    }
    
    const docIndex = dataSet.findIndex((d: any) => d.id === docId);
    if (docIndex > -1) {
        dataSet[docIndex] = { ...dataSet[docIndex], ...data, updatedAt: new Date().toISOString() };
        notify();
    }
};

const deleteDoc = (collectionPath: string, docId: string) => {
    const dataSet = (db as any)[collectionPath];
    if (!dataSet) return;
    (db as any)[collectionPath] = dataSet.filter((d: any) => d.id !== docId);
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
