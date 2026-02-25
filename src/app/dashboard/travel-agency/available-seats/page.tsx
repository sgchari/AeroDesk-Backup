
'use client';
import { PageHeader } from "@/components/dashboard/shared/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { EmptyLeg } from "@/lib/types";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useCollection, useFirestore, useMemoFirebase } from "@/firebase";
import { collection, query } from "firebase/firestore";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";
import { RequestSeatAllocationDialog } from "@/components/dashboard/travel-agency/request-seat-allocation-dialog";

export default function AvailableSeatsPage() {
  const firestore = useFirestore();
  const [legToRequest, setLegToRequest] = useState<EmptyLeg | null>(null);

  const emptyLegsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    // Fetch all legs; filtering happens client-side for demo
    return query(collection(firestore, 'emptyLegs'));
  }, [firestore]);
  const { data: allEmptyLegs, isLoading } = useCollection<EmptyLeg>(emptyLegsQuery, 'emptyLegs');
  
  // Client-side filtering to show only approved legs
  const emptyLegs = allEmptyLegs?.filter(leg => leg.status === 'Approved' || leg.status === 'Published');


  return (
    <>
      <PageHeader title="Available Jet Seats" description="View and manage seat allocations for available empty leg flights." />
      <Card className="bg-card">
        <CardHeader>
          <CardTitle>All Available Flights</CardTitle>
          <CardDescription>
            A complete list of approved empty leg flights available for seat allocation.
          </CardDescription>
        </CardHeader>
        <CardContent>
            {isLoading ? <Skeleton className="h-64 w-full" /> : (
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
                                <DropdownMenuItem onSelect={() => setLegToRequest(leg)}>Request Seats</DropdownMenuItem>
                                <DropdownMenuItem disabled>View Details</DropdownMenuItem>
                                <DropdownMenuItem disabled>Share with Client</DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </TableCell>
                    </TableRow>
                ))}
                </TableBody>
            </Table>
            )}
            {(!isLoading && (!emptyLegs || emptyLegs.length === 0)) && (
                <div className="text-center py-12 border-2 border-dashed rounded-lg">
                    <p className="text-muted-foreground">There are no approved empty legs available.</p>
                </div>
            )}
        </CardContent>
      </Card>
      <RequestSeatAllocationDialog 
        emptyLeg={legToRequest}
        open={!!legToRequest}
        onOpenChange={(open) => !open && setLegToRequest(null)}
      />
    </>
  );
}
