
export type UserRole =
  | 'Customer'
  | 'Operator'
  | 'Travel Agency'
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
  ctdId?: string;
  externalAuthId?: string; // For consistency
  nsopLicenseNumber?: string; // For operator users
  mouAcceptedAt?: string; // For operator users
  companyName?: string; // For company-based roles
  city?: string;
  zone?: 'North' | 'South' | 'East' | 'West' | 'Central';
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
  city?: string;
  zone?: 'North' | 'South' | 'East' | 'West' | 'Central';
  featured?: boolean;
};

export type RfqStatus =
  | 'Draft'
  | 'New'
  | 'Submitted'
  | 'Reviewing'
  | 'Pending Approval'
  | 'Bidding Open'
  | 'Bidding Closed'
  | 'Operator Selected'
  | 'Quoted'
  | 'Closed'
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
  hotelRequired?: boolean;
};

export type Quotation = {
  id: string;
  rfqId: string;
  operatorId: string;
  operatorName: string;
  aircraftId: string;
  aircraftName: string;
  price: number;
  status: 'Submitted' | 'Withdrawn' | 'Selected' | 'Rejected';
  submittedAt: string;
  validUntil: string;
};

// Deprecating Bid in favor of Quotation
export type Bid = Quotation;


export type Aircraft = {
  id: string;
  operatorId: string;
  name: string;
  type: 'Light Jet' | 'Mid-size Jet' | 'Heavy Jet' | 'Turboprop';
  registration: string;
  paxCapacity: number;
  homeBase: string;
  status: 'Available' | 'Under Maintenance' | 'AOG' | 'Restricted';
};

export type EmptyLeg = {
  id: string;
  operatorId: string;
  operatorName?: string; // For display
  aircraftId: string;
  aircraftName?: string; // For display
  departure: string;
  arrival: string;
  departureTime: string;
  availableSeats: number;
  seatsAllocated?: number; // For display
  status: 'Pending Approval' | 'Approved' | 'Expired' | 'Cancelled' | 'Draft' | 'Published' | 'Closed';
};

export type EmptyLegSeatAllocationRequest = {
    id: string;
    emptyLegId: string;
    distributorId: string;
    requesterExternalAuthId: string;
    numberOfSeats: number;
    status: 'Requested' | 'Approved' | 'Rejected' | 'Cancelled';
    requestDateTime: string;
    clientReference?: string;
    passengerNotes?: string;
}

export type Property = {
    id: string;
    hotelPartnerId: string;
    name: string;
    address: string;
    city: string;
    status: 'Active' | 'Inactive';
    propertyType?: string;
    imageUrl?: string;
};

export type RoomCategory = {
    id: string;
    propertyId: string;
    name: string;
    description?: string;
    maxOccupancy: number;
    beddingType?: string;
    baseCapacity?: number;
    imageUrl?: string;
};

export type AccommodationRequest = {
    id: string;
    tripReferenceId: string;
    tripType: 'Charter' | 'EmptyLeg';
    hotelPartnerId?: string;
    propertyId?: string;
    propertyName?: string;
    guestType?: 'Passenger' | 'Crew';
    guestName?: string;
    checkIn: string;
    checkOut: string;
    rooms: number;
    status: 'Pending' | 'Confirmed' | 'Declined' | 'Awaiting Clarification';
    specialRequests?: string;
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

export type CorporateTravelDesk = {
    id: string;
    companyName: string;
    adminExternalAuthId: string;
    contactEmail?: string;
    contactPhone?: string;
    address?: string;
    status: string;
    createdAt: string;
    updatedAt: string;
};

export type BillingRecord = {
    id: string;
    entityName: string;
    entityId: string;
    eventType: 'Subscription' | 'Coordination Fee' | 'Participation Fee';
    amount: number;
    currency: 'INR';
    status: 'Paid' | 'Pending' | 'Overdue';
    date: string;
};

export type FeatureFlag = {
    id: string;
    name: string;
    description: string;
    isEnabled: boolean;
};

export type BlogPost = {
  id: string;
  title: string;
  excerpt: string;
  content?: string;
  category: 'Insights' | 'Industry' | 'Operator' | 'Market Trends' | 'Empty Leg Insights' | 'Corporate Travel';
  imageUrl: string;
  author: string;
  date: string;
  isFeatured?: boolean;
};
