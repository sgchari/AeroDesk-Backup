'use client';

import { PageHeader } from "@/components/dashboard/shared/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useCollection, useFirestore, updateDocumentNonBlocking } from "@/firebase";
import type { TravelAgency } from "@/lib/types";
import { MoreHorizontal, PlusCircle, ShieldCheck, Briefcase, Ban, CheckCircle2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";

const getStatusVariant = (status: string) => {
    switch (status) {
        case 'ACTIVE': return 'success';
        case 'PENDING_SETUP': return 'warning';
        case 'SUSPENDED': return 'destructive';
        case 'BLOCKED': return 'destructive';
        default: return 'outline';
    }
}

export default function AgencyManagementPage() {
    const firestore = useFirestore();
    const { toast } = useToast();
    const { data: agencies, isLoading } = useCollection<TravelAgency>(null, 'travelAgencies');

    const handleUpdateStatus = (agencyId: string, status: string, companyName: string) => {
        const mockDocRef = { path: `travelAgencies/${agencyId}` } as any;
        updateDocumentNonBlocking(mockDocRef, { status });
        
        toast({
            title: "Registry State Updated",
            description: `${companyName} status set to ${status.replace('_', ' ')}.`,
        });
    };

    return (
        <div className="space-y-6">
            <PageHeader title="Agency Governance" description="Manage authorized travel agencies and network distribution nodes.">
                <Button className="bg-accent text-accent-foreground hover:bg-accent/90">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Onboard New Agency
                </Button>
            </PageHeader>

            <Card className="bg-card">
                <CardHeader>
                    <CardTitle>Authorized Distributors</CardTitle>
                    <CardDescription>Verified agencies authorized to request empty leg seats and coordinate charters.</CardDescription>
                </CardHeader>
                <CardContent>
                    {isLoading ? <Skeleton className="h-64 w-full" /> : (
                        <Table>
                            <TableHeader>
                                <TableRow className="border-white/5 hover:bg-transparent">
                                    <TableHead className="text-[10px] uppercase font-black">Agency / Entity</TableHead>
                                    <TableHead className="text-[10px] uppercase font-black">Tax ID (GSTIN)</TableHead>
                                    <TableHead className="text-[10px] uppercase font-black">Contact Node</TableHead>
                                    <TableHead className="text-[10px] uppercase font-black">Status</TableHead>
                                    <TableHead className="text-right pr-6"><span className="sr-only">Actions</span></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {agencies?.map((agency) => (
                                    <TableRow key={agency.id} className="border-white/5 group hover:bg-white/[0.02]">
                                        <TableCell className="py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-emerald-500/10 rounded-lg">
                                                    <Briefcase className="h-4 w-4 text-emerald-500" />
                                                </div>
                                                <div className="space-y-0.5">
                                                    <p className="text-sm font-bold text-white">{agency.companyName}</p>
                                                    <p className="text-[9px] text-muted-foreground uppercase font-code tracking-tighter">{agency.id}</p>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell className="font-code text-xs text-accent">{agency.gstNumber || 'PENDING'}</TableCell>
                                        <TableCell>
                                            <div className="space-y-0.5">
                                                <p className="text-xs text-foreground">{agency.contactEmail}</p>
                                                <p className="text-[10px] text-muted-foreground">{agency.phone}</p>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant={getStatusVariant(agency.status) as any} className="text-[10px] font-black uppercase h-5">
                                                {agency.status.replace('_', ' ')}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right pr-6">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button size="icon" variant="ghost" className="h-8 w-8 hover:bg-white/10">
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuLabel>Agency Controls</DropdownMenuLabel>
                                                    <DropdownMenuItem onClick={() => handleUpdateStatus(agency.id, 'ACTIVE', agency.companyName)}>
                                                        <CheckCircle2 className="h-3.5 w-3.5 mr-2 text-emerald-500" /> Verify & Activate
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => handleUpdateStatus(agency.id, 'SUSPENDED', agency.companyName)}>
                                                        <ShieldCheck className="h-3.5 w-3.5 mr-2 text-amber-500" /> Suspend Ops
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem className="text-destructive" onClick={() => handleUpdateStatus(agency.id, 'BLOCKED', agency.companyName)}>
                                                        <Ban className="h-3.5 w-3.5 mr-2" /> Block Access
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
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
