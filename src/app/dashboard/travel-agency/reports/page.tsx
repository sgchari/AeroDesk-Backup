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
    PieChart, 
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
    Zap, 
    Target, 
    History, 
    Download, 
    Filter,
    Activity,
    BarChart3,
    MapPin,
    Users,
    Coins,
    Briefcase
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState, useMemo } from "react";
import { useUser } from "@/hooks/use-user";
import { useToast } from "@/hooks/use-toast";
import { AgencyAIInsights } from "@/components/dashboard/travel-agency/reports/ai-insights";
import { Skeleton } from "@/components/ui/skeleton";

// --- MOCK ANALYTICAL DATA ---
const REVENUE_MIX = [
    { name: 'Charter Sales', value: 65, color: '#0EA5E9' },
    { name: 'Seat Allocations', value: 35, color: '#FFFFBD' },
];

const DAILY_PERFORMANCE = [
    { day: 'Mon', revenue: 1200000, leads: 8 },
    { day: 'Tue', revenue: 900000, leads: 12 },
    { day: 'Wed', revenue: 1500000, leads: 15 },
    { day: 'Thu', revenue: 2100000, leads: 22 },
    { day: 'Fri', revenue: 1800000, leads: 18 },
    { day: 'Sat', revenue: 2400000, leads: 10 },
    { day: 'Sun', revenue: 1100000, leads: 6 },
];

const SECTOR_DEMAND = [
    { sector: 'BOM-DEL', count: 45, yield: 1.2 },
    { sector: 'DEL-LHR', count: 12, yield: 1.8 },
    { sector: 'BLR-GOI', count: 28, yield: 0.9 },
    { sector: 'MAA-SIN', count: 8, yield: 1.5 },
];

export default function AgencyReportsPage() {
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
        grossVolume: new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(14000000 * scaleFactor).replace('INR', '₹'),
        accruedCommission: new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(850000 * scaleFactor).replace('INR', '₹'),
        conversionRate: "72%",
        avgDealValue: "₹ 8.5 L"
    }), [scaleFactor]);

    const handlePeriodChange = (value: string) => {
        setPeriod(value);
        toast({
            title: "Analytical Scope Updated",
            description: "Synchronizing commercial data for the selected period.",
        });
    };

    return (
        <div className="space-y-6">
            <PageHeader 
                title="Agency Intelligence Hub" 
                description={`Commercial performance tracking and network demand signals for ${user?.company}.`}
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
                        <Download className="h-3.5 w-3.5" /> Export Financials
                    </Button>
                </div>
            </PageHeader>

            <StatsGrid>
                <StatsCard title="Gross Coordination" value={stats.grossVolume} icon={DollarSign} description="Total volume handled" />
                <StatsCard title="Accrued Earnings" value={stats.accruedCommission} icon={Coins} description="Pending settlement" />
                <StatsCard title="Fulfillment Ratio" value={stats.conversionRate} icon={Target} description="Leads to confirmation" />
                <StatsCard title="Avg. Mission Value" value={stats.avgDealValue} icon={TrendingUp} description="Per confirmed trip" />
            </StatsGrid>

            <AgencyAIInsights />

            <Tabs defaultValue="revenue" className="w-full">
                <TabsList className="bg-muted/20 border border-white/5 mb-6 p-1">
                    <TabsTrigger value="revenue" className="gap-2">
                        <Activity className="h-3.5 w-3.5" /> Revenue & Yield
                    </TabsTrigger>
                    <TabsTrigger value="demand" className="gap-2">
                        <MapPin className="h-3.5 w-3.5" /> Sector Demand
                    </TabsTrigger>
                    <TabsTrigger value="performance" className="gap-2">
                        <BarChart3 className="h-3.5 w-3.5" /> Lead Funnel
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="revenue" className="space-y-6 animate-in fade-in slide-in-from-top-2">
                    <div className="grid gap-6 md:grid-cols-3">
                        <Card className="md:col-span-2 bg-card">
                            <CardHeader>
                                <CardTitle>Revenue Flow Direction</CardTitle>
                                <CardDescription>Daily gross volume generated through agency coordination.</CardDescription>
                            </CardHeader>
                            <CardContent className="h-[350px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={DAILY_PERFORMANCE}>
                                        <defs>
                                            <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#0EA5E9" stopOpacity={0.3}/>
                                                <stop offset="95%" stopColor="#0EA5E9" stopOpacity={0}/>
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                                        <XAxis dataKey="day" stroke="#94a3b8" fontSize={10} />
                                        <YAxis stroke="#94a3b8" fontSize={10} tickFormatter={(val) => `₹${val/100000}L`} />
                                        <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b' }} />
                                        <Area type="monotone" dataKey="revenue" stroke="#0EA5E9" fillOpacity={1} fill="url(#colorRev)" name="Revenue" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>

                        <Card className="bg-card">
                            <CardHeader>
                                <CardTitle>Contribution Mix</CardTitle>
                                <CardDescription>Revenue share by service type.</CardDescription>
                            </CardHeader>
                            <CardContent className="flex flex-col items-center justify-center h-[300px]">
                                <div className="h-[200px] w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={REVENUE_MIX}
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={60}
                                                outerRadius={80}
                                                paddingAngle={5}
                                                dataKey="value"
                                                stroke="none"
                                            >
                                                {REVENUE_MIX.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                                ))}
                                            </Pie>
                                            <Tooltip />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                                <div className="w-full space-y-2 mt-4">
                                    {REVENUE_MIX.map((item) => (
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

                <TabsContent value="demand" className="space-y-6 animate-in fade-in slide-in-from-top-2">
                    <Card className="bg-card">
                        <CardHeader>
                            <CardTitle>Sector Performance Matrix</CardTitle>
                            <CardDescription>Mission frequency and yield by corridor.</CardDescription>
                        </CardHeader>
                        <CardContent className="h-[400px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={SECTOR_DEMAND} layout="vertical">
                                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" horizontal={false} />
                                    <XAxis type="number" hide />
                                    <YAxis dataKey="sector" type="category" stroke="#94a3b8" fontSize={10} width={80} />
                                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b' }} />
                                    <Bar dataKey="count" fill="#0EA5E9" name="Mission Count" radius={[0, 4, 4, 0]} />
                                    <Bar dataKey="yield" fill="#FFFFBD" name="Yield Factor" radius={[0, 4, 4, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="performance" className="space-y-6 animate-in fade-in slide-in-from-top-2">
                    <Card className="bg-card">
                        <CardHeader>
                            <CardTitle>Lead Conversion Funnel</CardTitle>
                            <CardDescription>Daily lead volume vs. confirmed revenue pings.</CardDescription>
                        </CardHeader>
                        <CardContent className="h-[350px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={DAILY_PERFORMANCE}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                                    <XAxis dataKey="day" stroke="#94a3b8" fontSize={10} />
                                    <YAxis stroke="#94a3b8" fontSize={10} />
                                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b' }} />
                                    <Legend />
                                    <Line type="monotone" dataKey="leads" name="Active Inquiries" stroke="#FFFFBD" strokeWidth={2} dot={{ fill: '#FFFFBD' }} />
                                </LineChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
