export type UserRole =
  | 'Customer'
  | 'Operator'
  | 'Authorized Distributor'
  | 'CTD Admin'
  | 'Hotel Partner'
  | 'Admin'
  | 'Requester'
  | 'Corporate Admin';

export type User = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  status: string;
  phoneNumber?: string;
  company?: string;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
};

export type Operator = {
  id: string;
  externalAuthId: string;
  companyName: string;
  nsopLicenseNumber: string;
  contactPersonName: string;
  contactEmail: string;
  contactPhone?: string;
  address?: string;
  status: 'Pending Approval' | 'Approved' | 'Suspended' | 'Rejected';
  mouAcceptedAt: string;
  createdAt: string;
  updatedAt: string;
};

export type RfqStatus =
  | 'Draft'
  | 'Submitted'
  | 'Pending Approval'
  | 'Bidding Open'
  | 'Bidding Closed'
  | 'Operator Selected'
  | 'Confirmed'
  | 'Cancelled'
  | 'Expired';

export type TripType = 'Onward' | 'Return' | 'Multi-City';

export type CharterRFQ = {
  id: string;
  customerId: string;
  requesterExternalAuthId: string;
  customerName: string;
  tripType: TripType;
  departure: string;
  arrival: string;
  departureDate: string;
  returnDate?: string;
  pax: number;
  aircraftType: string;
  status: RfqStatus;
  createdAt: string;
  bidsCount: number;
  catering?: string;
  specialRequirements?: string;
  businessPurpose?: string;
  costCenter?: string;
  company?: string;
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

export type AccommodationRequest = {
    id: string;
    tripReferenceId: string;
    tripType: 'Charter' | 'EmptyLeg';
    hotelPartnerId?: string;
    guestType?: 'Passenger' | 'Crew';
    checkIn: string;
    checkOut: string;
    rooms: number;
    status: 'Pending' | 'Confirmed' | 'Declined';
}

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
