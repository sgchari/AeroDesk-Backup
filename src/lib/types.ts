export type PlatformRole = 'admin' | 'operator' | 'agency' | 'corporate' | 'individual' | 'hotel';
export type FirmRole = 'admin' | 'manager' | 'finance' | 'operations' | 'approver' | 'viewer';

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
  businessPurpose?: string;
  hotelRequired?: boolean;
  hotelPreferences?: string;
  autopilotRecommendation?: AutopilotMatch | null;
};

export type AutopilotMatch = {
    aircraftType: string;
    operatorName: string;
    estimatedPrice: number;
    duration: string;
    confidenceScore: number;
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
    hourlyRate?: number;
    createdAt?: string;
};

export type EmptyLeg = {
    id: string;
    operatorId: string;
    operatorName?: string;
    aircraftId: string;
    aircraftName?: string;
    aircraftType?: string;
    departure: string;
    arrival: string;
    departureTime: string;
    totalCapacity: number;
    availableSeats: number;
    basePricePerSeat: number;
    status: string;
    createdAt: string;
    pricingModel: 'Fixed' | 'Dynamic';
    seatPricingStrategy?: PricingTier[];
};

export type PricingTier = {
    seatRange: string;
    price: number;
};

export type SeatAllocation = {
    id: string;
    flightId: string;
    operatorId: string;
    customerId: string;
    customerName: string;
    seatsRequested: number;
    totalAmount: number;
    bookingChannel: 'direct' | 'agency' | 'corporate';
    status: 'pending' | 'confirmed' | 'cancelled' | 'payment_pending';
    createdAt: string;
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

export type AccommodationRequest = {
    id: string;
    hotelPartnerId: string;
    propertyName: string;
    guestName: string;
    checkIn: string;
    checkOut: string;
    rooms: number;
    status: 'Pending' | 'Confirmed' | 'Declined' | 'Awaiting Clarification';
    requesterId: string;
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

export type SystemAlert = {
    id: string;
    type: 'system' | 'operational' | 'security';
    message: string;
    severity: 'low' | 'medium' | 'high';
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

export type ServiceHealth = {
    name: string;
    status: 'Healthy' | 'Warning' | 'Critical';
    lastChecked: string;
    latency: string;
};

export type PassengerManifest = {
    id: string;
    charterId: string;
    status: string;
    passengers: Passenger[];
    createdAt: string;
    updatedAt: string;
};

export type Passenger = {
    fullName: string;
    nationality: string;
    idNumber: string;
    idType: string;
    dob?: string;
    gender?: string;
};

export type Invoice = {
    id: string;
    relatedEntityId: string;
    operatorId: string;
    invoiceNumber: string;
    totalAmount: number;
    status: string;
    bankDetails: string;
    createdAt: string;
};

export type Payment = {
    id: string;
    relatedEntityId: string;
    invoiceId: string;
    utrReference: string;
    status: string;
    createdAt: string;
};

export type ActivityLog = {
    id: string;
    entityId: string;
    actionType: string;
    performedBy: string;
    role: string;
    timestamp: string;
};

export type Commission = {
    id: string;
    relatedEntityId: string;
    commissionAmount: number;
    commissionRate: number;
    status: string;
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
    serviceType: string;
    grossAmount: number;
    platformChargeAmount: number;
    ledgerStatus: string;
};

export type PlatformInvoice = {
    id: string;
    entityName: string;
    totalAmount: number;
    dueDate: string;
    status: string;
    entityType?: string;
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
    serviceType?: string;
    agencySharePercent: number;
    aerodeskSharePercent: number;
    isActive: boolean;
};

export type CommissionLedgerEntry = {
    id: string;
    transactionId: string;
    entityId: string;
    serviceType: string;
    bookingChannel: string;
    grossAmount: number;
    agencyCommissionAmount: number;
    aerodeskCommissionAmount: number;
    totalCommission: number;
    agencySharePercent: number;
    status: string;
    createdAt: string;
};

export type SettlementRecord = {
    id: string;
    entityId: string;
    entityName: string;
    totalAgencyCommission: number;
    settlementPeriodStart: string;
    settlementPeriodEnd: string;
    status: string;
    createdAt: string;
    paymentReference?: string;
};

export type TaxConfig = {
    id: string;
    serviceType: string;
    taxRatePercent: number;
    sacCode: string;
    effectiveFrom: string;
    isActive: boolean;
};