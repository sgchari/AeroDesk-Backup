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
    Area
} from 'recharts';
import { 
    Plane, 
    TrendingUp, 
    DollarSign, 
    Users, 
    Clock, 
    Download, 
    Filter,
    Activity,
    Target,
    Zap,
    History
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useUser } from "@/hooks/use-user";
import { AIInsights } from "@/components/dashboard/operator/reports/ai-insights";
import { useState, useMemo } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

// Base Mock Data (representing 30 days)
const BASE_FLEET_DATA = [
    { name: 'VT-FLY', hours: 45, idle: 12, revenue: 1850000 },
    { name: 'VT-PC', hours: 32, idle: 25, revenue: 1200000 },
    { name: 'VT-STK', hours: 58, idle: 5, revenue: 2450000 },
    { name: 'VT-JSG', hours: 40, idle: 15, revenue: 1650000 },
];

const BASE_CHARTER_DATA = [
    { month: 'May', received: 45, quoted: 38, accepted: 12, revenue: 4200000 },
    { month: 'Jun', received: 52, quoted: 44, accepted: 15, revenue: 5800000 },
    { month: 'Jul', received: 68, quoted: 55, accepted: 22, revenue: 8100000 },
];

const REVENUE_TREND_DATA = [
    { day: 'Mon', revenue: 1200000 },
    { day: 'Tue', revenue: 900000 },
    { day: 'Wed', revenue: 1500000 },
    { day: 'Thu', revenue: 2100000 },
    { day: 'Fri', revenue: 1800000 },
    { day: 'Sat', revenue: 2400000 },
    { day: 'Sun', revenue: 1100000 },
];

const SECTOR_YIELD_DATA = [
    { sector: 'BOM-DEL', count: 18, yield: 1.2, revenue: 4500000 },
    { sector: 'DEL-LHR', count: 5, yield: 1.8, revenue: 12000000 },
    { sector: 'BLR-GOI', count: 12, yield: 0.9, revenue: 2400000 },
    { sector: 'MAA-SIN', count: 3, yield: 1.5, revenue: 6800000 },
];

const COLORS = ['#0EA5E9', '#FFFFBD', '#F43F5E', '#10B981'];

export default function OperatorReportsPage() {
    const { user } = useUser();
    const { toast } = useToast();
    const [period, setPeriod] = useState("30d");

    // Dynamic scale factors based on period
    const scaleFactor = useMemo(() => {
        switch (period) {
            case '7d': return 0.25;
            case '30d': return 1;
            case '90d': return 2.8;
            case 'ytd': return 6.5;
            default: return 1;
        }
    }, [period]);

    // Derived Scaled Data
    const fleetData = useMemo(() => BASE_FLEET_DATA.map(d => ({
        ...d,
        hours: Math.round(d.hours * scaleFactor),
        revenue: Math.round(d.revenue * scaleFactor)
    })), [scaleFactor]);

    const sectorData = useMemo(() => SECTOR_YIELD_DATA.map(d => ({
        ...d,
        count: Math.round(d.count * scaleFactor),
        revenue: Math.round(d.revenue * scaleFactor)
    })), [scaleFactor]);

    const revenueTrend = useMemo(() => REVENUE_TREND_DATA.map(d => ({
        ...d,
        revenue: Math.round(d.revenue * (scaleFactor < 1 ? scaleFactor * 4 : 1)) // Keep daily lines meaningful
    })), [scaleFactor]);

    const stats = useMemo(() => {
        const totalRev = fleetData.reduce((acc, curr) => acc + curr.revenue, 0);
        const elRev = Math.round(820000 * scaleFactor);
        const avgValue = 1250000; // Remains stable per mission

        return {
            totalRevenue: new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(totalRev).replace('INR', '₹'),
            charterShare: "94%",
            emptyLegYield: new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(elRev).replace('INR', '₹'),
            avgMission: new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(avgValue).replace('INR', '₹')
        };
    }, [fleetData, scaleFactor]);

    const handlePeriodChange = (value: string) => {
        setPeriod(value);
        toast({
            title: "Analytical Scope Updated",
            description: `Now viewing institutional metrics for the last ${value === '7d' ? '7 days' : value === '30d' ? '30 days' : value === '90d' ? 'quarter' : 'year'}.`,
        });
    };

    return (
        <div className="space-y-6">
            <PageHeader 
                title="Revenue Analytics" 
                description="Institutional visibility into fleet profitability, mission yield, and AI-assisted performance signals."
            >
                <div className="flex flex-wrap items-center gap-2">
                    <Select value={period} onValueChange={handlePeriodChange}>
                        <SelectTrigger className="h-9 w-[140px] bg-muted/20 border-white/10 text-xs gap-2">
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
                    <Button variant="outline" size="sm" className="h-9 gap-2 border-white/10 font-bold uppercase text-[10px] tracking-widest hidden sm:flex">
                        <Download className="h-3.5 w-3.5" /> Export
                    </Button>
                </div>
            </PageHeader>

            <StatsGrid>
                <StatsCard title="Total Gross Revenue" value={stats.totalRevenue} icon={DollarSign} description="Actual + Confirmed Bids" />
                <StatsCard title="Charter Contribution" value={stats.charterShare} icon={Target} description="Full mission share" />
                <StatsCard title="Empty Leg Yield" value={stats.emptyLegYield} icon={Zap} description="Recovery revenue" />
                <StatsCard title="Avg. Mission Value" value={stats.avgMission} icon={TrendingUp} description="Per confirmed charter" />
            </StatsGrid>

            <div className="space-y-6">
                <AIInsights />

                <Tabs defaultValue="revenue" className="w-full">
                    <TabsList className="bg-muted/20 border border-white/5 mb-6 p-1 h-auto flex flex-wrap">
                        <TabsTrigger value="revenue" className="gap-2 flex-1 min-w-[120px]">
                            <DollarSign className="h-3.5 w-3.5" /> Revenue & Yield
                        </TabsTrigger>
                        <TabsTrigger value="fleet" className="gap-2 flex-1 min-w-[120px]">
                            <Plane className="h-3.5 w-3.5" /> Asset Profit
                        </TabsTrigger>
                        <TabsTrigger value="sectors" className="gap-2 flex-1 min-w-[120px]">
                            <History className="h-3.5 w-3.5" /> Sector Yield
                        </TabsTrigger>
                        <TabsTrigger value="funnel" className="gap-2 flex-1 min-w-[120px]">
                            <Activity className="h-3.5 w-3.5" /> Marketplace
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="revenue" className="space-y-6 animate-in fade-in slide-in-from-top-2">
                        <div className="grid gap-6 lg:grid-cols-3">
                            <Card className="lg:col-span-2 bg-card">
                                <CardHeader>
                                    <CardTitle>Daily Yield Trend</CardTitle>
                                    <CardDescription>Consolidated revenue flow across all active missions.</CardDescription>
                                </CardHeader>
                                <CardContent className="h-[300px] sm:h-[350px]">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <LineChart data={revenueTrend}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                                            <XAxis dataKey="day" stroke="#94a3b8" fontSize={10} />
                                            <YAxis stroke="#94a3b8" fontSize={10} tickFormatter={(val) => `₹${val/100000}L`} />
                                            <Tooltip 
                                                formatter={(val: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(val)}
                                                contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b' }}
                                            />
                                            <Line type="monotone" dataKey="revenue" stroke="#FFFFBD" strokeWidth={3} dot={{ fill: '#FFFFBD', r: 4 }} activeDot={{ r: 6, strokeWidth: 0 }} />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </CardContent>
                            </Card>

                            <Card className="bg-card">
                                <CardHeader>
                                    <CardTitle>Yield Indicators</CardTitle>
                                    <CardDescription>Institutional margin signals.</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-xs uppercase font-bold text-muted-foreground">
                                            <span>Rev / Flight Hour</span>
                                            <span className="text-accent">₹ 1.8 L</span>
                                        </div>
                                        <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                            <div className="h-full bg-accent w-[75%]" />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-xs uppercase font-bold text-muted-foreground">
                                            <span>Rev / Sector</span>
                                            <span className="text-sky-400">₹ 4.2 L</span>
                                        </div>
                                        <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                            <div className="h-full bg-sky-400 w-[60%]" />
                                        </div>
                                    </div>
                                    <Separator className="bg-white/5" />
                                    <div className="p-3 rounded-lg bg-accent/5 border border-accent/10">
                                        <div className="flex items-center gap-2 mb-1">
                                            <Target className="h-3 w-3 text-accent" />
                                            <span className="text-[10px] font-bold text-accent uppercase">Yield Target</span>
                                        </div>
                                        <p className="text-[10px] text-muted-foreground">Maintain &gt; ₹ 1.5 L / FH for heavy-jet category fleet sustainment.</p>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>

                    <TabsContent value="fleet" className="space-y-6 animate-in fade-in slide-in-from-top-2">
                        <div className="grid gap-6 md:grid-cols-2">
                            <Card className="bg-card">
                                <CardHeader>
                                    <CardTitle>Asset Revenue Mix</CardTitle>
                                    <CardDescription>Individual contribution to monthly gross volume.</CardDescription>
                                </CardHeader>
                                <CardContent className="h-[300px]">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={fleetData}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                                            <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} />
                                            <YAxis stroke="#94a3b8" fontSize={10} tickFormatter={(val) => `₹${val/100000}L`} />
                                            <Tooltip 
                                                formatter={(val: number) => `₹${val/100000}L`}
                                                contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b' }}
                                            />
                                            <Bar dataKey="revenue" fill="#0EA5E9" radius={[4, 4, 0, 0]} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </CardContent>
                            </Card>

                            <Card className="bg-card">
                                <CardHeader>
                                    <CardTitle>Utilization Mix</CardTitle>
                                    <CardDescription>Flight hours distribution across registered registry.</CardDescription>
                                </CardHeader>
                                <CardContent className="h-[300px] flex flex-col items-center">
                                    <div className="flex-1 w-full min-h-0">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <RePieChart>
                                                <Pie
                                                    data={fleetData}
                                                    cx="50%"
                                                    cy="50%"
                                                    innerRadius={60}
                                                    outerRadius={80}
                                                    paddingAngle={5}
                                                    dataKey="hours"
                                                    stroke="none"
                                                >
                                                    {fleetData.map((entry, index) => (
                                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                    ))}
                                                </Pie>
                                                <Tooltip />
                                            </RePieChart>
                                        </ResponsiveContainer>
                                    </div>
                                    <div className="flex flex-wrap justify-center gap-4 mt-2">
                                        {fleetData.map((entry, index) => (
                                            <div key={entry.name} className="flex items-center gap-1.5">
                                                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                                                <span className="text-[10px] text-muted-foreground font-black uppercase">{entry.name}</span>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>

                    <TabsContent value="sectors" className="space-y-6 animate-in fade-in slide-in-from-top-2">
                        <Card className="bg-card">
                            <CardHeader>
                                <CardTitle>Sector Performance</CardTitle>
                                <CardDescription>Route performance tracked by commercial density and mission frequency.</CardDescription>
                            </CardHeader>
                            <CardContent className="h-[300px] sm:h-[400px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={sectorData} layout="vertical">
                                        <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" horizontal={false} />
                                        <XAxis type="number" hide />
                                        <YAxis dataKey="sector" type="category" stroke="#94a3b8" fontSize={10} width={80} />
                                        <Tooltip 
                                            formatter={(val: number) => `₹${val/100000}L`}
                                            contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b' }}
                                        />
                                        <Bar dataKey="revenue" fill="#10B981" radius={[0, 4, 4, 0]} name="Sector Revenue" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="funnel" className="space-y-6 animate-in fade-in slide-in-from-top-2">
                        <Card className="bg-card">
                            <CardHeader>
                                <CardTitle>Marketplace Funnel</CardTitle>
                                <CardDescription>Realization of monthly commercial volume.</CardDescription>
                            </CardHeader>
                            <CardContent className="h-[300px] sm:h-[400px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={BASE_CHARTER_DATA}>
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
                                        <Area type="monotone" dataKey="revenue" stroke="#10B981" fillOpacity={1} fill="url(#colorRev)" name="Monthly Revenue" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}
