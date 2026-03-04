
'use client';

import { PageHeader } from "@/components/dashboard/shared/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useCollection, useFirestore, useMemoFirebase, updateDocumentNonBlocking } from "@/firebase";
import { CorporateTravelDesk } from "@/lib/types";
import { collection } from "firebase/firestore";
import { MoreHorizontal, Building, ShieldCheck, Mail, PlusCircle } from "lucide-react";
import React from "react";
import { useToast } from "@/hooks/use-toast";

const getStatusVariant = (status: string) => {
    switch (status) {
        case 'Active': return 'success';
        case 'Pending Setup': return 'warning';
        case 'Suspended': return 'destructive';
        case 'Inactive': return 'secondary';
        default: return 'outline';
    }
}

export default function CorporateManagementPage() {
    const firestore = useFirestore();
    const { toast } = useToast();

    const { data: ctds, isLoading } = useCollection<CorporateTravelDesk>(
        useMemoFirebase(() => (firestore && !(firestore as any)._isMock) ? collection(firestore, 'corporateTravelDesks') : null, [firestore]),
        'corporateTravelDesks'
    );

    const handleUpdateStatus = (ctdId: string, status: string, companyName: string) => {
        const mockDocRef = { path: `corporateTravelDesks/${ctdId}` } as any;
        updateDocumentNonBlocking(mockDocRef, { status });
        
        toast({
            title: "Governance Action Recorded",
            description: `${companyName} is now marked as ${status}.`,
        });
    };

    return (
        <>
            <PageHeader title="Corporate Governance" description="Approve Corporate Travel Desk (CTD) accounts and oversee enterprise coordination hierarchies.">
                <Button>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Onboard Corporate Entity
                </Button>
            </PageHeader>
            
            <Card className="bg-card">
                <CardHeader>
                    <CardTitle>Enterprise Travel Desks</CardTitle>
                    <CardDescription>
                        A comprehensive list of all corporate entities utilizing the platform for employee travel governance.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {isLoading ? <Skeleton className="h-64 w-full" /> : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Company Name</TableHead>
                                    <TableHead>Admin ID</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Onboarded On</TableHead>
                                    <TableHead className="text-right">
                                        <span className="sr-only">Actions</span>
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {ctds?.map((ctd) => (
                                    <TableRow key={ctd.id} className="group">
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-accent/10 rounded-lg">
                                                    <Building className="h-4 w-4 text-accent" />
                                                </div>
                                                <div>
                                                    <div className="font-bold text-sm">{ctd.companyName}</div>
                                                    <div className="text-[10px] text-muted-foreground uppercase font-code">{ctd.id}</div>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-col">
                                                <span className="text-xs font-medium">{ctd.adminExternalAuthId}</span>
                                                <span className="text-[10px] text-muted-foreground">Primary Coordinator</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant={getStatusVariant(ctd.status)} className="text-[10px] h-5 font-bold uppercase tracking-wider">
                                                {ctd.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-xs text-muted-foreground">
                                            {ctd.createdAt ? new Date(ctd.createdAt).toLocaleDateString() : 'N/A'}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button size="icon" variant="ghost" className="h-8 w-8">
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuLabel>Governance Actions</DropdownMenuLabel>
                                                    <DropdownMenuItem className="gap-2">
                                                        <ShieldCheck className="h-3.5 w-3.5" /> View Policy Compliance
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem className="gap-2">
                                                        <Mail className="h-3.5 w-3.5" /> Contact Admin
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    {ctd.status === 'Pending Setup' && (
                                                        <DropdownMenuItem onClick={() => handleUpdateStatus(ctd.id, 'Active', ctd.companyName)}>
                                                            Activate Account
                                                        </DropdownMenuItem>
                                                    )}
                                                    {ctd.status === 'Active' && (
                                                        <DropdownMenuItem className="text-destructive" onClick={() => handleUpdateStatus(ctd.id, 'Suspended', ctd.companyName)}>
                                                            _Suspend Operations
                                                        </DropdownMenuItem>
                                                    )}
                                                    {ctd.status === 'Suspended' && (
                                                        <DropdownMenuItem className="text-green-500" onClick={() => handleUpdateStatus(ctd.id, 'Active', ctd.companyName)}>
                                                            Re-activate Account
                                                        </DropdownMenuItem>
                                                    )}
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                    {(!isLoading && (!ctds || ctds.length === 0)) && (
                        <div className="text-center py-20 border-2 border-dashed rounded-lg bg-muted/5">
                            <Building className="mx-auto h-10 w-10 text-muted-foreground/20 mb-4" />
                            <p className="text-muted-foreground">No corporate accounts found. Corporate travel desks appear here after registration.</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </>
    );
}
