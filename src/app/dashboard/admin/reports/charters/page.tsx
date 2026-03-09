'use client';

import { PageHeader } from "@/components/dashboard/shared/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { StatsGrid } from "@/components/dashboard/shared/stats-grid";
import { StatsCard } from "@/components/dashboard/shared/stats-card";
import { useCollection } from "@/firebase";
import { Skeleton } from "@/components/ui/skeleton";
import type { CharterRFQ } from "@/lib/types";
import { GanttChartSquare, FileText, CheckCircle2, Clock, MapPin, Activity } from "lucide-react";
import { useMemo } from "react";
import { 
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend 
} from 'recharts';

export default function CharterRequestReportsPage() {
    const { data: rfqs, isLoading } = useCollection<CharterRFQ>(null, 'charterRequests');

    const stats = useMemo(() => ({
        total: rfqs?.length || 0,
        confirmed: rfqs?.filter(r => ['charterConfirmed', 'boarding', 'departed', 'arrived'].includes(r.status)).length || 0,
        completed: rfqs?.filter(r => r.status === 'flightCompleted' || r.status === 'tripClosed').length || 0,
        active: rfqs?.filter(r => ['Bidding Open', 'rfqSubmitted'].includes(r.status)).length || 0
    }), [rfqs]);

    const routeData = useMemo(() => {
        if (!rfqs) return [];
        const counts: Record<string, number> = {};
        rfqs.forEach(r => {
            const key = `${r.departure.split(' (')[0]}-${r.arrival.split(' (')[0]}`;
            counts[key] = (counts[key] || 0) + 1;
        });
        return Object.entries(counts).map(([name, count]) => ({ name, count })).slice(0, 5);
    }, [rfqs]);

    return (
        <div className="space-y-6">
            <PageHeader title="Charter Demand Analytics" description="Institutional intelligence on national charter flows and conversion efficiency." />

            <StatsGrid>
                <StatsCard title="Total RFQs" value={stats.total.toString()} icon={FileText} description="Global coordination requests" />
                <StatsCard title="Confirmed Missions" value={stats.confirmed.toString()} icon={ShieldCheck} description="Won operator technical bids" />
                <StatsCard title="Completed Trips" value={stats.completed.toString()} icon={CheckCircle2} description="Commercial cycle closed" />
                <StatsCard title="Marketplace Bids" value="142" icon={GanttChartSquare} description="Technical quotations published" />
            </StatsGrid>

            <div className="grid gap-6 md:grid-cols-2">
                <Card className="bg-card">
                    <CardHeader>
                        <CardTitle>Sector Intensity Index</CardTitle>
                        <CardDescription>Most frequented corridor sector demand.</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={routeData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                                <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} axisLine={false} tickLine={false} />
                                <YAxis stroke="#94a3b8" fontSize={10} axisLine={false} tickLine={false} />
                                <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px' }} />
                                <Bar dataKey="count" fill="#0EA5E9" radius={[4, 4, 0, 0]} name="Inquiry Count" />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                <Card className="bg-card border-white/5">
                    <CardHeader>
                        <CardTitle className="text-sm font-bold flex items-center gap-2">
                            <Activity className="h-4 w-4 text-emerald-500" />
                            Fulfillment Efficiency
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6 pt-4">
                        <div className="space-y-2">
                            <div className="flex justify-between text-[10px] uppercase font-black text-muted-foreground">
                                <span>Lead to Bid Ratio</span>
                                <span className="text-white">84%</span>
                            </div>
                            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                <div className="h-full bg-emerald-500 w-[84%]" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <div className="flex justify-between text-[10px] uppercase font-black text-muted-foreground">
                                <span>Commercial Win Ratio</span>
                                <span className="text-white">22%</span>
                            </div>
                            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                <div className="h-full bg-accent w-[22%]" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
