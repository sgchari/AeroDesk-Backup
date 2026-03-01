
import type { 
  User, 
  CharterRFQ, 
  EmptyLeg, 
  Aircraft, 
  Quotation, 
  AuditLog, 
  AccommodationRequest, 
  CorporateTravelDesk, 
  Property, 
  RoomCategory, 
  EmptyLegSeatAllocationRequest, 
  Operator, 
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
  Commission,
  PlatformChargeRule,
  EntityBillingLedger,
  PlatformInvoice,
  SubscriptionPlan,
  CommissionRule,
  RevenueShareConfig,
  CommissionLedgerEntry,
  SettlementRecord
} from './types';

/**
 * @fileOverview Institutional Data Registry (Simulation Mode - v2.1)
 * Provides a high-fidelity, multi-channel dataset for end-to-end platform drills.
 * All dates have been synchronized to the 2025 operational cycle.
 */

export const VERIFIED_NSOP_REGISTRY = [
    { companyName: 'FlyCo Charter', nsopLicenseNumber: 'NSOP/FLYCO/2021', city: 'Mumbai' },
    { companyName: 'Taj Air', nsopLicenseNumber: 'NSOP/TAJ/02', city: 'Mumbai' },
    { companyName: 'Club One Air', nsopLicenseNumber: 'NSOP/COA/05', city: 'Delhi' },
    { companyName: 'Titan Aviation', nsopLicenseNumber: 'NSOP/TITAN/11', city: 'Bangalore' },
];

// --- CORE USERS ---
export const mockUsers: User[] = [
    { id: 'admin-01', email: 'governance@demo.aerodesk.com', firstName: 'AeroDesk', lastName: 'Admin', role: 'Admin', status: 'Active', createdAt: "2025-01-01T10:00:00Z", updatedAt: "2025-01-01T10:00:00Z" },
    
    // Customers
    { id: 'cust-01', email: 'sanjana@demo.aerodesk.com', firstName: 'Sanjana', lastName: 'Kumar', role: 'Customer', status: 'Active', createdAt: "2025-01-15T11:20:00Z", updatedAt: "2025-01-15T11:20:00Z" },
    { id: 'cust-02', email: 'vikram@demo.aerodesk.com', firstName: 'Vikram', lastName: 'Malhotra', role: 'Customer', status: 'Active', createdAt: "2025-02-10T09:30:00Z", updatedAt: "2025-02-10T09:30:00Z" },
    
    // Operators
    { id: 'op-01', email: 'ops@flyco.demo.aerodesk.com', firstName: 'Rajesh', lastName: 'Verma', role: 'Operator', status: 'Approved', company: 'FlyCo Charter', createdAt: "2025-01-10T09:00:00Z", updatedAt: "2025-01-10T09:00:00Z" },
    { id: 'op-02', email: 'dispatch@tajair.demo.aerodesk.com', firstName: 'Vikram', lastName: 'Singh', role: 'Operator', status: 'Approved', company: 'Taj Air', createdAt: "2025-01-15T10:00:00Z", updatedAt: "2025-01-15T10:00:00Z" },
    { id: 'op-03', email: 'fleet@clubone.demo.aerodesk.com', firstName: 'Anita', lastName: 'Desai', role: 'Operator', status: 'Approved', company: 'Club One Air', createdAt: "2025-01-01T11:00:00Z", updatedAt: "2025-01-01T11:00:00Z" },
    
    // Agencies
    { id: 'ag-01', email: 'amit@sky-dist.demo.aerodesk.com', firstName: 'Amit', lastName: 'Patel', role: 'Travel Agency', company: 'Sky Distributors', status: 'Active', createdAt: "2025-01-12T16:00:00Z", updatedAt: "2025-01-12T16:00:00Z" },
    { id: 'ag-02', email: 'karan@global-elite.demo.aerodesk.com', firstName: 'Karan', lastName: 'Johar', role: 'Travel Agency', company: 'Global Elite Travel', status: 'Active', createdAt: "2025-02-01T10:00:00Z", updatedAt: "2025-02-01T10:00:00Z" },
    
    // Corporate Travel Desks
    { id: 'ctd-01', email: 'priya@stark.demo.aerodesk.com', firstName: 'Priya', lastName: 'Sharma', role: 'CTD Admin', company: 'Stark Industries', status: 'Active', createdAt: "2025-01-01T14:00:00Z", updatedAt: "2025-01-01T14:00:00Z", ctdId: 'ctd-corp-01' },
    { id: 'ctd-02', email: 'rahul@reliance.demo.aerodesk.com', firstName: 'Rahul', lastName: 'Mehta', role: 'CTD Admin', company: 'Reliance Exec', status: 'Active', createdAt: "2025-01-15T09:00:00Z", updatedAt: "2025-01-15T09:00:00Z", ctdId: 'ctd-corp-02' },
    
    // Hotels
    { id: 'hotel-01', email: 'concierge@grand.demo.aerodesk.com', firstName: 'Manish', lastName: 'Joshi', role: 'Hotel Partner', company: 'The Grand Mumbai', status: 'Active', createdAt: "2025-01-20T08:00:00Z", updatedAt: "2025-01-20T08:00:00Z" },
    { id: 'hotel-02', email: 'ops@oberoi.demo.aerodesk.com', firstName: 'Suresh', lastName: 'Raina', role: 'Hotel Partner', company: 'Oberoi Delhi', status: 'Active', createdAt: "2025-01-10T10:00:00Z", updatedAt: "2025-01-10T10:00:00Z" },
];

export const mockOperators: Operator[] = [
    { id: 'op-01', externalAuthId: 'op-01', companyName: 'FlyCo Charter', nsopLicenseNumber: 'NSOP/FLYCO/2021', contactPersonName: 'Rajesh Verma', contactEmail: 'ops@flyco.demo.aerodesk.com', status: 'Approved', mouAcceptedAt: '2025-01-10T09:00:00Z', createdAt: '2025-01-10T09:00:00Z', updatedAt: '2025-01-10T09:00:00Z', city: 'Mumbai', zone: 'West', fleetCount: 12 },
    { id: 'op-02', externalAuthId: 'op-02', companyName: 'Taj Air', nsopLicenseNumber: 'NSOP/TAJ/02', contactPersonName: 'Vikram Singh', contactEmail: 'dispatch@tajair.demo.aerodesk.com', status: 'Approved', mouAcceptedAt: '2025-01-15T10:00:00Z', createdAt: '2025-01-15T10:00:00Z', updatedAt: '2025-01-15T10:00:00Z', city: 'Mumbai', zone: 'West', fleetCount: 8 },
    { id: 'op-03', externalAuthId: 'op-03', companyName: 'Club One Air', nsopLicenseNumber: 'NSOP/COA/05', contactPersonName: 'Anita Desai', contactEmail: 'fleet@clubone.demo.aerodesk.com', status: 'Approved', mouAcceptedAt: '2025-01-01T11:00:00Z', createdAt: '2025-01-01T11:00:00Z', updatedAt: '2025-01-01T11:00:00Z', city: 'Delhi', zone: 'North', fleetCount: 15 }
];

export const mockAircrafts: Aircraft[] = [
    { id: 'AC-001', operatorId: 'op-01', name: 'Cessna Citation XLS+', type: 'Mid-size Jet', registration: 'VT-FLY', paxCapacity: 8, homeBase: 'BOM', status: 'Available', exteriorImageUrl: 'https://images.unsplash.com/photo-1540962351504-03099e0a754b?q=80&w=800' },
    { id: 'AC-002', operatorId: 'op-01', name: 'Bombardier Global 6000', type: 'Heavy Jet', registration: 'VT-STK', paxCapacity: 14, homeBase: 'DEL', status: 'Available', exteriorImageUrl: 'https://images.unsplash.com/photo-1616193572425-fd11332ec645?q=80&w=800' },
    { id: 'AC-003', operatorId: 'op-02', name: 'Falcon 2000', type: 'Heavy Jet', registration: 'VT-TAJ', paxCapacity: 10, homeBase: 'BOM', status: 'Available' },
    { id: 'AC-004', operatorId: 'op-03', name: 'Embraer Phenom 300', type: 'Light Jet', registration: 'VT-COA', paxCapacity: 6, homeBase: 'DEL', status: 'Under Maintenance' },
    { id: 'AC-005', operatorId: 'op-03', name: 'Beechcraft King Air B200', type: 'Turboprop', registration: 'VT-PRP', paxCapacity: 7, homeBase: 'BLR', status: 'Available' }
];

export const mockRfqs: CharterRFQ[] = [
    // Bidding Phase
    { id: 'RFQ-DEMO-001', customerId: 'cust-01', requesterExternalAuthId: 'cust-01', customerName: 'Sanjana Kumar', tripType: 'Onward', departure: 'Mumbai (VABB)', arrival: 'Delhi (VIDP)', departureDate: '2025-03-15', pax: 4, aircraftType: 'Light Jet', status: 'Bidding Open', createdAt: '2025-02-20T12:00:00Z', bidsCount: 2, bookingChannel: 'direct' },
    
    // Corporate Phase - Stark Industries
    { id: 'RFQ-CORP-001', customerId: 'ctd-01', requesterExternalAuthId: 'ctd-01', company: 'Stark Industries', customerName: 'Priya Sharma', tripType: 'Onward', departure: 'Delhi (VIDP)', arrival: 'London (LHR)', departureDate: '2025-03-20', pax: 6, aircraftType: 'Heavy Jet', status: 'Pending Approval', createdAt: '2025-02-25T10:00:00Z', bidsCount: 0, bookingChannel: 'corporate', costCenter: 'EXEC-PROJ-A', businessPurpose: 'Strategic Global Tech Summit - Board Coordination' },
    
    // Corporate Phase - Reliance Exec
    { id: 'RFQ-CORP-002', customerId: 'ctd-02', requesterExternalAuthId: 'ctd-02', company: 'Reliance Exec', customerName: 'Rahul Mehta', tripType: 'Return', departure: 'Mumbai (VABB)', arrival: 'Bangalore (VOBL)', departureDate: '2025-03-25', pax: 3, aircraftType: 'Mid-size Jet', status: 'Pending Approval', createdAt: '2025-02-26T14:00:00Z', bidsCount: 0, bookingChannel: 'corporate', costCenter: 'RE-LOGISTICS', businessPurpose: 'Facility Inspection & Regional Site Governance' },

    // Agency Execution Phase
    { id: 'RFQ-EXEC-003', customerId: 'ag-01', requesterExternalAuthId: 'ag-01', agencyId: 'ag-01', operatorId: 'op-01', customerName: 'Sky Distributors (Client: Smith)', tripType: 'Onward', departure: 'Mumbai (VABB)', arrival: 'Dubai (DXB)', departureDate: '2025-02-28', pax: 2, aircraftType: 'Heavy Jet', status: 'boarding', createdAt: '2025-02-15T10:00:00Z', bidsCount: 3, totalAmount: 4200000, bookingChannel: 'agency' },
    
    // Completed Phase
    { id: 'RFQ-DONE-004', customerId: 'cust-02', requesterExternalAuthId: 'cust-02', operatorId: 'op-02', customerName: 'Vikram Malhotra', tripType: 'Return', departure: 'Mumbai (VABB)', arrival: 'Goa (VOGO)', departureDate: '2025-02-10', pax: 4, aircraftType: 'Mid-size Jet', status: 'tripClosed', createdAt: '2025-01-10T09:00:00Z', bidsCount: 4, totalAmount: 1250000, bookingChannel: 'direct' }
];

export const mockQuotations: Quotation[] = [
    { id: 'QT-901', rfqId: 'RFQ-DEMO-001', operatorId: 'op-01', operatorName: 'FlyCo Charter', aircraftId: 'AC-001', aircraftName: 'VT-FLY', price: 850000, status: 'Submitted', submittedAt: '2025-02-21T10:00:00Z', validUntil: '2025-03-05' },
    { id: 'QT-902', rfqId: 'RFQ-DEMO-001', operatorId: 'op-02', operatorName: 'Taj Air', aircraftId: 'AC-003', aircraftName: 'VT-TAJ', price: 920000, status: 'Submitted', submittedAt: '2025-02-21T11:30:00Z', validUntil: '2025-03-05' }
];

export const mockEmptyLegs: EmptyLeg[] = [
    { id: 'EL-901', operatorId: 'op-01', operatorName: 'FlyCo Charter', aircraftId: 'AC-001', aircraftName: 'Cessna Citation', departure: 'Mumbai (VABB)', arrival: 'Delhi (VIDP)', departureTime: '2025-03-15T14:00:00Z', availableSeats: 4, seatsAllocated: 2, status: 'Published', seatPricingStrategy: 'Dynamic', estimatedPricePerSeat: 45000 },
    { id: 'EL-902', operatorId: 'op-03', operatorName: 'Club One Air', aircraftId: 'AC-005', aircraftName: 'King Air B200', departure: 'Bangalore (VOBL)', arrival: 'Hyderabad (VOHS)', departureTime: '2025-03-18T09:00:00Z', availableSeats: 6, seatsAllocated: 0, status: 'Published', seatPricingStrategy: 'Fixed', estimatedPricePerSeat: 22000 }
];

export const mockEmptyLegSeatAllocationRequests: EmptyLegSeatAllocationRequest[] = [
    { id: 'SL-REQ-001', emptyLegId: 'EL-901', operatorId: 'op-01', requesterExternalAuthId: 'ag-01', agencyId: 'ag-01', numberOfSeats: 2, status: 'seatApproved', requestDateTime: '2025-02-25T10:00:00Z', bookingChannel: 'agency', clientReference: 'The Oberoi Group' }
];

// --- FINANCIAL DATA ---
export const mockCommissionRules: CommissionRule[] = [
  { id: 'CR-01', serviceType: 'charter', commissionRatePercent: 5, effectiveFrom: '2025-01-01', isActive: true, createdBy: 'admin-01', createdAt: '2025-01-01T00:00:00Z' },
  { id: 'CR-02', serviceType: 'seat', commissionRatePercent: 8, effectiveFrom: '2025-01-01', isActive: true, createdBy: 'admin-01', createdAt: '2025-01-01T00:00:00Z' },
  { id: 'CR-03', serviceType: 'accommodation', commissionRatePercent: 10, effectiveFrom: '2025-01-01', isActive: true, createdBy: 'admin-01', createdAt: '2025-01-01T00:00:00Z' },
];

export const mockRevenueShareConfigs: RevenueShareConfig[] = [
  { id: 'RSC-01', scopeType: 'global', agencySharePercent: 60, aerodeskSharePercent: 40, effectiveFrom: '2025-01-01', isActive: true, createdBy: 'admin-01', createdAt: '2025-01-01T00:00:00Z' },
  { id: 'RSC-02', scopeType: 'entity', entityId: 'ag-01', agencySharePercent: 70, aerodeskSharePercent: 30, effectiveFrom: '2025-01-01', isActive: true, createdBy: 'admin-01', createdAt: '2025-01-01T00:00:00Z' }
];

export const mockCommissionLedger: CommissionLedgerEntry[] = [
  { id: 'CLE-001', transactionId: 'RFQ-EXEC-003', entityId: 'ag-01', agencyId: 'ag-01', bookingChannel: 'agency', entityType: 'Travel Agency', serviceType: 'charter', grossAmount: 4200000, commissionRatePercent: 5, totalCommission: 210000, agencySharePercent: 70, aerodeskSharePercent: 30, agencyCommissionAmount: 147000, aerodeskCommissionAmount: 63000, status: 'pending', ruleVersionReference: 'RSC-02', createdAt: '2025-02-20T10:30:00Z' },
  { id: 'CLE-002', transactionId: 'RFQ-DONE-004', entityId: 'admin-01', agencyId: null, bookingChannel: 'direct', entityType: 'Admin', serviceType: 'charter', grossAmount: 1250000, commissionRatePercent: 5, totalCommission: 62500, agencySharePercent: 0, aerodeskSharePercent: 100, agencyCommissionAmount: 0, aerodeskCommissionAmount: 62500, status: 'settled', ruleVersionReference: 'DIRECT', createdAt: '2025-02-15T11:00:00Z' },
];

export const mockSettlementRecords: SettlementRecord[] = [
  { id: 'SET-001', entityId: 'ag-01', entityName: 'Sky Distributors', settlementPeriodStart: '2025-01-01', settlementPeriodEnd: '2025-01-31', totalAgencyCommission: 85000, status: 'paid', paymentReference: 'BNK-992211', createdAt: '2025-02-01T09:00:00Z' }
];

export const mockPlatformInvoices: PlatformInvoice[] = [
  { id: 'PL-INV-001', entityId: 'op-01', entityName: 'FlyCo Charter', entityType: 'Operator', billingPeriodStart: '2025-01-01', billingPeriodEnd: '2025-01-31', totalAmount: 1370000, dueDate: '2025-02-10', status: 'paid', createdAt: '2025-02-01T09:00:00Z' },
  { id: 'PL-INV-002', entityId: 'op-02', entityName: 'Taj Air', entityType: 'Operator', billingPeriodStart: '2025-01-01', billingPeriodEnd: '2025-01-31', totalAmount: 450000, dueDate: '2025-03-15', status: 'issued', createdAt: '2025-02-01T09:00:00Z' }
];

// --- INFRASTRUCTURE & ANCILLARY ---
export const mockCorporateTravelDesks: CorporateTravelDesk[] = [
    { id: 'ctd-corp-01', companyName: 'Stark Industries', adminExternalAuthId: 'ctd-01', status: 'Active', createdAt: "2025-01-01T14:00:00Z", updatedAt: "2025-01-01T14:00:00Z" },
    { id: 'ctd-corp-02', companyName: 'Reliance Exec', adminExternalAuthId: 'ctd-02', status: 'Active', createdAt: "2025-01-15T09:00:00Z", updatedAt: "2025-01-15T09:00:00Z" }
];

export const mockProperties: Property[] = [
    { id: 'PROP-01', hotelPartnerId: 'hotel-01', name: 'The Grand Mumbai', address: 'Sahar Airport Rd', city: 'Mumbai', status: 'Active', propertyType: 'Luxury Hotel', imageUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=800' },
    { id: 'PROP-02', hotelPartnerId: 'hotel-02', name: 'Oberoi Delhi', address: 'Dr. Zakir Hussain Marg', city: 'Delhi', status: 'Active', propertyType: 'Boutique Luxury', imageUrl: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=800' }
];

export const mockRoomCategories: RoomCategory[] = [
    { id: 'ROOM-01', propertyId: 'PROP-01', name: 'Deluxe King Suite', description: 'Executive suite with airport view.', maxOccupancy: 2, beddingType: 'King', nightlyRate: 18500 },
    { id: 'ROOM-02', propertyId: 'PROP-02', name: 'Presidential Suite', description: 'Institutional grade security and luxury.', maxOccupancy: 4, beddingType: 'Double King', nightlyRate: 145000 }
];

export const mockAccommodationRequests: AccommodationRequest[] = [
    { id: 'ACC-REQ-001', agencyId: 'ag-01', hotelPartnerId: 'hotel-01', propertyId: 'PROP-01', propertyName: 'The Grand Mumbai', roomCategory: 'Deluxe King Suite', checkIn: '2025-02-28', checkOut: '2025-03-02', rooms: 1, guestName: 'John Smith', status: 'stayConfirmed', tripReferenceId: 'RFQ-EXEC-003', tripType: 'Charter', requesterId: 'ag-01', createdAt: '2025-02-15T10:00:00Z', updatedAt: '2025-02-16T09:00:00Z', bookingChannel: 'agency' }
];

export const mockAuditLogs: AuditLog[] = [
    { id: 'AUDIT-01', timestamp: '2025-02-25T10:00:00Z', user: 'Admin', role: 'Admin', action: 'RULE_CHANGE', details: 'Updated commission rule for Charter to 5%', targetId: 'CR-01' },
    { id: 'AUDIT-02', timestamp: '2025-02-25T11:00:00Z', user: 'Rajesh Verma', role: 'Operator', action: 'STATUS_UPDATE', details: 'Updated VT-FLY to Available', targetId: 'AC-001' }
];

export const mockCrew: CrewMember[] = [
    { id: 'CREW-01', operatorId: 'op-01', firstName: 'Rahul', lastName: 'Kapoor', email: 'rahul@flyco.demo.aerodesk.com', role: 'Captain', status: 'Available', licenseNumber: 'ATPL-9988', assignedAircraftRegistration: 'VT-FLY', createdAt: '2025-01-10T00:00:00Z', updatedAt: '2025-01-10T00:00:00Z' },
    { id: 'CREW-02', operatorId: 'op-01', firstName: 'Sanya', lastName: 'Malhotra', email: 'sanya@flyco.demo.aerodesk.com', role: 'Cabin Crew', status: 'On Duty', assignedAircraftRegistration: 'VT-FLY', createdAt: '2025-01-10T00:00:00Z', updatedAt: '2025-01-10T00:00:00Z' }
];

// Content Data
export const mockBlogPosts: BlogPost[] = [
  {
    id: 'post-1',
    title: "India's Evolving NSOP Framework: 2025 Outlook",
    excerpt: "An analysis of the new DGCA guidelines for non-scheduled operators and their impact on private charter infrastructure.",
    category: 'Private Aviation',
    imageUrl: 'https://images.unsplash.com/photo-1566212775038-532d06eda485?q=80&w=1080',
    author: 'Capt. Rajesh V.',
    date: '2025-02-15',
    isFeatured: true
  },
  {
    id: 'post-2',
    title: "The Rise of Corporate Shuttle Coordination",
    excerpt: "How Indian enterprises are utilizing long-term jet seat blocks to optimize executive movement across manufacturing hubs.",
    category: 'Corporate Travel',
    imageUrl: 'https://images.unsplash.com/photo-1616142387171-fadb42551e7a?q=80&w=1080',
    author: 'Priya Sharma',
    date: '2025-02-10'
  },
  {
    id: 'post-3',
    title: "Decentralizing Aviation: Tier-2 City Connectivity",
    excerpt: "Operational insights into the growth of charter activity in cities like Indore, Raipur, and Guwahati.",
    category: 'Market Trends',
    imageUrl: 'https://images.unsplash.com/photo-1716161051573-5aad6047161a?q=80&w=1080',
    author: 'Amit Patel',
    date: '2025-02-05'
  },
  {
    id: 'post-4',
    title: "Compliance-First: The New Standard for Charter",
    excerpt: "Why digital audit trails are becoming mandatory for high-value corporate travel governance.",
    category: 'Operator Perspectives',
    imageUrl: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=1080',
    author: 'Vikram Singh',
    date: '2025-01-28'
  }
];

export const mockPressReleases: PressRelease[] = [
  {
    id: 'pr-1',
    title: "AeroDesk Announces Institutional Network Expansion",
    description: "New partnerships with 12 leading NSOP holders solidify AeroDesk as India's premier coordination infrastructure.",
    date: '2025-02-20',
    category: 'Corporate'
  },
  {
    id: 'pr-2',
    title: "Digital Compliance Protocol v2.0 Launched",
    description: "Enhanced AI-driven verification for passenger manifests and DGCA license synchronization.",
    date: '2025-01-15',
    category: 'Technology'
  }
];

export const mockMediaMentions: MediaMention[] = [
  {
    id: 'mm-1',
    publication: 'Economic Times',
    title: "AeroDesk: The Digital Spine of Indian Private Aviation",
    snippet: "How a startup is bringing institutional governance to the fragmented charter market.",
    date: '2025-02-18'
  },
  {
    id: 'mm-2',
    publication: 'Aviation Week',
    title: "Streamlining NSOP Workflows in South Asia",
    snippet: "AeroDesk's coordination model cited as a case study for regional infrastructure maturity.",
    date: '2025-01-30'
  }
];

export const mockBrandAssets: BrandAsset[] = [
  {
    id: 'ba-1',
    title: "Platform UI Overview",
    type: "Image",
    imageUrl: "https://images.unsplash.com/photo-1761813409462-9329c23c7541?q=80&w=1080",
    fileSize: "2.4 MB"
  },
  {
    id: 'ba-2',
    title: "Institutional Logo Set",
    type: "Vector",
    imageUrl: "https://images.unsplash.com/photo-1711919600878-b5d9e77d3357?q=80&w=1080",
    fileSize: "1.8 MB"
  }
];

// Fallback exports
export const mockFeatureFlags: FeatureFlag[] = [
    { id: 'FF-01', name: 'AI_REVENUE_INSIGHTS', description: 'Enable AI-driven revenue forecasting on dashboards', isEnabled: true },
    { id: 'FF-02', name: 'INSTANT_SETTLEMENT', description: 'Allow real-time bank gateway settlement', isEnabled: false }
];
export const mockPolicyFlags: PolicyFlag[] = [
    { id: 'POL-01', ctdId: 'ctd-corp-01', name: 'International Heavy Jet Justification', description: 'Require detailed justification for flights outside APAC using Heavy Jets.', isEnforced: true }
];
export const mockManifests: PassengerManifest[] = [];
export const mockInvoices: Invoice[] = [];
export const mockPayments: Payment[] = [];
export const mockActivityLogs: ActivityLog[] = [];
export const mockPlatformChargeRules: PlatformChargeRule[] = [];
export const mockBillingLedger: EntityBillingLedger[] = [];
export const mockSubscriptionPlans: SubscriptionPlan[] = [];

