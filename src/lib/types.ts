export type PlatformRole = 'admin' | 'operator' | 'agency' | 'corporate' | 'individual' | 'hotel';
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
  hotelPartnerId?: string | null;
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

export type HotelPartner = {
  id: string;
  companyName: string;
  officialEmail: string;
  address: string;
  status: 'Approved' | 'Pending' | 'Suspended';
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

export type RfqStatus =
  | 'rfqSubmitted' | 'quoteReceived' | 'quoteAccepted' | 'awaitingManifest'
  | 'manifestSubmitted' | 'manifestApproved' | 'invoiceIssued' | 'paymentSubmitted'
  | 'paymentConfirmed' | 'charterConfirmed' | 'operationalPreparation' | 'preFlightReady'
  | 'boarding' | 'departed' | 'arrived' | 'flightCompleted' | 'tripClosed'
  | 'cancelled' | 'refunded' | 'Draft' | 'New' | 'Submitted' | 'Bidding Open' | 'Pending Approval' | 'Reviewing' | 'Closed' | 'Confirmed';

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
  specialRequirements?: string;
  catering?: string;
  hotelRequired?: boolean;
  hotelPreferences?: string;
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
  interiorImageUrl?: string;
  updatedAt?: string;
  createdAt?: string;
};

export type CrewMember = {
  id: string;
  operatorId: string;
  firstName: string;
  lastName: string;
  role: string;
  status: 'Available' | 'On Duty' | 'Training' | 'Medical Leave';
  licenseNumber?: string;
  assignedAircraftRegistration?: string;
  createdAt: string;
  updatedAt?: string;
};

export type EmptyLeg = {
  id: string;
  operatorId: string;
  operatorName?: string;
  aircraftId: string;
  aircraftName?: string;
  departure: string;
  arrival: string;
  departureTime: string;
  availableSeats: number;
  seatsAllocated?: number;
  status: string;
  seatPricingStrategy?: string;
  estimatedPricePerSeat?: number;
  createdAt: string;
};

export type Passenger = {
  fullName: string;
  dob?: string;
  gender?: string;
  nationality: string;
  idType: string;
  idNumber: string;
};

export type PassengerManifest = {
  id: string;
  charterId: string;
  status: string;
  passengers: Passenger[];
  createdAt: string;
  updatedAt?: string;
  submittedBy?: string;
};

export type Invoice = {
  id: string;
  charterId: string;
  invoiceNumber: string;
  totalAmount: number;
  status: string;
  bankDetails: string;
  operatorId?: string;
  createdAt?: string;
  relatedEntityId?: string;
};

export type Payment = {
  id: string;
  charterId: string;
  invoiceId?: string;
  utrReference: string;
  status: string;
  createdAt: string;
  submittedBy?: string;
  verifiedAt?: string;
  relatedEntityId?: string;
};

export type ActivityLog = {
  id: string;
  charterId: string;
  actionType: string;
  performedBy: string;
  role: string;
  timestamp: string;
  entityId?: string;
  previousStatus?: string;
  newStatus?: string;
  metadata?: any;
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

export type ChargeType = 'percentage' | 'fixed' | 'hybrid';
export type BillingServiceType = 'charter' | 'seat' | 'accommodation' | 'subscription';

export type PlatformChargeRule = {
  id: string;
  entityType: UserRole | string;
  serviceType: BillingServiceType;
  chargeType: ChargeType;
  percentageRate: number;
  fixedAmount: number;
  isActive: boolean;
  createdBy?: string;
  createdAt?: string;
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
  createdBy?: string;
  createdAt?: string;
};

export type RevenueShareConfig = {
  id: string;
  scopeType: 'global' | 'entity' | 'serviceType';
  serviceType?: string | null;
  agencySharePercent: number;
  aerodeskSharePercent: number;
  isActive: boolean;
  createdBy?: string;
  createdAt?: string;
  effectiveFrom?: string;
};

export type CommissionLedgerEntry = {
  id: string;
  transactionId: string;
  bookingChannel: BookingChannel | string;
  grossAmount: number;
  totalCommission: number;
  agencyCommissionAmount: number;
  aerodeskCommissionAmount: number;
  agencySharePercent: number;
  status: 'pending' | 'settled';
  createdAt: string;
  serviceType: string;
  entityId?: string;
};

export type SettlementRecord = {
  id: string;
  entityName?: string;
  entityId?: string;
  settlementPeriodStart: string;
  settlementPeriodEnd: string;
  totalAgencyCommission: number;
  status: 'processed' | 'paid';
  paymentReference?: string;
  createdAt?: string;
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
  status: 'Active' | 'Inactive' | 'Under Renovation';
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
  status: 'Pending' | 'Confirmed' | 'Declined' | 'Awaiting Clarification' | 'stayConfirmed';
  requesterId?: string;
};

export type Quotation = {
  id: string;
  rfqId: string;
  operatorId: string;
  operatorName: string;
  aircraftId: string;
  aircraftName: string;
  price: number;
  status: 'Submitted' | 'Selected' | 'Withdrawn' | 'Expired';
  submittedAt: string;
  validUntil: string;
  operatorRemarks?: string;
};

export type EmptyLegSeatAllocationRequest = {
  id: string;
  emptyLegId: string;
  distributorId: string;
  requesterExternalAuthId: string;
  numberOfSeats: number;
  status: 'Requested' | 'Approved' | 'Rejected' | 'Confirmed' | 'Cancelled';
  requestDateTime: string;
  passengerName?: string;
  clientReference?: string;
  passengerNotes?: string;
};

export type UserRole = 'Admin' | 'Operator' | 'Travel Agency' | 'Hotel Partner' | 'CTD Admin' | 'Corporate Admin' | 'Requester' | 'Customer';
export type CrewRole = 'Captain' | 'First Officer' | 'Cabin Crew' | 'Maintenance' | 'Operations';
export type CrewStatus = 'Available' | 'On Duty' | 'Training' | 'Medical Leave';
