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
    Legend
} from 'recharts';
import { Activity, DollarSign, Users, Target, Globe, Zap, ShieldCheck } from "lucide-react";

const GTV_DATA = [
    { name: 'Mon', gtv: 45, fees: 4.5 },
    { name: 'Tue', gtv: 52, fees: 5.2 },
    { name: 'Wed', gtv: 38, fees: 3.8 },
    { name: 'Thu', gtv: 61, fees: 6.1 },
    { name: 'Fri', gtv: 58, fees: 5.8 },
    { name: 'Sat', gtv: 72, fees: 7.2 },
    { name: 'Sun', gtv: 42, fees: 4.2 },
];

const STAKEHOLDER_MIX = [
    { name: 'Operators', value: 40, color: '#1B263B' },
    { name: 'Agencies', value: 35, color: '#D4AF37' },
    { name: 'Hotels', value: 25, color: '#2A7FFF' },
];

export default function AdminAnalyticsPage() {
    return (
        <div className="space-y-6">
            <PageHeader title="Platform Intelligence Hub" description="Consolidated GTV, monetization tracking, and network growth analytics." />
            
            <StatsGrid>
                <StatsCard title="Gross Volume (MTD)" value="₹ 4.2 Cr" icon={DollarSign} description="Settled transactions" trend={{ value: '+18%', positive: true }} />
                <StatsCard title="Marketplace Health" value="94%" icon={Activity} description="Operator response ratio" />
                <StatsCard title="Platform Revenue" value="₹ 28.5 L" icon={Zap} description="Fee capture volume" trend={{ value: '+12%', positive: true }} />
                <StatsCard title="Active Network" value="142" icon={Users} description="Stakeholder nodes" />
            </StatsGrid>

            <div className="grid gap-6 lg:grid-cols-3">
                <Card className="lg:col-span-2 bg-card">
                    <CardHeader>
                        <CardTitle>GTV & Monetization Flow</CardTitle>
                        <CardDescription>Daily gross volume (₹ Lakhs) against platform fee capture.</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[350px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={GTV_DATA}>
                                <defs>
                                    <linearGradient id="colorGtv" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#D4AF37" stopOpacity={0.3}/>
                                        <stop offset="95%" stopColor="#D4AF37" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                                <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} />
                                <YAxis stroke="#94a3b8" fontSize={10} />
                                <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b' }} />
                                <Area type="monotone" dataKey="gtv" stroke="#D4AF37" fillOpacity={1} fill="url(#colorGtv)" name="GTV (L)" />
                                <Area type="monotone" dataKey="fees" stroke="#1B263B" fillOpacity={0.1} name="Fees (L)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                <Card className="bg-card">
                    <CardHeader>
                        <CardTitle>Stakeholder Profiling</CardTitle>
                        <CardDescription>Contribution mix to platform activity.</CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col items-center justify-center h-[300px]">
                        <div className="h-[200px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie data={STAKEHOLDER_MIX} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value" stroke="none">
                                        {STAKEHOLDER_MIX.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="w-full space-y-2 mt-4 px-4">
                            {STAKEHOLDER_MIX.map(item => (
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