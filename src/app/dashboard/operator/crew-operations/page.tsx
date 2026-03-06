'use client';

import { PageHeader } from "@/components/dashboard/shared/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useCollection, useFirestore, useMemoFirebase } from "@/firebase";
import { useUser } from "@/hooks/use-user";
import type { CrewMember, CrewAssignment, CrewLogistics } from "@/lib/types";
import { collection, query, where } from "firebase/firestore";
import { Skeleton } from "@/components/ui/skeleton";
import { Users, Calendar, Clock, MapPin, Plane, ShieldCheck, PlusCircle, Activity, Hotel, Car, MoreHorizontal } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { useState } from "react";
import { cn } from "@/lib/utils";

export default function CrewOperationsPage() {
    const { user } = useUser();
    const firestore = useFirestore();
    const [activeTab, setActiveTab] = useState('roster');

    const opId = user?.operatorId || 'NONE';

    const crewQuery = useMemoFirebase(() => {
        if (!firestore || (firestore as any)._isMock || opId === 'NONE') return null;
        return query(collection(firestore, 'crewMembers'), where('operatorId', '==', opId));
    }, [firestore, opId]);

    const { data: crew, isLoading: crewLoading } = useCollection<CrewMember>(crewQuery, 'crewMembers');

    const assignmentsQuery = useMemoFirebase(() => {
        if (!firestore || (firestore as any)._isMock) return null;
        return collection(firestore, 'crewAssignments');
    }, [firestore]);
    const { data: assignments } = useCollection<CrewAssignment>(assignmentsQuery, 'crewAssignments');

    const logisticsQuery = useMemoFirebase(() => {
        if (!firestore || (firestore as any)._isMock) return null;
        return collection(firestore, 'crewLogistics');
    }, [firestore]);
    const { data: logistics } = useCollection<CrewLogistics>(logisticsQuery, 'crewLogistics');

    return (
        <div className="space-y-6">
            <PageHeader 
                title="Crew & Logistics Command" 
                description="Manage flight deck personnel, mission assignments, and repositioning logistics."
            >
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="h-9 gap-2 border-white/10 font-bold uppercase text-[9px] tracking-widest">
                        <Calendar className="h-3.5 w-3.5" /> View Duty Roster
                    </Button>
                    <Button className="h-9 bg-accent text-accent-foreground hover:bg-accent/90 font-bold uppercase text-[9px] tracking-widest">
                        <PlusCircle className="h-3.5 w-3.5" /> Register Crew
                    </Button>
                </div>
            </PageHeader>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="bg-card border-l-4 border-l-emerald-500">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-[10px] uppercase text-muted-foreground font-black tracking-widest">Ready for Duty</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-black text-white">{crew?.filter(c => c.status === 'ACTIVE').length || 0}</div>
                        <p className="text-[10px] text-emerald-500 uppercase font-bold mt-1 tracking-tighter">Available Nodes</p>
                    </CardContent>
                </Card>
                <Card className="bg-card border-l-4 border-l-sky-500">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-[10px] uppercase text-muted-foreground font-black tracking-widest">In Mission</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-black text-white">{crew?.filter(c => c.status === 'ON_DUTY').length || 0}</div>
                        <p className="text-[10px] text-sky-500 uppercase font-bold mt-1 tracking-tighter">Active Flight Deck</p>
                    </CardContent>
                </Card>
                <Card className="bg-card border-l-4 border-l-amber-500">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-[10px] uppercase text-muted-foreground font-black tracking-widest">Logistics Alerts</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-black text-white">{logistics?.filter(l => l.hotelBookingStatus === 'PENDING').length || 0}</div>
                        <p className="text-[10px] text-amber-500 uppercase font-bold mt-1 tracking-tighter">Pending Coordination</p>
                    </CardContent>
                </Card>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="bg-muted/20 border border-white/5 mb-6 p-1 h-auto flex flex-wrap">
                    <TabsTrigger value="roster" className="gap-2 flex-1 min-w-[120px]">
                        <Users className="h-3.5 w-3.5" /> Fleet Personnel
                    </TabsTrigger>
                    <TabsTrigger value="assignments" className="gap-2 flex-1 min-w-[120px]">
                        <Plane className="h-3.5 w-3.5" /> Mission Assignments
                    </TabsTrigger>
                    <TabsTrigger value="logistics" className="gap-2 flex-1 min-w-[120px]">
                        <Activity className="h-3.5 w-3.5" /> Duty Logistics
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="roster" className="space-y-6">
                    <Card className="bg-card">
                        <CardHeader>
                            <CardTitle>Crew Roster</CardTitle>
                            <CardDescription>Verified flight deck and cabin personnel details.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {crewLoading ? <Skeleton className="h-64 w-full" /> : (
                                <Table>
                                    <TableHeader>
                                        <TableRow className="border-white/5">
                                            <TableHead className="text-[10px] uppercase font-black">Personnel</TableHead>
                                            <TableHead className="text-[10px] uppercase font-black">Designation</TableHead>
                                            <TableHead className="text-[10px] uppercase font-black">License / Cert</TableHead>
                                            <TableHead className="text-[10px] uppercase font-black">Status</TableHead>
                                            <TableHead className="text-right pr-6"><span className="sr-only">Actions</span></TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {crew?.map((member) => (
                                            <TableRow key={member.id} className="border-white/5 hover:bg-white/[0.02]">
                                                <TableCell className="py-4">
                                                    <div className="space-y-0.5">
                                                        <p className="text-sm font-bold text-white">{member.name}</p>
                                                        <p className="text-[10px] text-muted-foreground uppercase">{member.email}</p>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant="outline" className="text-[9px] uppercase tracking-widest font-black border-white/10">{member.designation}</Badge>
                                                </TableCell>
                                                <TableCell className="font-code text-xs text-accent">{member.licenseNumber}</TableCell>
                                                <TableCell>
                                                    <Badge className={cn(
                                                        "text-[9px] font-black uppercase h-5",
                                                        member.status === 'ACTIVE' ? "bg-emerald-500/20 text-emerald-500" : 
                                                        member.status === 'ON_DUTY' ? "bg-sky-500/20 text-sky-500" : "bg-muted text-muted-foreground"
                                                    )}>
                                                        {member.status.replace('_', ' ')}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-right pr-6">
                                                    <Button variant="ghost" size="icon" className="h-8 w-8"><MoreHorizontal className="h-4 w-4" /></Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="assignments" className="space-y-6">
                    <Card className="bg-card">
                        <CardHeader>
                            <CardTitle>Active Mission Assignments</CardTitle>
                            <CardDescription>Personnel linked to confirmed charter missions.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow className="border-white/5">
                                        <TableHead className="text-[10px] uppercase font-black">Mission ID</TableHead>
                                        <TableHead className="text-[10px] uppercase font-black">Asset</TableHead>
                                        <TableHead className="text-[10px] uppercase font-black">Assigned Crew</TableHead>
                                        <TableHead className="text-[10px] uppercase font-black">State</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {assignments?.map((asgn) => (
                                        <TableRow key={asgn.id} className="border-white/5">
                                            <TableCell className="py-4 font-code text-accent font-bold">{asgn.charterRequestId}</TableCell>
                                            <TableCell className="text-[10px] uppercase font-black text-muted-foreground">{asgn.aircraftId}</TableCell>
                                            <TableCell>
                                                <div className="flex -space-x-2">
                                                    {asgn.crewMembers.map((id, idx) => (
                                                        <div key={idx} className="w-7 h-7 rounded-full bg-muted border-2 border-slate-900 flex items-center justify-center">
                                                            <span className="text-[8px] font-black uppercase">{id.slice(-2)}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="outline" className="text-[9px] font-black uppercase">{asgn.status}</Badge>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="logistics" className="space-y-6">
                    <div className="grid gap-6 md:grid-cols-2">
                        {logistics?.map((log) => (
                            <Card key={log.id} className="bg-card border-white/5 overflow-hidden">
                                <CardHeader className="bg-black/20 pb-4">
                                    <div className="flex items-center justify-between">
                                        <p className="text-[10px] font-black text-accent uppercase tracking-widest">LOG: {log.logisticsId}</p>
                                        <Badge variant="secondary" className="h-5 text-[8px] font-black uppercase">{log.tripId}</Badge>
                                    </div>
                                    <CardTitle className="text-sm font-bold mt-2">Personnel: {log.crewId}</CardTitle>
                                </CardHeader>
                                <CardContent className="pt-6 space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <Hotel className="h-4 w-4 text-muted-foreground" />
                                            <span className="text-xs font-medium">Hotel Coordination</span>
                                        </div>
                                        <Badge className={cn(
                                            "text-[8px] font-black uppercase h-4 px-1.5",
                                            log.hotelBookingStatus === 'CONFIRMED' ? "bg-green-500/20 text-green-500" : "bg-amber-500/20 text-amber-500"
                                        )}>
                                            {log.hotelBookingStatus}
                                        </Badge>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <Car className="h-4 w-4 text-muted-foreground" />
                                            <span className="text-xs font-medium">Ground Transport</span>
                                        </div>
                                        <Badge className={cn(
                                            "text-[8px] font-black uppercase h-4 px-1.5",
                                            log.transportStatus === 'ARRANGED' ? "bg-green-500/20 text-green-500" : "bg-amber-500/20 text-amber-500"
                                        )}>
                                            {log.transportStatus}
                                        </Badge>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}
