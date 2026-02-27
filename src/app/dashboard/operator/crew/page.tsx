'use client';

import { PageHeader } from "@/components/dashboard/shared/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useUser } from "@/hooks/use-user";
import { useCollection, useFirestore, useMemoFirebase, updateDocumentNonBlocking } from "@/firebase";
import { collection, query, where, doc } from "firebase/firestore";
import { Skeleton } from "@/components/ui/skeleton";
import type { CrewMember, CrewStatus, Aircraft } from "@/lib/types";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { MoreHorizontal, PlusCircle, User, Plane, CheckCircle2, AlertCircle, Clock, ShieldCheck, Sparkles, Star } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { AddCrewDialog } from "@/components/dashboard/operator/add-crew-dialog";
import { useState } from "react";
import { cn } from "@/lib/utils";

const getStatusVariant = (status: CrewStatus) => {
    switch (status) {
        case 'Available': return 'success';
        case 'On Duty': return 'default';
        case 'Training': return 'secondary';
        case 'Medical Leave': return 'destructive';
        default: return 'outline';
    }
};

const getRoleIcon = (role: string) => {
    if (role === 'Captain' || role === 'First Officer') return <ShieldCheck className="h-3.5 w-3.5 text-accent" />;
    if (role === 'Cabin Crew') return <Sparkles className="h-3.5 w-3.5 text-primary" />;
    return <User className="h-3.5 w-3.5 text-muted-foreground" />;
}

export default function CrewManagementPage() {
    const { user, isLoading: isUserLoading } = useUser();
    const firestore = useFirestore();
    const { toast } = useToast();
    const [isAddOpen, setIsAddOpen] = useState(false);

    const crewQuery = useMemoFirebase(() => {
        if (!firestore || !user) return null;
        return query(collection(firestore, 'crew'), where('operatorId', '==', user.id));
    }, [firestore, user]);

    const { data: crew, isLoading: crewLoading } = useCollection<CrewMember>(crewQuery, 'crew');

    const handleUpdateStatus = (memberId: string, status: CrewStatus) => {
        if (!firestore) return;
        const memberRef = doc(firestore, 'crew', memberId);
        updateDocumentNonBlocking(memberRef, { status });
        
        toast({
            title: "Logistics State Synchronized",
            description: `Crew member status updated to ${status}.`,
        });
    };

    const isLoading = isUserLoading || crewLoading;

    return (
        <>
            <PageHeader title="Crew & Logistics Control" description="Manage flight deck and cabin personnel, track duty cycles, and maintain readiness.">
                 <Button onClick={() => setIsAddOpen(true)} className="bg-accent text-accent-foreground hover:bg-accent/90 font-bold">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Personnel
                </Button>
            </PageHeader>
            
            <div className="grid gap-6">
                <Card className="bg-card">
                    <CardHeader>
                        <CardTitle>Flight Personnel Registry</CardTitle>
                        <CardDescription>
                            A comprehensive log of all crew members and their operational readiness.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="px-0 sm:px-6">
                        <div className="w-full overflow-x-auto">
                            {isLoading ? <div className="p-6"><Skeleton className="h-64 w-full" /></div> : (
                                <Table className="min-w-[800px] sm:min-w-full">
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Member</TableHead>
                                            <TableHead>Role & Designation</TableHead>
                                            <TableHead>Asset Assignment</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead className="text-right">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {crew?.map((member) => (
                                            <TableRow key={member.id} className="group">
                                                <TableCell>
                                                    <div className="flex items-center gap-3">
                                                        <div className="p-2 bg-muted/20 rounded-full shrink-0">
                                                            <User className="h-4 w-4 text-accent" />
                                                        </div>
                                                        <div>
                                                            <div className="font-bold text-sm whitespace-nowrap">{member.firstName} {member.lastName}</div>
                                                            <div className="text-[10px] text-muted-foreground uppercase font-code tracking-tighter">ID: {member.id}</div>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="space-y-1">
                                                        <div className="flex items-center gap-1.5">
                                                            {getRoleIcon(member.role)}
                                                            <span className={cn(
                                                                "text-[10px] font-black uppercase tracking-widest whitespace-nowrap",
                                                                member.role === 'Captain' ? 'text-accent' : 'text-foreground'
                                                            )}>
                                                                {member.role}
                                                            </span>
                                                        </div>
                                                        <p className="text-[10px] text-muted-foreground font-code">Cert: {member.licenseNumber || 'PENDING'}</p>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-2">
                                                        <Plane className="h-3.5 w-3.5 text-accent/60" />
                                                        <span className="text-xs font-medium font-code">{member.assignedAircraftRegistration || 'FLOAT'}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant={getStatusVariant(member.status)} className="h-5 text-[10px] font-bold uppercase tracking-wider">
                                                        {member.status}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button size="icon" variant="ghost" className="h-8 w-8">
                                                                <MoreHorizontal className="h-4 w-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end">
                                                            <DropdownMenuLabel>Logistics Controls</DropdownMenuLabel>
                                                            <DropdownMenuItem className="gap-2" onClick={() => handleUpdateStatus(member.id, 'Available')}>
                                                                <CheckCircle2 className="h-3.5 w-3.5 text-green-500" /> Mark Available
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem className="gap-2" onClick={() => handleUpdateStatus(member.id, 'On Duty')}>
                                                                <Clock className="h-3.5 w-3.5 text-blue-500" /> Dispatch to Duty
                                                            </DropdownMenuItem>
                                                            <DropdownMenuSeparator />
                                                            <DropdownMenuItem className="gap-2">
                                                                <ShieldCheck className="h-3.5 w-3.5 text-accent" /> Compliance Audit
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem className="gap-2 text-destructive">
                                                                <AlertCircle className="h-3.5 w-3.5" /> Revoke Designation
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            )}
                        </div>
                        {(!isLoading && (!crew || crew.length === 0)) && (
                            <div className="text-center py-20 border-2 border-dashed rounded-lg bg-muted/5">
                                <User className="mx-auto h-10 w-10 text-muted-foreground/20 mb-4" />
                                <p className="text-muted-foreground font-medium">Registry Initializing...</p>
                                <Button variant="link" onClick={() => setIsAddOpen(true)} className="text-accent text-xs">Register First Personnel</Button>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            <AddCrewDialog 
                open={isAddOpen} 
                onOpenChange={setIsAddOpen} 
            />
        </>
    );
}
