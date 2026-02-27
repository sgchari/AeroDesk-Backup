
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
  BillingRecord, 
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
 * @fileOverview Institutional Data Registry (Simulation Mode)
 * Provides a comprehensive, multi-entity mock dataset for platform drills.
 * All emails are restricted to @demo.aerodesk.com to prevent transactional leaks.
 */

export const VERIFIED_NSOP_REGISTRY = [
    { companyName: 'FlyCo Charter', nsopLicenseNumber: 'NSOP/FLYCO/2021', city: 'Mumbai' },
    { companyName: 'Taj Air', nsopLicenseNumber: 'NSOP/TAJ/02', city: 'Mumbai' },
    { companyName: 'Club One Air', nsopLicenseNumber: 'NSOP/COA/05', city: 'Delhi' },
    { companyName: 'Titan Aviation', nsopLicenseNumber: 'NSOP/TITAN/11', city: 'Bangalore' },
];

export const mockUsers: User[] = [
    { id: 'admin-01', email: 'admin@demo.aerodesk.com', firstName: 'AeroDesk', lastName: 'Governance', role: 'Admin', status: 'Active', createdAt: "2024-01-01T10:00:00Z", updatedAt: "2024-01-01T10:00:00Z" },
    { id: 'cust-01', email: 'sanjana@demo.aerodesk.com', firstName: 'Sanjana', lastName: 'Kumar', role: 'Customer', status: 'Active', createdAt: "2024-05-15T11:20:00Z", updatedAt: "2024-05-15T11:20:00Z" },
    { id: 'op-01', email: 'ops@flyco.demo.aerodesk.com', firstName: 'Rajesh', lastName: 'Verma', role: 'Operator', status: 'Approved', company: 'FlyCo Charter', createdAt: "2024-02-10T09:00:00Z", updatedAt: "2024-02-10T09:00:00Z" },
    { id: 'op-02', email: 'dispatch@tajair.demo.aerodesk.com', firstName: 'Vikram', lastName: 'Singh', role: 'Operator', status: 'Approved', company: 'Taj Air', createdAt: "2024-02-15T10:00:00Z", updatedAt: "2024-02-15T10:00:00Z" },
    { id: 'ag-01', email: 'amit@sky-dist.demo.aerodesk.com', firstName: 'Amit', lastName: 'Patel', role: 'Travel Agency', company: 'Sky Distributors', status: 'Active', createdAt: "2024-04-12T16:00:00Z", updatedAt: "2024-04-12T16:00:00Z" },
    { id: 'ctd-01', email: 'priya@stark.demo.aerodesk.com', firstName: 'Priya', lastName: 'Sharma', role: 'CTD Admin', company: 'Stark Industries', status: 'Active', createdAt: "2024-03-01T14:00:00Z", updatedAt: "2024-03-01T14:00:00Z", ctdId: 'ctd-corp-01' },
    { id: 'ctd-02', email: 'arjun@wayne.demo.aerodesk.com', firstName: 'Arjun', lastName: 'Mehta', role: 'CTD Admin', company: 'Wayne Corp India', status: 'Active', createdAt: "2024-03-05T11:00:00Z", updatedAt: "2024-03-05T11:00:00Z", ctdId: 'ctd-corp-02' },
    { id: 'hotel-01', email: 'concierge@grand.demo.aerodesk.com', firstName: 'Manish', lastName: 'Joshi', role: 'Hotel Partner', company: 'The Grand Mumbai', status: 'Active', createdAt: "2024-01-20T08:00:00Z", updatedAt: "2024-01-20T08:00:00Z" },
];

export const mockOperators: Operator[] = [
    { 
        id: 'op-01', 
        externalAuthId: 'op-01', 
        companyName: 'FlyCo Charter', 
        nsopLicenseNumber: 'NSOP/FLYCO/2021', 
        contactPersonName: 'Rajesh Verma', 
        contactEmail: 'ops@flyco.demo.aerodesk.com', 
        status: 'Approved', 
        mouAcceptedAt: '2024-02-10T09:00:00Z', 
        createdAt: '2024-02-10T09:00:00Z', 
        updatedAt: '2024-02-10T09:00:00Z', 
        city: 'Mumbai', 
        zone: 'West' 
    },
    { 
        id: 'op-02', 
        externalAuthId: 'op-02', 
        companyName: 'Taj Air', 
        nsopLicenseNumber: 'NSOP/TAJ/02', 
        contactPersonName: 'Vikram Singh', 
        contactEmail: 'dispatch@tajair.demo.aerodesk.com', 
        status: 'Approved', 
        mouAcceptedAt: '2024-02-15T10:00:00Z', 
        createdAt: '2024-02-15T10:00:00Z', 
        updatedAt: '2024-02-15T10:00:00Z', 
        city: 'Mumbai', 
        zone: 'West' 
    }
];

export const mockRfqs: CharterRFQ[] = [
    { id: 'RFQ-EXEC-001', customerId: 'cust-01', requesterExternalAuthId: 'cust-01', customerName: 'Sanjana Kumar', tripType: 'Onward', departure: 'Mumbai (BOM)', arrival: 'Delhi (DEL)', departureDate: '2024-09-10', pax: 4, aircraftType: 'Any Light Jet', status: 'Bidding Open', createdAt: '2024-08-28T12:00:00Z', bidsCount: 2 },
    { id: 'RFQ-EXEC-003', customerId: 'cust-01', requesterExternalAuthId: 'cust-01', operatorId: 'op-01', customerName: 'Sanjana Kumar', tripType: 'Onward', departure: 'Mumbai (BOM)', arrival: 'Dubai (DXB)', departureDate: '2024-09-01', pax: 2, aircraftType: 'Heavy Jet', status: 'boarding', createdAt: '2024-08-01T10:00:00Z', bidsCount: 3, totalAmount: 4200000 },
];

export const mockEmptyLegs: EmptyLeg[] = [
    { id: 'EL-901', operatorId: 'op-01', operatorName: 'FlyCo Charter', aircraftId: 'AC-001', aircraftName: 'Cessna Citation', departure: 'Mumbai (BOM)', arrival: 'Delhi (DEL)', departureTime: '2024-09-15T14:00:00Z', availableSeats: 4, seatsAllocated: 2, status: 'Published', seatPricingStrategy: 'Dynamic', estimatedPricePerSeat: 45000 },
];

export const mockAircrafts: Aircraft[] = [
    { id: 'AC-001', operatorId: 'op-01', name: 'Cessna Citation XLS+', type: 'Light Jet', registration: 'VT-FLY', paxCapacity: 7, homeBase: 'Mumbai', status: 'Available', exteriorImageUrl: 'https://images.unsplash.com/photo-1540962351504-03099e0a754b?q=80&w=800' },
];

export const mockCommissionRules: CommissionRule[] = [
  { id: 'CR-01', serviceType: 'charter', commissionRatePercent: 5, effectiveFrom: '2024-01-01', isActive: true, createdBy: 'admin-01', createdAt: '2024-01-01T00:00:00Z' },
  { id: 'CR-02', serviceType: 'seat', commissionRatePercent: 8, effectiveFrom: '2024-01-01', isActive: true, createdBy: 'admin-01', createdAt: '2024-01-01T00:00:00Z' },
  { id: 'CR-03', serviceType: 'accommodation', commissionRatePercent: 10, effectiveFrom: '2024-01-01', isActive: true, createdBy: 'admin-01', createdAt: '2024-01-01T00:00:00Z' },
];

export const mockRevenueShareConfigs: RevenueShareConfig[] = [
  { id: 'RSC-01', scopeType: 'global', agencySharePercent: 60, aerodeskSharePercent: 40, effectiveFrom: '2024-01-01', isActive: true, createdBy: 'admin-01', createdAt: '2024-01-01T00:00:00Z' },
  { id: 'RSC-02', scopeType: 'serviceType', serviceType: 'seat', agencySharePercent: 70, aerodeskSharePercent: 30, effectiveFrom: '2024-01-01', isActive: true, createdBy: 'admin-01', createdAt: '2024-01-01T00:00:00Z' },
];

export const mockCommissionLedger: CommissionLedgerEntry[] = [
  { id: 'CLE-001', transactionId: 'RFQ-EXEC-003', entityId: 'ag-01', entityType: 'Travel Agency', serviceType: 'charter', grossAmount: 4200000, commissionRatePercent: 5, totalCommission: 210000, agencySharePercent: 60, aerodeskSharePercent: 40, agencyCommissionAmount: 126000, aerodeskCommissionAmount: 84000, status: 'pending', ruleVersionReference: 'RSC-01', createdAt: '2024-08-03T10:30:00Z' },
];

export const mockPlatformInvoices: PlatformInvoice[] = [
  { id: 'PL-INV-001', entityId: 'op-01', entityName: 'FlyCo Charter', entityType: 'Operator', billingPeriodStart: '2024-08-01', billingPeriodEnd: '2024-08-31', totalAmount: 1370000, dueDate: '2024-09-10', status: 'paid', createdAt: '2024-09-01T09:00:00Z' },
];

export const mockAuditLogs: AuditLog[] = [
    { id: 'AUDIT-01', timestamp: '2024-08-31T10:00:00Z', user: 'Rajesh Verma', role: 'Operator', action: 'STATUS_UPDATE', details: 'Updated VT-FLY to Available', targetId: 'AC-001' }
];

export const mockBlogPosts: BlogPost[] = [
  { id: 'blog-1', title: 'India’s Charter Market Growth', excerpt: 'Analyzing the 18% rise in private jet demand across Tier-2 cities.', category: 'Market Trends', imageUrl: 'https://images.unsplash.com/photo-1566212775038-532d06eda485?w=800', author: 'AeroDesk Insights', date: '2024-08-01' },
];

export const mockPressReleases: PressRelease[] = [
  { id: 'pr-1', title: 'AeroDesk Launches Institutional Billing', description: 'New financial governance layer activated for India-wide ops.', date: '2024-08-15', category: 'Platform Update' }
];

export const mockMediaMentions: MediaMention[] = [
  { id: 'mm-1', publication: 'Aviation Daily', title: 'AeroDesk sets new standard for NSOP', snippet: 'The platform successfully coordinated 500 missions in Q2.', date: '2024-07-20' }
];

export const mockBrandAssets: BrandAsset[] = [
  { id: 'ba-1', title: 'Official Logo Pack', type: 'Logo', imageUrl: 'https://images.unsplash.com/photo-1711919600878-b5d9e77d3357?w=800', fileSize: '2.4MB' }
];

export const mockCorporateTravelDesks: CorporateTravelDesk[] = [
    { id: 'ctd-corp-01', companyName: 'Stark Industries', adminExternalAuthId: 'ctd-01', status: 'Active', createdAt: "2024-03-01T14:00:00Z", updatedAt: "2024-03-01T14:00:00Z" },
    { id: 'ctd-corp-02', companyName: 'Wayne Corp India', adminExternalAuthId: 'ctd-02', status: 'Active', createdAt: "2024-03-05T11:00:00Z", updatedAt: "2024-03-05T11:00:00Z" },
];

export const mockQuotations: Quotation[] = [];
export const mockAccommodationRequests: AccommodationRequest[] = [];
export const mockProperties: Property[] = [];
export const mockRoomCategories: RoomCategory[] = [];
export const mockEmptyLegSeatAllocationRequests: EmptyLegSeatAllocationRequest[] = [];
export const mockFeatureFlags: FeatureFlag[] = [];
export const mockPolicyFlags: PolicyFlag[] = [];
export const mockCrew: CrewMember[] = [];
export const mockManifests: PassengerManifest[] = [];
export const mockInvoices: Invoice[] = [];
export const mockPayments: Payment[] = [];
export const mockActivityLogs: ActivityLog[] = [];
export const mockPlatformChargeRules: PlatformChargeRule[] = [];
export const mockBillingLedger: EntityBillingLedger[] = [];
export const mockSubscriptionPlans: SubscriptionPlan[] = [];
export const mockSettlementRecords: SettlementRecord[] = [];
export const mockBillingRecords: BillingRecord[] = [];
