
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
  externalAuthId?: string;
  nsopLicenseNumber?: string;
  mouAcceptedAt?: string;
  companyName?: string;
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
  departureTime?: string;
  returnDate?: string;
  returnTime?: string;
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
  status: 'Submitted' | 'Withdrawn' | 'Selected' | 'Rejected' | 'Expired';
  submittedAt: string;
  validUntil: string;
  operatorRemarks?: string;
};

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
  operatorName?: string;
  aircraftId: string;
  aircraftName?: string;
  departure: string;
  arrival: string;
  departureTime: string;
  availableSeats: number;
  seatsAllocated?: number;
  status: 'Pending Approval' | 'Approved' | 'Expired' | 'Cancelled' | 'Draft' | 'Published' | 'Closed';
  seatPricingStrategy?: 'Fixed' | 'Dynamic' | 'Negotiable';
  estimatedPricePerSeat?: number;
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
    passengerName?: string; // For operator view
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
    nightlyRate?: number;
};

export type AccommodationRequest = {
    id: string;
    tripReferenceId: string;
    tripType: 'Charter' | 'EmptyLeg';
    requesterId: string; // The ID of the person/agency who made the request
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

export type PolicyFlag = {
    id: string;
    ctdId: string;
    name: string;
    description: string;
    isEnforced: boolean;
    policyDetails?: string;
    createdAt?: string;
    updatedAt?: string;
};

export type BlogPost = {
  id: string;
  title: string;
  excerpt: string;
  content?: string;
  category: string;
  imageUrl: string;
  author: string;
  date: string;
  isFeatured?: boolean;
};

export type PressRelease = {
  id: string;
  title: string;
  description: string;
  date: string;
  category: string;
};

export type MediaMention = {
  id: string;
  publication: string;
  title: string;
  snippet: string;
  date: string;
  logoUrl?: string;
};

export type BrandAsset = {
  id: string;
  title: string;
  type: string;
  imageUrl: string;
  fileSize: string;
};
