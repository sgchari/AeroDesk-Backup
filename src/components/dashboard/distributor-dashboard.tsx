import { PageHeader } from "@/components/dashboard/shared/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { getMockDataForRole } from "@/lib/data";
import type { EmptyLeg } from "@/lib/types";
import { MoreHorizontal, Plane, Users, Calendar } from "lucide-react";
import { Button } from "../ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { StatsCard } from "./shared/stats-card";
import { StatsGrid } from "./shared/stats-grid";

export function DistributorDashboard() {
  const { emptyLegs } = getMockDataForRole('Authorized Distributor');

  return (
    <>
      <PageHeader title="Distributor Dashboard" description="View approved empty legs and manage seat allocations." />
      
      <StatsGrid>
        <StatsCard title="Available Empty Legs" value={emptyLegs?.length.toString() ?? '0'} icon={Plane} description="Flights with allocatable seats" />
        <StatsCard title="Total Seats Allocated" value="32" icon={Users} description="Across all empty legs" />
        <StatsCard title="Upcoming Flights" value="4" icon={Calendar} description="In the next 7 days" />
        <StatsCard title="Distributor Seat Cap" value="100" icon={Users} description="Monthly allocation limit" />
      </StatsGrid>

      <Card>
        <CardHeader>
          <CardTitle>Approved Empty Legs</CardTitle>
          <CardDescription>
            A list of empty leg flights available for seat allocation.
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
