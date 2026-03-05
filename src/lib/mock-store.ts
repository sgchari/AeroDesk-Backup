import { 
  mockUsers, 
  mockRfqs, 
  mockEmptyLegs, 
  mockOperators, 
  mockCorporates,
  mockAgencies,
  mockHotelPartners,
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
  mockSettlementRecords,
  mockAlerts,
  mockSystemLogs,
  mockAircraft,
  mockCrew,
  mockSeatAllocations,
  mockAircraftPositions,
  mockAircraftAvailability,
  mockDemandForecast
} from './data';
import { User } from './types';

const deepCopy = <T>(obj: T): T => JSON.parse(JSON.stringify(obj));

let db: any = {
  users: deepCopy(mockUsers),
  operators: deepCopy(mockOperators),
  corporateTravelDesks: deepCopy(mockCorporates),
  distributors: deepCopy(mockAgencies),
  hotelPartners: deepCopy(mockHotelPartners),
  emptyLegs: deepCopy(mockEmptyLegs),
  charterRequests: deepCopy(mockRfqs),
  charterRFQs: deepCopy(mockRfqs), 
  auditTrails: deepCopy(mockAuditLogs),
  accommodationRequests: deepCopy(mockAccommodationRequests),
  featureFlags: deepCopy(mockFeatureFlags),
  properties: deepCopy(mockProperties),
  roomCategories: deepCopy(mockRoomCategories),
  taxConfig: deepCopy(mockTaxConfig),
  platformInvoices: deepCopy(mockPlatformInvoices),
  platformChargeRules: deepCopy(mockPlatformChargeRules),
  entityBillingLedger: deepCopy(mockBillingLedger),
  commissionRules: deepCopy(mockCommissionRules),
  revenueShareConfigs: deepCopy(mockRevenueShareConfigs),
  commissionLedger: deepCopy(mockCommissionLedger),
  settlementRecords: deepCopy(mockSettlementRecords),
  alerts: deepCopy(mockAlerts),
  systemLogs: deepCopy(mockSystemLogs),
  aircrafts: deepCopy(mockAircraft),
  crew: deepCopy(mockCrew),
  seatAllocations: deepCopy(mockSeatAllocations),
  seatAllocationRequests: deepCopy(mockSeatAllocations),
  aircraftPositions: deepCopy(mockAircraftPositions),
  aircraftAvailability: deepCopy(mockAircraftAvailability),
  charterDemandForecast: deepCopy(mockDemandForecast),
  readCount: 0
};

const listeners: Set<() => void> = new Set();

const notify = () => {
    if (typeof window !== 'undefined') {
        window.requestAnimationFrame(() => {
            listeners.forEach(cb => cb());
        });
    }
};

const subscribe = (callback: () => void) => {
  listeners.add(callback);
  return () => listeners.delete(callback);
};

const resolvePath = (path: string) => {
  const segments = path.split('/');
  db.readCount++; 
  
  if (segments[segments.length - 1] === 'dashboardSummary') {
    return {
      totalCharters: 12,
      pendingRequests: 3,
      confirmedTrips: 8,
      revenueThisMonth: 450000,
      seatRequestsPending: 2,
      accommodationRequestsPending: 1,
      lastUpdated: new Date().toISOString()
    };
  }
  
  if (segments.length > 2 && segments[2] === 'policyFlags') {
      return db.policyFlags || [];
  }
  
  if (segments.length > 2 && segments[2] === 'users') {
      return db.users.filter((u: any) => u.ctdId === segments[1] || u.operatorId === segments[1] || u.agencyId === segments[1] || u.hotelPartnerId === segments[1]);
  }

  if (segments.length > 2 && segments[2] === 'aircrafts') {
      return db.aircrafts.filter((a: any) => a.operatorId === segments[1]);
  }

  return (db as any)[segments[0]] || [];
};

const getCollection = (path: string, user?: User | null) => {
  let data = resolvePath(path);
  if (Array.isArray(data)) {
    return data.slice(0, 50); 
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
    const segments = path.split('/');
    const rootCol = segments[0];
    if (!db[rootCol]) db[rootCol] = [];
    const newDoc = { id: `id-${Date.now()}`, ...data };
    db[rootCol].unshift(newDoc);
    notify(); 
  },
  updateDoc: (path: string, id: string, data: any) => { 
    const segments = path.split('/');
    const rootCol = segments[0];
    if (db[rootCol]) {
        const idx = db[rootCol].findIndex((d: any) => d.id === id);
        if (idx !== -1) {
            db[rootCol][idx] = { ...db[rootCol][idx], ...data };
            notify();
        }
    }
  },
  deleteDoc: (path: string, id: string) => { 
    const segments = path.split('/');
    const rootCol = segments[0];
    if (db[rootCol]) {
        db[rootCol] = db[rootCol].filter((d: any) => d.id !== id);
        notify(); 
    }
  }
};
