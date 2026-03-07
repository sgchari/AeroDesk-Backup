'use client';

import React, { useState } from 'react';
import { PageHeader } from "@/components/dashboard/shared/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCollection, useFirestore, updateDocumentNonBlocking, addDocumentNonBlocking, useMemoFirebase } from "@/firebase";
import { useUser } from "@/hooks/use-user";
import type { Aircraft, AircraftMaintenance, MaintenanceSchedule, DefectReport, MaintenanceWorkOrder } from "@/lib/types";
import { 
    Wrench, 
    Calendar, 
    ClipboardList, 
    FileWarning, 
    Clock, 
    CheckCircle2, 
    PlusCircle,
    User,
    Plane,
    Activity,
    ArrowRight
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

export default function OperatorMaintenancePage() {
    const { user } = useUser();
    const { toast } = useToast();
    const firestore = useFirestore();
    const opId = user?.operatorId || 'op-west-01';

    const { data: fleet, isLoading: fleetLoading } = useCollection<Aircraft>(null, 'aircrafts');
    const { data: mnt } = useCollection<AircraftMaintenance>(null, 'aircraftMaintenance');
    const { data: sched } = useCollection<MaintenanceSchedule>(null, 'maintenanceSchedule');
    const { data: techLog } = useCollection<DefectReport>(null, 'defectReports');
    const { data: orders } = useCollection<MaintenanceWorkOrder>(null, 'maintenanceWorkOrders');

    const opFleet = fleet?.filter(a => a.operatorId === opId) || [];
    const openDefects = techLog?.filter(d => d.status === 'OPEN') || [];
    const activeWork = orders?.filter(o => o.status === 'IN_PROGRESS') || [];

    const handleCompleteWorkOrder = (woId: string, acId: string) => {
        if (!firestore) return;

        // 1. Mark WO as completed
        updateDocumentNonBlocking({ path: `maintenanceWorkOrders/${woId}` } as any, { 
            status: 'COMPLETED',
            completionTime: new Date().toISOString()
        });

        // 2. Restore Aircraft to AVAILABLE
        updateDocumentNonBlocking({ path: `aircrafts/${acId}` } as any, { status: 'AVAILABLE' });

        toast({
            title: "Maintenance Protocol Finalized",
            description: "Work order completed. Asset has been restored to commercial availability.",
        });
    };

    const handleStartRepair = (defectId: string, acId: string) => {
        if (!firestore) return;

        // 1. Create Work Order
        addDocumentNonBlocking({ path: 'maintenanceWorkOrders' } as any, {
            aircraftId: acId,
            taskDescription: `Repair for defect ID: ${defectId}`,
            engineerName: user?.firstName || 'MRO Lead',
            startTime: new Date().toISOString(),
            status: 'IN_PROGRESS'
        });

        // 2. Update Defect Status
        updateDocumentNonBlocking({ path: `defectReports/${defectId}` } as any, { status: 'IN_REPAIR' });

        // 3. Ground the aircraft
        updateDocumentNonBlocking({ path: `aircrafts/${acId}` } as any, { status: 'MAINTENANCE' });

        toast({
            title: "Technical Dispatch Active",
            description: "Work order initiated. Aircraft is grounded until maintenance release.",
        });
    };

    return (
        <div className="space-y-6">
            <PageHeader 
                title="Engineering & MRO Control" 
                description="Technical log synchronization, maintenance scheduling, and asset airworthiness command."
            >
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="h-9 gap-2 border-white/10 font-bold uppercase text-[9px] tracking-widest">
                        <Calendar className="h-3.5 w-3.5" /> Maintenance Calendar
                    </Button>
                    <Button className="h-9 bg-accent text-accent-foreground hover:bg-accent/90 font-bold uppercase text-[9px] tracking-widest">
                        <PlusCircle className="h-3.5 w-3.5" /> Log Tech Defect
                    </Button>
                </div>
            </PageHeader>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="bg-card border-l-4 border-l-rose-500 shadow-xl">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-[10px] uppercase text-muted-foreground font-black tracking-widest">Grounded Assets (MRO)</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-black text-white">{opFleet.filter(a => a.status === 'MAINTENANCE').length}</div>
                        <p className="text-[10px] text-rose-500 uppercase font-bold mt-1 tracking-tighter">Technical Downtime</p>
                    </CardContent>
                </Card>
                <Card className="bg-card border-l-4 border-l-amber-500 shadow-xl">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-[10px] uppercase text-muted-foreground font-black tracking-widest">Open Tech Log Items</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-black text-white">{openDefects.length}</div>
                        <p className="text-[10px] text-amber-500 uppercase font-bold mt-1 tracking-tighter">Pending Engineering Release</p>
                    </CardContent>
                </Card>
                <Card className="bg-card border-l-4 border-l-emerald-500 shadow-xl">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-[10px] uppercase text-muted-foreground font-black tracking-widest">Active Work Orders</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-black text-white">{activeWork.length}</div>
                        <p className="text-[10px] text-emerald-500 uppercase font-bold mt-1 tracking-tighter">In-Progress Repairs</p>
                    </CardContent>
                </Card>
            </div>

            <Tabs defaultValue="tech-log" className="w-full">
                <TabsList className="bg-muted/20 border border-white/5 mb-6 p-1 h-auto flex flex-wrap">
                    <TabsTrigger value="tech-log" className="gap-2 flex-1 min-w-[120px]">
                        <ClipboardList className="h-3.5 w-3.5" /> Technical Log (Defects)
                    </TabsTrigger>
                    <TabsTrigger value="work-orders" className="gap-2 flex-1 min-w-[120px]">
                        <Activity className="h-3.5 w-3.5" /> Maintenance Work Orders
                    </TabsTrigger>
                    <TabsTrigger value="schedule" className="gap-2 flex-1 min-w-[120px]">
                        <Calendar className="h-3.5 w-3.5" /> Service Schedule
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="tech-log" className="animate-in fade-in slide-in-from-top-2">
                    <Card className="bg-card border-white/5 overflow-hidden">
                        <CardHeader className="border-b border-white/5 pb-4">
                            <CardTitle>Fleet Tech Log Registry</CardTitle>
                            <CardDescription>Immutable log of reported aircraft defects and operational discrepancies.</CardDescription>
                        </CardHeader>
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader>
                                    <TableRow className="border-white/5 hover:bg-transparent">
                                        <TableHead className="text-[10px] uppercase font-black">Asset</TableHead>
                                        <TableHead className="text-[10px] uppercase font-black">Reported Issue</TableHead>
                                        <TableHead className="text-[10px] uppercase font-black text-center">Priority</TableHead>
                                        <TableHead className="text-[10px] uppercase font-black">Status</TableHead>
                                        <TableHead className="text-right pr-6"><span className="sr-only">Actions</span></TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {techLog?.map((defect) => (
                                        <TableRow key={defect.id} className="border-white/5 hover:bg-white/[0.02] group">
                                            <TableCell className="py-4">
                                                <p className="text-xs font-bold text-accent uppercase font-code">{defect.aircraftId}</p>
                                                <p className="text-[9px] text-muted-foreground uppercase font-black">{new Date(defect.reportedAt).toLocaleDateString()}</p>
                                            </TableCell>
                                            <TableCell>
                                                <p className="text-xs text-white max-w-md">{defect.issueDescription}</p>
                                                <p className="text-[9px] text-muted-foreground font-medium uppercase mt-1">Logged By: {defect.reportedBy}</p>
                                            </TableCell>
                                            <TableCell className="text-center">
                                                <Badge className={cn(
                                                    "text-[8px] font-black uppercase h-4 px-1.5",
                                                    defect.priority === 'CRITICAL' ? 'bg-rose-500' : 
                                                    defect.priority === 'HIGH' ? 'bg-amber-500' : 'bg-blue-500'
                                                )}>
                                                    {defect.priority}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <div className={cn("w-1.5 h-1.5 rounded-full", defect.status === 'OPEN' ? 'bg-rose-500 animate-pulse' : 'bg-emerald-500')} />
                                                    <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{defect.status}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-right pr-6">
                                                {defect.status === 'OPEN' && (
                                                    <Button onClick={() => handleStartRepair(defect.id, defect.aircraftId)} variant="ghost" size="sm" className="h-8 text-[9px] font-black uppercase tracking-widest text-accent hover:bg-accent/10">
                                                        Dispatch MRO <ArrowRight className="h-3 w-3 ml-1.5" />
                                                    </Button>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="work-orders" className="animate-in fade-in slide-in-from-top-2">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {orders?.map((order) => (
                            <Card key={order.id} className="bg-card border-white/5 overflow-hidden">
                                <CardHeader className="bg-black/20 pb-4">
                                    <div className="flex items-center justify-between">
                                        <Badge variant="outline" className="text-[10px] font-code uppercase text-accent border-accent/20">WO-{order.id.slice(-4).toUpperCase()}</Badge>
                                        <Badge className={cn(
                                            "text-[9px] font-black uppercase",
                                            order.status === 'IN_PROGRESS' ? 'bg-emerald-500 animate-pulse' : 'bg-muted text-muted-foreground'
                                        )}>
                                            {order.status.replace('_', ' ')}
                                        </Badge>
                                    </div>
                                    <CardTitle className="text-sm font-bold mt-2">Asset: {order.aircraftId}</CardTitle>
                                </CardHeader>
                                <CardContent className="pt-6 space-y-4">
                                    <div className="space-y-1">
                                        <p className="text-[9px] font-black uppercase text-muted-foreground tracking-widest">Scope of Work</p>
                                        <p className="text-xs text-white leading-relaxed">{order.taskDescription}</p>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4 border-t border-white/5 pt-4">
                                        <div className="space-y-1">
                                            <p className="text-[9px] font-black uppercase text-muted-foreground">Assigned Lead</p>
                                            <div className="flex items-center gap-2">
                                                <User className="h-3 w-3 text-accent" />
                                                <span className="text-xs font-bold">{order.engineerName}</span>
                                            </div>
                                        </div>
                                        <div className="space-y-1 text-right">
                                            <p className="text-[9px] font-black uppercase text-muted-foreground">Started On</p>
                                            <p className="text-xs text-white font-code">{new Date(order.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                        </div>
                                    </div>
                                    {order.status === 'IN_PROGRESS' && (
                                        <Button onClick={() => handleCompleteWorkOrder(order.id, order.aircraftId)} className="w-full bg-emerald-600 text-white hover:bg-emerald-700 h-9 text-[10px] font-black uppercase tracking-widest mt-2">
                                            Maintenance Release (RTS)
                                        </Button>
                                    )}
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </TabsContent>

                <TabsContent value="schedule" className="animate-in fade-in slide-in-from-top-2">
                    <Card className="bg-card border-white/5">
                        <CardHeader>
                            <CardTitle>Planned Technical Stops</CardTitle>
                            <CardDescription>Forward maintenance calendar for the next 90 days.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow className="border-white/5 hover:bg-transparent">
                                        <TableHead className="text-[10px] uppercase font-black">Scheduled Date</TableHead>
                                        <TableHead className="text-[10px] uppercase font-black">Service Type</TableHead>
                                        <TableHead className="text-[10px] uppercase font-black">Asset</TableHead>
                                        <TableHead className="text-[10px] uppercase font-black">Facility Node</TableHead>
                                        <TableHead className="text-right text-[10px] uppercase font-black pr-6">Status</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {sched?.map((item) => (
                                        <TableRow key={item.id} className="border-white/5">
                                            <TableCell className="py-4">
                                                <div className="flex items-center gap-2">
                                                    <Calendar className="h-3 w-3 text-accent" />
                                                    <span className="text-xs font-bold text-white">{new Date(item.scheduledDate).toLocaleDateString()}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-xs font-bold uppercase">{item.maintenanceType}</TableCell>
                                            <TableCell className="font-code text-xs text-accent">{item.aircraftId}</TableCell>
                                            <TableCell className="text-xs text-muted-foreground uppercase font-black">{item.maintenanceFacility}</TableCell>
                                            <TableCell className="text-right pr-6">
                                                <Badge variant="outline" className="text-[9px] font-black uppercase tracking-tighter border-white/10">{item.status}</Badge>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
