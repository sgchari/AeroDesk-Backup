export type PlatformRole = 'admin' | 'operator' | 'agency' | 'corporate' | 'individual' | 'hotel';
export type FirmRole = 'admin' | 'manager' | 'finance' | 'operations' | 'approver' | 'viewer' | 'EMPLOYEE' | 'MANAGER' | 'COST_CENTER_OWNER' | 'FINANCE' | 'TRAVEL_DESK_ADMIN';

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
  organizationType?: 'operator' | 'agency' | 'corporate' | 'hotel';
};

// --- CORPORATE AVIATION MANAGEMENT SYSTEM TYPES ---

export type CorporateOrganization = {
  id: string;
  corporateId: string;
  companyName: string;
  industry: string;
  annualAviationBudget: number;
  usedBudget: number;
  createdAt: string;
};

export type CorporateUser = {
  id: string;
  userId: string;
  corporateId: string;
  name: string;
  role: 'EMPLOYEE' | 'MANAGER' | 'COST_CENTER_OWNER' | 'FINANCE' | 'TRAVEL_DESK_ADMIN';
  department: string;
  costCenterId: string;
  email: string;
};

export type CostCenter = {
  id: string;
  costCenterId: string;
  corporateId: string;
  departmentName: string;
  allocatedBudget: number;
  usedBudget: number;
};

export type TravelType = 'CHARTER' | 'JET_SEATS';

export type RequestStatus = 
  | 'REQUEST_CREATED'
  | 'MANAGER_APPROVED'
  | 'COST_CENTER_APPROVED'
  | 'FINANCE_APPROVED'
  | 'TRAVEL_DESK_PROCESSING'
  | 'RFQ_SUBMITTED'
  | 'QUOTE_RECEIVED'
  | 'PAYMENT_APPROVED'
  | 'BOOKING_CONFIRMED'
  | 'TRIP_IN_PROGRESS'
  | 'TRIP_COMPLETED'
  | 'REJECTED';

export type EmployeeTravelRequest = {
  id: string;
  requestId: string;
  employeeId: string;
  employeeName: string;
  corporateId: string;
  travelType: TravelType;
  origin: string;
  destination: string;
  travelDate: string;
  passengerCount: number;
  purposeOfTravel: string;
  costCenterId: string;
  requestStatus: RequestStatus;
  estimatedBudget?: number;
  createdAt: string;
};

export type ApprovalStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export type TravelApproval = {
  id: string;
  approvalId: string;
  requestId: string;
  approverRole: 'MANAGER' | 'COST_CENTER_OWNER' | 'FINANCE';
  approverUserId: string;
  approvalStatus: ApprovalStatus;
  comments?: string;
  createdAt: string;
};

export type CorporatePassengerManifest = {
  id: string;
  manifestId: string;
  requestId: string;
  passengers: Array<{
    name: string;
    idType: string;
    idNumber: string;
  }>;
};

export type CorporatePaymentStatus = 'PENDING' | 'SUBMITTED' | 'VERIFIED' | 'REJECTED';

export type CorporatePayment = {
  id: string;
  paymentId: string;
  corporateRequestId: string;
  paymentReference: string;
  paymentMethod: 'NEFT' | 'IMPS' | 'Bank Transfer';
  paymentStatus: CorporatePaymentStatus;
  amount: number;
  createdAt: string;
};

export type CorporateTravelPolicy = {
  id: string;
  policyId: string;
  corporateId: string;
  rule: string;
  thresholdAmount?: number;
  requiresFinanceApproval: boolean;
};

// --- END CORPORATE AVIATION MANAGEMENT SYSTEM TYPES ---

export type OrganizationUser = {
  id: string;
  userId: string;
  organizationId: string;
  organizationType: 'operator' | 'agency' | 'corporate' | 'hotel';
  role: string;
  name: string;
  email: string;
  phone: string;
  status: 'ACTIVE' | 'INACTIVE';
  createdAt: string;
};

// --- SEAT ALLOCATION WORKFLOW TYPES ---

export type SeatRequestStatus = 
  | 'REQUEST_SUBMITTED'
  | 'PENDING_OPERATOR_APPROVAL'
  | 'APPROVED'
  | 'WAITING_PAYMENT'
  | 'PAYMENT_SUBMITTED'
  | 'PAYMENT_CONFIRMED'
  | 'CONFIRMED'
  | 'REJECTED'
  | 'COMPLETED';

export type SeatAllocationRequest = {
  id: string;
  requestId: string;
  reservationId?: string;
  flightId: string;
  operatorId: string;
  requesterId: string;
  requesterName: string;
  requesterType: 'travelAgency' | 'corporate' | 'individual';
  origin: string;
  destination: string;
  seatsRequested: number;
  passengers: Passenger[];
  requestStatus: SeatRequestStatus;
  rejectionReason?: 'SOLD_OUT' | 'AIRCRAFT_AOG' | 'MISSION_NOT_AVAILABLE' | 'OPERATIONAL_CONSTRAINTS';
  createdAt: string;
  updatedAt: string;
  totalAmount?: number;
};

export type SeatReservation = {
  id: string;
  reservationId: string;
  flightId: string;
  userId: string;
  seatsReserved: number;
  reservationStatus: 'ACTIVE' | 'EXPIRED' | 'CONFIRMED';
  lockExpiresAt: string;
};

export type SeatInvoice = {
  id: string;
  invoiceId: string;
  requestId: string;
  operatorId: string;
  seatsBooked: number;
  seatPrice: number;
  totalAmount: number;
  currency: 'INR';
  invoiceStatus: 'ISSUED' | 'PAID' | 'CANCELLED';
  paymentMode: 'OFFLINE_TRANSFER';
  createdAt: string;
};

export type OperatorPaymentDetails = {
  id: string;
  operatorId: string;
  bankName: string;
  accountName: string;
  accountNumber: string;
  ifscCode: string;
  paymentModes: string[];
};

export type SeatPayment = {
  id: string;
  paymentId: string;
  invoiceId: string;
  requestId: string;
  paymentMethod: string;
  paymentReference: string;
  paymentProofUrl?: string;
  paymentStatus: 'PENDING_VERIFICATION' | 'VERIFIED' | 'REJECTED';
  submittedAt: string;
  createdAt: string;
};

export type FlightPassengerManifest = {
  id: string;
  flightId: string;
  passengers: Array<{
    name: string;
    seatNumber?: string;
    requestId: string;
  }>;
  lastUpdated: string;
};

export type DashboardNotification = {
  id: string;
  notificationId: string;
  userId: string;
  type: 'SEAT_REQUEST_SUBMITTED' | 'SEAT_REQUEST_APPROVED' | 'SEAT_REQUEST_REJECTED' | 'INVOICE_ISSUED' | 'PAYMENT_SUBMITTED' | 'SEAT_CONFIRMED';
  message: string;
  read: boolean;
  createdAt: string;
};

// --- END SEAT ALLOCATION WORKFLOW TYPES ---

export type FleetUtilization = {
  id: string;
  operatorId: string;
  aircraftId: string;
  aircraftType: string;
  registration: string;
  flightsLast30Days: number;
  totalFlightHours: number;
  utilizationPercentage: number;
  idleHours: number;
  lastUpdated: string;
};

export type CharterDemandAnalytics = {
  id: string;
  route: string;
  origin: string;
  destination: string;
  totalRequestsLast30Days: number;
  confirmedCharters: number;
  demandScore: number;
};

export type EmptyLegOpportunity = {
  id: string;
  aircraftId: string;
  registration: string;
  currentCity: string;
  recommendedRoute: string;
  demandScore: number;
  potentialSeatRevenue: number;
  seatsAvailable: number;
};

export type AircraftPositioningInsight = {
  id: string;
  operatorId: string;
  aircraftId: string;
  registration: string;
  aircraftType: string;
  recommendedBase: string;
  reason: string;
  demandScore: number;
};

export type CharterPriceBenchmark = {
  id: string;
  route: string;
  aircraftCategory: string;
  avgPrice: number;
  minPrice: number;
  maxPrice: number;
};

export type RevenueForecast = {
  id: string;
  operatorId: string;
  route: string;
  projectedDemandNext7Days: number;
  estimatedRevenueOpportunity: number;
};

export type CrewMember = {
  id: string;
  crewId: string;
  operatorId: string;
  name: string;
  designation: 'Pilot' | 'Co-Pilot' | 'Cabin Crew' | 'Ground Support' | string;
  licenseNumber: string;
  phone: string;
  email: string;
  status: 'ACTIVE' | 'ON_DUTY' | 'OFF_DUTY' | 'LEAVE' | 'AVAILABLE';
  assignedAircraftRegistration?: string;
  role?: string;
};

export type CrewAssignment = {
  id: string;
  assignmentId: string;
  charterRequestId: string;
  aircraftId: string;
  crewMembers: string[]; // Array of crewIds
  status: 'ASSIGNED' | 'CONFIRMED' | 'COMPLETED';
};

export type CrewLogistics = {
  id: string;
  logisticsId: string;
  crewId: string;
  tripId: string;
  hotelRequired: boolean;
  hotelBookingStatus: 'NOT_REQUIRED' | 'PENDING' | 'CONFIRMED' | 'ARRANGED';
  transportRequired: boolean;
  transportStatus: 'NOT_REQUIRED' | 'PENDING' | 'CONFIRMED' | 'ARRANGED';
};

export type RfqStatus = 
    | 'Draft' 
    | 'New' 
    | 'Submitted' 
    | 'Pending Approval' 
    | 'Bidding Open' 
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
    | 'SCHEDULED';

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
  status: RfqStatus | string;
  createdAt: string;
  updatedAt: string;
  totalAmount?: number;
  bidsCount?: number;
  costCenter?: string;
  businessPurpose?: string;
  hotelRequired?: boolean;
  hotelPreferences?: string;
  autopilotRecommendation?: AutopilotMatch | null;
  catering?: string;
  specialRequirements?: string;
  pricePrediction?: CharterPricePrediction;
  aircraftId?: string;
  corporateRequestId?: string;
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
  officailEmail?: string;
  contactPersonName?: string;
  fleetSize?: number;
};

export type AircraftStatus = 'Available' | 'Under Maintenance' | 'AOG' | 'Restricted' | 'AVAILABLE' | 'IN_CHARTER' | 'MAINTENANCE' | 'MAINTENANCE_DUE';

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
    hourlyRate?: number;
    createdAt?: string;
    updatedAt?: string;
    location?: string;
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
    pricePerSeat?: number;
    estimatedPricePerSeat?: number;
    status: string;
    createdAt: string;
    updatedAt?: string;
    pricingModel: 'Fixed' | 'Dynamic';
    seatPricingStrategy?: PricingTier[] | null;
    seatAllocationEnabled?: boolean;
    minSeatsPerRequest?: number;
    bookingChannelAllowed?: 'agency' | 'direct' | 'both';
};

export type PricingTier = {
    seatRange: string;
    price: number;
};

export type SeatAllocationStatus = 'pendingApproval' | 'approved' | 'rejected' | 'paymentPending' | 'confirmed' | 'cancelled';

export type SeatAllocation = {
    id: string;
    flightId: string;
    operatorId: string;
    customerId: string;
    customerName: string;
    agencyId?: string | null;
    bookingChannel: 'direct' | 'agency' | 'corporate';
    seatsRequested: number;
    pricePerSeat: number;
    totalAmount: number;
    status: SeatAllocationStatus | string;
    paymentStatus: 'pending' | 'paid' | 'failed';
    clientReference?: string;
    passengerNotes?: string;
    passengers: Passenger[];
    createdAt: string;
    updatedAt?: string;
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
    type: 'system' | 'operational' | 'security' | 'maintenance' | 'crew' | 'charter';
    message: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
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
    submittedBy?: string;
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
    verifiedAt?: string | null;
};

export type ActivityLog = {
    id: string;
    entityId?: string;
    charterId?: string;
    actionType: string;
    performedBy: string;
    role: string;
    timestamp: string;
    previousStatus?: string;
    newStatus?: string;
    metadata?: any;
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

export type AircraftPosition = {
    id: string;
    registration: string;
    aircraftType: string;
    operator: string;
    latitude: number;
    longitude: number;
    altitude: number;
    velocity: number;
    heading: number;
    timestamp: string;
    status: 'available' | 'scheduled' | 'inflight';
    originAirport?: string;
    destinationAirport?: string;
};

export type AircraftAvailability = {
    id: string;
    registration: string;
    aircraftType: string;
    operator: string;
    currentAirport: string;
    availableFrom: string;
    availabilityWindow: "3hours" | "6hours" | "12hours";
    seats: number;
    rangeKm?: number;
};

export type CharterDemandForecast = {
    id: string;
    origin: string;
    destination: string;
    routeCode: string;
    predictedDemandScore: number;
    timeframe: "24hours" | "3days" | "7days" | "30days";
    aircraftTypeDemand: string[];
    forecastWindow?: string;
};

export type FlightSegment = {
    id: string;
    aircraftRegistration: string;
    aircraftType: string;
    operator: string;
    originAirport: string;
    destinationAirport: string;
    departureTime: string;
    arrivalTime: string;
    flightDurationMinutes: number;
};

export type RouteDemandHistory = {
    id: string;
    route: string;
    origin: string;
    destination: string;
    monthlyFlightCount: number;
    demandScore: number;
    routeFrequency?: number;
    weeklyDemandTrend?: 'up' | 'down' | 'stable';
};

export type EmptyLegPrediction = {
    id: string;
    aircraft: string;
    predictedRoute: string;
    probability: number;
    timeframe: string;
    reason: string;
};

export type FleetOptimizationSuggestion = {
    id: string;
    operator: string;
    aircraft: string;
    recommendation: string;
    reason: string;
    expectedYieldIncrease: number;
};

export type CharterPricePrediction = {
    route: string;
    aircraftType: string;
    predictedPriceMin: number;
    predictedPriceMax: number;
    confidenceScore: number;
};

export type AviationHub = {
  id: string;
  icao: string;
  airportName: string;
  city: string;
  latitude: number;
  longitude: number;
  operatorCount?: number;
  fleetSize?: number;
};

export type EmptyLegSeatListing = {
    id: string;
    flightId: string;
    aircraft: string;
    origin: string;
    destination: string;
    departureTime: string;
    seatCapacity: number;
    seatsRemaining: number;
    seatPrice: number;
    operatorId: string;
    status: 'ACTIVE' | 'CLOSED' | 'CANCELLED';
};

export type OperationalActivity = {
    id: string;
    type: 'rfq_created' | 'quote_accepted' | 'empty_leg_published' | 'seat_booked';
    message: string;
    timestamp: string;
    entityId: string;
    actor: string;
};

export type AICharterInsight = {
    id: string;
    route: string;
    aircraftRecommendation: string;
    estimatedPriceMin: number;
    estimatedPriceMax: number;
    demandScore: number;
    recommendation: string;
};

export type TripCommand = {
    id: string;
    customerId: string;
    origin: string;
    destination: string;
    aircraft: string;
    passengers: number;
    charterBookingId?: string;
    hotelBookingId?: string;
    transportBookingId?: string;
    status: 'CONFIRMED' | 'ONGOING' | 'COMPLETED' | 'CANCELLED';
    departureTime: string;
};

export type CharterPriceIndex = {
    id: string;
    route: string;
    aircraftCategory: string;
    averagePrice: number;
    priceChangePercent: number;
    demandIndex: number;
    lastUpdated: string;
};

export type Quotation = {
  id: string;
  rfqId: string;
  operatorId: string;
  operatorName: string;
  aircraftId: string;
  aircraftName: string;
  price: number;
  status: string;
  submittedAt: string;
  validUntil: string;
  operatorRemarks?: string;
};

export type AircraftMaintenance = {
  id: string;
  aircraftId: string;
  operatorId: string;
  lastMaintenanceDate: string;
  maintenanceType: 'A-Check' | 'Inspection' | 'Component Replacement' | 'Service Bulletin';
  nextMaintenanceDueHours: number;
  status: 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED';
};

export type MaintenanceSchedule = {
  id: string;
  maintenanceId: string;
  aircraftId: string;
  maintenanceType: string;
  scheduledDate: string;
  maintenanceFacility: string;
  status: 'SCHEDULED' | 'COMPLETED' | 'CANCELLED';
};

export type DefectReport = {
  id: string;
  aircraftId: string;
  reportedBy: string;
  issueDescription: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  status: 'OPEN' | 'IN_REPAIR' | 'RESOLVED';
  reportedAt: string;
};

export type MaintenanceWorkOrder = {
  id: string;
  aircraftId: string;
  taskDescription: string;
  engineerName: string;
  startTime: string;
  completionTime?: string;
  status: 'OPEN' | 'IN_PROGRESS' | 'COMPLETED';
};
