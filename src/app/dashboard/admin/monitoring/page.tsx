'use client';

import { PageHeader } from "@/components/dashboard/shared/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { StatsGrid } from "@/components/dashboard/shared/stats-grid";
import { StatsCard } from "@/components/dashboard/shared/stats-card";
import { useCollection, useFirestore, useMemoFirebase } from "@/firebase";
import { Skeleton } from "@/components/ui/skeleton";
import type { SystemAlert, SystemLog, ServiceHealth, ServiceStatusState } from "@/lib/types";
import { 
    Activity, 
    ShieldCheck, 
    Zap, 
    Database, 
    Cloud, 
    HardDrive, 
    Users, 
    FileText, 
    GanttChartSquare, 
    Plane, 
    AlertTriangle, 
    CheckCircle2, 
    History,
    RefreshCw,
    Gauge
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
    AreaChart, 
    Area, 
    XAxis, 
    YAxis, 
    CartesianGrid, 
    Tooltip, 
    ResponsiveContainer,
    BarChart,
    Bar,
    Legend
} from 'recharts';
import { cn } from "@/lib/utils";
import { useState, useMemo, useEffect } from "react";
import { AlertCenter } from "@/components/dashboard/admin/monitoring/alert-center";
import { SystemHealthPanel } from "@/components/dashboard/admin/monitoring/system-health-panel";
import { PerformanceIndicators } from "@/components/dashboard/admin/monitoring/performance-indicators";

const MOCK_TRAFFIC_DATA = [
    { name: 'Mon', requests: 45, quotes: 32, bookings: 12 },
    { name: 'Tue', requests: 52, quotes: 38, bookings: 15 },
    { name: 'Wed', requests: 48, quotes: 44, bookings: 18 },
    { name: 'Thu', requests: 61, quotes: 55, bookings: 22 },
    { name: 'Fri', requests: 58, quotes: 49, bookings: 20 },
    { name: 'Sat', requests: 32, quotes: 28, bookings: 10 },
    { name: 'Sun', requests: 28, quotes: 24, bookings: 8 },
];

export default function AdminMonitoringPage() {
    const firestore = useFirestore();
    const [lastSync, setLastSync] = useState(new Date().toLocaleTimeString());

    const { data: alerts, isLoading: alertsLoading } = useCollection<SystemAlert>(null, 'alerts');
    const { data: logs, isLoading: logsLoading } = useCollection<SystemLog>(null, 'systemLogs');
    const { data: rfqs } = useCollection(null, 'charterRequests');
    const { data: el } = useCollection(null, 'emptyLegs');

    const criticalAlert = useMemo(() => alerts?.find(a => a.severity === 'high' && a.status === 'active'), [alerts]);

    const stats = useMemo(() => ({
        activeUsers: 142, // Simulated live counter
        requestsToday: rfqs?.length || 0,
        quotesToday: 24,
        seatBookings: 8,
        activeOperators: 12,
        aircraftOnline: 42
    }), [rfqs]);

    const handleRefresh = () => {
        setLastSync(new Date().toLocaleTimeString());
    };

    return (
        <div className="space-y-6">
            {criticalAlert && (
                <div className="bg-rose-500/10 border border-rose-500/20 p-4 rounded-xl flex items-center justify-between animate-in slide-in-from-top-4 duration-500">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-rose-500 rounded-full animate-pulse">
                            <AlertTriangle className="h-5 w-5 text-white" />
                        </div>
                        <div>
                            <p className="text-xs font-black uppercase text-rose-500 tracking-widest">High Severity Alert Detected</p>
                            <p className="text-sm font-bold text-white">{criticalAlert.message}</p>
                        </div>
                    </div>
                    <Button variant="outline" size="sm" className="bg-rose-500/20 border-rose-500/30 text-rose-500 hover:bg-rose-500 hover:text-white font-bold h-8">
                        Review Protocol
                    </Button>
                </div>
            )}

            <PageHeader 
                title="Platform Monitoring Center" 
                description="Institutional visibility into system health, operational telemetry, and security signals."
            >
                <div className="flex items-center gap-4">
                    <div className="text-right hidden sm:block">
                        <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest leading-none mb-1">Telemetry Sync</p>
                        <p className="text-[10px] font-code text-primary leading-none">{lastSync}</p>
                    </div>
                    <Button onClick={handleRefresh} variant="outline" size="sm" className="h-9 gap-2 border-white/10 font-bold uppercase text-[9px] tracking-widest">
                        <RefreshCw className="h-3.5 w-3.5" /> Refresh Hub
                    </Button>
                </div>
            </PageHeader>

            <StatsGrid>
                <StatsCard title="Active Network Users" value={stats.activeUsers.toString()} icon={Users} description="Simulated live pulse" />
                <StatsCard title="Daily Demand (RFQs)" value={stats.requestsToday.toString()} icon={FileText} description="Created in last 24h" />
                <StatsCard title="Marketplace Bids" value={stats.quotesToday.toString()} icon={GanttChartSquare} description="Submitted by NSOPs" />
                <StatsCard title="Integrity Score" value="99.8%" icon={ShieldCheck} description="System-wide health" />
            </StatsGrid>

            <div className="grid gap-6 lg:grid-cols-3">
                <div className="lg:col-span-2 space-y-6">
                    <Card className="bg-card">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <div>
                                <CardTitle className="text-base flex items-center gap-2">
                                    <Activity className="h-4 w-4 text-primary" />
                                    Platform Pulse (7 Days)
                                </CardTitle>
                                <CardDescription>Operational throughput and commercial activity trends.</CardDescription>
                            </div>
                            <Badge variant="outline" className="font-code text-[10px] border-primary/20 text-primary">LIVE DATA</Badge>
                        </CardHeader>
                        <CardContent className="h-[300px] pt-4">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={MOCK_TRAFFIC_DATA}>
                                    <defs>
                                        <linearGradient id="colorReq" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#0EA5E9" stopOpacity={0.3}/>
                                            <stop offset="95%" stopColor="#0EA5E9" stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                                    <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} axisLine={false} tickLine={false} />
                                    <YAxis stroke="#94a3b8" fontSize={10} axisLine={false} tickLine={false} />
                                    <Tooltip 
                                        contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px' }}
                                        itemStyle={{ fontSize: '10px', fontWeight: 'bold' }}
                                    />
                                    <Area type="monotone" dataKey="requests" stroke="#0EA5E9" fillOpacity={1} fill="url(#colorReq)" name="Demand (RFQs)" />
                                    <Area type="monotone" dataKey="quotes" stroke="#FFFFBD" fillOpacity={0.1} name="Market Bids" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>

                    <AlertCenter />
                </div>

                <div className="space-y-6">
                    <SystemHealthPanel />
                    <PerformanceIndicators />
                    
                    <Card className="bg-card">
                        <CardHeader>
                            <CardTitle className="text-sm flex items-center gap-2">
                                <History className="h-4 w-4 text-primary" />
                                Recent System Logs
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="max-h-[300px] overflow-y-auto px-6 pb-6 space-y-4">
                                {logs?.map((log) => (
                                    <div key={log.id} className="relative pl-4 border-l border-white/5 space-y-1 group">
                                        <div className="absolute left-[-4.5px] top-1 w-2 h-2 rounded-full bg-primary/40 group-hover:bg-primary transition-colors" />
                                        <p className="text-[10px] font-bold text-foreground uppercase">{log.event.replace('_', ' ')}</p>
                                        <p className="text-[9px] text-muted-foreground leading-tight">{log.action}</p>
                                        <p className="text-[8px] text-muted-foreground font-code opacity-60">
                                            {new Date(log.timestamp).toLocaleTimeString()} • {log.userId}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
