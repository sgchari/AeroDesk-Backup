
'use client';

import { PageHeader } from "@/components/dashboard/shared/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useCollection, useFirestore, useMemoFirebase, updateDocumentNonBlocking } from "@/firebase";
import { useToast } from "@/hooks/use-toast";
import { EmptyLeg, Operator } from "@/lib/types";
import { collection, doc, query, where } from "firebase/firestore";
import { Check, X } from "lucide-react";

export default function PlatformApprovalsPage() {
    const firestore = useFirestore();
    const { toast } = useToast();

    const pendingOperatorsQuery = useMemoFirebase(() => {
        if (!firestore) return null;
        return query(collection(firestore, 'operators'), where('status', '==', 'Pending Approval'));
    }, [firestore]);
    const { data: pendingOperators, isLoading: operatorsLoading } = useCollection<Operator>(pendingOperatorsQuery, 'operators');
    
    const pendingEmptyLegsQuery = useMemoFirebase(() => {
        if (!firestore) return null;
        return query(collection(firestore, 'emptyLegs'), where('status', '==', 'Pending Approval'));
    }, [firestore]);
    const { data: pendingEmptyLegs, isLoading: emptyLegsLoading } = useCollection<EmptyLeg>(pendingEmptyLegsQuery, 'emptyLegs');

    const handleUpdateStatus = (collectionName: string, docId: string, status: string, entityName: string) => {
        const mockDocRef = { path: `${collectionName}/${docId}` } as any;
        updateDocumentNonBlocking(mockDocRef, { status });
        toast({
            title: `${entityName} Status Updated`,
            description: `The ${entityName.toLowerCase()} has been ${status.toLowerCase()}.`
        });
    };

    return (
        <>
            <PageHeader title="Approvals & Compliance Queue" description="Review and approve pending operators, empty legs, and other platform entities." />
            
            <div className="grid gap-6 lg:grid-cols-2">
                <Card className="bg-card">
                    <CardHeader>
                        <CardTitle>Pending Operator Verifications</CardTitle>
                        <CardDescription>
                            New operators awaiting verification and approval to join the platform.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {operatorsLoading ? <Skeleton className="h-48 w-full" /> : (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Operator</TableHead>
                                        <TableHead>License</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {pendingOperators?.map((op) => (
                                        <TableRow key={op.id}>
                                            <TableCell>
                                                <div className="font-medium">{op.companyName}</div>
                                                <div className="text-xs text-muted-foreground">{op.contactEmail}</div>
                                            </TableCell>
                                            <TableCell className="font-code text-xs">{op.nsopLicenseNumber}</TableCell>
                                            <TableCell className="text-right">
                                                <Button size="icon" variant="ghost" className="h-8 w-8 text-green-500 hover:text-green-500 hover:bg-green-500/10" onClick={() => handleUpdateStatus('operators', op.id, 'Approved', 'Operator')}>
                                                    <Check className="h-4 w-4" />
                                                </Button>
                                                <Button size="icon" variant="ghost" className="h-8 w-8 text-red-500 hover:text-red-500 hover:bg-red-500/10" onClick={() => handleUpdateStatus('operators', op.id, 'Rejected', 'Operator')}>
                                                    <X className="h-4 w-4" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        )}
                        {(!operatorsLoading && (!pendingOperators || pendingOperators.length === 0)) && (
                            <p className="text-sm text-muted-foreground py-8 text-center">No operators pending approval.</p>
                        )}
                    </CardContent>
                </Card>

                <Card className="bg-card">
                    <CardHeader>
                        <CardTitle>Pending Empty Leg Approvals</CardTitle>
                        <CardDescription>
                           Empty leg flights submitted by operators that require admin review before publication.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                         {emptyLegsLoading ? <Skeleton className="h-48 w-full" /> : (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Route</TableHead>
                                        <TableHead>Date</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {pendingEmptyLegs?.map((leg) => (
                                        <TableRow key={leg.id}>
                                            <TableCell>
                                                <div className="font-medium">{leg.departure} to {leg.arrival}</div>
                                                <div className="text-xs text-muted-foreground font-code">{leg.id}</div>
                                            </TableCell>
                                            <TableCell>{new Date(leg.departureTime).toLocaleDateString()}</TableCell>
                                            <TableCell className="text-right">
                                                <Button size="icon" variant="ghost" className="h-8 w-8 text-green-500 hover:text-green-500 hover:bg-green-500/10" onClick={() => handleUpdateStatus('emptyLegs', leg.id, 'Approved', 'Empty Leg')}>
                                                    <Check className="h-4 w-4" />
                                                </Button>
                                                <Button size="icon" variant="ghost" className="h-8 w-8 text-red-500 hover:text-red-500 hover:bg-red-500/10" onClick={() => handleUpdateStatus('emptyLegs', leg.id, 'Rejected', 'Empty Leg')}>
                                                    <X className="h-4 w-4" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                         )}
                         {(!emptyLegsLoading && (!pendingEmptyLegs || pendingEmptyLegs.length === 0)) && (
                            <p className="text-sm text-muted-foreground py-8 text-center">No empty legs pending approval.</p>
                        )}
                    </CardContent>
                </Card>
            </div>
        </>
    );
}
