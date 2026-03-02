export type PlatformRole = 'admin' | 'operator' | 'agency' | 'corporate' | 'individual';
export type FirmRole = 'admin' | 'manager' | 'finance' | 'operations' | 'approver' | 'viewer';

export type BookingChannel = 'agency' | 'direct' | 'corporate';

export type GSTVerificationStatus = 'pending' | 'verified' | 'rejected';

export interface GSTProfile {
  legalEntityName: string;
  gstin: string;
  gstRegisteredAddress: string;
  stateCode: string;
  gstCertificateUrl?: string;
  gstVerificationStatus: GSTVerificationStatus;
  gstVerifiedBy?: string;
  gstVerifiedAt?: string;
}

export type User = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string; // Legacy field for compatibility
  platformRole: PlatformRole;
  firmRole: FirmRole;
  status: 'active' | 'inactive';
  phoneNumber?: string;
  address?: string;
  avatar?: string;
  operatorId?: string | null;
  agencyId?: string | null;
  corporateId?: string | null;
  company?: string; // Display name of firm
  createdAt: string;
  updatedAt: string;
} & Partial<GSTProfile>;

export type Operator = {
  id: string;
  companyName: string;
  nsopLicenseNumber: string;
  officialEmail: string;
  registeredAddress: string;
  contactNumber: string;
  nsopDocumentUrl?: string;
  profileStatus: 'active' | 'pendingReview';
  adminUserId: string;
  status: 'Pending Approval' | 'Approved' | 'Suspended' | 'Rejected'; // Compatibility
  createdAt: string;
  updatedAt: string;
  city?: string;
  zone?: 'North' | 'South' | 'East' | 'West' | 'Central';
  fleetCount?: number;
} & Partial<GSTProfile>;

export type TravelAgency = {
  id: string;
  companyName: string;
  officialEmail: string;
  address: string;
  contactNumber: string;
  adminUserId: string;
  createdAt: string;
  updatedAt: string;
} & Partial<GSTProfile>;

export type CorporateTravelDesk = {
  id: string;
  companyName: string;
  officialEmail: string;
  address: string;
  adminUserId: string;
  status: 'Active' | 'Inactive' | 'Pending Setup';
  createdAt: string;
  updatedAt: string;
} & Partial<GSTProfile>;

export type AuditLog = {
  id: string;
  actionType: string;
  entityType: string;
  entityId: string;
  changedBy: string;
  previousData?: any;
  newData?: any;
  timestamp: string;
  user?: string; // Legacy
  role?: string; // Legacy
  action?: string; // Legacy
  details?: string; // Legacy
  targetId?: string; // Legacy
};

// ... keep other existing types like CharterRFQ, Aircraft, etc.
export type RfqStatus =
  | 'rfqSubmitted' | 'quoteReceived' | 'quoteAccepted' | 'awaitingManifest'
  | 'manifestSubmitted' | 'manifestApproved' | 'invoiceIssued' | 'paymentSubmitted'
  | 'paymentConfirmed' | 'charterConfirmed' | 'operationalPreparation' | 'preFlightReady'
  | 'boarding' | 'departed' | 'arrived' | 'flightCompleted' | 'tripClosed'
  | 'cancelled' | 'refunded' | 'Draft' | 'New' | 'Submitted' | 'Bidding Open';

export type TripType = 'Onward' | 'Return' | 'Multi-City';

export type CharterRFQ = {
  id: string;
  customerId: string;
  requesterExternalAuthId: string;
  operatorId?: string;
  aircraftId?: string;
  customerName: string;
  tripType: TripType;
  departure: string;
  arrival: string;
  departureDate: string;
  departureTime?: string;
  pax: number;
  aircraftType: string;
  status: RfqStatus;
  createdAt: string;
  updatedAt: string;
  company?: string;
  bookingChannel?: BookingChannel;
  totalAmount?: number;
  costCenter?: string;
  businessPurpose?: string;
};

export type Aircraft = {
  id: string;
  operatorId: string;
  name: string;
  type: string;
  registration: string;
  paxCapacity: number;
  homeBase: string;
  status: 'Available' | 'Under Maintenance' | 'AOG' | 'Restricted';
  exteriorImageUrl?: string;
};

export type CrewMember = {
  id: string;
  operatorId: string;
  firstName: string;
  lastName: string;
  role: string;
  status: string;
  licenseNumber?: string;
  assignedAircraftRegistration?: string;
  createdAt: string;
};

export type EmptyLeg = {
  id: string;
  operatorId: string;
  operatorName?: string;
  departure: string;
  arrival: string;
  departureTime: string;
  availableSeats: number;
  status: string;
};

export type PassengerManifest = {
  id: string;
  charterId: string;
  status: string;
  passengers: any[];
  createdAt: string;
};

export type Invoice = {
  id: string;
  charterId: string;
  invoiceNumber: string;
  totalAmount: number;
  status: string;
  bankDetails: string;
};

export type Payment = {
  id: string;
  charterId: string;
  utrReference: string;
  status: string;
  createdAt: string;
};

export type ActivityLog = {
  id: string;
  charterId: string;
  actionType: string;
  performedBy: string;
  role: string;
  timestamp: string;
};

export type FeatureFlag = {
  id: string;
  name: string;
  description: string;
  isEnabled: boolean;
};

export type PolicyFlag = {
  id: string;
  ctdId: string;
  name: string;
  description: string;
  isEnforced: boolean;
};

export type BlogPost = {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  imageUrl: string;
  author: string;
  date: string;
};

export type PressRelease = {
  id: string;
  title: string;
  description: string;
  date: string;
  category: string;
};

export type MediaMention = {
  id: string;
  publication: string;
  title: string;
  snippet: string;
  date: string;
};

export type BrandAsset = {
  id: string;
  title: string;
  type: string;
  imageUrl: string;
  fileSize: string;
};

export type PlatformInvoice = {
  id: string;
  entityName: string;
  entityType: string;
  totalAmount: number;
  dueDate: string;
  status: string;
};

export type EntityBillingLedger = {
  id: string;
  relatedTransactionId: string;
  serviceType: string;
  grossAmount: number;
  platformChargeAmount: number;
  ledgerStatus: string;
};

export type PlatformChargeRule = {
  id: string;
  entityType: string;
  serviceType: string;
  chargeType: string;
  percentageRate: number;
  fixedAmount: number;
  isActive: boolean;
};

export type TaxConfig = {
  id: string;
  serviceType: string;
  taxRatePercent: number;
  sacCode: string;
  isActive: boolean;
  effectiveFrom: string;
};

export type CommissionRule = {
  id: string;
  serviceType: string;
  commissionRatePercent: number;
  effectiveFrom: string;
  isActive: boolean;
};

export type RevenueShareConfig = {
  id: string;
  scopeType: string;
  serviceType?: string | null;
  agencySharePercent: number;
  aerodeskSharePercent: number;
  isActive: boolean;
};

export type CommissionLedgerEntry = {
  id: string;
  transactionId: string;
  bookingChannel: string;
  grossAmount: number;
  agencyCommissionAmount: number;
  aerodeskCommissionAmount: number;
  agencySharePercent: number;
  status: string;
  createdAt: string;
  serviceType: string;
};

export type SettlementRecord = {
  id: string;
  entityName?: string;
  settlementPeriodStart: string;
  settlementPeriodEnd: string;
  totalAgencyCommission: number;
  status: string;
  paymentReference?: string;
};

export type RoomCategory = {
  id: string;
  propertyId: string;
  name: string;
  description?: string;
  maxOccupancy: number;
  nightlyRate?: number;
  beddingType?: string;
  imageUrl?: string;
};

export type Property = {
  id: string;
  hotelPartnerId: string;
  name: string;
  city: string;
  status: string;
  imageUrl?: string;
  propertyType?: string;
  address: string;
};

export type AccommodationRequest = {
  id: string;
  hotelPartnerId: string;
  propertyName?: string;
  guestName?: string;
  checkIn: string;
  checkOut: string;
  rooms: number;
  status: string;
  requesterId?: string;
};
