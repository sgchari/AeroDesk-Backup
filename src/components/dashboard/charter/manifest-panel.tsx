'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Users, UserPlus, Trash2, ShieldCheck, AlertCircle } from 'lucide-react';
import { useFirestore, addDocumentNonBlocking, updateDocumentNonBlocking } from '@/firebase';
import { useToast } from '@/hooks/use-toast';
import type { CharterRFQ, PassengerManifest, Passenger } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export function ManifestPanel({ charter, manifest, userRole }: { charter: CharterRFQ, manifest?: PassengerManifest, userRole?: string }) {
    const firestore = useFirestore();
    const { toast } = useToast();
    
    // State initialization with prop sync
    const [passengers, setPassengers] = useState<Passenger[]>(
        manifest?.passengers || [{ fullName: '', dob: '', gender: '', nationality: '', idType: 'Passport', idNumber: '' }]
    );

    // Sync state when manifest prop updates (crucial for async data loading)
    useEffect(() => {
        if (manifest?.passengers) {
            setPassengers(manifest.passengers);
        }
    }, [manifest]);

    const isCustomer = userRole === 'Customer' || userRole === 'Requester';
    const isOperator = userRole === 'Operator';
    
    // Manifest is immutable once mission is confirmed/live
    const isLocked = ['manifestApproved', 'charterConfirmed', 'boarding', 'departed', 'live', 'enroute', 'arrived', 'flightCompleted'].includes(charter.status);
    
    const canEdit = isCustomer && !isLocked && (charter.status === 'awaitingManifest' || !manifest);
    const needsReview = isOperator && charter.status === 'manifestSubmitted';

    const handleAddPassenger = () => {
        if (passengers.length >= charter.pax) {
            toast({ title: "Limit Reached", description: `This charter is limited to ${charter.pax} passengers.`, variant: "destructive" });
            return;
        }
        setPassengers([...passengers, { fullName: '', dob: '', gender: '', nationality: '', idType: 'Passport', idNumber: '' }]);
    };

    const handleRemovePassenger = (index: number) => {
        setPassengers(passengers.filter((_, i) => i !== index));
    };

    const updatePassenger = (index: number, field: keyof Passenger, value: string) => {
        const newPassengers = [...passengers];
        newPassengers[index] = { ...newPassengers[index], [field]: value };
        setPassengers(newPassengers);
    };

    const handleSubmit = () => {
        if (!firestore) return;
        
        const manifestData = {
            charterId: charter.id,
            submittedBy: charter.customerName,
            passengers,
            status: 'submitted',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        if (manifest) {
            updateDocumentNonBlocking({ path: `passengerManifests/${manifest.id}` } as any, manifestData);
        } else {
            addDocumentNonBlocking({ path: 'passengerManifests' } as any, manifestData);
        }

        updateDocumentNonBlocking({ path: `charterRequests/${charter.id}` } as any, { status: 'manifestSubmitted' });
        
        // Log activity
        addDocumentNonBlocking({ path: 'activityLogs' } as any, {
            charterId: charter.id,
            actionType: 'MANIFEST_SUBMITTED',
            performedBy: charter.customerName,
            role: userRole,
            previousStatus: charter.status,
            newStatus: 'manifestSubmitted',
            timestamp: new Date().toISOString()
        });

        toast({ title: "Manifest Submitted", description: "The operator has been notified for compliance review." });
    };

    const handleReview = (approved: boolean) => {
        if (!firestore || !manifest) return;

        const newStatus = approved ? 'manifestApproved' : 'awaitingManifest';
        updateDocumentNonBlocking({ path: `charterRequests/${charter.id}` } as any, { status: newStatus });
        updateDocumentNonBlocking({ path: `passengerManifests/${manifest.id}` } as any, { status: approved ? 'approved' : 'revisionRequested' });

        addDocumentNonBlocking({ path: 'activityLogs' } as any, {
            charterId: charter.id,
            actionType: approved ? 'MANIFEST_APPROVED' : 'MANIFEST_REVISION_REQUESTED',
            performedBy: 'Operator Admin',
            role: 'Operator',
            previousStatus: 'manifestSubmitted',
            newStatus: newStatus,
            timestamp: new Date().toISOString()
        });

        toast({ title: approved ? "Manifest Approved" : "Revision Requested", description: approved ? "Pro-forma invoice can now be issued." : "Customer notified for correction." });
    };

    return (
        <Card className={cn("bg-card border-l-4", isLocked ? "border-l-green-500" : "border-l-accent")}>
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle className="text-base flex items-center gap-2">
                        <Users className="h-4 w-4 text-accent" />
                        Passenger Manifest
                    </CardTitle>
                    <CardDescription>Security and immigration details for institutional compliance.</CardDescription>
                </div>
                {manifest && (
                    <Badge variant={manifest.status === 'approved' ? 'success' : 'warning'} className="uppercase text-[9px] font-black">
                        {manifest.status}
                    </Badge>
                )}
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="space-y-4">
                    {passengers.map((p, idx) => (
                        <div key={idx} className="p-4 rounded-lg bg-muted/20 border border-white/5 space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest">Passenger {idx + 1}</span>
                                {canEdit && passengers.length > 1 && (
                                    <Button variant="ghost" size="icon" className="h-6 w-6 text-destructive" onClick={() => handleRemovePassenger(idx)}>
                                        <Trash2 className="h-3 w-3" />
                                    </Button>
                                )}
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="space-y-1">
                                    <Label className="text-[10px]">Full Name</Label>
                                    <Input value={p.fullName} onChange={(e) => updatePassenger(idx, 'fullName', e.target.value)} disabled={!canEdit} className="h-8 text-xs bg-muted/10" />
                                </div>
                                <div className="space-y-1">
                                    <Label className="text-[10px]">Nationality</Label>
                                    <Input value={p.nationality} onChange={(e) => updatePassenger(idx, 'nationality', e.target.value)} disabled={!canEdit} className="h-8 text-xs bg-muted/10" />
                                </div>
                                <div className="space-y-1">
                                    <Label className="text-[10px]">ID / Passport Number</Label>
                                    <Input value={p.idNumber} onChange={(e) => updatePassenger(idx, 'idNumber', e.target.value)} disabled={!canEdit} className="h-8 text-xs bg-muted/10 font-code" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {canEdit && (
                    <div className="flex justify-between items-center pt-4 border-t border-white/5">
                        <Button variant="outline" size="sm" onClick={handleAddPassenger} className="text-[10px] uppercase font-bold h-8">
                            <UserPlus className="h-3 w-3 mr-2" /> Add Passenger
                        </Button>
                        <Button size="sm" onClick={handleSubmit} className="bg-accent text-accent-foreground h-8 text-[10px] font-black uppercase tracking-widest">
                            Submit Manifest
                        </Button>
                    </div>
                )}

                {needsReview && (
                    <div className="flex gap-2 pt-4 border-t border-white/5">
                        <Button variant="destructive" size="sm" className="flex-1 text-[10px] font-bold uppercase" onClick={() => handleReview(false)}>
                            Request Revision
                        </Button>
                        <Button size="sm" className="flex-1 bg-green-600 text-white hover:bg-green-700 text-[10px] font-black uppercase" onClick={() => handleReview(true)}>
                            Approve Manifest
                        </Button>
                    </div>
                )}

                {isLocked && (
                    <div className="p-3 bg-emerald-500/5 border border-emerald-500/20 rounded-lg flex items-start gap-3">
                        <ShieldCheck className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                        <p className="text-[10px] text-muted-foreground italic">
                            This manifest has been locked for operational dispatch. Changes are restricted.
                        </p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
