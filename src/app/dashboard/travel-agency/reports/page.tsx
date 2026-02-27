'use client';

import { PageHeader } from "@/components/dashboard/shared/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useUser } from "@/hooks/use-user";
import { useCollection, useFirestore, useMemoFirebase } from "@/firebase";
import { collection, query, where, collectionGroup } from "firebase/firestore";
import { Skeleton } from "@/components/ui/skeleton";
import type { CharterRFQ, EmptyLegSeatAllocationRequest } from "@/lib/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StatsCard } from "@/components/dashboard/shared/stats-card";
import { StatsGrid } from "@/components/dashboard/shared/stats-grid";
import { 
    Download, 
    Search, 
    Filter, 
    History, 
    TrendingUp, 
    DollarSign, 
    Plane, 
    Users, 
    Target, 
    Zap, 
    MapPin,
    Clock,
    BarChart3,
    ArrowUpRight,
    PieChart as PieIcon,
    Coins,
    TrendingDown
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
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
    PieChart, 
    Pie, 
    Cell,
    LineChart,
    Line
} from 'recharts';
import { AgencyAIInsights } from "@/components/dashboard/travel-agency/reports/ai-insights";

const COLORS = ['#0EA5E9', '#EEDC5B', '#F43F5E', '#10B981', '#8B5CF6'];

const sectorTrendData = [
    { name: 'BOM-DEL', activity: 45, revenue: 8500000, yield: 1.2 },
    { name: 'DEL-LHR', activity: 32, revenue: 12000000, yield: 1.5 },
    { name: 'BLR-GOI', activity: 28, revenue: 2500000, yield: 0.8 },
    { name: 'MAA-SIN', activity: 15, revenue: 6800000, yield: 1.1 },
    { name: 'BOM-DXB', activity: 22, revenue: 9200000, yield: 1.3 },
];

const revenueContributionData = [
    { name: 'Charter Sales', value: 65, color: '#0EA5E9' },
    { name: 'Seat Allocations', value: 35, color: '#EEDC5B' },
];

const dailyRevenueData = [
    { day: 'Mon', revenue: 1200000 },
    { day: 'Tue', revenue: 900000 },
    { day: 'Wed', revenue: 1500000 },
    { day: 'Thu', revenue: 2100000 },
    { day: 'Fri', revenue: 1800000 },
    { day: 'Sat', revenue: 2400000 },
    { day: 'Sun', revenue: 1100000 },
];

const conversionData = [
    { month: 'May', requested: 20, approved: 12, revenue: 4500000 },
    { month: 'Jun', requested: 25, approved: 18, revenue: 6200000 },
    { month: 'Jul', requested: 35, approved: 22, revenue: 8100000 },
];

export default function AgencyReportsPage() {
    const { user, isLoading: isUserLoading } = useUser();
    const firestore = useFirestore();
    const [searchTerm, setSearchTerm] = useState("");

    const charterQuery = useMemoFirebase(() => {
        if (!firestore || !user) return null;
        return query(collection(firestore, 'charterRFQs'), where('requesterExternalAuthId', '==', user.id));
    }, [firestore, user]);
    const { data: charters, isLoading: charterLoading } = useCollection<CharterRFQ>(charterQuery, 'charterRFQs');

    const seatQuery = useMemoFirebase(() => {
        if (!firestore || !user) return null;
        return query(collectionGroup(firestore, 'seatAllocationRequests'), where('requesterExternalAuthId', '==', user.id));
    }, [firestore, user]);
    const { data: seatRequests, isLoading: seatLoading } = useCollection<EmptyLegSeatAllocationRequest>(seatQuery, 'emptyLegs/all/seatAllocationRequests');

    const isLoading = isUserLoading || charterLoading || seatLoading;

    const charterHistory = charters?.filter(c => ['Confirmed', 'Cancelled', 'Expired', 'Closed'].includes(c.status)) || [];
    const seatHistory = seatRequests?.filter(s => ['Approved', 'Rejected', 'Cancelled'].includes(s.status)) || [];

    const filteredCharters = charterHistory.filter(c => 
        c.departure.toLowerCase().includes(searchTerm.toLowerCase()) || 
        c.arrival.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.id.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const filteredSeats = seatHistory.filter(s => 
        s.emptyLegId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (s.clientReference?.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const stats = {
        grossVolume: "₹ 1.4 Cr",
        seatYield: "₹ 42.5 L",
        charterYield: "₹ 97.5 L",
        avgTransaction: "₹ 5.8 L",
        completedMovements: (charterHistory.filter(c => c.status === 'Confirmed').length + seatHistory.filter(s => s.status === 'Approved').length),
    };

    return (
        <>
            <PageHeader 
                title="Revenue & Performance Intelligence" 
                description="Strategic demand analysis, yield tracking, and commercial coordination audit."
            >
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="h-9 gap-2 border-white/10">
                        <Download className="h-3.5 w-3.5" /> Export Financials
                    </Button>
                </div>
            </PageHeader>

            <StatsGrid>
                <StatsCard 
                    title="Gross Coordination" 
                    value={isLoading ? <Skeleton className="h-6 w-20" /> : stats.grossVolume} 
                    icon={DollarSign} 
                    description="Total commercial volume" 
                />
                <StatsCard 
                    title="Seat Sales Yield" 
                    value={isLoading ? <Skeleton className="h-6 w-12" /> : stats.seatYield} 
                    icon={Zap} 
                    description="EL Recovery contribution" 
                />
                <StatsCard 
                    title="Charter Yield" 
                    value={isLoading ? <Skeleton className="h-6 w-12" /> : stats.charterYield} 
                    icon={Target} 
                    description="Full mission revenue" 
                />
                <StatsCard 
                    title="Avg. Transaction" 
                    value={isLoading ? <Skeleton className="h-6 w-12" /> : stats.avgTransaction} 
                    icon={Coins} 
                    description="Per confirmed movement" 
                />
            </StatsGrid>

            <div className="mt-6 space-y-6">
                <AgencyAIInsights />

                <Tabs defaultValue="revenue" className="w-full">
                    <TabsList className="bg-muted/20 border border-white/5 mb-6 p-1">
                        <TabsTrigger value="revenue" className="gap-2">
                            <DollarSign className="h-3.5 w-3.5" /> Revenue Intelligence
                        </TabsTrigger>
                        <TabsTrigger value="performance" className="gap-2">
                            <BarChart3 className="h-3.5 w-3.5" /> Conversion Metrics
                        </TabsTrigger>
                        <TabsTrigger value="trends" className="gap-2">
                            <MapPin className="h-3.5 w-3.5" /> Sector Trends
                        </TabsTrigger>
                        <TabsTrigger value="history" className="gap-2">
                            <History className="h-3.5 w-3.5" /> Activity Archive
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="revenue" className="space-y-6 animate-in fade-in slide-in-from-top-2">
                        <div className="grid gap-6 md:grid-cols-3">
                            <Card className="md:col-span-2 bg-card">
                                <CardHeader>
                                    <CardTitle>Commercial Yield Direction</CardTitle>
                                    <CardDescription>Daily revenue flow across all client coordination.</CardDescription>
                                </CardHeader>
                                <CardContent className="h-[350px]">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <LineChart data={dailyRevenueData}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                                            <XAxis dataKey="day" stroke="#94a3b8" fontSize={10} />
                                            <YAxis stroke="#94a3b8" fontSize={10} tickFormatter={(val) => `₹${val/100000}L`} />
                                            <Tooltip 
                                                formatter={(val: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(val)}
                                                contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b' }}
                                            />
                                            <Line type="monotone" dataKey="revenue" stroke="#EEDC5B" strokeWidth={3} dot={{ fill: '#EEDC5B', r: 4 }} activeDot={{ r: 6, strokeWidth: 0 }} />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </CardContent>
                            </Card>

                            <Card className="bg-card">
                                <CardHeader>
                                    <CardTitle>Contribution Mix</CardTitle>
                                    <CardDescription>Charter vs. Seat sales share.</CardDescription>
                                </CardHeader>
                                <CardContent className="flex flex-col items-center justify-center space-y-6 py-6">
                                    <div className="h-[180px] w-full">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <PieChart>
                                                <Pie
                                                    data={revenueContributionData}
                                                    cx="50%"
                                                    cy="50%"
                                                    innerRadius={60}
                                                    outerRadius={80}
                                                    paddingAngle={5}
                                                    dataKey="value"
                                                    stroke="none"
                                                >
                                                    {revenueContributionData.map((entry, index) => (
                                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                                    ))}
                                                </Pie>
                                                <Tooltip />
                                            </PieChart>
                                        </ResponsiveContainer>
                                    </div>
                                    <div className="w-full space-y-2.5">
                                        {revenueContributionData.map(item => (
                                            <div key={item.name} className="flex items-center justify-between text-[10px] uppercase font-black tracking-widest">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                                                    <span className="text-muted-foreground">{item.name}</span>
                                                </div>
                                                <span className="text-white">{item.value}%</span>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        <div className="grid gap-6 md:grid-cols-2">
                            <Card className="bg-card">
                                <CardHeader>
                                    <CardTitle>Conversion Efficiency vs. Revenue</CardTitle>
                                    <CardDescription>Comparing request volume against realized commercial value.</CardDescription>
                                </CardHeader>
                                <CardContent className="h-[300px]">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart data={conversionData}>
                                            <defs>
                                                <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                                                    <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                                                </linearGradient>
                                            </defs>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                                            <XAxis dataKey="month" stroke="#94a3b8" fontSize={10} />
                                            <YAxis stroke="#94a3b8" fontSize={10} />
                                            <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b' }} />
                                            <Area type="monotone" dataKey="revenue" stroke="#10B981" fillOpacity={1} fill="url(#colorRev)" name="Revenue Flow" />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </CardContent>
                            </Card>

                            <Card className="bg-card flex flex-col justify-center">
                                <CardHeader>
                                    <CardTitle>Commercial Efficiency Signals</CardTitle>
                                    <CardDescription>Institutional profitability indicators.</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-xs uppercase font-bold text-muted-foreground">
                                            <span>Requests vs. Revenue Ratio</span>
                                            <span className="text-accent">High (8.2)</span>
                                        </div>
                                        <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                            <div className="h-full bg-accent w-[82%]" />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-xs uppercase font-bold text-muted-foreground">
                                            <span>Seat Request Yield</span>
                                            <span className="text-sky-400">₹ 1.2 L / Lead</span>
                                        </div>
                                        <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                            <div className="h-full bg-sky-400 w-[65%]" />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-xs uppercase font-bold text-muted-foreground">
                                            <span>Lost Revenue Impact</span>
                                            <span className="text-rose-500">Medium (12%)</span>
                                        </div>
                                        <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                            <div className="h-full bg-rose-500 w-[12%]" />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>

                    <TabsContent value="performance" className="space-y-6 animate-in fade-in slide-in-from-top-2">
                        <div className="grid gap-6 md:grid-cols-2">
                            <Card className="bg-card">
                                <CardHeader>
                                    <CardTitle>Lead Fulfillment Ratio</CardTitle>
                                    <CardDescription>Requested vs. Approved blocks over time.</CardDescription>
                                </CardHeader>
                                <CardContent className="h-[300px]">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart data={conversionData}>
                                            <defs>
                                                <linearGradient id="colorReq" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#0EA5E9" stopOpacity={0.3}/>
                                                    <stop offset="95%" stopColor="#0EA5E9" stopOpacity={0}/>
                                                </linearGradient>
                                                <linearGradient id="colorApp" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                                                    <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                                                </linearGradient>
                                            </defs>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                                            <XAxis dataKey="month" stroke="#94a3b8" fontSize={10} />
                                            <YAxis stroke="#94a3b8" fontSize={10} />
                                            <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b' }} />
                                            <Area type="monotone" dataKey="requested" stroke="#0EA5E9" fillOpacity={1} fill="url(#colorReq)" name="Requested" />
                                            <Area type="monotone" dataKey="approved" stroke="#10B981" fillOpacity={1} fill="url(#colorApp)" name="Approved" />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </CardContent>
                            </Card>

                            <Card className="bg-card">
                                <CardHeader>
                                    <CardTitle>Coordination Efficiency</CardTitle>
                                    <CardDescription>Response time vs. Conversion Ratio.</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-xs uppercase font-bold text-muted-foreground">
                                            <span>Charter Response Avg</span>
                                            <span className="text-accent">2.4 Hours</span>
                                        </div>
                                        <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                            <div className="h-full bg-accent w-[85%]" />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-xs uppercase font-bold text-muted-foreground">
                                            <span>Seat Block Approval Time</span>
                                            <span className="text-sky-400">1.1 Hours</span>
                                        </div>
                                        <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                            <div className="h-full bg-sky-400 w-[95%]" />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>

                    <TabsContent value="trends" className="space-y-6 animate-in fade-in slide-in-from-top-2">
                        <div className="grid gap-6 md:grid-cols-3">
                            <Card className="md:col-span-2 bg-card">
                                <CardHeader>
                                    <CardTitle>High-Revenue Sectors</CardTitle>
                                    <CardDescription>Commercial value concentration across key routes.</CardDescription>
                                </CardHeader>
                                <CardContent className="h-[350px]">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={sectorTrendData} layout="vertical">
                                            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" horizontal={false} />
                                            <XAxis type="number" stroke="#94a3b8" fontSize={10} hide />
                                            <YAxis type="category" dataKey="name" stroke="#94a3b8" fontSize={10} width={80} />
                                            <Tooltip 
                                                formatter={(val: number) => `₹${val/100000}L`}
                                                contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b' }}
                                            />
                                            <Bar dataKey="revenue" name="Sector Revenue" fill="#0EA5E9" radius={[0, 4, 4, 0]} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </CardContent>
                            </Card>

                            <Card className="bg-card">
                                <CardHeader>
                                    <CardTitle>Yield Signals</CardTitle>
                                    <CardDescription>Demand density correlation.</CardDescription>
                                </CardHeader>
                                <CardContent className="h-[250px] flex flex-col justify-center">
                                    <div className="space-y-4">
                                        {sectorTrendData.slice(0, 4).map(sector => (
                                            <div key={sector.name} className="flex items-center justify-between">
                                                <div className="space-y-0.5">
                                                    <p className="text-xs font-bold uppercase">{sector.name}</p>
                                                    <p className="text-[9px] text-muted-foreground">Yield Factor: {sector.yield}x</p>
                                                </div>
                                                <Badge variant="outline" className="text-[10px] text-green-500 border-green-500/20">
                                                    STABLE
                                                </Badge>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>

                    <TabsContent value="history" className="space-y-6 animate-in fade-in slide-in-from-top-2">
                        <div className="flex flex-col md:flex-row gap-4 mb-2">
                            <div className="relative flex-grow">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input 
                                    placeholder="Filter by sector, client ref, or ID..." 
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10 bg-muted/20 border-white/10"
                                />
                            </div>
                        </div>

                        <Card className="bg-card">
                            <CardHeader>
                                <CardTitle>Commercial Activity Archive</CardTitle>
                                <CardDescription>Consolidated record of all client movements and commercial outcomes.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                {isLoading ? <Skeleton className="h-64 w-full" /> : (
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Execution ID</TableHead>
                                                <TableHead>Type</TableHead>
                                                <TableHead>Sector</TableHead>
                                                <TableHead>Client Ref</TableHead>
                                                <TableHead>Outcome</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {[...filteredCharters, ...filteredSeats].sort((a, b) => b.id.localeCompare(a.id)).map((item) => (
                                                <TableRow key={item.id}>
                                                    <TableCell className="font-code text-xs font-bold">{item.id}</TableCell>
                                                    <TableCell>
                                                        <Badge variant="outline" className="text-[8px] uppercase tracking-tighter">
                                                            {('departure' in item) ? 'CHARTER' : 'SEAT BLOCK'}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell className="text-xs">
                                                        {('departure' in item) ? `${item.departure} → ${item.arrival}` : (item as any).emptyLegId}
                                                    </TableCell>
                                                    <TableCell className="text-xs font-medium">
                                                        {('customerName' in item) ? item.customerName : (item as any).clientReference || 'N/A'}
                                                    </TableCell>
                                                    <TableCell>
                                                        <Badge variant={item.status === 'Confirmed' || item.status === 'Approved' ? 'success' : 'secondary'} className="text-[9px] font-bold uppercase">
                                                            {item.status}
                                                        </Badge>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </>
    );
}
