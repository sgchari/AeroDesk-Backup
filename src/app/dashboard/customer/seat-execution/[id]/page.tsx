
'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useDoc, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { useUser } from '@/hooks/use-user';
import { PageHeader } from '@/components/dashboard/shared/page-header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import { 
    Users, 
    MapPin, 
    History,
    ArrowLeft,
    Plane,
    ShieldCheck
} from 'lucide-react';
import type { SeatAllocationRequest, PassengerManifest, Invoice, Payment, ActivityLog } from '@/lib/types';
import { ManifestPanel } from '@/components/dashboard/charter/manifest-panel';
import { InvoicePanel } from '@/components/dashboard/charter/invoice-panel';
import { PaymentPanel } from '@/components/dashboard/charter/payment-panel';
import { SeatBookingProgressTracker } from '@/components/dashboard/shared/seat-booking-progress-tracker';

export default function CustomerSeatExecutionPage() {
    const { id } = useParams();
    const router = useRouter();
    const { user } = useUser();
    const firestore = useFirestore();

    const { data: seatRequest, isLoading: requestLoading } = useDoc<SeatAllocationRequest>(
        useMemoFirebase(() => null, []), 
        `seatAllocationRequests/${id}`
    );

    const { data: manifests } = useCollection<PassengerManifest>(null, 'passengerManifests');
    const activeManifest = manifests?.find(m => m.charterId === id);

    const { data: invoices } = useCollection<Invoice>(null, 'invoices');
    const activeInvoice = invoices?.find(i => i.relatedEntityId === id);

    const { data: payments } = useCollection<Payment>(null, 'payments');
    const activePayment = payments?.find(p => p.relatedEntityId === id);

    const { data: logs } = useCollection<ActivityLog>(null, 'activityLogs');
    const entityLogs = logs?.filter(l => l.entityId === id || l.charterId === id).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    if (requestLoading) return <div className="p-8 space-y-4"><Skeleton className="h-12 w-1/3"/><Skeleton className="h-64 w-full"/></div>;
    if (!seatRequest) return <div className="p-8 text-center">Seat allocation lead not found.</div>;

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4 mb-2">
                <Button variant="ghost" size="sm" onClick={() => router.back()} className="text-muted-foreground hover:text-white">
                    <ArrowLeft className="h-4 w-4 mr-2" /> Back to Terminal
                </Button>
                <div className="h-4 w-px bg-white/10" />
                <span className="text-[10px] uppercase tracking-widest font-black text-muted-foreground">Jet Seat Audit Protocol</span>
            </div>

            <PageHeader 
                title={`${seatRequest.origin} → ${seatRequest.destination}`}
                description={`Lead ID: ${seatRequest.requestId} • Allocated for ${seatRequest.requesterName}`}
            >
                <Badge variant="outline" className="h-8 px-4 bg-accent/10 border-accent/20 text-accent font-black uppercase tracking-tighter">
                    {seatRequest.requestStatus.replace(/_/g, ' ')}
                </Badge>
            </PageHeader>

            <SeatBookingProgressTracker currentStatus={seatRequest.requestStatus} />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    {/* Normalized Panels for Seat Workflow */}
                    <ManifestPanel 
                        charter={seatRequest as any} 
                        manifest={activeManifest} 
                        userRole={user?.role} 
                    />
                    
                    <InvoicePanel 
                        charter={seatRequest as any} 
                        invoice={activeInvoice} 
                        userRole={user?.role} 
                    />

                    <PaymentPanel 
                        charter={seatRequest as any} 
                        invoice={activeInvoice}
                        payment={activePayment} 
                        userRole={user?.role} 
                    />
                </div>

                <div className="space-y-6">
                    <Card className="bg-card">
                        <CardHeader>
                            <CardTitle className="text-sm flex items-center gap-2">
                                <Plane className="h-4 w-4 text-accent" />
                                Allocation Brief
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4 text-xs">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <p className="text-[9px] uppercase text-muted-foreground font-black">Capacity Booked</p>
                                    <p className="text-sm font-bold flex items-center gap-2"><Users className="h-3.5 w-3.5" /> {seatRequest.seatsRequested} PAX</p>
                                </div>
                                <div className="space-y-1 text-right">
                                    <p className="text-[9px] uppercase text-muted-foreground font-black">Gross Value</p>
                                    <p className="text-sm font-black text-accent">₹ {seatRequest.totalAmount?.toLocaleString()}</p>
                                </div>
                            </div>
                            <Separator className="bg-white/5" />
                            <div className="space-y-2">
                                <p className="text-[9px] uppercase text-muted-foreground font-black">Flight Reference</p>
                                <p className="font-code text-white/70">{seatRequest.flightId}</p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-card">
                        <CardHeader>
                            <CardTitle className="text-sm flex items-center gap-2">
                                <History className="h-4 w-4 text-primary" />
                                Coordination Audit
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="max-h-[400px] overflow-y-auto px-6 pb-6 space-y-4">
                                {entityLogs?.length ? entityLogs.map((log) => (
                                    <div key={log.id} className="relative pl-4 border-l border-white/5 space-y-1">
                                        <div className="absolute left-[-4.5px] top-1 w-2 h-2 rounded-full bg-primary/40" />
                                        <p className="text-[9px] font-bold text-foreground uppercase">{log.actionType}</p>
                                        <p className="text-[8px] text-muted-foreground">
                                            {log.performedBy} • {new Date(log.timestamp).toLocaleTimeString()}
                                        </p>
                                    </div>
                                )) : (
                                    <p className="text-[10px] text-muted-foreground text-center py-4 italic">Synchronizing logs...</p>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
