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

const fleetUtilizationData = [
    { name: 'VT-FLY', hours: 45, idle: 12, revenue: 1850000 },
    { name: 'VT-PC', hours: 32, idle: 25, revenue: 1200000 },
    { name: 'VT-STK', hours: 58, idle: 5, revenue: 2450000 },
    { name: 'VT-JSG', hours: 40, idle: 15, revenue: 1650000 },
];

const charterActivityData = [
    { month: 'May', received: 45, quoted: 38, accepted: 12, revenue: 4200000 },
    { month: 'Jun', received: 52, quoted: 44, accepted: 15, revenue: 5800000 },
    { month: 'Jul', received: 68, quoted: 55, accepted: 22, revenue: 8100000 },
];

const revenueTrendData = [
    { day: 'Mon', revenue: 1200000 },
    { day: 'Tue', revenue: 900000 },
    { day: 'Wed', revenue: 1500000 },
    { day: 'Thu', revenue: 2100000 },
    { day: 'Fri', revenue: 1800000 },
    { day: 'Sat', revenue: 2400000 },
    { day: 'Sun', revenue: 1100000 },
];

const sectorYieldData = [
    { sector: 'BOM-DEL', count: 18, yield: 1.2, revenue: 4500000 },
    { sector: 'DEL-LHR', count: 5, yield: 1.8, revenue: 12000000 },
    { sector: 'BLR-GOI', count: 12, yield: 0.9, revenue: 2400000 },
    { sector: 'MAA-SIN', count: 3, yield: 1.5, revenue: 6800000 },
];

const COLORS = ['#0EA5E9', '#EEDC5B', '#F43F5E', '#10B981'];

export default function OperatorReportsPage() {
    const { user } = useUser();

    return (
        <>
            <PageHeader 
                title="Intelligence & Revenue Analytics" 
                description="Institutional visibility into fleet profitability, mission yield, and AI-assisted performance signals."
            >
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="h-9 gap-2 border-white/10">
                        <Filter className="h-3.5 w-3.5" /> Period Scope
                    </Button>
                    <Button variant="outline" size="sm" className="h-9 gap-2 border-white/10">
                        <Download className="h-3.5 w-3.5" /> Export Financials
                    </Button>
                </div>
            </PageHeader>

            <StatsGrid>
                <StatsCard title="Total Gross Revenue" value="₹ 1.4 Cr" icon={DollarSign} description="Actual + Confirmed Bids" />
                <StatsCard title="Charter Contribution" value="94%" icon={Target} description="Full mission share" />
                <StatsCard title="Empty Leg Yield" value="₹ 8.2 L" icon={Zap} description="Incremental recovery revenue" />
                <StatsCard title="Avg. Mission Value" value="₹ 12.5 L" icon={TrendingUp} description="Per confirmed charter" />
            </StatsGrid>

            <div className="mt-6 space-y-6">
                <AIInsights />

                <Tabs defaultValue="revenue" className="w-full">
                    <TabsList className="bg-muted/20 border border-white/5 mb-6 p-1">
                        <TabsTrigger value="revenue" className="gap-2">
                            <DollarSign className="h-3.5 w-3.5" /> Revenue & Yield
                        </TabsTrigger>
                        <TabsTrigger value="fleet" className="gap-2">
                            <Plane className="h-3.5 w-3.5" /> Asset Profitability
                        </TabsTrigger>
                        <TabsTrigger value="sectors" className="gap-2">
                            <History className="h-3.5 w-3.5" /> Sector Yield
                        </TabsTrigger>
                        <TabsTrigger value="funnel" className="gap-2">
                            <Activity className="h-3.5 w-3.5" /> Marketplace Funnel
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="revenue" className="space-y-6 animate-in fade-in slide-in-from-top-2">
                        <div className="grid gap-6 md:grid-cols-3">
                            <Card className="md:col-span-2 bg-card">
                                <CardHeader>
                                    <CardTitle>Gross Daily Yield Direction</CardTitle>
                                    <CardDescription>Consolidated revenue flow across all active missions.</CardDescription>
                                </CardHeader>
                                <CardContent className="h-[350px]">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <LineChart data={revenueTrendData}>
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
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-xs uppercase font-bold text-muted-foreground">
                                            <span>EL Recovery %</span>
                                            <span className="text-green-500">42%</span>
                                        </div>
                                        <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                            <div className="h-full bg-green-500 w-[42%]" />
                                        </div>
                                    </div>
                                    <Separator className="bg-white/5" />
                                    <div className="p-3 rounded-lg bg-accent/5 border border-accent/10">
                                        <div className="flex items-center gap-2 mb-1">
                                            <Target className="h-3 w-3 text-accent" />
                                            <span className="text-[10px] font-bold text-accent uppercase">Yield Target</span>
                                        </div>
                                        <p className="text-[10px] text-muted-foreground">Maintain > ₹ 1.5 L / FH for heavy-jet category fleet sustainment.</p>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>

                    <TabsContent value="fleet" className="space-y-6 animate-in fade-in slide-in-from-top-2">
                        <div className="grid gap-6 md:grid-cols-2">
                            <Card className="bg-card">
                                <CardHeader>
                                    <CardTitle>Revenue by Fleet Asset</CardTitle>
                                    <CardDescription>Individual contribution to monthly gross volume.</CardDescription>
                                </CardHeader>
                                <CardContent className="h-[300px]">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={fleetUtilizationData}>
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
                                <CardContent className="h-[300px]">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <RePieChart>
                                            <Pie
                                                data={fleetUtilizationData}
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={60}
                                                outerRadius={80}
                                                paddingAngle={5}
                                                dataKey="hours"
                                            >
                                                {fleetUtilizationData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                ))}
                                            </Pie>
                                            <Tooltip />
                                        </RePieChart>
                                    </ResponsiveContainer>
                                    <div className="flex justify-center gap-4 mt-2">
                                        {fleetUtilizationData.map((entry, index) => (
                                            <div key={entry.name} className="flex items-center gap-1.5">
                                                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                                                <span className="text-[10px] text-muted-foreground">{entry.name}</span>
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
                                <CardTitle>High-Yield Sector Analysis</CardTitle>
                                <CardDescription>Route performance tracked by commercial density and mission frequency.</CardDescription>
                            </CardHeader>
                            <CardContent className="h-[400px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={sectorYieldData} layout="vertical">
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
                                <CardTitle>Conversion Efficiency vs. Revenue</CardTitle>
                                <CardDescription>Comparing request volume against realized commercial value.</CardDescription>
                            </CardHeader>
                            <CardContent className="h-[400px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={charterActivityData}>
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
                                        <Area type="monotone" dataKey="revenue" stroke="#10B981" fillOpacity={1} fill="url(#colorRev)" name="Monthly Revenue (Flow)" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </>
    );
}
