
'use client';

import React, { useMemo } from 'react';
import { PageHeader } from "@/components/dashboard/shared/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
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
    PieChart as RePieChart, 
    Pie, 
    Cell,
    AreaChart,
    Area,
    Legend,
    ComposedChart,
    Line
} from 'recharts';
import { 
    Activity, 
    DollarSign, 
    Plane, 
    TrendingUp, 
    Target, 
    Zap, 
    Download,
    BarChart3
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useUser } from "@/hooks/use-user";
import { useCollection, useFirestore, useMemoFirebase } from "@/firebase";
import { collection, query, where } from "firebase/firestore";
import { Skeleton } from "@/components/ui/skeleton";
import type { EmployeeTravelRequest, CostCenter, CorporateOrganization } from "@/lib/types";
import { formatSector } from "@/lib/geo-utils";
import { cn } from "@/lib/utils";

export default function CorporateAnalyticsPage() {
    const { user } = useUser();
    const firestore = useFirestore();

    const requestsQuery = useMemoFirebase(() => {
        if (!firestore || (firestore as any)._isMock || !user?.corporateId) return null;
        return query(collection(firestore, 'employeeTravelRequests'), where('corporateId', '==', user.corporateId));
    }, [firestore, user?.corporateId]);

    const { data: requests, isLoading: requestsLoading } = useCollection<EmployeeTravelRequest>(requestsQuery, 'employeeTravelRequests');

    const centersQuery = useMemoFirebase(() => {
        if (!firestore || (firestore as any)._isMock || !user?.corporateId) return null;
        return query(collection(firestore, 'costCenters'), where('corporateId', '==', user.corporateId));
    }, [firestore, user?.corporateId]);

    const { data: centers, isLoading: centersLoading } = useCollection<CostCenter>(centersQuery, 'costCenters');

    const orgsQuery = useMemoFirebase(() => {
        if (!firestore || (firestore as any)._isMock || !user?.corporateId) return null;
        return query(collection(firestore, 'corporateOrganizations'), where('corporateId', '==', user.corporateId));
    }, [firestore, user?.corporateId]);

    const { data: orgs } = useCollection<CorporateOrganization>(orgsQuery, 'corporateOrganizations');

    const myOrg = orgs?.[0];

    const stats = useMemo(() => {
        if (!requests) return { totalSpend: 0, missionCount: 0, avgValue: 0, completionRate: '0%' };
        const completed = requests.filter(r => r.requestStatus === 'TRIP_COMPLETED');
        const spend = completed.reduce((acc, r) => acc + (r.estimatedBudget || 0), 0);
        return {
            totalSpend: spend,
            missionCount: requests.length,
            avgValue: requests.length > 0 ? spend / requests.length : 0,
            completionRate: requests.length > 0 ? `${Math.round((completed.length / requests.length) * 100)}%` : '0%'
        };
    }, [requests]);

    const routeData = useMemo(() => {
        if (!requests) return [];
        const counts: Record<string, number> = {};
        requests.forEach(r => {
            const sector = `${formatSector(r.origin)} » ${formatSector(r.destination)}`;
            counts[sector] = (counts[sector] || 0) + 1;
        });
        return Object.entries(counts)
            .map(([name, value]) => ({ name, value }))
            .sort((a, b) => b.value - a.value)
            .slice(0, 5);
    }, [requests]);

    const departmentData = useMemo(() => {
        if (!centers) return [];
        return centers.map(c => ({
            name: c.departmentName,
            allocated: c.allocatedBudget / 100000,
            used: c.usedBudget / 100000
        }));
    }, [centers]);

    const isLoading = requestsLoading || centersLoading;

    return (
        <div className="space-y-6">
            <PageHeader 
                title="Aviation Spend Intelligence" 
                description={`Enterprise-wide travel data and commercial audit for ${myOrg?.companyName || 'Organization'}.`}
            >
                <Button variant="outline" className="h-9 gap-2 border-white/10 text-[10px] font-black uppercase tracking-widest">
                    <Download className="h-3.5 w-3.5" /> Export Data Set
                </Button>
            </PageHeader>

            <StatsGrid>
                <StatsCard 
                    title="Total Volume (Settled)" 
                    value={isLoading ? <Skeleton className="h-6 w-16" /> : `₹ ${(stats.totalSpend / 10000000).toFixed(2)} Cr`} 
                    icon={DollarSign} 
                    description="Verified mission spend" 
                />
                <StatsCard 
                    title="Mission Frequency" 
                    value={isLoading ? <Skeleton className="h-6 w-8" /> : stats.missionCount.toString()} 
                    icon={Plane} 
                    description="Total requests processed" 
                />
                <StatsCard 
                    title="Avg. Mission Value" 
                    value={isLoading ? <Skeleton className="h-6 w-16" /> : `₹ ${(stats.avgValue / 100000).toFixed(1)} L`} 
                    icon={TrendingUp} 
                    description="Cost per coordination" 
                />
                <StatsCard 
                    title="Protocol Completion" 
                    value={isLoading ? <Skeleton className="h-6 w-12" /> : stats.completionRate} 
                    icon={Target} 
                    description="Inquiry to Landing" 
                />
            </StatsGrid>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-2 bg-card border-white/5">
                    <CardHeader>
                        <CardTitle>Departmental Spend Profile</CardTitle>
                        <CardDescription>Budget allocation vs. actual consumption across cost centers (₹ Lakhs).</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[350px]">
                        {isLoading ? <Skeleton className="h-full w-full" /> : (
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={departmentData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                                    <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} axisLine={false} tickLine={false} />
                                    <YAxis stroke="#94a3b8" fontSize={10} axisLine={false} tickLine={false} />
                                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px' }} />
                                    <Legend />
                                    <Bar dataKey="allocated" name="Allocated Budget" fill="#1e293b" radius={[4, 4, 0, 0]} />
                                    <Bar dataKey="used" name="Consumed Amount" fill="#0EA5E9" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        )}
                    </CardContent>
                </Card>

                <Card className="bg-card border-white/5">
                    <CardHeader>
                        <CardTitle>High Intensity Sectors</CardTitle>
                        <CardDescription>Frequency mix by metropolitan corridor.</CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col items-center justify-center h-[300px]">
                        <div className="h-[200px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <RePieChart>
                                    <Pie 
                                        data={routeData} 
                                        cx="50%" 
                                        cy="50%" 
                                        innerRadius={60} 
                                        outerRadius={80} 
                                        paddingAngle={5} 
                                        dataKey="value" 
                                        stroke="none"
                                    >
                                        {routeData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={['#0EA5E9', '#D4AF37', '#10B981', '#F43F5E', '#8B5CF6'][index % 5]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </RePieChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="w-full space-y-2 mt-4 px-4 overflow-y-auto max-h-[100px] scrollbar-hide">
                            {routeData.map((item, index) => (
                                <div key={item.name} className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest">
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: ['#0EA5E9', '#D4AF37', '#10B981', '#F43F5E', '#8B5CF6'][index % 5] }} />
                                        <span className="text-muted-foreground truncate max-w-[120px]">{item.name}</span>
                                    </div>
                                    <span className="text-white">{item.value} Missions</span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bg-primary/5 border-primary/20">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-xs font-black uppercase text-primary tracking-widest flex items-center gap-2">
                            <Zap className="h-4 w-4" /> Yield Opportunity Signals
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 pt-2">
                        <p className="text-[11px] text-muted-foreground leading-relaxed italic">
                            "High frequency of individual light-jet missions detected on West Zone corridors. Consolidating into monthly mid-size blocks could reduce net coordination costs by ~12%."
                        </p>
                        <Badge variant="outline" className="text-[8px] font-black border-primary/20 text-primary">AI ADVISORY ACTIVE</Badge>
                    </CardContent>
                </Card>

                <Card className="bg-card border-white/5">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-bold flex items-center gap-2">
                            <Activity className="h-4 w-4 text-sky-400" />
                            Fleet Class Utilization
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {[
                                { class: 'Heavy Jet', count: '45%', color: 'bg-primary' },
                                { class: 'Mid-size Jet', count: '30%', color: 'bg-accent' },
                                { class: 'Light Jet', count: '25%', color: 'bg-sky-400' },
                            ].map(item => (
                                <div key={item.class} className="space-y-1">
                                    <div className="flex justify-between text-[9px] font-black uppercase text-muted-foreground">
                                        <span>{item.class}</span>
                                        <span>{item.count}</span>
                                    </div>
                                    <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                                        <div className={cn("h-full", item.color)} style={{ width: item.count }} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
