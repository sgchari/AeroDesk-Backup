
import type { UserRole, User, CharterRFQ, EmptyLeg, Aircraft, Quotation, AuditLog, AccommodationRequest, CorporateTravelDesk, Property, RoomCategory, EmptyLegSeatAllocationRequest, Operator } from './types';

// This data is now used for the demo mode.

export const mockUsers: User[] = [
    // Admins
    { id: 'admin-user-01', email: 'admin@aerodesk.com', firstName: 'Admin', lastName: 'User', role: 'Admin', status: 'Active', createdAt: "2024-07-28T10:00:00Z", updatedAt: "2024-07-28T10:00:00Z" },
    
    // Customers
    { id: 'customer-user-01', email: 'customer@example.com', firstName: 'Sanjana', lastName: 'Kumar', role: 'Customer', status: 'Active', createdAt: "2024-07-27T11:20:00Z", updatedAt: "2024-07-27T11:20:00Z" },
    { id: 'customer-user-02', email: 'arjun@example.com', firstName: 'Arjun', lastName: 'Mehta', role: 'Customer', status: 'Active', createdAt: "2024-07-26T18:30:00Z", updatedAt: "2024-07-26T18:30:00Z" },
    
    // Operators
    { id: 'operator-user-01', externalAuthId: 'operator-user-01', email: 'ops@flyco.com', companyName: 'FlyCo Charter', firstName: 'Rajesh', lastName: 'Verma', role: 'Operator', status: 'Approved', createdAt: "2024-07-26T09:00:00Z", updatedAt: "2024-07-26T09:00:00Z", nsopLicenseNumber: "NSOP/FLYCO/2021", mouAcceptedAt: "2024-07-26T09:00:00Z" },
    { id: 'operator-user-02', externalAuthId: 'operator-user-02', email: 'contact@jetset.aero', companyName: 'JetSetGo Aviation', firstName: 'Vikram', lastName: 'Singh', role: 'Operator', status: 'Pending Approval', createdAt: "2024-07-28T16:00:00Z", updatedAt: "2024-07-28T16:00:00Z", nsopLicenseNumber: "NSOP/JETSET/2023", mouAcceptedAt: "2024-07-28T16:00:00Z" },
    { id: 'operator-user-03', externalAuthId: 'operator-user-03', email: 'charters@airone.in', companyName: 'AirOne Charters', firstName: 'Anita', lastName: 'Desai', role: 'Operator', status: 'Approved', createdAt: "2024-07-25T10:00:00Z", updatedAt: "2024-07-25T10:00:00Z", nsopLicenseNumber: "NSOP/AIRONE/2020", mouAcceptedAt: "2024-07-25T10:00:00Z" },


    // Corporate Users (CTD)
    { id: 'ctd-admin-user-01', email: 'ctd.admin@corp.com', firstName: 'Priya', lastName: 'Sharma', role: 'CTD Admin', company: 'Stark Industries', status: 'Active', createdAt: "2024-07-25T14:00:00Z", updatedAt: "2024-07-25T14:00:00Z", ctdId: 'ctd-stark-01' },
    { id: 'corp-admin-user-01', email: 'corp.admin@corp.com', firstName: 'Rohan', lastName: 'Gupta', role: 'Corporate Admin', company: 'Stark Industries', status: 'Active', createdAt: "2024-07-25T14:05:00Z", updatedAt: "2024-07-25T14:05:00Z", ctdId: 'ctd-stark-01' },
    { id: 'requester-user-01', email: 'employee@corp.com', firstName: 'Aisha', lastName: 'Khan', role: 'Requester', company: 'Stark Industries', status: 'Active', createdAt: "2024-07-25T14:10:00Z", updatedAt: "2024-07-25T14:10:00Z", ctdId: 'ctd-stark-01' },
    
    // Partners
    { id: 'distributor-user-01', email: 'sales@sky-dist.com', firstName: 'Amit', lastName: 'Patel', role: 'Travel Agency', company: 'Sky Distributors', status: 'Active', createdAt: "2024-07-24T16:00:00Z", updatedAt: "2024-07-24T16:00:00Z", companyName: "Sky Distributors" },
    { id: 'distributor-user-02', email: 'ria@sky-dist.com', firstName: 'Ria', lastName: 'Singh', role: 'Travel Agency', company: 'Sky Distributors', status: 'Active', createdAt: "2024-07-28T10:00:00Z", updatedAt: "2024-07-28T10:00:00Z", companyName: "Sky Distributors" },
    { id: 'hotel-user-01', email: 'mgr@grandhotel.com', firstName: 'Meera', lastName: 'Chopra', role: 'Hotel Partner', company: 'The Grand Hotel Group', status: 'Active', createdAt: "2024-07-23T18:00:00Z", updatedAt: "2024-07-23T18:00:00Z" },
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
    updatedAt: u.updatedAt
  }));

export const mockRfqs: CharterRFQ[] = [
    { id: 'RFQ-789', customerId: 'customer-user-01', requesterExternalAuthId: 'customer-user-01', customerName: 'Sanjana Kumar', tripType: 'Onward', departure: 'Mumbai (BOM)', arrival: 'Delhi (DEL)', departureDate: '2024-08-10', pax: 4, aircraftType: 'Any Light Jet', status: 'Bidding Open', createdAt: '2024-07-28T12:00:00Z', bidsCount: 2, hotelRequired: true },
    { id: 'RFQ-790', customerId: 'customer-user-01', requesterExternalAuthId: 'customer-user-01', customerName: 'Sanjana Kumar', tripType: 'Return', departure: 'Bengaluru (BLR)', arrival: 'Goa (GOI)', departureDate: '2024-08-15', returnDate: '2024-08-18', pax: 2, aircraftType: 'Any Turboprop', status: 'Confirmed', createdAt: '2024-07-27T15:00:00Z', bidsCount: 1, hotelRequired: true },
    { id: 'RFQ-791', customerId: 'requester-user-01', requesterExternalAuthId: 'requester-user-01', company: 'Stark Industries', customerName: 'Aisha Khan', tripType: 'Onward', departure: 'Chennai (MAA)', arrival: 'Hyderabad (HYD)', departureDate: '2024-08-12', pax: 6, aircraftType: 'Any Mid-size Jet', status: 'Pending Approval', createdAt: '2024-07-28T14:00:00Z', bidsCount: 0, businessPurpose: 'Quarterly Review', costCenter: 'EXEC-Q3-24' },
    { id: 'RFQ-792', customerId: 'customer-user-02', requesterExternalAuthId: 'customer-user-02', customerName: 'Arjun Mehta', tripType: 'Onward', departure: 'Kolkata (CCU)', arrival: 'Bagdogra (IXB)', departureDate: '2024-08-20', pax: 8, aircraftType: 'Any', status: 'New', createdAt: '2024-07-29T11:00:00Z', bidsCount: 0 },
    { id: 'RFQ-793', customerId: 'customer-user-01', requesterExternalAuthId: 'customer-user-01', customerName: 'Sanjana Kumar', tripType: 'Onward', departure: 'Pune (PNQ)', arrival: 'Ahmedabad (AMD)', departureDate: '2024-09-01', pax: 3, aircraftType: 'Any Light Jet', status: 'Operator Selected', createdAt: '2024-07-29T09:00:00Z', bidsCount: 1 },
    { id: 'RFQ-794', customerId: 'requester-user-01', requesterExternalAuthId: 'requester-user-01', company: 'Stark Industries', customerName: 'Rohan Gupta', tripType: 'Onward', departure: 'Delhi (DEL)', arrival: 'Dubai (DXB)', departureDate: '2024-08-25', pax: 2, aircraftType: 'Any Heavy Jet', status: 'Reviewing', createdAt: '2024-07-30T10:00:00Z', bidsCount: 0, businessPurpose: 'Investor Meeting', costCenter: 'INTL-FIN-Q3' },
    { id: 'RFQ-795', customerId: 'customer-user-02', requesterExternalAuthId: 'customer-user-02', customerName: 'Arjun Mehta', tripType: 'Onward', departure: 'Leh (IXL)', arrival: 'Srinagar (SXR)', departureDate: '2024-09-05', pax: 5, aircraftType: 'Any Turboprop', status: 'Closed', createdAt: '2024-07-20T10:00:00Z', bidsCount: 3 },
    { id: 'RFQ-796', customerId: 'distributor-user-01', requesterExternalAuthId: 'distributor-user-01', customerName: 'Amit Patel (Client)', tripType: 'Onward', departure: 'Jaipur (JAI)', arrival: 'Udaipur (UDR)', departureDate: '2024-08-22', pax: 4, aircraftType: 'Any Light Jet', status: 'Bidding Open', createdAt: '2024-07-30T15:00:00Z', bidsCount: 0 },
];

export const mockAircrafts: Aircraft[] = [
    { id: 'AC-VTFLY', operatorId: 'operator-user-01', name: 'Phenom 300E', type: 'Light Jet', registration: 'VT-FLY', paxCapacity: 8, homeBase: 'Mumbai (BOM)', status: 'Available' },
    { id: 'AC-VTSKY', operatorId: 'operator-user-01', name: 'King Air 350', type: 'Turboprop', registration: 'VT-SKY', paxCapacity: 9, homeBase: 'Delhi (DEL)', status: 'Under Maintenance' },
    { id: 'AC-VTJET', operatorId: 'operator-user-02', name: 'Cessna Citation XLS', type: 'Mid-size Jet', registration: 'VT-JET', paxCapacity: 9, homeBase: 'Bengaluru (BLR)', status: 'Available' },
    { id: 'AC-VTGLO', operatorId: 'operator-user-03', name: 'Global 6000', type: 'Heavy Jet', registration: 'VT-GLO', paxCapacity: 14, homeBase: 'Delhi (DEL)', status: 'AOG' },
    { id: 'AC-VTPC', operatorId: 'operator-user-03', name: 'Pilatus PC-12', type: 'Turboprop', registration: 'VT-PC', paxCapacity: 8, homeBase: 'Mumbai (BOM)', status: 'Available' },
];

export const mockQuotations: Quotation[] = [
    { id: 'QTE-112', rfqId: 'RFQ-789', operatorId: 'operator-user-01', operatorName: 'FlyCo Charter', aircraftId: 'AC-VTFLY', aircraftName: 'Phenom 300E', price: 850000, status: 'Submitted', submittedAt: '2024-07-28T12:05:00Z', validUntil: '2024-07-29T12:00:00Z' },
    { id: 'QTE-113', rfqId: 'RFQ-789', operatorId: 'operator-user-03', operatorName: 'AirOne Charters', aircraftId: 'AC-VTPC', aircraftName: 'Pilatus PC-12', price: 790000, status: 'Submitted', submittedAt: '2024-07-28T13:00:00Z', validUntil: '2024-07-29T13:00:00Z' },
    { id: 'QTE-114', rfqId: 'RFQ-790', operatorId: 'operator-user-01', operatorName: 'FlyCo Charter', aircraftId: 'AC-VTSKY', aircraftName: 'King Air 350', price: 400000, status: 'Selected', submittedAt: '2024-07-27T16:00:00Z', validUntil: '2024-07-28T16:00:00Z' },
    { id: 'QTE-115', rfqId: 'RFQ-793', operatorId: 'operator-user-03', operatorName: 'AirOne Charters', aircraftId: 'AC-VTPC', aircraftName: 'Pilatus PC-12', price: 700000, status: 'Selected', submittedAt: '2024-07-29T10:00:00Z', validUntil: '2024-07-30T10:00:00Z' },
];

export const mockEmptyLegs: EmptyLeg[] = [
    { id: 'EL-901', operatorId: 'operator-user-01', aircraftId: 'AC-VTFLY', aircraftName: 'Phenom 300E', departure: 'Delhi (DEL)', arrival: 'Mumbai (BOM)', departureTime: '2024-08-05T14:00:00Z', availableSeats: 4, seatsAllocated: 2, status: 'Published' },
    { id: 'EL-902', operatorId: 'operator-user-01', aircraftId: 'AC-VTSKY', aircraftName: 'King Air 350', departure: 'Goa (GOI)', arrival: 'Bengaluru (BLR)', departureTime: '2024-08-07T10:00:00Z', availableSeats: 6, seatsAllocated: 0, status: 'Draft' },
    { id: 'EL-903', operatorId: 'operator-user-03', aircraftId: 'AC-VTGLO', aircraftName: 'Global 6000', departure: 'Hyderabad (HYD)', arrival: 'Chennai (MAA)', departureTime: '2024-08-09T18:00:00Z', availableSeats: 5, seatsAllocated: 5, status: 'Closed' },
    { id: 'EL-904', operatorId: 'operator-user-03', aircraftId: 'AC-VTPC', aircraftName: 'Pilatus PC-12', departure: 'Udaipur (UDR)', arrival: 'Jaipur (JAI)', departureTime: '2024-08-11T12:00:00Z', availableSeats: 7, seatsAllocated: 0, status: 'Published' },
    { id: 'EL-905', operatorId: 'operator-user-01', aircraftId: 'AC-VTFLY', aircraftName: 'Phenom 300E', departure: 'Ahmedabad (AMD)', arrival: 'Pune (PNQ)', departureTime: '2024-08-13T09:00:00Z', availableSeats: 8, seatsAllocated: 0, status: 'Pending Approval' },
];

export const mockEmptyLegSeatAllocationRequests: EmptyLegSeatAllocationRequest[] = [
    { id: 'SAR-501', emptyLegId: 'EL-901', distributorId: 'distributor-user-01', requesterExternalAuthId: 'distributor-user-01', numberOfSeats: 2, status: 'Requested', requestDateTime: '2024-07-30T10:00:00Z', clientReference: 'ACME Corp' },
    { id: 'SAR-502', emptyLegId: 'EL-904', distributorId: 'distributor-user-01', requesterExternalAuthId: 'distributor-user-01', numberOfSeats: 4, status: 'Approved', requestDateTime: '2024-07-31T11:00:00Z', clientReference: 'Smith Family' }
];

export const mockProperties: Property[] = [
    { id: 'PROP-01', hotelPartnerId: 'hotel-user-01', name: 'The Grand Mumbai', address: '123 Marine Drive, Mumbai', city: 'Mumbai', status: 'Active', propertyType: 'Luxury Hotel', imageUrl: 'https://picsum.photos/seed/hotel1/600/400' },
    { id: 'PROP-02', hotelPartnerId: 'hotel-user-01', name: 'The Palace Delhi', address: '456 Connaught Place, Delhi', city: 'Delhi', status: 'Active', propertyType: 'Heritage Hotel', imageUrl: 'https://picsum.photos/seed/hotel2/600/400' },
    { id: 'PROP-03', hotelPartnerId: 'hotel-user-01', name: 'Goa Beach Resort', address: '789 Baga Beach, Goa', city: 'Goa', status: 'Inactive', propertyType: 'Resort', imageUrl: 'https://picsum.photos/seed/hotel3/600/400' },
];

export const mockRoomCategories: RoomCategory[] = [
    { id: 'RC-DLX-MUM', propertyId: 'PROP-01', name: 'Deluxe King Room', maxOccupancy: 2, beddingType: 'King', baseCapacity: 2, description: 'A spacious room with a king-sized bed and stunning city views. Includes a work desk and a modern bathroom.', imageUrl: 'https://picsum.photos/seed/room1/600/400' },
    { id: 'RC-SUI-MUM', propertyId: 'PROP-01', name: 'Executive Suite', maxOccupancy: 3, beddingType: 'King + Sofa', baseCapacity: 2, description: 'A luxurious suite featuring a separate living area, perfect for business travelers needing extra space.', imageUrl: 'https://picsum.photos/seed/room2/600/400' },
    { id: 'RC-PRES-DEL', propertyId: 'PROP-02', name: 'Maharaja Suite', maxOccupancy: 4, beddingType: 'Two Queens', baseCapacity: 4, description: 'An opulent suite with traditional heritage decor, premium amenities, and a view of the city palace.', imageUrl: 'https://picsum.photos/seed/room3/600/400' },
    { id: 'RC-VIL-GOA', propertyId: 'PROP-03', name: 'Beach Villa', maxOccupancy: 4, beddingType: 'King + Twin', baseCapacity: 2, description: 'A private villa offering direct access to the beach, a private plunge pool, and lush garden surroundings.', imageUrl: 'https://picsum.photos/seed/room4/600/400' },
];

export const mockAccommodationRequests: AccommodationRequest[] = [
    { id: 'ACC-301', tripReferenceId: 'RFQ-790', tripType: 'Charter', hotelPartnerId: 'hotel-user-01', propertyId: 'PROP-03', propertyName: 'Goa Beach Resort', guestType: 'Passenger', guestName: 'Sanjana Kumar', checkIn: '2024-08-15', checkOut: '2024-08-18', rooms: 1, status: 'Pending', specialRequests: 'Ocean view room preferred.' },
    { id: 'ACC-302', tripReferenceId: 'RFQ-789', tripType: 'Charter', hotelPartnerId: 'hotel-user-01', propertyId: 'PROP-02', propertyName: 'The Palace Delhi', guestType: 'Crew', guestName: 'Capt. R. Verma +1', checkIn: '2024-08-10', checkOut: '2024-08-11', rooms: 2, status: 'Confirmed', specialRequests: 'Quiet rooms on a high floor.' },
    { id: 'ACC-303', tripReferenceId: 'RFQ-793', tripType: 'Charter', hotelPartnerId: 'hotel-user-01', propertyId: 'PROP-01', propertyName: 'The Grand Mumbai', guestType: 'Passenger', guestName: 'Arjun Mehta', checkIn: '2024-09-01', checkOut: '2024-09-03', rooms: 1, status: 'Declined' },
    { id: 'ACC-304', tripReferenceId: 'EL-901', tripType: 'EmptyLeg', hotelPartnerId: 'hotel-user-01', propertyId: 'PROP-01', propertyName: 'The Grand Mumbai', guestType: 'Passenger', guestName: 'ACME Corp Guest', checkIn: '2024-08-05', checkOut: '2024-08-06', rooms: 2, status: 'Awaiting Clarification', specialRequests: 'Need two separate non-smoking rooms.' },
];

export const mockAuditLogs: AuditLog[] = [
    { id: 'LOG-001', timestamp: '2024-07-28T14:00:00Z', user: 'Aisha Khan', role: 'Requester', action: 'CREATE RFQ', details: 'Created new corporate RFQ', targetId: 'RFQ-791' },
    { id: 'LOG-002', timestamp: '2024-07-28T12:05:00Z', user: 'Rajesh Verma', role: 'Operator', action: 'SUBMIT QUOTE', details: 'Submitted quote for RFQ-789', targetId: 'QTE-112' },
    { id: 'LOG-003', timestamp: '2024-07-28T12:00:00Z', user: 'Sanjana Kumar', role: 'Customer', action: 'CREATE RFQ', details: 'Created new personal RFQ', targetId: 'RFQ-789' },
    { id: 'LOG-004', timestamp: '2024-07-27T18:00:00Z', user: 'Admin User', role: 'Admin', action: 'APPROVE OPERATOR', details: 'Approved FlyCo as operator', targetId: 'operator-user-01' },
    { id: 'LOG-005', timestamp: '2024-07-27T15:30:00Z', user: 'Sanjana Kumar', role: 'Customer', action: 'SELECT QUOTE', details: 'Selected quote for RFQ-790', targetId: 'QTE-114' },
    { id: 'LOG-006', timestamp: '2024-07-30T11:00:00Z', user: 'Admin User', role: 'Admin', action: 'UPDATE EMPTY LEG', details: 'Approved empty leg EL-901', targetId: 'EL-901' },

];

export function getMockDataForRole(role: UserRole) {
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
        seatAllocationRequests: mockEmptyLegSeatAllocationRequests
    };
}
