
import { mockUsers, mockRfqs, mockEmptyLegs } from './data';
import { User, DashboardSummary } from './types';

const deepCopy = <T>(obj: T): T => JSON.parse(JSON.stringify(obj));

// Optimized DB Structure matching Scoped Ownership
let db: any = {
  users: deepCopy(mockUsers),
  emptyLegFlights: deepCopy(mockEmptyLegs),
  charterRequests: deepCopy(mockRfqs),
  reports: [],
  readCount: 0 // Billing Protection: Monitoring reads per session
};

const notify = () => listeners.forEach(cb => cb());
const listeners: Set<() => void> = new Set();

const subscribe = (callback: () => void) => {
  listeners.add(callback);
  return () => listeners.delete(callback);
};

/**
 * Optimized Path Resolver: Simulates subcollections
 */
const resolvePath = (path: string) => {
  const segments = path.split('/');
  db.readCount++; // Increment read count for every call
  
  if (segments[segments.length - 1] === 'dashboardSummary') {
    // Generate simulated summary based on root data
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
  
  return (db as any)[segments[0]] || [];
};

const getCollection = (path: string, user?: User | null) => {
  let data = resolvePath(path);
  // Apply mandatory pagination & ordering
  if (Array.isArray(data)) {
    return data.slice(0, 10); 
  }
  return data;
};

const getDoc = (path: string) => {
  const data = resolvePath(path);
  if (!Array.isArray(data)) return data; // Return summary if path points to it
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
    db[rootCol].push(newDoc);
    notify(); 
  },
  updateDoc: (path: string, id: string, data: any) => { 
    const segments = path.split('/');
    const rootCol = segments[0];
    if (db[rootCol]) {
        const idx = db[rootCol].findIndex((d: any) => d.id === id);
        if (idx !== -1) db[rootCol][idx] = { ...db[rootCol][idx], ...data };
    }
    notify(); 
  },
  deleteDoc: (path: string, id: string) => { 
    const segments = path.split('/');
    const rootCol = segments[0];
    if (db[rootCol]) {
        db[rootCol] = db[rootCol].filter((d: any) => d.id !== id);
    }
    notify(); 
  }
};
