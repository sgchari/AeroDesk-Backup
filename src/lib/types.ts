
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
  gstVerificationStatus?: 'pending' | 'verified' | 'rejected';
  gstin?: string;
  stateCode?: string;
  legalEntityName?: string;
  gstRegisteredAddress?: string;
  createdAt: string;
  updatedAt: string;
};

export type RfqStatus = string;
export type TripType = 'Onward' | 'Return' | 'Multi-City';

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
  returnDate?: string;
  returnTime?: string;
  pax: number;
  aircraftType: string;
  status: RfqStatus;
  createdAt: string;
  updatedAt: string;
  totalAmount?: number;
  costCenter?: string;
  businessPurpose?: string;
  catering?: string;
  specialRequirements?: string;
  hotelRequired?: boolean;
  hotelPreferences?: string;
};

export type AircraftStatus = 'Available' | 'Under Maintenance' | 'AOG' | 'Restricted';

export type Aircraft = {
    id: string;
    operatorId: string;
    name: string;
    type: 'Light Jet' | 'Mid-size Jet' | 'Heavy Jet' | 'Turboprop';
    registration: string;
    paxCapacity: number;
    homeBase: string;
    status: AircraftStatus;
    exteriorImageUrl?: string;
    interiorImageUrl?: string;
    createdAt?: string;
    updatedAt?: string;
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
    totalCapacity?: number;
    availableSeats: number;
    seatAllocationEnabled?: boolean;
    pricingModel?: 'fixed' | 'tiered';
    pricePerSeat?: number;
    minSeatsPerRequest?: number;
    bookingChannelAllowed?: 'agency' | 'direct' | 'both';
    status: string;
    createdAt: string;
    updatedAt?: string;
};

export type SeatAllocationStatus = 'pendingApproval' | 'approved' | 'paymentPending' | 'confirmed' | 'rejected' | 'cancelled';
export type BookingChannel = 'agency' | 'direct' | 'corporate';
export type PricingModel = 'fixed' | 'tiered';

export type SeatAllocation = {
    id: string;
    flightId: string;
    operatorId: string;
    customerId: string;
    customerName: string;
    agencyId?: string | null;
    bookingChannel: BookingChannel;
    seatsRequested: number;
    pricePerSeat?: number;
    totalAmount: number;
    status: SeatAllocationStatus;
    paymentStatus: 'pending' | 'paid' | 'failed';
    passengerName?: string;
    clientReference?: string;
    passengerNotes?: string;
    passengers?: any[];
    createdAt: string;
    updatedAt?: string;
};

export type SeatInventoryLog = {
    id: string;
    flightId: string;
    seatsBefore: number;
    seatsAfter: number;
    actionType: 'hold' | 'confirm' | 'release' | 'cancel';
    changedBy: string;
    timestamp: string;
};

export type Quotation = {
    id: string;
    rfqId: string;
    operatorId: string;
    operatorName: string;
    aircraftId: string;
    aircraftName: string;
    price: number;
    status: 'Draft' | 'Submitted' | 'Accepted' | 'Rejected' | 'Expired';
    submittedAt: string;
    validUntil: string;
    operatorRemarks?: string;
};

export type AuditLog = {
    id: string;
    actionType: string;
    entityType: string;
    entityId: string;
    changedBy: string;
    timestamp: string;
    user: string;
    role: string;
    action: string;
    details: string;
    targetId: string;
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

export type CorporateTravelDesk = {
    id: string;
    companyName: string;
    officialEmail: string;
    address: string;
    adminUserId: string;
    status: 'Active' | 'Pending Setup' | 'Suspended';
    gstin: string;
    stateCode: string;
    legalEntityName: string;
    createdAt: string;
    updatedAt: string;
};

export type HotelPartner = {
    id: string;
    companyName: string;
    officialEmail: string;
    address: string;
    status: 'Pending Approval' | 'Approved' | 'Suspended';
    gstin: string;
    stateCode: string;
    legalEntityName: string;
    createdAt: string;
    updatedAt: string;
};

export type TravelAgency = {
    id: string;
    companyName: string;
    officialEmail: string;
    address: string;
    contactNumber: string;
    adminUserId: string;
    gstin: string;
    stateCode: string;
    legalEntityName: string;
    createdAt: string;
    updatedAt: string;
};

export type Property = {
    id: string;
    hotelPartnerId: string;
    name: string;
    city: string;
    address: string;
    status: 'Active' | 'Inactive';
    imageUrl?: string;
    propertyType?: string;
};

export type RoomCategory = {
    id: string;
    propertyId: string;
    name: string;
    maxOccupancy: number;
    nightlyRate: number;
    beddingType: string;
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

export type CrewRole = 'Captain' | 'First Officer' | 'Cabin Crew' | 'Maintenance' | 'Operations';
export type CrewStatus = 'Available' | 'On Duty' | 'Training' | 'Medical Leave' | 'Off Duty';

export type CrewMember = {
    id: string;
    operatorId: string;
    firstName: string;
    lastName: string;
    email: string;
    role: CrewRole;
    licenseNumber: string;
    status: CrewStatus;
    assignedAircraftRegistration?: string;
    createdAt: string;
    updatedAt: string;
};

export type Passenger = {
    fullName: string;
    dob: string;
    gender: string;
    nationality: string;
    idType: string;
    idNumber: string;
};

export type PassengerManifest = {
    id: string;
    charterId: string;
    submittedBy: string;
    passengers: Passenger[];
    status: 'draft' | 'submitted' | 'approved' | 'revisionRequested';
    createdAt: string;
    updatedAt: string;
};

export type Invoice = {
    id: string;
    charterId: string;
    relatedEntityId?: string;
    operatorId: string;
    invoiceNumber: string;
    totalAmount: number;
    status: 'issued' | 'paid' | 'overdue' | 'cancelled';
    bankDetails: string;
    createdAt: string;
    dueDate: string;
};

export type Payment = {
    id: string;
    charterId: string;
    relatedEntityId?: string;
    invoiceId: string;
    submittedBy: string;
    utrReference: string;
    status: 'submitted' | 'verified' | 'rejected';
    createdAt: string;
    verifiedAt?: string | null;
};

export type ActivityLog = {
    id: string;
    charterId?: string;
    entityId?: string;
    actionType: string;
    performedBy: string;
    role: string;
    previousStatus: string;
    newStatus: string;
    timestamp: string;
    metadata?: any;
};

export type PlatformChargeRule = {
    id: string;
    entityType: string;
    serviceType: string;
    chargeType: 'percentage' | 'fixed' | 'hybrid';
    percentageRate: number;
    fixedAmount: number;
    isActive: boolean;
    effectiveFrom: string;
};

export type EntityBillingLedger = {
    id: string;
    relatedTransactionId: string;
    serviceType: string;
    grossAmount: number;
    platformChargeAmount: number;
    ledgerStatus: 'pending' | 'paid' | 'disputed';
};

export type PlatformInvoice = {
    id: string;
    entityName: string;
    entityType: string;
    totalAmount: number;
    dueDate: string;
    status: 'issued' | 'paid' | 'overdue';
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
    scopeType: 'global' | 'entity' | 'serviceType';
    serviceType?: string;
    agencySharePercent: number;
    aerodeskSharePercent: number;
    isActive: boolean;
    effectiveFrom: string;
};

export type CommissionLedgerEntry = {
    id: string;
    transactionId: string;
    bookingChannel: 'agency' | 'direct' | 'corporate';
    grossAmount: number;
    totalCommission: number;
    agencyCommissionAmount: number;
    aerodeskCommissionAmount: number;
    agencySharePercent: number;
    status: 'pending' | 'settled' | 'disputed';
    serviceType: string;
    createdAt: string;
    entityId?: string;
};

export type SettlementRecord = {
    id: string;
    entityName: string;
    entityId?: string;
    settlementPeriodStart: string;
    settlementPeriodEnd: string;
    totalAgencyCommission: number;
    status: 'processed' | 'paid';
    paymentReference?: string;
    createdAt?: string;
};

export type TaxConfig = {
    id: string;
    serviceType: string;
    taxRatePercent: number;
    sacCode: string;
    effectiveFrom: string;
    isActive: boolean;
};

export type OperatorStatus = 'Pending Approval' | 'Approved' | 'Suspended' | 'Rejected';

export type EmptyLegSeatAllocationRequest = {
    id: string;
    emptyLegId: string;
    requesterId: string;
    requesterExternalAuthId: string;
    passengerName?: string;
    clientReference?: string;
    numberOfSeats: number;
    passengerNotes?: string;
    status: 'Requested' | 'Approved' | 'Rejected' | 'seatPaymentSubmitted' | string;
    requestDateTime: string;
    totalAmount?: number;
};

export type Commission = {
    id: string;
    relatedEntityId: string;
    commissionAmount: number;
    commissionRate: number;
    status: 'accrued' | 'settled';
};
