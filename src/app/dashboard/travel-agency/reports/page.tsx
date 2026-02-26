
'use client';

import { PageHeader } from "@/components/dashboard/shared/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useUser } from "@/hooks/use-user";
import { useCollection, useFirestore, useMemoFirebase } from "@/firebase";
import { collection, query, where, collectionGroup } from "firebase/firestore";
import { Skeleton } from "@/components/ui/skeleton";
import type { CharterRFQ, EmptyLegSeatAllocationRequest } from "@/lib/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StatsCard } from "@/components/dashboard/shared/stats-card";
import { StatsGrid } from "@/components/dashboard/shared/stats-grid";
import { 
    Download, 
    Search, 
    Filter, 
    History, 
    TrendingUp, 
    DollarSign, 
    Plane, 
    Users, 
    Target, 
    Zap, 
    MapPin,
    Clock,
    BarChart3
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { 
    BarChart, 
    Bar, 
    XAxis, 
    YAxis, 
    CartesianGrid, 
    Tooltip, 
    ResponsiveContainer, 
    AreaChart, 
    Area, 
    PieChart, 
    Pie, 
    Cell 
} from 'recharts';
import { AgencyAIInsights } from "@/components/dashboard/travel-agency/reports/ai-insights";

const COLORS = ['#0EA5E9', '#EEDC5B', '#F43F5E', '#10B981', '#8B5CF6'];

const sectorTrendData = [
    { name: 'BOM-DEL', activity: 45, value: 8500000 },
    { name: 'DEL-LHR', activity: 32, value: 12000000 },
    { name: 'BLR-GOI', activity: 28, value: 2500000 },
    { name: 'MAA-SIN', activity: 15, value: 6800000 },
    { name: 'BOM-DXB', activity: 22, value: 9200000 },
];

const conversionData = [
    { month: 'May', requested: 20, approved: 12 },
    { month: 'Jun', requested: 25, approved: 18 },
    { month: 'Jul', requested: 35, approved: 22 },
];

export default function AgencyReportsPage() {
    const { user, isLoading: isUserLoading } = useUser();
    const firestore = useFirestore();
    const [searchTerm, setSearchTerm] = useState("");

    const charterQuery = useMemoFirebase(() => {
        if (!firestore || !user) return null;
        return query(collection(firestore, 'charterRFQs'), where('requesterExternalAuthId', '==', user.id));
    }, [firestore, user]);
    const { data: charters, isLoading: charterLoading } = useCollection<CharterRFQ>(charterQuery, 'charterRFQs');

    const seatQuery = useMemoFirebase(() => {
        if (!firestore || !user) return null;
        return query(collectionGroup(firestore, 'seatAllocationRequests'), where('requesterExternalAuthId', '==', user.id));
    }, [firestore, user]);
    const { data: seatRequests, isLoading: seatLoading } = useCollection<EmptyLegSeatAllocationRequest>(seatQuery, 'emptyLegs/all/seatAllocationRequests');

    const isLoading = isUserLoading || charterLoading || seatLoading;

    const charterHistory = charters?.filter(c => ['Confirmed', 'Cancelled', 'Expired', 'Closed'].includes(c.status)) || [];
    const seatHistory = seatRequests?.filter(s => ['Approved', 'Rejected', 'Cancelled'].includes(s.status)) || [];

    const filteredCharters = charterHistory.filter(c => 
        c.departure.toLowerCase().includes(searchTerm.toLowerCase()) || 
        c.arrival.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.id.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const filteredSeats = seatHistory.filter(s => 
        s.emptyLegId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (s.clientReference?.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const stats = {
        grossVolume: "₹ 1.4 Cr",
        completedMovements: (charterHistory.filter(c => c.status === 'Confirmed').length + seatHistory.filter(s => s.status === 'Approved').length),
        conversionRate: charterHistory.length > 0 ? Math.round((charterHistory.filter(c => c.status === 'Confirmed').length / charterHistory.length) * 100) : 0,
        fulfillmentRatio: seatHistory.length > 0 ? Math.round((seatHistory.filter(s => s.status === 'Approved').length / seatHistory.length) * 100) : 0
    };

    return (
        <>
            <PageHeader 
                title="Agency Intelligence & Performance" 
                description="Strategic demand analysis, conversion tracking, and institutional audit visibility."
            >
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="h-9 gap-2 border-white/10">
                        <Download className="h-3.5 w-3.5" /> Export Insights
                    </Button>
                </div>
            </PageHeader>

            <StatsGrid>
                <StatsCard 
                    title="Gross Coordination" 
                    value={isLoading ? <Skeleton className="h-6 w-20" /> : stats.grossVolume} 
                    icon={DollarSign} 
                    description="Simulated mission volume" 
                />
                <StatsCard 
                    title="Movement Success" 
                    value={isLoading ? <Skeleton className="h-6 w-12" /> : stats.completedMovements.toString()} 
                    icon={Target} 
                    description="Confirmed & Synchronized" 
                />
                <StatsCard 
                    title="Lead Conversion" 
                    value={isLoading ? <Skeleton className="h-6 w-12" /> : `${stats.conversionRate}%`} 
                    icon={TrendingUp} 
                    description="RFQ to Confirmation" 
                />
                <StatsCard 
                    title="Seat Fulfillment" 
                    value={isLoading ? <Skeleton className="h-6 w-12" /> : `${stats.fulfillmentRatio}%`} 
                    icon={Zap} 
                    description="Lead to Approved Block" 
                />
            </StatsGrid>

            <div className="mt-6 space-y-6">
                <AgencyAIInsights />

                <Tabs defaultValue="performance" className="w-full">
                    <TabsList className="bg-muted/20 border border-white/5 mb-6 p-1">
                        <TabsTrigger value="performance" className="gap-2">
                            <BarChart3 className="h-3.5 w-3.5" /> Performance Funnels
                        </TabsTrigger>
                        <TabsTrigger value="trends" className="gap-2">
                            <MapPin className="h-3.5 w-3.5" /> Sector Insights
                        </TabsTrigger>
                        <TabsTrigger value="history" className="gap-2">
                            <History className="h-3.5 w-3.5" /> Activity Archive
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="performance" className="space-y-6 animate-in fade-in slide-in-from-top-2">
                        <div className="grid gap-6 md:grid-cols-2">
                            <Card className="bg-card">
                                <CardHeader>
                                    <CardTitle>Seat Allocation Success</CardTitle>
                                    <CardDescription>Requested vs. Approved blocks over time.</CardDescription>
                                </CardHeader>
                                <CardContent className="h-[300px]">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart data={conversionData}>
                                            <defs>
                                                <linearGradient id="colorReq" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#0EA5E9" stopOpacity={0.3}/>
                                                    <stop offset="95%" stopColor="#0EA5E9" stopOpacity={0}/>
                                                </linearGradient>
                                                <linearGradient id="colorApp" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                                                    <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                                                </linearGradient>
                                            </defs>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                                            <XAxis dataKey="month" stroke="#94a3b8" fontSize={10} />
                                            <YAxis stroke="#94a3b8" fontSize={10} />
                                            <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b' }} />
                                            <Area type="monotone" dataKey="requested" stroke="#0EA5E9" fillOpacity={1} fill="url(#colorReq)" name="Requested" />
                                            <Area type="monotone" dataKey="approved" stroke="#10B981" fillOpacity={1} fill="url(#colorApp)" name="Approved" />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </CardContent>
                            </Card>

                            <Card className="bg-card">
                                <CardHeader>
                                    <CardTitle>Coordination Efficiency</CardTitle>
                                    <CardDescription>Response time vs. Conversion Ratio.</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-xs uppercase font-bold text-muted-foreground">
                                            <span>Charter Response Avg</span>
                                            <span className="text-accent">2.4 Hours</span>
                                        </div>
                                        <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                            <div className="h-full bg-accent w-[85%]" />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-xs uppercase font-bold text-muted-foreground">
                                            <span>Seat Block Approval Time</span>
                                            <span className="text-sky-400">1.1 Hours</span>
                                        </div>
                                        <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                            <div className="h-full bg-sky-400 w-[95%]" />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-xs uppercase font-bold text-muted-foreground">
                                            <span>Fulfillment Reliability</span>
                                            <span className="text-green-500">92%</span>
                                        </div>
                                        <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                            <div className="h-full bg-green-500 w-[92%]" />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>

                    <TabsContent value="trends" className="space-y-6 animate-in fade-in slide-in-from-top-2">
                        <div className="grid gap-6 md:grid-cols-3">
                            <Card className="md:col-span-2 bg-card">
                                <CardHeader>
                                    <CardTitle>Top Demand Sectors</CardTitle>
                                    <CardDescription>Activity concentration across key routes.</CardDescription>
                                </CardHeader>
                                <CardContent className="h-[350px]">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={sectorTrendData} layout="vertical">
                                            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" horizontal={false} />
                                            <XAxis type="number" stroke="#94a3b8" fontSize={10} hide />
                                            <YAxis type="category" dataKey="name" stroke="#94a3b8" fontSize={10} width={80} />
                                            <Tooltip 
                                                contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b' }}
                                            />
                                            <Bar dataKey="activity" name="Movement Count" fill="#0EA5E9" radius={[0, 4, 4, 0]} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </CardContent>
                            </Card>

                            <Card className="bg-card">
                                <CardHeader>
                                    <CardTitle>Demand Mix</CardTitle>
                                    <CardDescription>Charter vs. Seat preference.</CardDescription>
                                </CardHeader>
                                <CardContent className="h-[250px] flex flex-col justify-center">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={[
                                                    { name: 'Full Charter', value: 65 },
                                                    { name: 'Seat Allocation', value: 35 }
                                                ]}
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={60}
                                                outerRadius={80}
                                                paddingAngle={5}
                                                dataKey="value"
                                            >
                                                <Cell fill="#0EA5E9" />
                                                <Cell fill="#EEDC5B" />
                                            </Pie>
                                            <Tooltip />
                                        </PieChart>
                                    </ResponsiveContainer>
                                    <div className="flex justify-center gap-4 mt-4">
                                        <div className="flex items-center gap-1.5 text-[10px] uppercase font-bold">
                                            <div className="w-2 h-2 rounded-full bg-sky-500" /> Charter
                                        </div>
                                        <div className="flex items-center gap-1.5 text-[10px] uppercase font-bold">
                                            <div className="w-2 h-2 rounded-full bg-accent" /> Seats
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>

                    <TabsContent value="history" className="space-y-6 animate-in fade-in slide-in-from-top-2">
                        <div className="flex flex-col md:flex-row gap-4 mb-2">
                            <div className="relative flex-grow">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input 
                                    placeholder="Filter by sector, client ref, or ID..." 
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10 bg-muted/20 border-white/10"
                                />
                            </div>
                        </div>

                        <Card className="bg-card">
                            <CardHeader>
                                <CardTitle>Institutional Activity Archive</CardTitle>
                                <CardDescription>Consolidated record of all client movements and coordination outcomes.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                {isLoading ? <Skeleton className="h-64 w-full" /> : (
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Execution ID</TableHead>
                                                <TableHead>Type</TableHead>
                                                <TableHead>Sector</TableHead>
                                                <TableHead>Client Ref</TableHead>
                                                <TableHead>Outcome</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {[...filteredCharters, ...filteredSeats].sort((a, b) => b.id.localeCompare(a.id)).map((item) => (
                                                <TableRow key={item.id}>
                                                    <TableCell className="font-code text-xs font-bold">{item.id}</TableCell>
                                                    <TableCell>
                                                        <Badge variant="outline" className="text-[8px] uppercase tracking-tighter">
                                                            {('departure' in item) ? 'CHARTER' : 'SEAT BLOCK'}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell className="text-xs">
                                                        {('departure' in item) ? `${item.departure} → ${item.arrival}` : (item as any).emptyLegId}
                                                    </TableCell>
                                                    <TableCell className="text-xs font-medium">
                                                        {('customerName' in item) ? item.customerName : (item as any).clientReference || 'N/A'}
                                                    </TableCell>
                                                    <TableCell>
                                                        <Badge variant={item.status === 'Confirmed' || item.status === 'Approved' ? 'success' : 'secondary'} className="text-[9px] font-bold uppercase">
                                                            {item.status}
                                                        </Badge>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </>
    );
}
