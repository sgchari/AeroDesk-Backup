'use client';

import { PageHeader } from "@/components/dashboard/shared/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { StatsCard } from "@/components/dashboard/shared/stats-card";
import { StatsGrid } from "@/components/dashboard/shared/stats-grid";
import { 
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
    PieChart, Pie, Cell, AreaChart, Area, Legend 
} from 'recharts';
import { Plane, DollarSign, MapPin, Activity, TrendingUp, Target } from "lucide-react";
import { useUser } from "@/hooks/use-user";
import { useMemo } from "react";

const TRIP_DATA = [
    { name: 'Jan', spend: 12.5, trips: 2 },
    { name: 'Feb', spend: 18.2, trips: 3 },
    { name: 'Mar', spend: 8.5, trips: 1 },
    { name: 'Apr', spend: 22.1, trips: 4 },
];

const ROUTE_MIX = [
    { name: 'BOM-DEL', value: 45, color: '#D4AF37' },
    { name: 'DEL-LHR', value: 35, color: '#1B263B' },
    { name: 'BLR-GOI', value: 20, color: '#2A7FFF' },
];

export function CustomerAnalytics() {
    return (
        <div className="space-y-6">
            <PageHeader title="Journey Analytics" description="Visualizing your private aviation consumption and patterns." />
            
            <StatsGrid>
                <StatsCard title="Total Missions" value="12" icon={Plane} description="Missions completed" trend={{ value: '+15%', positive: true }} />
                <StatsCard title="Gross Spend" value="₹ 1.2 Cr" icon={DollarSign} description="Platform volume" trend={{ value: '+8%', positive: false }} />
                <StatsCard title="Primary Sector" value="BOM-DEL" icon={MapPin} description="Most frequented node" />
                <StatsCard title="Asset Preference" value="Heavy Jet" icon={Target} description="Class concentration" />
            </StatsGrid>

            <div className="grid gap-6 md:grid-cols-2">
                <Card className="bg-card">
                    <CardHeader>
                        <CardTitle>Institutional Spend Trend</CardTitle>
                        <CardDescription>Monthly coordination volume in ₹ Lakhs.</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={TRIP_DATA}>
                                <defs>
                                    <linearGradient id="colorSpend" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#D4AF37" stopOpacity={0.3}/>
                                        <stop offset="95%" stopColor="#D4AF37" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                                <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} />
                                <YAxis stroke="#94a3b8" fontSize={10} />
                                <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b' }} />
                                <Area type="monotone" dataKey="spend" stroke="#D4AF37" fillOpacity={1} fill="url(#colorSpend)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                <Card className="bg-card">
                    <CardHeader>
                        <CardTitle>Sector Distribution</CardTitle>
                        <CardDescription>Mission frequency by corridor node.</CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col items-center justify-center h-[300px]">
                        <div className="h-[200px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie data={ROUTE_MIX} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value" stroke="none">
                                        {ROUTE_MIX.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="flex gap-4 mt-4">
                            {ROUTE_MIX.map(item => (
                                <div key={item.name} className="flex items-center gap-2">
                                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                                    <span className="text-[10px] font-black uppercase text-muted-foreground">{item.name}</span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}