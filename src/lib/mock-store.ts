import { 
  mockUsers, 
  mockRfqs, 
  mockEmptyLegs, 
  mockOperators, 
  mockCorporates,
  mockAgencies,
  mockHotelPartners,
  mockAuditLogs,
  mockActivityLogs,
  mockAlerts,
  mockSystemLogs,
  mockAircraft,
  mockAviationHubs,
  mockAircraftPositions,
  mockAircraftAvailability,
  mockDemandForecast,
  mockOperationalActivities,
  mockAICharterInsights,
  mockTripCommands,
  mockCharterPriceIndex,
  mockOrganizationUsers,
  mockCrewMembers,
  mockCrewAssignments,
  mockCrewLogistics,
  mockQuotations,
  mockSeatAllocations,
  mockInvoices,
  mockPayments,
  mockPassengerManifests,
  mockProperties,
  mockRoomCategories,
  mockAccommodationRequests,
  mockPlatformChargeRules,
  mockCommissionRules,
  mockRevenueShareConfigs,
  mockCommissionLedger,
  mockSettlementRecords,
  mockTaxConfigs,
  mockRouteDemandHistory,
  mockEmptyLegPredictions,
  mockFleetOptimizationSuggestions,
  mockFleetUtilization,
  mockCharterDemandAnalytics,
  mockEmptyLegOpportunities,
  mockAircraftPositioningInsights,
  mockCharterPriceBenchmark,
  mockRevenueForecast,
  mockBlogPosts,
  mockPressReleases,
  mockMediaMentions,
  mockBrandAssets,
  mockAircraftMaintenance,
  mockMaintenanceSchedule,
  mockDefectReports,
  mockMaintenanceWorkOrders,
  mockSeatAllocationRequests,
  mockSeatInvoices,
  mockSeatPayments,
  mockFlightPassengerManifests,
  mockSeatReservations,
  mockOperatorPaymentDetails,
  mockNotifications
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
  quotations: deepCopy(mockQuotations),
  seatAllocations: deepCopy(mockSeatAllocations),
  seatAllocationRequests: deepCopy(mockSeatAllocationRequests),
  seatInvoices: deepCopy(mockSeatInvoices),
  seatPayments: deepCopy(mockSeatPayments),
  flightPassengerManifests: deepCopy(mockFlightPassengerManifests),
  seatReservations: deepCopy(mockSeatReservations),
  operatorPaymentDetails: deepCopy(mockOperatorPaymentDetails),
  notifications: deepCopy(mockNotifications),
  invoices: deepCopy(mockInvoices),
  payments: deepCopy(mockPayments),
  passengerManifests: deepCopy(mockPassengerManifests),
  auditTrails: deepCopy(mockAuditLogs),
  activityLogs: deepCopy(mockActivityLogs),
  alerts: deepCopy(mockAlerts),
  systemLogs: deepCopy(mockSystemLogs),
  aircrafts: deepCopy(mockAircraft),
  aviationHubs: deepCopy(mockAviationHubs),
  aircraftPositions: deepCopy(mockAircraftPositions),
  aircraftAvailability: deepCopy(mockAircraftAvailability),
  charterDemandForecast: deepCopy(mockDemandForecast),
  operationalActivities: deepCopy(mockOperationalActivities),
  aiCharterInsights: deepCopy(mockAICharterInsights),
  tripCommand: deepCopy(mockTripCommands),
  charterPriceIndex: deepCopy(mockCharterPriceIndex),
  organizationUsers: deepCopy(mockOrganizationUsers),
  crewMembers: deepCopy(mockCrewMembers),
  crewAssignments: deepCopy(mockCrewAssignments),
  crewLogistics: deepCopy(mockCrewLogistics),
  properties: deepCopy(mockProperties),
  roomCategories: deepCopy(mockRoomCategories),
  accommodationRequests: deepCopy(mockAccommodationRequests),
  platformChargeRules: deepCopy(mockPlatformChargeRules),
  commissionRules: deepCopy(mockCommissionRules),
  revenueShareConfigs: deepCopy(mockRevenueShareConfigs),
  commissionLedger: deepCopy(mockCommissionLedger),
  settlementRecords: deepCopy(mockSettlementRecords),
  taxConfig: deepCopy(mockTaxConfigs),
  routeDemandHistory: deepCopy(mockRouteDemandHistory),
  emptyLegPredictions: deepCopy(mockEmptyLegPredictions),
  fleetOptimizationSuggestions: deepCopy(mockFleetOptimizationSuggestions),
  fleetUtilization: deepCopy(mockFleetUtilization),
  charterDemandAnalytics: deepCopy(mockCharterDemandAnalytics),
  emptyLegOpportunities: deepCopy(mockEmptyLegOpportunities),
  aircraftPositioningInsights: deepCopy(mockAircraftPositioningInsights),
  charterPriceBenchmark: deepCopy(mockCharterPriceBenchmark),
  revenueForecast: deepCopy(mockRevenueForecast),
  blogPosts: deepCopy(mockBlogPosts),
  pressReleases: deepCopy(mockPressReleases),
  mediaMentions: deepCopy(mockMediaMentions),
  brandAssets: deepCopy(mockBrandAssets),
  aircraftMaintenance: deepCopy(mockAircraftMaintenance),
  maintenanceSchedule: deepCopy(mockMaintenanceSchedule),
  defectReports: deepCopy(mockDefectReports),
  maintenanceWorkOrders: deepCopy(mockMaintenanceWorkOrders),
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
    if (segments.includes('aircrafts')) return 'aircrafts';
    if (segments.includes('users')) return 'users';
    if (segments.includes('charterRequests') || segments.includes('charterRFQs')) return 'charterRequests';
    if (segments.includes('quotations')) return 'quotations';
    if (segments.includes('seatAllocations')) return 'seatAllocations';
    if (segments.includes('seatAllocationRequests')) return 'seatAllocationRequests';
    if (segments.includes('policyFlags')) return 'policyFlags';
    return segments[0];
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
  
  if (segments.length > 2 && segments[segments.length - 1] === 'users') {
      return db.users.filter((u: any) => u.ctdId === segments[1] || u.operatorId === segments[1] || u.agencyId === segments[1] || u.hotelPartnerId === segments[1]);
  }

  if (segments.length > 2 && segments[segments.length - 1] === 'aircrafts') {
      return db.aircrafts.filter((a: any) => a.operatorId === segments[1]);
  }

  if (segments.length > 2 && segments[segments.length - 1] === 'quotations') {
      return db.quotations.filter((q: any) => q.rfqId === segments[1]);
  }

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
