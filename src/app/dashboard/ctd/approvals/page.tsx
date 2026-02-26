
"use client";

import { PageHeader } from "@/components/dashboard/shared/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useUser } from "@/hooks/use-user";
import { useCollection, useFirestore, useMemoFirebase, updateDocumentNonBlocking } from "@/firebase";
import { collection, query, where, doc } from "firebase/firestore";
import { Skeleton } from "@/components/ui/skeleton";
import type { CharterRFQ } from "@/lib/types";
import { Check, X, ShieldCheck, Briefcase, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { SystemAdvisory } from "@/components/dashboard/operator/system-advisory";

export default function CTDApprovalsPage() {
    const { user, isLoading: isUserLoading } = useUser();
    const firestore = useFirestore();
    const { toast } = useToast();

    const pendingQuery = useMemoFirebase(() => {
        if (!firestore || !user?.company) return null;
        return query(
            collection(firestore, 'charterRFQs'), 
            where('company', '==', user.company),
            where('status', '==', 'Pending Approval')
        );
    }, [firestore, user]);

    const { data: pendingRfqs, isLoading: requestsLoading } = useCollection<CharterRFQ>(pendingQuery, 'charterRFQs');

    const handleAction = (rfqId: string, action: 'Approve' | 'Reject') => {
        if (!firestore) return;
        
        const status = action === 'Approve' ? 'Bidding Open' : 'Closed';
        const rfqRef = doc(firestore, 'charterRFQs', rfqId);
        
        updateDocumentNonBlocking(rfqRef, { status });
        
        toast({
            title: `Request ${action}d`,
            description: action === 'Approve' 
                ? "Request has been synchronized with the operator marketplace." 
                : "Request has been returned to the requester.",
        });
    };

    const isLoading = isUserLoading || requestsLoading;

    return (
        <>
            <PageHeader title="Internal Governance Queue" description="Review and approve employee charter requests before marketplace synchronization." />
            
            <div className="grid gap-6">
                <Card className="bg-card">
                    <CardHeader>
                        <CardTitle>Pending CTD Sign-offs</CardTitle>
                        <CardDescription>Requests requiring organizational approval for budget and policy compliance.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {isLoading ? <Skeleton className="h-64 w-full" /> : (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Requester / Employee</TableHead>
                                        <TableHead>Route & Schedule</TableHead>
                                        <TableHead>Cost Center</TableHead>
                                        <TableHead>Budget Impact</TableHead>
                                        <TableHead className="text-right">Governance Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {pendingRfqs?.map((rfq) => (
                                        <TableRow key={rfq.id}>
                                            <TableCell>
                                                <div className="font-medium">{rfq.customerName}</div>
                                                <div className="text-[10px] text-muted-foreground uppercase font-code">{rfq.id}</div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="text-sm">{rfq.departure} to {rfq.arrival}</div>
                                                <div className="text-[10px] text-muted-foreground">{new Date(rfq.departureDate).toLocaleDateString()}</div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="outline" className="font-code text-[10px] uppercase">
                                                    {rfq.costCenter || 'UNASSIGNED'}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex flex-col">
                                                    <span className="text-xs font-bold text-accent">~ ₹ 8.5 L</span>
                                                    <span className="text-[9px] text-muted-foreground">Market Estimate</span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Button size="icon" variant="ghost" className="h-8 w-8 text-green-500 hover:bg-green-500/10" onClick={() => handleAction(rfq.id, 'Approve')}>
                                                        <Check className="h-4 w-4" />
                                                    </Button>
                                                    <Button size="icon" variant="ghost" className="h-8 w-8 text-red-500 hover:bg-red-500/10" onClick={() => handleAction(rfq.id, 'Reject')}>
                                                        <X className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        )}
                        {(!isLoading && (!pendingRfqs || pendingRfqs.length === 0)) && (
                            <div className="text-center py-20 border-2 border-dashed rounded-lg bg-muted/5">
                                <ShieldCheck className="mx-auto h-10 w-10 text-muted-foreground/40 mb-4" />
                                <p className="text-muted-foreground">Queue clear. No requests currently require internal governance review.</p>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {pendingRfqs && pendingRfqs.length > 0 && (
                    <SystemAdvisory 
                        level="INFO"
                        title="Corporate Policy: Q3 Travel Threshold"
                        message="International heavy-jet charters require supplementary justification if cost centers exceed the quarterly coordination limit."
                    />
                )}
            </div>
        </>
    );
}
