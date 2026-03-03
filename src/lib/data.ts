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
  Operator, 
  TravelAgency,
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
  HotelPartner,
  SeatAllocation,
  SeatInventoryLog
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
      id: 'admin-01', 
      email: 'governance@aerodesk.aero', 
      firstName: 'AeroDesk', 
      lastName: 'Governance', 
      role: 'Admin', 
      platformRole: 'admin', 
      firmRole: 'admin',
      status: 'active', 
      avatar: 'https://picsum.photos/seed/admin/200/200',
      createdAt: "2025-01-01T10:00:00Z", 
      updatedAt: "2025-01-01T10:00:00Z" 
    },
    // WEST ZONE
    { id: 'op-west-01', email: 'rajesh@flyco.aero', firstName: 'Rajesh', lastName: 'Verma', role: 'Operator', platformRole: 'operator', firmRole: 'admin', operatorId: 'op-west-01', status: 'active', avatar: 'https://picsum.photos/seed/opw1/200/200', createdAt: "2025-01-10T09:00:00Z", updatedAt: "2025-01-10T09:00:00Z" },
    { id: 'ag-west-01', email: 'amit@sky-dist.aero', firstName: 'Amit', lastName: 'Patel', role: 'Travel Agency', platformRole: 'agency', firmRole: 'admin', agencyId: 'ag-west-01', status: 'active', avatar: 'https://picsum.photos/seed/agw1/200/200', createdAt: "2025-01-12T16:00:00Z", updatedAt: "2025-01-12T16:00:00Z" },
    { id: 'corp-west-01', email: 'priya@stark.corp', firstName: 'Priya', lastName: 'Sharma', role: 'CTD Admin', platformRole: 'corporate', firmRole: 'admin', corporateId: 'corp-west-01', status: 'active', avatar: 'https://picsum.photos/seed/corpw1/200/200', createdAt: "2025-01-01T14:00:00Z", updatedAt: "2025-01-01T14:00:00Z" },
    // NORTH ZONE
    { id: 'op-north-01', email: 'vikram@delhiair.aero', firstName: 'Vikram', lastName: 'Singh', role: 'Operator', platformRole: 'operator', firmRole: 'admin', operatorId: 'op-north-01', status: 'active', avatar: 'https://picsum.photos/seed/opn1/200/200', createdAt: "2025-01-15T10:00:00Z", updatedAt: "2025-01-15T10:00:00Z" },
    { id: 'ag-north-01', email: 'north@travel.aero', firstName: 'Sanjeev', lastName: 'Bansal', role: 'Travel Agency', platformRole: 'agency', firmRole: 'admin', agencyId: 'ag-north-01', status: 'active', avatar: 'https://picsum.photos/seed/agn1/200/200', createdAt: "2025-01-15T10:00:00Z", updatedAt: "2025-01-15T10:00:00Z" },
    { id: 'corp-north-01', email: 'neha@airtel.corp', firstName: 'Neha', lastName: 'Kapoor', role: 'CTD Admin', platformRole: 'corporate', firmRole: 'admin', corporateId: 'corp-north-01', status: 'active', avatar: 'https://picsum.photos/seed/corpn1/200/200', createdAt: "2025-01-05T11:00:00Z", updatedAt: "2025-01-05T11:00:00Z" },
    // SOUTH ZONE
    { id: 'op-south-01', email: 'karthik@deccan.aero', firstName: 'Karthik', lastName: 'Reddy', role: 'Operator', platformRole: 'operator', firmRole: 'admin', operatorId: 'op-south-01', status: 'active', avatar: 'https://picsum.photos/seed/ops1/200/200', createdAt: "2025-01-20T09:00:00Z", updatedAt: "2025-01-20T09:00:00Z" },
    { id: 'ag-south-01', email: 'south@travel.aero', firstName: 'Vijay', lastName: 'Naidu', role: 'Travel Agency', platformRole: 'agency', firmRole: 'admin', agencyId: 'ag-south-01', status: 'active', avatar: 'https://picsum.photos/seed/ags1/200/200', createdAt: "2025-01-20T09:00:00Z", updatedAt: "2025-01-20T09:00:00Z" },
    { id: 'corp-south-01', email: 'south@infosys.corp', firstName: 'Lakshmi', lastName: 'Menon', role: 'CTD Admin', platformRole: 'corporate', firmRole: 'admin', corporateId: 'corp-south-01', status: 'active', avatar: 'https://picsum.photos/seed/corps1/200/200', createdAt: "2025-01-20T09:00:00Z", updatedAt: "2025-01-20T09:00:00Z" },
    // EAST ZONE
    { id: 'op-east-01', email: 'east@wings.aero', firstName: 'Subhash', lastName: 'Das', role: 'Operator', platformRole: 'operator', firmRole: 'admin', operatorId: 'op-east-01', status: 'active', avatar: 'https://picsum.photos/seed/ope1/200/200', createdAt: "2025-01-25T10:00:00Z", updatedAt: "2025-01-25T10:00:00Z" },
    { id: 'ag-east-01', email: 'east@travel.aero', firstName: 'Joydeep', lastName: 'Sen', role: 'Travel Agency', platformRole: 'agency', firmRole: 'admin', agencyId: 'ag-east-01', status: 'active', avatar: 'https://picsum.photos/seed/age1/200/200', createdAt: "2025-01-25T10:00:00Z", updatedAt: "2025-01-25T10:00:00Z" },
    { id: 'corp-east-01', email: 'east@tata.corp', firstName: 'Anirban', lastName: 'Roy', role: 'CTD Admin', platformRole: 'corporate', firmRole: 'admin', corporateId: 'corp-east-01', status: 'active', avatar: 'https://picsum.photos/seed/corpe1/200/200', createdAt: "2025-01-25T10:00:00Z", updatedAt: "2025-01-25T10:00:00Z" },
    // CENTRAL ZONE
    { id: 'op-central-01', email: 'central@air.aero', firstName: 'Amitabh', lastName: 'Pandey', role: 'Operator', platformRole: 'operator', firmRole: 'admin', operatorId: 'op-central-01', status: 'active', avatar: 'https://picsum.photos/seed/opc1/200/200', createdAt: "2025-01-28T10:00:00Z", updatedAt: "2025-01-28T10:00:00Z" },
    { id: 'ag-central-01', email: 'central@travel.aero', firstName: 'Preeti', lastName: 'Gupta', role: 'Travel Agency', platformRole: 'agency', firmRole: 'admin', agencyId: 'ag-central-01', status: 'active', avatar: 'https://picsum.photos/seed/agc1/200/200', createdAt: "2025-01-28T10:00:00Z", updatedAt: "2025-01-28T10:00:00Z" },
    { id: 'corp-central-01', email: 'central@reliance.corp', firstName: 'Vikram', lastName: 'Bajpai', role: 'CTD Admin', platformRole: 'corporate', firmRole: 'admin', corporateId: 'corp-central-01', status: 'active', avatar: 'https://picsum.photos/seed/corpc1/200/200', createdAt: "2025-01-28T10:00:00Z", updatedAt: "2025-01-28T10:00:00Z" },
    // HOTEL PARTNER
    { id: 'hotel-admin-01', email: 'concierge@grandhotels.com', firstName: 'Ananya', lastName: 'Iyer', role: 'Hotel Partner', platformRole: 'hotel', firmRole: 'admin', hotelPartnerId: 'hotel-01', status: 'active', avatar: 'https://picsum.photos/seed/hotel1/200/200', createdAt: "2025-01-05T10:00:00Z", updatedAt: "2025-01-05T10:00:00Z" },
    // INDIVIDUAL CUSTOMER
    { id: 'cust-01', email: 'rahul@malhotra.me', firstName: 'Rahul', lastName: 'Malhotra', role: 'Customer', platformRole: 'individual', firmRole: 'viewer', status: 'active', avatar: 'https://picsum.photos/seed/cust1/200/200', createdAt: "2025-02-01T10:00:00Z", updatedAt: "2025-02-01T10:00:00Z" }
];

export const mockOperators: Operator[] = [
    { id: 'op-west-01', companyName: 'FlyCo Charter (West)', nsopLicenseNumber: 'NSOP/FLYCO/2021', officialEmail: 'ops@flyco.aero', registeredAddress: 'Hangar 1, Juhu Aerodrome, Mumbai', contactNumber: '+91 22 2822 2202', profileStatus: 'active', adminUserId: 'op-west-01', status: 'Approved', gstin: '27AAAAA0000A1Z5', stateCode: '27', legalEntityName: 'FlyCo Aviation West Pvt Ltd', city: 'Mumbai', zone: 'West', fleetCount: 12, createdAt: '2025-01-10T09:00:00Z', updatedAt: '2025-01-10T09:00:00Z' },
    { id: 'op-north-01', companyName: 'Delhi Air Logistics', nsopLicenseNumber: 'NSOP/DAL/2022', officialEmail: 'ops@delhiair.aero', registeredAddress: 'Terminal 1, IGI Airport, Delhi', contactNumber: '+91 11 4455 6677', profileStatus: 'active', adminUserId: 'op-north-01', status: 'Approved', gstin: '07BBBBB1111B1Z2', stateCode: '07', legalEntityName: 'Delhi Air Logistics Pvt Ltd', city: 'Delhi', zone: 'North', fleetCount: 8, createdAt: '2025-01-15T10:00:00Z', updatedAt: '2025-01-15T10:00:00Z' },
    { id: 'op-south-01', companyName: 'Deccan Charters', nsopLicenseNumber: 'NSOP/DEC/11', officialEmail: 'ops@deccan.aero', registeredAddress: 'HAL Airport Road, Bengaluru', contactNumber: '+91 80 2233 4455', profileStatus: 'active', adminUserId: 'op-south-01', status: 'Approved', gstin: '29DDDDD2222D1Z4', stateCode: '29', legalEntityName: 'Deccan Charters Limited', city: 'Bengaluru', zone: 'South', fleetCount: 15, createdAt: '2025-01-20T09:00:00Z', updatedAt: '2025-01-20T09:00:00Z' },
    { id: 'op-east-01', companyName: 'East Wings Aviation', nsopLicenseNumber: 'NSOP/EAST/2023', officialEmail: 'ops@eastwings.aero', registeredAddress: 'Netaji Subhash Chandra Bose Int Airport, Kolkata', contactNumber: '+91 33 2233 4455', profileStatus: 'active', adminUserId: 'op-east-01', status: 'Approved', gstin: '19EEEEE3333E1Z1', stateCode: '19', legalEntityName: 'East Wings Aviation Pvt Ltd', city: 'Kolkata', zone: 'East', fleetCount: 6, createdAt: '2025-01-25T10:00:00Z', updatedAt: '2025-01-25T10:00:00Z' },
    { id: 'op-central-01', companyName: 'Central Air Bhopal', nsopLicenseNumber: 'NSOP/CENT/2024', officialEmail: 'ops@centralair.aero', registeredAddress: 'Raja Bhoj Airport, Bhopal', contactNumber: '+91 755 2233 445', profileStatus: 'active', adminUserId: 'op-central-01', status: 'Approved', gstin: '23FFFFF4444F1Z2', stateCode: '23', legalEntityName: 'Central Air Logistics Pvt Ltd', city: 'Bhopal', zone: 'Central', fleetCount: 4, createdAt: '2025-01-28T10:00:00Z', updatedAt: '2025-01-28T10:00:00Z' }
];

export const mockAgencies: TravelAgency[] = [
    { id: 'ag-west-01', companyName: 'Sky Distributors (West)', officialEmail: 'info@skydist.aero', address: 'Suite 405, BKC, Mumbai', contactNumber: '+91 22 4455 6677', adminUserId: 'ag-west-01', gstin: '27CCCCC2222C1Z3', stateCode: '27', legalEntityName: 'Sky Distribution West India', createdAt: '2025-01-12T16:00:00Z', updatedAt: '2025-01-12T16:00:00Z' },
    { id: 'ag-north-01', companyName: 'Capital Travel Partners', officialEmail: 'ops@capitaltravel.aero', address: 'Connaught Place, Delhi', contactNumber: '+91 11 2233 4455', adminUserId: 'ag-north-01', gstin: '07AAAAA1111A1Z1', stateCode: '07', legalEntityName: 'Capital Travel Partners LLC', createdAt: '2025-01-15T10:00:00Z', updatedAt: '2025-01-15T10:00:00Z' }
];

export const mockCorporates: CorporateTravelDesk[] = [
    { id: 'corp-west-01', companyName: 'Stark Industries', officialEmail: 'travel@stark.corp', address: 'Stark Tower, Mumbai', adminUserId: 'corp-west-01', status: 'Active', gstin: '27DDDDD3333D1Z4', stateCode: '27', legalEntityName: 'Stark Industries West India', createdAt: '2025-01-01T14:00:00Z', updatedAt: '2025-01-01T14:00:00Z' },
    { id: 'corp-north-01', companyName: 'Airtel Enterprise', officialEmail: 'travel@airtel.corp', address: 'Airtel Center, Gurgaon', adminUserId: 'corp-north-01', status: 'Active', gstin: '06AAAAA5555A1Z1', stateCode: '06', legalEntityName: 'Bharti Airtel Limited', createdAt: '2025-01-05T11:00:00Z', updatedAt: '2025-01-05T11:00:00Z' }
];

export const mockHotelPartners: HotelPartner[] = [
    { id: 'hotel-01', companyName: 'Grand Hotels Group', officialEmail: 'partners@grandhotels.com', address: 'Gateway of India, Mumbai', status: 'Approved', createdAt: '2025-01-05T10:00:00Z', updatedAt: '2025-01-05T10:00:00Z', gstin: '27EEEEE4444E1Z1', stateCode: '27', legalEntityName: 'Grand Hospitality Services' }
];

export const mockAircrafts: Aircraft[] = [
    { id: 'ac-01', operatorId: 'op-west-01', name: 'Cessna Citation XLS+', type: 'Light Jet', registration: 'VT-FLY', paxCapacity: 8, homeBase: 'BOM', status: 'Available', exteriorImageUrl: 'https://images.unsplash.com/photo-1540962351504-03099e0a754b?q=80&w=800' },
    { id: 'ac-02', operatorId: 'op-west-01', name: 'Bombardier Global 6000', type: 'Heavy Jet', registration: 'VT-JSG', paxCapacity: 14, homeBase: 'BOM', status: 'Under Maintenance', exteriorImageUrl: 'https://images.unsplash.com/photo-1616193572425-fd11332ec645?q=80&w=800' },
];

export const mockRfqs: CharterRFQ[] = [
    { id: 'RFQ-CORP-001', customerId: 'corp-west-01', requesterExternalAuthId: 'corp-west-01', customerName: 'Priya Sharma', company: 'Stark Industries', tripType: 'Onward', departure: 'Mumbai (VABB)', arrival: 'Delhi (VIDP)', departureDate: '2025-03-15', pax: 5, aircraftType: 'Any Light Jet', status: 'Bidding Open', createdAt: '2025-02-10T10:00:00Z', updatedAt: '2025-02-10T10:00:00Z', costCenter: 'STRK-EXEC-25' },
    { id: 'RFQ-LIVE-001', customerId: 'cust-01', requesterExternalAuthId: 'cust-01', customerName: 'Rahul Malhotra', tripType: 'Onward', departure: 'Delhi (VIDP)', arrival: 'Mumbai (VABB)', departureDate: '2025-02-20', pax: 2, aircraftType: 'Mid-size Jet', status: 'departed', createdAt: '2025-02-18T10:00:00Z', updatedAt: '2025-02-20T12:00:00Z', totalAmount: 1250000, operatorId: 'op-north-01' },
    { id: 'RFQ-LIVE-002', customerId: 'corp-north-01', requesterExternalAuthId: 'corp-north-01', customerName: 'Neha Kapoor', company: 'Airtel Enterprise', tripType: 'Onward', departure: 'Bengaluru (VOBL)', arrival: 'Delhi (VIDP)', departureDate: '2025-02-20', pax: 4, aircraftType: 'Light Jet', status: 'boarding', createdAt: '2025-02-19T09:00:00Z', updatedAt: '2025-02-20T14:00:00Z', totalAmount: 950000, operatorId: 'op-south-01' },
    { id: 'RFQ-LIVE-003', customerId: 'ag-east-01', requesterExternalAuthId: 'ag-east-01', customerName: 'Joydeep Sen', tripType: 'Onward', departure: 'Kolkata (VECC)', arrival: 'Guwahati (VEGT)', departureDate: '2025-02-20', pax: 3, aircraftType: 'Turboprop', status: 'operationalPreparation', createdAt: '2025-02-19T15:00:00Z', updatedAt: '2025-02-20T10:00:00Z', totalAmount: 450000, operatorId: 'op-east-01' },
];

export const mockQuotations: Quotation[] = [
    { id: 'QUOTE-001', rfqId: 'RFQ-CORP-001', operatorId: 'op-west-01', operatorName: 'FlyCo Charter', aircraftId: 'ac-01', aircraftName: 'Cessna Citation XLS+', price: 850000, status: 'Submitted', submittedAt: '2025-02-11T09:00:00Z', validUntil: '2025-02-15', operatorRemarks: 'Inclusive of fuel and landing fees.' }
];

export const mockEmptyLegs: EmptyLeg[] = [
    { id: 'EL-LIVE-001', operatorId: 'op-west-01', operatorName: 'FlyCo Charter', aircraftId: 'ac-01', aircraftName: 'VT-FLY', aircraftType: 'Light Jet', departure: 'Mumbai', arrival: 'Delhi', departureTime: '2025-03-10T14:00:00Z', totalCapacity: 8, availableSeats: 6, seatAllocationEnabled: true, pricingModel: 'fixed', pricePerSeat: 45000, minSeatsPerRequest: 1, bookingChannelAllowed: 'both', status: 'live', createdAt: '2025-02-01T10:00:00Z' },
    { id: 'EL-LIVE-002', operatorId: 'op-north-01', operatorName: 'Delhi Air Logistics', aircraftId: 'ac-03', aircraftName: 'VT-PC', aircraftType: 'Mid-size Jet', departure: 'Delhi', arrival: 'Bengaluru', departureTime: '2025-03-12T10:00:00Z', totalCapacity: 10, availableSeats: 8, seatAllocationEnabled: true, pricingModel: 'fixed', pricePerSeat: 55000, minSeatsPerRequest: 2, bookingChannelAllowed: 'agency', status: 'live', createdAt: '2025-02-05T10:00:00Z' },
];

export const mockSeatRequests: SeatAllocation[] = [
    { id: 'SAR-001', flightId: 'EL-LIVE-001', operatorId: 'op-west-01', customerId: 'ag-west-01', agencyId: 'ag-west-01', bookingChannel: 'agency', seatsRequested: 2, pricePerSeat: 45000, totalAmount: 90000, status: 'pendingApproval', paymentStatus: 'pending', passengerName: 'Anil Ambani', clientReference: 'VIP-WEST-01', createdAt: '2025-02-15T10:00:00Z' }
];

export const mockSeatInventoryLogs: SeatInventoryLog[] = [
    { id: 'LOG-001', flightId: 'EL-LIVE-001', seatsBefore: 8, seatsAfter: 6, actionType: 'hold', changedBy: 'System (SAR-001)', timestamp: '2025-02-15T10:00:00Z' }
];

export const mockAuditLogs: AuditLog[] = [
    { id: 'audit-01', actionType: 'PROFILE_UPDATE', entityType: 'Operator', entityId: 'op-west-01', changedBy: 'op-admin-01', timestamp: '2025-02-10T10:30:00Z', user: 'Rajesh Verma', role: 'Operator Admin', action: 'Updated NSOP Document', details: 'Renewal document uploaded for verification.', targetId: 'op-west-01' },
];

export const mockAccommodationRequests: AccommodationRequest[] = [
    { id: 'ACC-001', hotelPartnerId: 'hotel-01', propertyName: 'Taj Mahal Palace', guestName: 'Vikram Malhotra', checkIn: '2025-02-01', checkOut: '2025-02-04', rooms: 2, status: 'Confirmed', requesterId: 'cust-01' },
];

export const mockFeatureFlags: FeatureFlag[] = [
    { id: 'ff-01', name: 'EmptyLegAutoExpiry', description: 'Automatically expire EL listings after departure time.', isEnabled: true },
];

export const mockPolicyFlags: PolicyFlag[] = [
    { id: 'pol-01', ctdId: 'corp-west-01', name: 'Premium Cabin Restriction', description: 'Heavy jet category requires senior director approval.', isEnforced: true },
];

export const mockProperties: Property[] = [
    { id: 'prop-01', hotelPartnerId: 'hotel-01', name: 'The Taj Mahal Palace', city: 'Mumbai', address: 'Colaba, Mumbai', status: 'Active', imageUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=800' },
];

export const mockRoomCategories: RoomCategory[] = [
    { id: 'room-01', propertyId: 'prop-01', name: 'Deluxe King Room', maxOccupancy: 2, nightlyRate: 18500, beddingType: 'King' },
];

export const mockTaxConfig: TaxConfig[] = [
    { id: 'tax-01', serviceType: 'charter', taxRatePercent: 18, sacCode: '9964', effectiveFrom: '2025-01-01', isActive: true },
];

export const mockPlatformInvoices: PlatformInvoice[] = [
    { id: 'PINV-001', entityName: 'FlyCo Charter', entityType: 'Operator', totalAmount: 42500, dueDate: '2025-02-15', status: 'paid' },
];

export const mockPlatformChargeRules: PlatformChargeRule[] = [
    { id: 'pcr-01', entityType: 'Operator', serviceType: 'charter', chargeType: 'percentage', percentageRate: 0.05, fixedAmount: 0, isActive: true },
];

export const mockBillingLedger: EntityBillingLedger[] = [
    { id: 'ebl-01', relatedTransactionId: 'RFQ-DEMO-004', serviceType: 'charter', grossAmount: 850000, platformChargeAmount: 42500, ledgerStatus: 'paid' },
];

export const mockCommissionRules: CommissionRule[] = [
    { id: 'cru-01', serviceType: 'charter', commissionRatePercent: 5, effectiveFrom: '2025-01-01', isActive: true },
];

export const mockRevenueShareConfigs: RevenueShareConfig[] = [
    { id: 'rsc-01', scopeType: 'global', agencySharePercent: 60, aerodeskSharePercent: 40, isActive: true },
];

export const mockCommissionLedger: CommissionLedgerEntry[] = [
    { id: 'cle-01', transactionId: 'RFQ-DEMO-004', bookingChannel: 'direct', grossAmount: 850000, totalCommission: 42500, agencyCommissionAmount: 0, aerodeskCommissionAmount: 42500, agencySharePercent: 0, status: 'settled', serviceType: 'charter', createdAt: '2025-02-02T12:00:00Z' },
];

export const mockSettlementRecords: SettlementRecord[] = [
    { id: 'SET-001', entityName: 'FlyCo Charter', settlementPeriodStart: '2025-01-01', settlementPeriodEnd: '2025-01-31', totalAgencyCommission: 0, status: 'paid', paymentReference: 'BATCH-JAN-01' },
];

export const mockBlogPosts: BlogPost[] = [
    { id: 'post-01', title: 'Future of NSOP', excerpt: 'Digital standardisation.', category: 'Institutional', author: 'AeroDesk Intelligence', date: '2025-02-10', imageUrl: 'https://images.unsplash.com/photo-1566212775038-532d06eda485?q=80&w=800' },
];

export const mockPressReleases: PressRelease[] = [
    { id: 'pr-01', title: 'AeroDesk Expansion', description: 'New hubs active.', date: '2025-02-01', category: 'Expansion' },
];

export const mockMediaMentions: MediaMention[] = [
    { id: 'mm-01', publication: 'Aviation Week', title: 'Digital Transformation', snippet: 'AeroDesk leads the way.', date: '2025-01-15' },
];

export const mockBrandAssets: BrandAsset[] = [
    { id: 'ba-01', title: 'Logo Pack', type: 'Vector', imageUrl: 'https://images.unsplash.com/photo-1711919600878-b5d9e77d3357?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwyfHxhdmlhdGlvbiUyMGxvZ298ZW58MHx8fHwxNzcyMDgzMDIyfDA&ixlib=rb-4.1.0&q=80&w=1080', fileSize: '2.4MB' },
];
