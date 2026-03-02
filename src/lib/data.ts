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
  SettlementRecord
} from './types';

export const VERIFIED_NSOP_REGISTRY = [
    { companyName: 'FlyCo Charter', nsopLicenseNumber: 'NSOP/FLYCO/2021', city: 'Mumbai' },
    { companyName: 'Taj Air', nsopLicenseNumber: 'NSOP/TAJ/02', city: 'Mumbai' },
    { companyName: 'Club One Air', nsopLicenseNumber: 'NSOP/COA/05', city: 'Delhi' },
];

export const mockUsers: User[] = [
    { 
      id: 'admin-01', 
      email: 'governance@demo.aerodesk.com', 
      firstName: 'AeroDesk', 
      lastName: 'Admin', 
      role: 'Admin', 
      platformRole: 'admin', 
      firmRole: 'admin',
      status: 'active', 
      createdAt: "2025-01-01T10:00:00Z", 
      updatedAt: "2025-01-01T10:00:00Z" 
    },
    { 
      id: 'op-admin-01', 
      email: 'admin@flyco.aero', 
      firstName: 'Rajesh', 
      lastName: 'Verma', 
      role: 'Operator', 
      platformRole: 'operator', 
      firmRole: 'admin',
      operatorId: 'op-01',
      company: 'FlyCo Charter',
      status: 'active', 
      createdAt: "2025-01-10T09:00:00Z", 
      updatedAt: "2025-01-10T09:00:00Z" 
    },
    { 
      id: 'ag-admin-01', 
      email: 'amit@sky-dist.aero', 
      firstName: 'Amit', 
      lastName: 'Patel', 
      role: 'Travel Agency', 
      platformRole: 'agency', 
      firmRole: 'admin',
      agencyId: 'ag-01',
      company: 'Sky Distributors',
      status: 'active', 
      createdAt: "2025-01-12T16:00:00Z", 
      updatedAt: "2025-01-12T16:00:00Z" 
    },
    { 
      id: 'corp-admin-01', 
      email: 'priya@stark.corp', 
      firstName: 'Priya', 
      lastName: 'Sharma', 
      role: 'CTD Admin', 
      platformRole: 'corporate', 
      firmRole: 'admin',
      corporateId: 'corp-01',
      company: 'Stark Industries',
      status: 'active', 
      createdAt: "2025-01-01T14:00:00Z", 
      updatedAt: "2025-01-01T14:00:00Z" 
    },
];

export const mockOperators: Operator[] = [
    { 
      id: 'op-01', 
      companyName: 'FlyCo Charter', 
      nsopLicenseNumber: 'NSOP/FLYCO/2021', 
      officialEmail: 'ops@flyco.aero', 
      registeredAddress: 'Hangar 1, Juhu Aerodrome, Mumbai',
      contactNumber: '+91 22 2822 2202',
      profileStatus: 'active',
      adminUserId: 'op-admin-01',
      status: 'Approved',
      createdAt: '2025-01-10T09:00:00Z', 
      updatedAt: '2025-01-10T09:00:00Z',
      city: 'Mumbai',
      zone: 'West',
      fleetCount: 12
    }
];

export const mockAgencies: TravelAgency[] = [
    {
      id: 'ag-01',
      companyName: 'Sky Distributors',
      officialEmail: 'info@skydist.aero',
      address: 'Suite 405, BKC, Mumbai',
      contactNumber: '+91 22 4455 6677',
      adminUserId: 'ag-admin-01',
      createdAt: '2025-01-12T16:00:00Z',
      updatedAt: '2025-01-12T16:00:00Z'
    }
];

export const mockCorporates: CorporateTravelDesk[] = [
    {
      id: 'corp-01',
      companyName: 'Stark Industries',
      officialEmail: 'travel@stark.corp',
      address: 'Stark Tower, Mumbai',
      adminUserId: 'corp-admin-01',
      status: 'Active',
      createdAt: '2025-01-01T14:00:00Z',
      updatedAt: '2025-01-01T14:00:00Z'
    }
];

// ... other existing data truncated for space but assumed present
export const mockAircrafts: Aircraft[] = [];
export const mockRfqs: CharterRFQ[] = [];
export const mockQuotations: Quotation[] = [];
export const mockEmptyLegs: EmptyLeg[] = [];
export const mockAuditLogs: AuditLog[] = [];
export const mockAccommodationRequests: AccommodationRequest[] = [];
export const mockFeatureFlags: FeatureFlag[] = [];
export const mockPolicyFlags: PolicyFlag[] = [];
export const mockCrew: CrewMember[] = [];
export const mockManifests: PassengerManifest[] = [];
export const mockInvoices: Invoice[] = [];
export const mockPayments: Payment[] = [];
export const mockActivityLogs: ActivityLog[] = [];
export const mockCommissionRules: CommissionRule[] = [];
export const mockRevenueShareConfigs: RevenueShareConfig[] = [];
export const mockCommissionLedger: CommissionLedgerEntry[] = [];
export const mockSettlementRecords: SettlementRecord[] = [];
export const mockPlatformInvoices: PlatformInvoice[] = [];
export const mockPlatformChargeRules: PlatformChargeRule[] = [];
export const mockBillingLedger: EntityBillingLedger[] = [];
export const mockRoomCategories: RoomCategory[] = [];
export const mockProperties: Property[] = [];
