
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
    { id: 'RFQ-COORD-001', customerId: 'customer-user-01', requesterExternalAuthId: 'customer-user-01', customerName: 'Sanjana Kumar', tripType: 'Onward', departure: 'Mumbai (BOM)', arrival: 'Delhi (DEL)', departureDate: '2024-08-10', pax: 4, aircraftType: 'Any Light Jet', status: 'Submitted', createdAt: '2024-07-28T12:00:00Z', bidsCount: 0 },
    { id: 'RFQ-CONF-002', customerId: 'customer-user-01', requesterExternalAuthId: 'customer-user-01', customerName: 'Sanjana Kumar', tripType: 'Return', departure: 'Bengaluru (BLR)', arrival: 'Goa (GOI)', departureDate: '2024-08-15', returnDate: '2024-08-18', pax: 2, aircraftType: 'Any Turboprop', status: 'Confirmed', createdAt: '2024-07-27T15:00:00Z', bidsCount: 1, hotelRequired: true },
    { id: 'RFQ-ACTION-003', customerId: 'customer-user-01', requesterExternalAuthId: 'customer-user-01', customerName: 'Sanjana Kumar', tripType: 'Onward', departure: 'Chennai (MAA)', arrival: 'Hyderabad (HYD)', departureDate: '2024-08-12', pax: 6, aircraftType: 'Any Mid-size Jet', status: 'Reviewing', createdAt: '2024-07-28T14:00:00Z', bidsCount: 3, hotelRequired: true },
    { id: 'RFQ-BID-004', customerId: 'customer-user-01', requesterExternalAuthId: 'customer-user-01', customerName: 'Sanjana Kumar', tripType: 'Multi-City', departure: 'Delhi (DEL)', arrival: 'Jaipur (JAI)', departureDate: '2024-09-01', pax: 3, aircraftType: 'Any Light Jet', status: 'Bidding Open', createdAt: '2024-07-29T09:00:00Z', bidsCount: 2 },
    { id: 'RFQ-INTL-005', customerId: 'customer-user-02', requesterExternalAuthId: 'customer-user-02', customerName: 'Arjun Mehta', tripType: 'Return', departure: 'Mumbai (BOM)', arrival: 'Dubai (DXB)', departureDate: '2024-08-20', returnDate: '2024-08-25', pax: 8, aircraftType: 'Any Heavy Jet', status: 'Bidding Open', createdAt: '2024-07-30T10:00:00Z', bidsCount: 0 },
    { id: 'RFQ-LONG-006', customerId: 'customer-user-02', requesterExternalAuthId: 'customer-user-02', customerName: 'Arjun Mehta', tripType: 'Onward', departure: 'Delhi (DEL)', arrival: 'London (LHR)', departureDate: '2024-09-10', pax: 12, aircraftType: 'Heavy Jet', status: 'Bidding Open', createdAt: '2024-07-30T11:00:00Z', bidsCount: 1 },
];

export const mockAircrafts: Aircraft[] = [
    { id: 'AC-VTFLY', operatorId: 'operator-user-01', name: 'Phenom 300E', type: 'Light Jet', registration: 'VT-FLY', paxCapacity: 8, homeBase: 'Mumbai (BOM)', status: 'Available' },
    { id: 'AC-VTPC', operatorId: 'operator-user-03', name: 'Pilatus PC-12', type: 'Turboprop', registration: 'VT-PC', paxCapacity: 8, homeBase: 'Delhi (DEL)', status: 'Available' },
    { id: 'AC-VTHEV', operatorId: 'operator-user-01', name: 'Global 6000', type: 'Heavy Jet', registration: 'VT-HEV', paxCapacity: 14, homeBase: 'Mumbai (BOM)', status: 'Under Maintenance' },
    { id: 'AC-VTMID', operatorId: 'operator-user-03', name: 'Falcon 2000', type: 'Mid-size Jet', registration: 'VT-MID', paxCapacity: 10, homeBase: 'Delhi (DEL)', status: 'Available' },
    { id: 'AC-VTAOG', operatorId: 'operator-user-01', name: 'Citation XLS+', type: 'Mid-size Jet', registration: 'VT-AOG', paxCapacity: 9, homeBase: 'Mumbai (BOM)', status: 'AOG' },
];

export const mockQuotations: Quotation[] = [
    { id: 'QTE-114', rfqId: 'RFQ-CONF-002', operatorId: 'operator-user-01', operatorName: 'FlyCo Charter', aircraftId: 'AC-VTFLY', aircraftName: 'Phenom 300E', price: 450000, status: 'Selected', submittedAt: '2024-07-27T16:00:00Z', validUntil: '2024-07-28T16:00:00Z' },
    { id: 'QTE-115', rfqId: 'RFQ-BID-004', operatorId: 'operator-user-01', operatorName: 'FlyCo Charter', aircraftId: 'AC-VTFLY', aircraftName: 'Phenom 300E', price: 380000, status: 'Submitted', submittedAt: '2024-07-29T10:00:00Z', validUntil: '2024-07-30T10:00:00Z' },
    { id: 'QTE-116', rfqId: 'RFQ-ACTION-003', operatorId: 'operator-user-03', operatorName: 'AirOne Charters', aircraftId: 'AC-VTMID', aircraftName: 'Falcon 2000', price: 520000, status: 'Submitted', submittedAt: '2024-07-28T15:00:00Z', validUntil: '2024-07-29T15:00:00Z' },
];

export const mockEmptyLegs: EmptyLeg[] = [
    { id: 'EL-901', operatorId: 'operator-user-01', operatorName: 'FlyCo Charter', aircraftId: 'AC-VTFLY', aircraftName: 'Phenom 300E', departure: 'Delhi (DEL)', arrival: 'Mumbai (BOM)', departureTime: '2024-08-05T14:00:00Z', availableSeats: 4, seatsAllocated: 2, status: 'Published' },
    { id: 'EL-904', operatorId: 'operator-user-03', operatorName: 'AirOne Charters', aircraftId: 'AC-VTPC', aircraftName: 'Pilatus PC-12', departure: 'Udaipur (UDR)', arrival: 'Jaipur (JAI)', departureTime: '2024-08-11T12:00:00Z', availableSeats: 7, seatsAllocated: 0, status: 'Published' },
    { id: 'EL-905', operatorId: 'operator-user-01', operatorName: 'FlyCo Charter', aircraftId: 'AC-VTHEV', aircraftName: 'Global 6000', departure: 'Dubai (DXB)', arrival: 'Mumbai (BOM)', departureTime: '2024-08-15T18:00:00Z', availableSeats: 12, seatsAllocated: 0, status: 'Draft' },
    { id: 'EL-906', operatorId: 'operator-user-03', operatorName: 'AirOne Charters', aircraftId: 'AC-VTMID', aircraftName: 'Falcon 2000', departure: 'Mumbai (BOM)', arrival: 'Singapore (SIN)', departureTime: '2024-08-20T09:00:00Z', availableSeats: 10, seatsAllocated: 0, status: 'Pending Approval' },
];

export const mockEmptyLegSeatAllocationRequests: EmptyLegSeatAllocationRequest[] = [
    { id: 'SAR-COORD-501', emptyLegId: 'EL-901', distributorId: 'distributor-user-01', requesterExternalAuthId: 'customer-user-01', passengerName: 'Sanjana Kumar', numberOfSeats: 2, status: 'Requested', requestDateTime: '2024-07-30T10:00:00Z' },
    { id: 'SAR-CONF-502', emptyLegId: 'EL-904', distributorId: 'distributor-user-01', requesterExternalAuthId: 'customer-user-01', passengerName: 'Sanjana Kumar', numberOfSeats: 1, status: 'Approved', requestDateTime: '2024-07-31T11:00:00Z' },
    { id: 'SAR-NEW-503', emptyLegId: 'EL-901', distributorId: 'distributor-user-01', requesterExternalAuthId: 'customer-user-02', passengerName: 'Arjun Mehta', numberOfSeats: 1, status: 'Requested', requestDateTime: '2024-07-31T14:00:00Z' }
];

export const mockProperties: Property[] = [
    { id: 'PROP-01', hotelPartnerId: 'hotel-user-01', name: 'The Grand Mumbai', address: '123 Marine Drive, Mumbai', city: 'Mumbai', status: 'Active', propertyType: 'Luxury Hotel', imageUrl: 'https://picsum.photos/seed/hotel1/600/400' },
    { id: 'PROP-02', hotelPartnerId: 'hotel-user-01', name: 'The Palace Delhi', address: '456 Connaught Place, Delhi', city: 'Delhi', status: 'Active', propertyType: 'Heritage Hotel', imageUrl: 'https://picsum.photos/seed/hotel2/600/400' },
];

export const mockRoomCategories: RoomCategory[] = [
    { id: 'RC-DLX-MUM', propertyId: 'PROP-01', name: 'Deluxe King Room', maxOccupancy: 2, beddingType: 'King', baseCapacity: 2, description: 'A spacious room with a king-sized bed and stunning city views.', imageUrl: 'https://picsum.photos/seed/room1/600/400' },
];

export const mockAccommodationRequests: AccommodationRequest[] = [
    { id: 'ACC-CONF-301', tripReferenceId: 'RFQ-CONF-002', tripType: 'Charter', hotelPartnerId: 'hotel-user-01', propertyId: 'PROP-03', propertyName: 'Goa Beach Resort', guestName: 'Sanjana Kumar', checkIn: '2024-08-15', checkOut: '2024-08-18', rooms: 1, status: 'Confirmed' },
    { id: 'ACC-COORD-302', tripReferenceId: 'RFQ-ACTION-003', tripType: 'Charter', hotelPartnerId: 'hotel-user-01', propertyId: 'PROP-02', propertyName: 'The Palace Delhi', guestName: 'Sanjana Kumar', checkIn: '2024-08-12', checkOut: '2024-08-14', rooms: 2, status: 'Pending' },
];

export const mockAuditLogs: AuditLog[] = [
    { id: 'LOG-001', timestamp: '2024-07-28T12:00:00Z', user: 'Sanjana Kumar', role: 'Customer', action: 'CREATE RFQ', details: 'Created new personal RFQ', targetId: 'RFQ-COORD-001' },
    { id: 'LOG-002', timestamp: '2024-07-29T10:00:00Z', user: 'FlyCo Ops', role: 'Operator', action: 'SUBMIT QUOTATION', details: 'Submitted bid for RFQ-BID-004', targetId: 'QTE-115' },
    { id: 'LOG-003', timestamp: '2024-07-30T09:00:00Z', user: 'FlyCo Ops', role: 'Operator', action: 'FLEET UPDATE', details: 'Updated status of AC-VTHEV to Under Maintenance', targetId: 'AC-VTHEV' },
    { id: 'LOG-004', timestamp: '2024-07-30T11:00:00Z', user: 'AirOne Charters', role: 'Operator', action: 'EMPTY LEG CREATED', details: 'New empty leg listed Mumbai to Singapore', targetId: 'EL-906' },
];

export const mockBillingRecords: BillingRecord[] = [
    { id: 'BILL-001', entityName: 'FlyCo Charter', entityId: 'operator-user-01', eventType: 'Subscription', amount: 50000, currency: 'INR', status: 'Paid', date: '2024-07-01T10:00:00Z' },
];

export const mockFeatureFlags: FeatureFlag[] = [
    { id: 'FF-01', name: 'EmptyLegAutoApproval', description: 'Automatically approve empty leg submissions.', isEnabled: false },
    { id: 'FF-02', name: 'AiComplianceCheck', description: 'Enable AI-powered compliance checks.', isEnabled: true },
];

export const mockBlogPosts: BlogPost[] = [
  { id: 'post-1', title: 'Yield Optimization: Navigating Empty Leg Pricing in 2024', excerpt: 'A technical analysis of dynamic pricing models used to maximize asset utilization.', category: 'Empty Leg Insights', imageUrl: getImg('blog-1'), author: 'AeroDesk Intel', date: '2024-07-30', isFeatured: true },
  { id: 'post-2', title: 'NSOP Compliance: New Directives for Indian Charter Operations', excerpt: 'Detailed breakdown of recent regulatory changes affecting non-scheduled operator permits.', category: 'Industry', imageUrl: getImg('blog-2'), author: 'Governance Desk', date: '2024-07-28' },
];

export const mockPressReleases: PressRelease[] = [
  { id: 'pr-1', title: 'Strategic Expansion: AeroDesk Integrates Mumbai International Heliport Network', description: 'Enhancing Tier-1 connectivity through unified helicopter charter coordination workflows.', date: '2024-07-30', category: 'Partnership' },
];

export const mockMediaMentions: MediaMention[] = [
  { id: 'mm-1', publication: 'The Economic Times', title: 'Digitalizing Indian Skies: The AeroDesk Approach', snippet: '"AeroDesk is filling a critical gap in India’s aviation governance framework..."', date: '2024-07-28' },
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
