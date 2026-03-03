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
    Legend,
    ComposedChart
} from 'recharts';
import { 
    Activity, 
    DollarSign, 
    Users, 
    Filter, 
    Download, 
    ShieldCheck, 
    Zap, 
    Target, 
    Clock,
    FileText,
    CheckCircle2,
    AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useState, useMemo } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { CTDAIGovernance } from "@/components/dashboard/ctd/analytics/ctd-ai-governance";
import { useUser } from "@/hooks/use-user";

// --- MOCK DATA FOR CTD ---
const BASE_REQUEST_LIFECYCLE = [
    { day: 'Mon', received: 12, approved: 8, latency: 1.5 },
    { day: 'Tue', received: 15, approved: 12, latency: 1.2 },
    { day: 'Wed', received: 18, approved: 14, latency: 2.1 },
    { day: 'Thu', received: 22, approved: 18, latency: 1.8 },
    { day: 'Fri', received: 20, approved: 15, latency: 2.4 },
    { day: 'Sat', received: 8, approved: 6, latency: 1.1 },
    { day: 'Sun', received: 5, approved: 4, latency: 0.9 },
];

const BASE_MODE_MIX = [
    { name: 'Full Charter', value: 60, color: '#0EA5E9' },
    { name: 'Jet Seat (EL)', value: 40, color: '#FFFFBD' },
];

const BASE_COST_CENTER_DATA = [
    { name: 'Executive', budget: 100, consumed: 85, variance: 15 },
    { name: 'R&D Operations', budget: 80, consumed: 72, variance: 8 },
    { name: 'Global Sales', budget: 120, consumed: 110, variance: 10 },
    { name: 'HR/Logistics', budget: 40, consumed: 35, variance: 5 },
];

export default function CTDAnalyticsPage() {
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
        totalSpend: new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(4250000 * scaleFactor).replace('INR', '₹'),
        avgApprovalTime: "1.8 Hours",
        policyCompliance: "94%",
        activePersonnel: Math.round(42 * (scaleFactor < 1 ? 1 : scaleFactor * 0.5))
    }), [scaleFactor]);

    const handlePeriodChange = (value: string) => {
        setPeriod(value);
        toast({
            title: "Governance Period Updated",
            description: "Now analyzing institutional travel data for the selected window.",
        });
    };

    return (
        <div className="space-y-6">
            <PageHeader 
                title="Enterprise Travel Intelligence" 
                description={`Strategic demand, spend control, and governance metrics for ${user?.company}.`}
            >
                <div className="flex gap-2">
                    <Select value={period} onValueChange={handlePeriodChange}>
                        <SelectTrigger className="h-9 w-[160px] bg-muted/20 border-white/10 text-xs">
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
                        <Download className="h-3.5 w-3.5" /> Export Governance CSV
                    </Button>
                </div>
            </PageHeader>

            <StatsGrid>
                <StatsCard title="Total Travel Spend" value={stats.totalSpend} icon={DollarSign} description="Actual + Committed" />
                <StatsCard title="Approval Efficiency" value={stats.avgApprovalTime} icon={Clock} description="Avg lifecycle duration" />
                <StatsCard title="Policy Compliance" value={stats.policyCompliance} icon={ShieldCheck} description="Guidelines alignment" />
                <StatsCard title="Authorized Personnel" value={stats.activePersonnel.toString()} icon={Users} description="Active movement profiles" />
            </StatsGrid>

            <CTDAIGovernance />

            <Tabs defaultValue="ops" className="w-full">
                <TabsList className="bg-muted/20 border border-white/5 mb-6 p-1 h-auto flex flex-wrap">
                    <TabsTrigger value="ops" className="gap-2 flex-1 min-w-[120px]">
                        <Activity className="h-3.5 w-3.5" /> Operations & Lifecycle
                    </TabsTrigger>
                    <TabsTrigger value="strategic" className="gap-2 flex-1 min-w-[120px]">
                        <Target className="h-3.5 w-3.5" /> Strategic Intelligence
                    </TabsTrigger>
                    <TabsTrigger value="accounting" className="gap-2 flex-1 min-w-[120px]">
                        <FileText className="h-3.5 w-3.5" /> Accounting & Spend
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="ops" className="space-y-6 animate-in fade-in slide-in-from-top-2">
                    <div className="grid gap-6 md:grid-cols-3">
                        <Card className="md:col-span-2 bg-card">
                            <CardHeader>
                                <CardTitle>Request Flow Intensity</CardTitle>
                                <CardDescription>Daily volume of received vs. approved corporate travel requests.</CardDescription>
                            </CardHeader>
                            <CardContent className="h-[350px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={BASE_REQUEST_LIFECYCLE}>
                                        <defs>
                                            <linearGradient id="colorRec" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#0EA5E9" stopOpacity={0.3}/>
                                                <stop offset="95%" stopColor="#0EA5E9" stopOpacity={0}/>
                                            </linearGradient>
                                            <linearGradient id="colorApp" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                                                <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                                        <XAxis dataKey="day" stroke="#94a3b8" fontSize={10} />
                                        <YAxis stroke="#94a3b8" fontSize={10} />
                                        <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b' }} />
                                        <Area type="monotone" dataKey="received" stroke="#0EA5E9" fillOpacity={1} fill="url(#colorRec)" name="Inquiries" />
                                        <Area type="monotone" dataKey="approved" stroke="#10B981" fillOpacity={1} fill="url(#colorApp)" name="Approved" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>

                        <Card className="bg-card">
                            <CardHeader>
                                <CardTitle>Fulfillment Signals</CardTitle>
                                <CardDescription>Efficiency indicators for request lifecycle.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6 py-4">
                                <div className="p-4 rounded-xl bg-accent/5 border border-accent/10 space-y-1">
                                    <div className="flex items-center justify-between">
                                        <p className="text-[10px] font-bold text-accent uppercase tracking-widest">Completion Rate</p>
                                        <CheckCircle2 className="h-3.5 w-3.5 text-accent" />
                                    </div>
                                    <p className="text-2xl font-black text-foreground">92.4%</p>
                                    <p className="text-[10px] text-muted-foreground">Successful movement completion</p>
                                </div>
                                <div className="p-4 rounded-xl bg-primary/5 border border-primary/10 space-y-1">
                                    <div className="flex items-center justify-between">
                                        <p className="text-[10px] font-bold text-primary uppercase tracking-widest">Rejection Ratio</p>
                                        <AlertCircle className="h-3.5 w-3.5 text-primary" />
                                    </div>
                                    <p className="text-2xl font-black text-foreground">4.2%</p>
                                    <p className="text-[10px] text-muted-foreground">Requests outside policy guidelines</p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                <TabsContent value="strategic" className="space-y-6 animate-in fade-in slide-in-from-top-2">
                    <div className="grid gap-6 md:grid-cols-2">
                        <Card className="bg-card">
                            <CardHeader>
                                <CardTitle>Travel Mode Mix</CardTitle>
                                <CardDescription>Organizational preference between full charter and seat allocations.</CardDescription>
                            </CardHeader>
                            <CardContent className="flex flex-col items-center justify-center space-y-6 py-6 h-[300px]">
                                <div className="h-[200px] w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <RePieChart>
                                            <Pie
                                                data={BASE_MODE_MIX}
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={60}
                                                outerRadius={80}
                                                paddingAngle={5}
                                                dataKey="value"
                                                stroke="none"
                                            >
                                                {BASE_MODE_MIX.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                                ))}
                                            </Pie>
                                            <Tooltip />
                                        </RePieChart>
                                    </ResponsiveContainer>
                                </div>
                                <div className="flex justify-center gap-6 w-full mt-4">
                                    {BASE_MODE_MIX.map(item => (
                                        <div key={item.name} className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest">
                                            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                                            <span className="text-muted-foreground">{item.name}</span>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="bg-card">
                            <CardHeader>
                                <CardTitle>Institutional Policy Adherence</CardTitle>
                                <CardDescription>Compliance monitoring across active coordination.</CardDescription>
                            </CardHeader>
                            <CardContent className="flex items-center justify-center h-[300px]">
                                <div className="text-center space-y-2">
                                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-full border-4 border-emerald-500/20 bg-emerald-500/10">
                                        <ShieldCheck className="h-10 w-10 text-emerald-500" />
                                    </div>
                                    <p className="text-2xl font-black text-white">94%</p>
                                    <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Optimal Governance</p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                <TabsContent value="accounting" className="space-y-6 animate-in fade-in slide-in-from-top-2">
                    <Card className="bg-card">
                        <CardHeader>
                            <CardTitle>Budget vs. Actual Consumption</CardTitle>
                            <CardDescription>Quarterly budget performance across primary cost centers (₹ Lakhs).</CardDescription>
                        </CardHeader>
                        <CardContent className="h-[350px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <ComposedChart data={BASE_COST_CENTER_DATA}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                                    <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} />
                                    <YAxis stroke="#94a3b8" fontSize={10} />
                                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b' }} />
                                    <Legend />
                                    <Bar dataKey="budget" name="Allocated Budget" fill="#1e293b" radius={[4, 4, 0, 0]} />
                                    <Bar dataKey="consumed" name="Consumed Amount" fill="#0EA5E9" radius={[4, 4, 0, 0]} />
                                    <Line type="monotone" dataKey="variance" name="Variance Threshold" stroke="#FFFFBD" strokeWidth={2} dot={{ fill: '#FFFFBD' }} />
                                </ComposedChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
