'use client';

import { PageHeader } from "@/components/dashboard/shared/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { StatsGrid } from "@/components/dashboard/shared/stats-grid";
import { StatsCard } from "@/components/dashboard/shared/stats-card";
import { 
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, BarChart, Bar
} from 'recharts';
import { Coins, Zap, TrendingUp, DollarSign, Activity } from "lucide-react";
import { useMemo } from "react";

const REVENUE_TIMELINE = [
    { month: 'Jan', charter: 120, seats: 45, hotel: 12, commission: 8.5 },
    { month: 'Feb', charter: 145, seats: 52, hotel: 18, commission: 10.2 },
    { month: 'Mar', charter: 180, seats: 68, hotel: 25, commission: 12.8 },
];

export default function PlatformRevenueReportsPage() {
    const stats = {
        totalGTV: "₹ 18.5 Cr",
        commission: "₹ 1.2 Cr",
        charterShare: "65%",
        seatShare: "25%"
    };

    return (
        <div className="space-y-6">
            <PageHeader title="Commercial Yield Reports" description="Consolidated revenue intelligence and monetization performance." />

            <StatsGrid>
                <StatsCard title="Gross Volume (GTV)" value={stats.totalGTV} icon={DollarSign} description="Total coordinated settlement" />
                <StatsCard title="Platform Commission" value={stats.commission} icon={Zap} description="Accrued platform fees" trend={{ value: '+15%', positive: true }} />
                <StatsCard title="Charter Contribution" value={stats.charterShare} icon={TrendingUp} description="Revenue from full charters" />
                <StatsCard title="Marketplace Yield" value={stats.seatShare} icon={Activity} description="Revenue from seat allocations" />
            </StatsGrid>

            <div className="grid gap-6 lg:grid-cols-3">
                <Card className="lg:col-span-2 bg-card border-white/5 shadow-2xl">
                    <CardHeader>
                        <CardTitle>Monthly Revenue Mix</CardTitle>
                        <CardDescription>Volume distribution across primary coordination verticals (₹ Lakhs).</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[350px] pt-4">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={REVENUE_TIMELINE}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                                <XAxis dataKey="month" stroke="#94a3b8" fontSize={10} axisLine={false} tickLine={false} />
                                <YAxis stroke="#94a3b8" fontSize={10} axisLine={false} tickLine={false} />
                                <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px' }} />
                                <Legend />
                                <Bar dataKey="charter" fill="#0EA5E9" radius={[4, 4, 0, 0]} name="Charter Volume" />
                                <Bar dataKey="seats" fill="#D4AF37" radius={[4, 4, 0, 0]} name="Seat Marketplace" />
                                <Bar dataKey="hotel" fill="#10B981" radius={[4, 4, 0, 0]} name="Accommodations" />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                <Card className="bg-card">
                    <CardHeader>
                        <CardTitle className="text-sm font-black uppercase text-accent flex items-center gap-2">
                            <Zap className="h-4 w-4" />
                            Monetization Pulse
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6 pt-4">
                        <div className="p-4 rounded-xl bg-accent/5 border border-accent/10 space-y-1">
                            <p className="text-[10px] font-bold text-accent uppercase tracking-widest">Platform Commission (MTD)</p>
                            <p className="text-2xl font-black text-white">₹ 12.8 L</p>
                        </div>
                        <div className="space-y-2">
                            <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Fee Capture Velocity</p>
                            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                <div className="h-full bg-accent w-[72%]" />
                            </div>
                            <p className="text-[10px] text-muted-foreground italic leading-relaxed">
                                * Average platform fee currently optimized at 6.8% across combined mission sectors.
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
