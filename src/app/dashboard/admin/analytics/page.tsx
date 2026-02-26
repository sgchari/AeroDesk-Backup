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
    { name: 'Charter', value: 65, color: '#0EA5E9' },
    { name: 'Seat', value: 25, color: '#EEDC5B' },
    { name: 'Stay', value: 10, color: '#10B981' },
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
            description: `Now analyzing platform behavior for the ${value === '7d' ? 'last 7 days' : value === '30d' ? 'last 30 days' : value === '90d' ? 'last quarter' : 'current year'}.`,
        });
    };

    return (
        <>
            <PageHeader 
                title="Platform Intelligence Center" 
                description="Cross-stakeholder situational awareness, monetization tracking, and systemic health monitoring."
            >
                <div className="flex gap-2">
                    <Select value={period} onValueChange={handlePeriodChange}>
                        <SelectTrigger className="h-9 w-[160px] bg-muted/20 border-white/10 text-xs gap-2">
                            <Filter className="h-3.5 w-3.5 text-primary" />
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
                <StatsCard title="Gross Transaction Value" value={stats.gtv} icon={DollarSign} description="Platform commercial volume" />
                <StatsCard title="Marketplace Health" value={stats.healthScore} icon={Activity} description="System-wide success rate" />
                <StatsCard title="Active Stakeholders" value={stats.activeStakeholders.toString()} icon={Users} description="Operators, Agents, Hotels" />
                <StatsCard title="Monetization Ratio" value={stats.monetizationEfficiency} icon={Target} description="Fees / Transaction volume" />
            </StatsGrid>

            <div className="mt-6 space-y-6">
                <AIPlatformInsights />

                <Tabs defaultValue="activity" className="w-full">
                    <TabsList className="bg-muted/20 border border-white/5 mb-6 p-1">
                        <TabsTrigger value="activity" className="gap-2">
                            <Globe className="h-3.5 w-3.5" /> Marketplace Health
                        </TabsTrigger>
                        <TabsTrigger value="revenue" className="gap-2">
                            <DollarSign className="h-3.5 w-3.5" /> Monetization
                        </TabsTrigger>
                        <TabsTrigger value="performance" className="gap-2">
                            <ShieldCheck className="h-3.5 w-3.5" /> Operational Integrity
                        </TabsTrigger>
                        <TabsTrigger value="dynamics" className="gap-2">
                            <Zap className="h-3.5 w-3.5" /> Supply/Demand
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="activity" className="space-y-6 animate-in fade-in slide-in-from-top-2">
                        <div className="grid gap-6 md:grid-cols-3">
                            <Card className="md:col-span-2 bg-card">
                                <CardHeader>
                                    <CardTitle>Platform Activity Intensity</CardTitle>
                                    <CardDescription>Daily volume of Charter vs. Seat requests across the ecosystem.</CardDescription>
                                </CardHeader>
                                <CardContent className="h-[350px]">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart data={activityData}>
                                            <defs>
                                                <linearGradient id="colorChar" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#0EA5E9" stopOpacity={0.3}/>
                                                    <stop offset="95%" stopColor="#0EA5E9" stopOpacity={0}/>
                                                </linearGradient>
                                                <linearGradient id="colorSeat" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#EEDC5B" stopOpacity={0.3}/>
                                                    <stop offset="95%" stopColor="#EEDC5B" stopOpacity={0}/>
                                                </linearGradient>
                                            </defs>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                                            <XAxis dataKey="day" stroke="#94a3b8" fontSize={10} />
                                            <YAxis stroke="#94a3b8" fontSize={10} />
                                            <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b' }} />
                                            <Area type="monotone" dataKey="charters" stroke="#0EA5E9" fillOpacity={1} fill="url(#colorChar)" name="Charter RFQs" />
                                            <Area type="monotone" dataKey="seats" stroke="#EEDC5B" fillOpacity={1} fill="url(#colorSeat)" name="Seat Requests" />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </CardContent>
                            </Card>

                            <Card className="bg-card">
                                <CardHeader>
                                    <CardTitle>Stakeholder Mix</CardTitle>
                                    <CardDescription>Active platform participants by role.</CardDescription>
                                </CardHeader>
                                <CardContent className="h-[250px] flex flex-col justify-center">
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
                                        <div className="flex items-center justify-between text-[10px] font-bold uppercase">
                                            <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-sky-500" /> Operators</div>
                                            <span>42%</span>
                                        </div>
                                        <div className="flex items-center justify-between text-[10px] font-bold uppercase">
                                            <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-amber-400" /> Agencies</div>
                                            <span>38%</span>
                                        </div>
                                        <div className="flex items-center justify-between text-[10px] font-bold uppercase">
                                            <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-green-500" /> Hotels</div>
                                            <span>20%</span>
                                        </div>
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
                                            <Bar dataKey="value" fill="#0EA5E9" radius={[4, 4, 0, 0]} name="GTV Contribution %" />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </CardContent>
                            </Card>

                            <Card className="bg-card flex flex-col justify-center">
                                <CardHeader>
                                    <CardTitle>Platform Revenue Indicators</CardTitle>
                                    <CardDescription>Institutional commercial health signals.</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-xs uppercase font-bold text-muted-foreground">
                                            <span>Participation Fee Capture</span>
                                            <span className="text-primary">98.2%</span>
                                        </div>
                                        <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                            <div className="h-full bg-primary w-[98%]" />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-xs uppercase font-bold text-muted-foreground">
                                            <span>Coordination Fee Yield</span>
                                            <span className="text-emerald-500">₹ 4.2 L / Day</span>
                                        </div>
                                        <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                            <div className="h-full bg-emerald-500 w-[72%]" />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-xs uppercase font-bold text-muted-foreground">
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
                                <CardDescription>Tracking activity intensity vs. response health across operational zones.</CardDescription>
                            </CardHeader>
                            <CardContent className="h-[400px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={REGIONAL_PERFORMANCE} layout="vertical">
                                        <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" horizontal={false} />
                                        <XAxis type="number" hide />
                                        <YAxis dataKey="zone" type="category" stroke="#94a3b8" fontSize={10} width={80} />
                                        <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b' }} />
                                        <Bar dataKey="activity" fill="#0EA5E9" name="Activity Intensity" radius={[0, 4, 4, 0]} />
                                        <Bar dataKey="health" fill="#10B981" name="Ecosystem Health %" radius={[0, 4, 4, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="dynamics" className="space-y-6 animate-in fade-in slide-in-from-top-2">
                        <div className="grid gap-6 md:grid-cols-2">
                            <Card className="bg-card">
                                <CardHeader>
                                    <CardTitle>System Efficiency Signals</CardTitle>
                                    <CardDescription>Identifying bottlenecks in the request lifecycle.</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6 py-4">
                                    <div className="p-4 rounded-xl bg-primary/5 border border-primary/10 flex items-center gap-4">
                                        <div className="p-2 bg-primary/10 rounded-full"><Clock className="h-5 w-5 text-primary" /></div>
                                        <div>
                                            <p className="text-[10px] font-bold text-muted-foreground uppercase">Avg. Operator Response</p>
                                            <p className="text-lg font-black text-foreground tracking-tighter">2.4 Hours</p>
                                        </div>
                                        <Badge className="ml-auto bg-green-500/20 text-green-500 border-none h-5">-12% vs. Last Period</Badge>
                                    </div>
                                    <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/10 flex items-center gap-4">
                                        <div className="p-2 bg-emerald-500/10 rounded-full"><CheckCircle2 className="h-5 w-5 text-emerald-500" /></div>
                                        <div>
                                            <p className="text-[10px] font-bold text-muted-foreground uppercase">Platform Conversion</p>
                                            <p className="text-lg font-black text-foreground tracking-tighter">18.5%</p>
                                        </div>
                                        <Badge className="ml-auto bg-primary/20 text-primary border-none h-5">+2.4% Optimal</Badge>
                                    </div>
                                    <div className="p-4 rounded-xl bg-rose-500/5 border border-rose-500/10 flex items-center gap-4">
                                        <div className="p-2 bg-rose-500/10 rounded-full"><AlertTriangle className="h-5 w-5 text-rose-500" /></div>
                                        <div>
                                            <p className="text-[10px] font-bold text-muted-foreground uppercase">RFQ Expiry Rate</p>
                                            <p className="text-lg font-black text-foreground tracking-tighter">4.2%</p>
                                        </div>
                                        <Badge variant="outline" className="ml-auto h-5">Within Guardrails</Badge>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="bg-card">
                                <CardHeader>
                                    <CardTitle>Marketplace Elasticity Map</CardTitle>
                                    <CardDescription>Regional Supply vs Demand Intensity and Pressure Signals.</CardDescription>
                                </CardHeader>
                                <CardContent className="h-[300px]">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <ComposedChart data={MARKET_ELASTICITY_DATA}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                                            <XAxis dataKey="zone" stroke="#94a3b8" fontSize={10} />
                                            <YAxis yAxisId="left" stroke="#94a3b8" fontSize={10} />
                                            <YAxis yAxisId="right" orientation="right" stroke="#EEDC5B" fontSize={10} domain={[0, 3]} />
                                            <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b' }} />
                                            <Legend />
                                            <Bar yAxisId="left" dataKey="supply" name="Active Supply (Assets)" fill="#0EA5E9" radius={[4, 4, 0, 0]} />
                                            <Bar yAxisId="left" dataKey="demand" name="Market Demand (RFQs)" fill="#10B981" radius={[4, 4, 0, 0]} />
                                            <Line yAxisId="right" type="monotone" dataKey="pressure" name="Sector Pressure Index" stroke="#EEDC5B" strokeWidth={2} dot={{ fill: '#EEDC5B' }} />
                                        </ComposedChart>
                                    </ResponsiveContainer>
                                    <div className="mt-4 flex items-center justify-between p-2 rounded bg-accent/5 border border-accent/10">
                                        <div className="flex items-center gap-2">
                                            <Scale className="h-3.5 w-3.5 text-accent" />
                                            <span className="text-[10px] font-bold text-accent uppercase">Pressure Alert</span>
                                        </div>
                                        <span className="text-[10px] text-muted-foreground italic">High Pressure detected in East Zone sectors.</span>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </>
    );
}
