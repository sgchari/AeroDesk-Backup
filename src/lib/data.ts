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
  SeatAllocation
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
    { 
        id: 'op-west-01', 
        companyName: 'FlyCo Charter (West)', 
        nsopLicenseNumber: 'NSOP/FLYCO/2021', 
        officialEmail: 'ops@flyco.aero', 
        registeredAddress: 'Hangar 1, Juhu Aerodrome, Mumbai', 
        contactNumber: '+91 22 2822 2202', 
        profileStatus: 'active', 
        adminUserId: 'demo_super_user', 
        status: 'Approved', 
        gstin: '27AAAAA0000A1Z5', 
        stateCode: '27', 
        legalEntityName: 'FlyCo Aviation West Pvt Ltd', 
        city: 'Mumbai', 
        zone: 'West', 
        fleetCount: 12, 
        createdAt: '2025-01-10T09:00:00Z', 
        updatedAt: '2025-01-10T09:00:00Z' 
    },
    { 
        id: 'op-north-01', 
        companyName: 'Club One Air (North)', 
        nsopLicenseNumber: 'NSOP/COA/05', 
        officialEmail: 'dispatch@clubone.aero', 
        registeredAddress: 'Terminal 1D, IGI Airport, Delhi', 
        status: 'Approved', 
        city: 'Delhi', 
        zone: 'North', 
        fleetCount: 8, 
        createdAt: '2025-01-12T11:00:00Z', 
        updatedAt: '2025-01-12T11:00:00Z' 
    },
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
    { id: 'log-04', event: 'payment_verified', userId: 'admin-01', module: 'finance', action: 'Verified settlement for RFQ-DEMO-004', timestamp: new Date().toISOString() },
    { id: 'log-05', event: 'aircraft_status_change', userId: 'op-west-01', module: 'fleet', action: 'VT-FLY marked as AOG', timestamp: new Date().toISOString() },
];

export const mockRfqs: CharterRFQ[] = [
    { id: 'RFQ-CORP-001', customerId: 'demo_super_user', requesterExternalAuthId: 'demo_super_user', customerName: 'Tony Stark', company: 'Stark Industries', tripType: 'Onward', departure: 'Mumbai (VABB)', arrival: 'Delhi (VIDP)', departureDate: '2025-03-15', departureTime: '10:00', pax: 5, aircraftType: 'Heavy Jet', status: 'Bidding Open', createdAt: '2025-02-10T10:00:00Z', updatedAt: '2025-02-10T10:00:00Z', totalAmount: 1250000, bidsCount: 2 },
    { id: 'RFQ-CORP-002', customerId: 'demo_super_user', requesterExternalAuthId: 'demo_super_user', customerName: 'Pepper Potts', company: 'Stark Industries', tripType: 'Return', departure: 'Bangalore (VOBL)', arrival: 'Goa (VOGO)', departureDate: '2025-03-20', departureTime: '11:30', pax: 3, aircraftType: 'Mid-size Jet', status: 'charterConfirmed', createdAt: '2025-02-12T09:00:00Z', updatedAt: '2025-02-15T14:00:00Z', totalAmount: 850000, operatorId: 'op-west-01' },
    { id: 'RFQ-DEMO-003', customerId: 'demo_super_user', requesterExternalAuthId: 'demo_super_user', customerName: 'Happy Hogan', company: 'Stark Industries', tripType: 'Onward', departure: 'Delhi (VIDP)', arrival: 'Mumbai (VABB)', departureDate: '2025-02-28', departureTime: '08:00', pax: 2, aircraftType: 'Light Jet', status: 'boarding', createdAt: '2025-02-05T10:00:00Z', updatedAt: '2025-02-28T07:30:00Z', totalAmount: 420000, operatorId: 'op-north-01' },
    { id: 'RFQ-DEMO-004', customerId: 'demo_super_user', requesterExternalAuthId: 'demo_super_user', customerName: 'Bruce Banner', company: 'Stark Industries', tripType: 'Onward', departure: 'Chennai (VOMM)', arrival: 'Hyderabad (VOHS)', departureDate: '2025-02-01', departureTime: '14:00', pax: 1, aircraftType: 'Turboprop', status: 'tripClosed', createdAt: '2025-01-20T10:00:00Z', updatedAt: '2025-02-02T18:00:00Z', totalAmount: 310000, operatorId: 'op-west-01' },
    { id: 'RFQ-BIDS-005', customerId: 'user-005', requesterExternalAuthId: 'user-005', customerName: 'Mukesh A.', tripType: 'Onward', departure: 'Mumbai (VABB)', arrival: 'London (LHR)', departureDate: '2025-04-01', departureTime: '22:00', pax: 8, aircraftType: 'Heavy Jet', status: 'Bidding Open', createdAt: '2025-02-18T10:00:00Z', updatedAt: '2025-02-18T10:00:00Z', bidsCount: 4 },
    { id: 'RFQ-BIDS-006', customerId: 'user-006', requesterExternalAuthId: 'user-006', customerName: 'Ratan T.', tripType: 'Return', departure: 'Delhi (VIDP)', arrival: 'New York (JFK)', departureDate: '2025-05-10', departureTime: '06:00', pax: 4, aircraftType: 'Ultra Long Range', status: 'Bidding Open', createdAt: '2025-02-20T10:00:00Z', updatedAt: '2025-02-20T10:00:00Z', bidsCount: 1 },
];

export const mockEmptyLegs: EmptyLeg[] = [
    { id: 'EL-001', operatorId: 'op-west-01', operatorName: 'FlyCo Charter', aircraftId: 'ac-01', aircraftName: 'Citation XLS', aircraftType: 'Light Jet', departure: 'Mumbai', arrival: 'Delhi', departureTime: '2025-03-10T14:00:00Z', totalCapacity: 8, availableSeats: 6, status: 'live', createdAt: '2025-02-01T10:00:00Z', pricePerSeat: 45000, seatAllocationEnabled: true, minSeatsPerRequest: 1, pricingModel: 'Fixed' },
    { id: 'EL-002', operatorId: 'op-north-01', operatorName: 'Club One Air', aircraftId: 'ac-02', aircraftName: 'Legacy 650', aircraftType: 'Heavy Jet', departure: 'Delhi', arrival: 'Dubai', departureTime: '2025-03-12T09:00:00Z', totalCapacity: 13, availableSeats: 13, status: 'live', createdAt: '2025-02-05T10:00:00Z', pricePerSeat: 120000, seatAllocationEnabled: true, minSeatsPerRequest: 2, pricingModel: 'Dynamic' },
    { id: 'EL-003', operatorId: 'op-west-01', operatorName: 'FlyCo Charter', aircraftId: 'ac-03', aircraftName: 'Phenom 300', aircraftType: 'Light Jet', departure: 'Goa', arrival: 'Mumbai', departureTime: '2025-03-15T18:00:00Z', totalCapacity: 6, availableSeats: 2, status: 'live', createdAt: '2025-02-10T10:00:00Z', pricePerSeat: 35000, seatAllocationEnabled: true, minSeatsPerRequest: 1, pricingModel: 'Fixed' },
    { id: 'EL-004', operatorId: 'op-west-01', operatorName: 'FlyCo Charter', aircraftId: 'ac-04', aircraftName: 'Global 6000', aircraftType: 'Heavy Jet', departure: 'Bangalore', arrival: 'Singapore', departureTime: '2025-03-25T10:00:00Z', totalCapacity: 14, availableSeats: 14, status: 'Published', createdAt: '2025-02-15T10:00:00Z', pricePerSeat: 185000, seatAllocationEnabled: true, minSeatsPerRequest: 1, pricingModel: 'Fixed' },
];

export const mockAircraft: Aircraft[] = [
    { id: 'ac-01', operatorId: 'op-west-01', name: 'Cessna Citation XLS+', type: 'Light Jet', registration: 'VT-FLY', paxCapacity: 8, homeBase: 'Mumbai (VABB)', status: 'Available', hourlyRate: 180000, exteriorImageUrl: 'https://images.unsplash.com/photo-1540962351504-03099e0a754b?q=80&w=800' },
    { id: 'ac-02', operatorId: 'op-north-01', name: 'Embraer Legacy 650', type: 'Heavy Jet', registration: 'VT-STK', paxCapacity: 13, homeBase: 'Delhi (VIDP)', status: 'Available', hourlyRate: 450000, exteriorImageUrl: 'https://images.unsplash.com/photo-1569154941061-e231b4725ef1?q=80&w=800' },
    { id: 'ac-03', operatorId: 'op-west-01', name: 'Beechcraft King Air B200', type: 'Turboprop', registration: 'VT-PC', paxCapacity: 7, homeBase: 'Pune (VAPO)', status: 'Under Maintenance', hourlyRate: 95000, exteriorImageUrl: 'https://images.unsplash.com/photo-1544099858-75fe7a84ce88?q=80&w=800' },
    { id: 'ac-04', operatorId: 'op-west-01', name: 'Bombardier Global 6000', type: 'Heavy Jet', registration: 'VT-JSG', paxCapacity: 14, homeBase: 'Mumbai (VABB)', status: 'Available', hourlyRate: 650000, exteriorImageUrl: 'https://images.unsplash.com/photo-1616193572425-fd11332ec645?q=80&w=800' },
];

export const mockCrew: CrewMember[] = [
    { id: 'crew-01', operatorId: 'op-west-01', firstName: 'Rajesh', lastName: 'Khanna', role: 'Captain', status: 'Available', licenseNumber: 'ATPL-4521', assignedAircraftRegistration: 'VT-FLY' },
    { id: 'crew-02', operatorId: 'op-west-01', firstName: 'Vikram', lastName: 'Sethi', role: 'First Officer', status: 'On Duty', licenseNumber: 'CPL-8892', assignedAircraftRegistration: 'VT-JSG' },
    { id: 'crew-03', operatorId: 'op-west-01', firstName: 'Ananya', lastName: 'Roy', role: 'Cabin Crew', status: 'Available', licenseNumber: 'CC-1102', assignedAircraftRegistration: 'FLOAT' },
];

export const mockSeatAllocations: SeatAllocation[] = [
    { id: 'SA-001', flightId: 'EL-001', operatorId: 'op-west-01', customerId: 'demo_super_user', customerName: 'Tony Stark', bookingChannel: 'direct', seatsRequested: 2, pricePerSeat: 45000, totalAmount: 90000, status: 'approved', paymentStatus: 'paid', createdAt: '2025-02-15T10:00:00Z', passengers: [{ fullName: 'Tony Stark', nationality: 'USA', idType: 'Passport', idNumber: 'A1234567' }, { fullName: 'Pepper Potts', nationality: 'USA', idType: 'Passport', idNumber: 'B7654321' }] },
    { id: 'SA-002', flightId: 'EL-003', operatorId: 'op-west-01', customerId: 'ag-west-01', customerName: 'Sky Distributors', bookingChannel: 'agency', seatsRequested: 4, pricePerSeat: 35000, totalAmount: 140000, status: 'pendingApproval', paymentStatus: 'pending', createdAt: '2025-02-18T14:00:00Z', clientReference: 'VIP-CLIENT-LUX', passengers: [] },
];

export const mockAuditLogs: AuditLog[] = [
    { id: 'audit-01', timestamp: '2025-02-10T10:30:00Z', user: 'AeroDesk Admin', role: 'Platform Admin', action: 'Updated NSOP Document', details: 'Renewal document uploaded for verification.', targetId: 'op-west-01' },
    { id: 'audit-02', timestamp: '2025-02-12T14:20:00Z', user: 'System', role: 'Automated', action: 'GTV Reconciliation', details: 'Matched 14 invoices for January cycle.', targetId: 'FIN-JAN-25' },
    { id: 'audit-03', timestamp: '2025-02-15T09:00:00Z', user: 'FlyCo Admin', role: 'Operator Admin', action: 'Aircraft Status Update', details: 'VT-PC moved to Under Maintenance.', targetId: 'ac-03' },
];

export const mockAccommodationRequests: AccommodationRequest[] = [
    { id: 'ACC-001', hotelPartnerId: 'hotel-01', propertyName: 'Taj Mahal Palace', guestName: 'Vikram Malhotra', checkIn: '2025-02-01', checkOut: '2025-02-04', rooms: 2, status: 'Confirmed', requesterId: 'demo_super_user' },
    { id: 'ACC-002', hotelPartnerId: 'hotel-01', propertyName: 'Taj Mahal Palace', guestName: 'Tony Stark', checkIn: '2025-03-15', checkOut: '2025-03-18', rooms: 1, status: 'Pending', requesterId: 'demo_super_user' },
    { id: 'ACC-003', hotelPartnerId: 'hotel-02', propertyName: 'Oberoi Amarvilas', guestName: 'Pepper Potts', checkIn: '2025-03-20', checkOut: '2025-03-22', rooms: 1, status: 'Confirmed', requesterId: 'demo_super_user' },
];

export const mockFeatureFlags: FeatureFlag[] = [
    { id: 'ff-01', name: 'EmptyLegAutoExpiry', description: 'Automatically expire EL listings after departure time.', isEnabled: true },
    { id: 'ff-02', name: 'AIPilotEnabled', description: 'Enable AI-driven charter matching engine.', isEnabled: true },
    { id: 'ff-03', name: 'DirectMessaging', description: 'Enable direct channel between operators and agencies.', isEnabled: false },
];

export const mockPolicyFlags: PolicyFlag[] = [
    { id: 'pol-01', ctdId: 'corp-west-01', name: 'Premium Cabin Restriction', description: 'Heavy jet category requires senior director approval.', isEnforced: true },
    { id: 'pol-02', ctdId: 'corp-west-01', name: 'Lead Time protocol', description: 'Charter requests must be submitted > 48h prior to departure.', isEnforced: false },
];

export const mockProperties: Property[] = [
    { id: 'prop-01', hotelPartnerId: 'hotel-01', name: 'The Taj Mahal Palace', city: 'Mumbai', status: 'Active', imageUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=800' },
    { id: 'prop-02', hotelPartnerId: 'hotel-01', name: 'Taj Land’s End', city: 'Mumbai', status: 'Active', imageUrl: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=800' },
    { id: 'prop-03', hotelPartnerId: 'hotel-02', name: 'The Oberoi', city: 'Gurgaon', status: 'Active', imageUrl: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?q=80&w=800' },
];

export const mockRoomCategories: RoomCategory[] = [
    { id: 'room-01', propertyId: 'prop-01', name: 'Deluxe King Room', nightlyRate: 18500, description: 'Heritage wing garden view with luxury inclusions.' },
    { id: 'room-02', propertyId: 'prop-01', name: 'Presidential Suite', nightlyRate: 145000, description: 'Sea facing ultra-luxury suite with full butler service.' },
    { id: 'room-03', propertyId: 'prop-03', name: 'Executive Suite', nightlyRate: 32000, description: 'Modern business suite with boardroom access.' },
];

export const mockTaxConfig: TaxConfig[] = [
    { id: 'tax-01', serviceType: 'charter', taxRatePercent: 18, sacCode: '9964', effectiveFrom: '2025-01-01', isActive: true },
    { id: 'tax-02', serviceType: 'accommodation', taxRatePercent: 12, sacCode: '9963', effectiveFrom: '2025-01-01', isActive: true },
];

export const mockPlatformInvoices: PlatformInvoice[] = [
    { id: 'PINV-001', entityName: 'FlyCo Charter', totalAmount: 42500, dueDate: '2025-02-15', status: 'paid', entityType: 'Operator' },
    { id: 'PINV-002', entityName: 'Sky Distributors', totalAmount: 12000, dueDate: '2025-03-01', status: 'issued', entityType: 'Travel Agency' },
    { id: 'PINV-003', entityName: 'Club One Air', totalAmount: 28500, dueDate: '2025-02-10', status: 'overdue', entityType: 'Operator' },
];

export const mockPlatformChargeRules: PlatformChargeRule[] = [
    { id: 'pcr-01', entityType: 'Operator', serviceType: 'charter', chargeType: 'percentage', percentageRate: 0.05, fixedAmount: 0, isActive: true },
    { id: 'pcr-02', entityType: 'Travel Agency', serviceType: 'seat', chargeType: 'hybrid', percentageRate: 0.02, fixedAmount: 500, isActive: true },
];

export const mockBillingLedger: EntityBillingLedger[] = [
    { id: 'ebl-01', relatedTransactionId: 'RFQ-DEMO-004', serviceType: 'charter', grossAmount: 850000, platformChargeAmount: 42500, ledgerStatus: 'paid' },
    { id: 'ebl-02', relatedTransactionId: 'RFQ-DEMO-003', serviceType: 'charter', grossAmount: 420000, platformChargeAmount: 21000, ledgerStatus: 'pending' },
];

export const mockCommissionRules: CommissionRule[] = [
    { id: 'cru-01', serviceType: 'charter', commissionRatePercent: 5, effectiveFrom: '2025-01-01', isActive: true },
    { id: 'cru-02', serviceType: 'seat', commissionRatePercent: 10, effectiveFrom: '2025-01-01', isActive: true },
];

export const mockRevenueShareConfigs: RevenueShareConfig[] = [
    { id: 'rsc-01', scopeType: 'global', agencySharePercent: 60, aerodeskSharePercent: 40, isActive: true },
    { id: 'rsc-02', scopeType: 'serviceType', serviceType: 'seat', agencySharePercent: 70, aerodeskSharePercent: 30, isActive: true },
];

export const mockCommissionLedger: CommissionLedgerEntry[] = [
    { id: 'cle-01', transactionId: 'RFQ-DEMO-004', entityId: 'ag-west-01', bookingChannel: 'direct', grossAmount: 850000, agencyCommissionAmount: 0, aerodeskCommissionAmount: 42500, totalCommission: 42500, status: 'settled', serviceType: 'charter', agencySharePercent: 0, createdAt: '2025-02-02T12:00:00Z' },
    { id: 'cle-02', transactionId: 'EL-BOOK-001', entityId: 'ag-west-01', bookingChannel: 'agency', grossAmount: 45000, agencyCommissionAmount: 2700, aerodeskCommissionAmount: 1800, totalCommission: 4500, status: 'pending', serviceType: 'seat', agencySharePercent: 60, createdAt: '2025-02-15T10:00:00Z' },
];

export const mockSettlementRecords: SettlementRecord[] = [
    { id: 'SET-001', entityId: 'ag-west-01', entityName: 'Sky Distributors', settlementPeriodStart: '2025-01-01', settlementPeriodEnd: '2025-01-31', totalAgencyCommission: 125000, status: 'paid', createdAt: '2025-02-05T10:00:00Z' },
    { id: 'SET-002', entityId: 'ag-west-01', entityName: 'Sky Distributors', settlementPeriodStart: '2025-02-01', settlementPeriodEnd: '2025-02-28', totalAgencyCommission: 42000, status: 'processed', createdAt: '2025-03-02T10:00:00Z' },
];

export const mockBlogPosts: BlogPost[] = [
    { id: 'post-01', title: "India's 2025 NSOP Infrastructure Roadmap", excerpt: "Analyzing the transition from fragmented regional operations to a unified digital infrastructure layer.", category: 'Market Trends', author: 'AeroDesk Intelligence', date: '2025-02-10', imageUrl: 'https://images.unsplash.com/photo-1566212775038-532d06eda485?q=80&w=1080' },
    { id: 'post-02', title: "The Empty Leg Yield Opportunity", excerpt: "How data-driven seat allocation is recovering millions in positioning costs for operators.", category: 'Operator Perspectives', author: 'FlyCo Strategy', date: '2025-02-15', imageUrl: 'https://images.unsplash.com/photo-1616142387171-fadb42551e7a?q=80&w=1080' },
];

export const mockPressReleases: PressRelease[] = [
    { id: 'pr-01', title: 'AeroDesk Expansion into Tier-2 Hubs', description: 'New coordination centers active in Ahmedabad and Jaipur.', date: '2025-02-01', category: 'Expansion' },
    { id: 'pr-02', title: 'Institutional Partnership with Taj Hotels', description: 'Seamless stay coordination now active for all network clients.', date: '2025-01-20', category: 'Partnerships' },
];

export const mockMediaMentions: MediaMention[] = [
    { id: 'mm-01', publication: 'Aviation Week', title: 'Digital Transformation in South Asia', snippet: 'AeroDesk leads the way in private aviation infrastructure.', date: '2025-01-15' },
    { id: 'mm-02', publication: 'Forbes India', title: 'High-Flying Tech', snippet: 'The platform digitizing India’s non-scheduled flight grid.', date: '2025-02-05' },
];

export const mockBrandAssets: BrandAsset[] = [
    { id: 'ba-01', title: 'Logo Pack', type: 'Vector', imageUrl: 'https://images.unsplash.com/photo-1711919600878-b5d9e77d3357?q=80&w=1080', fileSize: '2.4MB' },
    { id: 'ba-02', title: 'Fleet Photography', type: 'High-Res JPG', imageUrl: 'https://images.unsplash.com/photo-1616193572425-fd11332ec645?q=80&w=1080', fileSize: '18MB' },
];