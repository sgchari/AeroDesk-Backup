import type { 
  User, 
  CharterRFQ, 
  EmptyLeg, 
  Aircraft, 
  AuditLog, 
  AccommodationRequest, 
  CorporateTravelDesk, 
  Property, 
  RoomCategory, 
  Operator, 
  TravelAgency,
  HotelPartner,
  FeatureFlag, 
  PolicyFlag, 
  BlogPost, 
  PressRelease, 
  MediaMention, 
  BrandAsset, 
  CrewMember, 
  PassengerManifest, 
  Invoice, 
  Payment, 
  ActivityLog, 
  PlatformChargeRule,
  EntityBillingLedger,
  PlatformInvoice,
  CommissionRule,
  RevenueShareConfig,
  CommissionLedgerEntry,
  SettlementRecord,
  TaxConfig,
  SystemAlert,
  SystemLog,
  SeatAllocation,
  AircraftPosition,
  AircraftAvailability,
  CharterDemandForecast,
  RouteDemandHistory,
  EmptyLegPrediction,
  FleetOptimizationSuggestion,
  AviationHub,
  OperationalActivity,
  AICharterInsight,
  TripCommand,
  CharterPriceIndex,
  OrganizationUser,
  CrewAssignment,
  CrewLogistics,
  Quotation,
  FleetUtilization,
  CharterDemandAnalytics,
  EmptyLegOpportunity,
  AircraftPositioningInsight,
  CharterPriceBenchmark,
  RevenueForecast,
  AircraftMaintenance,
  MaintenanceSchedule,
  DefectReport,
  MaintenanceWorkOrder,
  SeatAllocationRequest,
  SeatInvoice,
  SeatPayment,
  FlightPassengerManifest,
  SeatReservation,
  OperatorPaymentDetails,
  DashboardNotification,
  CorporateOrganization,
  CorporateUser,
  CostCenter,
  EmployeeTravelRequest,
  TravelApproval,
  CorporatePassengerManifest,
  CorporatePayment,
  CorporateTravelPolicy,
  UserActivityLog,
  AdminAuditLog
} from './types';

export const VERIFIED_NSOP_REGISTRY = [
    { companyName: 'FlyCo Charter', nsopLicenseNumber: 'NSOP/FLYCO/2021', city: 'Mumbai' },
    { companyName: 'Taj Air', nsopLicenseNumber: 'NSOP/TAJ/02', city: 'Mumbai' },
    { companyName: 'Club One Air', nsopLicenseNumber: 'NSOP/COA/05', city: 'Delhi' },
    { companyName: 'Span Air', nsopLicenseNumber: 'NSOP/SPAN/09', city: 'Delhi' },
    { companyName: 'Deccan Charters', nsopLicenseNumber: 'NSOP/DEC/11', city: 'Bengaluru' },
];

export const mockUsers: User[] = [
    { 
      id: 'demo_super_user', 
      email: 'demo@aerodesk.global', 
      password: 'password123',
      firstName: 'AeroDesk', 
      lastName: 'Super User', 
      role: 'demo_super_user', 
      platformRole: 'admin', 
      firmRole: 'admin',
      status: 'active', 
      demoMode: true,
      allowedRoles: ["customer", "operator", "agency", "corporate", "hotel", "admin"],
      avatar: 'https://picsum.photos/seed/user1/256/256',
      createdAt: "2025-01-01T10:00:00Z", 
      updatedAt: "2025-01-01T10:00:00Z" 
    }
];

export const mockCorporateOrganizations: CorporateOrganization[] = [
  { id: 'corp-01', corporateId: 'CORP102', companyName: 'ABC Corporation', industry: 'Energy', annualAviationBudget: 100000000, usedBudget: 42000000, status: 'ACTIVE', createdAt: '2025-01-01T10:00:00Z' },
  { id: 'corp-02', corporateId: 'CORP103', companyName: 'Stark Industries', industry: 'Defense', annualAviationBudget: 500000000, usedBudget: 125000000, status: 'ACTIVE', createdAt: '2025-01-05T10:00:00Z' },
];

export const mockTravelAgencies: TravelAgency[] = [
  { id: 'ag-01', companyName: 'Global Jet Distributors', gstNumber: '27AAAAA0000A1Z5', contactEmail: 'ops@globaljet.com', phone: '+91 98197 54038', address: 'Bandra, Mumbai', status: 'ACTIVE', createdAt: '2025-01-01T10:00:00Z', updatedAt: '2025-01-01T10:00:00Z' },
  { id: 'ag-02', companyName: 'Skyline Aviation Agency', gstNumber: '07BBBBB1111B2Z6', contactEmail: 'info@skyline.com', phone: '+91 11 4566 7890', address: 'Vasant Kunj, Delhi', status: 'PENDING_SETUP', createdAt: '2025-01-10T10:00:00Z', updatedAt: '2025-01-10T10:00:00Z' },
];

export const mockHotelPartners: HotelPartner[] = [
  { id: 'hp-01', companyName: 'Taj Hotels Group', hotelName: 'The Taj Mahal Palace', contactEmail: 'reservations@taj.com', status: 'ACTIVE', createdAt: '2025-01-01T10:00:00Z', updatedAt: '2025-01-01T10:00:00Z' },
  { id: 'hp-02', companyName: 'Oberoi Group', hotelName: 'The Oberoi, Delhi', contactEmail: 'bookings@oberoi.com', status: 'ACTIVE', createdAt: '2025-01-05T10:00:00Z', updatedAt: '2025-01-05T10:00:00Z' },
];

export const mockUserActivityLogs: UserActivityLog[] = [
  { id: 'log-u-01', logId: 'LOG102', userId: 'demo_super_user', userName: 'Tony Stark', action: 'Seat Request Created', entityId: 'SR102', entityType: 'SeatRequest', timestamp: new Date().toISOString() },
  { id: 'log-u-02', logId: 'LOG103', userId: 'u-corp-01', userName: 'Bruce Wayne', action: 'Charter RFQ Published', entityId: 'RFQ-CORP-001', entityType: 'CharterRFQ', timestamp: new Date().toISOString() },
];

export const mockAdminAuditLogs: AdminAuditLog[] = [
  { id: 'log-a-01', adminId: 'demo_super_user', adminName: 'Platform Admin', action: 'Operator Suspended', entityType: 'Operator', entityId: 'op-west-01', timestamp: new Date().toISOString() },
];

export const mockSystemAlerts: SystemAlert[] = [
  { id: 'alt-01', alertId: 'ALT102', type: 'PAYMENT_DISPUTE', message: 'Payment verification pending for seat booking SR102', status: 'active', severity: 'high', createdAt: new Date().toISOString() },
  { id: 'alt-02', alertId: 'ALT103', type: 'COMPLIANCE_ERROR', message: 'Operator VT-FLY NSOP license expired', status: 'active', severity: 'high', createdAt: new Date().toISOString() },
];

export const mockSystemLogs: SystemLog[] = [
  { id: 'log-sys-01', event: 'AUTH_SUCCESS', userId: 'demo_super_user', module: 'Auth', action: 'User established terminal link', timestamp: new Date().toISOString() },
  { id: 'log-sys-02', event: 'FIRESTORE_WRITE', userId: 'demo_super_user', module: 'Database', action: 'Updated mission protocol state', timestamp: new Date().toISOString() },
];

export const mockCostCenters: CostCenter[] = [
  { id: 'cc-01', costCenterId: 'CC102', corporateId: 'CORP102', departmentName: 'Sales', allocatedBudget: 20000000, usedBudget: 8000000 },
  { id: 'cc-02', costCenterId: 'CC103', corporateId: 'CORP102', departmentName: 'R&D Operations', allocatedBudget: 35000000, usedBudget: 28000000 },
];

export const mockEmployeeTravelRequests: EmployeeTravelRequest[] = [
  { id: 'etr-01', requestId: 'ETR102', employeeId: 'EMP201', employeeName: 'Rahul Mehta', corporateId: 'CORP102', travelType: 'CHARTER', origin: 'VABB', destination: 'VOGO', travelDate: '2025-03-15T10:00:00Z', passengerCount: 4, purposeOfTravel: 'Client Meeting', costCenterId: 'CC102', requestStatus: 'REQUEST_CREATED', estimatedBudget: 850000, createdAt: new Date().toISOString() },
];

export const mockTravelApprovals: TravelApproval[] = [
  { id: 'ap-01', approvalId: 'APR102', requestId: 'ETR102', approverRole: 'MANAGER', approverUserId: 'MGR301', approvalStatus: 'PENDING', createdAt: new Date().toISOString() },
];

export const mockOperators: Operator[] = [
    { id: 'op-west-01', companyName: 'FlyCo Charter', nsopLicenseNumber: 'NSOP/FLYCO/2021', officialEmail: 'ops@flyco.aero', registeredAddress: 'Hangar 1, Juhu Aerodrome, Mumbai', contactNumber: '+91 22 2822 2202', profileStatus: 'active', adminUserId: 'demo_super_user', status: 'ACTIVE', gstin: '27AAAAA0000A1Z5', stateCode: '27', legalEntityName: 'FlyCo Aviation West Pvt Ltd', city: 'Mumbai', zone: 'West', fleetCount: 12, createdAt: '2025-01-10T09:00:00Z', updatedAt: '2025-01-10T09:00:00Z' },
    { id: 'op-north-01', companyName: 'Club One Air', nsopLicenseNumber: 'NSOP/COA/05', officialEmail: 'dispatch@clubone.aero', registeredAddress: 'IGI Airport, T3, Delhi', contactNumber: '+91 11 4566 7890', profileStatus: 'active', status: 'ACTIVE', city: 'Delhi', zone: 'North', fleetCount: 8, createdAt: '2025-01-15T10:00:00Z', updatedAt: '2025-01-15T10:00:00Z' },
];

export const mockCorporates: CorporateTravelDesk[] = [
    { id: 'corp-west-01', companyName: 'Stark Industries', status: 'Active', adminExternalAuthId: 'demo_super_user', createdAt: '2025-01-01T10:00:00Z', updatedAt: '2025-01-01T10:00:00Z' },
];

export const mockAgencies: TravelAgency[] = [
    { id: 'ag-west-01', companyName: 'Sky Distributors', status: 'Active', createdAt: '2025-01-01T10:00:00Z', updatedAt: '2025-01-01T10:00:00Z' },
];

export const mockOrganizationUsers: OrganizationUser[] = [
  { id: 'org-u-01', userId: 'demo_super_user', organizationId: 'op-west-01', organizationType: 'operator', role: 'Admin', name: 'AeroDesk Admin', email: 'demo@aerodesk.global', phone: '+91 90000 00000', status: 'ACTIVE', createdAt: new Date().toISOString() },
];

export const mockAircraft: Aircraft[] = [
    { id: 'ac-01', operatorId: 'op-west-01', name: 'Cessna Citation XLS+', type: 'Light Jet', registration: 'VT-FLY', paxCapacity: 8, homeBase: 'Mumbai (VABB)', status: 'AVAILABLE', hourlyRate: 180000, exteriorImageUrl: 'https://images.unsplash.com/photo-1540962351504-03099e0a754b?q=80&w=800', location: 'Mumbai' },
    { id: 'ac-02', operatorId: 'op-west-01', name: 'Embraer Legacy 650', type: 'Heavy Jet', registration: 'VT-STK', paxCapacity: 13, homeBase: 'Mumbai (VABB)', status: 'AVAILABLE', hourlyRate: 450000, exteriorImageUrl: 'https://images.unsplash.com/photo-1569154941061-e231b4725ef1?q=80&w=1080', location: 'Delhi' },
];

export const mockRfqs: CharterRFQ[] = [
    { id: 'RFQ-CORP-001', customerId: 'u-corp-01', requesterExternalAuthId: 'u-corp-01', customerName: 'Bruce Wayne', company: 'Wayne Enterprises', tripType: 'Onward', departure: 'Mumbai (VABB)', arrival: 'Delhi (VIDP)', departureDate: '2025-03-15', departureTime: '10:00', pax: 5, aircraftType: 'Heavy Jet', status: 'Bidding Open', createdAt: '2025-02-10T10:00:00Z', updatedAt: '2025-02-10T10:00:00Z', bidsCount: 2 },
    { id: 'RFQ-LIVE-003', customerId: 'demo_super_user', requesterExternalAuthId: 'demo_super_user', customerName: 'AeroDesk User', company: 'Stark Industries', tripType: 'Onward', departure: 'Bengaluru (VOBL)', arrival: 'Mumbai (VABB)', departureDate: '2025-02-25', departureTime: '14:30', pax: 4, aircraftType: 'Light Jet', status: 'live', createdAt: '2025-02-24T10:00:00Z', updatedAt: '2025-02-24T10:00:00Z', bidsCount: 1, operatorId: 'op-west-01', aircraftId: 'ac-01' },
];

export const mockEmptyLegs: EmptyLeg[] = [
    { id: 'EL-001', operatorId: 'op-west-01', operatorName: 'FlyCo Charter', aircraftId: 'ac-01', aircraftName: 'Citation XLS+', aircraftType: 'Light Jet', departure: 'Mumbai (VABB)', arrival: 'Delhi (VIDP)', departureTime: '2025-03-10T14:00:00Z', totalCapacity: 8, availableSeats: 6, status: 'live', createdAt: '2025-02-01T10:00:00Z', pricePerSeat: 45000, seatAllocationEnabled: true, minSeatsPerRequest: 1, pricingModel: 'Fixed', bookingChannelAllowed: 'both' },
];

export const mockSeatAllocationRequests: SeatAllocationRequest[] = [
  { id: 'sr-01', requestId: 'SR102', flightId: 'EL-001', operatorId: 'op-west-01', requesterId: 'demo_super_user', requesterName: 'Tony Stark', requesterType: 'individual', origin: 'VABB', destination: 'VIDP', seatsRequested: 2, passengers: [{ fullName: 'Tony Stark', idType: 'Passport', idNumber: 'Z1234567', nationality: 'Indian' }, { fullName: 'Pepper Potts', idType: 'Passport', idNumber: 'Z7654321', nationality: 'Indian' }], requestStatus: 'PENDING_OPERATOR_APPROVAL', totalAmount: 90000, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
];

export const mockInvoices: Invoice[] = [
    { id: 'INV-001', relatedEntityId: 'RFQ-IND-002', operatorId: 'op-west-01', invoiceNumber: 'INV-FLY-2025-001', totalAmount: 850000, status: 'paid', bankDetails: 'AeroBank India • IFSC: AERO0001234 • A/C: 9988776655', createdAt: '2025-02-15T10:00:00Z' },
];

export const mockAuditLogs: AuditLog[] = [
    { id: 'audit-01', timestamp: '2025-02-10T10:00:00Z', user: 'Admin User', role: 'Platform Admin', action: 'OPERATOR_APPROVED', details: 'Approved FlyCo Charter registration', targetId: 'op-west-01' },
];

export const mockPassengerManifests: PassengerManifest[] = [
    {
        id: 'man-001',
        charterId: 'RFQ-LIVE-003',
        status: 'approved',
        passengers: [
            { fullName: 'Tony Stark', nationality: 'Indian', idType: 'Passport', idNumber: 'Z1234567' },
            { fullName: 'Pepper Potts', nationality: 'Indian', idType: 'Passport', idNumber: 'Z7654321' },
            { fullName: 'Happy Hogan', nationality: 'Indian', idType: 'Passport', idNumber: 'Z9988776' },
            { fullName: 'Peter Parker', nationality: 'Indian', idType: 'Passport', idNumber: 'Z1122334' }
        ],
        createdAt: '2025-02-24T11:00:00Z',
        updatedAt: '2025-02-24T11:30:00Z',
        submittedBy: 'Pepper Potts'
    }
];

export const mockActivityLogs: ActivityLog[] = [
    { id: 'act-001', charterId: 'RFQ-LIVE-003', actionType: 'MISSION_DISPATCHED', performedBy: 'Ops Desk', role: 'Operator', timestamp: '2025-02-25T14:30:00Z', previousStatus: 'boarding', newStatus: 'live' },
    { id: 'act-002', charterId: 'RFQ-LIVE-003', actionType: 'LIVE_SIGNAL_ACTIVE', performedBy: 'Radar Link', role: 'System', timestamp: '2025-02-25T14:35:00Z' },
];

export const mockBlogPosts: BlogPost[] = [
    { id: 'intel-001', title: "The 2025 Indian NSOP Governance Mandate", excerpt: "Analyzing the digital transformation requirements for non-scheduled operators in the upcoming fiscal year.", category: "Private Aviation", author: "AeroDesk Research", date: "2025-02-15", imageUrl: "https://images.unsplash.com/photo-1566212775038-532d06eda485?q=80&w=1080" },
];

export const mockPressReleases: PressRelease[] = [
    { id: 'pr-001', title: "AeroDesk Announces National Hub Synchronization", description: "Integration of primary metropolitan hubs into the unified coordination grid is complete.", date: "2025-02-20", category: "Milestone" },
];

export const mockMediaMentions: MediaMention[] = [
    { id: 'mm-001', publication: "Forbes India", title: "AeroDesk: Digitizing the Skies", snippet: "The platform is becoming the digital backbone for India's fragmented private aviation sector.", date: "2025-02-18" },
];

export const mockBrandAssets: BrandAsset[] = [
    { id: 'ba-001', title: "AeroDesk Core Logo Set", type: "Vector Graphics", imageUrl: "https://images.unsplash.com/photo-1711919600878-b5d9e77d3357?q=80&w=1080", fileSize: "4.2 MB" },
];
