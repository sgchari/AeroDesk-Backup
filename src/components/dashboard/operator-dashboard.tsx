
'use client';
import { PageHeader } from "@/components/dashboard/shared/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { CharterRFQ, Aircraft, Quotation, EmptyLegSeatAllocationRequest, EmptyLeg } from "@/lib/types";
import { FileText, GanttChartSquare, Plane, AlertTriangle, Users, Bell, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatsCard } from "@/components/dashboard/shared/stats-card";
import { StatsGrid } from "@/components/dashboard/shared/stats-grid";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import { useUser } from "@/hooks/use-user";
import { useCollection, useFirestore, useMemoFirebase } from "@/firebase";
import { collection, query, where, orderBy, limit } from "firebase/firestore";
import { Badge } from "@/components/ui/badge";

export function OperatorDashboard() {
  const { user, isLoading: isUserLoading } = useUser();
  const firestore = useFirestore();

  const rfqsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'charterRFQs'), limit(5));
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
  const { data: emptyLegs, isLoading: emptyLegsLoading } = useCollection<EmptyLeg>(emptyLegsQuery, user ? `emptyLegs` : undefined);

  const { data: allSeatRequests, isLoading: seatRequestsLoading } = useCollection<EmptyLegSeatAllocationRequest>(null, 'emptyLegs/all/seatAllocationRequests');

  const isLoading = isUserLoading || rfqsLoading || aircraftsLoading || emptyLegsLoading || seatRequestsLoading;

  const stats = {
    pendingRfqs: rfqs?.filter(r => r.status === 'New' || r.status === 'Bidding Open').length ?? 0,
    activeEmptyLegs: emptyLegs?.filter(l => l.status === 'Published').length ?? 0,
    aircraftAlerts: aircrafts?.filter(a => a.status === 'AOG' || a.status === 'Under Maintenance').length ?? 0,
    seatAllocationRequests: allSeatRequests?.filter(r => r.status === 'Requested').length ?? 0,
  }

  return (
    <>
      <PageHeader title="Operator Command Center" description={`Operational situational awareness for ${user?.company || 'Your Fleet'}.`} />
      
      <StatsGrid>
        <StatsCard title="Marketplace Demand" href="/dashboard/operator/rfq-marketplace" value={isLoading ? <Skeleton className="h-6 w-12" /> : stats.pendingRfqs.toString()} icon={FileText} description="RFQs open for bidding" />
        <StatsCard title="Seat Allocation Queue" href="/dashboard/operator/seat-requests" value={isLoading ? <Skeleton className="h-6 w-12" /> : stats.seatAllocationRequests.toString()} icon={Users} description="Time-critical seat leads" />
        <StatsCard title="Active Empty Legs" href="/dashboard/operator/empty-legs" value={isLoading ? <Skeleton className="h-6 w-12" /> : stats.activeEmptyLegs.toString()} icon={Plane} description="Revenue-active positions" />
        <StatsCard title="Fleet Availability Alerts" href="/dashboard/operator/fleet" value={isLoading ? <Skeleton className="h-6 w-12" /> : stats.aircraftAlerts.toString()} icon={AlertTriangle} description="AOG or maintenance events" />
      </StatsGrid>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2 bg-card">
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle>Demand Stream</CardTitle>
                    <CardDescription>Latest charter requests from the network marketplace.</CardDescription>
                </div>
                <Button asChild variant="ghost" size="sm" className="text-accent gap-2">
                    <Link href="/dashboard/operator/rfq-marketplace">Go to Marketplace <ArrowRight className="h-3 w-3" /></Link>
                </Button>
            </CardHeader>
            <CardContent>
            {isLoading ? <Skeleton className="h-40 w-full" /> : (
                <Table>
                    <TableHeader>
                    <TableRow>
                        <TableHead>Route</TableHead>
                        <TableHead>Asset Class</TableHead>
                        <TableHead>PAX</TableHead>
                        <TableHead>Status</TableHead>
                    </TableRow>
                    </TableHeader>
                    <TableBody>
                    {rfqs?.map((rfq: CharterRFQ) => (
                        <TableRow key={rfq.id}>
                            <TableCell className="font-medium">{rfq.departure} to {rfq.arrival}</TableCell>
                            <TableCell className="text-xs">{rfq.aircraftType}</TableCell>
                            <TableCell className="text-center font-bold">{rfq.pax}</TableCell>
                            <TableCell><Badge variant="outline" className="text-[9px] uppercase">{rfq.status}</Badge></TableCell>
                        </TableRow>
                    ))}
                    </TableBody>
                </Table>
            )}
            </CardContent>
        </Card>

        <Card className="bg-card">
            <CardHeader>
                <CardTitle>Asset Readiness</CardTitle>
                <CardDescription>Current state of your fleet.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {isLoading ? <Skeleton className="h-48 w-full" /> : (
                    <div className="space-y-3">
                        {aircrafts?.map(ac => (
                            <div key={ac.id} className="flex items-center justify-between p-2 rounded bg-muted/10 border border-white/5">
                                <div className="space-y-0.5">
                                    <p className="text-sm font-bold">{ac.registration}</p>
                                    <p className="text-[10px] text-muted-foreground">{ac.name}</p>
                                </div>
                                <Badge variant={ac.status === 'Available' ? 'default' : 'destructive'} className="text-[10px] h-5">
                                    {ac.status}
                                </Badge>
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
      </div>
    </>
  );
}
