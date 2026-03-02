export type UserRole =
  | 'Customer'
  | 'Operator'
  | 'Travel Agency'
  | 'CTD Admin'
  | 'Hotel Partner'
  | 'Admin'
  | 'Requester'
  | 'Corporate Admin';

export type BookingChannel = 'agency' | 'direct' | 'corporate';

export type GSTVerificationStatus = 'pending' | 'verified' | 'rejected';

export interface GSTProfile {
  legalEntityName: string;
  gstin: string;
  gstRegisteredAddress: string;
  stateCode: string; // First 2 digits of GSTIN
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
  role: UserRole;
  status: string;
  phoneNumber?: string;
  company?: string;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
  ctdId?: string;
  externalAuthId?: string;
  nsopLicenseNumber?: string;
  mouAcceptedAt?: string;
  companyName?: string;
  city?: string;
  zone?: 'North' | 'South' | 'East' | 'West' | 'Central';
} & Partial<GSTProfile>;

export type Operator = {
  id: string;
  externalAuthId: string;
  companyName: string;
  nsopLicenseNumber: string;
  contactPersonName: string;
  contactEmail: string;
  contactPhone?: string;
  address?: string;
  status: 'Pending Approval' | 'Approved' | 'Suspended' | 'Rejected';
  mouAcceptedAt: string;
  createdAt: string;
  updatedAt: string;
  city?: string;
  zone?: 'North' | 'South' | 'East' | 'West' | 'Central';
  featured?: boolean;
  fleetCount?: number;
  baseLocation?: { lat: number; lng: number };
} & Partial<GSTProfile>;

export type RfqStatus =
  | 'rfqSubmitted'
  | 'quoteReceived'
  | 'quoteAccepted'
  | 'awaitingManifest'
  | 'manifestSubmitted'
  | 'manifestApproved'
  | 'invoiceIssued'
  | 'paymentSubmitted'
  | 'paymentConfirmed'
  | 'charterConfirmed'
  | 'operationalPreparation'
  | 'preFlightReady'
  | 'boarding'
  | 'departed'
  | 'arrived'
  | 'flightCompleted'
  | 'tripClosed'
  | 'cancelled'
  | 'refunded'
  | 'Draft'
  | 'New'
  | 'Submitted'
  | 'Bidding Open';

export type SeatRequestStatus =
  | 'seatRequestSubmitted'
  | 'seatApproved'
  | 'seatRejected'
  | 'seatInvoiceIssued'
  | 'seatPaymentSubmitted'
  | 'seatPaymentConfirmed'
  | 'seatConfirmed'
  | 'seatCompleted'
  | 'seatCancelled'
  | 'seatRefunded';

export type AccommodationStatus =
  | 'accommodationRequested'
  | 'accommodationConfirmed'
  | 'accommodationInvoiceIssued'
  | 'accommodationPaymentSubmitted'
  | 'accommodationPaymentConfirmed'
  | 'stayConfirmed'
  | 'checkIn'
  | 'checkOut'
  | 'stayClosed'
  | 'accommodationCancelled'
  | 'accommodationRefunded';

export type CommissionStatus =
  | 'commissionCalculated'
  | 'commissionPendingSettlement'
  | 'commissionSettled'
  | 'commissionAdjusted';

export type TripType = 'Onward' | 'Return' | 'Multi-City';

export type CharterRFQ = {
  id: string;
  customerId: string;
  requesterExternalAuthId: string;
  operatorId?: string;
  aircraftId?: string;
  quoteId?: string;
  customerName: string;
  tripType: TripType;
  departure: string;
  arrival: string;
  departureDate: string;
  departureTime?: string;
  returnDate?: string;
  returnTime?: string;
  pax: number;
  aircraftType: string;
  status: RfqStatus;
  createdAt: string;
  updatedAt: string;
  bidsCount: number;
  catering?: string;
  specialRequirements?: string;
  businessPurpose?: string;
  costCenter?: string;
  company?: string;
  hotelRequired?: boolean;
  totalAmount?: number;
  commissionRate?: number;
  commissionAmount?: number;
  bookingChannel?: BookingChannel;
  agencyId?: string | null;
};

export type Passenger = {
  fullName: string;
  dob: string;
  gender: string;
  nationality: string;
  idType: string;
  idNumber: string;
  idDocumentUrl?: string;
};

export type PassengerManifest = {
  id: string;
  charterId: string;
  submittedBy: string;
  passengers: Passenger[];
  specialNotes?: string;
  status: 'draft' | 'submitted' | 'approved' | 'revisionRequested';
  createdAt: string;
  updatedAt: string;
};

export type Invoice = {
  id: string;
  transactionId: string;
  sellerEntityId: string;
  buyerEntityId: string;
  sellerGSTIN?: string;
  buyerGSTIN?: string;
  placeOfSupply: string;
  taxableAmount: number;
  cgstAmount: number;
  sgstAmount: number;
  igstAmount: number;
  totalInvoiceAmount: number;
  invoiceType: 'B2B' | 'B2C';
  sacCode?: string;
  status: 'issued' | 'paid' | 'cancelled';
  createdAt: string;
};

export type Payment = {
  id: string;
  relatedEntityId: string;
  entityType: 'charter' | 'seat' | 'accommodation';
  invoiceId: string;
  submittedBy: string;
  utrReference: string;
  proofUrl?: string;
  status: 'submitted' | 'verified' | 'rejected';
  createdAt: string;
  verifiedAt?: string;
};

export type Commission = {
  id: string;
  relatedEntityId: string;
  entityType: 'charter' | 'seat' | 'accommodation';
  grossAmount: number;
  commissionRate: number;
  commissionAmount: number;
  status: CommissionStatus;
  settlementDate?: string;
  createdAt: string;
};

export type ActivityLog = {
  id: string;
  entityId: string;
  entityType: string;
  actionType: string;
  performedBy: string;
  role: string;
  previousStatus: string;
  newStatus: string;
  timestamp: string;
  metadata?: any;
};

export type Quotation = {
  id: string;
  rfqId: string;
  operatorId: string;
  operatorName: string;
  aircraftId: string;
  aircraftName: string;
  price: number;
  status: 'Submitted' | 'Withdrawn' | 'Selected' | 'Rejected' | 'Expired';
  submittedAt: string;
  validUntil: string;
  operatorRemarks?: string;
};

export type Aircraft = {
  id: string;
  operatorId: string;
  name: string;
  type: 'Light Jet' | 'Mid-size Jet' | 'Heavy Jet' | 'Turboprop';
  registration: string;
  paxCapacity: number;
  homeBase: string;
  status: 'Available' | 'Under Maintenance' | 'AOG' | 'Restricted';
  exteriorImageUrl?: string;
  interiorImageUrl?: string;
};

export type CrewRole = 'Captain' | 'First Officer' | 'Cabin Crew' | 'Maintenance' | 'Operations';
export type CrewStatus = 'Available' | 'On Duty' | 'Training' | 'Medical Leave' | 'Inactive';

export type CrewMember = {
  id: string;
  operatorId: string;
  firstName: string;
  lastName: string;
  email: string;
  role: CrewRole;
  status: CrewStatus;
  licenseNumber?: string;
  assignedAircraftId?: string; 
  assignedAircraftRegistration?: string;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
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
  status: 'Pending Approval' | 'Approved' | 'Expired' | 'Cancelled' | 'Draft' | 'Published' | 'Closed';
  seatPricingStrategy?: 'Fixed' | 'Dynamic' | 'Negotiable';
  estimatedPricePerSeat?: number;
};

export type EmptyLegSeatAllocationRequest = {
    id: string;
    emptyLegId: string;
    agencyId?: string | null;
    operatorId: string;
    requesterExternalAuthId: string;
    numberOfSeats: number;
    status: SeatRequestStatus;
    requestDateTime: string;
    clientReference?: string;
    passengerNotes?: string;
    passengerName?: string;
    seatPrice?: number;
    totalAmount?: number;
    commissionRate?: number;
    commissionAmount?: number;
    bookingChannel: BookingChannel;
}

export type Property = {
    id: string;
    hotelPartnerId: string;
    name: string;
    address: string;
    city: string;
    status: 'Active' | 'Inactive';
    propertyType?: string;
    imageUrl?: string;
};

export type RoomCategory = {
    id: string;
    propertyId: string;
    name: string;
    description?: string;
    maxOccupancy: number;
    beddingType?: string;
    baseCapacity?: number;
    imageUrl?: string;
    nightlyRate?: number;
};

export type AccommodationRequest = {
    id: string;
    agencyId?: string | null;
    hotelPartnerId: string;
    propertyId: string;
    propertyName?: string;
    roomCategory: string;
    checkIn: string;
    checkOut: string;
    rooms: number;
    guestName: string;
    totalAmount?: number;
    commissionRate?: number;
    commissionAmount?: number;
    status: AccommodationStatus;
    tripReferenceId: string;
    tripType: 'Charter' | 'EmptyLeg';
    requesterId: string;
    createdAt: string;
    updatedAt: string;
    bookingChannel: BookingChannel;
};

export type AuditLog = {
    id: string;
    timestamp: string;
    user: string;
    role: string;
    action: string;
    details: string;
    targetId: string;
};

export type BillingRecord = {
    id: string;
    entityName: string;
    entityId: string;
    eventType: 'Subscription' | 'Coordination Fee' | 'Participation Fee';
    amount: number;
    currency: 'INR';
    status: 'Paid' | 'Pending' | 'Overdue';
    date: string;
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
    policyDetails?: string;
    createdAt?: string;
    updatedAt?: string;
};

export type BlogPost = {
  id: string;
  title: string;
  excerpt: string;
  content?: string;
  category: string;
  imageUrl: string;
  author: string;
  date: string;
  isFeatured?: boolean;
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
  logoUrl?: string;
};

export type BrandAsset = {
  id: string;
  title: string;
  type: string;
  imageUrl: string;
  fileSize: string;
};

// --- PLATFORM BILLING ENGINE TYPES ---

export type ChargeType = 'percentage' | 'fixed' | 'hybrid';
export type BillingServiceType = 'charter' | 'seat' | 'accommodation' | 'subscription';
export type PlatformInvoiceStatus = 'issued' | 'overdue' | 'paid' | 'cancelled';
export type PlatformPaymentStatus = 'submitted' | 'verified' | 'rejected';
export type LedgerStatus = 'pending' | 'invoiced' | 'paid' | 'adjusted';

export type PlatformChargeRule = {
  id: string;
  entityType: UserRole;
  serviceType: BillingServiceType;
  chargeType: ChargeType;
  percentageRate: number; 
  fixedAmount: number;
  effectiveFrom: string;
  effectiveTo?: string;
  isActive: boolean;
  createdBy: string;
  createdAt: string;
};

export type EntityBillingLedger = {
    id: string;
    entityId: string;
    entityType: UserRole;
    relatedTransactionId: string;
    serviceType: BillingServiceType;
    grossAmount: number;
    platformChargeAmount: number;
    commissionRate: number;
    ledgerStatus: LedgerStatus;
    invoiceId?: string;
    createdAt: string;
};

export type PlatformInvoice = {
    id: string;
    entityId: string;
    entityName: string;
    entityType: UserRole;
    billingPeriodStart: string;
    billingPeriodEnd: string;
    totalAmount: number;
    invoicePdfUrl?: string;
    dueDate: string;
    status: PlatformInvoiceStatus;
    createdAt: string;
};

export type SubscriptionPlan = {
    id: string;
    planName: string;
    monthlyFee: number;
    commissionOverrideRate: number;
    seatLimit: number;
    transactionLimit: number;
    createdAt: string;
    isActive: boolean;
};

// --- REVENUE SHARE ENGINE TYPES ---

export type CommissionRule = {
  id: string;
  serviceType: BillingServiceType;
  commissionRatePercent: number; // e.g., 5 for 5%
  effectiveFrom: string;
  effectiveTo?: string;
  isActive: boolean;
  createdBy: string;
  createdAt: string;
};

export type RevenueShareConfig = {
  id: string;
  scopeType: 'global' | 'entity' | 'serviceType';
  entityId?: string | null;
  serviceType?: BillingServiceType | null;
  agencySharePercent: number;
  aerodeskSharePercent: number;
  effectiveFrom: string;
  effectiveTo?: string;
  isActive: boolean;
  createdBy: string;
  createdAt: string;
};

export type CommissionLedgerEntry = {
  id: string;
  transactionId: string;
  entityId: string;
  agencyId?: string | null;
  bookingChannel: BookingChannel;
  entityType: UserRole;
  serviceType: BillingServiceType;
  grossAmount: number;
  commissionRatePercent: number;
  totalCommission: number;
  agencySharePercent: number;
  aerodeskSharePercent: number;
  agencyCommissionAmount: number;
  aerodeskCommissionAmount: number;
  status: 'pending' | 'settled' | 'adjusted';
  ruleVersionReference: string;
  createdAt: string;
};

export type SettlementRecord = {
  id: string;
  entityId: string;
  entityName?: string;
  settlementPeriodStart: string;
  settlementPeriodEnd: string;
  totalAgencyCommission: number;
  status: 'pending' | 'processed' | 'paid';
  processedAt?: string;
  paymentReference?: string;
  createdAt: string;
};

export type RevenueAuditLog = {
  id: string;
  actionType: string;
  performedBy: string;
  previousValue?: any;
  newValue?: any;
  timestamp: string;
};

// --- TAX & GST COMPLIANCE ---

export type TaxConfig = {
  id: string;
  serviceType: BillingServiceType;
  taxRatePercent: number;
  sacCode: string;
  effectiveFrom: string;
  effectiveTo?: string;
  isActive: boolean;
};

export type GSTAuditLog = {
  id: string;
  entityId: string;
  entityType: string;
  oldGstin?: string;
  newGstin: string;
  changedBy: string;
  timestamp: string;
};

export type CreditNote = {
  id: string;
  originalInvoiceId: string;
  transactionId: string;
  adjustedTaxAmount: number;
  adjustedCommission: number;
  reason: string;
  createdAt: string;
};

export type CorporateTravelDesk = {
  id: string;
  companyName: string;
  adminExternalAuthId: string;
  status: 'Active' | 'Inactive' | 'Pending Setup';
  createdAt: string;
  updatedAt: string;
  financeEmail?: string;
} & Partial<GSTProfile>;
