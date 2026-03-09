'use client';

import React, { useMemo } from 'react';
import { PageHeader } from "@/components/dashboard/shared/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useCollection, useUser, useFirestore, updateDocumentNonBlocking, addDocumentNonBlocking, useMemoFirebase } from "@/firebase";
import { collection, query, where, doc } from "firebase/firestore";
import { Skeleton } from "@/components/ui/skeleton";
import type { EmployeeTravelRequest, TravelApproval, CorporateTravelPolicy } from "@/lib/types";
import { Check, X, ShieldCheck, AlertCircle, Clock, Zap } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

export default function CorporateApprovalsPage() {
    const { user } = useUser();
    const { toast } = useToast();
    const firestore = useFirestore();

    const { data: requests, isLoading: requestsLoading } = useCollection<EmployeeTravelRequest>(
        useMemoFirebase(() => {
            if (!firestore || (firestore as any)._isMock || !user?.corporateId) return null;
            return query(collection(firestore, 'employeeTravelRequests'), where('corporateId', '==', user.corporateId));
        }, [firestore, user?.corporateId]),
        'employeeTravelRequests'
    );

    const { data: approvals } = useCollection<TravelApproval>(null, 'travelApprovals');
    const { data: policies } = useCollection<CorporateTravelPolicy>(null, 'corporateTravelPolicies');

    const pendingRequests = useMemo(() => {
        if (!requests) return [];
        
        // Filter based on user's sub-role
        if (user?.firmRole === 'MANAGER') {
            return requests.filter(r => r.requestStatus === 'REQUEST_CREATED');
        }
        if (user?.firmRole === 'COST_CENTER_OWNER') {
            return requests.filter(r => r.requestStatus === 'MANAGER_APPROVED');
        }
        if (user?.firmRole === 'FINANCE') {
            return requests.filter(r => r.requestStatus === 'COST_CENTER_APPROVED');
        }
        if (user?.firmRole === 'TRAVEL_DESK_ADMIN') {
            return requests.filter(r => r.requestStatus === 'FINANCE_APPROVED');
        }
        return requests.filter(r => !['TRIP_COMPLETED', 'REJECTED'].includes(r.requestStatus));
    }, [requests, user]);

    const handleApproval = (requestId: string, status: 'APPROVED' | 'REJECTED') => {
        if (!firestore) return;

        const nextStatus = status === 'REJECTED' ? 'REJECTED' : 
            user?.firmRole === 'MANAGER' ? 'MANAGER_APPROVED' :
            user?.firmRole === 'COST_CENTER_OWNER' ? 'COST_CENTER_APPROVED' :
            user?.firmRole === 'FINANCE' ? 'FINANCE_APPROVED' : 'TRAVEL_DESK_PROCESSING';

        const requestRef = (firestore as any)._isMock ? { path: `employeeTravelRequests/${requestId}` } as any : doc(firestore, 'employeeTravelRequests', requestId);
        updateDocumentNonBlocking(requestRef, { requestStatus: nextStatus });

        // Register Approval Log
        const approvalRef = (firestore as any)._isMock ? { path: 'travelApprovals' } as any : collection(firestore, 'travelApprovals');
        addDocumentNonBlocking(approvalRef, {
            approvalId: `APR-${Date.now().toString().slice(-6)}`,
            requestId,
            approverRole: user?.firmRole,
            approverUserId: user?.id,
            approvalStatus: status,
            createdAt: new Date().toISOString()
        });

        toast({
            title: status === 'APPROVED' ? "Sign-off Recorded" : "Request Declined",
            description: `Mission has been updated to ${nextStatus.replace(/_/g, ' ')}.`,
        });
    };

    return (
        <div className="space-y-6">
            <PageHeader 
                title="Internal Governance Flow" 
                description="Review and authorize institutional travel requests based on policy alignment."
            />

            <div className="grid gap-6">
                <Card className="bg-card border-l-4 border-l-amber-500 shadow-2xl">
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="text-base flex items-center gap-2">
                                    <ShieldCheck className="h-4 w-4 text-amber-500" />
                                    Awaiting Your Sign-off
                                </CardTitle>
                                <CardDescription>Requests currently in your sub-phase of the approval protocol.</CardDescription>
                            </div>
                            <Badge variant="outline" className="text-[10px] font-black border-amber-500/20 text-amber-500 uppercase">Level: {user?.firmRole || 'Reviewer'}</Badge>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        {requestsLoading ? <Skeleton className="h-48 w-full" /> : (
                            <Table>
                                <TableHeader>
                                    <TableRow className="border-white/5 hover:bg-transparent">
                                        <TableHead className="pl-6 text-[10px] uppercase font-black">Personnel</TableHead>
                                        <TableHead className="text-[10px] uppercase font-black">Sector & Date</TableHead>
                                        <TableHead className="text-[10px] uppercase font-black">Impact Est.</TableHead>
                                        <TableHead className="text-right pr-6 text-[10px] uppercase font-black">Governance Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {pendingRequests.map((req) => (
                                        <TableRow key={req.id} className="border-white/5 hover:bg-white/[0.02]">
                                            <TableCell className="pl-6 py-4">
                                                <div className="space-y-1">
                                                    <p className="text-xs font-bold text-white">{req.employeeName}</p>
                                                    <p className="text-[9px] text-muted-foreground font-code uppercase">ETR: {req.requestId}</p>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <p className="text-xs font-medium">{req.origin} » {req.destination}</p>
                                                <p className="text-[9px] text-muted-foreground uppercase font-black">{new Date(req.travelDate).toLocaleDateString()}</p>
                                            </TableCell>
                                            <TableCell>
                                                <p className="text-xs font-black text-accent">₹ {req.estimatedBudget?.toLocaleString() || '---'}</p>
                                                <Badge variant="outline" className="text-[8px] h-4 mt-1 border-white/10 uppercase">{req.travelType.replace('_', ' ')}</Badge>
                                            </TableCell>
                                            <TableCell className="text-right pr-6">
                                                <div className="flex justify-end gap-2">
                                                    <Button 
                                                        size="icon" 
                                                        variant="ghost" 
                                                        className="h-8 w-8 text-rose-500 hover:bg-rose-500/10"
                                                        onClick={() => handleApproval(req.id, 'REJECTED')}
                                                    >
                                                        <X className="h-4 w-4" />
                                                    </Button>
                                                    <Button 
                                                        size="icon" 
                                                        variant="ghost" 
                                                        className="h-8 w-8 text-emerald-500 hover:bg-emerald-500/10 border border-emerald-500/20"
                                                        onClick={() => handleApproval(req.id, 'APPROVED')}
                                                    >
                                                        <Check className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        )}
                        {pendingRequests.length === 0 && (
                            <div className="text-center py-20 opacity-30">
                                <ShieldCheck className="h-10 w-10 mx-auto text-muted-foreground/20 mb-4" />
                                <p className="text-xs text-muted-foreground uppercase font-black tracking-[0.2em]">Queue Clear</p>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* POLICY SUMMARY */}
                <Card className="bg-primary/5 border-primary/20">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-xs font-black uppercase text-primary tracking-widest flex items-center gap-2">
                            <Zap className="h-4 w-4" /> Policy Enforcement Logic
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                        {policies?.filter(p => p.corporateId === user?.corporateId).map(policy => (
                            <div key={policy.id} className="p-3 rounded-xl bg-black/40 border border-white/5 flex items-start gap-3">
                                <AlertCircle className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                                <div className="space-y-1">
                                    <p className="text-[10px] font-bold text-white uppercase tracking-tighter">{policy.policyId}</p>
                                    <p className="text-[11px] text-muted-foreground italic leading-relaxed">"{policy.rule}"</p>
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}