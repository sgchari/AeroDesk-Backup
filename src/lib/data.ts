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
  SystemLog
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
        gstin: '27AAAAA0000A1Z5', 
        stateCode: '27', 
        legalEntityName: 'FlyCo Aviation West Pvt Ltd', 
        city: 'Mumbai', 
        zone: 'West', 
        fleetCount: 12, 
        createdAt: '2025-01-10T09:00:00Z', 
        updatedAt: '2025-01-10T09:00:00Z' 
    },
];

export const mockCorporates: CorporateTravelDesk[] = [
    { 
        id: 'corp-west-01', 
        companyName: 'Stark Industries', 
        status: 'Active', 
        adminExternalAuthId: 'demo_super_user', 
        createdAt: '2025-01-01T10:00:00Z',
        updatedAt: '2025-01-01T10:00:00Z'
    }
];

export const mockAgencies: TravelAgency[] = [
    { 
        id: 'ag-west-01', 
        companyName: 'Sky Distributors', 
        status: 'Active', 
        createdAt: '2025-01-01T10:00:00Z',
        updatedAt: '2025-01-01T10:00:00Z'
    }
];

export const mockHotelPartners: HotelPartner[] = [
    { 
        id: 'hotel-01', 
        companyName: 'Grand Hotels Group', 
        status: 'Active', 
        createdAt: '2025-01-01T10:00:00Z',
        updatedAt: '2025-01-01T10:00:00Z'
    }
];

export const mockAlerts: SystemAlert[] = [
    { id: 'al-01', type: 'operational', message: 'No operator response to RFQ-CORP-001 for > 24 hours.', severity: 'medium', timestamp: new Date().toISOString(), status: 'active' },
    { id: 'al-02', type: 'security', message: 'Repeated login failures detected for user admin@aerodesk.global.', severity: 'high', timestamp: new Date().toISOString(), status: 'resolved' },
    { id: 'al-03', type: 'system', message: 'Cloud Function "generateInvoice" execution time exceeded 30s.', severity: 'low', timestamp: new Date().toISOString(), status: 'resolved' },
];

export const mockSystemLogs: SystemLog[] = [
    { id: 'log-01', event: 'charter_request_created', userId: 'user-123', module: 'charter', action: 'Created RFQ-BOM-DEL', timestamp: new Date().toISOString() },
    { id: 'log-02', event: 'operator_bid_submitted', userId: 'op-west-01', module: 'marketplace', action: 'Submitted quote for RFQ-BOM-DEL', timestamp: new Date().toISOString() },
];

export const mockRfqs: CharterRFQ[] = [
    { id: 'RFQ-CORP-001', customerId: 'demo_super_user', requesterExternalAuthId: 'demo_super_user', customerName: 'AeroDesk User', company: 'Stark Industries', tripType: 'Onward', departure: 'Mumbai (VABB)', arrival: 'Delhi (VIDP)', departureDate: '2025-03-15', departureTime: '10:00', pax: 5, aircraftType: 'Any Light Jet', status: 'Bidding Open', createdAt: '2025-02-10T10:00:00Z', updatedAt: '2025-02-10T10:00:00Z' },
];

export const mockEmptyLegs: EmptyLeg[] = [
    { id: 'EL-001', operatorId: 'op-west-01', operatorName: 'FlyCo Charter', aircraftId: 'ac-01', departure: 'Mumbai', arrival: 'Delhi', departureTime: '2025-03-10T14:00:00Z', availableSeats: 6, status: 'live', createdAt: '2025-02-01T10:00:00Z', pricePerSeat: 45000 },
];

export const mockAuditLogs: AuditLog[] = [
    { id: 'audit-01', timestamp: '2025-02-10T10:30:00Z', user: 'AeroDesk Admin', role: 'Platform Admin', action: 'Updated NSOP Document', details: 'Renewal document uploaded for verification.', targetId: 'op-west-01' },
];

export const mockAccommodationRequests: AccommodationRequest[] = [
    { id: 'ACC-001', hotelPartnerId: 'hotel-01', propertyName: 'Taj Mahal Palace', guestName: 'Vikram Malhotra', checkIn: '2025-02-01', checkOut: '2025-02-04', rooms: 2, status: 'Confirmed', requesterId: 'demo_super_user' },
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
    { id: 'room-01', propertyId: 'prop-01', name: 'Deluxe King Room', nightlyRate: 18500 },
];

export const mockTaxConfig: TaxConfig[] = [
    { id: 'tax-01', serviceType: 'charter', taxRatePercent: 18, sacCode: '9964', effectiveFrom: '2025-01-01', isActive: true },
];

export const mockPlatformInvoices: PlatformInvoice[] = [
    { id: 'PINV-001', entityName: 'FlyCo Charter', totalAmount: 42500, dueDate: '2025-02-15', status: 'paid' },
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
    { id: 'cle-01', transactionId: 'RFQ-DEMO-004', bookingChannel: 'direct', grossAmount: 850000, agencyCommissionAmount: 0, aerodeskCommissionAmount: 42500, status: 'settled', serviceType: 'charter', agencySharePercent: 0, createdAt: '2025-02-02T12:00:00Z' },
];

export const mockSettlementRecords: SettlementRecord[] = [
    { id: 'SET-001', entityName: 'FlyCo Charter', settlementPeriodStart: '2025-01-01', settlementPeriodEnd: '2025-01-31', totalAgencyCommission: 0, status: 'paid' },
];

export const mockBlogPosts: BlogPost[] = [
    { id: 'post-01', title: "India's 2025 NSOP Infrastructure Roadmap", excerpt: "Analyzing the transition from fragmented regional operations to a unified digital infrastructure layer.", category: 'Market Trends', author: 'AeroDesk Intelligence', date: '2025-02-10', imageUrl: 'https://images.unsplash.com/photo-1566212775038-532d06eda485?q=80&w=1080' },
];

export const mockPressReleases: PressRelease[] = [
    { id: 'pr-01', title: 'AeroDesk Expansion', description: 'New hubs active.', date: '2025-02-01', category: 'Expansion' },
];

export const mockMediaMentions: MediaMention[] = [
    { id: 'mm-01', publication: 'Aviation Week', title: 'Digital Transformation', snippet: 'AeroDesk leads the way.', date: '2025-01-15' },
];

export const mockBrandAssets: BrandAsset[] = [
    { id: 'ba-01', title: 'Logo Pack', type: 'Vector', imageUrl: 'https://images.unsplash.com/photo-1711919600878-b5d9e77d3357?q=80&w=1080', fileSize: '2.4MB' },
];
