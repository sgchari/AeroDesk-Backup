
'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ShieldCheck, Upload, CheckCircle2, XCircle } from 'lucide-react';
import { useFirestore, addDocumentNonBlocking, updateDocumentNonBlocking } from '@/firebase';
import { useToast } from '@/hooks/use-toast';
import type { CharterRFQ, Invoice, Payment } from '@/lib/types';
import { Badge } from '@/components/ui/badge';

export function PaymentPanel({ charter, invoice, payment, userRole }: { charter: CharterRFQ, invoice?: Invoice, payment?: Payment, userRole?: string }) {
    const firestore = useFirestore();
    const { toast } = useToast();
    const [utr, setUtr] = useState("");

    const isCustomer = userRole === 'Customer' || userRole === 'Requester';
    const isOperator = userRole === 'Operator';
    const canSubmit = isCustomer && charter.status === 'invoiceIssued';
    const needsVerification = isOperator && charter.status === 'paymentSubmitted';

    const handleSubmitPayment = () => {
        if (!firestore || !invoice) return;

        addDocumentNonBlocking({ path: 'payments' } as any, {
            charterId: charter.id,
            invoiceId: invoice.id,
            submittedBy: charter.customerName,
            utrReference: utr,
            status: 'submitted',
            createdAt: new Date().toISOString()
        });

        updateDocumentNonBlocking({ path: `charterRequests/${charter.id}` } as any, { status: 'paymentSubmitted' });

        addDocumentNonBlocking({ path: 'activityLogs' } as any, {
            charterId: charter.id,
            actionType: 'PAYMENT_SUBMITTED',
            performedBy: charter.customerName,
            role: userRole,
            previousStatus: 'invoiceIssued',
            newStatus: 'paymentSubmitted',
            timestamp: new Date().toISOString(),
            metadata: { utr }
        });

        toast({ title: "Payment Proof Logged", description: "Operator will verify the bank settlement shortly." });
    };

    const handleVerify = (verified: boolean) => {
        if (!firestore || !payment || !invoice) return;

        const newStatus = verified ? 'paymentConfirmed' : 'invoiceIssued';
        updateDocumentNonBlocking({ path: `charterRequests/${charter.id}` } as any, { status: newStatus });
        updateDocumentNonBlocking({ path: `payments/${payment.id}` } as any, { 
            status: verified ? 'verified' : 'rejected',
            verifiedAt: verified ? new Date().toISOString() : null
        });

        if (verified) {
            updateDocumentNonBlocking({ path: `invoices/${invoice.id}` } as any, { status: 'paid' });
            // Chain status forward to charterConfirmed automatically if verified
            updateDocumentNonBlocking({ path: `charterRequests/${charter.id}` } as any, { status: 'charterConfirmed' });
        }

        addDocumentNonBlocking({ path: 'activityLogs' } as any, {
            charterId: charter.id,
            actionType: verified ? 'PAYMENT_VERIFIED' : 'PAYMENT_REJECTED',
            performedBy: 'Operator Finance',
            role: 'Operator',
            previousStatus: 'paymentSubmitted',
            newStatus: verified ? 'charterConfirmed' : 'invoiceIssued',
            timestamp: new Date().toISOString()
        });

        toast({ title: verified ? "Payment Verified" : "Proof Rejected", description: verified ? "Charter mission is now officially confirmed." : "Customer notified of rejection." });
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
                    <div className="space-y-4 p-4 rounded-lg bg-accent/5 border border-accent/20">
                        <div className="space-y-1">
                            <Label className="text-[10px]">UTR / Transaction Reference Number</Label>
                            <Input placeholder="Enter bank reference..." value={utr} onChange={(e) => setUtr(e.target.value)} className="h-8 text-xs" />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-[10px]">Upload Proof of Transfer</Label>
                            <Button variant="outline" size="sm" className="w-full h-8 text-[10px] font-bold uppercase gap-2 border-dashed">
                                <Upload className="h-3 w-3" /> Select File
                            </Button>
                        </div>
                        <Button onClick={handleSubmitPayment} className="w-full bg-accent text-accent-foreground h-9 text-[10px] font-black uppercase tracking-widest">
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
                                <span className="text-[10px] font-bold text-muted-foreground uppercase">Logged On</span>
                                <span className="text-[10px] text-foreground">{new Date(payment.createdAt).toLocaleString()}</span>
                            </div>
                        </div>

                        {needsVerification && (
                            <div className="flex gap-2">
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
