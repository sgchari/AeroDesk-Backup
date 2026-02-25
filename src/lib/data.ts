
import type { UserRole, User, CharterRFQ, EmptyLeg, Aircraft, Bid, AuditLog, AccommodationRequest } from './types';

// This data is now used for the demo mode.

export const mockUsers: User[] = [
    { id: 'admin-user-01', email: 'admin@aerodesk.com', firstName: 'Admin', lastName: 'User', role: 'Admin', status: 'Active', createdAt: "2024-07-28T10:00:00Z", updatedAt: "2024-07-28T10:00:00Z" },
    { id: 'customer-user-01', email: 'customer@example.com', firstName: 'Sanjana', lastName: 'Kumar', role: 'Customer', status: 'Active', createdAt: "2024-07-27T11:20:00Z", updatedAt: "2024-07-27T11:20:00Z" },
    { id: 'operator-user-01', email: 'ops@flyco.com', firstName: 'Rajesh', lastName: 'Verma', role: 'Operator', company: 'FlyCo', status: 'Active', createdAt: "2024-07-26T09:00:00Z", updatedAt: "2024-07-26T09:00:00Z" },
    { id: 'ctd-admin-user-01', email: 'ctd.admin@corp.com', firstName: 'Priya', lastName: 'Sharma', role: 'CTD Admin', company: 'Corporate Inc.', status: 'Active', createdAt: "2024-07-25T14:00:00Z", updatedAt: "2024-07-25T14:00:00Z", ctdId: 'corp-inc-01' },
    { id: 'distributor-user-01', email: 'sales@sky-dist.com', firstName: 'Amit', lastName: 'Patel', role: 'Authorized Distributor', company: 'Sky Distributors', status: 'Active', createdAt: "2024-07-24T16:00:00Z", updatedAt: "2024-07-24T16:00:00Z" },
    { id: 'hotel-user-01', email: 'mgr@grandhotel.com', firstName: 'Meera', lastName: 'Chopra', role: 'Hotel Partner', company: 'The Grand Hotel', status: 'Active', createdAt: "2024-07-23T18:00:00Z", updatedAt: "2024-07-23T18:00:00Z" },
];

export const mockRfqs: CharterRFQ[] = [
    { id: 'RFQ-789', customerId: 'customer-user-01', requesterExternalAuthId: 'customer-user-01', customerName: 'Sanjana Kumar', tripType: 'Onward', departure: 'Mumbai (BOM)', arrival: 'Delhi (DEL)', departureDate: '2024-08-10', pax: 4, aircraftType: 'Any Light Jet', status: 'Bidding Open', createdAt: '2024-07-28T12:00:00Z', bidsCount: 3 },
    { id: 'RFQ-790', customerId: 'customer-user-01', requesterExternalAuthId: 'customer-user-01', customerName: 'Sanjana Kumar', tripType: 'Return', departure: 'Bengaluru (BLR)', arrival: 'Goa (GOI)', departureDate: '2024-08-15', returnDate: '2024-08-18', pax: 2, aircraftType: 'Any Turboprop', status: 'Confirmed', createdAt: '2024-07-27T15:00:00Z', bidsCount: 5 },
    { id: 'RFQ-791', customerId: 'ctd-admin-user-01', requesterExternalAuthId: 'ctd-admin-user-01', company: 'Corporate Inc.', customerName: 'Priya Sharma', tripType: 'Onward', departure: 'Chennai (MAA)', arrival: 'Hyderabad (HYD)', departureDate: '2024-08-12', pax: 6, aircraftType: 'Any Mid-size Jet', status: 'Pending Approval', createdAt: '2024-07-28T14:00:00Z', bidsCount: 0, businessPurpose: 'Quarterly Review', costCenter: 'EXEC-Q3-24' },
];

export const mockAircrafts: Aircraft[] = [
    { id: 'AC-VTFLY', operatorId: 'operator-user-01', name: 'Phenom 300E', type: 'Light Jet', registration: 'VT-FLY', paxCapacity: 8, homeBase: 'Mumbai (BOM)' },
    { id: 'AC-VTSKY', operatorId: 'operator-user-01', name: 'King Air 350', type: 'Turboprop', registration: 'VT-SKY', paxCapacity: 9, homeBase: 'Delhi (DEL)' },
];

export const mockEmptyLegs: EmptyLeg[] = [
    { id: 'EL-901', operatorId: 'operator-user-01', aircraftId: 'AC-VTFLY', departure: 'Delhi (DEL)', arrival: 'Mumbai (BOM)', departureTime: '2024-08-05T14:00:00Z', availableSeats: 4, status: 'Approved' },
    { id: 'EL-902', operatorId: 'operator-user-01', aircraftId: 'AC-VTSKY', departure: 'Goa (GOI)', arrival: 'Bengaluru (BLR)', departureTime: '2024-08-07T10:00:00Z', availableSeats: 6, status: 'Pending Approval' },
];

export const mockAccommodationRequests: AccommodationRequest[] = [
    { id: 'ACC-301', tripReferenceId: 'RFQ-790', tripType: 'Charter', hotelPartnerId: 'hotel-user-01', guestType: 'Passenger', checkIn: '2024-08-15', checkOut: '2024-08-18', rooms: 1, status: 'Pending' },
    { id: 'ACC-302', tripReferenceId: 'RFQ-789', tripType: 'Charter', hotelPartnerId: 'hotel-user-01', guestType: 'Crew', checkIn: '2024-08-10', checkOut: '2024-08-11', rooms: 2, status: 'Confirmed' },
];

export const mockBids: Bid[] = [];

export const mockAuditLogs: AuditLog[] = [
    { id: 'LOG-001', timestamp: '2024-07-28T14:00:00Z', user: 'Priya Sharma', role: 'CTD Admin', action: 'CREATE RFQ', details: 'Created new corporate RFQ', targetId: 'RFQ-791' },
    { id: 'LOG-002', timestamp: '2024-07-28T12:05:00Z', user: 'Rajesh Verma', role: 'Operator', action: 'SUBMIT QUOTE', details: 'Submitted quote for RFQ-789', targetId: 'QTE-112' },
    { id: 'LOG-003', timestamp: '2024-07-28T12:00:00Z', user: 'Sanjana Kumar', role: 'Customer', action: 'CREATE RFQ', details: 'Created new personal RFQ', targetId: 'RFQ-789' },
    { id: 'LOG-004', timestamp: '2024-07-27T18:00:00Z', user: 'Admin User', role: 'Admin', action: 'APPROVE OPERATOR', details: 'Approved FlyCo as operator', targetId: 'operator-user-01' },
    { id: 'LOG-005', timestamp: '2024-07-27T15:30:00Z', user: 'Sanjana Kumar', role: 'Customer', action: 'CONFIRM TRIP', details: 'Confirmed trip for RFQ-790', targetId: 'RFQ-790' },
];

export function getMockDataForRole(role: UserRole) {
    return {
        users: mockUsers,
        rfqs: mockRfqs,
        emptyLegs: mockEmptyLegs,
        auditLogs: mockAuditLogs,
        aircrafts: mockAircrafts,
        bids: mockBids,
        accommodationRequests: mockAccommodationRequests,
    };
}
