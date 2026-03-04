
'use client';

import { PageHeader } from "@/components/dashboard/shared/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useCollection, useFirestore, useMemoFirebase, updateDocumentNonBlocking } from "@/firebase";
import { collection, query, where, doc } from "firebase/firestore";
import { Skeleton } from "@/components/ui/skeleton";
import { Check, X, ExternalLink, ShieldCheck, Clock, Building } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@/hooks/use-user";
import type { User } from "@/lib/types";

export default function GSTVerificationPage() {
    const firestore = useFirestore();
    const { toast } = useToast();
    const { user: currentUser } = useUser();

    // Fetch all entities with pending GST status
    const operatorsQuery = useMemoFirebase(() => {
        if (!firestore || (firestore as any)._isMock) return null;
        return query(collection(firestore, 'operators'), where('gstVerificationStatus', '==', 'pending'));
    }, [firestore]);

    const distributorsQuery = useMemoFirebase(() => {
        if (!firestore || (firestore as any)._isMock) return null;
        return query(collection(firestore, 'distributors'), where('gstVerificationStatus', '==', 'pending'));
    }, [firestore]);

    const { data: pendingOperators, isLoading: opsLoading } = useCollection<User>(operatorsQuery, 'operators');
    const { data: pendingDistributors, isLoading: distLoading } = useCollection<User>(distributorsQuery, 'distributors');

    const handleVerify = (entityId: string, entityType: string, approved: boolean) => {
        if (!firestore || !currentUser) return;

        const collectionName = entityType === 'Operator' ? 'operators' : 'distributors';
        
        const docRef = (firestore as any)._isMock
            ? { path: `${collectionName}/${entityId}` } as any
            : doc(firestore, collectionName, entityId);

        updateDocumentNonBlocking(docRef, {
            gstVerificationStatus: approved ? 'verified' : 'rejected',
            gstVerifiedBy: currentUser.id,
            gstVerifiedAt: new Date().toISOString()
        });

        toast({
            title: approved ? "GST Profile Verified" : "GST Profile Rejected",
            description: `Entity ${entityId} status has been updated in the institutional registry.`,
        });
    };

    const isLoading = opsLoading || distLoading;
    const allPending = [...(pendingOperators || []), ...(pendingDistributors || [])];

    return (
        <div className="space-y-6">
            <PageHeader 
                title="Institutional GST Verification" 
                description="Review and validate tax profiles for platform participants to ensure B2B compliance."
            />

            <Card className="bg-card border-l-4 border-l-accent">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle>Verification Queue</CardTitle>
                            <CardDescription>Entities awaiting GSTIN and Certificate validation.</CardDescription>
                        </div>
                        <Badge variant="outline" className="bg-accent/10 border-accent/20 text-accent font-black text-[9px] uppercase tracking-widest">
                            {allPending.length} Pending
                        </Badge>
                    </div>
                </CardHeader>
                <CardContent>
                    {isLoading ? <Skeleton className="h-64 w-full" /> : (
                        <Table>
                            <TableHeader>
                                <TableRow className="border-white/5">
                                    <TableHead className="text-[10px] uppercase font-black">Legal Entity</TableHead>
                                    <TableHead className="text-[10px] uppercase font-black">GSTIN & State</TableHead>
                                    <TableHead className="text-[10px] uppercase font-black">Registered Address</TableHead>
                                    <TableHead className="text-[10px] uppercase font-black">Documentation</TableHead>
                                    <TableHead className="text-right text-[10px] uppercase font-black">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {allPending.map((entity) => (
                                    <TableRow key={entity.id} className="border-white/5 hover:bg-white/[0.02] group">
                                        <TableCell className="py-4">
                                            <div className="font-bold text-sm text-foreground">{entity.legalEntityName || entity.companyName}</div>
                                            <Badge variant="outline" className="text-[8px] h-4 mt-1 opacity-60 uppercase">{entity.role}</Badge>
                                        </TableCell>
                                        <TableCell>
                                            <div className="space-y-1">
                                                <p className="font-code text-xs font-bold text-accent">{entity.gstin}</p>
                                                <p className="text-[10px] text-muted-foreground uppercase">State Code: {entity.stateCode}</p>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <p className="text-xs text-muted-foreground max-w-[200px] truncate">{entity.gstRegisteredAddress}</p>
                                        </TableCell>
                                        <TableCell>
                                            <Button variant="ghost" size="sm" className="h-8 text-[9px] font-black uppercase tracking-widest gap-2">
                                                <ExternalLink className="h-3 w-3" /> View Certificate
                                            </Button>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button size="icon" variant="ghost" className="h-8 w-8 text-green-500 hover:text-green-500 hover:bg-green-500/10" onClick={() => handleVerify(entity.id, entity.role!, true)}>
                                                    <Check className="h-4 w-4" />
                                                </Button>
                                                <Button size="icon" variant="ghost" className="h-8 w-8 text-red-500 hover:text-red-500 hover:bg-red-500/10" onClick={() => handleVerify(entity.id, entity.role!, false)}>
                                                    <X className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                    {(!isLoading && allPending.length === 0) && (
                        <div className="text-center py-20 border-2 border-dashed rounded-lg bg-muted/5 opacity-60">
                            <ShieldCheck className="mx-auto h-12 w-12 text-muted-foreground/20 mb-4" />
                            <p className="text-xs text-muted-foreground uppercase font-black tracking-[0.2em]">Queue Clear</p>
                            <p className="text-[10px] text-muted-foreground mt-1">No entities require tax profile verification.</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
