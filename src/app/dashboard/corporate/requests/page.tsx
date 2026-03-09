'use client';

import React, { useState, useMemo } from 'react';
import { PageHeader } from "@/components/dashboard/shared/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useCollection, useUser, useFirestore, addDocumentNonBlocking, useMemoFirebase } from "@/firebase";
import { collection, query, where } from "firebase/firestore";
import { Skeleton } from "@/components/ui/skeleton";
import type { EmployeeTravelRequest, CostCenter } from "@/lib/types";
import { 
    Plane, 
    Armchair, 
    Clock, 
    Search,
    Filter,
    PlusCircle,
    User,
    CheckCircle2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { cn } from "@/lib/utils";

export default function CorporateRequestsPage() {
    const { user } = useUser();
    const { toast } = useToast();
    const firestore = useFirestore();
    const [search, setSearch] = useState("");
    const [isAddOpen, setIsAddOpen] = useState(false);

    const { data: requests, isLoading } = useCollection<EmployeeTravelRequest>(
        useMemoFirebase(() => {
            if (!firestore || (firestore as any)._isMock || !user?.corporateId) return null;
            return query(collection(firestore, 'employeeTravelRequests'), where('corporateId', '==', user.corporateId));
        }, [firestore, user?.corporateId]),
        'employeeTravelRequests'
    );

    const { data: centers } = useCollection<CostCenter>(null, 'costCenters');

    const filteredRequests = useMemo(() => {
        return requests?.filter(r => 
            r.employeeName.toLowerCase().includes(search.toLowerCase()) ||
            r.requestId.toLowerCase().includes(search.toLowerCase()) ||
            r.origin.toLowerCase().includes(search.toLowerCase()) ||
            r.destination.toLowerCase().includes(search.toLowerCase())
        ) || [];
    }, [requests, search]);

    const handleCreateRequest = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!user || !firestore) return;

        const formData = new FormData(e.currentTarget);
        const newReq = {
            requestId: `ETR-${Date.now().toString().slice(-6)}`,
            employeeId: user.id,
            employeeName: `${user.firstName} ${user.lastName}`,
            corporateId: user.corporateId,
            travelType: formData.get('travelType'),
            origin: formData.get('origin'),
            destination: formData.get('destination'),
            travelDate: formData.get('travelDate'),
            passengerCount: Number(formData.get('pax')),
            purposeOfTravel: formData.get('purpose'),
            costCenterId: formData.get('costCenter'),
            requestStatus: 'REQUEST_CREATED',
            createdAt: new Date().toISOString(),
        };

        addDocumentNonBlocking({ path: 'employeeTravelRequests' } as any, newReq);
        toast({ title: "Inquiry Dispatched", description: "Your travel request has been submitted for internal approval." });
        setIsAddOpen(false);
    };

    return (
        <div className="space-y-6">
            <PageHeader title="Travel Demand Log" description="A complete history of institutional travel inquiries and their approval status.">
                <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                    <DialogTrigger asChild>
                        <Button className="bg-accent text-accent-foreground hover:bg-accent/90">
                            <PlusCircle className="mr-2 h-4 w-4" /> New Travel Request
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[500px]">
                        <DialogHeader>
                            <DialogTitle>Capture Travel Demand</DialogTitle>
                            <DialogDescription>Submit a new aviation coordination request for internal review.</DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleCreateRequest} className="space-y-4 py-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label className="text-[10px] uppercase font-black">Origin</Label>
                                    <Input name="origin" placeholder="VABB" required className="bg-muted/20" />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[10px] uppercase font-black">Destination</Label>
                                    <Input name="destination" placeholder="VIDP" required className="bg-muted/20" />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label className="text-[10px] uppercase font-black">Travel Date</Label>
                                    <Input name="travelDate" type="date" required className="bg-muted/20" />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[10px] uppercase font-black">Passengers</Label>
                                    <Input name="pax" type="number" defaultValue="1" min="1" className="bg-muted/20" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-[10px] uppercase font-black">Coordination Mode</Label>
                                <Select name="travelType" defaultValue="CHARTER">
                                    <SelectTrigger className="bg-muted/20">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="CHARTER">Full Aircraft Charter</SelectItem>
                                        <SelectItem value="JET_SEATS">JetSeat Exchange (Empty Leg)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-[10px] uppercase font-black">Cost Center</Label>
                                <Select name="costCenter" required>
                                    <SelectTrigger className="bg-muted/20">
                                        <SelectValue placeholder="Select Department" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {centers?.filter(c => c.corporateId === user?.corporateId).map(c => (
                                            <SelectItem key={c.id} value={c.costCenterId}>{c.departmentName}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-[10px] uppercase font-black">Mission Purpose</Label>
                                <Input name="purpose" placeholder="Strategic Client Meeting" required className="bg-muted/20" />
                            </div>
                            <DialogFooter className="pt-4">
                                <Button type="button" variant="ghost" onClick={() => setIsAddOpen(false)}>Cancel</Button>
                                <Button type="submit" className="bg-accent text-accent-foreground font-bold">Commit Request</Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </PageHeader>

            <Card className="bg-card">
                <CardContent className="p-0">
                    <div className="p-4 border-b border-white/5 flex gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input 
                                placeholder="Search by name or route..." 
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="pl-10 bg-muted/20 border-white/10 text-xs h-9"
                            />
                        </div>
                    </div>
                    {isLoading ? <Skeleton className="h-64 w-full" /> : (
                        <Table>
                            <TableHeader>
                                <TableRow className="border-white/5 hover:bg-transparent">
                                    <TableHead className="pl-6 text-[10px] uppercase font-black">Request ID</TableHead>
                                    <TableHead className="text-[10px] uppercase font-black">Requester</TableHead>
                                    <TableHead className="text-[10px] uppercase font-black">Sector</TableHead>
                                    <TableHead className="text-[10px] uppercase font-black">Type</TableHead>
                                    <TableHead className="text-right pr-6 text-[10px] uppercase font-black">Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredRequests.map((req) => (
                                    <TableRow key={req.id} className="border-white/5 hover:bg-white/[0.02]">
                                        <TableCell className="pl-6 py-4 font-code text-xs text-accent">{req.requestId}</TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <User className="h-3 w-3 text-muted-foreground" />
                                                <span className="text-xs font-bold">{req.employeeName}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-xs text-white/80">{req.origin} » {req.destination}</TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className="text-[8px] uppercase tracking-tighter border-white/10 h-4">
                                                {req.travelType === 'CHARTER' ? 'Full Charter' : 'Jet Seat'}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right pr-6">
                                            <Badge className={cn(
                                                "text-[9px] font-black uppercase h-5",
                                                req.requestStatus === 'REJECTED' ? "bg-rose-500/20 text-rose-500" : "bg-blue-500/20 text-blue-400"
                                            )}>
                                                {req.requestStatus.replace(/_/g, ' ')}
                                            </Badge>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}