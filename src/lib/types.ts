
export type PlatformRole = 'admin' | 'operator' | 'agency' | 'corporate' | 'individual' | 'hotel';
export type FirmRole = 'admin' | 'manager' | 'finance' | 'operations' | 'approver' | 'viewer';

export type DashboardSummary = {
  totalCharters: number;
  pendingRequests: number;
  confirmedTrips: number;
  revenueThisMonth: number;
  seatRequestsPending: number;
  accommodationRequestsPending: number;
  lastUpdated: string;
};

export type MonthlyReport = {
  id: string;
  entityId: string;
  entityType: PlatformRole;
  revenue: number;
  commission: number;
  trips: number;
  seatSales: number;
  accommodationBookings: number;
  period: string; // YYYYMM
};

export type User = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  platformRole: PlatformRole;
  firmRole: FirmRole;
  status: 'active' | 'inactive';
  phoneNumber?: string;
  address?: string;
  avatar?: string;
  operatorId?: string | null;
  agencyId?: string | null;
  corporateId?: string | null;
  hotelPartnerId?: string | null;
  company?: string;
  createdAt: string;
  updatedAt: string;
};

// ... Rest of types remain same for logic, but paths are refactored in mock-store
export type RfqStatus = string;
export type TripType = 'Onward' | 'Return' | 'Multi-City';

export type CharterRFQ = {
  id: string;
  customerId: string;
  operatorId?: string;
  agencyId?: string;
  corporateId?: string;
  customerName: string;
  departure: string;
  arrival: string;
  status: RfqStatus;
  createdAt: string;
  updatedAt: string;
  totalAmount?: number;
};

export type EmptyLeg = {
  id: string;
  operatorId: string;
  seatsTotal: number;
  seatsAvailable: number;
  seatsBlocked: number;
  baseSeatPrice: number;
  status: string;
};
