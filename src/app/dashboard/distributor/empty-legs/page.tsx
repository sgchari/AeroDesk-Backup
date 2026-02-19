import { PageHeader } from "@/components/dashboard/shared/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getMockDataForRole } from "@/lib/data";
import type { EmptyLeg } from "@/lib/types";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

export default function DistributorEmptyLegsPage() {
  const { emptyLegs } = getMockDataForRole('Authorized Distributor');

  return (
    <>
      <PageHeader title="Approved Empty Legs" description="View and manage seat allocations for available empty leg flights." />
      <Card>
        <CardHeader>
          <CardTitle>All Available Flights</CardTitle>
          <CardDescription>
            A complete list of approved empty leg flights available for seat allocation.
          </CardDescription>
        </CardHeader>
        <CardContent>
            <Table>
                <TableHeader>
                <TableRow>
                    <TableHead>Flight ID</TableHead>
                    <TableHead>Route</TableHead>
                    <TableHead>Departure Time</TableHead>
                    <TableHead>Available Seats</TableHead>
                    <TableHead>
                    <span className="sr-only">Actions</span>
                    </TableHead>
                </TableRow>
                </TableHeader>
                <TableBody>
                {emptyLegs?.map((leg: EmptyLeg) => (
                    <TableRow key={leg.id}>
                        <TableCell className="font-medium font-code">{leg.id}</TableCell>
                        <TableCell>{leg.departure} to {leg.arrival}</TableCell>
                        <TableCell>{leg.departureTime}</TableCell>
                        <TableCell className="font-bold">{leg.availableSeats}</TableCell>
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
                                <DropdownMenuItem>Request Seat Allocation</DropdownMenuItem>
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
