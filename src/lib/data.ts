
import type { User, CharterRFQ, EmptyLeg, Aircraft, Quotation, AuditLog, AccommodationRequest, CorporateTravelDesk, Property, RoomCategory, EmptyLegSeatAllocationRequest, Operator, BillingRecord, FeatureFlag, BlogPost, PressRelease, MediaMention, BrandAsset } from './types';
import { PlaceHolderImages } from './placeholder-images';

const getImg = (id: string) => PlaceHolderImages.find(img => img.id === id)?.imageUrl || '';

export const mockUsers: User[] = [
    { id: 'admin-user-01', email: 'admin@aerodesk.com', firstName: 'Admin', lastName: 'User', role: 'Admin', status: 'Active', createdAt: "2024-07-28T10:00:00Z", updatedAt: "2024-07-28T10:00:00Z" },
    { id: 'customer-user-01', email: 'customer@example.com', firstName: 'Sanjana', lastName: 'Kumar', role: 'Customer', status: 'Active', createdAt: "2024-07-27T11:20:00Z", updatedAt: "2024-07-27T11:20:00Z" },
    { id: 'customer-user-02', email: 'arjun@example.com', firstName: 'Arjun', lastName: 'Mehta', role: 'Customer', status: 'Active', createdAt: "2024-07-26T18:30:00Z", updatedAt: "2024-07-26T18:30:00Z" },
    { id: 'operator-user-01', externalAuthId: 'operator-user-01', email: 'ops@flyco.com', companyName: 'FlyCo Charter', firstName: 'Rajesh', lastName: 'Verma', role: 'Operator', status: 'Approved', createdAt: "2024-07-26T09:00:00Z", updatedAt: "2024-07-26T09:00:00Z", nsopLicenseNumber: "NSOP/FLYCO/2021", mouAcceptedAt: "2024-07-26T09:00:00Z", city: 'Mumbai', zone: 'West' },
    { id: 'operator-user-02', externalAuthId: 'operator-user-02', email: 'contact@jetset.aero', companyName: 'JetSetGo Aviation', firstName: 'Vikram', lastName: 'Singh', role: 'Operator', status: 'Pending Approval', createdAt: "2024-07-28T16:00:00Z", updatedAt: "2024-07-28T16:00:00Z", nsopLicenseNumber: "NSOP/JETSET/2023", mouAcceptedAt: "2024-07-28T16:00:00Z", city: 'Bengaluru', zone: 'South' },
    { id: 'operator-user-03', externalAuthId: 'operator-user-03', email: 'charters@airone.in', companyName: 'AirOne Charters', firstName: 'Anita', lastName: 'Desai', role: 'Operator', status: 'Approved', createdAt: "2024-07-25T10:00:00Z", updatedAt: "2024-07-25T10:00:00Z", nsopLicenseNumber: "NSOP/AIRONE/2020", mouAcceptedAt: "2024-07-25T10:00:00Z", city: 'Delhi', zone: 'North' },
    { id: 'ctd-admin-user-01', email: 'ctd.admin@corp.com', firstName: 'Priya', lastName: 'Sharma', role: 'CTD Admin', company: 'Stark Industries', status: 'Active', createdAt: "2024-07-25T14:00:00Z", updatedAt: "2024-07-25T14:00:00Z", ctdId: 'ctd-stark-01' },
    { id: 'distributor-user-01', email: 'sales@sky-dist.com', firstName: 'Amit', lastName: 'Patel', role: 'Travel Agency', company: 'Sky Distributors', status: 'Active', createdAt: "2024-07-24T16:00:00Z", updatedAt: "2024-07-24T16:00:00Z", companyName: "Sky Distributors" },
    { id: 'hotel-user-01', email: 'mgr@grandhotel.com', firstName: 'Meera', lastName: 'Chopra', role: 'Hotel Partner', company: 'The Grand Hotel Group', status: 'Active', createdAt: "2024-07-23T18:00:00Z", updatedAt: "2024-07-23T18:00:00Z", companyName: "The Grand Hotel Group" },
    { id: 'employee-user-01', email: 'h.hogan@stark.com', firstName: 'Happy', lastName: 'Hogan', role: 'Requester', company: 'Stark Industries', status: 'Active', createdAt: "2024-07-25T15:00:00Z", updatedAt: "2024-07-25T15:00:00Z", ctdId: 'ctd-stark-01' },
];

export const mockCorporateTravelDesks: CorporateTravelDesk[] = [
    { id: 'ctd-stark-01', companyName: 'Stark Industries', adminExternalAuthId: 'ctd-admin-user-01', status: 'Active', createdAt: "2024-07-25T13:59:00Z", updatedAt: "2024-07-25T13:59:00Z" }
];

export const mockOperators: Operator[] = mockUsers
  .filter(u => u.role === 'Operator')
  .map(u => ({
    id: u.id,
    externalAuthId: u.id,
    companyName: u.companyName!,
    nsopLicenseNumber: (u as any).nsopLicenseNumber,
    contactPersonName: `${u.firstName} ${u.lastName}`,
    contactEmail: u.email,
    status: u.status as 'Pending Approval' | 'Approved' | 'Suspended' | 'Rejected',
    mouAcceptedAt: (u as any).mouAcceptedAt,
    createdAt: u.createdAt,
    updatedAt: u.updatedAt,
    city: (u as any).city,
    zone: (u as any).zone,
    featured: u.id === 'operator-user-01' || u.id === 'operator-user-03',
  }));

export const mockRfqs: CharterRFQ[] = [
    { id: 'RFQ-COORD-001', customerId: 'customer-user-01', requesterExternalAuthId: 'customer-user-01', customerName: 'Sanjana Kumar', tripType: 'Onward', departure: 'Mumbai (BOM)', arrival: 'Delhi (DEL)', departureDate: '2024-08-10', departureTime: '10:00', pax: 4, aircraftType: 'Any Light Jet', status: 'Submitted', createdAt: '2024-07-28T12:00:00Z', bidsCount: 0 },
    { id: 'RFQ-CONF-002', customerId: 'customer-user-01', requesterExternalAuthId: 'customer-user-01', customerName: 'Sanjana Kumar', tripType: 'Return', departure: 'Bengaluru (BLR)', arrival: 'Goa (GOI)', departureDate: '2024-08-15', departureTime: '11:30', returnDate: '2024-08-18', returnTime: '16:00', pax: 2, aircraftType: 'Any Turboprop', status: 'Confirmed', createdAt: '2024-07-27T15:00:00Z', bidsCount: 1, hotelRequired: true },
    { id: 'RFQ-CORP-001', customerId: 'employee-user-01', requesterExternalAuthId: 'employee-user-01', customerName: 'Happy Hogan', tripType: 'Onward', departure: 'New York (JFK)', arrival: 'Mumbai (BOM)', departureDate: '2024-09-10', departureTime: '23:00', pax: 1, aircraftType: 'Heavy Jet', status: 'Pending Approval', createdAt: '2024-08-01T10:00:00Z', bidsCount: 0, costCenter: 'EXECUTIVE-MGMT', businessPurpose: 'Global Security Summit', company: 'Stark Industries' },
    { id: 'RFQ-CORP-002', customerId: 'ctd-admin-user-01', requesterExternalAuthId: 'ctd-admin-user-01', customerName: 'Priya Sharma', tripType: 'Return', departure: 'Delhi (DEL)', arrival: 'London (LHR)', departureDate: '2024-09-20', departureTime: '09:00', returnDate: '2024-09-25', returnTime: '18:00', pax: 5, aircraftType: 'Any Mid-size Jet', status: 'Bidding Open', createdAt: '2024-08-02T14:00:00Z', bidsCount: 3, costCenter: 'R&D-SPECIAL-PROJ', company: 'Stark Industries' },
    { id: 'RFQ-PEND-003', customerId: 'employee-user-01', requesterExternalAuthId: 'employee-user-01', customerName: 'Happy Hogan', tripType: 'Onward', departure: 'Mumbai (BOM)', arrival: 'Bengaluru (BLR)', departureDate: '2024-08-25', departureTime: '08:30', pax: 2, aircraftType: 'Any Light Jet', status: 'Pending Approval', createdAt: '2024-08-05T09:00:00Z', bidsCount: 0, costCenter: 'TECH-INFRA', businessPurpose: 'Data Center Resilience Audit', company: 'Stark Industries' },
    { id: 'RFQ-PEND-004', customerId: 'employee-user-01', requesterExternalAuthId: 'employee-user-01', customerName: 'Happy Hogan', tripType: 'Onward', departure: 'Delhi (DEL)', arrival: 'Singapore (SIN)', departureDate: '2024-09-05', departureTime: '22:00', pax: 4, aircraftType: 'Any Heavy Jet', status: 'Pending Approval', createdAt: '2024-08-06T11:20:00Z', bidsCount: 0, costCenter: 'GLOBAL-STRATEGY', businessPurpose: 'Regional HQ Integration Planning', company: 'Stark Industries' },
    { id: 'RFQ-PEND-005', customerId: 'employee-user-01', requesterExternalAuthId: 'employee-user-01', customerName: 'Happy Hogan', tripType: 'Return', departure: 'Hyderabad (HYD)', arrival: 'Mumbai (BOM)', departureDate: '2024-08-28', departureTime: '14:00', returnDate: '2024-08-29', returnTime: '19:00', pax: 1, aircraftType: 'Any Turboprop', status: 'Pending Approval', createdAt: '2024-08-07T16:45:00Z', bidsCount: 0, costCenter: 'OPS-INTERNAL', businessPurpose: 'Facility Compliance Inspection', company: 'Stark Industries' },
];

export const mockAircrafts: Aircraft[] = [
    { id: 'AC-VTFLY', operatorId: 'operator-user-01', name: 'Phenom 300E', type: 'Light Jet', registration: 'VT-FLY', paxCapacity: 8, homeBase: 'Mumbai (BOM)', status: 'Available' },
    { id: 'AC-VTPC', operatorId: 'operator-user-03', name: 'Pilatus PC-12', type: 'Turboprop', registration: 'VT-PC', paxCapacity: 8, homeBase: 'Delhi (DEL)', status: 'Available' },
    { id: 'AC-VTHEV', operatorId: 'operator-user-01', name: 'Global 6000', type: 'Heavy Jet', registration: 'VT-HEV', paxCapacity: 14, homeBase: 'Mumbai (BOM)', status: 'Under Maintenance' },
];

export const mockQuotations: Quotation[] = [
    { id: 'QTE-114', rfqId: 'RFQ-CONF-002', operatorId: 'operator-user-01', operatorName: 'FlyCo Charter', aircraftId: 'AC-VTFLY', aircraftName: 'Phenom 300E', price: 450000, status: 'Selected', submittedAt: '2024-07-27T16:00:00Z', validUntil: '2024-07-28T16:00:00Z' },
];

export const mockEmptyLegs: EmptyLeg[] = [
    { id: 'EL-901', operatorId: 'operator-user-01', operatorName: 'FlyCo Charter', aircraftId: 'AC-VTFLY', aircraftName: 'Phenom 300E', departure: 'Delhi (DEL)', arrival: 'Mumbai (BOM)', departureTime: '2024-08-05T14:00:00Z', availableSeats: 4, seatsAllocated: 2, status: 'Published' },
];

export const mockEmptyLegSeatAllocationRequests: EmptyLegSeatAllocationRequest[] = [];

export const mockProperties: Property[] = [
    { id: 'PROP-01', hotelPartnerId: 'hotel-user-01', name: 'The Grand Mumbai', address: '123 Marine Drive, Mumbai', city: 'Mumbai', status: 'Active', propertyType: 'Luxury Hotel', imageUrl: 'https://picsum.photos/seed/hotel1/600/400' },
];

export const mockRoomCategories: RoomCategory[] = [
    { id: 'RC-DLX-MUM', propertyId: 'PROP-01', name: 'Deluxe King Room', maxOccupancy: 2, beddingType: 'King', baseCapacity: 2, description: 'A spacious room with city views.', imageUrl: 'https://picsum.photos/seed/room1/600/400', nightlyRate: 18500 },
];

export const mockAccommodationRequests: AccommodationRequest[] = [];

export const mockAuditLogs: AuditLog[] = [
    { id: 'LOG-001', timestamp: '2024-07-28T12:00:00Z', user: 'Sanjana Kumar', role: 'Customer', action: 'CREATE RFQ', details: 'Created new personal RFQ', targetId: 'RFQ-COORD-001' },
];

export const mockBillingRecords: BillingRecord[] = [];

export const mockFeatureFlags: FeatureFlag[] = [];

export const mockBlogPosts: BlogPost[] = [
  { id: 'post-1', title: 'Yield Optimization: Navigating Empty Leg Pricing in 2024', excerpt: 'A technical analysis of dynamic pricing models.', category: 'Empty Leg Insights', imageUrl: getImg('blog-1'), author: 'AeroDesk Intel', date: '2024-07-30', isFeatured: true },
];

export const mockPressReleases: PressRelease[] = [
  { id: 'pr-1', title: 'Strategic Expansion: AeroDesk Integrates Mumbai International Heliport', description: 'Enhancing Tier-1 connectivity.', date: '2024-07-30', category: 'Partnership' },
];

export const mockMediaMentions: MediaMention[] = [
  { id: 'mm-1', publication: 'The Economic Times', title: 'Digitalizing Indian Skies', snippet: '"AeroDesk is filling a critical gap..."', date: '2024-07-28' },
];

export const mockBrandAssets: BrandAsset[] = [
  { id: 'ba-1', title: 'AeroDesk Logo Pack', type: 'Logo', imageUrl: getImg('media-asset-1'), fileSize: '4.2 MB' },
];

export function getMockDataForRole(role: string) {
    return {
        users: mockUsers,
        operators: mockOperators,
        rfqs: mockRfqs,
        emptyLegs: mockEmptyLegs,
        auditLogs: mockAuditLogs,
        aircrafts: mockAircrafts,
        quotations: mockQuotations,
        accommodationRequests: mockAccommodationRequests,
        corporateTravelDesks: mockCorporateTravelDesks,
        properties: mockProperties,
        roomCategories: mockRoomCategories,
        seatAllocationRequests: mockEmptyLegSeatAllocationRequests,
        billingRecords: mockBillingRecords,
        featureFlags: mockFeatureFlags,
        blogPosts: mockBlogPosts,
        pressReleases: mockPressReleases,
        mediaMentions: mockMediaMentions,
        brandAssets: mockBrandAssets
    };
}
