'use client';
import { PageHeader } from "@/components/dashboard/shared/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { EmptyLeg, SeatAllocationRequest, CharterRFQ, CommissionLedgerEntry } from "@/lib/types";
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
import { cn } from "@/lib/utils";
import { JetSeatQuickSearch } from '@/components/jet-seat-quick-search';

export function TravelAgencyDashboard() {
  const firestore = useFirestore();
  const { user, isLoading: isUserLoading } = useUser();

  const emptyLegsQuery = useMemoFirebase(() => {
    if (!firestore || (firestore as any)._isMock) return null;
    return query(collection(firestore, 'emptyLegs'), where('status', 'in', ['Approved', 'Published', 'live']));
  }, [firestore]);
  const { data: emptyLegs, isLoading: emptyLegsLoading } = useCollection<EmptyLeg>(emptyLegsQuery, 'emptyLegs');

  const { data: seatRequests, isLoading: seatRequestsLoading } = useCollection<SeatAllocationRequest>(null, 'seatAllocationRequests');
  
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
    const agencySeatRequests = seatRequests?.filter(r => r.requesterId === user?.id) || [];
    
    return {
        availableSeats: emptyLegs?.length ?? 0,
        pendingSeatRequests: agencySeatRequests.filter(r => r.requestStatus === 'PENDING_OPERATOR_APPROVAL' || r.requestStatus === 'REQUEST_SUBMITTED').length,
        openCharterRequests: charterRequests?.filter(r => ['Bidding Open', 'rfqSubmitted'].includes(r.status)).length ?? 0,
        activeClientMovements: (charterRequests?.filter(r => ['Confirmed', 'boarding', 'departed', 'arrived'].includes(r.status)).length ?? 0) + (agencySeatRequests.filter(r => r.requestStatus === 'CONFIRMED' || r.requestStatus === 'COMPLETED').length),
        accruedEarnings: accrued > 100000 ? `₹ ${(accrued / 100000).toFixed(1)} L` : `₹ ${accrued.toLocaleString()}`
    };
  }, [emptyLegs, seatRequests, charterRequests, ledger, user]);

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Commercial Command View" 
        description={`Immediate business situational awareness for ${user?.company || 'Your Agency'}.`}
      >
        <CreateRfqDialog />
      </PageHeader>

      <div className="mb-10">
          <div className="text-left mb-6 px-1">
              <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-accent/60 mb-2">JetSeat Exchange</h2>
              <p className="text-xl font-bold text-white uppercase tracking-tight">Instant Seat Availability Search</p>
          </div>
          <JetSeatQuickSearch />
      </div>
      
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
        <Card className="bg-card border-white/5">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div>
                    <CardTitle className="text-base font-bold">Marketplace Discoveries</CardTitle>
                    <CardDescription className="text-xs">Latest approved empty leg inventory.</CardDescription>
                </div>
                <Button asChild variant="ghost" size="sm" className="text-accent gap-2 text-[10px] font-black uppercase tracking-widest">
                    <Link href="/dashboard/travel-agency/available-seats">Explore Feed <ArrowRight className="h-3 w-3" /></Link>
                </Button>
            </CardHeader>
            <CardContent>
                {isLoading ? <Skeleton className="h-40 w-full" /> : (
                <Table>
                    <TableHeader>
                    <TableRow className="border-white/5 hover:bg-transparent">
                        <TableHead className="text-[10px] uppercase font-black">Route</TableHead>
                        <TableHead className="text-[10px] uppercase font-black">Asset</TableHead>
                        <TableHead className="text-[10px] uppercase font-black text-center">Seats</TableHead>
                    </TableRow>
                    </TableHeader>
                    <TableBody>
                    {emptyLegs?.slice(0, 5).map((leg: EmptyLeg) => (
                        <TableRow key={leg.id} className="border-white/5 hover:bg-white/[0.02]">
                            <TableCell className="py-3 font-medium text-xs text-white">{leg.departure} - {leg.arrival}</TableCell>
                            <TableCell className="text-[10px] text-muted-foreground uppercase">{leg.aircraftName || 'Jet'}</TableCell>
                            <TableCell className="font-black text-center text-xs text-accent">{leg.availableSeats}</TableCell>
                        </TableRow>
                    ))}
                    </TableBody>
                </Table>
                )}
            </CardContent>
        </Card>

        <Card className="bg-card border-white/5">
            <CardHeader className="pb-2">
                <CardTitle className="text-base font-bold">Operational Signal</CardTitle>
                <CardDescription className="text-xs">Status of your active commercial leads.</CardDescription>
            </CardHeader>
            <CardContent>
                {isLoading ? <Skeleton className="h-48 w-full" /> : (
                    <div className="space-y-3">
                        {seatRequests && seatRequests.filter(r => r.requesterId === user?.id).length > 0 ? seatRequests.filter(r => r.requesterId === user?.id).slice(0, 4).map(req => (
                            <div key={req.id} className="flex items-center justify-between p-3 rounded-lg bg-white/[0.03] border border-white/5 hover:bg-white/[0.06] transition-all">
                                <div className="space-y-1">
                                    <p className="text-xs font-bold text-white">{req.requestId}</p>
                                    <p className="text-[9px] text-muted-foreground uppercase font-code tracking-tighter">{req.origin} → {req.destination}</p>
                                </div>
                                <Badge variant="outline" className={cn(
                                    "text-[9px] h-5 font-black uppercase border-none px-2",
                                    req.requestStatus === 'PENDING_OPERATOR_APPROVAL' || req.requestStatus === 'REQUEST_SUBMITTED' ? "bg-amber-500/20 text-amber-500" : "bg-emerald-500/20 text-emerald-500"
                                )}>
                                    {req.requestStatus.replace(/_/g, ' ')}
                                </Badge>
                            </div>
                        )) : (
                            <div className="text-center py-10 opacity-50">
                                <p className="text-xs text-muted-foreground uppercase font-black tracking-widest">No active leads identified</p>
                            </div>
                        )}
                    </div>
                )}
            </CardContent>
        </Card>
      </div>
    </div>
  );
}