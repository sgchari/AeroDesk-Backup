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
    BedDouble, 
    Activity, 
    Hotel, 
    Users,
    Zap
} from "lucide-react";
import { useUser } from "@/hooks/use-user";
import { Badge } from "@/components/ui/badge";

const YIELD_DATA = [
    { name: 'Mon', revenue: 85000, arrivals: 4 },
    { name: 'Tue', revenue: 62000, arrivals: 3 },
    { name: 'Wed', revenue: 125000, arrivals: 6 },
    { name: 'Thu', revenue: 98000, arrivals: 5 },
    { name: 'Fri', revenue: 185000, arrivals: 8 },
    { name: 'Sat', revenue: 210000, arrivals: 10 },
    { name: 'Sun', revenue: 145000, arrivals: 7 },
];

const OCCUPANCY_MIX = [
    { name: 'Charter Direct', value: 60, color: '#10B981' },
    { name: 'Corporate Desk', value: 25, color: '#0EA5E9' },
    { name: 'Agency Linked', value: 15, color: '#D4AF37' },
];

export default function HotelAnalyticsPage() {
    const { user } = useUser();

    return (
        <div className="space-y-6">
            <PageHeader 
                title="Yield Performance" 
                description={`Network arrivals and revenue tracking for ${user?.company}.`} 
            />
            
            <StatsGrid>
                <StatsCard title="Network Revenue" value="₹ 18.5 L" icon={DollarSign} description="MTD Yield via AeroDesk" trend={{ value: '+22%', positive: true }} />
                <StatsCard title="Room Nights" value="142" icon={BedDouble} description="Confirmed Stays" trend={{ value: '+15%', positive: true }} />
                <StatsCard title="Avg Daily Rate" value="₹ 12,500" icon={TrendingUp} description="Per Mission Stay" />
                <StatsCard title="Mission Arrivals" value="48" icon={Activity} description="Charter Sync Events" />
            </StatsGrid>

            <div className="grid gap-6 lg:grid-cols-3">
                <Card className="lg:col-span-2 bg-card">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle>Daily Yield Intensity</CardTitle>
                            <CardDescription>Revenue tracking synchronized with charter mission arrivals.</CardDescription>
                        </div>
                        <Badge variant="outline" className="border-emerald-500/30 text-emerald-500 font-black text-[9px] uppercase tracking-widest">Network Sync Active</Badge>
                    </CardHeader>
                    <CardContent className="h-[350px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={YIELD_DATA}>
                                <defs>
                                    <linearGradient id="colorHotel" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                                        <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                                <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} axisLine={false} tickLine={false} />
                                <YAxis stroke="#94a3b8" fontSize={10} axisLine={false} tickLine={false} tickFormatter={(val) => `₹${val/1000}K`} />
                                <Tooltip 
                                    contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px' }}
                                    itemStyle={{ fontSize: '10px', fontWeight: 'bold' }}
                                />
                                <Area type="monotone" dataKey="revenue" stroke="#10B981" fillOpacity={1} fill="url(#colorHotel)" name="Yield (₹)" />
                                <Area type="monotone" dataKey="arrivals" stroke="#0EA5E9" fillOpacity={0.1} name="Arrivals" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                <Card className="bg-card">
                    <CardHeader>
                        <CardTitle>Channel Mix</CardTitle>
                        <CardDescription>Source of institutional stay requests.</CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col items-center justify-center h-[300px]">
                        <div className="h-[200px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie data={OCCUPANCY_MIX} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value" stroke="none">
                                        {OCCUPANCY_MIX.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="w-full space-y-2 mt-4 px-4">
                            {OCCUPANCY_MIX.map(item => (
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
