'use client';

import React, { useState, useMemo } from 'react';
import { PageHeader } from "@/components/dashboard/shared/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useCollection, useUser, useFirestore, updateDocumentNonBlocking } from "@/firebase";
import { collection, query, where, doc } from "firebase/firestore";
import { Skeleton } from "@/components/ui/skeleton";
import type { EmployeeTravelRequest, CorporateOrganization } from "@/lib/types";
import { 
    Briefcase, 
    Plane, 
    Armchair, 
    CheckCircle2, 
    XCircle, 
    ArrowRight, 
    Clock, 
    Search,
    Filter,
    ShieldCheck,
    FilePlus,
    Users
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function TravelDeskProcessingPage() {
    const { user } = useUser();
    const { toast } = useToast();
    const firestore = useFirestore();
    const [search, setSearch] = useState("");

    const { data: requests, isLoading } = useCollection<EmployeeTravelRequest>(
        useMemoFirebase(() => {
            if (!user?.corporateId) return null;
            return query(collection(firestore!, 'employeeTravelRequests'), where('corporateId', '==', user.corporateId));
        }, [firestore, user?.corporateId]),
        'employeeTravelRequests'
    );

    const filteredRequests = useMemo(() => {
        return requests?.filter(r => 
            r.employeeName.toLowerCase().includes(search.toLowerCase()) ||
            r.requestId.toLowerCase().includes(search.toLowerCase()) ||
            r.origin.toLowerCase().includes(search.toLowerCase()) ||
            r.destination.toLowerCase().includes(search.toLowerCase())
        ) || [];
    }, [requests, search]);

    const handleAction = (requestId: string, currentStatus: string, nextStatus: string) => {
        if (!firestore) return;
        const ref = (firestore as any)._isMock ? { path: `employeeTravelRequests/${requestId}` } as any : doc(firestore, 'employeeTravelRequests', requestId);
        updateDocumentNonBlocking(ref, { requestStatus: nextStatus, updatedAt: new Date().toISOString() });
        
        toast({
            title: "Workflow Synchronized",
            description: `Request status transitioned from ${currentStatus} to ${nextStatus}.`,
        });
    };

    return (
        <div className="space-y-6">
            <PageHeader 
                title="Travel Desk Coordination" 
                description="Bridge internal demand with market fulfillment. Process approved requests into mission coordination protocols."
            />

            <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input 
                        placeholder="Filter by employee, route, or request ID..." 
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-10 bg-muted/20 border-white/10"
                    />
                </div>
                <Button variant="outline" className="gap-2 border-white/10 h-10 px-6 font-bold uppercase text-[10px] tracking-widest">
                    <Filter className="h-4 w-4" /> Filter Governance
                </Button>
            </div>

            <Card className="bg-card overflow-hidden border-white/5 shadow-2xl">
                <CardHeader className="bg-black/20 pb-4 border-b border-white/5">
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="text-base font-bold text-white uppercase tracking-widest">Active Coordination Queue</CardTitle>
                            <CardDescription className="text-xs font-medium text-muted-foreground mt-1">Reviewing mission viability and market synchronization.</CardDescription>
                        </div>
                        <Badge variant="outline" className="h-6 border-white/10 text-[9px] font-black">{filteredRequests.length} TOTAL INQUIRIES</Badge>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    {isLoading ? <Skeleton className="h-64 w-full" /> : (
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow className="border-white/5 hover:bg-transparent">
                                        <TableHead className="pl-6 text-[10px] uppercase font-black">Personnel & ID</TableHead>
                                        <TableHead className="text-[10px] uppercase font-black">Mission Sector</TableHead>
                                        <TableHead className="text-[10px] uppercase font-black">Travel Mode</TableHead>
                                        <TableHead className="text-[10px] uppercase font-black">Internal State</TableHead>
                                        <TableHead className="text-right pr-6"><span className="sr-only">Actions</span></TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredRequests.map((req) => (
                                        <TableRow key={req.id} className="border-white/5 hover:bg-white/[0.02] group transition-all">
                                            <TableCell className="pl-6 py-4">
                                                <div className="space-y-1">
                                                    <p className="text-sm font-bold text-white group-hover:text-accent transition-colors">{req.employeeName}</p>
                                                    <p className="text-[9px] text-muted-foreground uppercase font-code tracking-tighter">ID: {req.requestId}</p>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2 text-xs font-medium text-white">
                                                    {req.origin} » {req.destination}
                                                </div>
                                                <div className="flex items-center gap-2 text-[10px] text-muted-foreground font-bold mt-1">
                                                    <Clock className="h-3 w-3" /> {new Date(req.travelDate).toLocaleDateString()}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="outline" className="h-5 text-[8px] font-black uppercase border-white/10 text-white/60">
                                                    {req.travelType === 'CHARTER' ? <Plane className="h-2.5 w-2.5 mr-1" /> : <Armchair className="h-2.5 w-2.5 mr-1" />}
                                                    {req.travelType.replace('_', ' ')}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <Badge className={cn(
                                                    "text-[9px] font-black uppercase h-5 border-none",
                                                    req.requestStatus === 'REJECTED' ? "bg-rose-500/20 text-rose-500" :
                                                    req.requestStatus === 'FINANCE_APPROVED' ? "bg-emerald-500/20 text-emerald-500" :
                                                    "bg-amber-500/20 text-amber-500"
                                                )}>
                                                    {req.requestStatus.replace(/_/g, ' ')}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right pr-6">
                                                <div className="flex justify-end gap-2">
                                                    {req.requestStatus === 'FINANCE_APPROVED' && (
                                                        <Button 
                                                            size="sm" 
                                                            className="bg-accent text-accent-foreground hover:bg-accent/90 text-[9px] font-black uppercase h-8 px-4"
                                                            onClick={() => handleAction(req.id, req.requestStatus, 'TRAVEL_DESK_PROCESSING')}
                                                        >
                                                            Initialize Market Link <ArrowRight className="h-3 w-3 ml-1.5" />
                                                        </Button>
                                                    )}
                                                    {req.requestStatus === 'TRAVEL_DESK_PROCESSING' && (
                                                        <Button 
                                                            size="sm" 
                                                            variant="outline"
                                                            className="border-white/10 text-[9px] font-black uppercase h-8 px-4"
                                                            onClick={() => handleAction(req.id, req.requestStatus, req.travelType === 'CHARTER' ? 'RFQ_SUBMITTED' : 'SEAT_REQUEST_SUBMITTED')}
                                                        >
                                                            Synchronize RFQ Protocol
                                                        </Button>
                                                    )}
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                    {filteredRequests.length === 0 && (
                        <div className="text-center py-24 opacity-30">
                            <ShieldCheck className="h-12 w-12 mx-auto text-muted-foreground/20 mb-4" />
                            <p className="text-xs text-muted-foreground uppercase font-black tracking-[0.2em]">Queue Synchronized</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
