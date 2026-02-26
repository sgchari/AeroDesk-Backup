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
    { name: 'VT-FLY', hours: 45, idle: 12, sectors: 18 },
    { name: 'VT-PC', hours: 32, idle: 25, sectors: 12 },
    { name: 'VT-STK', hours: 58, idle: 5, sectors: 24 },
    { name: 'VT-JSG', hours: 40, idle: 15, sectors: 15 },
];

const charterActivityData = [
    { month: 'May', received: 45, quoted: 38, accepted: 12 },
    { month: 'Jun', received: 52, quoted: 44, accepted: 15 },
    { month: 'Jul', received: 68, quoted: 55, accepted: 22 },
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

const COLORS = ['#0EA5E9', '#EEDC5B', '#F43F5E', '#10B981'];

export default function OperatorReportsPage() {
    const { user } = useUser();

    return (
        <>
            <PageHeader 
                title="Intelligence & Performance" 
                description="Strategic operational analytics, fleet utilization, and AI-assisted performance insights."
            >
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="h-9 gap-2 border-white/10">
                        <Filter className="h-3.5 w-3.5" /> Filter Range
                    </Button>
                    <Button variant="outline" size="sm" className="h-9 gap-2 border-white/10">
                        <Download className="h-3.5 w-3.5" /> Export Data
                    </Button>
                </div>
            </PageHeader>

            <StatsGrid>
                <StatsCard title="Fleet Utilization" value="78%" icon={Activity} description="Avg. active hours/day" />
                <StatsCard title="Charter Conversion" value="24.5%" icon={Target} description="Quote-to-Confirmation" />
                <StatsCard title="Empty Leg Yield" value="₹ 8.2 L" icon={Zap} description="Incremental revenue this month" />
                <StatsCard title="Total Flying Hours" value="175h" icon={Clock} description="Consolidated monthly total" />
            </StatsGrid>

            <div className="mt-6 space-y-6">
                <AIInsights />

                <Tabs defaultValue="fleet" className="w-full">
                    <TabsList className="bg-muted/20 border border-white/5 mb-6 p-1">
                        <TabsTrigger value="fleet" className="gap-2">
                            <Plane className="h-3.5 w-3.5" /> Fleet Utilization
                        </TabsTrigger>
                        <TabsTrigger value="charter" className="gap-2">
                            <TrendingUp className="h-3.5 w-3.5" /> Charter Activity
                        </TabsTrigger>
                        <TabsTrigger value="revenue" className="gap-2">
                            <DollarSign className="h-3.5 w-3.5" /> Revenue & Yield
                        </TabsTrigger>
                        <TabsTrigger value="history" className="gap-2">
                            <History className="h-3.5 w-3.5" /> Historical Trends
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="fleet" className="space-y-6 animate-in fade-in slide-in-from-top-2">
                        <div className="grid gap-6 md:grid-cols-2">
                            <Card className="bg-card">
                                <CardHeader>
                                    <CardTitle>Operating Hours by Asset</CardTitle>
                                    <CardDescription>Flight hours vs. Idle time for the current period.</CardDescription>
                                </CardHeader>
                                <CardContent className="h-[300px]">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={fleetUtilizationData}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                                            <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} />
                                            <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} />
                                            <Tooltip 
                                                contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px' }}
                                                itemStyle={{ fontSize: '12px' }}
                                            />
                                            <Bar dataKey="hours" name="Flight Hours" fill="#0EA5E9" radius={[4, 4, 0, 0]} />
                                            <Bar dataKey="idle" name="Idle Time" fill="#1e293b" radius={[4, 4, 0, 0]} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </CardContent>
                            </Card>

                            <Card className="bg-card">
                                <CardHeader>
                                    <CardTitle>Asset Distribution</CardTitle>
                                    <CardDescription>Mission share across the active fleet.</CardDescription>
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
                                                dataKey="sectors"
                                            >
                                                {fleetUtilizationData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                ))}
                                            </Pie>
                                            <Tooltip 
                                                contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px' }}
                                            />
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

                    <TabsContent value="charter" className="space-y-6 animate-in fade-in slide-in-from-top-2">
                        <Card className="bg-card">
                            <CardHeader>
                                <CardTitle>Marketplace Funnel</CardTitle>
                                <CardDescription>Tracking conversion from initial RFQ to confirmed mission.</CardDescription>
                            </CardHeader>
                            <CardContent className="h-[400px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={charterActivityData}>
                                        <defs>
                                            <linearGradient id="colorRec" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#0EA5E9" stopOpacity={0.3}/>
                                                <stop offset="95%" stopColor="#0EA5E9" stopOpacity={0}/>
                                            </linearGradient>
                                            <linearGradient id="colorAcc" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                                                <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                                        <XAxis dataKey="month" stroke="#94a3b8" fontSize={10} />
                                        <YAxis stroke="#94a3b8" fontSize={10} />
                                        <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b' }} />
                                        <Area type="monotone" dataKey="received" stroke="#0EA5E9" fillOpacity={1} fill="url(#colorRec)" name="Requests Received" />
                                        <Area type="monotone" dataKey="accepted" stroke="#10B981" fillOpacity={1} fill="url(#colorAcc)" name="Quotes Accepted" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="revenue" className="space-y-6 animate-in fade-in slide-in-from-top-2">
                        <div className="grid gap-6 md:grid-cols-3">
                            <Card className="md:col-span-2 bg-card">
                                <CardHeader>
                                    <CardTitle>Gross Daily Yield</CardTitle>
                                    <CardDescription>Daily revenue indicators across all sectors.</CardDescription>
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
                                            <Line type="monotone" dataKey="revenue" stroke="#EEDC5B" strokeWidth={3} dot={{ fill: '#EEDC5B', strokeWidth: 2, r: 4 }} activeDot={{ r: 6, strokeWidth: 0 }} />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </CardContent>
                            </Card>

                            <Card className="bg-card">
                                <CardHeader>
                                    <CardTitle>Unit Economics</CardTitle>
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
                                    <p className="text-[10px] text-muted-foreground leading-relaxed italic">
                                        * Unit economics calculated based on standard operating cost models and confirmed marketplace billing.
                                    </p>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </>
    );
}
