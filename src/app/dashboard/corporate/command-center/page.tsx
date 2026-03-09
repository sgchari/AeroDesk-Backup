'use client';

import React from 'react';
import { PageHeader } from "@/components/dashboard/shared/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StatsGrid } from "@/components/dashboard/shared/stats-grid";
import { StatsCard } from "@/components/dashboard/shared/stats-card";
import { useCollection, useUser } from "@/firebase";
import type { EmployeeTravelRequest, CorporateOrganization, CostCenter, CharterRFQ, SeatAllocationRequest } from "@/lib/types";
import { 
    LayoutDashboard, 
    Plane, 
    Armchair, 
    DollarSign, 
    Activity, 
    ArrowRight, 
    ShieldCheck, 
    Target,
    Zap,
    MapPin,
    History
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { 
    ResponsiveContainer, 
    AreaChart, 
    Area, 
    XAxis, 
    YAxis, 
    Tooltip, 
    CartesianGrid,
    BarChart,
    Bar,
    Cell
} from 'recharts';
import { cn } from "@/lib/utils";
import dynamic from 'next/dynamic';

const CorporateTravelMap = dynamic(() => import('@/components/dashboard/admin/occ/occ-network-map').then(mod => mod.OCCNetworkMap), { 
    ssr: false,
    loading: () => <div className="w-full h-full bg-slate-900/50 animate-pulse rounded-3xl border border-white/5 flex items-center justify-center">
        <p className="text-[10px] uppercase font-black tracking-widest text-muted-foreground">Initializing Radar Link...</p>
    </div>
});

const MOCK_SPEND_DATA = [
    { day: 'Mon', spend: 4.2 },
    { day: 'Tue', spend: 3.8 },
    { day: 'Wed', spend: 8.5 },
    { day: 'Thu', spend: 12.2 },
    { day: 'Fri', spend: 9.1 },
    { day: 'Sat', spend: 2.4 },
    { day: 'Sun', spend: 1.8 },
];

export default function CorporateCommandCenterPage() {
    const { user } = useUser();
    
    const { data: orgs } = useCollection<CorporateOrganization>(null, 'corporateOrganizations');
    const { data: centers } = useCollection<CostCenter>(null, 'costCenters');
    const { data: requests, isLoading: requestsLoading } = useCollection<EmployeeTravelRequest>(null, 'employeeTravelRequests');
    const { data: charters } = useCollection<CharterRFQ>(null, 'charterRequests');
    const { data: seats } = useCollection<SeatAllocationRequest>(null, 'seatAllocationRequests');

    const myOrg = orgs?.find(o => o.corporateId === user?.corporateId) || orgs?.[0];
    const myRequests = requests?.filter(r => r.corporateId === user?.corporateId) || [];

    const stats = {
        activeRequests: myRequests.filter(r => !['TRIP_COMPLETED', 'REJECTED'].includes(r.requestStatus)).length,
        chartersMTD: myRequests.filter(r => r.travelType === 'CHARTER').length,
        seatsBooked: myRequests.filter(r => r.travelType === 'JET_SEATS' && r.requestStatus === 'BOOKING_CONFIRMED').length,
        totalSpend: myOrg?.usedBudget || 0,
        annualBudget: myOrg?.annualAviationBudget || 100000000,
    };

    return (
        <div className="space-y-6">
            <PageHeader 
                title="Corporate Aviation Command Center" 
                description={`Institutional travel oversight and mission control for ${myOrg?.companyName || 'ABC Corporation'}.`}
            />

            <StatsGrid>
                <StatsCard title="Active Requests" value={requestsLoading ? <Skeleton className="h-6 w-8" /> : stats.activeRequests.toString()} icon={Activity} description="In coordination workflow" />
                <StatsCard title="Charters (MTD)" value={stats.chartersMTD.toString()} icon={Plane} description="Authorized missions" />
                <StatsCard title="Jet Seats Booked" value={stats.seatsBooked.toString()} icon={Armchair} description="Individual allocations" />
                <StatsCard title="Budget Consumed" value={`₹ ${(stats.totalSpend / 10000000).toFixed(1)} Cr`} icon={DollarSign} description={`of ₹ ${(stats.annualBudget / 10000000).toFixed(1)} Cr Total`} />
            </StatsGrid>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    {/* MISSION RADAR */}
                    <Card className="bg-card h-[500px] border-white/5 relative overflow-hidden">
                        <CardHeader className="absolute top-0 left-0 right-0 z-20 bg-gradient-to-b from-black/80 to-transparent p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle className="text-sm font-black uppercase tracking-widest text-emerald-400 flex items-center gap-2">
                                        <Target className="h-4 w-4" /> Live Institutional Radar
                                    </CardTitle>
                                    <CardDescription className="text-[10px] uppercase font-bold text-white/60">Tracking active corporate missions across metro hubs.</CardDescription>
                                </div>
                                <Badge variant="outline" className="bg-emerald-500/10 text-emerald-500 border-emerald-500/30 text-[9px] font-black h-6">ENCRYPTED LINK ACTIVE</Badge>
                            </div>
                        </CardHeader>
                        <CorporateTravelMap />
                    </Card>

                    {/* REVENUE INTENSITY */}
                    <Card className="bg-card">
                        <CardHeader>
                            <CardTitle className="text-base flex items-center gap-2">
                                <Activity className="h-4 w-4 text-primary" />
                                Aviation Spend Intensity (MTD)
                            </CardTitle>
                            <CardDescription>Daily gross volume across all travel modes (₹ Lakhs).</CardDescription>
                        </CardHeader>
                        <CardContent className="h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={MOCK_SPEND_DATA}>
                                    <defs>
                                        <linearGradient id="colorSpend" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#0EA5E9" stopOpacity={0.3}/>
                                            <stop offset="95%" stopColor="#0EA5E9" stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                                    <XAxis dataKey="day" stroke="#94a3b8" fontSize={10} axisLine={false} tickLine={false} />
                                    <YAxis stroke="#94a3b8" fontSize={10} axisLine={false} tickLine={false} />
                                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px' }} />
                                    <Area type="monotone" dataKey="spend" stroke="#0EA5E9" fillOpacity={1} fill="url(#colorSpend)" name="Spend (L)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-6">
                    {/* COST CENTER ANALYTICS */}
                    <Card className="bg-card">
                        <CardHeader>
                            <CardTitle className="text-sm font-black uppercase text-accent tracking-widest flex items-center gap-2">
                                <Zap className="h-4 w-4" /> Cost Center Yield
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {centers?.filter(c => c.corporateId === user?.corporateId).map(center => {
                                const ratio = (center.usedBudget / center.allocatedBudget) * 100;
                                return (
                                    <div key={center.id} className="space-y-2 p-3 rounded-xl bg-white/[0.02] border border-white/5">
                                        <div className="flex items-center justify-between text-[10px] font-bold">
                                            <span className="text-white uppercase">{center.departmentName}</span>
                                            <span className="text-muted-foreground">₹ {(center.usedBudget / 100000).toFixed(1)}L / ₹ {(center.allocatedBudget / 100000).toFixed(1)}L</span>
                                        </div>
                                        <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                                            <div 
                                                className={cn("h-full transition-all duration-1000", ratio > 80 ? "bg-rose-500" : "bg-emerald-500")} 
                                                style={{ width: `${ratio}%` }} 
                                            />
                                        </div>
                                    </div>
                                );
                            })}
                        </CardContent>
                    </Card>

                    {/* POLICY SIGNALS */}
                    <Card className="bg-primary/5 border-primary/20">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-[10px] font-black uppercase text-primary tracking-widest flex items-center gap-2">
                                <ShieldCheck className="h-4 w-4" /> Governance Signal
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3 pt-2">
                            <div className="p-3 rounded-lg bg-black/40 border border-white/5 space-y-2">
                                <div className="flex items-center justify-between">
                                    <span className="text-[9px] font-bold text-muted-foreground uppercase">Active Policies</span>
                                    <Badge variant="outline" className="text-[8px] h-4 border-accent/20 text-accent">04 RULES</Badge>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-[9px] font-bold text-muted-foreground uppercase">Exceptions Flagged</span>
                                    <span className="text-[10px] font-black text-rose-500">02 ACTIVE</span>
                                </div>
                            </div>
                            <p className="text-[10px] text-muted-foreground leading-relaxed italic">
                                "Audit identifies 15% budget drift in R&D Operations. Recommend enforcement of Tier-2 aircraft caps for domestic sectors."
                            </p>
                        </CardContent>
                    </Card>

                    {/* RECENT MISSION LOG */}
                    <Card className="bg-card">
                        <CardHeader>
                            <CardTitle className="text-sm font-bold flex items-center gap-2">
                                <History className="h-4 w-4 text-sky-400" />
                                Mission Log
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="max-h-[300px] overflow-y-auto px-6 pb-6 space-y-4">
                                {myRequests.slice(0, 5).map(req => (
                                    <div key={req.id} className="relative pl-4 border-l border-white/5 space-y-1 group">
                                        <div className="absolute left-[-4.5px] top-1 w-2 h-2 rounded-full bg-sky-400/40 group-hover:bg-sky-400 transition-colors" />
                                        <p className="text-[10px] font-bold text-foreground uppercase">{req.origin} → {req.destination}</p>
                                        <p className="text-[9px] text-muted-foreground leading-tight">{req.requestStatus.replace(/_/g, ' ')}</p>
                                        <p className="text-[8px] text-muted-foreground font-code opacity-60">{new Date(req.createdAt).toLocaleDateString()}</p>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
