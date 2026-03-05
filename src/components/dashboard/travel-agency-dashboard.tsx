
'use client';
import { PageHeader } from "@/components/dashboard/shared/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { EmptyLeg, EmptyLegSeatAllocationRequest, CharterRFQ, CommissionLedgerEntry } from "@/lib/types";
import { Plane, Users, Calendar, GanttChartSquare, FileText, ArrowRight, Coins } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatsCard } from "@/components/dashboard/shared/stats-card";
import { StatsGrid } from "@/components/dashboard/shared/stats-grid";
import { Skeleton } from "@/components/ui/skeleton";
import { useCollection, useFirestore, useMemoFirebase } from "@/firebase";
import { collection, query, where } from "firebase/firestore";
import Link from "next/link";
import { useUser } from "@/hooks/use-user";
import { Badge } from "@/components/ui/badge";
import { CreateRfqDialog } from "@/components/dashboard/customer/create-rfq-dialog";
import { useMemo } from "react";
import { LiveRadarDashboardCard } from "@/components/dashboard/shared/live-radar-dashboard-card";

export function TravelAgencyDashboard() {
  const firestore = useFirestore();
  const { user, isLoading: isUserLoading } = useUser();

  const emptyLegsQuery = useMemoFirebase(() => {
    if (!firestore || (firestore as any)._isMock) return null;
    return query(collection(firestore, 'emptyLegs'), where('status', 'in', ['Approved', 'Published', 'live']));
  }, [firestore]);
  const { data: emptyLegs, isLoading: emptyLegsLoading } = useCollection<EmptyLeg>(emptyLegsQuery, 'emptyLegs');

  const seatRequestsQuery = useMemoFirebase(() => {
    if (!firestore || (firestore as any)._isMock || !user) return null;
    return query(collection(firestore, 'seatAllocationRequests'), where('requesterExternalAuthId', '==', user.id));
  }, [firestore, user]);
  const { data: seatRequests, isLoading: seatRequestsLoading } = useCollection<EmptyLegSeatAllocationRequest>(seatRequestsQuery, 'seatAllocationRequests');
  
  const charterRequestsQuery = useMemoFirebase(() => {
    if (!firestore || (firestore as any)._isMock || !user) return null;
    return query(collection(firestore, 'charterRequests'), where('requesterExternalAuthId', '==', user.id));
  }, [firestore, user]);
  const { data: charterRequests, isLoading: charterRequestsLoading } = useCollection<CharterRFQ>(charterRequestsQuery, 'charterRequests');

  const ledgerQuery = useMemoFirebase(() => {
    if (!firestore || (firestore as any)._isMock || !user) return null;
    return query(collection(firestore, 'commissionLedger'), where('entityId', '==', user.id));
  }, [firestore, user]);
  const { data: ledger } = useCollection<CommissionLedgerEntry>(ledgerQuery, 'commissionLedger');

  const isLoading = isUserLoading || emptyLegsLoading || seatRequestsLoading || charterRequestsLoading;

  const liveMissions = useMemo(() => {
    return charterRequests?.filter(m => ['departed', 'live', 'enroute', 'arrived'].includes(m.status)) || [];
  }, [charterRequests]);

  const stats = useMemo(() => {
    const accrued = ledger?.filter(l => l.status === 'pending').reduce((acc, l) => acc + l.agencyCommissionAmount, 0) || 0;
    
    return {
        availableSeats: emptyLegs?.length ?? 0,
        pendingSeatRequests: seatRequests?.filter(r => r.status === 'Requested').length ?? 0,
        openCharterRequests: charterRequests?.filter(r => ['Bidding Open', 'rfqSubmitted'].includes(r.status)).length ?? 0,
        activeClientMovements: (charterRequests?.filter(r => ['Confirmed', 'boarding', 'departed', 'arrived'].includes(r.status)).length ?? 0) + (seatRequests?.filter(r => r.status === 'Approved').length ?? 0),
        accruedEarnings: accrued > 100000 ? `₹ ${(accrued / 100000).toFixed(1)} L` : `₹ ${accrued.toLocaleString()}`
    };
  }, [emptyLegs, seatRequests, charterRequests, ledger]);

  return (
    <>
      <PageHeader 
        title="Commercial Command View" 
        description={`Immediate business situational awareness for ${user?.company || 'Your Agency'}.`}
      >
        <CreateRfqDialog />
      </PageHeader>
      
      <StatsGrid>
        <StatsCard title="Inventory Feed" href="/dashboard/travel-agency/available-seats" value={isLoading ? <Skeleton className="h-6 w-12" /> : stats.availableSeats.toString()} icon={Plane} description="Approved empty legs" />
        <StatsCard title="Active Seat Leads" href="/dashboard/travel-agency/seat-requests" value={isLoading ? <Skeleton className="h-6 w-12" /> : stats.pendingSeatRequests.toString()} icon={Users} description="Awaiting operator confirmation" />
        <StatsCard title="Accrued Earnings" href="/dashboard/travel-agency/revenue-share" value={isLoading ? <Skeleton className="h-6 w-20" /> : stats.accruedEarnings} icon={Coins} description="Pending settlement" />
        <StatsCard title="Confirmed Itineraries" href="/dashboard/travel-agency/charter-requests" value={isLoading ? <Skeleton className="h-6 w-12" /> : stats.activeClientMovements.toString()} icon={GanttChartSquare} description="Upcoming movements" />
      </StatsGrid>

      {liveMissions.length > 0 && (
          <LiveRadarDashboardCard missions={liveMissions} />
      )}

      <div className="grid gap-6 lg:grid-cols-2 mt-6">
        <Card className="bg-card">
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle>Marketplace Discoveries</CardTitle>
                    <CardDescription>Latest approved empty leg inventory.</CardDescription>
                </div>
                <Button asChild variant="ghost" size="sm" className="text-accent gap-2">
                    <Link href="/dashboard/travel-agency/available-seats">Explore Feed <ArrowRight className="h-3 w-3" /></Link>
                </Button>
            </CardHeader>
            <CardContent>
                {isLoading ? <Skeleton className="h-40 w-full" /> : (
                <Table>
                    <TableHeader>
                    <TableRow>
                        <TableHead>Route</TableHead>
                        <TableHead>Asset</TableHead>
                        <TableHead className="text-center">Seats</TableHead>
                    </TableRow>
                    </TableHeader>
                    <TableBody>
                    {emptyLegs?.slice(0, 5).map((leg: EmptyLeg) => (
                        <TableRow key={leg.id}>
                            <TableCell className="font-medium">{leg.departure} - {leg.arrival}</TableCell>
                            <TableCell className="text-xs">{leg.aircraftName || 'Jet'}</TableCell>
                            <TableCell className="font-bold text-center">{leg.availableSeats}</TableCell>
                        </TableRow>
                    ))}
                    </TableBody>
                </Table>
                )}
            </CardContent>
        </Card>

        <Card className="bg-card">
            <CardHeader>
                <CardTitle>Operational Signal</CardTitle>
                <CardDescription>Status of your active commercial leads.</CardDescription>
            </CardHeader>
            <CardContent>
                {isLoading ? <Skeleton className="h-48 w-full" /> : (
                    <div className="space-y-4">
                        {seatRequests?.slice(0, 3).map(req => (
                            <div key={req.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/10 border border-white/5">
                                <div className="space-y-1">
                                    <p className="text-xs font-bold text-accent">{req.clientReference || 'Standard Client'}</p>
                                    <p className="text-[10px] text-muted-foreground uppercase font-code">{req.emptyLegId}</p>
                                </div>
                                <Badge variant={req.status === 'Requested' ? 'warning' : 'success'} className="text-[10px] h-5">
                                    {req.status}
                                </Badge>
                            </div>
                        ))}
                        {(!isLoading && (!seatRequests || seatRequests.length === 0)) && (
                            <div className="text-center py-10">
                                <p className="text-xs text-muted-foreground">No active leads currently tracked.</p>
                            </div>
                        )}
                    </div>
                )}
            </CardContent>
        </Card>
      </div>
    </>
  );
}
