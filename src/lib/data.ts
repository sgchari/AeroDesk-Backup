import type { UserRole, User, CharterRFQ, EmptyLeg, Aircraft, Bid, AuditLog, AccommodationRequest } from './types';

const mockUsers: User[] = [
    { id: 'admin-user-01', email: 'admin@aerodesk.com', firstName: 'Admin', lastName: 'User', role: 'Admin', status: 'Active', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    { id: 'customer-user-01', email: 'customer@example.com', firstName: 'Customer', lastName: 'User', role: 'Customer', status: 'Active', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    { id: 'operator-user-01', email: 'operator@flyco.com', firstName: 'Operator', lastName: 'User', role: 'Operator', company: 'FlyCo', status: 'Active', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    { id: 'ctd-admin-user-01', email: 'ctd.admin@corp.com', firstName: 'CTD', lastName: 'Admin', role: 'CTD Admin', company: 'Corporate Inc.', status: 'Active', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    { id: 'distributor-user-01', email: 'distributor@agency.com', firstName: 'Distributor', lastName: 'User', role: 'Authorized Distributor', status: 'Active', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    { id: 'hotel-user-01', email: 'contact@besthotel.com', firstName: 'Hotel', lastName: 'Partner', role: 'Hotel Partner', status: 'Active', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
];

const mockRfqs: CharterRFQ[] = [
    { id: 'rfq-001', customerId: 'customer-user-01', customerName: 'Customer User', tripType: 'Onward', departure: 'Mumbai', arrival: 'Delhi', departureDate: '2024-08-15', pax: 4, aircraftType: 'Any Light Jet', status: 'Bidding Open', createdAt: '2024-07-28T10:00:00Z', bidsCount: 2 },
    { id: 'rfq-002', customerId: 'customer-user-01', customerName: 'Customer User', tripType: 'Return', departure: 'Delhi', arrival: 'Goa', departureDate: '2024-08-20', returnDate: '2024-08-25', pax: 8, aircraftType: 'Any Mid-size Jet', status: 'Confirmed', createdAt: '2024-07-25T12:00:00Z', bidsCount: 5 },
    { id: 'rfq-003', customerId: 'ctd-admin-user-01', customerName: 'CTD Admin (Corporate Inc.)', tripType: 'Onward', departure: 'Bangalore', arrival: 'Chennai', departureDate: '2024-09-01', pax: 2, aircraftType: 'Any Turboprop', status: 'Pending Approval', createdAt: '2024-07-29T09:00:00Z', bidsCount: 0, company: 'Corporate Inc.' },
];

const mockEmptyLegs: EmptyLeg[] = [
    { id: 'el-001', operatorId: 'operator-user-01', aircraftId: 'ac-01', departure: 'Delhi', arrival: 'Mumbai', departureTime: '2024-08-16 18:00', availableSeats: 6, status: 'Approved' },
    { id: 'el-002', operatorId: 'operator-user-01', aircraftId: 'ac-02', departure: 'Goa', arrival: 'Bangalore', departureTime: '2024-08-22 12:00', availableSeats: 4, status: 'Approved' },
    { id: 'el-003', operatorId: 'operator-user-01', aircraftId: 'ac-01', departure: 'Chennai', arrival: 'Hyderabad', departureTime: '2024-08-19 09:00', availableSeats: 8, status: 'Pending Approval' },
];

const mockAircrafts: Aircraft[] = [
    { id: 'ac-01', operatorId: 'operator-user-01', name: 'Phenom 300', type: 'Light Jet', registration: 'VT-ABC', paxCapacity: 8, homeBase: 'VABB' },
    { id: 'ac-02', operatorId: 'operator-user-01', name: 'King Air 250', type: 'Turboprop', registration: 'VT-DEF', paxCapacity: 6, homeBase: 'VIDP' },
];

const mockBids: Bid[] = [
    { id: 'bid-01', rfqId: 'rfq-001', operatorId: 'operator-user-01', operatorName: 'FlyCo', aircraftId: 'ac-01', aircraftName: 'Phenom 300', price: 500000, status: 'Submitted', submittedAt: '2024-07-28T11:00:00Z' },
];

const mockAuditLogs: AuditLog[] = [
    { id: 'log-1', timestamp: '2024-07-29T10:00:00Z', user: 'Admin User', role: 'Admin', action: 'Approved Operator', details: 'Approved FlyCo as a new operator.', targetId: 'op-01' },
    { id: 'log-2', timestamp: '2024-07-29T10:05:00Z', user: 'Operator User', role: 'Operator', action: 'Created Empty Leg', details: 'Created empty leg from Mumbai to Delhi.', targetId: 'el-01' },
    { id: 'log-3', timestamp: '2024-07-29T10:10:00Z', user: 'Customer User', role: 'Customer', action: 'Submitted RFQ', details: 'Submitted RFQ for a flight to Goa.', targetId: 'rfq-01' },
];

const mockAccommodationRequests: AccommodationRequest[] = [
    { id: 'req_1', tripId: 'rfq_4', guestType: 'Passenger', checkIn: '2024-08-20', checkOut: '2024-08-22', rooms: 5, status: 'Pending'},
    { id: 'req_2', tripId: 'trip_7', guestType: 'Crew', checkIn: '2024-08-21', checkOut: '2024-08-22', rooms: 2, status: 'Confirmed'},
]

export function getMockDataForRole(role: UserRole) {
    switch (role) {
        case 'Admin':
            return {
                users: mockUsers,
                rfqs: mockRfqs,
                emptyLegs: mockEmptyLegs,
                auditLogs: mockAuditLogs,
                aircrafts: mockAircrafts,
                bids: mockBids,
                accommodationRequests: mockAccommodationRequests,
            };
        case 'Customer':
            return {
                rfqs: mockRfqs.filter(r => r.customerId === 'customer-user-01'),
                emptyLegs: mockEmptyLegs.filter(e => e.status === 'Approved'),
                users: [],
                auditLogs: [],
                aircrafts: [],
                bids: [],
                accommodationRequests: [],
            };
        case 'Operator':
            return {
                rfqs: mockRfqs.filter(r => r.status === 'Bidding Open'),
                emptyLegs: mockEmptyLegs.filter(e => e.operatorId === 'operator-user-01'),
                aircrafts: mockAircrafts.filter(a => a.operatorId === 'operator-user-01'),
                bids: mockBids.filter(b => b.operatorId === 'operator-user-01'),
                users: [],
                auditLogs: [],
                accommodationRequests: [],
            };
        case 'CTD Admin':
            return {
                rfqs: mockRfqs.filter(r => r.company === 'Corporate Inc.'),
                emptyLegs: [],
                users: [],
                auditLogs: [],
                aircrafts: [],
                bids: [],
                accommodationRequests: [],
            };
        case 'Authorized Distributor':
            return {
                emptyLegs: mockEmptyLegs.filter(e => e.status === 'Approved'),
                rfqs: [],
                users: [],
                auditLogs: [],
                aircrafts: [],
                bids: [],
                accommodationRequests: [],
            };
        case 'Hotel Partner':
            return {
                accommodationRequests: mockAccommodationRequests,
                rfqs: [],
                emptyLegs: [],
                users: [],
                auditLogs: [],
                aircrafts: [],
                bids: [],
            };
        default:
            return {
                rfqs: [],
                emptyLegs: [],
                users: [],
                auditLogs: [],
                aircrafts: [],
                bids: [],
                accommodationRequests: [],
            };
    }
}
