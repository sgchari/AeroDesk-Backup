
'use client';
import { PageHeader } from "@/components/dashboard/shared/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { CharterRFQ, Aircraft, Quotation, EmptyLegSeatAllocationRequest } from "@/lib/types";
import { FileText, GanttChartSquare, Plane, AlertTriangle, Users, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatsCard } from "@/components/dashboard/shared/stats-card";
import { StatsGrid } from "@/components/dashboard/shared/stats-grid";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import { useUser } from "@/hooks/use-user";
import { useCollection, useFirestore, useMemoFirebase } from "@/firebase";
import { collection, query, where, orderBy, limit } from "firebase/firestore";
import { Badge } from "../ui/badge";

export function OperatorDashboard() {
  const { user, isLoading: isUserLoading } = useUser();
  const firestore = useFirestore();

  const rfqsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'charterRFQs'));
  }, [firestore]);
  const { data: rfqs, isLoading: rfqsLoading } = useCollection<CharterRFQ>(rfqsQuery, 'charterRFQs');

  const aircraftsQuery = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return collection(firestore, 'operators', user.id, 'aircrafts');
  }, [firestore, user]);
  const { data: aircrafts, isLoading: aircraftsLoading } = useCollection<Aircraft>(aircraftsQuery, user ? `operators/${user.id}/aircrafts` : undefined);

  const emptyLegsQuery = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return query(collection(firestore, 'emptyLegs'), where('operatorId', '==', user.id));
  }, [firestore, user]);
  const { data: emptyLegs, isLoading: emptyLegsLoading } = useCollection<Aircraft>(emptyLegsQuery, user ? `emptyLegs` : undefined);


  // This is a workaround for demo mode without collectionGroup queries.
  const { data: allQuotations, isLoading: quotationsLoading } = useCollection<Quotation>(null, 'charterRFQs/all/quotations');
  const { data: allSeatRequests, isLoading: seatRequestsLoading } = useCollection<EmptyLegSeatAllocationRequest>(null, 'emptyLegs/all/seatAllocationRequests');

  const isLoading = isUserLoading || rfqsLoading || aircraftsLoading || quotationsLoading || emptyLegsLoading || seatRequestsLoading;

  const stats = {
    pendingRfqs: rfqs?.filter(r => r.status === 'New' || r.status === 'Bidding Open').length ?? 0,
    activeQuotations: allQuotations?.filter(q => q.operatorId === user?.id && q.status === 'Submitted').length ?? 0,
    upcomingEmptyLegs: emptyLegs?.filter(l => l.status === 'Published').length ?? 0,
    aircraftAlerts: aircrafts?.filter(a => a.status === 'AOG' || a.status === 'Under Maintenance').length ?? 0,
    seatAllocationRequests: allSeatRequests?.filter(r => r.status === 'Requested').length ?? 0,
    notifications: 0,
  }

  const activityStream = rfqs?.slice(0, 5) ?? [];

  return (
    <>
      <PageHeader title="Operator Command Center" description="Immediate situational awareness of your charter operations." />
      
      <StatsGrid>
        <StatsCard title="Pending Charter Requests" value={isLoading ? <Skeleton className="h-6 w-12" /> : stats.pendingRfqs.toString()} icon={FileText} description="RFQs needing a quotation" />
        <StatsCard title="Active Quotations" value={isLoading ? <Skeleton className="h-6 w-12" /> : stats.activeQuotations.toString()} icon={GanttChartSquare} description="Your submitted quotes" />
        <StatsCard title="Upcoming Empty Legs" value={isLoading ? <Skeleton className="h-6 w-12" /> : stats.upcomingEmptyLegs.toString()} icon={Plane} description="Published empty leg flights" />
        <StatsCard title="Aircraft Availability Alerts" value={isLoading ? <Skeleton className="h-6 w-12" /> : stats.aircraftAlerts.toString()} icon={AlertTriangle} description="AOG or maintenance issues" />
        <StatsCard title="Seat Allocation Requests" value={isLoading ? <Skeleton className="h-6 w-12" /> : stats.seatAllocationRequests.toString()} icon={Users} description="Requests for empty leg seats" />
        <StatsCard title="Operational Notifications" value={isLoading ? <Skeleton className="h-6 w-12" /> : stats.notifications.toString()} icon={Bell} description="System & compliance flags" />
      </StatsGrid>

      <Card className="bg-card">
        <CardHeader className="flex flex-row items-center justify-between">
            <div>
                <CardTitle>Recent Activity Stream</CardTitle>
                <CardDescription>
                    Chronological log of the latest platform events.
                </CardDescription>
            </div>
            <Button asChild variant="outline">
                <Link href="/dashboard/operator/rfq-marketplace">View All RFQs</Link>
            </Button>
        </CardHeader>
        <CardContent>
           {isLoading ? <Skeleton className="h-40 w-full" /> : (
            <Table>
                <TableHeader>
                <TableRow>
                    <TableHead>Request ID</TableHead>
                    <TableHead>Route</TableHead>
                    <TableHead>PAX</TableHead>
                    <TableHead>Aircraft Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Received</TableHead>
                </TableRow>
                </TableHeader>
                <TableBody>
                {activityStream.map((rfq: CharterRFQ) => (
                    <TableRow key={rfq.id}>
                        <TableCell className="font-medium font-code">{rfq.id}</TableCell>
                        <TableCell>{rfq.departure} to {rfq.arrival}</TableCell>
                        <TableCell>{rfq.pax}</TableCell>
                        <TableCell>{rfq.aircraftType}</TableCell>
                        <TableCell><Badge variant={rfq.status === 'New' || rfq.status === 'Bidding Open' ? 'default' : 'secondary'}>{rfq.status}</Badge></TableCell>
                        <TableCell>{new Date(rfq.createdAt).toLocaleDateString()}</TableCell>
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
