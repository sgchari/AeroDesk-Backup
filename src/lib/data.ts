
import type { UserRole, User, CharterRFQ, EmptyLeg, Aircraft, Bid, AuditLog, AccommodationRequest } from './types';

// This data is now used for initial user profile creation in the demo, but not for dashboard data.
const mockUsers: User[] = [
    { id: 'admin-user-01', email: 'admin@aerodesk.com', firstName: 'Admin', lastName: 'User', role: 'Admin', status: 'Active', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    { id: 'customer-user-01', email: 'customer@example.com', firstName: 'Customer', lastName: 'User', role: 'Customer', status: 'Active', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    { id: 'operator-user-01', email: 'operator@flyco.com', firstName: 'Operator', lastName: 'User', role: 'Operator', company: 'FlyCo', status: 'Active', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    { id: 'ctd-admin-user-01', email: 'ctd.admin@corp.com', firstName: 'CTD', lastName: 'Admin', role: 'CTD Admin', company: 'Corporate Inc.', status: 'Active', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    { id: 'distributor-user-01', email: 'distributor@agency.com', firstName: 'Distributor', lastName: 'User', role: 'Authorized Distributor', status: 'Active', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    { id: 'hotel-user-01', email: 'contact@besthotel.com', firstName: 'Hotel', lastName: 'Partner', role: 'Hotel Partner', status: 'Active', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
];

// All other mock data arrays can be removed or kept for reference, but are no longer used by the live dashboards.

const mockRfqs: CharterRFQ[] = [];
const mockEmptyLegs: EmptyLeg[] = [];
const mockAircrafts: Aircraft[] = [];
const mockBids: Bid[] = [];
const mockAuditLogs: AuditLog[] = [];
const mockAccommodationRequests: AccommodationRequest[] = [];

// This function now mainly provides a template for a user based on role for the user context.
export function getMockDataForRole(role: UserRole) {
    return {
        users: mockUsers,
        // The following arrays are empty as data is now fetched from Firestore
        rfqs: [],
        emptyLegs: [],
        auditLogs: [],
        aircrafts: [],
        bids: [],
        accommodationRequests: [],
    };
}
