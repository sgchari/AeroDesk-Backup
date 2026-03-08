"use client";

import { PageHeader } from "@/components/dashboard/shared/page-header";
import { CreateRfqDialog } from "@/components/dashboard/customer/create-rfq-dialog";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import type { CharterRFQ, RfqStatus, PolicyFlag, User as AppUser, SeatAllocationRequest } from "@/lib/types";
import { 
    ShieldCheck, 
    TrendingUp, 
    Users, 
    ArrowRight, 
    Plane, 
    AlertCircle, 
    BarChart3,
    Activity,
    Armchair,
    Clock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatsCard } from "@/components/dashboard/shared/stats-card";
import { StatsGrid } from "@/components/dashboard/shared/stats-grid";
import { useUser } from "@/hooks/use-user";
import { Skeleton } from "@/components/ui/skeleton";
import { useCollection, useFirestore, useMemoFirebase } from "@/firebase";
import { collection, query, where } from "firebase/firestore";
import Link from "next/link";
import { CTDAIGovernance } from "@/components/dashboard/ctd/analytics/ctd-ai-governance";
import { 
    BarChart, 
    Bar, 
    XAxis, 
    YAxis, 
    CartesianGrid, 
    Tooltip, 
    ResponsiveContainer, 
    AreaChart, 
    Area,
    ComposedChart,
    Line
} from 'recharts';
import { useMemo } from "react";
import { LiveRadarDashboardCard } from "@/components/dashboard/shared/live-radar-dashboard-card";
import { JetSeatQuickSearch } from '@/components/jet-seat-quick-search';
import { cn } from "@/lib/utils";

const MOCK_CHART_DATA = [
    { name: 'Mon', spend: 4.2, requests: 12 },
    { name: 'Tue', spend: 3.8, requests: 15 },
    { name: 'Wed', spend: 8.5, requests: 18 },
    { name: 'Thu', spend: 12.2, requests: 22 },
    { name: 'Fri', spend: 9.1, requests: 20 },
    { name: 'Sat', spend: 2.4, requests: 8 },
    { name: 'Sun', spend: 1.8, requests: 5 },
];

const getStatusVariant = (status: RfqStatus) => {
    switch (status) {
        case 'Pending Approval': return 'warning';
        case 'Bidding Open': return 'success';
        case 'Confirmed': return 'default';
        default: return 'secondary';
    }
}

export function CTDDashboard() {
  const { user, isLoading: isUserLoading } = useUser();
  const firestore = useFirestore();

  const rfqsQuery = useMemoFirebase(() => {
    if (!firestore || (firestore as any)._isMock || !user || !user.company) return null;
    return query(collection(firestore, 'charterRequests'), where('company', '==', user.company));
  }, [firestore, user]);
  
  const { data: rfqs, isLoading: rfqsLoading } = useCollection<CharterRFQ>(rfqsQuery, 'charterRequests');

  const { data: allSeatRequests, isLoading: seatRequestsLoading } = useCollection<SeatAllocationRequest>(null, 'seatAllocationRequests');

  const policiesQuery = useMemoFirebase(() => {
    if (!firestore || (firestore as any)._isMock || !user?.ctdId) return null;
    return collection(firestore, `corporateTravelDesks/${user.ctdId}/policyFlags`);
  }, [firestore, user]);
  const { data: policies } = useCollection<PolicyFlag>(policiesQuery, `corporateTravelDesks/${user?.ctdId}/policyFlags`);

  const teamQuery = useMemoFirebase(() => {
    if (!firestore || (firestore as any)._isMock || !user?.company) return null;
    return collection(firestore, 'users');
  }, [firestore, user]);
  const { data: allUsers } = useCollection<AppUser>(teamQuery, 'users');

  const isLoading = isUserLoading || rfqsLoading || seatRequestsLoading;

  const mySeatRequests = useMemo(() => {
    return allSeatRequests?.filter(r => r.requesterId === user?.id) || [];
  }, [allSeatRequests, user?.id]);

  const liveMissions = useMemo(() => {
    return rfqs?.filter(m => ['departed', 'live', 'enroute', 'arrived'].includes(m.status)) || [];
  }, [rfqs]);

  const stats = useMemo(() => {
    const totalSpendVal = rfqs?.reduce((acc, r) => acc + (r.totalAmount || 0), 0) || 0;
    const personnelCount = allUsers?.filter(u => u.company === user?.company).length || 0;
    const activePolicies = policies?.filter(p => p.isEnforced).length || 0;

    return {
        pendingInternal: rfqs?.filter(r => r.status === 'Pending Approval').length ?? 0,
        activeBids: rfqs?.filter(r => r.status === 'Bidding Open').length ?? 0,
        confirmedTrips: rfqs?.filter(r => r.status === 'Confirmed').length ?? 0,
        totalSpend: totalSpendVal > 100000 ? `₹ ${(totalSpendVal / 100000).toFixed(1)} L` : `₹ ${totalSpendVal.toLocaleString()}`, 
        activeTravelers: personnelCount.toString(), 
        policyFlags: activePolicies.toString(),
        activeSeatLeads: mySeatRequests.length.toString()
    };
  }, [rfqs, allUsers, policies, user, mySeatRequests]);

  return (
    <div className="space-y-6">
      <PageHeader title="Governance Command View" description={`Institutional travel oversight for ${user?.company}.`}>
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
        <StatsCard title="Total Travel Spend" value={isLoading ? <Skeleton className="h-6 w-16" /> : stats.totalSpend} icon={TrendingUp} description="Actual + Committed" />
        <StatsCard title="Awaiting Sign-off" href="/dashboard/ctd/approvals" value={isLoading ? <Skeleton className="h-6 w-8" /> : stats.pendingInternal.toString()} icon={ShieldCheck} description="Internal workflow queue" />
        <StatsCard title="Jet Seat Leads" href="/dashboard/ctd/seat-requests" value={isLoading ? <Skeleton className="h-6 w-8" /> : stats.activeSeatLeads} icon={Armchair} description="Organizational seat blocks" />
        <StatsCard title="Policy Deviations" href="/dashboard/ctd/policies" value={isLoading ? <Skeleton className="h-6 w-8" /> : stats.policyFlags} icon={AlertCircle} description="Workflow exceptions flagged" />
      </StatsGrid>

      {liveMissions.length > 0 && (
          <LiveRadarDashboardCard missions={liveMissions} />
      )}

      {mySeatRequests.length > 0 && (
          <section className="space-y-6 mt-10">
              <div className="flex items-center justify-between px-1">
                  <h3 className="text-lg font-black uppercase tracking-widest text-white flex items-center gap-2">
                      <Armchair className="h-5 w-5 text-accent" />
                      Jet Seat Exchange leads
                  </h3>
                  <Badge variant="outline" className="border-white/10 text-[10px] font-bold">{mySeatRequests.length} ACTIVE</Badge>
              </div>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {mySeatRequests.slice(0, 3).map(req => (
                      <Card key={req.id} className="bg-card border-white/5 hover:border-accent/30 transition-all overflow-hidden group">
                          <CardHeader className="pb-3 pt-5">
                              <div className="flex items-center justify-between mb-2">
                                  <Badge variant="outline" className="text-[8px] uppercase tracking-widest font-black border-accent/20 text-accent">LEAD ID: {req.requestId}</Badge>
                                  <Badge className="bg-blue-500/20 text-blue-400 border-none h-5 text-[8px] font-black uppercase px-2">
                                      {req.requestStatus.replace(/_/g, ' ')}
                                  </Badge>
                              </div>
                              <CardTitle className="text-base group-hover:text-accent transition-colors">
                                  {req.origin} → {req.destination}
                              </CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-3 pb-5">
                              <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                                  <div className="flex items-center gap-2">
                                      <Users className="h-3.5 w-3.5 text-accent/60" />
                                      <span>{req.seatsRequested} Seats Allocated</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                      <Clock className="h-3.5 w-3.5 text-accent/60" />
                                      <span>{new Date(req.createdAt).toLocaleDateString()}</span>
                                  </div>
                              </div>
                              <Button asChild variant="link" className="p-0 h-auto text-[10px] font-black uppercase tracking-widest text-accent group-hover:text-white transition-colors">
                                  <Link href={`/dashboard/customer/seat-execution/${req.id}`}>
                                      Audit Progress <ArrowRight className="h-3 w-3 ml-1.5 transition-transform group-hover:translate-x-1" />
                                  </Link>
                              </Button>
                          </CardContent>
                      </Card>
                  ))}
              </div>
          </section>
      )}

      <CTDAIGovernance />

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2 bg-card overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div>
                    <CardTitle className="flex items-center gap-2">
                        <Activity className="h-4 w-4 text-primary" />
                        Spend & Demand Intensity
                    </CardTitle>
                    <CardDescription>Visualizing spend (₹ Lakhs) against travel inquiry volume.</CardDescription>
                </div>
                <Badge variant="outline" className="font-code text-[10px] text-primary border-primary/20">LIVE MARKET SIGNAL</Badge>
            </CardHeader>
            <CardContent className="h-[350px] pt-4">
                <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={MOCK_CHART_DATA}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                        <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} axisLine={false} tickLine={false} />
                        <YAxis stroke="#94a3b8" fontSize={10} axisLine={false} tickLine={false} tickFormatter={(val) => `₹${val}L`} />
                        <Tooltip 
                            contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px' }}
                            itemStyle={{ fontSize: '10px', fontWeight: 'bold' }}
                        />
                        <Bar dataKey="spend" name="Corporate Spend" fill="#0EA5E9" radius={[4, 4, 0, 0]} barSize={30} />
                        <Line type="monotone" dataKey="requests" name="Travel Demand" stroke="#EEDC5B" strokeWidth={2} dot={{ fill: '#EEDC5B' }} />
                    </ComposedChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>

        <Card className="bg-card">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Plane className="h-4 w-4 text-accent" />
                    Mission Readiness
                </CardTitle>
                <CardDescription>Movement status for active missions.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="p-4 rounded-xl bg-accent/5 border border-accent/20 space-y-3 group hover:bg-accent/10 transition-colors">
                    <div className="flex items-center justify-between gap-2">
                        <p className="text-[10px] font-black text-accent uppercase tracking-widest truncate">MISSION: RFQ-CORP-002</p>
                        <Badge variant="default" className="h-5 text-[8px] bg-green-500 font-black shrink-0 whitespace-nowrap px-2">EN ROUTE</Badge>
                    </div>
                    <div className="space-y-1">
                        <div className="flex items-center justify-between text-xs font-medium">
                            <span>DEL → LHR</span>
                            <span className="text-muted-foreground">5 Pax • Mid-size Jet</span>
                        </div>
                        <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                            <div className="h-full bg-accent w-[65%] shadow-[0_0_8px_hsl(var(--accent))]" />
                        </div>
                    </div>
                </div>
                
                <div className="p-4 rounded-xl bg-muted/10 border border-white/5 space-y-3 opacity-60">
                    <div className="flex items-center justify-between gap-2">
                        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest truncate">MISSION: RFQ-CONF-002</p>
                        <Badge variant="outline" className="h-5 text-[8px] font-black shrink-0 whitespace-nowrap px-2">SCHEDULED</Badge>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                        <span>BLR → GOI</span>
                        <span className="text-[10px]">Aug 15, 11:30</span>
                    </div>
                </div>

                <Button asChild variant="outline" className="w-full h-9 text-[10px] font-bold uppercase tracking-widest border-white/5 hover:bg-white/5 mt-2">
                    <Link href="/dashboard/ctd/requests">Review Full Queue</Link>
                </Button>
            </CardContent>
        </Card>
      </div>

      <Card className="bg-card">
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle className="flex items-center gap-2">
                        <BarChart3 className="h-4 w-4 text-primary" />
                        Enterprise Demand Log
                    </CardTitle>
                    <CardDescription>Recent travel inquiries and internal status.</CardDescription>
                </div>
                <Button asChild variant="ghost" size="sm" className="text-accent gap-2 text-[10px] font-black uppercase tracking-widest">
                    <Link href="/dashboard/ctd/requests">View Full Audit <ArrowRight className="h-3 w-3" /></Link>
                </Button>
            </CardHeader>
            <CardContent>
                {isLoading ? <Skeleton className="h-48 w-full" /> : (
                    <Table>
                        <TableHeader>
                            <TableRow className="border-white/5 hover:bg-transparent">
                                <TableHead className="text-[10px] uppercase font-black text-muted-foreground">Requester</TableHead>
                                <TableHead className="text-[10px] uppercase font-black text-muted-foreground">Sector</TableHead>
                                <TableHead className="text-[10px] uppercase font-black text-muted-foreground">Cost Center</TableHead>
                                <TableHead className="text-[10px] uppercase font-black text-muted-foreground">Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {rfqs?.slice(0, 5).map((rfq) => (
                                <TableRow key={rfq.id} className="border-white/5 hover:bg-white/[0.02] group">
                                    <TableCell className="py-4">
                                        <div className="font-bold text-xs group-hover:text-primary transition-colors">{rfq.customerName}</div>
                                        <div className="text-[9px] text-muted-foreground font-code uppercase">{rfq.id}</div>
                                    </TableCell>
                                    <TableCell className="text-xs">{rfq.departure} → {rfq.arrival}</TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className="font-code text-[9px] uppercase text-muted-foreground border-white/10 group-hover:border-accent/30">
                                            {rfq.costCenter || 'EXECUTIVE'}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={getStatusVariant(rfq.status)} className="text-[9px] px-2 h-5 font-black uppercase tracking-tighter">
                                            {rfq.status}
                                        </Badge>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
            </CardContent>
        </Card>
    </div>
  );
}
