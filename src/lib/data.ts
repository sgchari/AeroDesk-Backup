
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

export const mockAircrafts: Aircraft[] = [
    { id: 'AC-001', operatorId: 'op-01', name: 'Cessna Citation XLS+', type: 'Mid-size Jet', registration: 'VT-FLY', paxCapacity: 8, homeBase: 'BOM', status: 'Available', exteriorImageUrl: 'https://images.unsplash.com/photo-1540962351504-03099e0a754b?q=80&w=800' },
    { id: 'AC-002', operatorId: 'op-01', name: 'Bombardier Global 6000', type: 'Heavy Jet', registration: 'VT-STK', paxCapacity: 14, homeBase: 'DEL', status: 'Available', exteriorImageUrl: 'https://images.unsplash.com/photo-1616193572425-fd11332ec645?q=80&w=800' },
    { id: 'AC-003', operatorId: 'op-02', name: 'Falcon 2000', type: 'Heavy Jet', registration: 'VT-TAJ', paxCapacity: 10, homeBase: 'BOM', status: 'Available' }
];

export const mockQuotations: Quotation[] = [
    { id: 'QT-001', rfqId: 'RFQ-EXEC-001', operatorId: 'op-01', operatorName: 'FlyCo Charter', aircraftId: 'AC-001', aircraftName: 'VT-FLY', price: 850000, status: 'Submitted', submittedAt: '2024-08-29T10:00:00Z', validUntil: '2024-09-05' }
];

export const mockRfqs: CharterRFQ[] = [
    { id: 'RFQ-EXEC-001', customerId: 'cust-01', requesterExternalAuthId: 'cust-01', customerName: 'Sanjana Kumar', tripType: 'Onward', departure: 'Mumbai (BOM)', arrival: 'Delhi (DEL)', departureDate: '2024-09-10', pax: 4, aircraftType: 'Any Light Jet', status: 'Bidding Open', createdAt: '2024-08-28T12:00:00Z', bidsCount: 2, bookingChannel: 'direct' },
    { id: 'RFQ-EXEC-003', customerId: 'ag-01', requesterExternalAuthId: 'ag-01', agencyId: 'ag-01', operatorId: 'op-01', customerName: 'Sky Distributors (Client: Smith)', tripType: 'Onward', departure: 'Mumbai (BOM)', arrival: 'Dubai (DXB)', departureDate: '2024-09-01', pax: 2, aircraftType: 'Heavy Jet', status: 'boarding', createdAt: '2024-08-01T10:00:00Z', bidsCount: 3, totalAmount: 4200000, bookingChannel: 'agency' },
];

export const mockEmptyLegs: EmptyLeg[] = [
    { id: 'EL-901', operatorId: 'op-01', operatorName: 'FlyCo Charter', aircraftId: 'AC-001', aircraftName: 'Cessna Citation', departure: 'Mumbai (BOM)', arrival: 'Delhi (DEL)', departureTime: '2024-09-15T14:00:00Z', availableSeats: 4, seatsAllocated: 2, status: 'Published', seatPricingStrategy: 'Dynamic', estimatedPricePerSeat: 45000 },
];

export const mockCommissionRules: CommissionRule[] = [
  { id: 'CR-01', serviceType: 'charter', commissionRatePercent: 5, effectiveFrom: '2024-01-01', isActive: true, createdBy: 'admin-01', createdAt: '2024-01-01T00:00:00Z' },
  { id: 'CR-02', serviceType: 'seat', commissionRatePercent: 8, effectiveFrom: '2024-01-01', isActive: true, createdBy: 'admin-01', createdAt: '2024-01-01T00:00:00Z' },
  { id: 'CR-03', serviceType: 'accommodation', commissionRatePercent: 10, effectiveFrom: '2024-01-01', isActive: true, createdBy: 'admin-01', createdAt: '2024-01-01T00:00:00Z' },
];

export const mockRevenueShareConfigs: RevenueShareConfig[] = [
  { id: 'RSC-01', scopeType: 'global', agencySharePercent: 60, aerodeskSharePercent: 40, effectiveFrom: '2024-01-01', isActive: true, createdBy: 'admin-01', createdAt: '2024-01-01T00:00:00Z' },
];

export const mockCommissionLedger: CommissionLedgerEntry[] = [
  { id: 'CLE-001', transactionId: 'RFQ-EXEC-003', entityId: 'ag-01', agencyId: 'ag-01', bookingChannel: 'agency', entityType: 'Travel Agency', serviceType: 'charter', grossAmount: 4200000, commissionRatePercent: 5, totalCommission: 210000, agencySharePercent: 60, aerodeskSharePercent: 40, agencyCommissionAmount: 126000, aerodeskCommissionAmount: 84000, status: 'pending', ruleVersionReference: 'RSC-01', createdAt: '2024-08-03T10:30:00Z' },
  { id: 'CLE-002', transactionId: 'RFQ-EXEC-001', entityId: 'admin-01', agencyId: null, bookingChannel: 'direct', entityType: 'Admin', serviceType: 'charter', grossAmount: 850000, commissionRatePercent: 5, totalCommission: 42500, agencySharePercent: 0, aerodeskSharePercent: 100, agencyCommissionAmount: 0, aerodeskCommissionAmount: 42500, status: 'pending', ruleVersionReference: 'DIRECT', createdAt: '2024-08-29T11:00:00Z' },
];

export const mockPlatformInvoices: PlatformInvoice[] = [
  { id: 'PL-INV-001', entityId: 'op-01', entityName: 'FlyCo Charter', entityType: 'Operator', billingPeriodStart: '2024-08-01', billingPeriodEnd: '2024-08-31', totalAmount: 1370000, dueDate: '2024-09-10', status: 'paid', createdAt: '2024-09-01T09:00:00Z' },
];

export const mockAuditLogs: AuditLog[] = [
    { id: 'AUDIT-01', timestamp: '2024-08-31T10:00:00Z', user: 'Rajesh Verma', role: 'Operator', action: 'STATUS_UPDATE', details: 'Updated VT-FLY to Available', targetId: 'AC-001' }
];

export const mockCorporateTravelDesks: CorporateTravelDesk[] = [
    { id: 'ctd-corp-01', companyName: 'Stark Industries', adminExternalAuthId: 'ctd-01', status: 'Active', createdAt: "2024-03-01T14:00:00Z", updatedAt: "2024-03-01T14:00:00Z" },
];

export const mockProperties: Property[] = [
    { id: 'PROP-01', hotelPartnerId: 'hotel-01', name: 'The Grand Mumbai', address: 'Sahar Airport Rd', city: 'Mumbai', status: 'Active', propertyType: 'Luxury Hotel', imageUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=800' }
];

export const mockRoomCategories: RoomCategory[] = [
    { id: 'ROOM-01', propertyId: 'PROP-01', name: 'Deluxe King Suite', description: 'Executive suite with airport view.', maxOccupancy: 2, beddingType: 'King', nightlyRate: 18500 }
];

export const mockAccommodationRequests: AccommodationRequest[] = [
    { id: 'ACC-001', agencyId: 'ag-01', hotelPartnerId: 'hotel-01', propertyId: 'PROP-01', propertyName: 'The Grand Mumbai', roomCategory: 'Deluxe King Suite', checkIn: '2024-09-01', checkOut: '2024-09-03', rooms: 1, guestName: 'John Smith', status: 'Confirmed', tripReferenceId: 'RFQ-EXEC-003', tripType: 'Charter', requesterId: 'ag-01', createdAt: '2024-08-05T10:00:00Z', updatedAt: '2024-08-06T09:00:00Z', bookingChannel: 'agency' }
];

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
export const mockPressReleases: PressRelease[] = [];
export const mockMediaMentions: MediaMention[] = [];
export const mockBrandAssets: BrandAsset[] = [];
export const mockBlogPosts: BlogPost[] = [];
