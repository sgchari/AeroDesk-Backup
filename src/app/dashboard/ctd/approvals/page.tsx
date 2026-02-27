
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
import { Check, X, ShieldCheck, Briefcase, FileText, Plane, Clock } from "lucide-react";
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

    const { data: allCompanyRfqs, isLoading: requestsLoading } = useCollection<CharterRFQ>(pendingQuery, 'charterRFQs');

    // Robust client-side filter for pending status in demo/simulation mode
    const pendingRfqs = allCompanyRfqs?.filter(r => r.status === 'Pending Approval') || [];

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
                <Card className="bg-card border-l-4 border-l-accent shadow-2xl">
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle>Pending CTD Sign-offs</CardTitle>
                                <CardDescription>Requests requiring organizational approval for budget and policy compliance.</CardDescription>
                            </div>
                            <Badge variant="outline" className="bg-accent/10 border-accent/20 text-accent font-black text-[9px] uppercase tracking-widest">Action Required</Badge>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {isLoading ? <Skeleton className="h-64 w-full" /> : (
                            <Table>
                                <TableHeader>
                                    <TableRow className="border-white/5">
                                        <TableHead className="text-[10px] uppercase font-black text-muted-foreground">Requester / Employee</TableHead>
                                        <TableHead className="text-[10px] uppercase font-black text-muted-foreground">Route & Schedule</TableHead>
                                        <TableHead className="text-[10px] uppercase font-black text-muted-foreground">Cost Center</TableHead>
                                        <TableHead className="text-[10px] uppercase font-black text-muted-foreground">Budget Impact</TableHead>
                                        <TableHead className="text-right text-[10px] uppercase font-black text-muted-foreground">Governance Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {pendingRfqs.map((rfq) => (
                                        <TableRow key={rfq.id} className="border-white/5 hover:bg-white/[0.02] group">
                                            <TableCell className="py-4">
                                                <div className="font-bold text-sm text-foreground">{rfq.customerName}</div>
                                                <div className="text-[9px] text-muted-foreground uppercase font-code tracking-tighter">{rfq.id}</div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2 text-xs font-medium">
                                                    <Plane className="h-3.5 w-3.5 text-accent/60" />
                                                    {rfq.departure} → {rfq.arrival}
                                                </div>
                                                <div className="text-[9px] text-muted-foreground flex items-center gap-1 mt-0.5">
                                                    <Clock className="h-2.5 w-2.5" /> {new Date(rfq.departureDate).toLocaleDateString()}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="outline" className="font-code text-[10px] uppercase border-white/10 group-hover:border-accent/30 transition-colors">
                                                    {rfq.costCenter || 'UNASSIGNED'}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex flex-col">
                                                    <span className="text-xs font-black text-accent tracking-tight">~ ₹ 8.5 L</span>
                                                    <span className="text-[8px] text-muted-foreground uppercase font-bold">Estimated</span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Button size="icon" variant="ghost" className="h-8 w-8 text-green-500 hover:text-green-500 hover:bg-green-500/10" onClick={() => handleAction(rfq.id, 'Approve')}>
                                                        <Check className="h-4 w-4" />
                                                    </Button>
                                                    <Button size="icon" variant="ghost" className="h-8 w-8 text-red-500 hover:text-red-500 hover:bg-red-500/10" onClick={() => handleAction(rfq.id, 'Reject')}>
                                                        <X className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        )}
                        {(!isLoading && pendingRfqs.length === 0) && (
                            <div className="text-center py-24 border-2 border-dashed rounded-lg bg-muted/5 border-white/5 opacity-60">
                                <ShieldCheck className="mx-auto h-12 w-12 text-muted-foreground/20 mb-4" />
                                <p className="text-xs text-muted-foreground uppercase font-black tracking-[0.2em]">Queue Clear</p>
                                <p className="text-[10px] text-muted-foreground/60 mt-1">No requests require internal governance review.</p>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {pendingRfqs.length > 0 && (
                    <SystemAdvisory 
                        level="INFO"
                        title="Institutional Threshold Alert"
                        message="Corporate policy requires specialized justification for heavy-jet missions on international corridors exceeding ₹ 10 L in coordination value."
                    />
                )}
            </div>
        </>
    );
}
