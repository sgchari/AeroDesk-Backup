'use client';

import { PageHeader } from "@/components/dashboard/shared/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
    Legend
} from 'recharts';
import { 
    DollarSign, 
    TrendingUp, 
    Target, 
    Activity, 
    BarChart3, 
    Users,
    Briefcase,
    Coins
} from "lucide-react";
import { useUser } from "@/hooks/use-user";
import { useMemo } from "react";
import { Badge } from "@/components/ui/badge";

const SALES_DATA = [
    { name: 'Mon', revenue: 12.5, targets: 10 },
    { name: 'Tue', revenue: 18.2, targets: 15 },
    { name: 'Wed', revenue: 8.5, targets: 12 },
    { name: 'Thu', revenue: 22.1, targets: 18 },
    { name: 'Fri', revenue: 15.8, targets: 15 },
    { name: 'Sat', revenue: 28.4, targets: 20 },
    { name: 'Sun', revenue: 11.2, targets: 10 },
];

const SERVICE_MIX = [
    { name: 'Charter', value: 65, color: '#0EA5E9' },
    { name: 'Jet Seats', value: 35, color: '#D4AF37' },
];

export default function AgencyAnalyticsPage() {
    const { user } = useUser();

    return (
        <div className="space-y-6">
            <PageHeader 
                title="Sales Intelligence" 
                description={`Commercial performance and coordination throughput for ${user?.company}.`} 
            />
            
            <StatsGrid>
                <StatsCard title="Gross Volume" value="₹ 4.2 Cr" icon={DollarSign} description="MTD Coordination Value" trend={{ value: '+18%', positive: true }} />
                <StatsCard title="Accrued Earnings" value="₹ 12.5 L" icon={Coins} description="Pending Settlements" trend={{ value: '+12%', positive: true }} />
                <StatsCard title="Fulfillment Ratio" value="74%" icon={Target} description="Lead to Confirmation" />
                <StatsCard title="Active Inquiries" value="24" icon={Activity} description="Open Market Leads" />
            </StatsGrid>

            <div className="grid gap-6 lg:grid-cols-3">
                <Card className="lg:col-span-2 bg-card">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle>Sales Performance Matrix</CardTitle>
                            <CardDescription>Daily coordination volume (₹ Lakhs) against institutional targets.</CardDescription>
                        </div>
                        <Badge variant="outline" className="border-accent/30 text-accent font-black text-[9px] uppercase tracking-widest">Live Signals</Badge>
                    </CardHeader>
                    <CardContent className="h-[350px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={SALES_DATA}>
                                <defs>
                                    <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#0EA5E9" stopOpacity={0.3}/>
                                        <stop offset="95%" stopColor="#0EA5E9" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                                <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} axisLine={false} tickLine={false} />
                                <YAxis stroke="#94a3b8" fontSize={10} axisLine={false} tickLine={false} />
                                <Tooltip 
                                    contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px' }}
                                    itemStyle={{ fontSize: '10px', fontWeight: 'bold' }}
                                />
                                <Area type="monotone" dataKey="revenue" stroke="#0EA5E9" fillOpacity={1} fill="url(#colorSales)" name="Actual (L)" />
                                <Area type="monotone" dataKey="targets" stroke="#ffffff20" fillOpacity={0} name="Target (L)" strokeDasharray="4 4" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                <Card className="bg-card">
                    <CardHeader>
                        <CardTitle>Commercial Mix</CardTitle>
                        <CardDescription>Revenue share by service vertical.</CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col items-center justify-center h-[300px]">
                        <div className="h-[200px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie data={SERVICE_MIX} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value" stroke="none">
                                        {SERVICE_MIX.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="w-full space-y-2 mt-4 px-4">
                            {SERVICE_MIX.map(item => (
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
        </div>
    );
}
