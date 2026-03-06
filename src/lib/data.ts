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
  FlightSegment,
  RouteDemandHistory,
  EmptyLegPrediction,
  FleetOptimizationSuggestion,
  AviationHub,
  EmptyLegSeatListing,
  OperationalActivity
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

export const mockAviationHubs: AviationHub[] = [
  { id: 'hub-01', icao: "VIDP", airportName: "Indira Gandhi Intl", city: "Delhi", latitude: 28.5562, longitude: 77.1000 },
  { id: 'hub-02', icao: "VABB", airportName: "Chhatrapati Shivaji Intl", city: "Mumbai", latitude: 19.0896, longitude: 72.8656 },
  { id: 'hub-03', icao: "VOBL", airportName: "Kempegowda Intl", city: "Bengaluru", latitude: 13.1986, longitude: 77.7066 },
  { id: 'hub-04', icao: "VOHS", airportName: "Rajiv Gandhi Intl", city: "Hyderabad", latitude: 17.2403, longitude: 78.4294 },
  { id: 'hub-05', icao: "VOMM", airportName: "Chennai Intl", city: "Chennai", latitude: 12.9941, longitude: 80.1709 },
  { id: 'hub-06', icao: "VECC", airportName: "Netaji Subhash Chandra Bose Intl", city: "Kolkata", latitude: 22.6547, longitude: 88.4467 },
  { id: 'hub-07', icao: "VAAH", airportName: "Sardar Vallabhbhai Patel Intl", city: "Ahmedabad", latitude: 23.0734, longitude: 72.6266 },
  { id: 'hub-08', icao: "VOGO", airportName: "Dabolim Airport", city: "Goa", latitude: 15.3808, longitude: 73.8314 },
];

export const mockOperationalActivities: OperationalActivity[] = [
    { id: 'act-01', type: 'rfq_created', message: 'New Heavy Jet RFQ created: Mumbai to London', timestamp: new Date().toISOString(), entityId: 'RFQ-CORP-001', actor: 'Tony Stark' },
    { id: 'act-02', type: 'empty_leg_published', message: 'Empty Leg Published: Delhi to Jaipur', timestamp: new Date(Date.now() - 3600000).toISOString(), entityId: 'EL-001', actor: 'FlyCo Charter' },
    { id: 'act-03', type: 'quote_accepted', message: 'Technical Bid Accepted for Mission ADX-104', timestamp: new Date(Date.now() - 7200000).toISOString(), entityId: 'ADX-104', actor: 'Pepper Potts' },
];

export const mockEmptyLegSeatListings: EmptyLegSeatListing[] = [
    { id: 'seat-ls-01', flightId: 'EL-001', aircraft: 'Citation XLS', origin: 'VIDP', destination: 'VIJP', departureTime: '2025-03-10T10:00:00Z', seatCapacity: 6, seatsRemaining: 4, seatPrice: 20000, operatorId: 'op-west-01' },
];

export const mockAircraftPositions: AircraftPosition[] = [
    { id: 'pos-01', registration: 'VT-FLY', aircraftType: 'Citation XLS+', operator: 'FlyCo Charter', latitude: 19.0760, longitude: 72.8777, altitude: 0, velocity: 0, heading: 0, status: 'available', timestamp: new Date().toISOString() },
    { id: 'pos-02', registration: 'VT-STK', aircraftType: 'Legacy 650', operator: 'Club One Air', latitude: 22.5, longitude: 75.2, altitude: 35000, velocity: 450, heading: 120, status: 'inflight', timestamp: new Date().toISOString() },
    { id: 'pos-03', registration: 'VT-JSG', aircraftType: 'Global 6000', operator: 'FlyCo Charter', latitude: 12.9, longitude: 77.5, altitude: 12000, velocity: 320, heading: 45, status: 'scheduled', timestamp: new Date().toISOString() },
];

export const mockAircraftAvailability: AircraftAvailability[] = [
    { id: 'av-01', registration: 'VT-FLY', aircraftType: 'Citation XLS+', operator: 'FlyCo Charter', currentAirport: 'VABB', availableFrom: new Date().toISOString(), availabilityWindow: '3hours', seats: 8 },
    { id: 'av-02', registration: 'VT-PC', aircraftType: 'King Air B200', operator: 'FlyCo Charter', currentAirport: 'VAPO', availableFrom: new Date(Date.now() + 4 * 3600000).toISOString(), availabilityWindow: '6hours', seats: 7 },
];

export const mockDemandForecast: CharterDemandForecast[] = [
    { id: 'df-01', origin: 'Mumbai', destination: 'Goa', routeCode: 'VABB-VOGO', predictedDemandScore: 95, timeframe: '7days', aircraftTypeDemand: ['Phenom 300', 'Citation XLS'] },
    { id: 'df-02', origin: 'Delhi', destination: 'Dubai', routeCode: 'VIDP-OMDB', predictedDemandScore: 88, timeframe: '7days', aircraftTypeDemand: ['Legacy 650', 'Global 6000'] },
];

export const mockBlogPosts: BlogPost[] = [
    { id: 'post-01', title: "India's 2025 NSOP Infrastructure Roadmap", excerpt: "Analyzing the transition from fragmented regional operations to a unified digital infrastructure layer.", category: 'Market Trends', author: 'AeroDesk Intelligence', date: '2025-02-10', imageUrl: 'https://images.unsplash.com/photo-1566212775038-532d06eda485?q=80&w=1080' },
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

export const mockRfqs: CharterRFQ[] = [
    { id: 'RFQ-CORP-001', customerId: 'demo_super_user', requesterExternalAuthId: 'demo_super_user', customerName: 'Tony Stark', company: 'Stark Industries', tripType: 'Onward', departure: 'Mumbai (VABB)', arrival: 'Delhi (VIDP)', departureDate: '2025-03-15', departureTime: '10:00', pax: 5, aircraftType: 'Heavy Jet', status: 'Bidding Open', createdAt: '2025-02-10T10:00:00Z', updatedAt: '2025-02-10T10:00:00Z', totalAmount: 1250000, bidsCount: 2 },
];

export const mockEmptyLegs: EmptyLeg[] = [
    { id: 'EL-001', operatorId: 'op-west-01', operatorName: 'FlyCo Charter', aircraftId: 'ac-01', aircraftName: 'Citation XLS', aircraftType: 'Light Jet', departure: 'Mumbai', arrival: 'Delhi', departureTime: '2025-03-10T14:00:00Z', totalCapacity: 8, availableSeats: 6, status: 'live', createdAt: '2025-02-01T10:00:00Z', pricePerSeat: 45000, seatAllocationEnabled: true, minSeatsPerRequest: 1, pricingModel: 'Fixed' },
];

export const mockAircraft: Aircraft[] = [
    { id: 'ac-01', operatorId: 'op-west-01', name: 'Cessna Citation XLS+', type: 'Light Jet', registration: 'VT-FLY', paxCapacity: 8, homeBase: 'Mumbai (VABB)', status: 'Available', hourlyRate: 180000, exteriorImageUrl: 'https://images.unsplash.com/photo-1540962351504-03099e0a754b?q=80&w=800' },
];

export const mockOperators: Operator[] = [
    { id: 'op-west-01', companyName: 'FlyCo Charter (West)', nsopLicenseNumber: 'NSOP/FLYCO/2021', officialEmail: 'ops@flyco.aero', registeredAddress: 'Hangar 1, Juhu Aerodrome, Mumbai', contactNumber: '+91 22 2822 2202', profileStatus: 'active', adminUserId: 'demo_super_user', status: 'Approved', gstin: '27AAAAA0000A1Z5', stateCode: '27', legalEntityName: 'FlyCo Aviation West Pvt Ltd', city: 'Mumbai', zone: 'West', fleetCount: 12, createdAt: '2025-01-10T09:00:00Z', updatedAt: '2025-01-10T09:00:00Z' },
];

export const mockCorporates: CorporateTravelDesk[] = [
    { id: 'corp-west-01', companyName: 'Stark Industries', status: 'Active', adminExternalAuthId: 'demo_super_user', createdAt: '2025-01-01T10:00:00Z' },
];

export const mockAgencies: TravelAgency[] = [
    { id: 'ag-west-01', companyName: 'Sky Distributors', status: 'Active', createdAt: '2025-01-01T10:00:00Z' },
];

export const mockHotelPartners: HotelPartner[] = [
    { id: 'hotel-01', companyName: 'Grand Hotels Group', status: 'Active', createdAt: '2025-01-01T10:00:00Z' },
];
