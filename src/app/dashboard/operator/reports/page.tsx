
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
    History,
    AlertTriangle
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

// Base Mock Data
const BASE_FLEET_DATA = [
    { name: 'VT-FLY', hours: 45, idle: 12, revenue: 1850000, utilization: 72 },
    { name: 'VT-PC', hours: 32, idle: 25, revenue: 1200000, utilization: 54 },
    { name: 'VT-STK', hours: 58, idle: 5, revenue: 2450000, utilization: 88 },
    { name: 'VT-JSG', hours: 40, idle: 15, revenue: 1650000, utilization: 62 },
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

const COLORS = ['#0EA5E9', '#FFFFBD', '#F43F5E', '#10B981'];

export default function OperatorReportsPage() {
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

    const fleetData = useMemo(() => BASE_FLEET_DATA.map(d => ({
        ...d,
        hours: Math.round(d.hours * scaleFactor),
        revenue: Math.round(d.revenue * scaleFactor)
    })), [scaleFactor]);

    const stats = useMemo(() => {
        const totalRev = fleetData.reduce((acc, curr) => acc + curr.revenue, 0);
        const lostRev = Math.round(2400000 * scaleFactor);
        const elCount = Math.round(11 * scaleFactor);

        return {
            totalRevenue: new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(totalRev).replace('INR', '₹'),
            utilization: "68%",
            lostRevenue: new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(lostRev).replace('INR', '₹'),
            emptyLegs: elCount.toString()
        };
    }, [fleetData, scaleFactor]);

    return (
        <div className="space-y-6">
            <PageHeader 
                title="Aviation Intelligence & Analytics" 
                description="Fleet-wide utilization tracking, revenue lost analysis, and AI-assisted yield forecasts."
            >
                <div className="flex flex-wrap items-center gap-2">
                    <Select value={period} onValueChange={setPeriod}>
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
                    <Button variant="outline" size="sm" className="h-9 gap-2 border-white/10 font-bold uppercase text-[10px] tracking-widest">
                        <Download className="h-3.5 w-3.5" /> Export Audit
                    </Button>
                </div>
            </PageHeader>

            <StatsGrid>
                <StatsCard title="Total Revenue" value={stats.totalRevenue} icon={DollarSign} description="Gross Settled Volume" />
                <StatsCard title="Avg Utilization" value={stats.utilization} icon={Activity} description="Active Flight Hours" />
                <StatsCard title="Empty Leg Revenue Gap" value={stats.lostRevenue} icon={AlertTriangle} description="Lost Opportunity Yield" />
                <StatsCard title="Empty Legs Generated" value={stats.emptyLegs} icon={Zap} description="Current Positioning Count" />
            </StatsGrid>

            <AIInsights />

            <Tabs defaultValue="utilization" className="w-full">
                <TabsList className="bg-muted/20 border border-white/5 mb-6 p-1 h-auto flex flex-wrap">
                    <TabsTrigger value="utilization" className="gap-2 flex-1 min-w-[120px]">
                        <Plane className="h-3.5 w-3.5" /> Fleet Utilization
                    </TabsTrigger>
                    <TabsTrigger value="revenue" className="gap-2 flex-1 min-w-[120px]">
                        <DollarSign className="h-3.5 w-3.5" /> Revenue & Yield
                    </TabsTrigger>
                    <TabsTrigger value="marketplace" className="gap-2 flex-1 min-w-[120px]">
                        <Target className="h-3.5 w-3.5" /> Lead Conversion
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="utilization" className="space-y-6 animate-in fade-in slide-in-from-top-2">
                    <div className="grid gap-6 lg:grid-cols-3">
                        <Card className="lg:col-span-2 bg-card">
                            <CardHeader>
                                <CardTitle>Asset Utilization Percentage</CardTitle>
                                <CardDescription>Percentage of operational hours active vs. static positioning.</CardDescription>
                            </CardHeader>
                            <CardContent className="h-[350px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={fleetData}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                                        <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} />
                                        <YAxis stroke="#94a3b8" fontSize={10} tickFormatter={(val) => `${val}%`} />
                                        <Tooltip 
                                            contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b' }}
                                            cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                                        />
                                        <Bar dataKey="utilization" fill="#0EA5E9" radius={[4, 4, 0, 0]} name="Utilization %" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>

                        <Card className="bg-card">
                            <CardHeader>
                                <CardTitle>Revenue Gap Analysis</CardTitle>
                                <CardDescription>Lost opportunity yield from positioning flights.</CardDescription>
                            </CardHeader>
                            <CardContent className="flex flex-col items-center justify-center space-y-6 pt-2 pb-6">
                                <div className="aspect-square w-full max-w-[200px]">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <RePieChart>
                                            <Pie
                                                data={fleetData}
                                                cx="50%"
                                                cy="50%"
                                                innerRadius="60%"
                                                outerRadius="80%"
                                                paddingAngle={5}
                                                dataKey="revenueLostEmptyLegs"
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
                                <div className="w-full space-y-2">
                                    {fleetData.map((item, idx) => (
                                        <div key={item.name} className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest">
                                            <div className="flex items-center gap-2">
                                                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                                                <span className="text-muted-foreground">{item.name}</span>
                                            </div>
                                            <span className="text-rose-500">₹ {(item.revenueLostEmptyLegs! / 100000).toFixed(1)}L</span>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                <TabsContent value="revenue" className="space-y-6 animate-in fade-in slide-in-from-top-2">
                    <Card className="bg-card">
                        <CardHeader>
                            <CardTitle>Daily Yield Intensity</CardTitle>
                            <CardDescription>Mission-level gross volume flow tracking.</CardDescription>
                        </CardHeader>
                        <CardContent className="h-[400px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={REVENUE_TREND_DATA}>
                                    <defs>
                                        <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                                            <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                                    <XAxis dataKey="day" stroke="#94a3b8" fontSize={10} />
                                    <YAxis stroke="#94a3b8" fontSize={10} tickFormatter={(val) => `₹${val/100000}L`} />
                                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b' }} />
                                    <Area type="monotone" dataKey="revenue" stroke="#10B981" fillOpacity={1} fill="url(#colorRev)" name="Daily Rev" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="marketplace" className="space-y-6 animate-in fade-in slide-in-from-top-2">
                    <div className="grid gap-6 md:grid-cols-2">
                        <Card className="bg-card">
                            <CardHeader>
                                <CardTitle>Marketplace Funnel</CardTitle>
                                <CardDescription>Inquiries vs. Quotations vs. Accepted Missions.</CardDescription>
                            </CardHeader>
                            <CardContent className="h-[300px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={BASE_CHARTER_DATA}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                                        <XAxis dataKey="month" stroke="#94a3b8" fontSize={10} />
                                        <YAxis stroke="#94a3b8" fontSize={10} />
                                        <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b' }} />
                                        <Bar dataKey="received" fill="#1e293b" radius={[4, 4, 0, 0]} name="RFQs" />
                                        <Bar dataKey="quoted" fill="#0EA5E9" radius={[4, 4, 0, 0]} name="Bids" />
                                        <Bar dataKey="accepted" fill="#10B981" radius={[4, 4, 0, 0]} name="Won" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>

                        <Card className="bg-card flex flex-col justify-center">
                            <CardHeader>
                                <CardTitle>Conversion Intelligence</CardTitle>
                                <CardDescription>Institutional marketplace performance signals.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="space-y-2">
                                    <div className="flex justify-between text-[10px] uppercase font-bold text-muted-foreground">
                                        <span>Bid Response Rate</span>
                                        <span className="text-primary">84.2%</span>
                                    </div>
                                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                        <div className="h-full bg-primary w-[84%]" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex justify-between text-[10px] uppercase font-bold text-muted-foreground">
                                        <span>Commercial Win Ratio</span>
                                        <span className="text-emerald-500">28.5%</span>
                                    </div>
                                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                        <div className="h-full bg-emerald-500 w-[28%]" />
                                    </div>
                                </div>
                                <div className="p-4 rounded-xl bg-accent/5 border border-accent/10 space-y-1">
                                    <p className="text-[10px] font-bold text-accent uppercase tracking-widest">Market Status</p>
                                    <p className="text-lg font-black text-foreground">LEADERBOARD TOP 5</p>
                                    <p className="text-[10px] text-muted-foreground italic">Maintaining optimal quotation latency of 1.4 hours.</p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}
