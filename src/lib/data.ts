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
  EmptyLegSeatAllocationRequest
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
    { 
      id: 'op-west-01', 
      email: 'rajesh@flyco.aero', 
      firstName: 'Rajesh', 
      lastName: 'Verma', 
      role: 'Operator', 
      platformRole: 'operator', 
      firmRole: 'admin',
      operatorId: 'op-west-01',
      status: 'active', 
      avatar: 'https://picsum.photos/seed/opw1/200/200',
      createdAt: "2025-01-10T09:00:00Z", 
      updatedAt: "2025-01-10T09:00:00Z" 
    },
    { 
      id: 'ag-west-01', 
      email: 'amit@sky-dist.aero', 
      firstName: 'Amit', 
      lastName: 'Patel', 
      role: 'Travel Agency', 
      platformRole: 'agency', 
      firmRole: 'admin',
      agencyId: 'ag-west-01',
      status: 'active', 
      avatar: 'https://picsum.photos/seed/agw1/200/200',
      createdAt: "2025-01-12T16:00:00Z", 
      updatedAt: "2025-01-12T16:00:00Z" 
    },
    { 
      id: 'corp-west-01', 
      email: 'priya@stark.corp', 
      firstName: 'Priya', 
      lastName: 'Sharma', 
      role: 'CTD Admin', 
      platformRole: 'corporate', 
      firmRole: 'admin',
      corporateId: 'corp-west-01',
      status: 'active', 
      avatar: 'https://picsum.photos/seed/corpw1/200/200',
      createdAt: "2025-01-01T14:00:00Z", 
      updatedAt: "2025-01-01T14:00:00Z" 
    },
    // NORTH ZONE
    { 
      id: 'op-north-01', 
      email: 'vikram@delhiair.aero', 
      firstName: 'Vikram', 
      lastName: 'Singh', 
      role: 'Operator', 
      platformRole: 'operator', 
      firmRole: 'admin',
      operatorId: 'op-north-01',
      status: 'active', 
      avatar: 'https://picsum.photos/seed/opn1/200/200',
      createdAt: "2025-01-15T10:00:00Z", 
      updatedAt: "2025-01-15T10:00:00Z" 
    },
    { 
      id: 'corp-north-01', 
      email: 'neha@airtel.corp', 
      firstName: 'Neha', 
      lastName: 'Kapoor', 
      role: 'CTD Admin', 
      platformRole: 'corporate', 
      firmRole: 'admin',
      corporateId: 'corp-north-01',
      status: 'active', 
      avatar: 'https://picsum.photos/seed/corpn1/200/200',
      createdAt: "2025-01-05T11:00:00Z", 
      updatedAt: "2025-01-05T11:00:00Z" 
    },
    // SOUTH ZONE
    { 
      id: 'op-south-01', 
      email: 'karthik@deccan.aero', 
      firstName: 'Karthik', 
      lastName: 'Reddy', 
      role: 'Operator', 
      platformRole: 'operator', 
      firmRole: 'admin',
      operatorId: 'op-south-01',
      status: 'active', 
      avatar: 'https://picsum.photos/seed/ops1/200/200',
      createdAt: "2025-01-20T09:00:00Z", 
      updatedAt: "2025-01-20T09:00:00Z" 
    },
    // HOTEL PARTNER
    { 
      id: 'hotel-admin-01', 
      email: 'concierge@grandhotels.com', 
      firstName: 'Ananya', 
      lastName: 'Iyer', 
      role: 'Hotel Partner', 
      platformRole: 'hotel', 
      firmRole: 'admin',
      hotelPartnerId: 'hotel-01',
      status: 'active', 
      avatar: 'https://picsum.photos/seed/hotel1/200/200',
      createdAt: "2025-01-05T10:00:00Z", 
      updatedAt: "2025-01-05T10:00:00Z" 
    },
    // INDIVIDUAL CUSTOMER
    {
      id: 'cust-01',
      email: 'rahul@malhotra.me',
      firstName: 'Rahul',
      lastName: 'Malhotra',
      role: 'Customer',
      platformRole: 'individual',
      firmRole: 'viewer',
      status: 'active',
      avatar: 'https://picsum.photos/seed/cust1/200/200',
      createdAt: "2025-02-01T10:00:00Z",
      updatedAt: "2025-02-01T10:00:00Z"
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
      adminUserId: 'op-west-01',
      status: 'Approved',
      gstVerificationStatus: 'verified',
      gstin: '27AAAAA0000A1Z5',
      stateCode: '27',
      legalEntityName: 'FlyCo Aviation West Pvt Ltd',
      city: 'Mumbai',
      zone: 'West',
      fleetCount: 12,
      createdAt: '2025-01-10T09:00:00Z', 
      updatedAt: '2025-01-10T09:00:00Z',
    },
    { 
      id: 'op-north-01', 
      companyName: 'Delhi Air Logistics', 
      nsopLicenseNumber: 'NSOP/DAL/2022', 
      officialEmail: 'ops@delhiair.aero', 
      registeredAddress: 'Terminal 1, IGI Airport, Delhi',
      contactNumber: '+91 11 4455 6677',
      profileStatus: 'active',
      adminUserId: 'op-north-01',
      status: 'Approved',
      gstVerificationStatus: 'verified',
      gstin: '07BBBBB1111B1Z2',
      stateCode: '07',
      legalEntityName: 'Delhi Air Logistics Pvt Ltd',
      city: 'Delhi',
      zone: 'North',
      fleetCount: 8,
      createdAt: '2025-01-15T10:00:00Z', 
      updatedAt: '2025-01-15T10:00:00Z',
    },
    { 
      id: 'op-south-01', 
      companyName: 'Deccan Charters', 
      nsopLicenseNumber: 'NSOP/DEC/11', 
      officialEmail: 'ops@deccan.aero', 
      registeredAddress: 'HAL Airport Road, Bengaluru',
      contactNumber: '+91 80 2233 4455',
      profileStatus: 'active',
      adminUserId: 'op-south-01',
      status: 'Approved',
      gstVerificationStatus: 'verified',
      gstin: '29DDDDD2222D1Z4',
      stateCode: '29',
      legalEntityName: 'Deccan Charters Limited',
      city: 'Bengaluru',
      zone: 'South',
      fleetCount: 15,
      createdAt: '2025-01-20T09:00:00Z', 
      updatedAt: '2025-01-20T09:00:00Z',
    }
];

export const mockAgencies: TravelAgency[] = [
    {
      id: 'ag-west-01',
      companyName: 'Sky Distributors (West)',
      officialEmail: 'info@skydist.aero',
      address: 'Suite 405, BKC, Mumbai',
      contactNumber: '+91 22 4455 6677',
      adminUserId: 'ag-west-01',
      gstVerificationStatus: 'verified',
      gstin: '27CCCCC2222C1Z3',
      stateCode: '27',
      legalEntityName: 'Sky Distribution West India',
      createdAt: '2025-01-12T16:00:00Z',
      updatedAt: '2025-01-12T16:00:00Z'
    }
];

export const mockCorporates: CorporateTravelDesk[] = [
    {
      id: 'corp-west-01',
      companyName: 'Stark Industries',
      officialEmail: 'travel@stark.corp',
      address: 'Stark Tower, Mumbai',
      adminUserId: 'corp-west-01',
      status: 'Active',
      gstVerificationStatus: 'verified',
      gstin: '27DDDDD3333D1Z4',
      stateCode: '27',
      legalEntityName: 'Stark Industries West India',
      createdAt: '2025-01-01T14:00:00Z',
      updatedAt: '2025-01-01T14:00:00Z'
    },
    {
      id: 'corp-north-01',
      companyName: 'Airtel Enterprise',
      officialEmail: 'travel@airtel.corp',
      address: 'Airtel Center, Gurgaon',
      adminUserId: 'corp-north-01',
      status: 'Active',
      gstVerificationStatus: 'verified',
      gstin: '06AAAAA5555A1Z1',
      stateCode: '06',
      legalEntityName: 'Bharti Airtel Limited',
      createdAt: '2025-01-05T11:00:00Z',
      updatedAt: '2025-01-05T11:00:00Z'
    }
];

export const mockHotelPartners: HotelPartner[] = [
    {
        id: 'hotel-01',
        companyName: 'Grand Hotels Group',
        officialEmail: 'partners@grandhotels.com',
        address: 'Gateway of India, Mumbai',
        status: 'Approved',
        createdAt: '2025-01-05T10:00:00Z',
        updatedAt: '2025-01-05T10:00:00Z',
        gstVerificationStatus: 'verified',
        gstin: '27EEEEE4444E1Z1',
        stateCode: '27',
        legalEntityName: 'Grand Hospitality Services'
    }
];

export const mockAircrafts: Aircraft[] = [
    { id: 'ac-01', operatorId: 'op-west-01', name: 'Cessna Citation XLS+', type: 'Light Jet', registration: 'VT-FLY', paxCapacity: 8, homeBase: 'BOM', status: 'Available', exteriorImageUrl: 'https://images.unsplash.com/photo-1540962351504-03099e0a754b?q=80&w=800' },
    { id: 'ac-02', operatorId: 'op-west-01', name: 'Bombardier Global 6000', type: 'Heavy Jet', registration: 'VT-JSG', paxCapacity: 14, homeBase: 'BOM', status: 'Under Maintenance', exteriorImageUrl: 'https://images.unsplash.com/photo-1616193572425-fd11332ec645?q=80&w=800' },
];

export const mockRfqs: CharterRFQ[] = [
    { 
        id: 'RFQ-CORP-001', 
        customerId: 'corp-west-01', 
        requesterExternalAuthId: 'corp-west-01', 
        customerName: 'Priya Sharma', 
        company: 'Stark Industries',
        tripType: 'Onward', 
        departure: 'Mumbai (VABB)', 
        arrival: 'Delhi (VIDP)', 
        departureDate: '2025-03-15', 
        pax: 5, 
        aircraftType: 'Any Light Jet', 
        status: 'Bidding Open', 
        createdAt: '2025-02-10T10:00:00Z', 
        updatedAt: '2025-02-10T10:00:00Z',
        costCenter: 'STRK-EXEC-25'
    },
];

export const mockQuotations: Quotation[] = [
    {
        id: 'QUOTE-001',
        rfqId: 'RFQ-CORP-001',
        operatorId: 'op-west-01',
        operatorName: 'FlyCo Charter',
        aircraftId: 'ac-01',
        aircraftName: 'Cessna Citation XLS+',
        price: 850000,
        status: 'Submitted',
        submittedAt: '2025-02-11T09:00:00Z',
        validUntil: '2025-02-15',
        operatorRemarks: 'Inclusive of fuel and landing fees.'
    }
];

export const mockEmptyLegs: EmptyLeg[] = [
    { id: 'EL-001', operatorId: 'op-west-01', operatorName: 'FlyCo Charter', aircraftId: 'ac-01', aircraftName: 'VT-FLY', departure: 'Mumbai', arrival: 'Delhi', departureTime: '2025-03-10T14:00:00Z', availableSeats: 6, status: 'Published', createdAt: '2025-02-01T10:00:00Z' },
];

export const mockSeatRequests: EmptyLegSeatAllocationRequest[] = [
    { 
        id: 'SAR-001', 
        emptyLegId: 'EL-001', 
        distributorId: 'ag-west-01', 
        requesterExternalAuthId: 'ag-west-01', 
        numberOfSeats: 2, 
        status: 'Requested', 
        requestDateTime: '2025-02-15T10:00:00Z',
        passengerName: 'Anil Ambani',
        clientReference: 'VIP-WEST-01',
        passengerNotes: 'Requires high-protein catering and direct terminal transfer.'
    }
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
