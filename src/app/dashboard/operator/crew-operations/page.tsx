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
import { 
    Users, 
    Calendar, 
    Clock, 
    MapPin, 
    Plane, 
    ShieldCheck, 
    PlusCircle, 
    Activity, 
    Hotel, 
    Car, 
    MoreHorizontal,
    ArrowRight,
    Search
} from "lucide-react";
import { 
    DropdownMenu, 
    DropdownMenuContent, 
    DropdownMenuItem, 
    DropdownMenuLabel, 
    DropdownMenuTrigger, 
    DropdownMenuSeparator 
} from "@/components/ui/dropdown-menu";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";

export default function CrewOperationsPage() {
    const { user } = useUser();
    const firestore = useFirestore();
    const [activeTab, setActiveTab] = useState('roster');
    const [rosterOpen, setRosterOpen] = useState(false);

    const opId = user?.operatorId || 'op-west-01';

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
                    <Sheet open={rosterOpen} onOpenChange={setRosterOpen}>
                        <SheetTrigger asChild>
                            <Button variant="outline" size="sm" className="h-9 gap-2 border-white/10 font-bold uppercase text-[9px] tracking-widest">
                                <Calendar className="h-3.5 w-3.5" /> View Duty Roster
                            </Button>
                        </SheetTrigger>
                        <SheetContent className="sm:max-w-[600px] bg-slate-950 border-white/5 text-white overflow-y-auto">
                            <SheetHeader className="pb-6 border-b border-white/5">
                                <SheetTitle className="text-xl font-bold flex items-center gap-2">
                                    <Clock className="h-5 w-5 text-accent" />
                                    Institutional Duty Roster
                                </SheetTitle>
                                <SheetDescription className="text-muted-foreground uppercase text-[10px] font-black tracking-widest">
                                    7-Day Rolling Dispatch Schedule
                                </SheetDescription>
                            </SheetHeader>
                            
                            <div className="py-6 space-y-6">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input placeholder="Filter personnel by name or designation..." className="pl-10 bg-white/5 border-white/10 text-xs" />
                                </div>

                                <div className="space-y-4">
                                    {crew?.map((member) => (
                                        <div key={member.id} className="p-4 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-all group">
                                            <div className="flex items-center justify-between mb-3">
                                                <div className="flex items-center gap-3">
                                                    <div className="p-2 bg-accent/10 rounded-lg">
                                                        <Users className="h-4 w-4 text-accent" />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-bold">{member.name}</p>
                                                        <p className="text-[10px] text-muted-foreground uppercase font-black tracking-tighter">{member.designation}</p>
                                                    </div>
                                                </div>
                                                <Badge className={cn(
                                                    "text-[8px] h-5 font-black uppercase tracking-widest",
                                                    member.status === 'ACTIVE' ? "bg-emerald-500/20 text-emerald-500 border-none" : "bg-sky-500/20 text-sky-500 border-none"
                                                )}>
                                                    {member.status.replace('_', ' ')}
                                                </Badge>
                                            </div>
                                            <div className="grid grid-cols-2 gap-4 pt-3 border-t border-white/5">
                                                <div className="space-y-1">
                                                    <p className="text-[8px] uppercase font-black text-muted-foreground">Current Assignment</p>
                                                    <p className="text-[10px] font-bold text-white">{member.status === 'ON_DUTY' ? 'RFQ-LIVE-003' : 'STANDING BY'}</p>
                                                </div>
                                                <div className="space-y-1 text-right">
                                                    <p className="text-[8px] uppercase font-black text-muted-foreground">Next Dispatch</p>
                                                    <p className="text-[10px] font-bold text-accent">Aug 15, 09:00 IST</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </SheetContent>
                    </Sheet>
                    
                    <Button className="h-9 bg-accent text-accent-foreground hover:bg-accent/90 font-bold uppercase text-[9px] tracking-widest">
                        <PlusCircle className="h-3.5 w-3.5" /> Register Crew
                    </Button>
                </div>
            </PageHeader>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="bg-card border-l-4 border-l-emerald-500 shadow-xl">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-[10px] uppercase text-muted-foreground font-black tracking-widest">Ready for Duty</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-black text-white">{crew?.filter(c => c.status === 'ACTIVE').length || 0}</div>
                        <p className="text-[10px] text-emerald-500 uppercase font-bold mt-1 tracking-tighter">Available Nodes</p>
                    </CardContent>
                </Card>
                <Card className="bg-card border-l-4 border-l-sky-500 shadow-xl">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-[10px] uppercase text-muted-foreground font-black tracking-widest">In Mission</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-black text-white">{crew?.filter(c => c.status === 'ON_DUTY').length || 0}</div>
                        <p className="text-[10px] text-sky-500 uppercase font-bold mt-1 tracking-tighter">Active Flight Deck</p>
                    </CardContent>
                </Card>
                <Card className="bg-card border-l-4 border-l-amber-500 shadow-xl">
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
                    <Card className="bg-card border-white/5 shadow-2xl">
                        <CardHeader>
                            <CardTitle>Fleet Personnel Registry</CardTitle>
                            <CardDescription>Verified flight deck and cabin personnel details.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {crewLoading ? <Skeleton className="h-64 w-full" /> : (
                                <Table>
                                    <TableHeader>
                                        <TableRow className="border-white/5 hover:bg-transparent">
                                            <TableHead className="text-[10px] uppercase font-black">Personnel</TableHead>
                                            <TableHead className="text-[10px] uppercase font-black">Designation</TableHead>
                                            <TableHead className="text-[10px] uppercase font-black">License / Cert</TableHead>
                                            <TableHead className="text-[10px] uppercase font-black">Status</TableHead>
                                            <TableHead className="text-right pr-6"><span className="sr-only">Actions</span></TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {crew?.map((member) => (
                                            <TableRow key={member.id} className="border-white/5 hover:bg-white/[0.02] group">
                                                <TableCell className="py-4">
                                                    <div className="space-y-0.5">
                                                        <p className="text-sm font-bold text-white">{member.name}</p>
                                                        <p className="text-[10px] text-muted-foreground uppercase font-code tracking-tighter">{member.email}</p>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant="outline" className="text-[9px] uppercase tracking-widest font-black border-white/10 bg-white/5">
                                                        {member.designation}
                                                    </Badge>
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
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-white/10">
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
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
                    <Card className="bg-card border-white/5 shadow-2xl">
                        <CardHeader>
                            <CardTitle>Active Mission Assignments</CardTitle>
                            <CardDescription>Personnel linked to confirmed charter missions.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow className="border-white/5 hover:bg-transparent">
                                        <TableHead className="text-[10px] uppercase font-black">Mission ID</TableHead>
                                        <TableHead className="text-[10px] uppercase font-black">Asset</TableHead>
                                        <TableHead className="text-[10px] uppercase font-black">Assigned Crew</TableHead>
                                        <TableHead className="text-[10px] uppercase font-black text-right pr-6">State</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {assignments?.map((asgn) => (
                                        <TableRow key={asgn.id} className="border-white/5 hover:bg-white/[0.02]">
                                            <TableCell className="py-4 font-code text-accent font-bold uppercase tracking-widest">{asgn.charterRequestId}</TableCell>
                                            <TableCell className="text-[10px] uppercase font-black text-muted-foreground">{asgn.aircraftId}</TableCell>
                                            <TableCell>
                                                <div className="flex -space-x-2">
                                                    {asgn.crewMembers.map((id, idx) => (
                                                        <div key={idx} className="w-7 h-7 rounded-full bg-slate-800 border-2 border-slate-950 flex items-center justify-center">
                                                            <span className="text-[8px] font-black uppercase text-white">{id.slice(-2)}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-right pr-6">
                                                <Badge variant="outline" className="text-[9px] font-black uppercase border-white/10">{asgn.status}</Badge>
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
                            <Card key={log.id} className="bg-card border-white/5 overflow-hidden shadow-2xl">
                                <CardHeader className="bg-black/20 pb-4">
                                    <div className="flex items-center justify-between">
                                        <p className="text-[10px] font-black text-accent uppercase tracking-widest">LOG: {log.logisticsId}</p>
                                        <Badge variant="secondary" className="h-5 text-[8px] font-black uppercase bg-white/5 border-white/10 text-white">{log.tripId}</Badge>
                                    </div>
                                    <CardTitle className="text-sm font-bold mt-2">Personnel: {log.crewId}</CardTitle>
                                </CardHeader>
                                <CardContent className="pt-6 space-y-4">
                                    <div className="flex items-center justify-between p-3 rounded-lg bg-white/[0.02] border border-white/5">
                                        <div className="flex items-center gap-3">
                                            <div className="p-1.5 bg-blue-500/10 rounded-md">
                                                <Hotel className="h-4 w-4 text-blue-400" />
                                            </div>
                                            <span className="text-xs font-medium text-white">Hotel Coordination</span>
                                        </div>
                                        <Badge className={cn(
                                            "text-[8px] font-black uppercase h-4 px-1.5 border-none",
                                            log.hotelBookingStatus === 'CONFIRMED' ? "bg-green-500/20 text-green-500" : "bg-amber-500/20 text-amber-500"
                                        )}>
                                            {log.hotelBookingStatus}
                                        </Badge>
                                    </div>
                                    <div className="flex items-center justify-between p-3 rounded-lg bg-white/[0.02] border border-white/5">
                                        <div className="flex items-center gap-3">
                                            <div className="p-1.5 bg-accent/10 rounded-md">
                                                <Car className="h-4 w-4 text-accent" />
                                            </div>
                                            <span className="text-xs font-medium text-white">Ground Transport</span>
                                        </div>
                                        <Badge className={cn(
                                            "text-[8px] font-black uppercase h-4 px-1.5 border-none",
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
