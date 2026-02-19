import { PageHeader } from "@/components/dashboard/shared/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Badge } from "../ui/badge";
import { MoreHorizontal, BedDouble, Calendar, Check, X, Clock } from "lucide-react";
import { Button } from "../ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { StatsCard } from "./shared/stats-card";
import { StatsGrid } from "./shared/stats-grid";
import Link from "next/link";


const mockRequests = [
    { id: 'req_1', tripId: 'rfq_4', guestType: 'Passenger', checkIn: '2024-08-20', checkOut: '2024-08-22', rooms: 5, status: 'Pending'},
    { id: 'req_2', tripId: 'trip_7', guestType: 'Crew', checkIn: '2024-08-21', checkOut: '2024-08-22', rooms: 2, status: 'Confirmed'},
    { id: 'req_3', tripId: 'trip_8', guestType: 'Passenger', checkIn: '2024-08-25', checkOut: '2024-08-26', rooms: 1, status: 'Pending'},
]

export function HotelDashboard() {
  const stats = {
    pending: mockRequests.filter(r => r.status === 'Pending').length,
    confirmed: mockRequests.filter(r => r.status === 'Confirmed').length,
    thisMonth: mockRequests.length
  }

  return (
    <>
      <PageHeader title="Hotel Partner Dashboard" description="Manage accommodation requests for approved trips.">
        <Button asChild>
            <Link href="/dashboard/hotel/properties">Manage Properties</Link>
        </Button>
      </PageHeader>
      
      <StatsGrid>
        <StatsCard title="Pending Requests" value={stats.pending.toString()} icon={Calendar} description="Awaiting your confirmation" />
        <StatsCard title="Confirmed Stays" value={stats.confirmed.toString()} icon={Check} description="Bookings confirmed" />
        <StatsCard title="Total Rooms (Month)" value="8" icon={BedDouble} description="Rooms requested this month" />
        <StatsCard title="Response Time" value="~2.5 hrs" icon={Clock} description="Your average response time" />
      </StatsGrid>

      <Card>
        <CardHeader>
          <CardTitle>Accommodation Requests</CardTitle>
          <CardDescription>
            Requests linked to confirmed charter flights or empty legs.
          </CardDescription>
        </CardHeader>
        <CardContent>
            <Table>
                <TableHeader>
                <TableRow>
                    <TableHead>Request ID</TableHead>
                    <TableHead>Trip ID</TableHead>
                    <TableHead>Guest Type</TableHead>
                    <TableHead>Check-in</TableHead>
                    <TableHead>Check-out</TableHead>
                    <TableHead>Rooms</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>
                    <span className="sr-only">Actions</span>
                    </TableHead>
                </TableRow>
                </TableHeader>
                <TableBody>
                {mockRequests.map((req) => (
                    <TableRow key={req.id}>
                        <TableCell className="font-medium font-code">{req.id}</TableCell>
                        <TableCell className="font-code">{req.tripId}</TableCell>
                        <TableCell>
                            <Badge variant={req.guestType === 'Crew' ? 'outline' : 'secondary'}>{req.guestType}</Badge>
                        </TableCell>
                        <TableCell>{req.checkIn}</TableCell>
                        <TableCell>{req.checkOut}</TableCell>
                        <TableCell>{req.rooms}</TableCell>
                        <TableCell>
                            <Badge variant={req.status === 'Pending' ? 'destructive' : 'default'}>{req.status}</Badge>
                        </TableCell>
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
                                {req.status === 'Pending' && <DropdownMenuItem>Confirm Request</DropdownMenuItem>}
                                {req.status === 'Pending' && <DropdownMenuItem>Decline</DropdownMenuItem>}
                                <DropdownMenuItem>View Details</DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </TableCell>
                    </TableRow>
                ))}
                </TableBody>
            </Table>
        </CardContent>
      </Card>
    </>
  );
}
