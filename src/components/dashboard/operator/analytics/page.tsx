'use client';

import { PageHeader } from "@/components/dashboard/shared/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { StatsCard } from "@/components/dashboard/shared/stats-card";
import { StatsGrid } from "@/components/dashboard/shared/stats-grid";
import { 
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
    PieChart, Pie, Cell, LineChart, Line, Legend 
} from 'recharts';
import { Activity, Zap, TrendingUp, Target, Plane, Clock } from "lucide-react";

const UTILIZATION_DATA = [
    { name: 'VT-FLY', hours: 85, target: 100 },
    { name: 'VT-PC', hours: 42, target: 100 },
    { name: 'VT-STK', hours: 92, target: 100 },
    { name: 'VT-JSG', hours: 65, target: 100 },
];

const REVENUE_MIX = [
    { name: 'Direct Charter', value: 70, color: '#1B263B' },
    { name: 'Seat Exchange', value: 30, color: '#D4AF37' },
];

export function OperatorAnalytics() {
    return (
        <div className="space-y-6">
            <PageHeader title="Fleet Intelligence" description="Analyzing asset utilization and commercial yield." />
            
            <StatsGrid>
                <StatsCard title="Fleet Utilization" value="72%" icon={Activity} description="Active flight hours" trend={{ value: '+4%', positive: true }} />
                <StatsCard title="Exchange Yield" value="₹ 42 L" icon={Zap} description="Empty leg revenue" trend={{ value: '+12%', positive: true }} />
                <StatsCard title="Conversion Ratio" value="28.5%" icon={Target} description="RFQ to Booked" />
                <StatsCard title="Avg Hourly Revenue" value="₹ 1.8 L" icon={Clock} description="Fleet average" />
            </StatsGrid>

            <div className="grid gap-6 lg:grid-cols-3">
                <Card className="lg:col-span-2 bg-card">
                    <CardHeader>
                        <CardTitle>Asset Utilization Control</CardTitle>
                        <CardDescription>Individual aircraft flying hours against operational targets.</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[350px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={UTILIZATION_DATA}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                                <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} />
                                <YAxis stroke="#94a3b8" fontSize={10} />
                                <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b' }} />
                                <Bar dataKey="hours" fill="#D4AF37" radius={[4, 4, 0, 0]} name="Active Hours" />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                <Card className="bg-card">
                    <CardHeader>
                        <CardTitle>Yield Composition</CardTitle>
                        <CardDescription>Revenue share by commercial channel.</CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col items-center justify-center h-[300px]">
                        <div className="h-[200px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie data={REVENUE_MIX} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value" stroke="none">
                                        {REVENUE_MIX.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="w-full space-y-2 mt-4 px-4">
                            {REVENUE_MIX.map(item => (
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