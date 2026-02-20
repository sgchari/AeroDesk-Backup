
'use client';
import { PageHeader } from "@/components/dashboard/shared/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { EmptyLeg } from "@/lib/types";
import { MoreHorizontal, Plane, Users, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { StatsCard } from "@/components/dashboard/shared/stats-card";
import { StatsGrid } from "@/components/dashboard/shared/stats-grid";
import { Skeleton } from "@/components/ui/skeleton";
import { useCollection, useFirestore, useMemoFirebase } from "@/firebase";
import { collection, query, where } from "firebase/firestore";

export function DistributorDashboard() {
  const firestore = useFirestore();
  const emptyLegsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'emptyLegs'), where('status', '==', 'Approved'));
  }, [firestore]);
  const { data: emptyLegs, isLoading } = useCollection<EmptyLeg>(emptyLegsQuery);

  return (
    <>
      <PageHeader title="Distributor Dashboard" description="View approved empty legs and manage seat allocations." />
      
      <StatsGrid>
        <StatsCard title="Available Empty Legs" value={isLoading ? <Skeleton className="h-6 w-12" /> : emptyLegs?.length.toString() ?? '0'} icon={Plane} description="Flights with allocatable seats" />
        <StatsCard title="Total Seats Allocated" value="0" icon={Users} description="Across all empty legs" />
        <StatsCard title="Upcoming Flights" value="0" icon={Calendar} description="In the next 7 days" />
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
            {isLoading ? <Skeleton className="h-40 w-full" /> : (
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
                        <TableCell>{new Date(leg.departureTime).toLocaleString()}</TableCell>
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
            )}
        </CardContent>
      </Card>
    </>
  );
}
