import {
  User,
  UserRole,
  CharterRFQ,
  Aircraft,
  AuditLog,
  Bid,
  EmptyLeg,
} from '@/lib/types';
import { PlaceHolderImages } from './placeholder-images';
import { subDays, format, addDays } from 'date-fns';

const avatar1 = PlaceHolderImages.find((img) => img.id === 'avatar-1')?.imageUrl ?? '';
const avatar2 = PlaceHolderImages.find((img) => img.id === 'avatar-2')?.imageUrl ?? '';


export const users: User[] = [
  { id: 'usr_1', name: 'Ananya Sharma', email: 'ananya.sharma@example.com', role: 'Customer', avatar: avatar1, company: 'Reliance Industries' },
  { id: 'usr_2', name: 'Vikram Singh', email: 'vikram.singh@flysafe.com', role: 'Operator', avatar: avatar2, company: 'FlySafe Charters' },
  { id: 'usr_3', name: 'Priya Patel', email: 'priya.patel@jetsetgo.com', role: 'Authorized Distributor', avatar: avatar1, company: 'JetSetGo' },
  { id: 'usr_4', name: 'Rohan Mehta', email: 'rohan.mehta@tatasteel.com', role: 'CTD Requester', avatar: avatar2, company: 'Tata Steel' },
  { id: 'usr_5', name: 'Sonia Gupta', email: 'sonia.gupta@tatasteel.com', role: 'CTD Approver', avatar: avatar1, company: 'Tata Steel' },
  { id: 'usr_6', name: 'Amit Desai', email: 'amit.desai@infosys.com', role: 'CTD Admin', avatar: avatar2, company: 'Infosys' },
  { id: 'usr_7', name: 'Nisha Agarwal', email: 'nisha.agarwal@tajhotels.com', role: 'Hotel Partner', avatar: avatar1, company: 'Taj Hotels' },
  { id: 'usr_8', name: 'Arjun Verma', email: 'arjun.verma@aerodesk.gov', role: 'Admin', avatar: avatar2, company: 'AeroDesk' },
];

export const aircrafts: Aircraft[] = [
  { id: 'ac_1', operatorId: 'usr_2', name: 'Phenom 300E', type: 'Light Jet', registration: 'VT-JSS', paxCapacity: 8, homeBase: 'VABB' },
  { id: 'ac_2', operatorId: 'usr_2', name: 'Falcon 2000', type: 'Heavy Jet', registration: 'VT-KSS', paxCapacity: 12, homeBase: 'VIDP' },
  { id: 'ac_3', operatorId: 'usr_2', name: 'King Air B200', type: 'Turboprop', registration: 'VT-LSS', paxCapacity: 7, homeBase: 'VOMM' },
];

export const rfqs: CharterRFQ[] = [
  { id: 'rfq_1', customerId: 'usr_1', customerName: 'Ananya Sharma', tripType: 'Onward', departure: 'Mumbai (VABB)', arrival: 'Delhi (VIDP)', departureDate: format(addDays(new Date(), 2), 'yyyy-MM-dd'), pax: 5, aircraftType: 'Any Light Jet', status: 'Bidding Open', createdAt: format(subDays(new Date(), 1), 'yyyy-MM-dd HH:mm'), bidsCount: 2, specialRequirements: 'Wheelchair assistance required for one passenger.' },
  { id: 'rfq_2', customerId: 'usr_4', customerName: 'Rohan Mehta (Tata Steel)', tripType: 'Return', departure: 'Jamshedpur (VEJS)', arrival: 'Kolkata (VECC)', departureDate: format(addDays(new Date(), 3), 'yyyy-MM-dd'), returnDate: format(addDays(new Date(), 5), 'yyyy-MM-dd'), pax: 3, aircraftType: 'Any Turboprop', status: 'Pending Approval', createdAt: format(subDays(new Date(), 2), 'yyyy-MM-dd HH:mm'), bidsCount: 0, businessPurpose: 'Quarterly Review Meeting', costCenter: 'FIN-CORP-2024' },
  { id: 'rfq_3', customerId: 'usr_1', customerName: 'Ananya Sharma', tripType: 'Onward', departure: 'Bengaluru (VOBL)', arrival: 'Hyderabad (VOHS)', departureDate: format(addDays(new Date(), 5), 'yyyy-MM-dd'), pax: 8, aircraftType: 'Any Mid-size Jet', status: 'Operator Selected', createdAt: format(subDays(new Date(), 7), 'yyyy-MM-dd HH:mm'), bidsCount: 4, catering: 'Vegetarian lunch boxes required.' },
  { id: 'rfq_4', customerId: 'usr_6', customerName: 'Amit Desai (Infosys)', tripType: 'Multi-City', departure: 'Pune (VAPO)', arrival: 'Chennai (VOMM)', departureDate: format(addDays(new Date(), 10), 'yyyy-MM-dd'), pax: 12, aircraftType: 'Any Heavy Jet', status: 'Confirmed', createdAt: format(subDays(new Date(), 15), 'yyyy-MM-dd HH:mm'), bidsCount: 3, specialRequirements: 'Multi-city trip: Pune -> Hyderabad -> Chennai over 3 days.', businessPurpose: 'Project Kick-off', costCenter: 'TECH-INNO-0524' },
  { id: 'rfq_5', customerId: 'usr_1', customerName: 'Ananya Sharma', tripType: 'Onward', departure: 'Goa (VOGO)', arrival: 'Mumbai (VABB)', departureDate: format(addDays(new Date(), 1), 'yyyy-MM-dd'), pax: 2, aircraftType: 'Any', status: 'Draft', createdAt: format(new Date(), 'yyyy-MM-dd HH:mm'), bidsCount: 0 },
];

export const bids: Bid[] = [
    { id: 'bid_1', rfqId: 'rfq_1', operatorId: 'usr_2', operatorName: 'FlySafe Charters', aircraftId: 'ac_1', aircraftName: 'Phenom 300E', price: 850000, status: 'Submitted', submittedAt: format(new Date(), 'yyyy-MM-dd HH:mm')},
    { id: 'bid_2', rfqId: 'rfq_1', operatorId: 'usr_2_alt', operatorName: 'IndiaJets', aircraftId: 'ac_4', aircraftName: 'Citation CJ2', price: 825000, status: 'Submitted', submittedAt: format(new Date(), 'yyyy-MM-dd HH:mm')},
];

export const emptyLegs: EmptyLeg[] = [
    { id: 'el_1', operatorId: 'usr_2', aircraftId: 'ac_2', departure: 'Delhi (VIDP)', arrival: 'Mumbai (VABB)', departureTime: format(addDays(new Date(), 1), 'yyyy-MM-dd') + ' 14:00', availableSeats: 8, status: 'Approved'},
    { id: 'el_2', operatorId: 'usr_2', aircraftId: 'ac_3', departure: 'Chennai (VOMM)', arrival: 'Bengaluru (VOBL)', departureTime: format(addDays(new Date(), 2), 'yyyy-MM-dd') + ' 10:00', availableSeats: 5, status: 'Pending Approval'},
];

export const auditLogs: AuditLog[] = [
  { id: 'log_1', timestamp: format(subDays(new Date(), 1), 'yyyy-MM-dd HH:mm:ss'), user: 'Ananya Sharma', role: 'Customer', action: 'Created RFQ', details: 'RFQ from Mumbai to Delhi for 5 pax', targetId: 'rfq_1' },
  { id: 'log_2', timestamp: format(subDays(new Date(), 1), 'yyyy-MM-dd HH:mm:ss'), user: 'System', role: 'Admin', action: 'Compliance Check', details: 'Initial compliance check passed for RFQ', targetId: 'rfq_1' },
  { id: 'log_3', timestamp: format(new Date(), 'yyyy-MM-dd HH:mm:ss'), user: 'Vikram Singh', role: 'Operator', action: 'Submitted Bid', details: 'Bid for ₹850,000 on Phenom 300E', targetId: 'rfq_1' },
  { id: 'log_4', timestamp: format(subDays(new Date(), 2), 'yyyy-MM-dd HH:mm:ss'), user: 'Rohan Mehta', role: 'CTD Requester', action: 'Created RFQ', details: 'RFQ from Jamshedpur to Kolkata for 3 pax on behalf of Tata Steel', targetId: 'rfq_2' },
  { id: 'log_5', timestamp: format(subDays(new Date(), 2), 'yyyy-MM-dd HH:mm:ss'), user: 'System', role: 'Admin', action: 'Forwarded for Approval', details: 'RFQ requires approval from CTD Approver', targetId: 'rfq_2' },
];

export const getMockDataForRole = (role: UserRole) => {
    switch (role) {
        case 'Customer':
            return {
                rfqs: rfqs.filter(r => r.customerId === 'usr_1'),
                emptyLegs: emptyLegs.filter(e => e.status === 'Approved'),
            };
        case 'Operator':
            return {
                rfqs: rfqs.filter(r => r.status === 'Bidding Open'),
                aircrafts: aircrafts,
                bids: bids,
                emptyLegs: emptyLegs.filter(e => e.operatorId === 'usr_2')
            };
        case 'Admin':
            return {
                rfqs,
                aircrafts,
                users,
                auditLogs,
                emptyLegs
            };
        case 'CTD Requester':
        case 'CTD Approver':
        case 'CTD Admin':
             return {
                rfqs: rfqs.filter(r => r.customerName.includes('Tata Steel') || r.customerName.includes('Infosys')),
             };
        case 'Authorized Distributor':
            return {
                emptyLegs: emptyLegs.filter(e => e.status === 'Approved')
            };
        default:
            return {};
    }
}
