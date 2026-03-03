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
    PieChart as RePieChart, 
    Pie, 
    Cell,
    AreaChart,
    Area,
    Legend,
    LineChart,
    Line
} from 'recharts';
import { 
    DollarSign, 
    TrendingUp, 
    BedDouble, 
    Clock, 
    Users, 
    Download, 
    Filter,
    Activity,
    Target,
    Hotel,
    Briefcase,
    ShieldCheck
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useUser } from "@/hooks/use-user";
import { useState, useMemo } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { HotelAIInsights } from "@/components/dashboard/hotel/reports/hotel-ai-insights";

// --- MOCK HOSPITALITY DATA ---
const REVENUE_BY_ROOM = [
    { name: 'Deluxe King', value: 45, color: '#0EA5E9' },
    { name: 'Executive Suite', value: 35, color: '#FFFFBD' },
    { name: 'Presidential', value: 20, color: '#10B981' },
];

const DAILY_OCCUPANCY = [
    { day: 'Mon', occupancy: 42, revenue: 125000 },
    { day: 'Tue', occupancy: 38, revenue: 98000 },
    { day: 'Wed', occupancy: 55, revenue: 165000 },
    { day: 'Thu', occupancy: 72, revenue: 210000 },
    { day: 'Fri', occupancy: 88, revenue: 285000 },
    { day: 'Sat', occupancy: 94, revenue: 320000 },
    { day: 'Sun', occupancy: 65, revenue: 180000 },
];

const CLIENT_MIX = [
    { name: 'Corporate Desk', value: 55, color: '#0EA5E9' },
    { name: 'HNWI Direct', value: 25, color: '#FFFFBD' },
    { name: 'Travel Agency', value: 20, color: '#8B5CF6' },
];

export default function HotelReportsPage() {
    const { user } = useUser();
    const { toast } = useToast();
    const [period, setPeriod] = useState("30d");

    const scaleFactor = useMemo(() => {
        switch (period) {
            case '7d': return 0.25;
            case '30d': return 1;
            case '90d': return 2.8;
            case 'ytd': return 6.5;
            default: return 1;
        }
    }, [period]);

    const stats = useMemo(() => ({
        totalRevenue: new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(1250000 * scaleFactor).replace('INR', '₹'),
        occupancyRate: "78%",
        avgBookingValue: "₹ 42,500",
        responseEfficiency: "1.2 Hours"
    }), [scaleFactor]);

    const handlePeriodChange = (value: string) => {
        setPeriod(value);
        toast({
            title: "Performance Scope Updated",
            description: "Synchronizing property yield and occupancy data.",
        });
    };

    return (
        <div className="space-y-6">
            <PageHeader 
                title="Property Yield Intelligence" 
                description={`Consolidated visibility into network revenue and occupancy patterns for ${user?.company}.`}
            >
                <div className="flex gap-2">
                    <Select value={period} onValueChange={handlePeriodChange}>
                        <SelectTrigger className="h-9 w-[140px] bg-muted/20 border-white/10 text-xs">
                            <Filter className="h-3.5 w-3.5 mr-2 text-accent" />
                            <SelectValue placeholder="Period" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="7d">Last 7 Days</SelectItem>
                            <SelectItem value="30d">Last 30 Days</SelectItem>
                            <SelectItem value="90d">Last Quarter</SelectItem>
                            <SelectItem value="ytd">Year to Date</SelectItem>
                        </SelectContent>
                    </Select>
                    <Button variant="outline" size="sm" className="h-9 gap-2 border-white/10 font-bold uppercase text-[9px] tracking-widest">
                        <Download className="h-3.5 w-3.5" /> Export Audit
                    </Button>
                </div>
            </PageHeader>

            <StatsGrid>
                <StatsCard title="Platform Revenue" value={stats.totalRevenue} icon={DollarSign} description="Yield via AeroDesk network" />
                <StatsCard title="Network Occupancy" value={stats.occupancyRate} icon={BedDouble} description="Room nights confirmed" />
                <StatsCard title="Avg. Booking Value" value={stats.avgBookingValue} icon={TrendingUp} description="Per confirmed stay" />
                <StatsCard title="Response Latency" value={stats.responseEfficiency} icon={Clock} description="Avg. processing time" />
            </StatsGrid>

            <HotelAIInsights />

            <Tabs defaultValue="revenue" className="w-full">
                <TabsList className="bg-muted/20 border border-white/5 mb-6 p-1 h-auto flex flex-wrap">
                    <TabsTrigger value="revenue" className="gap-2 flex-1 min-w-[120px]">
                        <DollarSign className="h-3.5 w-3.5" /> Revenue & Yield
                    </TabsTrigger>
                    <TabsTrigger value="occupancy" className="gap-2 flex-1 min-w-[120px]">
                        <BedDouble className="h-3.5 w-3.5" /> Occupancy Patterns
                    </TabsTrigger>
                    <TabsTrigger value="clients" className="gap-2 flex-1 min-w-[120px]">
                        <Users className="h-3.5 w-3.5" /> Client Profiling
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="revenue" className="space-y-6 animate-in fade-in slide-in-from-top-2">
                    <div className="grid gap-6 md:grid-cols-3">
                        <Card className="md:col-span-2 bg-card">
                            <CardHeader>
                                <CardTitle>Revenue Flow (Daily)</CardTitle>
                                <CardDescription>Yield generated specifically from charter-linked stay arrivals.</CardDescription>
                            </CardHeader>
                            <CardContent className="h-[350px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={DAILY_OCCUPANCY}>
                                        <defs>
                                            <linearGradient id="colorHotel" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                                                <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                                        <XAxis dataKey="day" stroke="#94a3b8" fontSize={10} />
                                        <YAxis stroke="#94a3b8" fontSize={10} tickFormatter={(val) => `₹${val/1000}K`} />
                                        <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b' }} />
                                        <Area type="monotone" dataKey="revenue" stroke="#10B981" fillOpacity={1} fill="url(#colorHotel)" name="Yield" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>

                        <Card className="bg-card">
                            <CardHeader>
                                <CardTitle>Category Yield</CardTitle>
                                <CardDescription>Revenue contribution by room type.</CardDescription>
                            </CardHeader>
                            <CardContent className="flex flex-col items-center justify-center h-[300px]">
                                <div className="h-[180px] w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <RePieChart>
                                            <Pie
                                                data={REVENUE_BY_ROOM}
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={60}
                                                outerRadius={80}
                                                paddingAngle={5}
                                                dataKey="value"
                                                stroke="none"
                                            >
                                                {REVENUE_BY_ROOM.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                                ))}
                                            </Pie>
                                            <Tooltip />
                                        </RePieChart>
                                    </ResponsiveContainer>
                                </div>
                                <div className="w-full space-y-2 mt-4">
                                    {REVENUE_BY_ROOM.map((item) => (
                                        <div key={item.name} className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest">
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
                </TabsContent>

                <TabsContent value="occupancy" className="space-y-6 animate-in fade-in slide-in-from-top-2">
                    <Card className="bg-card">
                        <CardHeader>
                            <CardTitle>Institutional Occupancy Trend</CardTitle>
                            <CardDescription>Tracking seasonal and weekly peaks driven by network mission arrivals.</CardDescription>
                        </CardHeader>
                        <CardContent className="h-[400px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={DAILY_OCCUPANCY}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                                    <XAxis dataKey="day" stroke="#94a3b8" fontSize={10} />
                                    <YAxis stroke="#94a3b8" fontSize={10} tickFormatter={(val) => `${val}%`} />
                                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b' }} />
                                    <Line type="monotone" dataKey="occupancy" stroke="#FFFFBD" strokeWidth={3} dot={{ fill: '#FFFFBD', r: 4 }} activeDot={{ r: 6, strokeWidth: 0 }} name="Occupancy %" />
                                </LineChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="clients" className="space-y-6 animate-in fade-in slide-in-from-top-2">
                    <div className="grid gap-6 md:grid-cols-2">
                        <Card className="bg-card">
                            <CardHeader>
                                <CardTitle>Stakeholder Profiling</CardTitle>
                                <CardDescription>Source of bookings facilitated via the AeroDesk platform.</CardDescription>
                            </CardHeader>
                            <CardContent className="flex flex-col items-center justify-center h-[300px]">
                                <div className="h-[200px] w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <RePieChart>
                                            <Pie
                                                data={CLIENT_MIX}
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={60}
                                                outerRadius={80}
                                                paddingAngle={5}
                                                dataKey="value"
                                                stroke="none"
                                            >
                                                {CLIENT_MIX.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                                ))}
                                            </Pie>
                                            <Tooltip />
                                        </RePieChart>
                                    </ResponsiveContainer>
                                </div>
                                <div className="flex justify-center gap-6 w-full mt-4">
                                    {CLIENT_MIX.map((item) => (
                                        <div key={item.name} className="flex items-center gap-2">
                                            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                                            <span className="text-[10px] text-muted-foreground uppercase font-black tracking-widest">{item.name}</span>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="bg-card">
                            <CardHeader>
                                <CardTitle>Repeat Guest Signals</CardTitle>
                                <CardDescription>Loyalty patterns from the institutional network.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6 pt-4 h-[300px] flex flex-col justify-center">
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
            </Tabs>
        </div>
    );
}
