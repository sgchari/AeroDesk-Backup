'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useDoc, useFirestore, updateDocumentNonBlocking, addDocumentNonBlocking, useCollection, useMemoFirebase } from '@/firebase';
import { useUser } from '@/hooks/use-user';
import { PageHeader } from '@/components/dashboard/shared/page-header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import { 
    CheckCircle2, 
    Clock, 
    FileText, 
    CreditCard, 
    Plane, 
    Users, 
    MapPin, 
    History,
    AlertCircle,
    ChevronRight,
    ArrowLeft,
    Zap
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { collection, query, where, orderBy } from 'firebase/firestore';
import type { CharterRFQ, PassengerManifest, Invoice, Payment, ActivityLog } from '@/lib/types';
import { ManifestPanel } from '@/components/dashboard/charter/manifest-panel';
import { InvoicePanel } from '@/components/dashboard/charter/invoice-panel';
import { PaymentPanel } from '@/components/dashboard/charter/payment-panel';
import { OperationalPanel } from '@/components/dashboard/charter/operational-panel';
import { StatusTimeline } from '@/components/dashboard/charter/status-timeline';
import { LiveTrackingMap } from '@/components/dashboard/charter/live-tracking-map';

export default function CharterExecutionPage() {
    const { id } = useParams();
    const router = useRouter();
    const { user } = useUser();
    const firestore = useFirestore();

    const { data: charter, isLoading: charterLoading } = useDoc<CharterRFQ>(
        useMemoFirebase(() => null, []), 
        `charterRequests/${id}`
    );

    const { data: manifest } = useCollection<PassengerManifest>(
        useMemoFirebase(() => null, []), 
        `passengerManifests`
    );
    const activeManifest = manifest?.find(m => m.charterId === id);

    const { data: invoice } = useCollection<Invoice>(
        useMemoFirebase(() => null, []), 
        `invoices`
    );
    const activeInvoice = invoice?.find(i => i.charterId === id);

    const { data: payment } = useCollection<Payment>(
        useMemoFirebase(() => null, []), 
        `payments`
    );
    const activePayment = payment?.find(p => p.charterId === id);

    const { data: logs } = useCollection<ActivityLog>(
        useMemoFirebase(() => null, []), 
        `activityLogs`
    );
    const charterLogs = logs?.filter(l => l.charterId === id).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    if (charterLoading) return <div className="p-8 space-y-4"><Skeleton className="h-12 w-1/3"/><Skeleton className="h-64 w-full"/></div>;
    if (!charter) return <div className="p-8 text-center">Charter mission not found.</div>;

    const isLive = ['departed', 'arrived', 'live', 'enroute'].includes(charter.status);

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4 mb-2">
                <Button variant="ghost" size="sm" onClick={() => router.back()} className="text-muted-foreground hover:text-white">
                    <ArrowLeft className="h-4 w-4 mr-2" /> Back
                </Button>
                <div className="h-4 w-px bg-white/10" />
                <span className="text-[10px] uppercase tracking-widest font-black text-muted-foreground">Mission Control</span>
            </div>

            <PageHeader 
                title={`${charter.departure} → ${charter.arrival}`}
                description={`Mission ID: ${charter.id} • Registered to ${charter.customerName}`}
            >
                <Badge variant="outline" className="h-8 px-4 bg-accent/10 border-accent/20 text-accent font-black uppercase tracking-tighter">
                    {charter.status}
                </Badge>
            </PageHeader>

            <StatusTimeline currentStatus={charter.status} />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    {/* LIVE TRACKING AT TOP IF ACTIVE */}
                    {isLive && (
                        <div className="space-y-3 animate-in fade-in slide-in-from-top-4 duration-1000">
                            <div className="flex items-center gap-2 px-1">
                                <Zap className="h-4 w-4 text-accent fill-accent animate-pulse" />
                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-accent">Live Mission Signal Active</span>
                            </div>
                            <LiveTrackingMap 
                                origin={charter.departure} 
                                destination={charter.arrival} 
                            />
                        </div>
                    )}

                    {/* Operational Panel (Controls & Status) */}
                    <OperationalPanel 
                        charter={charter} 
                        userRole={user?.role} 
                    />

                    {/* Secondary Workflow Panels */}
                    <ManifestPanel 
                        charter={charter} 
                        manifest={activeManifest} 
                        userRole={user?.role} 
                    />
                    
                    <InvoicePanel 
                        charter={charter} 
                        invoice={activeInvoice} 
                        userRole={user?.role} 
                    />

                    <PaymentPanel 
                        charter={charter} 
                        invoice={activeInvoice}
                        payment={activePayment} 
                        userRole={user?.role} 
                    />
                </div>

                <div className="space-y-6">
                    {/* Sidebar: Mission Brief & Audit */}
                    <Card className="bg-card">
                        <CardHeader>
                            <CardTitle className="text-sm flex items-center gap-2">
                                <Plane className="h-4 w-4 text-accent" />
                                Mission Brief
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <p className="text-[10px] uppercase text-muted-foreground font-bold">Departure</p>
                                    <p className="text-xs font-medium">{new Date(charter.departureDate).toLocaleDateString()}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] uppercase text-muted-foreground font-bold">Pax Count</p>
                                    <p className="text-xs font-medium">{charter.pax} Passengers</p>
                                </div>
                            </div>
                            <Separator className="bg-white/5" />
                            <div className="space-y-2">
                                <p className="text-[10px] uppercase text-muted-foreground font-bold">Inclusions</p>
                                <p className="text-[11px] leading-relaxed text-muted-foreground italic">
                                    {charter.catering || "Standard institutional catering profile."}
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-card">
                        <CardHeader>
                            <CardTitle className="text-sm flex items-center gap-2">
                                <History className="h-4 w-4 text-primary" />
                                Audit Trail
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="max-h-[400px] overflow-y-auto px-6 pb-6 space-y-4">
                                {charterLogs?.length ? charterLogs.map((log) => (
                                    <div key={log.id} className="relative pl-4 border-l border-white/5 space-y-1">
                                        <div className="absolute left-[-4.5px] top-1 w-2 h-2 rounded-full bg-primary/40" />
                                        <p className="text-[10px] font-bold text-foreground">{log.actionType}</p>
                                        <p className="text-[9px] text-muted-foreground">
                                            {log.performedBy} ({log.role}) • {new Date(log.timestamp).toLocaleTimeString()}
                                        </p>
                                    </div>
                                )) : (
                                    <p className="text-[10px] text-muted-foreground text-center py-4">No logged activity found.</p>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}