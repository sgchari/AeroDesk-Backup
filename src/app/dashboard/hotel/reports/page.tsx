'use client';

import { PageHeader } from "@/components/dashboard/shared/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StatsCard } from "@/components/dashboard/shared/stats-card";
import { StatsGrid } from "@/components/dashboard/shared/stats-grid";
import { 
    BarChart, 
    Bar, 
    XAxis, 
    YAxis, 
    CartesianGrid, 
    Tooltip, 
    ResponsiveContainer, 
    LineChart, 
    Line, 
    PieChart as RePieChart, 
    Pie, 
    Cell,
    AreaChart,
    Area,
    Legend
} from 'recharts';
import { 
    DollarSign, 
    TrendingUp, 
    BedDouble, 
    Clock, 
    Users, 
    Calendar, 
    Download, 
    Filter,
    Activity,
    Target,
    History,
    Hotel,
    Briefcase,
    ShieldCheck
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useUser } from "@/hooks/use-user";
import { useState, useMemo } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { HotelAIInsights } from "@/components/dashboard/hotel/reports/hotel-ai-insights";
import { useCollection, useFirestore, useMemoFirebase } from "@/firebase";
import { collection, query, where } from "firebase/firestore";
import { Skeleton } from "@/components/ui/skeleton";
import type { AccommodationRequest } from "@/lib/types";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

// --- MOCK DATA FOR SCALING ---
const BASE_REVENUE_DATA = [
    { name: 'Deluxe King', value: 45, color: '#0EA5E9' },
    { name: 'Executive Suite', value: 35, color: '#EEDC5B' },
    { name: 'Presidential', value: 20, color: '#10B981' },
];

const BASE_DAILY_OCCUPANCY = [
    { day: 'Mon', occupancy: 42 },
    { day: 'Tue', occupancy: 38 },
    { day: 'Wed', occupancy: 55 },
    { day: 'Thu', occupancy: 72 },
    { day: 'Fri', occupancy: 88 },
    { day: 'Sat', occupancy: 94 },
    { day: 'Sun', occupancy: 65 },
];

const BASE_LIFECYCLE_DATA = [
    { month: 'May', received: 45, confirmed: 38, rejected: 7 },
    { month: 'Jun', received: 52, confirmed: 44, rejected: 8 },
    { month: 'Jul', received: 68, confirmed: 55, rejected: 13 },
];

const STAKEHOLDER_DATA = [
    { name: 'Corporate Desk', value: 55, color: '#0EA5E9' },
    { name: 'HNWI Direct', value: 25, color: '#EEDC5B' },
    { name: 'Travel Agency', value: 20, color: '#8B5CF6' },
];

export default function HotelReportsPage() {
    const { user } = useUser();
    const firestore = useFirestore();
    const { toast } = useToast();
    const [period, setPeriod] = useState("30d");

    // Dynamic scale factors
    const scaleFactor = useMemo(() => {
        switch (period) {
            case '7d': return 0.25;
            case '30d': return 1;
            case '90d': return 2.8;
            case 'ytd': return 6.5;
            default: return 1;
        }
    }, [period]);

    // Data Fetching for history table
    const requestsQuery = useMemoFirebase(() => {
        if (!firestore || !user) return null;
        return query(collection(firestore, 'accommodationRequests'), where('hotelPartnerId', '==', user.id));
    }, [firestore, user]);

    const { data: requests, isLoading: requestsLoading } = useCollection<AccommodationRequest>(
        requestsQuery, 
        'accommodationRequests'
    );

    const stats = useMemo(() => ({
        totalRevenue: new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(825000 * scaleFactor).replace('INR', '₹'),
        avgBookingValue: '₹ 42,500',
        occupancyRate: '78%',
        responseEfficiency: '1.2 Hours'
    }), [scaleFactor]);

    const dailyOccupancy = useMemo(() => BASE_DAILY_OCCUPANCY.map(d => ({
        ...d,
        occupancy: Math.min(100, Math.round(d.occupancy * (scaleFactor < 1 ? 0.8 : 1)))
    })), [scaleFactor]);

    const handlePeriodChange = (value: string) => {
        setPeriod(value);
        toast({
            title: "Performance Scope Updated",
            description: `Now analyzing institutional property metrics for the ${value === '7d' ? 'last 7 days' : value === '30d' ? 'last 30 days' : value === '90d' ? 'last quarter' : 'current year'}.`,
        });
    };

    return (
        <>
            <PageHeader 
                title="Property Performance & Yield Intelligence" 
                description="Consolidated visibility into revenue contribution, operational efficiency, and network demand patterns."
            >
                <div className="flex gap-2">
                    <Select value={period} onValueChange={handlePeriodChange}>
                        <SelectTrigger className="h-9 w-[160px] bg-muted/20 border-white/10 text-xs gap-2 text-white">
                            <Filter className="h-3.5 w-3.5 text-accent" />
                            <SelectValue placeholder="Period Scope" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="7d">Last 7 Days</SelectItem>
                            <SelectItem value="30d">Last 30 Days</SelectItem>
                            <SelectItem value="90d">Last Quarter</SelectItem>
                            <SelectItem value="ytd">Year to Date</SelectItem>
                        </SelectContent>
                    </Select>
                    <Button variant="outline" size="sm" className="h-9 gap-2 border-white/10 font-bold uppercase text-[10px] tracking-widest">
                        <Download className="h-3.5 w-3.5" /> Export Audit
                    </Button>
                </div>
            </PageHeader>

            <StatsGrid>
                <StatsCard title="Total Revenue" value={stats.totalRevenue} icon={DollarSign} description="Revenue via AeroDesk network" />
                <StatsCard title="AeroDesk Occupancy" value={stats.occupancyRate} icon={BedDouble} description="Room nights confirmed" />
                <StatsCard title="Avg. Booking Value" value={stats.avgBookingValue} icon={TrendingUp} description="Per confirmed stay" />
                <StatsCard title="Response Latency" value={stats.responseEfficiency} icon={Clock} description="Avg. request processing time" />
            </StatsGrid>

            <div className="mt-6 space-y-6">
                <HotelAIInsights />

                <Tabs defaultValue="revenue" className="w-full">
                    <TabsList className="bg-muted/20 border border-white/5 mb-6 p-1">
                        <TabsTrigger value="revenue" className="gap-2">
                            <DollarSign className="h-3.5 w-3.5" /> Revenue & Yield
                        </TabsTrigger>
                        <TabsTrigger value="ops" className="gap-2">
                            <Activity className="h-3.5 w-3.5" /> Operations Efficiency
                        </TabsTrigger>
                        <TabsTrigger value="occupancy" className="gap-2">
                            <BedDouble className="h-3.5 w-3.5" /> Demand Patterns
                        </TabsTrigger>
                        <TabsTrigger value="clients" className="gap-2">
                            <Users className="h-3.5 w-3.5" /> Client Insights
                        </TabsTrigger>
                        <TabsTrigger value="history" className="gap-2">
                            <History className="h-3.5 w-3.5" /> Archive
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="revenue" className="space-y-6 animate-in fade-in slide-in-from-top-2">
                        <div className="grid gap-6 md:grid-cols-3">
                            <Card className="md:col-span-2 bg-card">
                                <CardHeader>
                                    <CardTitle>Revenue Yield Direction</CardTitle>
                                    <CardDescription>Daily revenue flows generated through charter-linked stays.</CardDescription>
                                </CardHeader>
                                <CardContent className="h-[350px]">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart data={dailyOccupancy}>
                                            <defs>
                                                <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#0EA5E9" stopOpacity={0.3}/>
                                                    <stop offset="95%" stopColor="#0EA5E9" stopOpacity={0}/>
                                                </linearGradient>
                                            </defs>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                                            <XAxis dataKey="day" stroke="#94a3b8" fontSize={10} />
                                            <YAxis stroke="#94a3b8" fontSize={10} />
                                            <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b' }} />
                                            <Area type="monotone" dataKey="occupancy" stroke="#0EA5E9" fillOpacity={1} fill="url(#colorRev)" name="Revenue Flow Index" />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </CardContent>
                            </Card>

                            <Card className="bg-card">
                                <CardHeader>
                                    <CardTitle>Contribution by Category</CardTitle>
                                    <CardDescription>Revenue share per room type.</CardDescription>
                                </CardHeader>
                                <CardContent className="h-[300px] flex flex-col justify-center">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <RePieChart>
                                            <Pie
                                                data={BASE_REVENUE_DATA}
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={60}
                                                outerRadius={80}
                                                paddingAngle={5}
                                                dataKey="value"
                                            >
                                                {BASE_REVENUE_DATA.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                                ))}
                                            </Pie>
                                            <Tooltip />
                                        </RePieChart>
                                    </ResponsiveContainer>
                                    <div className="space-y-2 mt-4">
                                        {BASE_REVENUE_DATA.map((item) => (
                                            <div key={item.name} className="flex items-center justify-between text-[10px] font-bold uppercase">
                                                <div className="flex items-center gap-1.5">
                                                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                                                    {item.name}
                                                </div>
                                                <span>{item.value}%</span>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>

                    <TabsContent value="ops" className="space-y-6 animate-in fade-in slide-in-from-top-2">
                        <div className="grid gap-6 md:grid-cols-2">
                            <Card className="bg-card">
                                <CardHeader>
                                    <CardTitle>Booking Lifecycle Funnel</CardTitle>
                                    <CardDescription>Requested vs. Confirmed status ratio.</CardDescription>
                                </CardHeader>
                                <CardContent className="h-[300px]">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={BASE_LIFECYCLE_DATA}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                                            <XAxis dataKey="month" stroke="#94a3b8" fontSize={10} />
                                            <YAxis stroke="#94a3b8" fontSize={10} />
                                            <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b' }} />
                                            <Legend />
                                            <Bar dataKey="received" name="Inquiries" fill="#0EA5E9" radius={[4, 4, 0, 0]} />
                                            <Bar dataKey="confirmed" name="Confirmed" fill="#10B981" radius={[4, 4, 0, 0]} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </CardContent>
                            </Card>

                            <Card className="bg-card flex flex-col justify-center">
                                <CardHeader>
                                    <CardTitle>Performance Indicators</CardTitle>
                                    <CardDescription>Coordination efficiency metrics.</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-xs uppercase font-bold text-muted-foreground">
                                            <span>Request Conversion Ratio</span>
                                            <span className="text-emerald-500">82.4%</span>
                                        </div>
                                        <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                            <div className="h-full bg-emerald-500 w-[82%]" />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-xs uppercase font-bold text-muted-foreground">
                                            <span>Lead Response Efficiency</span>
                                            <span className="text-primary">92% Optimal</span>
                                        </div>
                                        <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                            <div className="h-full bg-primary w-[92%]" />
                                        </div>
                                    </div>
                                    <div className="p-4 rounded-xl bg-accent/5 border border-accent/10 flex items-center gap-4">
                                        <div className="p-2 bg-accent/10 rounded-full"><Clock className="h-5 w-5 text-accent" /></div>
                                        <div>
                                            <p className="text-[10px] font-bold text-muted-foreground uppercase">Average Approval Time</p>
                                            <p className="text-lg font-black text-foreground tracking-tighter">72 Minutes</p>
                                        </div>
                                        <Badge className="ml-auto bg-green-500/20 text-green-500 border-none h-5">Top Tier</Badge>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>

                    <TabsContent value="occupancy" className="space-y-6 animate-in fade-in slide-in-from-top-2">
                        <Card className="bg-card">
                            <CardHeader>
                                <CardTitle>Marketplace Occupancy Trends</CardTitle>
                                <CardDescription>Tracking seasonal and weekly peaks driven by charter arrivals.</CardDescription>
                            </CardHeader>
                            <CardContent className="h-[400px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={dailyOccupancy}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                                        <XAxis dataKey="day" stroke="#94a3b8" fontSize={10} />
                                        <YAxis stroke="#94a3b8" fontSize={10} tickFormatter={(val) => `${val}%`} />
                                        <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b' }} />
                                        <Line type="monotone" dataKey="occupancy" stroke="#EEDC5B" strokeWidth={3} dot={{ fill: '#EEDC5B', r: 4 }} activeDot={{ r: 6, strokeWidth: 0 }} name="Occupancy %" />
                                    </LineChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="clients" className="space-y-6 animate-in fade-in slide-in-from-top-2">
                        <div className="grid gap-6 md:grid-cols-2">
                            <Card className="bg-card">
                                <CardHeader>
                                    <CardTitle>Stakeholder Mix</CardTitle>
                                    <CardDescription>Source of bookings via the platform.</CardDescription>
                                </CardHeader>
                                <CardContent className="h-[300px]">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <RePieChart>
                                            <Pie
                                                data={STAKEHOLDER_DATA}
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={60}
                                                outerRadius={80}
                                                paddingAngle={5}
                                                dataKey="value"
                                            >
                                                {STAKEHOLDER_DATA.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                                ))}
                                            </Pie>
                                            <Tooltip />
                                        </RePieChart>
                                    </ResponsiveContainer>
                                    <div className="flex justify-center gap-4 mt-2">
                                        {STAKEHOLDER_DATA.map((item) => (
                                            <div key={item.name} className="flex items-center gap-1.5">
                                                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                                                <span className="text-[10px] text-muted-foreground uppercase font-bold">{item.name}</span>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="bg-card">
                                <CardHeader>
                                    <CardTitle>Repeat Guest Signals</CardTitle>
                                    <CardDescription>Loyalty patterns from network users.</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6 pt-4">
                                    <div className="flex items-center justify-between p-4 border border-white/5 rounded-xl bg-white/[0.02]">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-primary/10 rounded-lg"><Target className="h-4 w-4 text-primary" /></div>
                                            <span className="text-xs font-medium">Corporate Repeat Rate</span>
                                        </div>
                                        <span className="text-lg font-black text-white">42%</span>
                                    </div>
                                    <div className="flex items-center justify-between p-4 border border-white/5 rounded-xl bg-white/[0.02]">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-accent/10 rounded-lg"><Users className="h-4 w-4 text-accent" /></div>
                                            <span className="text-xs font-medium">Agency Loyalty Factor</span>
                                        </div>
                                        <span className="text-lg font-black text-white">High (1.8x)</span>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>

                    <TabsContent value="history" className="space-y-6 animate-in fade-in slide-in-from-top-2">
                        <Card className="bg-card">
                            <CardHeader>
                                <CardTitle>Historical Stay Coordination</CardTitle>
                                <CardDescription>Archive of all accommodation requests linked to platform activity.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                {requestsLoading ? <Skeleton className="h-64 w-full" /> : (
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Request ID</TableHead>
                                                <TableHead>Guest / Client</TableHead>
                                                <TableHead>Execution Date</TableHead>
                                                <TableHead>Rooms</TableHead>
                                                <TableHead>Outcome</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {requests?.map((req) => (
                                                <TableRow key={req.id}>
                                                    <TableCell className="font-code text-xs font-bold">{req.id}</TableCell>
                                                    <TableCell className="text-sm">{req.guestName || 'VIP Client'}</TableCell>
                                                    <TableCell className="text-xs text-muted-foreground">{new Date(req.checkIn).toLocaleDateString()}</TableCell>
                                                    <TableCell className="text-xs">{req.rooms} Room(s)</TableCell>
                                                    <TableCell>
                                                        <Badge variant={req.status === 'Confirmed' ? 'success' : req.status === 'Declined' ? 'destructive' : 'secondary'} className="text-[10px] uppercase font-bold tracking-wider">
                                                            {req.status}
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
