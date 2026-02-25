
'use client';
import { PageHeader } from "@/components/dashboard/shared/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { EmptyLeg, EmptyLegSeatAllocationRequest, CharterRFQ } from "@/lib/types";
import { Plane, Users, Calendar, GanttChartSquare, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatsCard } from "@/components/dashboard/shared/stats-card";
import { StatsGrid } from "@/components/dashboard/shared/stats-grid";
import { Skeleton } from "@/components/ui/skeleton";
import { useCollection, useFirestore, useMemoFirebase } from "@/firebase";
import { collection, query, where, collectionGroup } from "firebase/firestore";
import Link from "next/link";
import { useUser } from "@/hooks/use-user";

export function TravelAgencyDashboard() {
  const firestore = useFirestore();
  const { user, isLoading: isUserLoading } = useUser();

  const emptyLegsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'emptyLegs'), where('status', 'in', ['Approved', 'Published']));
  }, [firestore]);
  const { data: emptyLegs, isLoading: emptyLegsLoading } = useCollection<EmptyLeg>(emptyLegsQuery, 'emptyLegs');

  const seatRequestsQuery = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return query(collectionGroup(firestore, 'seatAllocationRequests'), where('requesterExternalAuthId', '==', user.id), where('status', '==', 'Requested'));
  }, [firestore, user]);
  const { data: seatRequests, isLoading: seatRequestsLoading } = useCollection<EmptyLegSeatAllocationRequest>(seatRequestsQuery, 'emptyLegs/all/seatAllocationRequests');
  
  const charterRequestsQuery = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return query(collection(firestore, 'charterRFQs'), where('requesterExternalAuthId', '==', user.id), where('status', '==', 'Bidding Open'));
  }, [firestore, user]);
  const { data: charterRequests, isLoading: charterRequestsLoading } = useCollection<CharterRFQ>(charterRequestsQuery, 'charterRFQs');

  const isLoading = isUserLoading || emptyLegsLoading || seatRequestsLoading || charterRequestsLoading;

  const stats = {
    availableSeats: emptyLegs?.length ?? 0,
    pendingSeatRequests: seatRequests?.filter(r => r.requesterExternalAuthId === user?.id).length ?? 0,
    openCharterRequests: charterRequests?.filter(r => r.requesterExternalAuthId === user?.id).length ?? 0,
  }

  return (
    <>
      <PageHeader title="Sales Command View" description="Immediate commercial visibility for your travel agency." />
      
      <StatsGrid>
        <StatsCard title="Available Empty Legs" href="/dashboard/travel-agency/available-seats" value={isLoading ? <Skeleton className="h-6 w-12" /> : stats.availableSeats.toString()} icon={Plane} description="Flights with allocatable seats" />
        <StatsCard title="Pending Seat Requests" href="/dashboard/travel-agency/seat-requests" value={isLoading ? <Skeleton className="h-6 w-12" /> : stats.pendingSeatRequests.toString()} icon={Users} description="Awaiting operator confirmation" />
        <StatsCard title="Open Charter Requests" href="/dashboard/travel-agency/charter-requests" value={isLoading ? <Skeleton className="h-6 w-12" /> : stats.openCharterRequests.toString()} icon={FileText} description="Your active client RFQs" />
        <StatsCard title="Active Client Movements" value="0" icon={GanttChartSquare} description="Confirmed upcoming trips" />
      </StatsGrid>

      <Card className="bg-card">
        <CardHeader className="flex flex-row items-center justify-between">
            <div>
                <CardTitle>New Empty Leg Opportunities</CardTitle>
                <CardDescription>
                    The latest empty leg flights available for seat allocation.
                </CardDescription>
            </div>
             <Button asChild variant="outline">
                <Link href="/dashboard/travel-agency/available-seats">View All</Link>
            </Button>
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
                </TableRow>
                </TableHeader>
                <TableBody>
                {emptyLegs?.slice(0, 5).map((leg: EmptyLeg) => (
                    <TableRow key={leg.id}>
                        <TableCell className="font-medium font-code">{leg.id}</TableCell>
                        <TableCell>{leg.departure} to {leg.arrival}</TableCell>
                        <TableCell>{new Date(leg.departureTime).toLocaleString()}</TableCell>
                        <TableCell className="font-bold text-center">{leg.availableSeats}</TableCell>
                    </TableRow>
                ))}
                </TableBody>
            </Table>
            )}
             {(!isLoading && (!emptyLegs || emptyLegs.length === 0)) && (
                <div className="text-center py-12 border-2 border-dashed rounded-lg">
                    <p className="text-muted-foreground">No new empty leg opportunities found.</p>
                </div>
            )}
        </CardContent>
      </Card>
    </>
  );
}
