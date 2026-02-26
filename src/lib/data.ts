
import type { User, CharterRFQ, EmptyLeg, Aircraft, Quotation, AuditLog, AccommodationRequest, CorporateTravelDesk, Property, RoomCategory, EmptyLegSeatAllocationRequest, Operator, BillingRecord, FeatureFlag, PolicyFlag, BlogPost, PressRelease, MediaMention, BrandAsset, CrewMember } from './types';
import { PlaceHolderImages } from './placeholder-images';

const getImg = (id: string) => PlaceHolderImages.find(img => img.id === id)?.imageUrl || '';

// Verified NSOP Registry - Top Indian Operators
export const VERIFIED_NSOP_REGISTRY = [
    { companyName: 'TajAir (Tata Group)', nsopLicenseNumber: 'NSOP/TAJ/02', city: 'Mumbai', zone: 'West' },
    { companyName: 'Club One Air', nsopLicenseNumber: 'NSOP/COA/05', city: 'Delhi', zone: 'North' },
    { companyName: 'JetSetGo Aviation', nsopLicenseNumber: 'NSOP/JSG/12', city: 'Bengaluru', zone: 'South' },
    { companyName: 'Global Vectra Helicorp', nsopLicenseNumber: 'NSOP/GVH/08', city: 'Mumbai', zone: 'West' },
    { companyName: 'Himalayan Heli Services', nsopLicenseNumber: 'NSOP/HHS/04', city: 'Delhi', zone: 'North' },
    { companyName: 'Deccan Charters', nsopLicenseNumber: 'NSOP/DEC/03', city: 'Bengaluru', zone: 'South' },
    { companyName: 'Titan Aviation', nsopLicenseNumber: 'NSOP/TIT/07', city: 'Indore', zone: 'Central' },
    { companyName: 'Raymond Aviation', nsopLicenseNumber: 'NSOP/RAY/09', city: 'Mumbai', zone: 'West' },
    { companyName: 'Pawan Hans', nsopLicenseNumber: 'NSOP/PHL/10', city: 'Delhi', zone: 'North' },
    { companyName: 'AirOne Charters', nsopLicenseNumber: 'NSOP/AIRONE/2020', city: 'Delhi', zone: 'North' },
    { companyName: 'FlyCo Charter', nsopLicenseNumber: 'NSOP/FLYCO/2021', city: 'Mumbai', zone: 'West' },
];

export const mockUsers: User[] = [
    { id: 'admin-user-01', email: 'admin@aerodesk.com', firstName: 'Admin', lastName: 'User', role: 'Admin', status: 'Active', createdAt: "2024-07-28T10:00:00Z", updatedAt: "2024-07-28T10:00:00Z" },
    { id: 'customer-user-01', email: 'customer@example.com', firstName: 'Sanjana', lastName: 'Kumar', role: 'Customer', status: 'Active', createdAt: "2024-07-27T11:20:00Z", updatedAt: "2024-07-27T11:20:00Z" },
    { id: 'operator-user-01', externalAuthId: 'operator-user-01', email: 'ops@flyco.com', companyName: 'FlyCo Charter', firstName: 'Rajesh', lastName: 'Verma', role: 'Operator', status: 'Approved', createdAt: "2024-07-26T09:00:00Z", updatedAt: "2024-07-26T09:00:00Z", nsopLicenseNumber: "NSOP/FLYCO/2021", mouAcceptedAt: "2024-07-26T09:00:00Z", city: 'Mumbai', zone: 'West' },
    { id: 'operator-user-02', externalAuthId: 'operator-user-02', email: 'contact@jetset.aero', companyName: 'JetSetGo Aviation', firstName: 'Vikram', lastName: 'Singh', role: 'Operator', status: 'Pending Approval', createdAt: "2024-07-28T16:00:00Z", updatedAt: "2024-07-28T16:00:00Z", nsopLicenseNumber: "NSOP/JSG/12", mouAcceptedAt: "2024-07-28T16:00:00Z", city: 'Bengaluru', zone: 'South' },
    { id: 'operator-user-03', externalAuthId: 'operator-user-03', email: 'charters@tajair.com', companyName: 'TajAir (Tata Group)', firstName: 'Anita', lastName: 'Desai', role: 'Operator', status: 'Approved', createdAt: "2024-07-25T10:00:00Z", updatedAt: "2024-07-25T10:00:00Z", nsopLicenseNumber: "NSOP/TAJ/02", mouAcceptedAt: "2024-07-25T10:00:00Z", city: 'Mumbai', zone: 'West' },
    { id: 'ctd-admin-user-01', email: 'ctd.admin@corp.com', firstName: 'Priya', lastName: 'Sharma', role: 'CTD Admin', company: 'Stark Industries', status: 'Active', createdAt: "2024-07-25T14:00:00Z", updatedAt: "2024-07-25T14:00:00Z", ctdId: 'ctd-stark-01' },
    { id: 'distributor-user-01', email: 'sales@sky-dist.com', firstName: 'Amit', lastName: 'Patel', role: 'Travel Agency', company: 'Sky Distributors', status: 'Active', createdAt: "2024-07-24T16:00:00Z", updatedAt: "2024-07-24T16:00:00Z", companyName: "Sky Distributors" },
    { id: 'hotel-user-01', email: 'mgr@grandhotel.com', firstName: 'Meera', lastName: 'Chopra', role: 'Hotel Partner', company: 'The Grand Hotel Group', status: 'Active', createdAt: "2024-07-23T18:00:00Z", updatedAt: "2024-07-23T18:00:00Z", companyName: "The Grand Hotel Group" },
    { id: 'employee-user-01', email: 'h.hogan@stark.com', firstName: 'Happy', lastName: 'Hogan', role: 'Requester', company: 'Stark Industries', status: 'Active', createdAt: "2024-07-25T15:00:00Z", updatedAt: "2024-07-25T15:00:00Z", ctdId: 'ctd-stark-01' },
];

export const mockCorporateTravelDesks: CorporateTravelDesk[] = [
    { id: 'ctd-stark-01', companyName: 'Stark Industries', adminExternalAuthId: 'ctd-admin-user-01', status: 'Active', createdAt: "2024-07-25T13:59:00Z", updatedAt: "2024-07-25T13:59:00Z" }
];

export const mockOperators: Operator[] = [
    ...mockUsers.filter(u => u.role === 'Operator').map(u => ({
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
        featured: u.id === 'operator-user-03',
    })),
    // Additional Top NSOP Operators for Network View
    { id: 'op-coair', externalAuthId: 'op-coair', companyName: 'Club One Air', nsopLicenseNumber: 'NSOP/COA/05', contactPersonName: 'Registry Admin', contactEmail: 'ops@cluboneair.com', status: 'Approved', mouAcceptedAt: '2024-01-01', createdAt: '2024-01-01', updatedAt: '2024-01-01', city: 'Delhi', zone: 'North' },
    { id: 'op-gvheli', externalAuthId: 'op-gvheli', companyName: 'Global Vectra Helicorp', nsopLicenseNumber: 'NSOP/GVH/08', contactPersonName: 'Registry Admin', contactEmail: 'ops@globalvectra.com', status: 'Approved', mouAcceptedAt: '2024-01-01', createdAt: '2024-01-01', updatedAt: '2024-01-01', city: 'Mumbai', zone: 'West' },
    { id: 'op-titan', externalAuthId: 'op-titan', companyName: 'Titan Aviation', nsopLicenseNumber: 'NSOP/TIT/07', contactPersonName: 'Registry Admin', contactEmail: 'ops@titanaviation.com', status: 'Pending Approval', mouAcceptedAt: '2024-01-01', createdAt: '2024-01-01', updatedAt: '2024-01-01', city: 'Indore', zone: 'Central' },
    { id: 'op-deccan', externalAuthId: 'op-deccan', companyName: 'Deccan Charters', nsopLicenseNumber: 'NSOP/DEC/03', contactPersonName: 'Registry Admin', contactEmail: 'ops@deccan.com', status: 'Approved', mouAcceptedAt: '2024-01-01', createdAt: '2024-01-01', updatedAt: '2024-01-01', city: 'Bengaluru', zone: 'South' },
];

export const mockRfqs: CharterRFQ[] = [
    { id: 'RFQ-COORD-001', customerId: 'customer-user-01', requesterExternalAuthId: 'customer-user-01', customerName: 'Sanjana Kumar', tripType: 'Onward', departure: 'Mumbai (BOM)', arrival: 'Delhi (DEL)', departureDate: '2024-08-10', departureTime: '10:00', pax: 4, aircraftType: 'Any Light Jet', status: 'Bidding Open', createdAt: '2024-07-28T12:00:00Z', bidsCount: 0 },
    { id: 'RFQ-CONF-002', customerId: 'customer-user-01', requesterExternalAuthId: 'customer-user-01', customerName: 'Sanjana Kumar', tripType: 'Return', departure: 'Bengaluru (BLR)', arrival: 'Goa (GOI)', departureDate: '2024-08-15', departureTime: '11:30', returnDate: '2024-08-18', returnTime: '16:00', pax: 2, aircraftType: 'Any Turboprop', status: 'Confirmed', createdAt: '2024-07-27T15:00:00Z', bidsCount: 1, hotelRequired: true },
    { id: 'RFQ-CORP-001', customerId: 'employee-user-01', requesterExternalAuthId: 'employee-user-01', customerName: 'Happy Hogan', tripType: 'Onward', departure: 'New York (JFK)', arrival: 'Mumbai (BOM)', departureDate: '2024-09-10', departureTime: '23:00', pax: 1, aircraftType: 'Heavy Jet', status: 'Pending Approval', createdAt: '2024-08-01T10:00:00Z', bidsCount: 0, costCenter: 'EXECUTIVE-MGMT', businessPurpose: 'Global Security Summit', company: 'Stark Industries' },
    { id: 'RFQ-CORP-002', customerId: 'ctd-admin-user-01', requesterExternalAuthId: 'ctd-admin-user-01', customerName: 'Priya Sharma', tripType: 'Return', departure: 'Delhi (DEL)', arrival: 'London (LHR)', departureDate: '2024-09-20', departureTime: '09:00', returnDate: '2024-09-25', returnTime: '18:00', pax: 5, aircraftType: 'Any Mid-size Jet', status: 'Bidding Open', createdAt: '2024-08-02T14:00:00Z', bidsCount: 3, costCenter: 'R&D-SPECIAL-PROJ', company: 'Stark Industries' },
];

export const mockQuotations: Quotation[] = [
    { id: 'QUOTE-001', rfqId: 'RFQ-COORD-001', operatorId: 'operator-user-01', operatorName: 'FlyCo Charter', aircraftId: 'AC-VTFLY', aircraftName: 'Phenom 300E', price: 450000, status: 'Submitted', submittedAt: '2024-07-28T14:00:00Z', validUntil: '2024-08-01', operatorRemarks: 'Inclusive of all taxes and landing fees.' },
    { id: 'QUOTE-002', rfqId: 'RFQ-CORP-002', operatorId: 'operator-user-03', operatorName: 'TajAir (Tata Group)', aircraftId: 'AC-VTPC', aircraftName: 'Pilatus PC-12', price: 850000, status: 'Submitted', submittedAt: '2024-08-02T16:00:00Z', validUntil: '2024-08-10', operatorRemarks: 'Standard corporate rate applied.' },
];

export const mockAircrafts: Aircraft[] = [
    { id: 'AC-VTFLY', operatorId: 'operator-user-01', name: 'Phenom 300E', type: 'Light Jet', registration: 'VT-FLY', paxCapacity: 8, homeBase: 'Mumbai (BOM)', status: 'Available' },
    { id: 'AC-VTPC', operatorId: 'operator-user-03', name: 'Pilatus PC-12', type: 'Turboprop', registration: 'VT-PC', paxCapacity: 8, homeBase: 'Delhi (DEL)', status: 'Available' },
];

export const mockCrew: CrewMember[] = [
    { id: 'CREW-001', operatorId: 'operator-user-01', firstName: 'Karan', lastName: 'Johar', email: 'k.johar@flyco.com', role: 'Captain', status: 'Available', licenseNumber: 'ATPL-90210', assignedAircraftId: 'AC-VTFLY', assignedAircraftRegistration: 'VT-FLY', createdAt: '2024-01-01', updatedAt: '2024-01-01' },
    { id: 'CREW-002', operatorId: 'operator-user-01', firstName: 'Siddharth', lastName: 'Malhotra', email: 's.mal@flyco.com', role: 'First Officer', status: 'On Duty', licenseNumber: 'CPL-8821', assignedAircraftId: 'AC-VTFLY', assignedAircraftRegistration: 'VT-FLY', createdAt: '2024-01-01', updatedAt: '2024-01-01' },
    { id: 'CREW-003', operatorId: 'operator-user-03', firstName: 'Anita', lastName: 'Verma', email: 'a.verma@tajair.com', role: 'Cabin Crew', status: 'Available', licenseNumber: 'CC-7762', assignedAircraftId: 'AC-VTPC', assignedAircraftRegistration: 'VT-PC', createdAt: '2024-01-01', updatedAt: '2024-01-01' },
    { id: 'CREW-004', operatorId: 'operator-user-01', firstName: 'Anjali', lastName: 'Singh', email: 'a.singh@flyco.com', role: 'Cabin Crew', status: 'Available', licenseNumber: 'CC-9981', assignedAircraftId: 'AC-VTFLY', assignedAircraftRegistration: 'VT-FLY', createdAt: '2024-01-01', updatedAt: '2024-01-01' },
];

export const mockEmptyLegs: EmptyLeg[] = [
    { id: 'EL-901', operatorId: 'operator-user-01', operatorName: 'FlyCo Charter', aircraftId: 'AC-VTFLY', aircraftName: 'Phenom 300E', departure: 'Delhi (DEL)', arrival: 'Mumbai (BOM)', departureTime: '2024-08-05T14:00:00Z', availableSeats: 4, seatsAllocated: 2, status: 'Published' },
];

export const mockEmptyLegSeatAllocationRequests: EmptyLegSeatAllocationRequest[] = [
    { 
        id: 'SL-REQ-001', 
        emptyLegId: 'EL-901', 
        distributorId: 'distributor-user-01', 
        requesterExternalAuthId: 'distributor-user-01', 
        numberOfSeats: 2, 
        status: 'Requested', 
        requestDateTime: '2024-07-28T10:00:00Z', 
        clientReference: 'Kapoor Family', 
        passengerName: 'Kapoor Party (2 PAX)',
        passengerNotes: 'Requesting window seats if possible.' 
    },
    { 
        id: 'SL-CONF-002', 
        emptyLegId: 'EL-901', 
        distributorId: 'distributor-user-01', 
        requesterExternalAuthId: 'distributor-user-01', 
        numberOfSeats: 1, 
        status: 'Approved', 
        requestDateTime: '2024-07-27T15:30:00Z', 
        clientReference: 'Corporate Solo', 
        passengerName: 'Amit Shah',
        passengerNotes: 'Executive movement.' 
    }
];

export const mockProperties: Property[] = [
    { id: 'PROP-01', hotelPartnerId: 'hotel-user-01', name: 'The Grand Mumbai', address: '123 Marine Drive, Mumbai', city: 'Mumbai', status: 'Active', propertyType: 'Luxury Hotel', imageUrl: 'https://picsum.photos/seed/hotel1/600/400' },
];

export const mockRoomCategories: RoomCategory[] = [
    { id: 'RC-DLX-MUM', propertyId: 'PROP-01', name: 'Deluxe King Room', maxOccupancy: 2, beddingType: 'King', baseCapacity: 2, description: 'A spacious room with city views.', imageUrl: 'https://picsum.photos/seed/room1/600/400', nightlyRate: 18500 },
];

export const mockAccommodationRequests: AccommodationRequest[] = [
    { id: 'ACC-AGENCY-401', tripReferenceId: 'RFQ-CORP-001', tripType: 'Charter', requesterId: 'distributor-user-01', hotelPartnerId: 'hotel-user-01', propertyId: 'PROP-01', propertyName: 'The Grand Mumbai', guestName: 'Executive VIP', checkIn: '2024-09-10', checkOut: '2024-09-12', rooms: 2, status: 'Awaiting Clarification', specialRequests: 'Connected suites required for security detail.' },
    { id: 'ACC-REQ-001', tripReferenceId: 'RFQ-COORD-001', tripType: 'Charter', requesterId: 'customer-user-01', hotelPartnerId: 'hotel-user-01', propertyId: 'PROP-01', propertyName: 'The Grand Mumbai', guestName: 'Sanjana Kumar', checkIn: '2024-08-10', checkOut: '2024-08-12', rooms: 1, status: 'Pending' },
    { id: 'ACC-REQ-002', tripReferenceId: 'RFQ-CONF-002', tripType: 'Charter', requesterId: 'customer-user-01', hotelPartnerId: 'hotel-user-01', propertyId: 'PROP-01', propertyName: 'The Grand Mumbai', guestName: 'Sanjana Kumar', checkIn: '2024-08-15', checkOut: '2024-08-18', rooms: 1, status: 'Confirmed' },
];

export const mockAuditLogs: AuditLog[] = [
    { id: 'LOG-001', timestamp: '2024-07-28T12:00:00Z', user: 'Sanjana Kumar', role: 'Customer', action: 'CREATE RFQ', details: 'Created new personal RFQ', targetId: 'RFQ-COORD-001' },
];

export const mockBillingRecords: BillingRecord[] = [
    { id: 'BILL-001', entityName: 'Stark Industries', entityId: 'ctd-stark-01', eventType: 'Subscription', amount: 150000, currency: 'INR', status: 'Paid', date: '2024-07-01' },
    { id: 'BILL-002', entityName: 'FlyCo Charter', entityId: 'operator-user-01', eventType: 'Participation Fee', amount: 25000, currency: 'INR', status: 'Pending', date: '2024-07-28' },
];

export const mockFeatureFlags: FeatureFlag[] = [
    { id: 'flag-empty-leg-auto', name: 'Empty Leg Auto-Expiry', description: 'Automatically expire empty leg listings 2 hours before departure.', isEnabled: true },
    { id: 'flag-ai-compliance', name: 'AI Compliance Guard', description: 'Enable real-time AI checking of NSOP registry data.', isEnabled: true },
];

export const mockPolicyFlags: PolicyFlag[] = [
    { id: 'POL-001', ctdId: 'ctd-stark-01', name: 'Preferred Operator Protocol', description: 'Mandates selection of operators with sustainability ratings of 4+ stars.', isEnforced: true },
];

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
        policyFlags: mockPolicyFlags,
        blogPosts: mockBlogPosts,
        pressReleases: mockPressReleases,
        mediaMentions: mockMediaMentions,
        brandAssets: mockBrandAssets,
        crew: mockCrew
    };
}
