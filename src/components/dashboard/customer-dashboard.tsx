import { PageHeader } from "@/components/dashboard/shared/page-header";
import { CreateRfqDialog } from "./customer/create-rfq-dialog";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Badge } from "../ui/badge";
import { getMockDataForRole } from "@/lib/data";
import type { CharterRFQ, RfqStatus, EmptyLeg } from "@/lib/types";
import { MoreHorizontal, FileText, Clock, CheckCircle, Plane, Hotel } from "lucide-react";
import { Button } from "../ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { StatsCard } from "./shared/stats-card";
import { StatsGrid } from "./shared/stats-grid";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

const getStatusVariant = (status: RfqStatus) => {
    switch (status) {
        case 'Draft': return 'secondary';
        case 'Pending Approval': return 'outline';
        case 'Bidding Open': return 'default';
        case 'Operator Selected': 'default';
        case 'Confirmed': return 'default';
        default: return 'secondary';
    }
}

const getStatusColor = (status: RfqStatus) => {
    switch (status) {
        case 'Bidding Open': return 'bg-green-500';
        case 'Confirmed': return 'bg-blue-500';
        case 'Pending Approval': return 'bg-yellow-500';
        default: return 'bg-gray-500';
    }
}


export function CustomerDashboard() {
  const { rfqs, emptyLegs } = getMockDataForRole('Customer');
  const { toast } = useToast();

  const stats = {
    active: rfqs?.filter(r => r.status === 'Bidding Open').length ?? 0,
    completed: rfqs?.filter(r => r.status === 'Confirmed').length ?? 0,
    emptyLegs: emptyLegs?.length ?? 0,
  }

  const confirmedTrips = rfqs?.filter(r => r.status === 'Confirmed') ?? [];

  const handleRequestHotel = (rfqId: string) => {
    toast({
        title: "Hotel Request Sent",
        description: `Your request for accommodation for trip ${rfqId} has been sent to partner hotels.`,
    });
  };

  const handleRequestSeats = (legId: string) => {
    toast({
        title: "Seat Request Sent",
        description: `Your request for seats on flight ${legId} has been sent to the operator for confirmation.`,
    });
  };

  return (
    <>
      <PageHeader title="Customer Dashboard" description="Manage your charter requests and view their status.">
        <CreateRfqDialog />
      </PageHeader>
      
      <div className="grid gap-6">
        <StatsGrid>
            <StatsCard title="Total RFQs" value={rfqs.length.toString()} icon={FileText} description="All requests submitted" />
            <StatsCard title="Active Bidding" value={stats.active.toString()} icon={Clock} description="RFQs currently open for bids" />
            <StatsCard title="Available Empty Legs" value={stats.emptyLegs.toString()} icon={Plane} description="Discounted one-way flights" />
            <StatsCard title="Confirmed Trips" value={stats.completed.toString()} icon={CheckCircle} description="Successfully confirmed charters" />
        </StatsGrid>

        <Card>
            <CardHeader>
            <CardTitle>Recent Charter RFQs</CardTitle>
            <CardDescription>
                A list of your most recent charter requests.
            </CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                    <TableRow>
                        <TableHead>RFQ ID</TableHead>
                        <TableHead>Route</TableHead>
                        <TableHead>Departure Date</TableHead>
                        <TableHead>PAX</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Bids</TableHead>
                        <TableHead>
                        <span className="sr-only">Actions</span>
                        </TableHead>
                    </TableRow>
                    </TableHeader>
                    <TableBody>
                    {rfqs.map((rfq: CharterRFQ) => (
                        <TableRow key={rfq.id}>
                            <TableCell className="font-medium font-code">{rfq.id}</TableCell>
                            <TableCell>{rfq.departure} to {rfq.arrival}</TableCell>
                            <TableCell>{rfq.departureDate}</TableCell>
                            <TableCell>{rfq.pax}</TableCell>
                            <TableCell>
                                <Badge variant={getStatusVariant(rfq.status)}>
                                    <span className={cn("mr-2 h-2 w-2 rounded-full", getStatusColor(rfq.status))}></span>
                                    {rfq.status}
                                </Badge>
                            </TableCell>
                            <TableCell>{rfq.bidsCount}</TableCell>
                            <TableCell>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                    <Button aria-haspopup="true" size="icon" variant="ghost">
                                        <MoreHorizontal className="h-4 w-4" />
                                        <span className="sr-only">Toggle menu</span>
                                    </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                    <DropdownMenuItem>View Details</DropdownMenuItem>
                                    <DropdownMenuItem>Compare Bids</DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </TableCell>
                        </TableRow>
                    ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
        
        {confirmedTrips.length > 0 && (
            <Card>
                <CardHeader>
                    <CardTitle>Confirmed Trips</CardTitle>
                    <CardDescription>
                        Your upcoming trips are confirmed. You can now request accommodation.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Trip ID</TableHead>
                                <TableHead>Route</TableHead>
                                <TableHead>Departure Date</TableHead>
                                <TableHead className="text-right">Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {confirmedTrips.map((trip: CharterRFQ) => (
                                <TableRow key={trip.id}>
                                    <TableCell className="font-medium font-code">{trip.id}</TableCell>
                                    <TableCell>{trip.departure} to {trip.arrival}</TableCell>
                                    <TableCell>{trip.departureDate}</TableCell>
                                    <TableCell className="text-right">
                                        <Button size="sm" variant="outline" onClick={() => handleRequestHotel(trip.id)}>
                                            <Hotel className="mr-2 h-4 w-4" />
                                            Request Hotel
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        )}

        {emptyLegs && emptyLegs.length > 0 && (
            <Card>
                <CardHeader>
                    <CardTitle>Available Empty Legs</CardTitle>
                    <CardDescription>
                        One-way flights available at a discounted rate. Request a seat now!
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Flight ID</TableHead>
                                <TableHead>Route</TableHead>
                                <TableHead>Departure</TableHead>
                                <TableHead>Available Seats</TableHead>
                                <TableHead className="text-right">Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {emptyLegs.map((leg: EmptyLeg) => (
                                <TableRow key={leg.id}>
                                    <TableCell className="font-medium font-code">{leg.id}</TableCell>
                                    <TableCell>{leg.departure} to {leg.arrival}</TableCell>
                                    <TableCell>{leg.departureTime}</TableCell>
                                    <TableCell className="font-bold text-center">{leg.availableSeats}</TableCell>
                                    <TableCell className="text-right">
                                        <Button size="sm" onClick={() => handleRequestSeats(leg.id)}>Request Seats</Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        )}
      </div>
    </>
  );
}
