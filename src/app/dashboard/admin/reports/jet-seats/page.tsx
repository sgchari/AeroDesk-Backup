'use client';

import { PageHeader } from "@/components/dashboard/shared/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { StatsCard } from "@/components/dashboard/shared/stats-card";
import { StatsGrid } from "@/components/dashboard/shared/stats-grid";
import { useCollection } from "@/firebase";
import { Skeleton } from "@/components/ui/skeleton";
import type { SeatAllocationRequest, EmptyLeg } from "@/lib/types";
import { 
    Armchair, 
    Zap, 
    CheckCircle2, 
    TrendingUp, 
    Activity,
    Coins
} from "lucide-react";
import { useMemo } from "react";
import { 
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, PieChart, Pie, Cell 
} from 'recharts';

const COLORS = ['#0EA5E9', '#FFFFBD', '#10B981', '#F43F5E'];

export default function JetSeatMarketplaceReportsPage() {
    const { data: requests, isLoading: requestsLoading } = useCollection<SeatAllocationRequest>(null, 'seatAllocationRequests');
    const { data: legs, isLoading: legsLoading } = useCollection<EmptyLeg>(null, 'emptyLegs');

    const stats = useMemo(() => {
        if (!requests || !legs) return { total: 0, approved: 0, sold: 0, published: 0 };
        return {
            total: requests.length,
            approved: requests.filter(r => r.requestStatus === 'APPROVED').length,
            sold: requests.filter(r => ['CONFIRMED', 'COMPLETED'].includes(r.requestStatus)).length,
            published: legs.filter(l => ['Published', 'Approved', 'live'].includes(l.status)).length
        };
    }, [requests, legs]);

    const chartData = [
        { name: 'Total Leads', value: stats.total },
        { name: 'Approved', value: stats.approved },
        { name: 'Confirmed', value: stats.sold },
    ];

    const isLoading = requestsLoading || legsLoading;

    return (
        <div className="space-y-6">
            <PageHeader 
                title="Jet Seat Marketplace Intelligence" 
                description="Institutional tracking of seat demand, liquidity, and secondary market conversion." 
            />

            <StatsGrid>
                <StatsCard title="Seat Leads (Total)" value={isLoading ? <Skeleton className="h-6 w-12" /> : stats.total.toString()} icon={Armchair} description="Individual seat inquiries" />
                <StatsCard title="Allocation Velocity" value={isLoading ? <Skeleton className="h-6 w-12" /> : stats.approved.toString()} icon={Zap} description="Approved by operators" />
                <StatsCard title="Seats Confirmed" value={isLoading ? <Skeleton className="h-6 w-12" /> : stats.sold.toString()} icon={CheckCircle2} description="Settled transactions" trend={{ value: '+12%', positive: true }} />
                <StatsCard title="Market Listings" value={isLoading ? <Skeleton className="h-6 w-12" /> : stats.published.toString()} icon={Activity} description="Published positioning flights" />
            </StatsGrid>

            <div className="grid gap-6 md:grid-cols-2">
                <Card className="bg-card border-white/5 shadow-2xl">
                    <CardHeader>
                        <CardTitle>Marketplace Funnel</CardTitle>
                        <CardDescription>Conversion efficiency from lead generation to confirmation.</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[350px] pt-4">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                                <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} axisLine={false} tickLine={false} />
                                <YAxis stroke="#94a3b8" fontSize={10} axisLine={false} tickLine={false} />
                                <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px' }} />
                                <Bar dataKey="value" fill="#0EA5E9" radius={[4, 4, 0, 0]} name="Volume" />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                <Card className="bg-card border-white/5 shadow-2xl">
                    <CardHeader>
                        <CardTitle>Inventory Liquidity</CardTitle>
                        <CardDescription>Ratio of confirmed seats vs. open leads across the network.</CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col items-center justify-center h-[350px]">
                        <div className="h-[250px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={chartData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={5}
                                        dataKey="value"
                                        stroke="none"
                                    >
                                        {chartData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="flex gap-6 mt-4">
                            {chartData.map((item, idx) => (
                                <div key={item.name} className="flex items-center gap-2">
                                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                                    <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{item.name}</span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
