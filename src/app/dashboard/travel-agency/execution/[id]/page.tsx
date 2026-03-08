'use client';

import React, { useMemo } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
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
    ArrowLeft,
    Coins,
    Hotel,
    ShieldCheck,
    Zap
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { CharterRFQ, EmptyLegSeatAllocationRequest, AccommodationRequest, PassengerManifest, Invoice, Payment, ActivityLog, Commission } from '@/lib/types';
import { ManifestPanel } from '@/components/dashboard/charter/manifest-panel';
import { InvoicePanel } from '@/components/dashboard/charter/invoice-panel';
import { PaymentPanel } from '@/components/dashboard/charter/payment-panel';
import { OperationalPanel } from '@/components/dashboard/charter/operational-panel';
import { StatusTimeline } from '@/components/dashboard/charter/status-timeline';
import { LiveTrackingMap } from '@/components/dashboard/charter/live-tracking-map';

export default function AgencyExecutionPage() {
    const { id } = useParams();
    const router = useRouter();
    const searchParams = useSearchParams();
    const type = searchParams.get('type') || 'charter';
    const { user } = useUser();
    const firestore = useFirestore();

    // Data fetching based on type
    const collectionName = type === 'charter' ? 'charterRequests' : type === 'seat' ? 'seatAllocationRequests' : 'accommodationRequests';
    
    const { data: entity, isLoading: entityLoading } = useDoc<any>(
        useMemoFirebase(() => null, []), 
        `${collectionName}/${id}`
    );

    const { data: manifest } = useCollection<PassengerManifest>(null, 'passengerManifests');
    const activeManifest = manifest?.find(m => m.charterId === id);

    const { data: invoices } = useCollection<Invoice>(null, 'invoices');
    const activeInvoice = invoices?.find(i => i.relatedEntityId === id);

    const { data: payments } = useCollection<Payment>(null, 'payments');
    const activePayment = payments?.find(p => p.relatedEntityId === id);

    const { data: logs } = useCollection<ActivityLog>(null, 'activityLogs');
    const entityLogs = logs?.filter(l => l.entityId === id).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    const { data: commissions } = useCollection<Commission>(null, 'commissions');
    const activeCommission = commissions?.find(c => c.relatedEntityId === id);

    if (entityLoading) return <div className="p-8 space-y-4"><Skeleton className="h-12 w-1/3"/><Skeleton className="h-64 w-full"/></div>;
    if (!entity) return <div className="p-8 text-center">Coordination record not found.</div>;

    const getTitle = () => {
        if (type === 'charter') return `${entity.departure} → ${entity.arrival}`;
        if (type === 'seat') return `Seat Block: ${entity.emptyLegId}`;
        return `Stay: ${entity.propertyName || 'Property TBD'}`;
    };

    const isLive = type === 'charter' && ['departed', 'arrived', 'live', 'enroute'].includes(entity.status);

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4 mb-2">
                <Button variant="ghost" size="sm" onClick={() => router.back()} className="text-muted-foreground hover:text-white">
                    <ArrowLeft className="h-4 w-4 mr-2" /> Back to Queue
                </Button>
                <div className="h-4 w-px bg-white/10" />
                <span className="text-[10px] uppercase tracking-widest font-black text-muted-foreground">Commercial Execution Workspace</span>
            </div>

            <PageHeader 
                title={getTitle()}
                description={`Commercial ID: ${entity.id} • Managed for ${entity.customerName || entity.clientReference || 'Institutional Client'}`}
            >
                <div className="flex items-center gap-2">
                    {activeCommission && (
                        <Badge variant="outline" className="h-8 border-accent/20 bg-accent/5 text-accent font-bold px-3">
                            Commission: {activeCommission.status}
                        </Badge>
                    )}
                    <Badge variant="outline" className="h-8 px-4 bg-primary/10 border-primary/20 text-primary font-black uppercase tracking-tighter">
                        {entity.status}
                    </Badge>
                </div>
            </PageHeader>

            <StatusTimeline currentStatus={entity.status} />

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
                                origin={entity.departure} 
                                destination={entity.arrival} 
                            />
                        </div>
                    )}

                    {/* Operational Panel (Controls & Status) */}
                    {type === 'charter' && (
                        <OperationalPanel 
                            charter={entity} 
                            userRole={user?.role} 
                        />
                    )}

                    {/* Multi-Service Panels */}
                    {type === 'charter' && (
                        <ManifestPanel 
                            charter={entity} 
                            manifest={activeManifest} 
                            userRole={user?.role} 
                        />
                    )}
                    
                    <InvoicePanel 
                        charter={entity} 
                        invoice={activeInvoice} 
                        userRole={user?.role} 
                    />

                    <PaymentPanel 
                        charter={entity} 
                        invoice={activeInvoice}
                        payment={activePayment} 
                        userRole={user?.role} 
                    />

                    {/* Commission Visibility for Agencies */}
                    {activeCommission && (
                        <Card className="bg-accent/5 border-accent/20">
                            <CardHeader>
                                <CardTitle className="text-base flex items-center gap-2">
                                    <Coins className="h-4 w-4 text-accent" />
                                    Agency Commission Details
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="p-3 rounded-lg bg-black/20 border border-white/5 space-y-1">
                                        <p className="text-[8px] uppercase text-muted-foreground font-black">Settlement Amount</p>
                                        <p className="text-lg font-black text-accent">₹ {activeCommission.commissionAmount.toLocaleString()}</p>
                                    </div>
                                    <div className="p-3 rounded-lg bg-black/20 border border-white/5 space-y-1">
                                        <p className="text-[8px] uppercase text-muted-foreground font-black">Agreed Rate</p>
                                        <p className="text-sm font-bold text-foreground">{(activeCommission.commissionRate * 100).toFixed(1)}%</p>
                                    </div>
                                    <div className="p-3 rounded-lg bg-black/20 border border-white/5 space-y-1">
                                        <p className="text-[8px] uppercase text-muted-foreground font-black">Payment Status</p>
                                        <p className="text-sm font-bold text-foreground uppercase tracking-widest">{activeCommission.status}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>

                <div className="space-y-6">
                    {/* Sidebar Context */}
                    <Card className="bg-card">
                        <CardHeader>
                            <CardTitle className="text-sm flex items-center gap-2">
                                <ShieldCheck className="h-4 w-4 text-accent" />
                                Commercial Brief
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4 text-xs">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground uppercase font-bold text-[9px]">Total Volume</span>
                                <span className="font-bold">₹ {entity.totalAmount?.toLocaleString() || 'TBD'}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground uppercase font-bold text-[9px]">Execution ID</span>
                                <span className="font-code">{entity.id}</span>
                            </div>
                            <Separator className="bg-white/5" />
                            <div className="space-y-2">
                                <p className="text-[9px] uppercase text-muted-foreground font-bold">Coordination Notes</p>
                                <p className="italic text-muted-foreground leading-relaxed">
                                    {entity.specialRequirements || "Standard institutional profile active."}
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-card">
                        <CardHeader>
                            <CardTitle className="text-sm flex items-center gap-2">
                                <History className="h-4 w-4 text-primary" />
                                Activity Audit
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
                                    <p className="text-[10px] text-muted-foreground text-center py-4">Standing by for operational signals.</p>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}