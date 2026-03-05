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
  CharterDemandForecast
} from './types';

export const VERIFIED_NSOP_REGISTRY = [
    { companyName: 'FlyCo Charter', nsopLicenseNumber: 'NSOP/FLYCO/2021', city: 'Mumbai' },
    { companyName: 'Taj Air', nsopLicenseNumber: 'NSOP/TAJ/02', city: 'Mumbai' },
    { companyName: 'Club One Air', nsopLicenseNumber: 'NSOP/COA/05', city: 'Delhi' },
    { companyName: 'Span Air', nsopLicenseNumber: 'NSOP/SPAN/09', city: 'Delhi' },
    { companyName: 'Deccan Charters', nsopLicenseNumber: 'NSOP/DEC/11', city: 'Bengaluru' },
    { companyName: 'Global Vectra', nsopLicenseNumber: 'NSOP/GV/14', city: 'Mumbai' },
    { companyName: 'Air Charter Service', nsopLicenseNumber: 'NSOP/ACS/22', city: 'Delhi' },
];

export const mockUsers: User[] = [
    { 
      id: 'demo_super_user', 
      email: 'demo@aerodesk.global', 
      firstName: 'AeroDesk', 
      lastName: 'Super User', 
      role: 'demo_super_user', 
      platformRole: 'admin', 
      firmRole: 'admin',
      status: 'active', 
      demoMode: true,
      allowedRoles: ["customer", "operator", "agency", "corporate", "hotel", "admin"],
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      createdAt: "2025-01-01T10:00:00Z", 
      updatedAt: "2025-01-01T10:00:00Z" 
    }
];

export const mockOperators: Operator[] = [
    { id: 'op-west-01', companyName: 'FlyCo Charter (West)', nsopLicenseNumber: 'NSOP/FLYCO/2021', officialEmail: 'ops@flyco.aero', registeredAddress: 'Hangar 1, Juhu Aerodrome, Mumbai', contactNumber: '+91 22 2822 2202', profileStatus: 'active', adminUserId: 'demo_super_user', status: 'Approved', gstin: '27AAAAA0000A1Z5', stateCode: '27', legalEntityName: 'FlyCo Aviation West Pvt Ltd', city: 'Mumbai', zone: 'West', fleetCount: 12, createdAt: '2025-01-10T09:00:00Z', updatedAt: '2025-01-10T09:00:00Z' },
    { id: 'op-north-01', companyName: 'Club One Air (North)', nsopLicenseNumber: 'NSOP/COA/05', officialEmail: 'dispatch@clubone.aero', registeredAddress: 'Terminal 1D, IGI Airport, Delhi', status: 'Approved', city: 'Delhi', zone: 'North', fleetCount: 8, createdAt: '2025-01-12T11:00:00Z', updatedAt: '2025-01-12T11:00:00Z' },
];

export const mockCorporates: CorporateTravelDesk[] = [
    { id: 'corp-west-01', companyName: 'Stark Industries', status: 'Active', adminExternalAuthId: 'demo_super_user', createdAt: '2025-01-01T10:00:00Z' },
    { id: 'corp-north-01', companyName: 'Reliance Global', status: 'Active', adminExternalAuthId: 'rel-admin-01', createdAt: '2025-01-05T10:00:00Z' },
];

export const mockAgencies: TravelAgency[] = [
    { id: 'ag-west-01', companyName: 'Sky Distributors', status: 'Active', createdAt: '2025-01-01T10:00:00Z' },
    { id: 'ag-south-01', companyName: 'Emerald Travel Group', status: 'Active', createdAt: '2025-01-08T10:00:00Z' },
];

export const mockHotelPartners: HotelPartner[] = [
    { id: 'hotel-01', companyName: 'Grand Hotels Group', status: 'Active', createdAt: '2025-01-01T10:00:00Z' },
    { id: 'hotel-02', companyName: 'Oberoi Collection', status: 'Active', createdAt: '2025-01-15T10:00:00Z' },
];

export const mockAlerts: SystemAlert[] = [
    { id: 'al-01', type: 'operational', message: 'No operator response to RFQ-CORP-001 for > 24 hours.', severity: 'medium', timestamp: new Date().toISOString(), status: 'active' },
    { id: 'al-02', type: 'security', message: 'Repeated login failures detected for user admin@aerodesk.global.', severity: 'high', timestamp: new Date().toISOString(), status: 'resolved' },
    { id: 'al-03', type: 'system', message: 'Cloud Function "generateInvoice" execution time exceeded 30s.', severity: 'low', timestamp: new Date().toISOString(), status: 'active' },
    { id: 'al-04', type: 'operational', message: 'Mission ADX-104: Weather delay flagged for destination VIDP.', severity: 'medium', timestamp: new Date().toISOString(), status: 'active' },
];

export const mockSystemLogs: SystemLog[] = [
    { id: 'log-01', event: 'charter_request_created', userId: 'demo_super_user', module: 'charter', action: 'Created RFQ-BOM-DEL', timestamp: new Date().toISOString() },
    { id: 'log-02', event: 'operator_bid_submitted', userId: 'op-west-01', module: 'marketplace', action: 'Submitted quote for RFQ-BOM-DEL', timestamp: new Date().toISOString() },
    { id: 'log-03', event: 'manifest_approved', userId: 'op-north-01', module: 'compliance', action: 'Approved manifest for RFQ-CORP-002', timestamp: new Date().toISOString() },
];

export const mockRfqs: CharterRFQ[] = [
    { id: 'RFQ-CORP-001', customerId: 'demo_super_user', requesterExternalAuthId: 'demo_super_user', customerName: 'Tony Stark', company: 'Stark Industries', tripType: 'Onward', departure: 'Mumbai (VABB)', arrival: 'Delhi (VIDP)', departureDate: '2025-03-15', departureTime: '10:00', pax: 5, aircraftType: 'Heavy Jet', status: 'Bidding Open', createdAt: '2025-02-10T10:00:00Z', updatedAt: '2025-02-10T10:00:00Z', totalAmount: 1250000, bidsCount: 2 },
    { id: 'RFQ-CORP-002', customerId: 'demo_super_user', requesterExternalAuthId: 'demo_super_user', customerName: 'Pepper Potts', company: 'Stark Industries', tripType: 'Return', departure: 'Bangalore (VOBL)', arrival: 'Goa (VOGO)', departureDate: '2025-03-20', departureTime: '11:30', pax: 3, aircraftType: 'Mid-size Jet', status: 'charterConfirmed', createdAt: '2025-02-12T09:00:00Z', updatedAt: '2025-02-15T14:00:00Z', totalAmount: 850000, operatorId: 'op-west-01' },
];

export const mockEmptyLegs: EmptyLeg[] = [
    { id: 'EL-001', operatorId: 'op-west-01', operatorName: 'FlyCo Charter', aircraftId: 'ac-01', aircraftName: 'Citation XLS', aircraftType: 'Light Jet', departure: 'Mumbai', arrival: 'Delhi', departureTime: '2025-03-10T14:00:00Z', totalCapacity: 8, availableSeats: 6, status: 'live', createdAt: '2025-02-01T10:00:00Z', pricePerSeat: 45000, seatAllocationEnabled: true, minSeatsPerRequest: 1, pricingModel: 'Fixed' },
];

export const mockAircraft: Aircraft[] = [
    { id: 'ac-01', operatorId: 'op-west-01', name: 'Cessna Citation XLS+', type: 'Light Jet', registration: 'VT-FLY', paxCapacity: 8, homeBase: 'Mumbai (VABB)', status: 'Available', hourlyRate: 180000, exteriorImageUrl: 'https://images.unsplash.com/photo-1540962351504-03099e0a754b?q=80&w=800' },
    { id: 'ac-02', operatorId: 'op-north-01', name: 'Embraer Legacy 650', type: 'Heavy Jet', registration: 'VT-STK', paxCapacity: 13, homeBase: 'Delhi (VIDP)', status: 'Available', hourlyRate: 450000, exteriorImageUrl: 'https://images.unsplash.com/photo-1569154941061-e231b4725ef1?q=80&w=800' },
];

export const mockAircraftPositions: AircraftPosition[] = [
    { id: 'pos-01', registration: 'VT-FLY', aircraftType: 'Citation XLS+', operator: 'FlyCo Charter', latitude: 19.0760, longitude: 72.8777, altitude: 0, velocity: 0, heading: 0, status: 'available', timestamp: new Date().toISOString() },
    { id: 'pos-02', registration: 'VT-STK', aircraftType: 'Legacy 650', latitude: 28.6139, longitude: 77.2090, altitude: 35000, velocity: 450, heading: 180, status: 'inflight', operator: 'Club One Air', timestamp: new Date().toISOString() },
    { id: 'pos-03', registration: 'VT-JSG', aircraftType: 'Global 6000', latitude: 12.9716, longitude: 77.5946, altitude: 12000, velocity: 320, heading: 45, status: 'scheduled', operator: 'FlyCo Charter', timestamp: new Date().toISOString() },
];

export const mockAircraftAvailability: AircraftAvailability[] = [
    { id: 'av-01', registration: 'VT-FLY', aircraftType: 'Citation XLS+', operator: 'FlyCo Charter', currentAirport: 'VABB', availableFrom: new Date().toISOString(), availabilityWindow: '3hours', seats: 8 },
    { id: 'av-02', registration: 'VT-PC', aircraftType: 'King Air B200', operator: 'FlyCo Charter', currentAirport: 'VAPO', availableFrom: new Date(Date.now() + 4 * 3600000).toISOString(), availabilityWindow: '6hours', seats: 7 },
];

export const mockDemandForecast: CharterDemandForecast[] = [
    { id: 'df-01', origin: 'Mumbai', destination: 'Goa', routeCode: 'VABB-VOGO', predictedDemandScore: 95, timeframe: '7days', aircraftTypeDemand: ['Phenom 300', 'Citation XLS'] },
    { id: 'df-02', origin: 'Delhi', destination: 'Dubai', routeCode: 'VIDP-OMDB', predictedDemandScore: 88, timeframe: '7days', aircraftTypeDemand: ['Legacy 650', 'Global 6000'] },
    { id: 'df-03', origin: 'Bangalore', destination: 'Hyderabad', routeCode: 'VOBL-VOHS', predictedDemandScore: 72, timeframe: '24hours', aircraftTypeDemand: ['King Air B200', 'C90'] },
];

export const mockPressReleases: PressRelease[] = [
    { id: 'pr-01', title: 'AeroDesk Expansion into Tier-2 Hubs', description: 'New coordination centers active in Ahmedabad and Jaipur.', date: '2025-02-01', category: 'Expansion' },
];

export const mockMediaMentions: MediaMention[] = [
    { id: 'mm-01', publication: 'Aviation Week', title: 'Digital Transformation in South Asia', snippet: 'AeroDesk leads the way in private aviation infrastructure.', date: '2025-01-15' },
];

export const mockBrandAssets: BrandAsset[] = [
    { id: 'ba-01', title: 'Logo Pack', type: 'Vector', imageUrl: 'https://images.unsplash.com/photo-1711919600878-b5d9e77d3357?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwyfHxhdmlhdGlvbiUyMGxvZ298ZW58MHx8fHwxNzcyMDgzMDIyfDA&ixlib=rb-4.1.0&q=80&w=1080', fileSize: '2.4MB' },
];

export const mockCommissionRules: CommissionRule[] = [
    { id: 'cru-01', serviceType: 'charter', commissionRatePercent: 5, effectiveFrom: '2025-01-01', isActive: true },
];

export const mockRevenueShareConfigs: RevenueShareConfig[] = [
    { id: 'rsc-01', scopeType: 'global', agencySharePercent: 60, aerodeskSharePercent: 40, isActive: true },
];

export const mockCommissionLedger: CommissionLedgerEntry[] = [
    { id: 'cle-01', transactionId: 'RFQ-DEMO-004', entityId: 'ag-west-01', bookingChannel: 'direct', grossAmount: 850000, agencyCommissionAmount: 0, aerodeskCommissionAmount: 42500, totalCommission: 42500, status: 'settled', serviceType: 'charter', agencySharePercent: 0, createdAt: '2025-02-02T12:00:00Z' },
];

export const mockSettlementRecords: SettlementRecord[] = [
    { id: 'SET-001', entityId: 'ag-west-01', entityName: 'Sky Distributors', settlementPeriodStart: '2025-01-01', settlementPeriodEnd: '2025-01-31', totalAgencyCommission: 125000, status: 'paid', createdAt: '2025-02-05T10:00:00Z' },
];

export const mockTaxConfig: TaxConfig[] = [
    { id: 'tax-01', serviceType: 'charter', taxRatePercent: 18, sacCode: '9964', effectiveFrom: '2025-01-01', isActive: true },
];

export const mockPlatformInvoices: PlatformInvoice[] = [
    { id: 'PINV-001', entityName: 'FlyCo Charter', totalAmount: 42500, dueDate: '2025-02-15', status: 'paid', entityType: 'Operator' },
];

export const mockPlatformChargeRules: PlatformChargeRule[] = [
    { id: 'pcr-01', entityType: 'Operator', serviceType: 'charter', chargeType: 'percentage', percentageRate: 0.05, fixedAmount: 0, isActive: true },
];

export const mockBillingLedger: EntityBillingLedger[] = [
    { id: 'ebl-01', relatedTransactionId: 'RFQ-DEMO-004', serviceType: 'charter', grossAmount: 850000, platformChargeAmount: 42500, ledgerStatus: 'paid' },
];

export const mockBlogPosts: BlogPost[] = [
    { id: 'post-01', title: "India's 2025 NSOP Infrastructure Roadmap", excerpt: "Analyzing the transition from fragmented regional operations to a unified digital infrastructure layer.", category: 'Market Trends', author: 'AeroDesk Intelligence', date: '2025-02-10', imageUrl: 'https://images.unsplash.com/photo-1566212775038-532d06eda485?q=80&w=1080' },
];

export const mockFeatureFlags: FeatureFlag[] = [
    { id: 'ff-01', name: 'EmptyLegAutoExpiry', description: 'Automatically expire EL listings after departure time.', isEnabled: true },
];

export const mockPolicyFlags: PolicyFlag[] = [
    { id: 'pol-01', ctdId: 'corp-west-01', name: 'Premium Cabin Restriction', description: 'Heavy jet category requires senior director approval.', isEnforced: true },
];

export const mockProperties: Property[] = [
    { id: 'prop-01', hotelPartnerId: 'hotel-01', name: 'The Taj Mahal Palace', city: 'Mumbai', status: 'Active', imageUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=800' },
];

export const mockRoomCategories: RoomCategory[] = [
    { id: 'room-01', propertyId: 'prop-01', name: 'Deluxe King Room', nightlyRate: 18500, description: 'Heritage wing garden view with luxury inclusions.' },
];

export const mockAuditLogs: AuditLog[] = [
    { id: 'audit-01', timestamp: '2025-02-10T10:00:00Z', user: 'Admin User', role: 'Platform Admin', action: 'OPERATOR_APPROVED', details: 'Approved FlyCo Charter registration', targetId: 'op-west-01' },
    { id: 'audit-02', timestamp: '2025-02-11T11:30:00Z', user: 'Finance Desk', role: 'Platform Admin', action: 'INVOICE_GENERATED', details: 'Generated monthly platform fee invoice', targetId: 'PINV-001' },
];

export const mockAccommodationRequests: AccommodationRequest[] = [
    { id: 'req-01', hotelPartnerId: 'hotel-01', propertyName: 'The Taj Mahal Palace', guestName: 'Tony Stark', checkIn: '2025-03-15', checkOut: '2025-03-17', rooms: 2, status: 'Confirmed', requesterId: 'demo_super_user' },
];

export const mockCrew: CrewMember[] = [
    { id: 'crew-01', operatorId: 'op-west-01', firstName: 'Raj', lastName: 'Malhotra', email: 'raj.m@flyco.aero', role: 'Captain', licenseNumber: 'ATPL-9982', assignedAircraftRegistration: 'VT-FLY', status: 'Available' },
];

export const mockSeatAllocations: SeatAllocation[] = [
    { id: 'seat-01', flightId: 'EL-001', operatorId: 'op-west-01', customerId: 'demo_super_user', customerName: 'Tony Stark', bookingChannel: 'direct', seatsRequested: 2, pricePerSeat: 45000, totalAmount: 90000, status: 'confirmed', paymentStatus: 'paid', passengers: [], createdAt: '2025-02-05T10:00:00Z' },
];
