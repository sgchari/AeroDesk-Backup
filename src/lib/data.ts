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
  Quotation
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
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
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
  { id: 'org-u-03', userId: 'u-ba-01', organizationId: 'ag-west-01', organizationType: 'agency', role: 'Booking Agent', name: 'Saira Banu', email: 'saira@skydist.com', phone: '+91 92222 22222', status: 'ACTIVE', createdAt: new Date().toISOString() },
];

export const mockAircraft: Aircraft[] = [
    { id: 'ac-01', operatorId: 'op-west-01', name: 'Cessna Citation XLS+', type: 'Light Jet', registration: 'VT-FLY', paxCapacity: 8, homeBase: 'Mumbai (VABB)', status: 'Available', hourlyRate: 180000, exteriorImageUrl: 'https://images.unsplash.com/photo-1540962351504-03099e0a754b?q=80&w=800' },
    { id: 'ac-02', operatorId: 'op-west-01', name: 'Embraer Legacy 650', type: 'Heavy Jet', registration: 'VT-STK', paxCapacity: 13, homeBase: 'Mumbai (VABB)', status: 'Available', hourlyRate: 450000, exteriorImageUrl: 'https://images.unsplash.com/photo-1569154941061-e231b4725ef1?q=80&w=1080' },
    { id: 'ac-03', operatorId: 'op-north-01', name: 'Falcon 2000', type: 'Heavy Jet', registration: 'VT-COA', paxCapacity: 10, homeBase: 'Delhi (VIDP)', status: 'Available', hourlyRate: 420000, exteriorImageUrl: 'https://images.unsplash.com/photo-1616193572425-fd11332ec645?q=80&w=800' },
];

export const mockRfqs: CharterRFQ[] = [
    { id: 'RFQ-CORP-001', customerId: 'demo_super_user', requesterExternalAuthId: 'demo_super_user', customerName: 'Tony Stark', company: 'Stark Industries', tripType: 'Onward', departure: 'Mumbai (VABB)', arrival: 'Delhi (VIDP)', departureDate: '2025-03-15', departureTime: '10:00', pax: 5, aircraftType: 'Heavy Jet', status: 'Bidding Open', createdAt: '2025-02-10T10:00:00Z', updatedAt: '2025-02-10T10:00:00Z', totalAmount: 1250000, bidsCount: 2, costCenter: 'EXEC-HQ' },
    { id: 'RFQ-IND-002', customerId: 'demo_super_user', requesterExternalAuthId: 'demo_super_user', customerName: 'Tony Stark', tripType: 'Return', departure: 'Delhi (VIDP)', arrival: 'Goa (VOGO)', departureDate: '2025-03-20', departureTime: '11:30', pax: 4, aircraftType: 'Light Jet', status: 'manifestApproved', createdAt: '2025-02-12T14:00:00Z', updatedAt: '2025-02-15T09:00:00Z', totalAmount: 850000, bidsCount: 1, operatorId: 'op-west-01' },
    { id: 'RFQ-LIVE-003', customerId: 'demo_super_user', requesterExternalAuthId: 'demo_super_user', customerName: 'Tony Stark', company: 'Stark Industries', tripType: 'Onward', departure: 'Bengaluru (VOBL)', arrival: 'Mumbai (VABB)', departureDate: '2025-03-06', departureTime: '09:00', pax: 2, aircraftType: 'Mid-size Jet', status: 'live', createdAt: '2025-03-01T10:00:00Z', updatedAt: '2025-03-06T09:00:00Z', totalAmount: 620000, operatorId: 'op-west-01' },
];

export const mockQuotations: Quotation[] = [
    { id: 'QO-001', rfqId: 'RFQ-CORP-001', operatorId: 'op-west-01', operatorName: 'FlyCo Charter', aircraftId: 'ac-02', aircraftName: 'Legacy 650', price: 1250000, status: 'Submitted', submittedAt: new Date().toISOString(), validUntil: '2025-03-10' },
];

export const mockEmptyLegs: EmptyLeg[] = [
    { id: 'EL-001', operatorId: 'op-west-01', operatorName: 'FlyCo Charter', aircraftId: 'ac-01', aircraftName: 'Citation XLS', aircraftType: 'Light Jet', departure: 'Mumbai', arrival: 'Delhi', departureTime: '2025-03-10T14:00:00Z', totalCapacity: 8, availableSeats: 6, status: 'live', createdAt: '2025-02-01T10:00:00Z', pricePerSeat: 45000, seatAllocationEnabled: true, minSeatsPerRequest: 1, pricingModel: 'Fixed', bookingChannelAllowed: 'both' },
    { id: 'EL-002', operatorId: 'op-north-01', operatorName: 'Club One Air', aircraftId: 'ac-03', aircraftName: 'Falcon 2000', aircraftType: 'Heavy Jet', departure: 'Delhi', arrival: 'Goa', departureTime: '2025-03-12T09:00:00Z', totalCapacity: 10, availableSeats: 10, status: 'live', createdAt: '2025-02-05T11:00:00Z', pricePerSeat: 65000, seatAllocationEnabled: true, minSeatsPerRequest: 2, pricingModel: 'Fixed', bookingChannelAllowed: 'both' },
];

export const mockSeatAllocations: SeatAllocation[] = [
    { id: 'ST-001', flightId: 'EL-001', operatorId: 'op-west-01', customerId: 'demo_super_user', customerName: 'Tony Stark', bookingChannel: 'direct', seatsRequested: 2, pricePerSeat: 45000, totalAmount: 90000, status: 'confirmed', paymentStatus: 'paid', passengers: [{ fullName: 'Tony Stark', nationality: 'Indian', idNumber: 'Z1234567', idType: 'Passport' }, { fullName: 'Pepper Potts', nationality: 'Indian', idNumber: 'Z7654321', idType: 'Passport' }], createdAt: '2025-02-15T10:00:00Z' },
    { id: 'ST-002', flightId: 'EL-002', operatorId: 'op-north-01', customerId: 'demo_super_user', customerName: 'Tony Stark', bookingChannel: 'direct', seatsRequested: 1, pricePerSeat: 65000, totalAmount: 65000, status: 'pendingApproval', paymentStatus: 'pending', passengers: [{ fullName: 'Happy Hogan', nationality: 'Indian', idNumber: 'Z9988776', idType: 'Passport' }], createdAt: '2025-03-01T14:00:00Z' },
];

export const mockInvoices: Invoice[] = [
    { id: 'INV-001', relatedEntityId: 'RFQ-IND-002', operatorId: 'op-west-01', invoiceNumber: 'INV-FLY-2025-001', totalAmount: 850000, status: 'issued', bankDetails: 'AeroBank India • IFSC: AERO0001234 • A/C: 9988776655', createdAt: '2025-02-15T10:00:00Z' },
];

export const mockPayments: Payment[] = [
    { id: 'PAY-001', relatedEntityId: 'RFQ-IND-002', invoiceId: 'INV-001', utrReference: 'AXISB00009218273', status: 'submitted', createdAt: '2025-02-16T11:00:00Z' },
];

export const mockPassengerManifests: PassengerManifest[] = [
    { id: 'MF-001', charterId: 'RFQ-IND-002', status: 'approved', passengers: [{ fullName: 'Tony Stark', nationality: 'Indian', idNumber: 'Z1234567', idType: 'Passport' }], createdAt: '2025-02-14T09:00:00Z', updatedAt: '2025-02-15T09:00:00Z' },
];

export const mockProperties: Property[] = [
    { id: 'prop-01', hotelPartnerId: 'hotel-01', name: 'The Taj Mahal Palace', city: 'Mumbai', status: 'Active', imageUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=800', propertyType: 'Luxury Hotel' },
    { id: 'prop-02', hotelPartnerId: 'hotel-01', name: 'The Oberoi New Delhi', city: 'Delhi', status: 'Active', imageUrl: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=800', propertyType: 'Business Luxury' },
];

export const mockRoomCategories: RoomCategory[] = [
    { id: 'room-01', propertyId: 'prop-01', name: 'Presidential Suite', nightlyRate: 150000, description: 'Sea facing ultra-luxury suite with dedicated butler service.', imageUrl: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?q=80&w=800' },
    { id: 'room-02', propertyId: 'prop-01', name: 'Luxury Grande Room', nightlyRate: 45000, description: 'Spacious heritage room with traditional artifacts.', imageUrl: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?q=80&w=800' },
];

export const mockAccommodationRequests: AccommodationRequest[] = [
    { id: 'ACC-001', hotelPartnerId: 'hotel-01', propertyName: 'The Taj Mahal Palace', guestName: 'Tony Stark', checkIn: '2025-03-15', checkOut: '2025-03-17', rooms: 1, status: 'Pending', requesterId: 'demo_super_user' },
    { id: 'ACC-002', hotelPartnerId: 'hotel-01', propertyName: 'The Taj Mahal Palace', guestName: 'Pepper Potts', checkIn: '2025-03-15', checkOut: '2025-03-17', rooms: 1, status: 'Confirmed', requesterId: 'demo_super_user' },
];

export const mockCrewMembers: CrewMember[] = [
  { id: 'crw-01', crewId: 'CRW101', operatorId: 'op-west-01', name: 'Captain Vikram Singh', designation: 'Pilot', licenseNumber: 'ATPL-9988', phone: '+91 92222 22222', email: 'vikram@flyco.aero', status: 'ACTIVE' },
  { id: 'crw-02', crewId: 'CRW102', operatorId: 'op-west-01', name: 'First Officer Ananya', designation: 'Co-Pilot', licenseNumber: 'CPL-4455', phone: '+91 93333 33333', email: 'ananya@flyco.aero', status: 'ACTIVE' },
  { id: 'crw-03', crewId: 'CRW103', operatorId: 'op-west-01', name: 'Neha Sharma', designation: 'Cabin Crew', licenseNumber: 'SEP-1122', phone: '+91 94444 44444', email: 'neha@flyco.aero', status: 'ACTIVE' },
];

export const mockCrewAssignments: CrewAssignment[] = [
  { id: 'asgn-01', assignmentId: 'ASN101', charterRequestId: 'RFQ-IND-002', aircraftId: 'ac-01', crewMembers: ['CRW101', 'CRW102'], status: 'ASSIGNED' },
];

export const mockCrewLogistics: CrewLogistics[] = [
  { id: 'log-01', logisticsId: 'LOG101', crewId: 'CRW101', tripId: 'RFQ-IND-002', hotelRequired: true, hotelBookingStatus: 'CONFIRMED', transportRequired: true, transportStatus: 'ARRANGED' },
];

export const mockAviationHubs: AviationHub[] = [
  { id: 'hub-01', icao: "VIDP", airportName: "Indira Gandhi Intl", city: "Delhi", latitude: 28.5562, longitude: 77.1000, operatorCount: 4, fleetSize: 12 },
  { id: 'hub-02', icao: "VABB", airportName: "Chhatrapati Shivaji Intl", city: "Mumbai", latitude: 19.0896, longitude: 72.8656, operatorCount: 5, fleetSize: 18 },
  { id: 'hub-03', icao: "VOBL", airportName: "Kempegowda Intl", city: "Bengaluru", latitude: 13.1986, longitude: 77.7066, operatorCount: 3, fleetSize: 8 },
];

export const mockOperationalActivities: OperationalActivity[] = [
    { id: 'act-01', type: 'rfq_created', message: 'New Heavy Jet RFQ created: Mumbai to London', timestamp: new Date().toISOString(), entityId: 'RFQ-CORP-001', actor: 'Tony Stark' },
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
