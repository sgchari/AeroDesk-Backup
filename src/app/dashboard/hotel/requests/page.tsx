import { PageHeader } from "@/components/dashboard/shared/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";

const mockRequests = [
    { id: 'req_1', tripId: 'rfq_4', guestType: 'Passenger', checkIn: '2024-08-20', checkOut: '2024-08-22', rooms: 5, status: 'Pending'},
    { id: 'req_2', tripId: 'trip_7', guestType: 'Crew', checkIn: '2024-08-21', checkOut: '2024-08-22', rooms: 2, status: 'Confirmed'},
    { id: 'req_3', tripId: 'trip_8', guestType: 'Passenger', checkIn: '2024-08-25', checkOut: '2024-08-26', rooms: 1, status: 'Pending'},
    { id: 'req_4', tripId: 'el_1', guestType: 'Passenger', checkIn: '2024-08-28', checkOut: '2024-08-29', rooms: 3, status: 'Declined'},
];

export default function HotelRequestsPage() {
  return (
    <>
      <PageHeader title="Accommodation Requests" description="Manage all incoming accommodation requests for your properties." />
      <Card>
        <CardHeader>
          <CardTitle>All Requests</CardTitle>
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
                            <Badge variant={req.status === 'Pending' ? 'destructive' : req.status === 'Confirmed' ? 'default' : 'secondary'}>{req.status}</Badge>
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
                                <DropdownMenuItem>View Details</DropdownMenuItem>
                                {req.status === 'Pending' && (
                                    <>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem>Accept</DropdownMenuItem>
                                        <DropdownMenuItem>Propose Alternate</DropdownMenuItem>
                                        <DropdownMenuItem>Decline (with reason)</DropdownMenuItem>
                                    </>
                                )}
                                {req.status === 'Confirmed' && (
                                    <>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem>Upload Voucher</DropdownMenuItem>
                                    </>
                                )}
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
