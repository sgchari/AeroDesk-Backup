export type UserRole =
  | 'Customer'
  | 'Operator'
  | 'Authorized Distributor'
  | 'CTD Requester'
  | 'CTD Approver'
  | 'CTD Admin'
  | 'Hotel Partner'
  | 'Admin';

export type User = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  company?: string;
};

export type RfqStatus =
  | 'Draft'
  | 'Submitted'
  | 'Pending Approval'
  | 'Bidding Open'
  | 'Bidding Closed'
  | 'Operator Selected'
  | 'Confirmed'
  | 'Cancelled';

export type CharterRFQ = {
  id: string;
  customerId: string;
  customerName: string;
  departure: string;
  arrival: string;
  departureDate: string;
  pax: number;
  aircraftType: string;
  status: RfqStatus;
  createdAt: string;
  bidsCount: number;
};

export type Bid = {
  id: string;
  rfqId: string;
  operatorId: string;
  operatorName: string;
  aircraftId: string;
  aircraftName: string;
  price: number;
  status: 'Submitted' | 'Withdrawn';
  submittedAt: string;
};

export type Aircraft = {
  id: string;
  operatorId: string;
  name: string;
  type: 'Light Jet' | 'Mid-size Jet' | 'Heavy Jet' | 'Turboprop';
  registration: string;
  paxCapacity: number;
  homeBase: string;
};

export type EmptyLeg = {
  id: string;
  operatorId: string;
  aircraftId: string;
  departure: string;
  arrival: string;
  departureTime: string;
  availableSeats: number;
  status: 'Pending Approval' | 'Approved' | 'Expired';
};

export type HotelPartner = {
  id: string;
  name: string;
  location: string;
  status: 'Active' | 'Inactive';
};

export type AuditLog = {
  id: string;
  timestamp: string;
  user: string;
  role: UserRole;
  action: string;
  details: string;
  targetId: string;
};
