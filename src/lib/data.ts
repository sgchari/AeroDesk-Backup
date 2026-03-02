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
  HotelPartner
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
    // --- WEST ZONE ---
    { 
      id: 'op-west-01', 
      email: 'rajesh@flyco.aero', 
      firstName: 'Rajesh', 
      lastName: 'Verma', 
      role: 'Operator', 
      platformRole: 'operator', 
      firmRole: 'admin',
      operatorId: 'op-west-01',
      company: 'FlyCo Charter (West)',
      status: 'active', 
      avatar: 'https://picsum.photos/seed/opw1/200/200',
      gstVerificationStatus: 'verified',
      gstin: '27AAAAA0000A1Z5',
      stateCode: '27',
      legalEntityName: 'FlyCo Aviation West Pvt Ltd',
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
      company: 'Sky Distributors (West)',
      status: 'active', 
      avatar: 'https://picsum.photos/seed/agw1/200/200',
      gstVerificationStatus: 'verified',
      gstin: '27CCCCC2222C1Z3',
      stateCode: '27',
      legalEntityName: 'Sky Distribution West LLC',
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
      company: 'Stark Industries (West)',
      status: 'active', 
      avatar: 'https://picsum.photos/seed/corpw1/200/200',
      gstVerificationStatus: 'verified',
      gstin: '27DDDDD3333D1Z4',
      stateCode: '27',
      legalEntityName: 'Stark Industries West India',
      createdAt: "2025-01-01T14:00:00Z", 
      updatedAt: "2025-01-01T14:00:00Z" 
    },
    // --- SOUTH ZONE ---
    { 
      id: 'op-south-01', 
      email: 'karthik@deccan.aero', 
      firstName: 'Karthik', 
      lastName: 'Reddy', 
      role: 'Operator', 
      platformRole: 'operator', 
      firmRole: 'admin',
      operatorId: 'op-south-01',
      company: 'Deccan Charters (South)',
      status: 'active', 
      avatar: 'https://picsum.photos/seed/ops1/200/200',
      gstVerificationStatus: 'verified',
      gstin: '29SSSSS9999S1Z1',
      stateCode: '29',
      legalEntityName: 'Deccan Charters South Pvt Ltd',
      createdAt: "2025-01-15T09:00:00Z", 
      updatedAt: "2025-01-15T09:00:00Z" 
    },
    { 
      id: 'ag-south-01', 
      email: 'lakshmi@southern-wings.aero', 
      firstName: 'Lakshmi', 
      lastName: 'Nair', 
      role: 'Travel Agency', 
      platformRole: 'agency', 
      firmRole: 'admin',
      agencyId: 'ag-south-01',
      company: 'Southern Wings (South)',
      status: 'active', 
      avatar: 'https://picsum.photos/seed/ags1/200/200',
      gstVerificationStatus: 'verified',
      gstin: '29WWWWW8888W1Z2',
      stateCode: '29',
      legalEntityName: 'Southern Wings South Agency',
      createdAt: "2025-01-18T10:00:00Z", 
      updatedAt: "2025-01-18T10:00:00Z" 
    },
    { 
      id: 'corp-south-01', 
      email: 'travel@techm.com', 
      firstName: 'Venkat', 
      lastName: 'Prabhu', 
      role: 'CTD Admin', 
      platformRole: 'corporate', 
      firmRole: 'admin',
      corporateId: 'corp-south-01',
      company: 'Tech Mahindra (South)',
      status: 'active', 
      avatar: 'https://picsum.photos/seed/corps1/200/200',
      gstVerificationStatus: 'verified',
      gstin: '29MMMMM7777M1Z3',
      stateCode: '29',
      legalEntityName: 'Tech Mahindra South Division',
      createdAt: "2025-01-20T11:00:00Z", 
      updatedAt: "2025-01-20T11:00:00Z" 
    },
    // --- NORTH ZONE ---
    { 
      id: 'op-north-01', 
      email: 'vikas@spanair.in', 
      firstName: 'Vikas', 
      lastName: 'Khanna', 
      role: 'Operator', 
      platformRole: 'operator', 
      firmRole: 'admin',
      operatorId: 'op-north-01',
      company: 'Span Air (North)',
      status: 'active', 
      avatar: 'https://picsum.photos/seed/opn1/200/200',
      gstVerificationStatus: 'verified',
      gstin: '07NNNNN1111N1Z4',
      stateCode: '07',
      legalEntityName: 'Span Air North Operations',
      createdAt: "2025-01-22T09:00:00Z", 
      updatedAt: "2025-01-22T09:00:00Z" 
    },
    { 
      id: 'ag-north-01', 
      email: 'sneha@northstar.aero', 
      firstName: 'Sneha', 
      lastName: 'Bhasin', 
      role: 'Travel Agency', 
      platformRole: 'agency', 
      firmRole: 'admin',
      agencyId: 'ag-north-01',
      company: 'North Star Travel (North)',
      status: 'active', 
      avatar: 'https://picsum.photos/seed/agn1/200/200',
      gstVerificationStatus: 'verified',
      gstin: '07TTTTT2222T1Z5',
      stateCode: '07',
      legalEntityName: 'North Star Travel Agency Ltd',
      createdAt: "2025-01-25T16:00:00Z", 
      updatedAt: "2025-01-25T16:00:00Z" 
    },
    { 
      id: 'corp-north-01', 
      email: 'admin@hcl.com', 
      firstName: 'Arjun', 
      lastName: 'Mehta', 
      role: 'CTD Admin', 
      platformRole: 'corporate', 
      firmRole: 'admin',
      corporateId: 'corp-north-01',
      company: 'HCL Tech (North)',
      status: 'active', 
      avatar: 'https://picsum.photos/seed/corpn1/200/200',
      gstVerificationStatus: 'verified',
      gstin: '07HHHHH3333H1Z6',
      stateCode: '07',
      legalEntityName: 'HCL Technologies North Region',
      createdAt: "2025-01-28T14:00:00Z", 
      updatedAt: "2025-01-28T14:00:00Z" 
    },
    // --- EAST ZONE ---
    { 
      id: 'op-east-01', 
      email: 'ops@northeast.aero', 
      firstName: 'Joy', 
      lastName: 'Sarkar', 
      role: 'Operator', 
      platformRole: 'operator', 
      firmRole: 'admin',
      operatorId: 'op-east-01',
      company: 'Northeast Aviation (East)',
      status: 'active', 
      avatar: 'https://picsum.photos/seed/ope1/200/200',
      gstVerificationStatus: 'verified',
      gstin: '19EEEEE1111E1Z7',
      stateCode: '19',
      legalEntityName: 'Northeast Aviation Services',
      createdAt: "2025-02-01T09:00:00Z", 
      updatedAt: "2025-02-01T09:00:00Z" 
    },
    { 
      id: 'ag-east-01', 
      email: 'info@eastgateway.aero', 
      firstName: 'Animesh', 
      lastName: 'Das', 
      role: 'Travel Agency', 
      platformRole: 'agency', 
      firmRole: 'admin',
      agencyId: 'ag-east-01',
      company: 'East Gateway (East)',
      status: 'active', 
      avatar: 'https://picsum.photos/seed/age1/200/200',
      gstVerificationStatus: 'verified',
      gstin: '19GGGGG2222G1Z8',
      stateCode: '19',
      legalEntityName: 'East Gateway Travel East',
      createdAt: "2025-02-03T16:00:00Z", 
      updatedAt: "2025-02-03T16:00:00Z" 
    },
    { 
      id: 'corp-east-01', 
      email: 'travel@tatasteel.com', 
      firstName: 'Sunil', 
      lastName: 'Mitra', 
      role: 'CTD Admin', 
      platformRole: 'corporate', 
      firmRole: 'admin',
      corporateId: 'corp-east-01',
      company: 'Tata Steel (East)',
      status: 'active', 
      avatar: 'https://picsum.photos/seed/corpe1/200/200',
      gstVerificationStatus: 'verified',
      gstin: '19SSSSS3333S1Z9',
      stateCode: '19',
      legalEntityName: 'Tata Steel East HQ',
      createdAt: "2025-02-05T14:00:00Z", 
      updatedAt: "2025-02-05T14:00:00Z" 
    },
    // --- CENTRAL ZONE ---
    { 
      id: 'op-central-01', 
      email: 'ops@centraljet.aero', 
      firstName: 'Deepak', 
      lastName: 'Singh', 
      role: 'Operator', 
      platformRole: 'operator', 
      firmRole: 'admin',
      operatorId: 'op-central-01',
      company: 'Central Jet (Central)',
      status: 'active', 
      avatar: 'https://picsum.photos/seed/opc1/200/200',
      gstVerificationStatus: 'verified',
      gstin: '23CCCCC1111C1Z0',
      stateCode: '23',
      legalEntityName: 'Central Jet Aviation Pvt Ltd',
      createdAt: "2025-02-08T09:00:00Z", 
      updatedAt: "2025-02-08T09:00:00Z" 
    },
    { 
      id: 'ag-central-01', 
      email: 'bookings@heartindia.aero', 
      firstName: 'Rohit', 
      lastName: 'Tiwari', 
      role: 'Travel Agency', 
      platformRole: 'agency', 
      firmRole: 'admin',
      agencyId: 'ag-central-01',
      company: 'Heart of India Travel (Central)',
      status: 'active', 
      avatar: 'https://picsum.photos/seed/agc1/200/200',
      gstVerificationStatus: 'verified',
      gstin: '23IIIII2222I1Z1',
      stateCode: '23',
      legalEntityName: 'Heart of India Travel Agency',
      createdAt: "2025-02-10T16:00:00Z", 
      updatedAt: "2025-02-10T16:00:00Z" 
    },
    { 
      id: 'corp-central-01', 
      email: 'travel@coalindia.in', 
      firstName: 'Manoj', 
      lastName: 'Pandey', 
      role: 'CTD Admin', 
      platformRole: 'corporate', 
      firmRole: 'admin',
      corporateId: 'corp-central-01',
      company: 'Coal India (Central)',
      status: 'active', 
      avatar: 'https://picsum.photos/seed/corpc1/200/200',
      gstVerificationStatus: 'verified',
      gstin: '23LLLLL3333L1Z2',
      stateCode: '23',
      legalEntityName: 'Coal India Central Region',
      createdAt: "2025-02-12T14:00:00Z", 
      updatedAt: "2025-02-12T14:00:00Z" 
    },
    // --- INDIVIDUALS / HOTELS ---
    { 
      id: 'hotel-admin-01', 
      email: 'concierge@grandhotels.com', 
      firstName: 'Ananya', 
      lastName: 'Iyer', 
      role: 'Hotel Partner', 
      platformRole: 'hotel', 
      firmRole: 'admin',
      hotelPartnerId: 'hotel-01',
      company: 'Grand Hotels Group',
      status: 'active', 
      avatar: 'https://picsum.photos/seed/hotel1/200/200',
      gstVerificationStatus: 'verified',
      gstin: '27EEEEE4444E1Z1',
      stateCode: '27',
      legalEntityName: 'Grand Hospitality Services',
      createdAt: "2025-01-05T10:00:00Z", 
      updatedAt: "2025-01-05T10:00:00Z" 
    },
    { 
      id: 'cust-01', 
      email: 'vikram@malhotra.com', 
      firstName: 'Vikram', 
      lastName: 'Malhotra', 
      role: 'Customer', 
      platformRole: 'individual', 
      firmRole: 'viewer',
      status: 'active', 
      avatar: 'https://picsum.photos/seed/cust1/200/200',
      createdAt: "2025-02-01T10:00:00Z", 
      updatedAt: "2025-02-01T10:00:00Z" 
    },
];

export const mockOperators: Operator[] = [
    { 
      id: 'op-west-01', 
      companyName: 'FlyCo Charter', 
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
      id: 'op-south-01', 
      companyName: 'Deccan Charters', 
      nsopLicenseNumber: 'NSOP/DEC/11', 
      officialEmail: 'dispatch@deccan.aero', 
      registeredAddress: 'HAL Airport, Bengaluru',
      contactNumber: '+91 80 4455 6677',
      profileStatus: 'active',
      adminUserId: 'op-south-01',
      status: 'Approved',
      gstVerificationStatus: 'verified',
      gstin: '29SSSSS9999S1Z1',
      stateCode: '29',
      legalEntityName: 'Deccan Charters South Pvt Ltd',
      city: 'Bengaluru',
      zone: 'South',
      fleetCount: 15,
      createdAt: '2025-01-15T09:00:00Z', 
      updatedAt: '2025-01-15T09:00:00Z',
    },
    { 
      id: 'op-north-01', 
      companyName: 'Span Air', 
      nsopLicenseNumber: 'NSOP/SPAN/09', 
      officialEmail: 'info@spanair.in', 
      registeredAddress: 'IGI Airport, New Delhi',
      contactNumber: '+91 11 4567 8900',
      profileStatus: 'active',
      adminUserId: 'op-north-01',
      status: 'Approved',
      gstVerificationStatus: 'verified',
      gstin: '07NNNNN1111N1Z4',
      stateCode: '07',
      legalEntityName: 'Span Air North Operations',
      city: 'Delhi',
      zone: 'North',
      fleetCount: 8,
      createdAt: '2025-01-22T09:00:00Z', 
      updatedAt: '2025-01-22T09:00:00Z',
    },
    { 
      id: 'op-east-01', 
      companyName: 'Northeast Aviation', 
      nsopLicenseNumber: 'NSOP/NEA/01', 
      officialEmail: 'ops@northeast.aero', 
      registeredAddress: 'Borjhar Airport, Guwahati',
      contactNumber: '+91 361 2233 4455',
      profileStatus: 'active',
      adminUserId: 'op-east-01',
      status: 'Approved',
      gstVerificationStatus: 'verified',
      gstin: '19EEEEE1111E1Z7',
      stateCode: '19',
      legalEntityName: 'Northeast Aviation Services',
      city: 'Guwahati',
      zone: 'East',
      fleetCount: 5,
      createdAt: '2025-02-01T09:00:00Z', 
      updatedAt: '2025-02-01T09:00:00Z',
    },
    { 
      id: 'op-central-01', 
      companyName: 'Central Jet', 
      nsopLicenseNumber: 'NSOP/CJ/05', 
      officialEmail: 'ops@centraljet.aero', 
      registeredAddress: 'Bairagarh Airport, Bhopal',
      contactNumber: '+91 755 4455 6677',
      profileStatus: 'active',
      adminUserId: 'op-central-01',
      status: 'Approved',
      gstVerificationStatus: 'verified',
      gstin: '23CCCCC1111C1Z0',
      stateCode: '23',
      legalEntityName: 'Central Jet Aviation Pvt Ltd',
      city: 'Bhopal',
      zone: 'Central',
      fleetCount: 6,
      createdAt: '2025-02-08T09:00:00Z', 
      updatedAt: '2025-02-08T09:00:00Z',
    }
];

export const mockAgencies: TravelAgency[] = [
    {
      id: 'ag-west-01',
      companyName: 'Sky Distributors',
      officialEmail: 'info@skydist.aero',
      address: 'Suite 405, BKC, Mumbai',
      contactNumber: '+91 22 4455 6677',
      adminUserId: 'ag-west-01',
      gstVerificationStatus: 'verified',
      gstin: '27CCCCC2222C1Z3',
      stateCode: '27',
      legalEntityName: 'Sky Distribution West LLC',
      createdAt: '2025-01-12T16:00:00Z',
      updatedAt: '2025-01-12T16:00:00Z'
    },
    {
      id: 'ag-south-01',
      companyName: 'Southern Wings',
      officialEmail: 'bookings@southern-wings.aero',
      address: 'Indiranagar, Bengaluru',
      contactNumber: '+91 80 2233 4455',
      adminUserId: 'ag-south-01',
      gstVerificationStatus: 'verified',
      gstin: '29WWWWW8888W1Z2',
      stateCode: '29',
      legalEntityName: 'Southern Wings South Agency',
      createdAt: '2025-01-18T10:00:00Z',
      updatedAt: '2025-01-18T10:00:00Z'
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
      companyName: 'HCL Tech',
      officialEmail: 'admin@hcl.com',
      address: 'Sector 126, Noida',
      adminUserId: 'corp-north-01',
      status: 'Active',
      gstVerificationStatus: 'verified',
      gstin: '07HHHHH3333H1Z6',
      stateCode: '07',
      legalEntityName: 'HCL Technologies North Region',
      createdAt: '2025-01-28T14:00:00Z',
      updatedAt: '2025-01-28T14:00:00Z'
    }
];

export const mockHotelPartners: HotelPartner[] = [
    {
        id: 'hotel-01',
        companyName: 'Grand Hotels Group',
        officialEmail: 'corporate@grandhotels.com',
        address: 'Nariman Point, Mumbai',
        status: 'Approved',
        gstVerificationStatus: 'verified',
        gstin: '27EEEEE4444E1Z1',
        stateCode: '27',
        legalEntityName: 'Grand Hospitality Services',
        createdAt: '2025-01-05T10:00:00Z',
        updatedAt: '2025-01-05T10:00:00Z'
    }
];

export const mockAircrafts: Aircraft[] = [
    { id: 'ac-01', operatorId: 'op-west-01', name: 'Cessna Citation XLS+', type: 'Light Jet', registration: 'VT-FLY', paxCapacity: 8, homeBase: 'BOM', status: 'Available', exteriorImageUrl: 'https://images.unsplash.com/photo-1540962351504-03099e0a754b?q=80&w=800' },
    { id: 'ac-02', operatorId: 'op-west-01', name: 'Bombardier Global 6000', type: 'Heavy Jet', registration: 'VT-JSG', paxCapacity: 14, homeBase: 'BOM', status: 'Under Maintenance', exteriorImageUrl: 'https://images.unsplash.com/photo-1616193572425-fd11332ec645?q=80&w=800' },
    { id: 'ac-03', operatorId: 'op-north-01', name: 'Hawker 850XP', type: 'Mid-size Jet', registration: 'VT-SPAN', paxCapacity: 9, homeBase: 'DEL', status: 'Available', exteriorImageUrl: 'https://images.unsplash.com/photo-1569154941061-e231b4725ef1?q=80&w=800' },
    { id: 'ac-04', operatorId: 'op-south-01', name: 'King Air B200', type: 'Turboprop', registration: 'VT-DEC', paxCapacity: 6, homeBase: 'BLR', status: 'Available', exteriorImageUrl: 'https://images.unsplash.com/photo-1540575861501-7cf05a4b125a?q=80&w=800' },
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
    { 
        id: 'RFQ-AG-001', 
        customerId: 'ag-south-01', 
        requesterExternalAuthId: 'ag-south-01', 
        customerName: 'Lakshmi Nair', 
        company: 'Southern Wings',
        tripType: 'Return', 
        departure: 'Bengaluru (VOBL)', 
        arrival: 'Cochin (VOCI)', 
        departureDate: '2025-03-20', 
        pax: 4, 
        aircraftType: 'Turboprop', 
        status: 'Bidding Open', 
        createdAt: '2025-02-12T11:00:00Z', 
        updatedAt: '2025-02-12T11:00:00Z'
    },
    { 
        id: 'RFQ-DEMO-004', 
        customerId: 'cust-01', 
        requesterExternalAuthId: 'cust-01', 
        operatorId: 'op-west-01',
        customerName: 'Vikram Malhotra', 
        tripType: 'Return', 
        departure: 'Delhi (VIDP)', 
        arrival: 'Goa (VOGO)', 
        departureDate: '2025-02-01', 
        pax: 4, 
        aircraftType: 'Light Jet', 
        status: 'tripClosed', 
        totalAmount: 850000,
        createdAt: '2025-01-20T09:00:00Z', 
        updatedAt: '2025-02-05T18:00:00Z' 
    },
];

export const mockQuotations: Quotation[] = [
    { id: 'QT-001', rfqId: 'RFQ-CORP-001', operatorId: 'op-west-01', operatorName: 'FlyCo Charter', aircraftId: 'ac-01', aircraftName: 'Cessna Citation XLS+', price: 450000, status: 'Submitted', submittedAt: '2025-02-11T09:00:00Z', validUntil: '2025-02-15' },
];

export const mockEmptyLegs: EmptyLeg[] = [
    { id: 'EL-001', operatorId: 'op-west-01', operatorName: 'FlyCo Charter', aircraftId: 'ac-01', aircraftName: 'VT-FLY', departure: 'Mumbai', arrival: 'Delhi', departureTime: '2025-03-10T14:00:00Z', availableSeats: 6, status: 'Published' },
    { id: 'EL-002', operatorId: 'op-south-01', operatorName: 'Deccan Charters', aircraftId: 'ac-04', aircraftName: 'VT-DEC', departure: 'Bengaluru', arrival: 'Chennai', departureTime: '2025-03-12T10:00:00Z', availableSeats: 4, status: 'Published' },
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

export const mockCrew: CrewMember[] = [
    { id: 'crew-01', operatorId: 'op-west-01', firstName: 'Sanjay', lastName: 'Kapoor', role: 'Captain', status: 'Available', licenseNumber: 'ATPL-4567', assignedAircraftRegistration: 'VT-FLY', createdAt: '2025-01-10T09:00:00Z' },
];

export const mockManifests: PassengerManifest[] = [
    { 
        id: 'MAN-DEMO-004', 
        charterId: 'RFQ-DEMO-004', 
        status: 'approved', 
        createdAt: '2025-01-25T10:00:00Z',
        passengers: [
            { fullName: 'Vikram Malhotra', nationality: 'Indian', idNumber: 'L1234567', idType: 'Passport' },
            { fullName: 'Anjali Malhotra', nationality: 'Indian', idNumber: 'L7654321', idType: 'Passport' }
        ]
    }
];

export const mockInvoices: Invoice[] = [
    { id: 'INV-DEMO-004', charterId: 'RFQ-DEMO-004', invoiceNumber: 'INV-2025-004', totalAmount: 850000, status: 'paid', bankDetails: 'AeroBank India • IFSC: AERO0001234 • A/C: 9988776655' }
];

export const mockPayments: Payment[] = [
    { id: 'PAY-DEMO-004', charterId: 'RFQ-DEMO-004', utrReference: 'BANK-UTR-99001122', status: 'verified', createdAt: '2025-01-28T14:30:00Z' }
];

export const mockActivityLogs: ActivityLog[] = [
    { id: 'log-01', charterId: 'RFQ-DEMO-004', actionType: 'TRIP_CLOSED', performedBy: 'Rajesh Verma', role: 'Operator', timestamp: '2025-02-02T11:00:00Z' },
];

export const mockCommissionRules: CommissionRule[] = [
    { id: 'cru-01', serviceType: 'charter', commissionRatePercent: 5, effectiveFrom: '2025-01-01', isActive: true },
];

export const mockRevenueShareConfigs: RevenueShareConfig[] = [
    { id: 'rsc-01', scopeType: 'global', agencySharePercent: 60, aerodeskSharePercent: 40, isActive: true },
];

export const mockCommissionLedger: CommissionLedgerEntry[] = [
    { id: 'cle-01', transactionId: 'RFQ-DEMO-004', bookingChannel: 'direct', grossAmount: 850000, agencyCommissionAmount: 0, aerodeskCommissionAmount: 42500, agencySharePercent: 0, status: 'settled', serviceType: 'charter', createdAt: '2025-02-02T12:00:00Z' },
];

export const mockSettlementRecords: SettlementRecord[] = [
    { id: 'SET-001', entityName: 'FlyCo Charter', settlementPeriodStart: '2025-01-01', settlementPeriodEnd: '2025-01-31', totalAgencyCommission: 0, status: 'paid', paymentReference: 'BATCH-JAN-01' },
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

export const mockRoomCategories: RoomCategory[] = [
    { id: 'room-01', propertyId: 'prop-01', name: 'Deluxe King Room', maxOccupancy: 2, nightlyRate: 18500, beddingType: 'King' },
];

export const mockProperties: Property[] = [
    { id: 'prop-01', hotelPartnerId: 'hotel-01', name: 'The Taj Mahal Palace', city: 'Mumbai', address: 'Colaba, Mumbai', status: 'Active', imageUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=800' },
];

export const mockTaxConfig: TaxConfig[] = [
    { id: 'tax-01', serviceType: 'charter', taxRatePercent: 18, sacCode: '9964', effectiveFrom: '2025-01-01', isActive: true },
];

export const mockPressReleases: PressRelease[] = [
    { id: 'pr-01', title: 'AeroDesk Expansion', description: 'New hubs active.', date: '2025-02-01', category: 'Expansion' },
];

export const mockMediaMentions: MediaMention[] = [
    { id: 'mm-01', publication: 'Aviation Week', title: 'Digital Transformation', snippet: 'AeroDesk leads the way.', date: '2025-01-15' },
];

export const mockBrandAssets: BrandAsset[] = [
    { id: 'ba-01', title: 'Logo Pack', type: 'Vector', imageUrl: 'https://images.unsplash.com/photo-1711919600878-b5d9e77d3357?q=80&w=800', fileSize: '2.4MB' },
];

export const mockBlogPosts: BlogPost[] = [
    { id: 'post-01', title: 'Future of NSOP', excerpt: 'Digital standardisation.', category: 'Institutional', author: 'AeroDesk Intelligence', date: '2025-02-10', imageUrl: 'https://images.unsplash.com/photo-1566212775038-532d06eda485?q=80&w=800' },
];
