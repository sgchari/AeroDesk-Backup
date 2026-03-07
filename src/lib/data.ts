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
  FlightPassengerManifest
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

export const mockOperators: Operator[] = [
    { id: 'op-west-01', companyName: 'FlyCo Charter', nsopLicenseNumber: 'NSOP/FLYCO/2021', officialEmail: 'ops@flyco.aero', registeredAddress: 'Hangar 1, Juhu Aerodrome, Mumbai', contactNumber: '+91 22 2822 2202', profileStatus: 'active', adminUserId: 'demo_super_user', status: 'Approved', gstin: '27AAAAA0000A1Z5', stateCode: '27', legalEntityName: 'FlyCo Aviation West Pvt Ltd', city: 'Mumbai', zone: 'West', fleetCount: 12, createdAt: '2025-01-10T09:00:00Z', updatedAt: '2025-01-10T09:00:00Z' },
    { id: 'op-north-01', companyName: 'Club One Air', nsopLicenseNumber: 'NSOP/COA/05', officialEmail: 'dispatch@clubone.aero', registeredAddress: 'IGI Airport, T3, Delhi', contactNumber: '+91 11 4566 7890', profileStatus: 'active', status: 'Approved', city: 'Delhi', zone: 'North', fleetCount: 8, createdAt: '2025-01-15T10:00:00Z', updatedAt: '2025-01-15T10:00:00Z' },
];

export const mockCorporates: CorporateTravelDesk[] = [
    { id: 'corp-west-01', companyName: 'Stark Industries', status: 'Active', adminExternalAuthId: 'demo_super_user', createdAt: '2025-01-01T10:00:00Z', updatedAt: '2025-01-01T10:00:00Z' },
];

export const mockAgencies: TravelAgency[] = [
    { id: 'ag-west-01', companyName: 'Sky Distributors', status: 'Active', createdAt: '2025-01-01T10:00:00Z', updatedAt: '2025-01-01T10:00:00Z' },
];

export const mockHotelPartners: HotelPartner[] = [
    { id: 'hotel-01', companyName: 'Grand Hotels Group', status: 'Active', createdAt: '2025-01-01T10:00:00Z', updatedAt: '2025-01-01T10:00:00Z' },
];

export const mockOrganizationUsers: OrganizationUser[] = [
  { id: 'org-u-01', userId: 'demo_super_user', organizationId: 'op-west-01', organizationType: 'operator', role: 'Admin', name: 'AeroDesk Admin', email: 'demo@aerodesk.global', phone: '+91 90000 00000', status: 'ACTIVE', createdAt: new Date().toISOString() },
  { id: 'org-u-02', userId: 'u-fm-01', organizationId: 'op-west-01', organizationType: 'operator', role: 'Fleet Manager', name: 'Rajesh Kumar', email: 'rajesh@flyco.aero', phone: '+91 91111 11111', status: 'ACTIVE', createdAt: new Date().toISOString() },
];

export const mockAircraft: Aircraft[] = [
    { id: 'ac-01', operatorId: 'op-west-01', name: 'Cessna Citation XLS+', type: 'Light Jet', registration: 'VT-FLY', paxCapacity: 8, homeBase: 'Mumbai (VABB)', status: 'AVAILABLE', hourlyRate: 180000, exteriorImageUrl: 'https://images.unsplash.com/photo-1540962351504-03099e0a754b?q=80&w=800', location: 'Mumbai' },
    { id: 'ac-02', operatorId: 'op-west-01', name: 'Embraer Legacy 650', type: 'Heavy Jet', registration: 'VT-STK', paxCapacity: 13, homeBase: 'Mumbai (VABB)', status: 'AVAILABLE', hourlyRate: 450000, exteriorImageUrl: 'https://images.unsplash.com/photo-1569154941061-e231b4725ef1?q=80&w=1080', location: 'Delhi' },
    { id: 'ac-03', operatorId: 'op-west-01', name: 'Beechcraft King Air B200', type: 'Turboprop', registration: 'VT-JSG', paxCapacity: 7, homeBase: 'Mumbai (VABB)', status: 'MAINTENANCE', hourlyRate: 95000, exteriorImageUrl: 'https://images.unsplash.com/photo-1544099858-75fe7a84ce88?q=80&w=2070&auto=format&fit=crop', location: 'Mumbai' },
];

export const mockRfqs: CharterRFQ[] = [
    { id: 'RFQ-CORP-001', customerId: 'u-corp-01', requesterExternalAuthId: 'u-corp-01', customerName: 'Bruce Wayne', company: 'Wayne Enterprises', tripType: 'Onward', departure: 'Mumbai (VABB)', arrival: 'Delhi (VIDP)', departureDate: '2025-03-15', departureTime: '10:00', pax: 5, aircraftType: 'Heavy Jet', status: 'Bidding Open', createdAt: '2025-02-10T10:00:00Z', updatedAt: '2025-02-10T10:00:00Z', bidsCount: 2 },
    { id: 'RFQ-IND-002', customerId: 'demo_super_user', requesterExternalAuthId: 'demo_super_user', customerName: 'Tony Stark', tripType: 'Return', departure: 'Delhi (VIDP)', arrival: 'Goa (VOGO)', departureDate: '2025-03-20', departureTime: '11:30', pax: 4, aircraftType: 'Light Jet', status: 'charterConfirmed', operatorId: 'op-west-01', createdAt: '2025-02-12T14:00:00Z', updatedAt: '2025-02-15T09:00:00Z', totalAmount: 850000, aircraftId: 'ac-01' },
    { id: 'RFQ-LIVE-003', customerId: 'demo_super_user', requesterExternalAuthId: 'demo_super_user', customerName: 'Tony Stark', tripType: 'Onward', departure: 'Bengaluru (VOBL)', arrival: 'Mumbai (VABB)', departureDate: '2025-03-06', departureTime: '09:00', pax: 2, aircraftType: 'Mid-size Jet', status: 'live', operatorId: 'op-west-01', createdAt: '2025-03-01T10:00:00Z', updatedAt: '2025-03-06T09:00:00Z', totalAmount: 620000, aircraftId: 'ac-02' },
];

export const mockSeatAllocationRequests: SeatAllocationRequest[] = [
  { id: 'sr-01', requestId: 'SR102', flightId: 'EL-001', operatorId: 'op-west-01', requesterId: 'demo_super_user', requesterName: 'Tony Stark', requesterType: 'individual', origin: 'VABB', destination: 'VIDP', seatsRequested: 2, passengers: [{ fullName: 'Tony Stark', idType: 'Passport', idNumber: 'Z1234567', nationality: 'Indian' }, { fullName: 'Pepper Potts', idType: 'Passport', idNumber: 'Z7654321', nationality: 'Indian' }], requestStatus: 'PENDING_OPERATOR_APPROVAL', totalAmount: 90000, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
];

export const mockSeatInvoices: SeatInvoice[] = [
  { id: 'sinv-01', invoiceId: 'INV102', requestId: 'SR102', operatorId: 'op-west-01', totalSeats: 2, seatPrice: 45000, totalAmount: 90000, currency: 'INR', invoiceStatus: 'ISSUED', paymentMode: 'OFFLINE_TRANSFER', createdAt: new Date().toISOString() },
];

export const mockSeatPayments: SeatPayment[] = [
  { id: 'spay-01', paymentId: 'PAY102', invoiceId: 'INV102', requestId: 'SR102', paymentMethod: 'Bank Transfer', paymentReference: 'UTR9218273', paymentStatus: 'PENDING_VERIFICATION', createdAt: new Date().toISOString() },
];

export const mockFlightPassengerManifests: FlightPassengerManifest[] = [
  { id: 'man-01', flightId: 'EL-001', passengers: [{ name: 'Tony Stark', requestId: 'SR102', seatNumber: '1A' }, { name: 'Pepper Potts', requestId: 'SR102', seatNumber: '1B' }], lastUpdated: new Date().toISOString() },
];

export const mockEmptyLegs: EmptyLeg[] = [
    { id: 'EL-001', operatorId: 'op-west-01', operatorName: 'FlyCo Charter', aircraftId: 'ac-01', aircraftName: 'Citation XLS+', aircraftType: 'Light Jet', departure: 'Mumbai (VABB)', arrival: 'Delhi (VIDP)', departureTime: '2025-03-10T14:00:00Z', totalCapacity: 8, availableSeats: 6, status: 'live', createdAt: '2025-02-01T10:00:00Z', pricePerSeat: 45000, seatAllocationEnabled: true, minSeatsPerRequest: 1, pricingModel: 'Fixed', bookingChannelAllowed: 'both' },
    { id: 'EL-002', operatorId: 'op-west-01', operatorName: 'FlyCo Charter', aircraftId: 'ac-02', aircraftName: 'Legacy 650', aircraftType: 'Heavy Jet', departure: 'Delhi (VIDP)', arrival: 'Dubai (DXB)', departureTime: '2025-03-12T09:00:00Z', totalCapacity: 13, availableSeats: 10, status: 'live', createdAt: '2025-02-05T11:00:00Z', pricePerSeat: 120000, seatAllocationEnabled: true, minSeatsPerRequest: 2, pricingModel: 'Fixed', bookingChannelAllowed: 'both' },
    { id: 'EL-003', operatorId: 'op-north-01', operatorName: 'Club One Air', aircraftId: 'ac-ext-01', aircraftName: 'Falcon 2000', aircraftType: 'Heavy Jet', departure: 'Goa (VOGO)', arrival: 'Mumbai (VABB)', departureTime: '2025-03-15T18:00:00Z', totalCapacity: 10, availableSeats: 8, status: 'live', createdAt: '2025-02-10T15:00:00Z', pricePerSeat: 55000, seatAllocationEnabled: true, minSeatsPerRequest: 1, pricingModel: 'Fixed', bookingChannelAllowed: 'both' },
    { id: 'EL-004', operatorId: 'op-west-01', operatorName: 'FlyCo Charter', aircraftId: 'ac-01', aircraftName: 'Citation XLS+', aircraftType: 'Light Jet', departure: 'Bengaluru (VOBL)', arrival: 'Hyderabad (VOHS)', departureTime: '2025-03-18T10:30:00Z', totalCapacity: 8, availableSeats: 4, status: 'live', createdAt: '2025-02-15T09:00:00Z', pricePerSeat: 38000, seatAllocationEnabled: true, minSeatsPerRequest: 1, pricingModel: 'Fixed', bookingChannelAllowed: 'both' },
    { id: 'EL-005', operatorId: 'op-north-01', operatorName: 'Club One Air', aircraftId: 'ac-ext-02', aircraftName: 'Phenom 300', aircraftType: 'Light Jet', departure: 'Delhi (VIDP)', arrival: 'Jaipur (VIJP)', departureTime: '2025-03-20T11:00:00Z', totalCapacity: 6, availableSeats: 6, status: 'live', createdAt: '2025-02-20T10:00:00Z', pricePerSeat: 25000, seatAllocationEnabled: true, minSeatsPerRequest: 1, pricingModel: 'Fixed', bookingChannelAllowed: 'both' },
    { id: 'EL-006', operatorId: 'op-west-01', operatorName: 'FlyCo Charter', aircraftId: 'ac-02', aircraftName: 'Legacy 650', aircraftType: 'Heavy Jet', departure: 'London (LHR)', arrival: 'Delhi (VIDP)', departureTime: '2025-03-25T22:00:00Z', totalCapacity: 13, availableSeats: 13, status: 'live', createdAt: '2025-02-25T14:00:00Z', pricePerSeat: 280000, seatAllocationEnabled: true, minSeatsPerRequest: 1, pricingModel: 'Fixed', bookingChannelAllowed: 'both' },
];

export const mockSeatAllocations: SeatAllocation[] = [
    { id: 'ST-001', flightId: 'EL-001', operatorId: 'op-west-01', customerId: 'u-cust-01', customerName: 'Rajesh Khanna', bookingChannel: 'agency', seatsRequested: 2, pricePerSeat: 45000, totalAmount: 90000, status: 'pendingApproval', paymentStatus: 'pending', passengers: [{ fullName: 'Rajesh Khanna', nationality: 'Indian', idNumber: 'Z1234567', idType: 'Passport' }], createdAt: '2025-03-01T10:00:00Z' },
];

export const mockInvoices: Invoice[] = [
    { id: 'INV-001', relatedEntityId: 'RFQ-IND-002', operatorId: 'op-west-01', invoiceNumber: 'INV-FLY-2025-001', totalAmount: 850000, status: 'paid', bankDetails: 'AeroBank India • IFSC: AERO0001234 • A/C: 9988776655', createdAt: '2025-02-15T10:00:00Z' },
];

export const mockPayments: Payment[] = [
    { id: 'PAY-001', relatedEntityId: 'RFQ-IND-002', invoiceId: 'INV-001', utrReference: 'AXISB00009218273', status: 'verified', createdAt: '2025-02-16T11:00:00Z' },
];

export const mockPassengerManifests: PassengerManifest[] = [
    { id: 'MF-001', charterId: 'RFQ-IND-002', status: 'approved', passengers: [{ fullName: 'Tony Stark', nationality: 'Indian', idNumber: 'Z1234567', idType: 'Passport' }], createdAt: '2025-02-14T09:00:00Z', updatedAt: '2025-02-15T09:00:00Z' },
];

export const mockCrewMembers: CrewMember[] = [
  { id: 'crw-01', crewId: 'CRW101', operatorId: 'op-west-01', name: 'Captain Vikram Singh', designation: 'Pilot', licenseNumber: 'ATPL-9988', phone: '+91 92222 22222', email: 'vikram@flyco.aero', status: 'ACTIVE' },
  { id: 'crw-02', crewId: 'CRW102', operatorId: 'op-west-01', name: 'First Officer Ananya', designation: 'Co-Pilot', licenseNumber: 'CPL-4455', phone: '+91 93333 33333', email: 'ananya@flyco.aero', status: 'ACTIVE' },
  { id: 'crw-03', crewId: 'CRW103', operatorId: 'op-west-01', name: 'Neha Sharma', designation: 'Cabin Crew', licenseNumber: 'SEP-1122', phone: '+91 94444 44444', email: 'neha@flyco.aero', status: 'ON_DUTY' },
];

export const mockCrewAssignments: CrewAssignment[] = [
  { id: 'asgn-01', assignmentId: 'ASN101', charterRequestId: 'RFQ-LIVE-003', aircraftId: 'ac-01', crewMembers: ['CRW101', 'CRW102'], status: 'ASSIGNED' },
];

export const mockCrewLogistics: CrewLogistics[] = [
  { id: 'log-01', logisticsId: 'LOG101', crewId: 'CRW101', tripId: 'RFQ-LIVE-003', hotelRequired: true, hotelBookingStatus: 'PENDING', transportRequired: true, transportStatus: 'ARRANGED' },
];

export const mockAviationHubs: AviationHub[] = [
  { id: 'hub-01', icao: "VIDP", airportName: "Indira Gandhi Intl", city: "Delhi", latitude: 28.5562, longitude: 77.1000, operatorCount: 4, fleetSize: 12 },
  { id: 'hub-02', icao: "VABB", airportName: "Chhatrapati Shivaji Intl", city: "Mumbai", latitude: 19.0896, longitude: 72.8656, operatorCount: 5, fleetSize: 18 },
  { id: 'hub-03', icao: "VOBL", airportName: "Kempegowda Intl", city: "Bengaluru", latitude: 13.1986, longitude: 77.7066, operatorCount: 3, fleetSize: 8 },
];

export const mockOperationalActivities: OperationalActivity[] = [
    { id: 'act-01', type: 'rfq_created', message: 'New Heavy Jet RFQ created: Mumbai to London', timestamp: new Date().toISOString(), entityId: 'RFQ-CORP-001', actor: 'Bruce Wayne' },
    { id: 'act-02', type: 'empty_leg_published', message: 'Empty Leg Published: Delhi to Jaipur', timestamp: new Date(Date.now() - 3600000).toISOString(), entityId: 'EL-001', actor: 'FlyCo Charter' },
    { id: 'act-03', type: 'quote_accepted', message: 'Technical Bid Accepted for Mission RFQ-IND-002', timestamp: new Date(Date.now() - 7200000).toISOString(), entityId: 'RFQ-IND-002', actor: 'AeroDesk Admin' },
];

export const mockAICharterInsights: AICharterInsight[] = [
    { id: 'ai-01', route: 'VABB-VIDP', aircraftRecommendation: 'Phenom 300', estimatedPriceMin: 680000, estimatedPriceMax: 740000, demandScore: 0.92, recommendation: 'High demand expected next 48 hours' },
    { id: 'ai-02', route: 'VIDP-VOGO', aircraftRecommendation: 'Citation XLS', estimatedPriceMin: 850000, estimatedPriceMax: 920000, demandScore: 0.85, recommendation: 'Cluster demand identified for weekend sector' },
];

export const mockTripCommands: TripCommand[] = [
    { id: 'TRP102', customerId: 'demo_super_user', origin: 'Mumbai (VABB)', destination: 'Delhi (VIDP)', aircraft: 'Phenom 300', passengers: 5, charterBookingId: 'RFQ-IND-002', hotelBookingId: 'ACC-002', transportBookingId: 'TRN102', status: 'CONFIRMED', departureTime: '2025-03-15T10:00:00Z' },
];

export const mockCharterPriceIndex: CharterPriceIndex[] = [
    { id: 'cpi-01', route: 'VABB-VOGO', aircraftCategory: 'LightJet', averagePrice: 710000, priceChangePercent: 6, demandIndex: 0.92, lastUpdated: new Date().toISOString() },
    { id: 'cpi-02', route: 'VIDP-VABB', aircraftCategory: 'MidsizeJet', averagePrice: 950000, priceChangePercent: -2, demandIndex: 0.78, lastUpdated: new Date().toISOString() },
];

export const mockAircraftPositions: AircraftPosition[] = [
    { id: 'pos-01', registration: 'VT-FLY', aircraftType: 'Citation XLS+', operator: 'FlyCo Charter', latitude: 19.0760, longitude: 72.8777, altitude: 0, velocity: 0, heading: 0, status: 'available', timestamp: new Date().toISOString() },
    { id: 'pos-02', registration: 'VT-STK', aircraftType: 'Legacy 650', operator: 'FlyCo Charter', latitude: 22.5, longitude: 75.2, altitude: 35000, velocity: 450, heading: 120, status: 'inflight', timestamp: new Date().toISOString() },
];

export const mockAircraftAvailability: AircraftAvailability[] = [
    { id: 'av-01', registration: 'VT-FLY', aircraftType: 'Citation XLS+', operator: 'FlyCo Charter', currentAirport: 'VABB', availableFrom: new Date().toISOString(), availabilityWindow: '3hours', seats: 8 },
];

export const mockDemandForecast: CharterDemandForecast[] = [
    { id: 'df-01', origin: 'Mumbai', destination: 'Goa', routeCode: 'VABB-VOGO', predictedDemandScore: 95, timeframe: '7days', aircraftTypeDemand: ['Phenom 300', 'Citation XLS'], forecastWindow: '7days' },
];

export const mockRouteDemandHistory: RouteDemandHistory[] = [
    { id: 'rdh-01', route: 'Mumbai-Delhi', origin: 'Mumbai', destination: 'Delhi', monthlyFlightCount: 42, demandScore: 88 },
];

export const mockEmptyLegPredictions: EmptyLegPrediction[] = [
    { id: 'elp-01', aircraft: 'VT-FLY', predictedRoute: 'VIDP-VABB', probability: 0.85, timeframe: '24h', reason: 'Historical repositioning pattern' },
];

export const mockFleetOptimizationSuggestions: FleetOptimizationSuggestion[] = [
    { id: 'fos-01', operator: 'FlyCo Charter', aircraft: 'VT-STK', recommendation: 'Reposition to VIDP', reason: 'High demand cluster detected in North Zone', expectedYieldIncrease: 12 },
];

export const mockAuditLogs: AuditLog[] = [
    { id: 'audit-01', timestamp: '2025-02-10T10:00:00Z', user: 'Admin User', role: 'Platform Admin', action: 'OPERATOR_APPROVED', details: 'Approved FlyCo Charter registration', targetId: 'op-west-01' },
];

export const mockAlerts: SystemAlert[] = [
    { id: 'al-01', type: 'operational', message: 'No operator response to RFQ-CORP-001 for > 24 hours.', severity: 'medium', timestamp: new Date().toISOString(), status: 'active' },
    { id: 'al-02', type: 'maintenance', message: 'VT-JSG: A-Check due in 48 hours.', severity: 'high', timestamp: new Date().toISOString(), status: 'active' },
    { id: 'al-03', type: 'crew', message: 'Captain Vikram Singh approaching FDTL limit.', severity: 'medium', timestamp: new Date().toISOString(), status: 'active' },
];

export const mockSystemLogs: SystemLog[] = [
    { id: 'log-01', event: 'charter_request_created', userId: 'demo_super_user', module: 'charter', action: 'Created RFQ-BOM-DEL', timestamp: new Date().toISOString() },
];

export const mockPlatformChargeRules: PlatformChargeRule[] = [
    { id: 'pcr-01', entityType: 'Operator', serviceType: 'charter', chargeType: 'percentage', percentageRate: 0.05, fixedAmount: 0, isActive: true },
    { id: 'pcr-02', entityType: 'Travel Agency', serviceType: 'seat', chargeType: 'percentage', percentageRate: 0.03, fixedAmount: 0, isActive: true },
];

export const mockCommissionRules: CommissionRule[] = [
    { id: 'cr-01', serviceType: 'charter', commissionRatePercent: 5, effectiveFrom: '2025-01-01', isActive: true },
];

export const mockRevenueShareConfigs: RevenueShareConfig[] = [
    { id: 'rsc-01', scopeType: 'global', agencySharePercent: 60, aerodeskSharePercent: 40, isActive: true },
];

export const mockCommissionLedger: CommissionLedgerEntry[] = [
    { id: 'cle-01', transactionId: 'TX-101', entityId: 'ag-west-01', serviceType: 'charter', bookingChannel: 'agency', grossAmount: 1250000, agencyCommissionAmount: 37500, aerodeskCommissionAmount: 25000, totalCommission: 62500, agencySharePercent: 60, status: 'pending', createdAt: new Date().toISOString() },
];

export const mockSettlementRecords: SettlementRecord[] = [
    { id: 'SET-01', entityId: 'ag-west-01', entityName: 'Sky Distributors', totalAgencyCommission: 45000, settlementPeriodStart: '2025-01-01', settlementPeriodEnd: '2025-01-31', status: 'paid', createdAt: '2025-02-05T10:00:00Z', paymentReference: 'BNK-92182' },
];

export const mockTaxConfigs: TaxConfig[] = [
    { id: 'tc-01', serviceType: 'charter', taxRatePercent: 18, sacCode: '9964', effectiveFrom: '2025-01-01', isActive: true },
];

export const mockProperties: Property[] = [
    { id: 'prop-01', hotelPartnerId: 'hotel-01', name: 'The Taj Mahal Palace', city: 'Mumbai', status: 'Active', imageUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=800', propertyType: 'Luxury Hotel' },
    { id: 'prop-02', hotelPartnerId: 'hotel-01', name: 'The Oberoi', city: 'Delhi', status: 'Active', imageUrl: 'https://images.unsplash.com/photo-1551882547-ff43c61f3c33?q=80&w=800', propertyType: 'Luxury Hotel' },
];

export const mockRoomCategories: RoomCategory[] = [
    { id: 'room-01', propertyId: 'prop-01', name: 'Presidential Suite', nightlyRate: 150000, description: 'Panoramic harbor views with 24-hour butler service.', imageUrl: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?q=80&w=800' },
];

export const mockAccommodationRequests: AccommodationRequest[] = [
    { id: 'ACC-001', hotelPartnerId: 'hotel-01', propertyName: 'The Taj Mahal Palace', guestName: 'Tony Stark', checkIn: '2025-03-20', checkOut: '2025-03-22', rooms: 1, status: 'Confirmed', requesterId: 'demo_super_user' },
];

export const mockAircraftMaintenance: AircraftMaintenance[] = [
  { id: 'mnt-01', aircraftId: 'ac-03', operatorId: 'op-west-01', lastMaintenanceDate: '2024-12-15T10:00:00Z', maintenanceType: 'Inspection', nextMaintenanceDueHours: 1250, status: 'IN_PROGRESS' },
  { id: 'mnt-02', aircraftId: 'ac-01', operatorId: 'op-west-01', lastMaintenanceDate: '2025-01-20T10:00:00Z', maintenanceType: 'A-Check', nextMaintenanceDueHours: 1500, status: 'SCHEDULED' },
];

export const mockMaintenanceSchedule: MaintenanceSchedule[] = [
  { id: 'sch-01', maintenanceId: 'mnt-01', aircraftId: 'ac-03', maintenanceType: 'Annual Inspection', scheduledDate: new Date().toISOString(), maintenanceFacility: 'Mumbai MRO', status: 'SCHEDULED' },
  { id: 'sch-02', maintenanceId: 'mnt-02', aircraftId: 'ac-01', maintenanceType: 'A-Check', scheduledDate: new Date(Date.now() + 172800000).toISOString(), maintenanceFacility: 'Delhi Engineering', status: 'SCHEDULED' },
];

export const mockDefectReports: DefectReport[] = [
  { id: 'df-01', aircraftId: 'ac-03', reportedBy: 'Captain Vikram Singh', issueDescription: 'Hydraulic pressure sensor lag detected in left gear assembly.', priority: 'HIGH', status: 'OPEN', reportedAt: new Date().toISOString() },
  { id: 'df-02', aircraftId: 'ac-01', reportedBy: 'Ananya Sharma', issueDescription: 'Cabin reading light above 2A malfunctioning.', priority: 'LOW', status: 'RESOLVED', reportedAt: new Date(Date.now() - 86400000).toISOString() },
];

export const mockMaintenanceWorkOrders: MaintenanceWorkOrder[] = [
  { id: 'wo-01', aircraftId: 'ac-03', taskDescription: 'Hydraulic Sensor Replacement & Calibration', engineerName: 'Rahul Sharma', startTime: new Date().toISOString(), status: 'IN_PROGRESS' },
];

export const mockBlogPosts: BlogPost[] = [
    { id: 'intel-001', title: "The 2025 Indian NSOP Governance Mandate", excerpt: "Analyzing the digital transformation requirements for non-scheduled operators in the upcoming fiscal year.", category: "Private Aviation", author: "AeroDesk Research", date: "2025-02-15", imageUrl: "https://images.unsplash.com/photo-1566212775038-532d06eda485?q=80&w=1080" },
    { id: 'intel-002', title: "Optimizing Positioning Flights for Institutional Yield", excerpt: "How real-time ADS-B telemetry is reshaping the empty leg marketplace across metro corridors.", category: "Empty Leg Insights", author: "Capt. Vikram Singh", date: "2025-02-10", imageUrl: "https://images.unsplash.com/photo-1758837573876-63871cc70fd6?q=80&w=1080" },
    { id: 'intel-003', title: "The Rise of Corporate Jet Seat Exchanges", excerpt: "Why enterprise travel desks are shifting from full charters to allocatable seat models for regional missions.", category: "Market Trends", author: "Meera Kapoor", date: "2025-02-05", imageUrl: "https://images.unsplash.com/photo-1616142387171-fadb42551e7a?q=80&w=1080" },
    { id: 'intel-004', title: "Sustainable Aviation Fuel: Challenges for Indian NSOPs", excerpt: "Evaluating the infrastructure readiness for SAF adoption in the primary metropolitan hubs.", category: "Market Trends", author: "AeroDesk Research", date: "2025-01-28", imageUrl: "https://images.unsplash.com/photo-1540575861501-7cf05a4b125a?q=80&w=1080" },
    { id: 'intel-005', title: "Ultra-Long Range Fleet Trends in South Asia", excerpt: "Tracking the deployment of Global 7500 and G700 assets within the Indian institutional network.", category: "Private Aviation", author: "Capt. Vikram Singh", date: "2025-01-20", imageUrl: "https://images.unsplash.com/photo-1768346564233-d71f37bd19b6?q=80&w=1080" },
    { id: 'intel-006', title: "Digitizing the Passenger Manifest Protocol", excerpt: "How unified digital identities are accelerating terminal clearance for VIP missions.", category: "Corporate Travel", author: "Meera Kapoor", date: "2025-01-12", imageUrl: "https://images.unsplash.com/photo-1711919600878-b5d9e77d3357?q=80&w=1080" },
    { id: 'intel-007', title: "Hospitality Synchronization: The Arrival Factor", excerpt: "The commercial impact of automated room-ready protocols for private jet arrivals.", category: "Market Trends", author: "AeroDesk Research", date: "2025-01-05", imageUrl: "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1080" },
    { id: 'intel-008', title: "Regional Hub Expansion: Beyond the Metros", excerpt: "Identifying the emerging high-growth charter nodes in Tier-2 Indian cities.", category: "Market Trends", author: "AeroDesk Research", date: "2024-12-28", imageUrl: "https://images.unsplash.com/photo-1573108724029-4c46571d6490?q=80&w=1080" },
    { id: 'intel-009', title: "Cybersecurity in Mission Control Environments", excerpt: "Protecting institutional telemetry and client data from emerging sophisticated threats.", category: "Private Aviation", author: "Meera Kapoor", date: "2024-12-15", imageUrl: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=1080" },
    { id: 'intel-010', title: "The Economic Impact of Fractional Ownership", excerpt: "Predicting the shift in asset financing models for the Indian aviation corridor by 2030.", category: "Market Trends", author: "AeroDesk Research", date: "2024-12-01", imageUrl: "https://images.unsplash.com/photo-1692128236852-af552fda49f0?q=80&w=1080" },
];

export const mockPressReleases: PressRelease[] = [
    { id: 'pr-001', title: "AeroDesk Announces National Hub Synchronization", description: "Integration of primary metropolitan hubs into the unified coordination grid is complete.", date: "2025-02-20", category: "Milestone" },
    { id: 'pr-002', title: "Strategic Partnership with Global ADS-B Network", description: "Real-time telemetry layer now active across the AeroDesk Global Radar module.", date: "2025-02-12", category: "Technology" },
    { id: 'pr-003', title: "AeroDesk Launches AI Charter Autopilot", description: "Predictive decision-support engine now available for verified NSOP operators.", date: "2025-01-30", category: "Product" },
    { id: 'pr-004', title: "Expanding the Hospitality Network to London and Dubai", description: "Institutional stay coordination now live for international long-haul corridors.", date: "2025-01-15", category: "Expansion" },
    { id: 'pr-005', title: "Series A Funding Round Finalized", description: "AeroDesk secures growth capital to accelerate digital aviation infrastructure development.", date: "2024-12-20", category: "Corporate" },
    { id: 'pr-006', title: "Verified Operator Network Exceeds 40 Carriers", description: "AeroDesk now represents the largest liquid fleet registry in the South Asian region.", date: "2024-12-05", category: "Network" },
];

export const mockMediaMentions: MediaMention[] = [
    { id: 'mm-001', publication: "Forbes India", title: "AeroDesk: Digitizing the Skies", snippet: "The platform is becoming the digital backbone for India's fragmented private aviation sector.", date: "2025-02-18" },
    { id: 'mm-002', publication: "Economic Times", title: "Corporate Demand for Charters Surges 15%", snippet: "AeroDesk reports a significant shift toward institutional jet seat exchanges.", date: "2025-02-05" },
    { id: 'mm-003', publication: "Business Standard", title: "The Zero-Risk Model of Aviation Infrastructure", snippet: "How AeroDesk is streamlining coordination without handling client funds.", date: "2025-01-22" },
    { id: 'mm-004', publication: "Aviation Week", title: "Telemetry and Transparency in NSOP Operations", snippet: "AeroDesk's live radar module sets a new standard for operational visibility.", date: "2025-01-10" },
];

export const mockBrandAssets: BrandAsset[] = [
    { id: 'ba-001', title: "AeroDesk Core Logo Set", type: "Vector Graphics", imageUrl: "https://images.unsplash.com/photo-1711919600878-b5d9e77d3357?q=80&w=1080", fileSize: "4.2 MB" },
    { id: 'ba-002', title: "Premium Fleet Photography", type: "High-Res Image", imageUrl: "https://images.unsplash.com/photo-1616193572425-fd11332ec645?q=80&w=1080", fileSize: "12.8 MB" },
    { id: 'ba-003', title: "Platform Interface Mockups", type: "Digital Asset", imageUrl: "https://images.unsplash.com/photo-1761813409462-9329c23c7541?q=80&w=1080", fileSize: "8.5 MB" },
    { id: 'ba-004', title: "Citation XLS+ Exterior", type: "Fleet Media", imageUrl: "https://images.unsplash.com/photo-1540962351504-03099e0a754b?q=80&w=800", fileSize: "5.1 MB" },
    { id: 'ba-005', title: "Legacy 650 Hangar Shot", type: "Fleet Media", imageUrl: "https://images.unsplash.com/photo-1569154941061-e231b4725ef1?q=80&w=1080", fileSize: "9.3 MB" },
    { id: 'ba-006', title: "Institutional Dashboard View", type: "UI Graphics", imageUrl: "https://images.unsplash.com/photo-1551288049-bbbda536339a?q=80&w=1080", fileSize: "3.7 MB" },
];

export const mockQuotations: Quotation[] = [
  { id: 'q-01', rfqId: 'RFQ-CORP-001', operatorId: 'op-west-01', operatorName: 'FlyCo Charter', aircraftId: 'ac-01', aircraftName: 'Citation XLS+', price: 1250000, status: 'Submitted', submittedAt: new Date().toISOString(), validUntil: '2025-03-10' },
];

export const mockFleetUtilization: FleetUtilization[] = [
  { id: 'util-01', operatorId: 'op-west-01', aircraftId: 'ac-01', aircraftType: 'Light Jet', registration: 'VT-FLY', flightsLast30Days: 12, totalFlightHours: 45, utilizationPercentage: 72, idleHours: 12, lastUpdated: new Date().toISOString() },
  { id: 'util-02', operatorId: 'op-west-01', aircraftId: 'ac-02', aircraftType: 'Heavy Jet', registration: 'VT-STK', flightsLast30Days: 8, totalFlightHours: 58, utilizationPercentage: 88, idleHours: 5, lastUpdated: new Date().toISOString() },
];

export const mockCharterDemandAnalytics: CharterDemandAnalytics[] = [
  { id: 'da-01', route: 'BOM-DEL', origin: 'Mumbai', destination: 'Delhi', totalRequestsLast30Days: 45, confirmedCharters: 12, demandScore: 92 },
  { id: 'da-02', route: 'DEL-DXB', origin: 'Delhi', destination: 'Dubai', totalRequestsLast30Days: 28, confirmedCharters: 8, demandScore: 85 },
];

export const mockEmptyLegOpportunities: EmptyLegOpportunity[] = [
  { id: 'elo-01', aircraftId: 'ac-01', registration: 'VT-FLY', currentCity: 'Mumbai', recommendedRoute: 'Delhi', demandScore: 95, potentialSeatRevenue: 240000, seatsAvailable: 8 },
];

export const mockAircraftPositioningInsights: AircraftPositioningInsight[] = [
  { id: 'api-01', operatorId: 'op-west-01', aircraftId: 'ac-01', registration: 'VT-FLY', aircraftType: 'Light Jet', recommendedBase: 'Delhi', reason: 'High demand cluster detected in North Zone', demandScore: 88 },
];

export const mockCharterPriceBenchmark: CharterPriceBenchmark[] = [
  { id: 'cpb-01', route: 'VABB-VIDP', aircraftCategory: 'LightJet', avgPrice: 710000, minPrice: 650000, maxPrice: 800000 },
];

export const mockRevenueForecast: RevenueForecast[] = [
  { id: 'revf-01', operatorId: 'op-west-01', route: 'BOM-DEL', projectedDemandNext7Days: 15, estimatedRevenueOpportunity: 4200000 },
];
