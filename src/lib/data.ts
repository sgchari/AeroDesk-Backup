
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
  SubscriptionPlan
} from './types';

/**
 * @fileOverview Institutional Data Registry
 * Provides a comprehensive mock dataset for platform simulation.
 */

// --- VERIFIED REGISTRY ---
export const VERIFIED_NSOP_REGISTRY = [
    { companyName: 'FlyCo Charter', nsopLicenseNumber: 'NSOP/FLYCO/2021', city: 'Mumbai' },
    { companyName: 'Taj Air', nsopLicenseNumber: 'NSOP/TAJ/02', city: 'Mumbai' },
    { companyName: 'Club One Air', nsopLicenseNumber: 'NSOP/COA/05', city: 'Delhi' },
    { companyName: 'Titan Aviation', nsopLicenseNumber: 'NSOP/TITAN/11', city: 'Bangalore' },
];

// --- USERS ---
export const mockUsers: User[] = [
    { id: 'admin-user-01', email: 'admin@aerodesk.com', firstName: 'AeroDesk', lastName: 'Admin', role: 'Admin', status: 'Active', createdAt: "2024-01-01T10:00:00Z", updatedAt: "2024-01-01T10:00:00Z" },
    { id: 'customer-user-01', email: 'sanjana@hitech.in', firstName: 'Sanjana', lastName: 'Kumar', role: 'Customer', status: 'Active', createdAt: "2024-05-15T11:20:00Z", updatedAt: "2024-05-15T11:20:00Z" },
    { id: 'operator-user-01', externalAuthId: 'operator-user-01', email: 'ops@flyco.aero', companyName: 'FlyCo Charter', firstName: 'Rajesh', lastName: 'Verma', role: 'Operator', status: 'Approved', createdAt: "2024-02-10T09:00:00Z", updatedAt: "2024-02-10T09:00:00Z", nsopLicenseNumber: "NSOP/FLYCO/2021", mouAcceptedAt: "2024-02-10T09:00:00Z", city: 'Mumbai', zone: 'West' },
    { id: 'ctd-admin-user-01', email: 'priya@stark.com', firstName: 'Priya', lastName: 'Sharma', role: 'CTD Admin', company: 'Stark Industries', status: 'Active', createdAt: "2024-03-01T14:00:00Z", updatedAt: "2024-03-01T14:00:00Z", ctdId: 'ctd-stark-01' },
    { id: 'distributor-user-01', email: 'amit@sky-dist.com', firstName: 'Amit', lastName: 'Patel', role: 'Travel Agency', company: 'Sky Distributors', status: 'Active', createdAt: "2024-04-12T16:00:00Z", updatedAt: "2024-04-12T16:00:00Z", companyName: "Sky Distributors" },
    { id: 'hotel-user-01', email: 'meera@grandhotel.com', firstName: 'Meera', lastName: 'Chopra', role: 'Hotel Partner', company: 'The Grand Hotel Group', status: 'Active', createdAt: "2024-05-20T18:00:00Z", updatedAt: "2024-05-20T18:00:00Z", companyName: "The Grand Hotel Group" },
];

// --- ORGANIZATIONS ---
export const mockCorporateTravelDesks: CorporateTravelDesk[] = [
    { id: 'ctd-stark-01', companyName: 'Stark Industries', adminExternalAuthId: 'ctd-admin-user-01', status: 'Active', createdAt: "2024-03-01T13:59:00Z", updatedAt: "2024-03-01T13:59:00Z" }
];

export const mockOperators: Operator[] = [
    { id: 'operator-user-01', externalAuthId: 'operator-user-01', companyName: 'FlyCo Charter', nsopLicenseNumber: 'NSOP/FLYCO/2021', contactPersonName: 'Rajesh Verma', contactEmail: 'ops@flyco.aero', status: 'Approved', mouAcceptedAt: '2024-02-10T09:00:00Z', createdAt: '2024-02-10T09:00:00Z', updatedAt: '2024-02-10T09:00:00Z', city: 'Mumbai', zone: 'West' }
];

// --- CHARTER REQUESTS (LIFECYCLE) ---
export const mockRfqs: CharterRFQ[] = [
    { id: 'RFQ-EXEC-001', customerId: 'customer-user-01', requesterExternalAuthId: 'customer-user-01', customerName: 'Sanjana Kumar', tripType: 'Onward', departure: 'Mumbai (BOM)', arrival: 'Delhi (DEL)', departureDate: '2024-09-10', pax: 4, aircraftType: 'Any Light Jet', status: 'Bidding Open', createdAt: '2024-08-28T12:00:00Z', bidsCount: 2 },
    { id: 'RFQ-EXEC-002', customerId: 'customer-user-01', requesterExternalAuthId: 'customer-user-01', customerName: 'Sanjana Kumar', tripType: 'Return', departure: 'Bangalore (BLR)', arrival: 'Goa (GOI)', departureDate: '2024-09-15', pax: 2, aircraftType: 'Turboprop', status: 'quoteAccepted', createdAt: '2024-08-29T10:00:00Z', bidsCount: 1 },
    { id: 'RFQ-EXEC-003', customerId: 'customer-user-01', requesterExternalAuthId: 'customer-user-01', operatorId: 'operator-user-01', customerName: 'Sanjana Kumar', tripType: 'Onward', departure: 'Mumbai (BOM)', arrival: 'Dubai (DXB)', departureDate: '2024-09-01', pax: 2, aircraftType: 'Heavy Jet', status: 'boarding', createdAt: '2024-08-01T10:00:00Z', bidsCount: 3, totalAmount: 4200000 },
    { id: 'RFQ-EXEC-004', customerId: 'customer-user-01', requesterExternalAuthId: 'customer-user-01', operatorId: 'operator-user-01', customerName: 'Sanjana Kumar', tripType: 'Onward', departure: 'Delhi (DEL)', arrival: 'Mumbai (BOM)', departureDate: '2024-08-15', pax: 6, aircraftType: 'Mid-size Jet', status: 'tripClosed', createdAt: '2024-07-15T09:00:00Z', bidsCount: 4, totalAmount: 1850000 },
    { id: 'RFQ-EXEC-005', customerId: 'customer-user-01', requesterExternalAuthId: 'customer-user-01', operatorId: 'operator-user-01', customerName: 'Sanjana Kumar', tripType: 'Onward', departure: 'Delhi (DEL)', arrival: 'London (LHR)', departureDate: '2024-09-20', pax: 8, aircraftType: 'Heavy Jet', status: 'invoiceIssued', createdAt: '2024-08-25T09:00:00Z', bidsCount: 1, totalAmount: 12500000 },
    { id: 'RFQ-CONF-002', customerId: 'customer-user-01', requesterExternalAuthId: 'customer-user-01', operatorId: 'operator-user-01', customerName: 'Sanjana Kumar', tripType: 'Onward', departure: 'Bangalore (BLR)', arrival: 'Mumbai (BOM)', departureDate: '2024-09-05', pax: 4, aircraftType: 'Light Jet', status: 'charterConfirmed', createdAt: '2024-08-20T11:00:00Z', bidsCount: 2, totalAmount: 1200000 },
];

// --- QUOTATIONS ---
export const mockQuotations: Quotation[] = [
    { id: 'QT-001', rfqId: 'RFQ-EXEC-001', operatorId: 'operator-user-01', operatorName: 'FlyCo Charter', aircraftId: 'AC-001', aircraftName: 'Cessna Citation XLS+', price: 850000, status: 'Submitted', submittedAt: '2024-08-29T10:00:00Z', validUntil: '2024-09-05', operatorRemarks: 'Premium catering included.' },
    { id: 'QT-002', rfqId: 'RFQ-EXEC-002', operatorId: 'operator-user-01', operatorName: 'FlyCo Charter', aircraftId: 'AC-003', aircraftName: 'King Air B200', price: 420000, status: 'Selected', submittedAt: '2024-08-30T14:00:00Z', validUntil: '2024-09-05' }
];

// --- ASSETS & LOGISTICS ---
export const mockAircrafts: Aircraft[] = [
    { id: 'AC-001', operatorId: 'operator-user-01', name: 'Cessna Citation XLS+', type: 'Light Jet', registration: 'VT-FLY', paxCapacity: 7, homeBase: 'Mumbai', status: 'Available', exteriorImageUrl: 'https://images.unsplash.com/photo-1540962351504-03099e0a754b?q=80&w=800' },
    { id: 'AC-002', operatorId: 'operator-user-01', name: 'Bombardier Global 6000', type: 'Heavy Jet', registration: 'VT-STK', paxCapacity: 14, homeBase: 'Delhi', status: 'Available', exteriorImageUrl: 'https://images.unsplash.com/photo-1616193572425-fd11332ec645?q=80&w=800' },
    { id: 'AC-003', operatorId: 'operator-user-01', name: 'King Air B200', type: 'Turboprop', registration: 'VT-PC', paxCapacity: 6, homeBase: 'Bangalore', status: 'Under Maintenance', exteriorImageUrl: 'https://images.unsplash.com/photo-1569154941061-e231b4725ef1?q=80&w=800' },
];

export const mockCrew: CrewMember[] = [
    { id: 'CW-01', operatorId: 'operator-user-01', firstName: 'Rahul', lastName: 'Kapoor', email: 'rahul.k@flyco.aero', role: 'Captain', status: 'Available', licenseNumber: 'ATPL-992', assignedAircraftRegistration: 'VT-FLY', createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z' },
    { id: 'CW-02', operatorId: 'operator-user-01', firstName: 'Anjali', lastName: 'Sen', email: 'anjali.s@flyco.aero', role: 'First Officer', status: 'On Duty', licenseNumber: 'CPL-1120', assignedAircraftRegistration: 'VT-STK', createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z' },
];

// --- EMPTY LEGS ---
export const mockEmptyLegs: EmptyLeg[] = [
    { id: 'EL-901', operatorId: 'operator-user-01', operatorName: 'FlyCo Charter', aircraftId: 'AC-001', aircraftName: 'Cessna Citation', departure: 'Mumbai (BOM)', arrival: 'Delhi (DEL)', departureTime: '2024-09-15T14:00:00Z', availableSeats: 4, seatsAllocated: 2, status: 'Published', seatPricingStrategy: 'Dynamic', estimatedPricePerSeat: 45000 },
    { id: 'EL-902', operatorId: 'operator-user-01', operatorName: 'FlyCo Charter', aircraftId: 'AC-002', aircraftName: 'Bombardier Global', departure: 'Delhi (DEL)', arrival: 'Bangalore (BLR)', departureTime: '2024-09-18T10:00:00Z', availableSeats: 8, seatsAllocated: 0, status: 'Approved', seatPricingStrategy: 'Fixed', estimatedPricePerSeat: 65000 },
];

export const mockEmptyLegSeatAllocationRequests: EmptyLegSeatAllocationRequest[] = [
    { id: 'SL-REQ-001', emptyLegId: 'EL-901', agencyId: 'distributor-user-01', operatorId: 'operator-user-01', requesterExternalAuthId: 'distributor-user-01', numberOfSeats: 2, status: 'Approved', requestDateTime: '2024-08-28T10:00:00Z', clientReference: 'Kapoor Family', passengerName: 'Kapoor Party', seatPrice: 45000, totalAmount: 90000, commissionRate: 0.05, commissionAmount: 4500 }
];

// --- ACCOMMODATION ---
export const mockProperties: Property[] = [
    { id: 'PROP-01', hotelPartnerId: 'hotel-user-01', name: 'The Grand Hotel Mumbai', address: 'Marine Drive, Mumbai', city: 'Mumbai', status: 'Active', propertyType: 'Luxury Hotel', imageUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=800' }
];

export const mockRoomCategories: RoomCategory[] = [
    { id: 'RM-01', propertyId: 'PROP-01', name: 'Deluxe King Ocean View', maxOccupancy: 2, beddingType: 'King', nightlyRate: 25000, imageUrl: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?q=80&w=800' }
];

export const mockAccommodationRequests: AccommodationRequest[] = [
    { id: 'ACC-REQ-001', agencyId: 'distributor-user-01', hotelPartnerId: 'hotel-user-01', propertyId: 'PROP-01', propertyName: 'The Grand Mumbai', roomCategory: 'Deluxe King', checkIn: '2024-09-01', checkOut: '2024-09-05', rooms: 2, guestName: 'Executive Guest', status: 'accommodationRequested', tripReferenceId: 'RFQ-EXEC-001', tripType: 'Charter', requesterId: 'distributor-user-01', totalAmount: 85000, commissionRate: 0.1, commissionAmount: 8500, createdAt: '2024-08-01T12:00:00Z', updatedAt: '2024-08-01T12:00:00Z' }
];

// --- COMPLIANCE & EXECUTION ---
export const mockManifests: PassengerManifest[] = [
    { id: 'MAN-001', charterId: 'RFQ-EXEC-003', submittedBy: 'Sanjana Kumar', passengers: [{ fullName: 'Sanjana Kumar', dob: '1990-01-01', gender: 'Female', nationality: 'Indian', idType: 'Passport', idNumber: 'L1234567' }], status: 'approved', createdAt: '2024-08-02T10:00:00Z', updatedAt: '2024-08-02T11:00:00Z' }
];

export const mockInvoices: Invoice[] = [
    { id: 'INV-001', relatedEntityId: 'RFQ-EXEC-003', entityType: 'charter', operatorId: 'operator-user-01', issuedBy: 'FlyCo Finance', invoiceNumber: 'INV-FC-882', totalAmount: 4200000, bankDetails: 'AeroBank India • IFSC: AERO0001234', paymentDeadline: '2024-09-10', status: 'paid', createdAt: '2024-08-02T12:00:00Z' }
];

export const mockPayments: Payment[] = [
    { id: 'PAY-001', relatedEntityId: 'RFQ-EXEC-003', entityType: 'charter', invoiceId: 'INV-001', submittedBy: 'Sanjana Kumar', utrReference: 'BANK-UTR-992281', status: 'verified', createdAt: '2024-08-03T09:00:00Z', verifiedAt: '2024-08-03T10:30:00Z' }
];

export const mockActivityLogs: ActivityLog[] = [
    { id: 'LOG-001', entityId: 'RFQ-EXEC-003', entityType: 'charter', actionType: 'PAYMENT_VERIFIED', performedBy: 'System Admin', role: 'Admin', previousStatus: 'paymentSubmitted', newStatus: 'charterConfirmed', timestamp: '2024-08-03T10:30:00Z' },
    { id: 'LOG-002', entityId: 'RFQ-EXEC-003', entityType: 'charter', actionType: 'OPERATIONAL_PREP', performedBy: 'Ops Desk', role: 'Operator', previousStatus: 'charterConfirmed', newStatus: 'operationalPreparation', timestamp: '2024-08-31T14:00:00Z' }
];

// --- PLATFORM BILLING ---
export const mockPlatformChargeRules: PlatformChargeRule[] = [
  { id: 'RULE-01', entityType: 'Operator', serviceType: 'charter', chargeType: 'percentage', percentageRate: 0.05, fixedAmount: 0, effectiveFrom: '2024-01-01', isActive: true, createdBy: 'admin-user-01', createdAt: '2024-01-01T00:00:00Z' },
  { id: 'RULE-02', entityType: 'Travel Agency', serviceType: 'seat', chargeType: 'percentage', percentageRate: 0.02, fixedAmount: 0, effectiveFrom: '2024-01-01', isActive: true, createdBy: 'admin-user-01', createdAt: '2024-01-01T00:00:00Z' },
  { id: 'RULE-03', entityType: 'Hotel Partner', serviceType: 'accommodation', chargeType: 'fixed', percentageRate: 0, fixedAmount: 500, effectiveFrom: '2024-01-01', isActive: true, createdBy: 'admin-user-01', createdAt: '2024-01-01T00:00:00Z' },
];

export const mockBillingLedger: EntityBillingLedger[] = [
  { id: 'LDG-001', entityId: 'operator-user-01', entityType: 'Operator', entityName: 'FlyCo Charter', relatedTransactionId: 'RFQ-EXEC-003', serviceType: 'charter', grossAmount: 4200000, platformChargeAmount: 210000, commissionRate: 0.05, ledgerStatus: 'paid', createdAt: '2024-08-03T10:30:00Z' },
  { id: 'LDG-002', entityId: 'distributor-user-01', entityType: 'Travel Agency', entityName: 'Sky Distributors', relatedTransactionId: 'SL-REQ-001', serviceType: 'seat', grossAmount: 90000, platformChargeAmount: 1800, commissionRate: 0.02, ledgerStatus: 'pending', createdAt: '2024-08-04T12:00:00Z' },
];

export const mockPlatformInvoices: PlatformInvoice[] = [
  { id: 'PL-INV-001', entityId: 'operator-user-01', entityName: 'FlyCo Charter', entityType: 'Operator', billingPeriodStart: '2024-08-01', billingPeriodEnd: '2024-08-31', totalAmount: 210000, dueDate: '2024-09-10', status: 'paid', createdAt: '2024-09-01T09:00:00Z' },
  { id: 'PL-INV-002', entityId: 'distributor-user-01', entityName: 'Sky Distributors', entityType: 'Travel Agency', billingPeriodStart: '2024-08-01', billingPeriodEnd: '2024-08-31', totalAmount: 1800, dueDate: '2024-09-10', status: 'issued', createdAt: '2024-09-01T09:30:00Z' },
];

// --- OTHER ---
export const mockAuditLogs: AuditLog[] = [
    { id: 'AUDIT-01', timestamp: '2024-08-31T10:00:00Z', user: 'Rajesh Verma', role: 'Operator', action: 'STATUS_UPDATE', details: 'Updated VT-FLY to Available', targetId: 'AC-001' }
];
export const mockFeatureFlags: FeatureFlag[] = [
    { id: 'FF-01', name: 'AI Compliance Guard', description: 'Enable real-time AI evaluation of manifests.', isEnabled: true },
    { id: 'FF-02', name: 'Dynamic Seat Pricing', description: 'Allow operators to set algorithmic pricing floors.', isEnabled: false }
];
export const mockSubscriptionPlans: SubscriptionPlan[] = [
  { id: 'PLAN-PRO', planName: 'Pro Fleet', monthlyFee: 15000, commissionOverrideRate: 0.03, seatLimit: 50, transactionLimit: 100, isActive: true, createdAt: '2024-01-01T00:00:00Z' },
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
        featureFlags: mockFeatureFlags,
        crew: mockCrew,
        manifests: mockManifests,
        invoices: mockInvoices,
        payments: mockPayments,
        activityLogs: mockActivityLogs,
        platformChargeRules: mockPlatformChargeRules,
        entityBillingLedger: mockBillingLedger,
        platformInvoices: mockPlatformInvoices,
        subscriptionPlans: mockSubscriptionPlans
    };
}
