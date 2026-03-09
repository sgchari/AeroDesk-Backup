'use client';

import { PageHeader } from "@/components/dashboard/shared/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { StatsCard } from "@/components/dashboard/shared/stats-card";
import { StatsGrid } from "@/components/dashboard/shared/stats-grid";
import { useCollection } from "@/firebase";
import { Skeleton } from "@/components/ui/skeleton";
import type { User, CharterRFQ, SeatAllocationRequest } from "@/lib/types";
import { 
    Users, 
    Activity, 
    FileText, 
    CheckCircle2, 
    TrendingUp,
    MousePointer2
} from "lucide-react";
import { useMemo } from "react";
import { 
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend 
} from 'recharts';

const USAGE_TRENDS = [
    { day: 'Mon', sessions: 124, requests: 12 },
    { day: 'Tue', sessions: 145, requests: 15 },
    { day: 'Wed', sessions: 132, requests: 18 },
    { day: 'Thu', sessions: 168, requests: 22 },
    { day: 'Fri', sessions: 189, requests: 20 },
    { day: 'Sat', sessions: 112, requests: 8 },
    { day: 'Sun', sessions: 98, requests: 5 },
];

export default function PlatformUsageReportsPage() {
    const { data: users, isLoading: usersLoading } = useCollection<User>(null, 'users');
    const { data: rfqs, isLoading: rfqsLoading } = useCollection<CharterRFQ>(null, 'charterRequests');
    const { data: seats, isLoading: seatsLoading } = useCollection<SeatAllocationRequest>(null, 'seatAllocationRequests');

    const stats = useMemo(() => ({
        totalUsers: users?.length || 0,
        activeToday: 142, // Simulated active pulse
        totalRequests: (rfqs?.length || 0) + (seats?.length || 0),
        completions: (rfqs?.filter(r => r.status === 'tripClosed').length || 0) + (seats?.filter(s => s.requestStatus === 'COMPLETED').length || 0)
    }), [users, rfqs, seats]);

    const isLoading = usersLoading || rfqsLoading || seatsLoading;

    return (
        <div className="space-y-6">
            <PageHeader 
                title="Platform Usage Intelligence" 
                description="Cross-role engagement tracking and operational throughput analytics." 
            />

            <StatsGrid>
                <StatsCard title="Authorized Personnel" value={isLoading ? <Skeleton className="h-6 w-12" /> : stats.totalUsers.toString()} icon={Users} description="Registered stakeholder nodes" />
                <StatsCard title="Active Sessions" value={stats.activeToday.toString()} icon={Activity} description="Simulated live pulse (24h)" trend={{ value: '+8%', positive: true }} />
                <StatsCard title="Interaction Volume" value={isLoading ? <Skeleton className="h-6 w-12" /> : stats.totalRequests.toString()} icon={MousePointer2} description="Leads & Coordination events" />
                <StatsCard title="Protocol Success" value={isLoading ? <Skeleton className="h-6 w-12" /> : stats.completions.toString()} icon={CheckCircle2} description="Successful journey closures" />
            </StatsGrid>

            <div className="grid gap-6">
                <Card className="bg-card border-white/5 shadow-2xl">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <TrendingUp className="h-4 w-4 text-primary" />
                            Institutional Engagement Trend
                        </CardTitle>
                        <CardDescription>Daily active sessions mapped against coordination requests created.</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[400px] pt-4">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={USAGE_TRENDS}>
                                <defs>
                                    <linearGradient id="colorSessions" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#FFFFBD" stopOpacity={0.3}/>
                                        <stop offset="95%" stopColor="#FFFFBD" stopOpacity={0}/>
                                    </linearGradient>
                                    <linearGradient id="colorReqs" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#0EA5E9" stopOpacity={0.3}/>
                                        <stop offset="95%" stopColor="#0EA5E9" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                                <XAxis dataKey="day" stroke="#94a3b8" fontSize={10} axisLine={false} tickLine={false} />
                                <YAxis stroke="#94a3b8" fontSize={10} axisLine={false} tickLine={false} />
                                <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px' }} />
                                <Legend />
                                <Area type="monotone" dataKey="sessions" stroke="#FFFFBD" fillOpacity={1} fill="url(#colorSessions)" name="Active Sessions" />
                                <Area type="monotone" dataKey="requests" stroke="#0EA5E9" fillOpacity={1} fill="url(#colorReqs)" name="New Requests" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
