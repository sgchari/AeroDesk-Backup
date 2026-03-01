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
    ComposedChart,
    Legend
} from 'recharts';
import { 
    Activity, 
    TrendingUp, 
    DollarSign, 
    Users, 
    Filter, 
    Download, 
    ShieldCheck, 
    Zap, 
    Target, 
    BarChart2, 
    Globe,
    AlertTriangle,
    CheckCircle2,
    Clock,
    Scale
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useState, useMemo } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { AIPlatformInsights } from "@/components/dashboard/admin/analytics/ai-platform-insights";

// --- MOCK DATA ---
const BASE_ACTIVITY_DATA = [
    { day: 'Mon', charters: 45, seats: 120, conversions: 12 },
    { day: 'Tue', charters: 38, seats: 95, conversions: 15 },
    { day: 'Wed', charters: 52, seats: 140, conversions: 18 },
    { day: 'Thu', charters: 65, seats: 180, conversions: 22 },
    { day: 'Fri', charters: 58, seats: 160, conversions: 20 },
    { day: 'Sat', charters: 72, seats: 210, conversions: 28 },
    { day: 'Sun', charters: 48, seats: 110, conversions: 14 },
];

const BASE_REVENUE_DATA = [
    { name: 'Operators', value: 42, color: '#0EA5E9' },
    { name: 'Agencies', value: 38, color: '#FFFFBD' },
    { name: 'Hotels', value: 20, color: '#10B981' },
];

const REGIONAL_PERFORMANCE = [
    { zone: 'North', activity: 85, latency: 1.2, health: 92 },
    { zone: 'West', activity: 72, latency: 1.5, health: 88 },
    { zone: 'South', activity: 64, latency: 1.1, health: 95 },
    { zone: 'East', activity: 32, latency: 2.4, health: 78 },
    { zone: 'Central', activity: 28, latency: 1.8, health: 84 },
];

const MARKET_ELASTICITY_DATA = [
    { zone: 'North', supply: 45, demand: 82, pressure: 1.8 },
    { zone: 'West', supply: 62, demand: 58, pressure: 0.9 },
    { zone: 'South', supply: 38, demand: 42, pressure: 1.1 },
    { zone: 'East', supply: 12, demand: 28, pressure: 2.3 },
    { zone: 'Central', supply: 25, demand: 18, pressure: 0.7 },
];

export default function PortalAdminAnalyticsPage() {
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

    const activityData = useMemo(() => BASE_ACTIVITY_DATA.map(d => ({
        ...d,
        charters: Math.round(d.charters * (scaleFactor < 1 ? scaleFactor * 2 : 1)),
        seats: Math.round(d.seats * (scaleFactor < 1 ? scaleFactor * 2 : 1))
    })), [scaleFactor]);

    const stats = useMemo(() => ({
        gtv: new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(42500000 * scaleFactor).replace('INR', '₹'),
        healthScore: "94%",
        activeStakeholders: Math.round(124 * (scaleFactor < 1 ? 1 : scaleFactor * 0.8)),
        monetizationEfficiency: "8.2%"
    }), [scaleFactor]);

    const handlePeriodChange = (value: string) => {
        setPeriod(value);
        toast({
            title: "Governance Period Updated",
            description: `Now analyzing platform behavior for the selected timeframe.`,
        });
    };

    return (
        <div className="space-y-6">
            <PageHeader 
                title="Intelligence Center" 
                description="Cross-stakeholder situational awareness and monetization tracking."
            >
                <div className="flex flex-wrap items-center gap-2">
                    <Select value={period} onValueChange={handlePeriodChange}>
                        <SelectTrigger className="h-9 w-[140px] bg-muted/20 border-white/10 text-xs gap-2">
                            <Filter className="h-3.5 w-3.5 text-primary" />
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
                        <Download className="h-3.5 w-3.5" /> Export
                    </Button>
                </div>
            </PageHeader>

            <StatsGrid>
                <StatsCard title="Gross Transaction Value" value={stats.gtv} icon={DollarSign} description="Commercial volume" />
                <StatsCard title="Marketplace Health" value={stats.healthScore} icon={Activity} description="System-wide success" />
                <StatsCard title="Active Stakeholders" value={stats.activeStakeholders.toString()} icon={Users} description="Operators, Agents, Hotels" />
                <StatsCard title="Monetization Ratio" value={stats.monetizationEfficiency} icon={Target} description="Fees / Volume" />
            </StatsGrid>

            <AIPlatformInsights />

            <Tabs defaultValue="activity" className="w-full">
                <TabsList className="bg-muted/20 border border-white/5 mb-6 p-1 h-auto flex flex-wrap">
                    <TabsTrigger value="activity" className="gap-2 flex-1 min-w-[120px]">
                        <Globe className="h-3.5 w-3.5" /> Marketplace
                    </TabsTrigger>
                    <TabsTrigger value="revenue" className="gap-2 flex-1 min-w-[120px]">
                        <DollarSign className="h-3.5 w-3.5" /> Monetization
                    </TabsTrigger>
                    <TabsTrigger value="performance" className="gap-2 flex-1 min-w-[120px]">
                        <ShieldCheck className="h-3.5 w-3.5" /> Integrity
                    </TabsTrigger>
                    <TabsTrigger value="dynamics" className="gap-2 flex-1 min-w-[120px]">
                        <Zap className="h-3.5 w-3.5" /> Supply/Demand
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="activity" className="space-y-6 animate-in fade-in slide-in-from-top-2">
                    <div className="grid gap-6 lg:grid-cols-3">
                        <Card className="lg:col-span-2 bg-card">
                            <CardHeader>
                                <CardTitle>Platform Activity Intensity</CardTitle>
                                <CardDescription>Daily volume of Charter vs. Seat requests.</CardDescription>
                            </CardHeader>
                            <CardContent className="h-[300px] sm:h-[350px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={activityData}>
                                        <defs>
                                            <linearGradient id="colorChar" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#0EA5E9" stopOpacity={0.3}/>
                                                <stop offset="95%" stopColor="#0EA5E9" stopOpacity={0}/>
                                            </linearGradient>
                                            <linearGradient id="colorSeat" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#FFFFBD" stopOpacity={0.3}/>
                                                <stop offset="95%" stopColor="#FFFFBD" stopOpacity={0}/>
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                                        <XAxis dataKey="day" stroke="#94a3b8" fontSize={10} />
                                        <YAxis stroke="#94a3b8" fontSize={10} />
                                        <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b' }} />
                                        <Area type="monotone" dataKey="charters" stroke="#0EA5E9" fillOpacity={1} fill="url(#colorChar)" name="Charters" />
                                        <Area type="monotone" dataKey="seats" stroke="#FFFFBD" fillOpacity={1} fill="url(#colorSeat)" name="Seats" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>

                        <Card className="bg-card">
                            <CardHeader>
                                <CardTitle>Stakeholder Mix</CardTitle>
                                <CardDescription>Active platform participants by role.</CardDescription>
                            </CardHeader>
                            <CardContent className="flex flex-col items-center justify-center space-y-6 pt-2 pb-6">
                                <div className="aspect-square w-full max-w-[200px]">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <RePieChart>
                                            <Pie
                                                data={BASE_REVENUE_DATA}
                                                cx="50%"
                                                cy="50%"
                                                innerRadius="60%"
                                                outerRadius="80%"
                                                paddingAngle={5}
                                                dataKey="value"
                                                stroke="none"
                                            >
                                                {BASE_REVENUE_DATA.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                                ))}
                                            </Pie>
                                            <Tooltip />
                                        </RePieChart>
                                    </ResponsiveContainer>
                                </div>
                                <div className="w-full space-y-2">
                                    {BASE_REVENUE_DATA.map(item => (
                                        <div key={item.name} className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest">
                                            <div className="flex items-center gap-2">
                                                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
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

                <TabsContent value="revenue" className="space-y-6 animate-in fade-in slide-in-from-top-2">
                    <div className="grid gap-6 md:grid-cols-2">
                        <Card className="bg-card">
                            <CardHeader>
                                <CardTitle>Platform Monetization Mix</CardTitle>
                                <CardDescription>GTV contribution by core business line.</CardDescription>
                            </CardHeader>
                            <CardContent className="h-[300px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={BASE_REVENUE_DATA}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                                        <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} />
                                        <YAxis stroke="#94a3b8" fontSize={10} />
                                        <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b' }} />
                                        <Bar dataKey="value" fill="#0EA5E9" radius={[4, 4, 0, 0]} name="GTV %" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>

                        <Card className="bg-card flex flex-col justify-center">
                            <CardHeader>
                                <CardTitle>Revenue Indicators</CardTitle>
                                <CardDescription>Institutional signals.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="space-y-2">
                                    <div className="flex justify-between text-[10px] uppercase font-bold text-muted-foreground">
                                        <span>Fee Capture</span>
                                        <span className="text-primary">98.2%</span>
                                    </div>
                                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                        <div className="h-full bg-primary w-[98%]" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex justify-between text-[10px] uppercase font-bold text-muted-foreground">
                                        <span>Coordination Yield</span>
                                        <span className="text-emerald-500">₹ 4.2 L / Day</span>
                                    </div>
                                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                        <div className="h-full bg-emerald-500 w-[72%]" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex justify-between text-[10px] uppercase font-bold text-muted-foreground">
                                        <span>Unrecovered Lead Value</span>
                                        <span className="text-rose-500">Low (₹ 85k)</span>
                                    </div>
                                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                        <div className="h-full bg-rose-500 w-[15%]" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                <TabsContent value="performance" className="space-y-6 animate-in fade-in slide-in-from-top-2">
                    <Card className="bg-card">
                        <CardHeader>
                            <CardTitle>Regional Ecosystem Performance</CardTitle>
                            <CardDescription>Activity intensity vs. response health.</CardDescription>
                        </CardHeader>
                        <CardContent className="h-[300px] sm:h-[400px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={REGIONAL_PERFORMANCE} layout="vertical">
                                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" horizontal={false} />
                                    <XAxis type="number" hide />
                                    <YAxis dataKey="zone" type="category" stroke="#94a3b8" fontSize={10} width={70} />
                                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b' }} />
                                    <Bar dataKey="activity" fill="#0EA5E9" name="Activity" radius={[0, 4, 4, 0]} />
                                    <Bar dataKey="health" fill="#10B981" name="Health %" radius={[0, 4, 4, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="dynamics" className="space-y-6 animate-in fade-in slide-in-from-top-2">
                    <div className="grid gap-6 lg:grid-cols-2">
                        <Card className="bg-card">
                            <CardHeader>
                                <CardTitle>System Efficiency Signals</CardTitle>
                                <CardDescription>Identifying lifecycle bottlenecks.</CardDescription>
                            </CardHeader>
                            <CardContent className="grid gap-4 py-4">
                                <div className="p-4 rounded-xl bg-primary/5 border border-primary/10 flex items-center gap-4">
                                    <div className="p-2 bg-primary/10 rounded-full shrink-0"><Clock className="h-5 w-5 text-primary" /></div>
                                    <div>
                                        <p className="text-[10px] font-bold text-muted-foreground uppercase">Avg. Response</p>
                                        <p className="text-lg font-black text-foreground tracking-tighter">2.4 Hours</p>
                                    </div>
                                    <Badge className="ml-auto bg-green-500/20 text-green-500 border-none hidden sm:flex">-12%</Badge>
                                </div>
                                <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/10 flex items-center gap-4">
                                    <div className="p-2 bg-emerald-500/10 rounded-full shrink-0"><CheckCircle2 className="h-5 w-5 text-emerald-500" /></div>
                                    <div>
                                        <p className="text-[10px] font-bold text-muted-foreground uppercase">Conversion</p>
                                        <p className="text-lg font-black text-foreground tracking-tighter">18.5%</p>
                                    </div>
                                    <Badge className="ml-auto bg-primary/20 text-primary border-none hidden sm:flex">Optimal</Badge>
                                </div>
                                <div className="p-4 rounded-xl bg-rose-500/5 border border-rose-500/10 flex items-center gap-4">
                                    <div className="p-2 bg-rose-500/10 rounded-full shrink-0"><AlertTriangle className="h-5 w-5 text-rose-500" /></div>
                                    <div>
                                        <p className="text-[10px] font-bold text-muted-foreground uppercase">Expiry Rate</p>
                                        <p className="text-lg font-black text-foreground tracking-tighter">4.2%</p>
                                    </div>
                                    <Badge variant="outline" className="ml-auto hidden sm:flex">Safe</Badge>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="bg-card">
                            <CardHeader>
                                <CardTitle>Marketplace Elasticity Map</CardTitle>
                                <CardDescription>Supply vs Demand Intensity.</CardDescription>
                            </CardHeader>
                            <CardContent className="h-[300px] flex flex-col">
                                <div className="flex-1 min-h-0">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <ComposedChart data={MARKET_ELASTICITY_DATA}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                                            <XAxis dataKey="zone" stroke="#94a3b8" fontSize={10} />
                                            <YAxis yAxisId="left" stroke="#94a3b8" fontSize={10} />
                                            <YAxis yAxisId="right" orientation="right" stroke="#FFFFBD" fontSize={10} domain={[0, 3]} />
                                            <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b' }} />
                                            <Bar yAxisId="left" dataKey="supply" name="Supply" fill="#0EA5E9" radius={[4, 4, 0, 0]} barSize={20} />
                                            <Bar yAxisId="left" dataKey="demand" name="Demand" fill="#10B981" radius={[4, 4, 0, 0]} barSize={20} />
                                            <Line yAxisId="right" type="monotone" dataKey="pressure" name="Pressure" stroke="#FFFFBD" strokeWidth={2} dot={{ fill: '#FFFFBD' }} />
                                        </ComposedChart>
                                    </ResponsiveContainer>
                                </div>
                                <div className="mt-4 flex items-center justify-between p-2.5 rounded bg-accent/5 border border-accent/10">
                                    <div className="flex items-center gap-2">
                                        <Scale className="h-3.5 w-3.5 text-accent" />
                                        <span className="text-[10px] font-bold text-accent uppercase">Pressure Alert</span>
                                    </div>
                                    <span className="text-[9px] text-muted-foreground italic hidden sm:block">East Zone sectors flagged.</span>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}
