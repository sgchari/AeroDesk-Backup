
'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FileText, Download, Upload, ShieldCheck, CreditCard } from 'lucide-react';
import { useFirestore, addDocumentNonBlocking, updateDocumentNonBlocking } from '@/firebase';
import { useToast } from '@/hooks/use-toast';
import type { CharterRFQ, Invoice, SeatAllocationRequest } from '@/lib/types';
import { Badge } from '@/components/ui/badge';

export function InvoicePanel({ charter, invoice, userRole }: { charter: CharterRFQ | SeatAllocationRequest, invoice?: Invoice, userRole?: string }) {
    const firestore = useFirestore();
    const { toast } = useToast();
    
    const [amount, setAmount] = useState(charter.totalAmount || 0);
    const [invoiceNum, setInvoiceNum] = useState(`INV-${Date.now().toString().slice(-6)}`);

    const isOperator = userRole === 'Operator';
    const isCustomer = userRole === 'Customer' || userRole === 'Requester';
    
    const status = (charter as CharterRFQ).status || (charter as SeatAllocationRequest).requestStatus;
    const canIssue = isOperator && (status === 'manifestApproved' || status === 'APPROVED');

    const handleIssueInvoice = () => {
        if (!firestore) return;

        const isSeat = !!(charter as SeatAllocationRequest).requestId;
        const collection = isSeat ? 'seatAllocationRequests' : 'charterRequests';
        const newStatus = isSeat ? 'WAITING_PAYMENT' : 'invoiceIssued';

        const invoiceData = {
            relatedEntityId: charter.id,
            operatorId: charter.operatorId || 'demo-op',
            invoiceNumber: invoiceNum,
            totalAmount: amount,
            status: 'issued',
            createdAt: new Date().toISOString(),
            bankDetails: "AeroBank India • IFSC: AERO0001234 • A/C: 9988776655"
        };

        addDocumentNonBlocking({ path: 'invoices' } as any, invoiceData);
        updateDocumentNonBlocking({ path: `${collection}/${charter.id}` } as any, { 
            ...(isSeat ? { requestStatus: newStatus } : { status: newStatus }) 
        });

        addDocumentNonBlocking({ path: 'activityLogs' } as any, {
            entityId: charter.id,
            actionType: 'INVOICE_ISSUED',
            performedBy: 'Operator Finance',
            role: 'Operator',
            previousStatus: status,
            newStatus: newStatus,
            timestamp: new Date().toISOString()
        });

        toast({ title: "Invoice Published", description: "The customer has been notified for settlement." });
    };

    if (!invoice && !canIssue) return null;

    return (
        <Card className="bg-card">
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle className="text-base flex items-center gap-2">
                        <CreditCard className="h-4 w-4 text-accent" />
                        Financial Settlement
                    </CardTitle>
                    <CardDescription>Direct bank transfer instructions and coordination.</CardDescription>
                </div>
                {invoice && <Badge className="bg-blue-500/20 text-blue-500 border-none uppercase text-[9px] font-black">{invoice.status}</Badge>}
            </CardHeader>
            <CardContent className="space-y-6">
                {!invoice && canIssue ? (
                    <div className="space-y-4 p-4 rounded-lg bg-accent/5 border border-accent/20 animate-in fade-in duration-500">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <Label className="text-[10px]">Invoice Reference</Label>
                                <Input value={invoiceNum} onChange={(e) => setInvoiceNum(e.target.value)} className="h-8 text-xs bg-muted/20" />
                            </div>
                            <div className="space-y-1">
                                <Label className="text-[10px]">Total Coordination Value (INR)</Label>
                                <Input type="number" value={amount} onChange={(e) => setAmount(Number(e.target.value))} className="h-8 text-xs bg-muted/20" />
                            </div>
                        </div>
                        <Button onClick={handleIssueInvoice} className="w-full bg-accent text-accent-foreground h-9 text-[10px] font-black uppercase tracking-widest shadow-lg shadow-accent/5">
                            Initialize & Issue Invoice
                        </Button>
                    </div>
                ) : invoice && (
                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 rounded-lg bg-muted/20 border border-white/5">
                            <div className="space-y-1">
                                <p className="text-[10px] font-bold text-muted-foreground uppercase">Invoice Number</p>
                                <p className="text-sm font-mono font-bold">{invoice.invoiceNumber}</p>
                            </div>
                            <div className="text-right space-y-1">
                                <p className="text-[10px] font-bold text-muted-foreground uppercase">Settlement Amount</p>
                                <p className="text-lg font-black text-accent">₹ {invoice.totalAmount.toLocaleString()}</p>
                            </div>
                        </div>
                        
                        <div className="p-4 rounded-lg border border-white/5 space-y-2">
                            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                                <ShieldCheck className="h-3 w-3 text-accent" /> Institutional Bank Details
                            </p>
                            <p className="text-xs font-mono text-foreground leading-relaxed whitespace-pre-wrap">
                                {invoice.bankDetails}
                            </p>
                        </div>

                        {isCustomer && (
                            <Button variant="outline" className="w-full h-9 text-[10px] font-bold uppercase gap-2 border-white/10 hover:bg-accent/5">
                                <Download className="h-3.5 w-3.5" /> Download Pro-Forma Invoice (PDF)
                            </Button>
                        )}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
