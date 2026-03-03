
'use client';
import { PageHeader } from "@/components/dashboard/shared/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { CharterRFQ, Aircraft, EmptyLegSeatAllocationRequest, EmptyLeg } from "@/lib/types";
import { FileText, Plane, AlertTriangle, Users, ArrowRight, Activity, CheckCircle2, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatsCard } from "@/components/dashboard/shared/stats-card";
import { StatsGrid } from "@/components/dashboard/shared/stats-grid";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import { useUser } from "@/hooks/use-user";
import { useCollection, useFirestore, useMemoFirebase } from "@/firebase";
import { collection, query, where, limit } from "firebase/firestore";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useMemo } from "react";
import { LiveRadarDashboardCard } from "@/components/dashboard/shared/live-radar-dashboard-card";

export function OperatorDashboard() {
  const { user, isLoading: isUserLoading } = useUser();
  const firestore = useFirestore();

  const rfqsQuery = useMemoFirebase(() => {
    if (!firestore || (firestore as any)._isMock) return null;
    return query(collection(firestore, 'charterRequests'), where('status', 'in', ['Bidding Open', 'New']), limit(5));
  }, [firestore]);
  const { data: rfqs, isLoading: rfqsLoading } = useCollection<CharterRFQ>(rfqsQuery, 'charterRequests');

  const activeMissionsQuery = useMemoFirebase(() => {
    if (!firestore || !user || (firestore as any)._isMock) return null;
    return query(collection(firestore, 'charterRequests'), where('operatorId', '==', user.id));
  }, [firestore, user]);
  const { data: rawActiveMissions, isLoading: missionsLoading } = useCollection<CharterRFQ>(activeMissionsQuery, 'charterRequests');

  const activeMissions = useMemo(() => {
    return rawActiveMissions?.filter(m => 
        !['Draft', 'New', 'Bidding Open', 'Cancelled'].includes(m.status)
    ) || [];
  }, [rawActiveMissions]);

  const liveMissions = useMemo(() => {
    return activeMissions.filter(m => ['departed', 'live', 'enroute', 'arrived'].includes(m.status));
  }, [activeMissions]);

  const aircraftsQuery = useMemoFirebase(() => {
    if (!firestore || !user || (firestore as any)._isMock) return null;
    return collection(firestore, 'operators', user.id, 'aircrafts');
  }, [firestore, user]);
  const { data: aircrafts, isLoading: aircraftsLoading } = useCollection<Aircraft>(aircraftsQuery, 'aircrafts');

  const emptyLegsQuery = useMemoFirebase(() => {
    if (!firestore || !user || (firestore as any)._isMock) return null;
    return query(collection(firestore, 'emptyLegs'), where('operatorId', '==', user.id));
  }, [firestore, user]);
  const { data: emptyLegs, isLoading: emptyLegsLoading } = useCollection<EmptyLeg>(emptyLegsQuery, 'emptyLegs');

  const { data: allSeatRequests, isLoading: seatRequestsLoading } = useCollection<EmptyLegSeatAllocationRequest>(null, 'seatAllocationRequests');

  const isLoading = isUserLoading || rfqsLoading || aircraftsLoading || emptyLegsLoading || seatRequestsLoading || missionsLoading;

  return (
    <div className="space-y-6">
      <PageHeader title="Operator Command Center" description={`Operational situational awareness for ${user?.company || 'Your Fleet'}.`} />
      
      <StatsGrid>
        <StatsCard title="Marketplace Demand" href="/dashboard/operator/rfq-marketplace" value={isLoading ? <Skeleton className="h-6 w-12" /> : stats.pendingRfqs.toString()} icon={FileText} description="RFQs open for bidding" />
        <StatsCard title="Active Missions" href="#" value={isLoading ? <Skeleton className="h-6 w-12" /> : stats.activeMissions.toString()} icon={Activity} description="Missions in execution" />
        <StatsCard title="Seat Allocation Queue" href="/dashboard/operator/seat-requests" value={isLoading ? <Skeleton className="h-6 w-12" /> : (allSeatRequests?.filter(r => r.status === 'pendingApproval').length ?? 0).toString()} icon={Users} description="Time-critical seat leads" />
        <StatsCard title="Fleet Alerts" href="/dashboard/operator/fleet" value={isLoading ? <Skeleton className="h-6 w-12" /> : stats.aircraftAlerts.toString()} icon={AlertTriangle} description="AOG or maintenance events" />
      </StatsGrid>

      {liveMissions.length > 0 && (
          <LiveRadarDashboardCard missions={liveMissions} />
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="bg-card border-l-4 border-l-accent">
            <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="text-base flex items-center gap-2">
                            <Activity className="h-4 w-4 text-accent" />
                            Mission Execution Queue
                        </CardTitle>
                        <CardDescription>Missions requiring manifest review, invoicing, or operational updates.</CardDescription>
                    </div>
                    <Badge variant="outline" className="bg-accent/10 border-accent/20 text-accent font-black text-[9px] uppercase">Compliance Phase</Badge>
                </div>
            </CardHeader>
            <CardContent>
                {isLoading ? <Skeleton className="h-48 w-full" /> : (
                    <div className="space-y-3">
                        {activeMissions && activeMissions.length > 0 ? activeMissions.map(mission => (
                            <Link key={mission.id} href={`/dashboard/charter/${mission.id}`} className="block">
                                <div className="flex items-center justify-between p-3 rounded-lg bg-white/[0.03] border border-white/5 hover:bg-white/[0.06] transition-all group">
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-black text-muted-foreground uppercase font-code group-hover:text-accent transition-colors">{mission.id}</p>
                                        <p className="text-xs font-bold">{mission.departure} → {mission.arrival}</p>
                                        <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
                                            <span className="flex items-center gap-1"><Clock className="h-2.5 w-2.5" /> {new Date(mission.departureDate).toLocaleDateString()}</span>
                                            <span className="flex items-center gap-1"><Users className="h-2.5 w-2.5" /> {mission.pax} PAX</span>
                                        </div>
                                    </div>
                                    <div className="text-right space-y-2">
                                        <Badge className="bg-blue-500/20 text-blue-400 border-none h-5 text-[9px] font-black uppercase tracking-tighter">
                                            {mission.status}
                                        </Badge>
                                        <p className="text-[9px] text-accent flex items-center justify-end gap-1 font-bold uppercase tracking-widest">
                                            Open Workspace <ArrowRight className="h-2.5 w-2.5" />
                                        </p>
                                    </div>
                                </div>
                            </Link>
                        )) : (
                            <div className="text-center py-10 border border-dashed rounded-lg border-white/10 opacity-50">
                                <CheckCircle2 className="h-8 w-8 mx-auto text-muted-foreground/20 mb-2" />
                                <p className="text-xs text-muted-foreground uppercase font-black tracking-widest">No Active Executions</p>
                            </div>
                        )}
                    </div>
                )}
            </CardContent>
        </Card>

        <Card className="bg-card">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div>
                    <CardTitle className="text-base flex items-center gap-2">
                        <FileText className="h-4 w-4 text-primary" />
                        Marketplace Demand
                    </CardTitle>
                    <CardDescription>New charter requests open for operator bidding.</CardDescription>
                </div>
                <Button asChild variant="ghost" size="sm" className="text-accent gap-2 text-[10px] font-black uppercase tracking-widest">
                    <Link href="/dashboard/operator/rfq-marketplace">Marketplace <ArrowRight className="h-3 w-3" /></Link>
                </Button>
            </CardHeader>
            <CardContent>
            {isLoading ? <Skeleton className="h-48 w-full" /> : (
                <Table>
                    <TableHeader>
                    <TableRow className="border-white/5 hover:bg-transparent">
                        <TableHead className="text-[9px] uppercase font-black text-muted-foreground">Sector</TableHead>
                        <TableHead className="text-[9px] uppercase font-black text-muted-foreground">Asset Pref</TableHead>
                        <TableHead className="text-[9px] uppercase font-black text-muted-foreground text-center">PAX</TableHead>
                    </TableRow>
                    </TableHeader>
                    <TableBody>
                    {rfqs?.slice(0, 5).map((rfq: CharterRFQ) => (
                        <TableRow key={rfq.id} className="border-white/5 hover:bg-white/[0.02]">
                            <TableCell className="py-3">
                                <div className="text-xs font-bold">{rfq.departure} to {rfq.arrival}</div>
                                <div className="text-[9px] text-muted-foreground font-code uppercase">{rfq.id}</div>
                            </TableCell>
                            <TableCell className="text-[10px] font-medium text-primary uppercase">{rfq.aircraftType}</TableCell>
                            <TableCell className="text-center font-bold text-xs">{rfq.pax}</TableCell>
                        </TableRow>
                    ))}
                    </TableBody>
                </Table>
            )}
            </CardContent>
        </Card>
      </div>
    </div>
  );
}

const stats = {
    pendingRfqs: 3,
    activeMissions: 2,
    activeEmptyLegs: 1,
    aircraftAlerts: 0
};
