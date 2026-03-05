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

export type User = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  platformRole: PlatformRole;
  firmRole: FirmRole;
  status: 'active' | 'inactive';
  demoMode?: boolean;
  allowedRoles?: string[];
  phoneNumber?: string;
  address?: string;
  avatar?: string;
  operatorId?: string | null;
  agencyId?: string | null;
  corporateId?: string | null;
  hotelPartnerId?: string | null;
  company?: string;
  gstVerificationStatus?: 'pending' | 'verified' | 'rejected';
  gstin?: string;
  stateCode?: string;
  legalEntityName?: string;
  gstRegisteredAddress?: string;
  createdAt: string;
  updatedAt: string;
};

export type CharterRFQ = {
  id: string;
  customerId: string;
  requesterExternalAuthId: string;
  operatorId?: string;
  agencyId?: string;
  corporateId?: string;
  customerName: string;
  company?: string;
  departure: string;
  arrival: string;
  departureDate: string;
  departureTime: string;
  pax: number;
  aircraftType: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  totalAmount?: number;
  costCenter?: string;
};

export type Operator = {
  id: string;
  companyName: string;
  nsopLicenseNumber: string;
  officialEmail?: string;
  registeredAddress?: string;
  contactNumber?: string;
  profileStatus?: 'active' | 'pendingReview' | 'suspended';
  adminUserId?: string;
  status: 'Pending Approval' | 'Approved' | 'Suspended' | 'Rejected';
  gstin?: string;
  stateCode?: string;
  legalEntityName?: string;
  city?: string;
  zone?: 'North' | 'South' | 'East' | 'West' | 'Central';
  fleetCount?: number;
  createdAt: string;
  updatedAt: string;
};

export type TravelAgency = {
    id: string;
    companyName: string;
    status: 'Active' | 'Inactive';
    createdAt: string;
    updatedAt: string;
};

export type HotelPartner = {
    id: string;
    companyName: string;
    status: 'Active' | 'Inactive';
    createdAt: string;
    updatedAt: string;
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
    createdAt?: string;
};

export type EmptyLeg = {
    id: string;
    operatorId: string;
    operatorName?: string;
    aircraftId: string;
    departure: string;
    arrival: string;
    departureTime: string;
    availableSeats: number;
    status: string;
    createdAt: string;
    pricePerSeat?: number;
    totalCapacity?: number;
    minSeatsPerRequest?: number;
    bookingChannelAllowed?: string;
    pricingModel?: string;
    aircraftType?: string;
    estimatedPricePerSeat?: number;
};

export type SeatAllocation = {
    id: string;
    flightId: string;
    operatorId: string;
    customerId: string;
    customerName: string;
    seatsRequested: number;
    status: string;
    createdAt: string;
    totalAmount: number;
    bookingChannel: string;
    clientReference?: string;
};

export type EmptyLegSeatAllocationRequest = {
    id: string;
    emptyLegId: string;
    passengerName?: string;
    numberOfSeats: number;
    status: string;
    passengerNotes?: string;
    clientReference?: string;
};

export type SystemAlertSeverity = 'low' | 'medium' | 'high';
export type SystemAlertType = 'system' | 'operational' | 'security';

export type SystemAlert = {
    id: string;
    type: SystemAlertType;
    message: string;
    severity: SystemAlertSeverity;
    timestamp: string;
    status: 'active' | 'resolved';
};

export type SystemLog = {
    id: string;
    event: string;
    userId: string;
    module: string;
    action: string;
    timestamp: string;
};

export type ServiceStatusState = 'Healthy' | 'Warning' | 'Critical';

export type ServiceHealth = {
    name: string;
    status: ServiceStatusState;
    lastChecked: string;
    latency?: string;
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

export type CorporateTravelDesk = {
    id: string;
    companyName: string;
    status: 'Active' | 'Pending Setup' | 'Suspended';
    adminExternalAuthId: string;
    createdAt: string;
    updatedAt?: string;
};

export type Property = {
    id: string;
    hotelPartnerId: string;
    name: string;
    city: string;
    status: 'Active' | 'Inactive';
    imageUrl?: string;
    propertyType?: string;
};

export type RoomCategory = {
    id: string;
    propertyId: string;
    name: string;
    nightlyRate: number;
    description?: string;
    imageUrl?: string;
    maxOccupancy?: number;
    beddingType?: string;
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
    author: string;
    date: string;
    imageUrl: string;
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

export type CrewMember = {
    id: string;
    operatorId: string;
    firstName: string;
    lastName: string;
    role: string;
    licenseNumber: string;
    status: CrewStatus;
    assignedAircraftRegistration?: string;
};

export type CrewStatus = 'Available' | 'On Duty' | 'Training' | 'Medical Leave';

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
    updatedAt: string;
    submittedBy?: string;
};

export type Invoice = {
    id: string;
    charterId?: string;
    relatedEntityId?: string;
    operatorId: string;
    invoiceNumber: string;
    totalAmount: number;
    status: string;
    bankDetails: string;
    createdAt: string;
};

export type Payment = {
    id: string;
    charterId?: string;
    relatedEntityId?: string;
    invoiceId: string;
    utrReference: string;
    status: string;
    createdAt: string;
    submittedBy?: string;
    verifiedAt?: string | null;
};

export type ActivityLog = {
    id: string;
    charterId?: string;
    entityId?: string;
    actionType: string;
    performedBy: string;
    role: string;
    timestamp: string;
    previousStatus?: string;
    newStatus?: string;
    metadata?: any;
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

export type EntityBillingLedger = {
    id: string;
    relatedTransactionId: string;
    grossAmount: number;
    platformChargeAmount: number;
    ledgerStatus: string;
    serviceType: string;
};

export type PlatformInvoice = {
    id: string;
    entityName: string;
    totalAmount: number;
    status: string;
    dueDate: string;
    entityType?: string;
};

export type CommissionRule = {
    id: string;
    serviceType: string;
    commissionRatePercent: number;
    isActive: boolean;
    effectiveFrom: string;
};

export type RevenueShareConfig = {
    id: string;
    scopeType: string;
    agencySharePercent: number;
    aerodeskSharePercent: number;
    isActive: boolean;
    serviceType?: string;
};

export type CommissionLedgerEntry = {
    id: string;
    transactionId: string;
    bookingChannel: string;
    grossAmount: number;
    agencyCommissionAmount: number;
    aerodeskCommissionAmount: number;
    status: string;
    serviceType: string;
    agencySharePercent: number;
    createdAt: string;
    entityId?: string;
    totalCommission?: number;
};

export type SettlementRecord = {
    id: string;
    entityName: string;
    totalAgencyCommission: number;
    status: string;
    settlementPeriodStart: string;
    settlementPeriodEnd: string;
    paymentReference?: string;
    entityId?: string;
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

export type Commission = {
    id: string;
    relatedEntityId: string;
    commissionAmount: number;
    commissionRate: number;
    status: string;
};
