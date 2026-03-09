'use client';

import { PageHeader } from "@/components/dashboard/shared/page-header";
import { StatsGrid } from "@/components/dashboard/shared/stats-grid";
import { StatsCard } from "@/components/dashboard/shared/stats-card";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
    Users, Plane, Briefcase, Building, LayoutDashboard, 
    Activity, FileText, Armchair, Coins, AlertCircle, 
    TrendingUp, ShieldCheck, Zap
} from "lucide-react";
import { useCollection, useFirestore } from "@/firebase";
import { Skeleton } from "@/components/ui/skeleton";
import { useMemo } from "react";
import { 
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    BarChart, Bar, Cell
} from 'recharts';
import type { 
    Operator, TravelAgency, CorporateOrganization, HotelPartner, 
    User, CharterRFQ, SeatAllocationRequest, SystemAlert 
} from "@/lib/types";

const MOCK_TRAFFIC = [
    { day: 'Mon', active: 124, revenue: 12.5 },
    { day: 'Tue', active: 145, revenue: 18.2 },
    { day: 'Wed', active: 132, revenue: 15.8 },
    { day: 'Thu', active: 168, revenue: 22.1 },
    { day: 'Fri', active: 189, revenue: 28.4 },
    { day: 'Sat', active: 112, revenue: 14.5 },
    { day: 'Sun', active: 98, revenue: 11.2 },
];

export default function AdminOverviewPage() {
    const firestore = useFirestore();

    const { data: operators } = useCollection<Operator>(null, 'operators');
    const { data: agencies } = useCollection<TravelAgency>(null, 'travelAgencies');
    const { data: corporates } = useCollection<CorporateOrganization>(null, 'corporateOrganizations');
    const { data: hotels } = useCollection<HotelPartner>(null, 'hotelPartners');
    const { data: users } = useCollection<User>(null, 'users');
    const { data: rfqs } = useCollection<CharterRFQ>(null, 'charterRequests');
    const { data: seats } = useCollection<SeatAllocationRequest>(null, 'seatAllocationRequests');
    const { data: alerts } = useCollection<SystemAlert>(null, 'alerts');

    const stats = useMemo(() => ({
        operators: operators?.length || 0,
        agencies: agencies?.length || 0,
        corporates: corporates?.length || 0,
        hotels: hotels?.length || 0,
        users: users?.length || 0,
        rfqsToday: rfqs?.filter(r => r.createdAt.startsWith(new Date().toISOString().split('T')[0])).length || 0,
        seatsToday: seats?.filter(s => s.createdAt.startsWith(new Date().toISOString().split('T')[0])).length || 0,
        revenue: "₹ 4.2 Cr"
    }), [operators, agencies, corporates, hotels, users, rfqs, seats]);

    return (
        <div className="space-y-6">
            <PageHeader title="Platform Command Center" description="Global administrative visibility and coordination control." />

            <StatsGrid>
                <StatsCard title="Total Operators" href="/dashboard/admin/operators" value={stats.operators.toString()} icon={Plane} description="Verified NSOP Holders" />
                <StatsCard title="Travel Agencies" href="/dashboard/admin/agencies" value={stats.agencies.toString()} icon={Briefcase} description="Authorized Distributors" />
                <StatsCard title="Corporate Clients" href="/dashboard/admin/corporates" value={stats.corporates.toString()} icon={LayoutDashboard} description="Enterprise Accounts" />
                <StatsCard title="Hotel Partners" href="/dashboard/admin/hotel-partners" value={stats.hotels.toString()} icon={Building} description="Linked Hospitality Nodes" />
            </StatsGrid>

            <div className="grid gap-6 lg:grid-cols-3">
                <div className="lg:col-span-2 space-y-6">
                    <Card className="bg-card border-white/5 shadow-2xl">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle className="text-base flex items-center gap-2">
                                    <Activity className="h-4 w-4 text-accent" />
                                    Platform Pulse
                                </CardTitle>
                                <CardDescription>Active users and gross coordination volume (Last 7 Days).</CardDescription>
                            </div>
                            <Badge variant="outline" className="text-[10px] font-black border-accent/20 text-accent">LIVE GRID</Badge>
                        </CardHeader>
                        <CardContent className="h-[300px] pt-4">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={MOCK_TRAFFIC}>
                                    <defs>
                                        <linearGradient id="colorActive" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#FFFFBD" stopOpacity={0.3}/>
                                            <stop offset="95%" stopColor="#FFFFBD" stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                                    <XAxis dataKey="day" stroke="#94a3b8" fontSize={10} axisLine={false} tickLine={false} />
                                    <YAxis stroke="#94a3b8" fontSize={10} axisLine={false} tickLine={false} />
                                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px' }} />
                                    <Area type="monotone" dataKey="active" stroke="#FFFFBD" fillOpacity={1} fill="url(#colorActive)" name="Active Users" />
                                    <Area type="monotone" dataKey="revenue" stroke="#0EA5E9" fillOpacity={0.1} name="Revenue (L)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>

                    <Card className="bg-card border-white/5">
                        <CardHeader>
                            <CardTitle className="text-sm font-black uppercase tracking-widest text-rose-500 flex items-center gap-2">
                                <AlertCircle className="h-4 w-4" />
                                Active System Alerts
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {alerts?.filter(a => a.status === 'active').map(alert => (
                                <div key={alert.id} className="p-3 rounded-lg bg-rose-500/5 border border-rose-500/10 flex items-center justify-between group hover:bg-rose-500/10 transition-colors">
                                    <div className="flex items-center gap-3">
                                        <div className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
                                        <p className="text-xs font-bold text-white">{alert.message}</p>
                                    </div>
                                    <Badge variant="outline" className="text-[8px] font-black uppercase border-rose-500/30 text-rose-500">{alert.type}</Badge>
                                </div>
                            )) || <p className="text-center text-xs text-muted-foreground py-10">No active platform anomalies detected.</p>}
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-6">
                    <Card className="bg-primary/10 border-primary/20">
                        <CardHeader>
                            <CardTitle className="text-sm font-black uppercase text-primary tracking-widest flex items-center gap-2">
                                <ShieldCheck className="h-4 w-4" />
                                Global Governance
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4 pt-2">
                            <div className="flex items-center justify-between p-3 rounded-xl bg-black/40 border border-white/5">
                                <div className="space-y-0.5">
                                    <p className="text-[10px] text-muted-foreground uppercase font-black">Total Users</p>
                                    <p className="text-lg font-black text-white">{stats.users}</p>
                                </div>
                                <Users className="h-5 w-5 text-primary/40" />
                            </div>
                            <div className="flex items-center justify-between p-3 rounded-xl bg-black/40 border border-white/5">
                                <div className="space-y-0.5">
                                    <p className="text-[10px] text-muted-foreground uppercase font-black">Platform Revenue</p>
                                    <p className="text-lg font-black text-accent">{stats.revenue}</p>
                                </div>
                                <Zap className="h-5 w-5 text-accent/40" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-card border-white/5">
                        <CardHeader>
                            <CardTitle className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
                                <Target className="h-4 w-4 text-emerald-500" />
                                Operational Demand
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <FileText className="h-3.5 w-3.5 text-muted-foreground" />
                                    <span className="text-[11px] font-bold text-white uppercase">Charter RFQs (24h)</span>
                                </div>
                                <span className="text-xs font-black text-white">{stats.rfqsToday}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Armchair className="h-3.5 w-3.5 text-muted-foreground" />
                                    <span className="text-[11px] font-bold text-white uppercase">Seat Leads (24h)</span>
                                </div>
                                <span className="text-xs font-black text-white">{stats.seatsToday}</span>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
