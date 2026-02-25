
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
} from './data';
import { User, UserRole } from './types';

// Simple deep copy
const deepCopy = <T>(obj: T): T => JSON.parse(JSON.stringify(obj));

let db = {
  users: deepCopy(mockUsers),
  operators: deepCopy(mockOperators),
  charterRFQs: deepCopy(mockRfqs),
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
        case 'operators':
            if (pathSegments.length > 2 && pathSegments[2] === 'aircrafts') {
                const operatorId = pathSegments[1];
                return db.aircrafts.filter(ac => ac.operatorId === operatorId);
            }
            return db.operators;
        case 'charterRFQs':
            if (!currentUser) return [];
            return db.charterRFQs.filter(rfq => 
                (currentUser.role === 'Customer' && rfq.customerId === currentUser.id) ||
                (currentUser.role === 'Requester' && rfq.requesterExternalAuthId === currentUser.id) || 
                currentUser.role === 'Operator' || 
                currentUser.role === 'Admin' || 
                (currentUser.role === 'CTD Admin' && rfq.company === currentUser.company) ||
                (currentUser.role === 'Travel Agency' && rfq.requesterExternalAuthId === currentUser.id)
            );
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
             return db.corporateTravelDesks;
        case 'accommodationRequests':
            if (!currentUser) return [];
            return db.accommodationRequests.filter(req => req.hotelPartnerId === currentUser.id);
        case 'users': return db.users; // Generic user collection for all roles
        case 'properties':
            if (!currentUser) return [];
            return db.properties.filter(p => p.hotelPartnerId === currentUser.id);
        case 'roomCategories':
            return db.roomCategories;
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

    if (collectionName === 'emptyLegs' && pathSegments.length > 2 && pathSegments[2] === 'seatAllocationRequests') {
        db.seatAllocationRequests.unshift(newDoc as any);
    } else if (collectionName === 'charterRFQs') {
        db.charterRFQs.unshift(newDoc as any);
    } else if (['users', 'platformAdmins', 'customers', 'operators', 'distributors', 'hotelPartners'].includes(collectionName)) {
        db.users.unshift(newDoc as any); // Add to the main users array
        if ((db as any)[collectionName]) {
            (db as any)[collectionName].unshift(newDoc as any); // Also add to specific array if exists
        }
    } else if (collectionName === 'corporateTravelDesks' && pathSegments.length > 2 && pathSegments[2] === 'users') {
         db.users.unshift(newDoc as any);
    } else if ((db as any)[collectionName]) {
        (db as any)[collectionName].unshift(newDoc as any);
    } else {
         console.warn(`Mock Store: No handler for addDoc path: ${path}`);
    }
    
    notify();
};

const updateDoc = (collectionPath: string, docId: string, data: any) => {
    const pathSegments = collectionPath.split('/');
    const collectionName = pathSegments[0];
    let dataSet: any[] | undefined;

    if (collectionName === 'corporateTravelDesks' && pathSegments.length > 2 && pathSegments[2] === 'users') {
        dataSet = db.users;
    } else {
        dataSet = (db as any)[collectionName] || db.users;
    }

    if (!dataSet) {
        console.warn(`Mock Store: No collection found for update path: ${collectionPath}`);
        return;
    }
    
    const docIndex = dataSet.findIndex(d => d.id === docId);
    if (docIndex > -1) {
        dataSet[docIndex] = { ...dataSet[docIndex], ...data, updatedAt: new Date().toISOString() };
        // Also update the master user list if it's a user role
        if (['operators', 'customers', 'platformAdmins', 'distributors', 'hotelPartners'].includes(collectionName)) {
            const masterUserIndex = db.users.findIndex(u => u.id === docId);
            if (masterUserIndex > -1) {
                db.users[masterUserIndex] = { ...db.users[masterUserIndex], ...data, updatedAt: new Date().toISOString() };
            }
        }
        notify();
    } else {
         console.warn(`Mock Store: Document not found for update: ${collectionPath}/${docId}`);
    }
};

const deleteDoc = (collectionPath: string, docId: string) => {
    const pathSegments = collectionPath.split('/');
    const collectionName = pathSegments[0];
    let dataSet: any[] | undefined;

    if (collectionName === 'corporateTravelDesks' && pathSegments.length > 2 && pathSegments[2] === 'users') {
        dataSet = db.users;
    } else {
        dataSet = (db as any)[collectionName] || db.users;
    }
    
    if (!dataSet) {
        console.warn(`Mock Store: No collection found for delete path: ${collectionPath}`);
        return;
    }

    const initialLength = dataSet.length;
    (db as any)[collectionName] = dataSet.filter(d => d.id !== docId);

    // Also delete from the master user list
     if (['operators', 'customers', 'platformAdmins', 'distributors', 'hotelPartners'].includes(collectionName)) {
        db.users = db.users.filter(u => u.id !== docId);
     }
    
    if (dataSet.length < initialLength) {
        notify();
    } else {
        console.warn(`Mock Store: Document not found for delete: ${collectionPath}/${docId}`);
    }
};

export const mockStore = {
  subscribe,
  getCollection,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc
};

    