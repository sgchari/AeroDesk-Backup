import { 
  mockUsers, 
  mockRfqs, 
  mockEmptyLegs, 
  mockOperators, 
  mockCorporates,
  mockAgencies,
  mockHotelPartners,
  mockAuditLogs,
  mockAircraft,
  mockSystemAlerts,
  mockSystemLogs,
  mockOrganizationUsers,
  mockInvoices,
  mockCostCenters,
  mockEmployeeTravelRequests,
  mockTravelApprovals,
  mockCorporateOrganizations,
  mockTravelAgencies,
  mockUserActivityLogs,
  mockAdminAuditLogs,
  mockSeatAllocationRequests,
  mockDemoAccessSettings
} from './data';
import { User } from './types';

const deepCopy = <T>(obj: T): T => JSON.parse(JSON.stringify(obj));

let db: any = {
  users: deepCopy(mockUsers),
  operators: deepCopy(mockOperators),
  corporateOrganizations: deepCopy(mockCorporateOrganizations),
  corporateTravelDesks: deepCopy(mockCorporates),
  distributors: deepCopy(mockAgencies),
  travelAgencies: deepCopy(mockTravelAgencies),
  hotelPartners: deepCopy(mockHotelPartners),
  emptyLegs: deepCopy(mockEmptyLegs),
  charterRequests: deepCopy(mockRfqs),
  charterRFQs: deepCopy(mockRfqs), 
  seatAllocationRequests: deepCopy(mockSeatAllocationRequests),
  invoices: deepCopy(mockInvoices),
  auditTrails: deepCopy(mockAuditLogs),
  alerts: deepCopy(mockSystemAlerts),
  systemLogs: deepCopy(mockSystemLogs),
  aircrafts: deepCopy(mockAircraft),
  organizationUsers: deepCopy(mockOrganizationUsers),
  costCenters: deepCopy(mockCostCenters),
  employeeTravelRequests: deepCopy(mockEmployeeTravelRequests),
  travelApprovals: deepCopy(mockTravelApprovals),
  userActivityLogs: deepCopy(mockUserActivityLogs),
  adminAuditLogs: deepCopy(mockAdminAuditLogs),
  demoAccessSettings: deepCopy(mockDemoAccessSettings),
  demoAccessLogs: [],
  readCount: 0
};

const listeners: Set<() => void> = new Set();
let isPendingNotification = false;

const notify = () => {
    if (isPendingNotification) return;
    isPendingNotification = true;

    if (typeof window !== 'undefined') {
        window.requestAnimationFrame(() => {
            listeners.forEach(cb => cb());
            isPendingNotification = false;
        });
    } else {
        isPendingNotification = false;
    }
};

const subscribe = (callback: () => void) => {
  listeners.add(callback);
  return () => listeners.delete(callback);
};

const getRootCollection = (path: string): string => {
    const segments = path.split('/');
    return segments[0];
};

const resolvePath = (path: string) => {
  const segments = path.split('/');
  db.readCount++; 
  
  return (db as any)[segments[0]] || [];
};

const getCollection = (path: string, user?: User | null) => {
  let data = resolvePath(path);
  if (Array.isArray(data)) {
    return data.slice(0, 100); 
  }
  return data;
};

const getDoc = (path: string) => {
  const data = resolvePath(path);
  if (!Array.isArray(data)) return data; 
  const segments = path.split('/');
  const id = segments[segments.length - 1];
  return data.find((d: any) => d.id === id) || null;
};

export const mockStore = {
  subscribe,
  getCollection,
  getDoc,
  getReadCount: () => db.readCount,
  addDoc: (path: string, data: any) => { 
    const rootCol = getRootCollection(path);
    if (!db[rootCol]) db[rootCol] = [];
    const newDoc = { id: `id-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`, ...data };
    db[rootCol].unshift(newDoc);
    notify(); 
  },
  updateDoc: (path: string, id: string, data: any) => { 
    const rootCol = getRootCollection(path);
    if (db[rootCol]) {
        const idx = db[rootCol].findIndex((d: any) => d.id === id);
        if (idx !== -1) {
            db[rootCol][idx] = { ...db[rootCol][idx], ...data };
            notify();
        }
    }
  },
  deleteDoc: (path: string, id: string) => { 
    const rootCol = getRootCollection(path);
    if (db[rootCol]) {
        db[rootCol] = db[rootCol].filter((d: any) => d.id !== id);
        notify(); 
    }
  }
};
