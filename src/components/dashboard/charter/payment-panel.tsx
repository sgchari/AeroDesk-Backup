
'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ShieldCheck, Upload, CheckCircle2, XCircle } from 'lucide-react';
import { useFirestore, addDocumentNonBlocking, updateDocumentNonBlocking } from '@/firebase';
import { useToast } from '@/hooks/use-toast';
import type { CharterRFQ, Invoice, Payment, SeatAllocationRequest } from '@/lib/types';
import { Badge } from '@/components/ui/badge';

export function PaymentPanel({ charter, invoice, payment, userRole }: { charter: CharterRFQ | SeatAllocationRequest, invoice?: Invoice, payment?: Payment, userRole?: string }) {
    const firestore = useFirestore();
    const { toast } = useToast();
    const [utr, setUtr] = useState("");

    const isCustomer = userRole === 'Customer' || userRole === 'Requester';
    const isOperator = userRole === 'Operator';
    
    const status = (charter as CharterRFQ).status || (charter as SeatAllocationRequest).requestStatus;
    const isSeat = !!(charter as SeatAllocationRequest).requestId;

    const canSubmit = isCustomer && (status === 'invoiceIssued' || status === 'WAITING_PAYMENT');
    const needsVerification = isOperator && (status === 'paymentSubmitted' || status === 'PAYMENT_SUBMITTED');

    const handleSubmitPayment = () => {
        if (!firestore || !invoice) return;

        const collection = isSeat ? 'seatAllocationRequests' : 'charterRequests';
        const newStatus = isSeat ? 'PAYMENT_SUBMITTED' : 'paymentSubmitted';

        addDocumentNonBlocking({ path: 'payments' } as any, {
            relatedEntityId: charter.id,
            invoiceId: invoice.id,
            submittedBy: (charter as any).customerName || (charter as any).requesterName,
            utrReference: utr,
            status: 'submitted',
            createdAt: new Date().toISOString()
        });

        updateDocumentNonBlocking({ path: `${collection}/${charter.id}` } as any, { 
            ...(isSeat ? { requestStatus: newStatus } : { status: newStatus }) 
        });

        addDocumentNonBlocking({ path: 'activityLogs' } as any, {
            entityId: charter.id,
            actionType: 'PAYMENT_SUBMITTED',
            performedBy: (charter as any).customerName || (charter as any).requesterName,
            role: userRole,
            previousStatus: status,
            newStatus: newStatus,
            timestamp: new Date().toISOString(),
            metadata: { utr }
        });

        toast({ title: "Payment Proof Logged", description: "Operator will verify the bank settlement shortly." });
    };

    const handleVerify = (verified: boolean) => {
        if (!firestore || !payment || !invoice) return;

        const collection = isSeat ? 'seatAllocationRequests' : 'charterRequests';
        const successStatus = isSeat ? 'PAYMENT_CONFIRMED' : 'paymentConfirmed';
        const failureStatus = isSeat ? 'WAITING_PAYMENT' : 'invoiceIssued';

        const newStatus = verified ? successStatus : failureStatus;
        
        updateDocumentNonBlocking({ path: `${collection}/${charter.id}` } as any, { 
            ...(isSeat ? { requestStatus: newStatus } : { status: newStatus }) 
        });
        
        updateDocumentNonBlocking({ path: `payments/${payment.id}` } as any, { 
            status: verified ? 'verified' : 'rejected',
            verifiedAt: verified ? new Date().toISOString() : null
        });

        if (verified) {
            updateDocumentNonBlocking({ path: `invoices/${invoice.id}` } as any, { status: 'paid' });
            
            // Auto-chain to confirmed for both types
            const confirmedStatus = isSeat ? 'CONFIRMED' : 'charterConfirmed';
            updateDocumentNonBlocking({ path: `${collection}/${charter.id}` } as any, { 
                ...(isSeat ? { requestStatus: confirmedStatus } : { status: confirmedStatus }) 
            });
        }

        addDocumentNonBlocking({ path: 'activityLogs' } as any, {
            entityId: charter.id,
            actionType: verified ? 'PAYMENT_VERIFIED' : 'PAYMENT_REJECTED',
            performedBy: 'Operator Finance',
            role: 'Operator',
            previousStatus: status,
            newStatus: verified ? (isSeat ? 'CONFIRMED' : 'charterConfirmed') : failureStatus,
            timestamp: new Date().toISOString()
        });

        toast({ 
            title: verified ? "Payment Verified" : "Proof Rejected", 
            description: verified ? "Mission is now officially confirmed." : "Customer notified of rejection." 
        });
    };

    if (!payment && !canSubmit) return null;

    return (
        <Card className="bg-card">
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle className="text-base flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-accent" />
                        Payment Verification
                    </CardTitle>
                    <CardDescription>Transaction audit and mission confirmation.</CardDescription>
                </div>
                {payment && (
                    <Badge variant={payment.status === 'verified' ? 'success' : 'warning'} className="uppercase text-[9px] font-black">
                        {payment.status}
                    </Badge>
                )}
            </CardHeader>
            <CardContent className="space-y-6">
                {!payment && canSubmit ? (
                    <div className="space-y-4 p-4 rounded-lg bg-accent/5 border border-accent/20 animate-in fade-in duration-500">
                        <div className="space-y-1">
                            <Label className="text-[10px]">UTR / Transaction Reference Number</Label>
                            <Input placeholder="e.g. AXISB0000..." value={utr} onChange={(e) => setUtr(e.target.value)} className="h-8 text-xs bg-muted/20" />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-[10px]">Upload Proof of Transfer</Label>
                            <Button variant="outline" size="sm" className="w-full h-8 text-[10px] font-bold uppercase gap-2 border-dashed hover:bg-accent/5">
                                <Upload className="h-3 w-3" /> Select Institutional Asset
                            </Button>
                        </div>
                        <Button onClick={handleSubmitPayment} className="w-full bg-accent text-accent-foreground h-9 text-[10px] font-black uppercase tracking-widest shadow-lg shadow-accent/5">
                            Log Payment Proof
                        </Button>
                    </div>
                ) : payment && (
                    <div className="space-y-4">
                        <div className="p-4 rounded-lg bg-muted/20 border border-white/5 space-y-3">
                            <div className="flex justify-between items-center">
                                <span className="text-[10px] font-bold text-muted-foreground uppercase">UTR Reference</span>
                                <span className="text-xs font-mono font-bold text-accent">{payment.utrReference}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-[10px] font-bold text-muted-foreground uppercase">Submission Node</span>
                                <span className="text-[10px] text-foreground">{new Date(payment.createdAt).toLocaleString()}</span>
                            </div>
                        </div>

                        {needsVerification && (
                            <div className="flex gap-2 animate-in slide-in-from-bottom-2">
                                <Button variant="destructive" size="sm" className="flex-1 text-[10px] font-bold uppercase" onClick={() => handleVerify(false)}>
                                    Reject Proof
                                </Button>
                                <Button size="sm" className="flex-1 bg-green-600 text-white hover:bg-green-700 text-[10px] font-black uppercase" onClick={() => handleVerify(true)}>
                                    Verify & Confirm
                                </Button>
                            </div>
                        )}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
