
'use client';

import { PageHeader } from "@/components/dashboard/shared/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useCollection, useFirestore, updateDocumentNonBlocking, useMemoFirebase } from "@/firebase";
import { useToast } from "@/hooks/use-toast";
import { Operator } from "@/lib/types";
import { collection, doc } from "firebase/firestore";
import { MoreHorizontal } from "lucide-react";

const getStatusVariant = (status: Operator['status']) => {
    switch (status) {
        case 'Pending Approval': return 'warning';
        case 'Approved': return 'success';
        case 'Suspended': return 'destructive';
        case 'Rejected': return 'destructive';
        default: return 'outline';
    }
}

export default function OperatorManagementPage() {
    const firestore = useFirestore();
    const { toast } = useToast();
    
    const operatorsQuery = useMemoFirebase(() => {
        if (!firestore || (firestore as any)._isMock) return null;
        return collection(firestore, 'operators');
    }, [firestore]);
    
    const { data: operators, isLoading } = useCollection<Operator>(operatorsQuery, 'operators');

    const handleUpdateStatus = (operatorId: string, status: Operator['status']) => {
        if (!firestore) return;
        
        const docRef = (firestore as any)._isMock
            ? { path: `operators/${operatorId}` } as any
            : doc(firestore, 'operators', operatorId);

        updateDocumentNonBlocking(docRef, { status });
        toast({
            title: "Operator Updated",
            description: `Status changed to ${status}.`
        });
    };

    return (
        <>
            <PageHeader title="Operator Governance" description="Approve, reject, and manage all NSOP operators on the platform." />
            <Card className="bg-card">
                <CardHeader>
                    <CardTitle>All Operators</CardTitle>
                    <CardDescription>
                        A list of all NSOP operators on the platform.
                    </CardDescription>
                </CardHeader>
                <CardContent className="px-0 sm:px-6">
                    {isLoading ? <div className="p-6"><Skeleton className="h-64 w-full" /></div> : (
                        <div className="w-full overflow-x-auto">
                            <Table className="min-w-[900px]">
                                <TableHeader>
                                    <TableRow className="border-white/5">
                                        <TableHead className="text-[10px] uppercase font-black">Company Name</TableHead>
                                        <TableHead className="text-[10px] uppercase font-black">Contact Person</TableHead>
                                        <TableHead className="text-[10px] uppercase font-black">Email</TableHead>
                                        <TableHead className="text-[10px] uppercase font-black">NSOP License</TableHead>
                                        <TableHead className="text-[10px] uppercase font-black">Registered On</TableHead>
                                        <TableHead className="text-[10px] uppercase font-black">Status</TableHead>
                                        <TableHead className="text-right">
                                            <span className="sr-only">Actions</span>
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {operators?.map((op: Operator) => (
                                        <TableRow key={op.id} className="border-white/5 hover:bg-white/[0.02]">
                                            <TableCell className="font-bold py-4">{op.companyName}</TableCell>
                                            <TableCell className="text-xs">{op.contactPersonName}</TableCell>
                                            <TableCell className="text-xs text-muted-foreground">{op.contactEmail}</TableCell>
                                            <TableCell className="font-code text-xs text-accent">{op.nsopLicenseNumber}</TableCell>
                                            <TableCell className="text-xs">{op.createdAt ? new Date(op.createdAt).toLocaleDateString() : 'N/A'}</TableCell>
                                            <TableCell>
                                                <Badge variant={getStatusVariant(op.status)} className="text-[9px] uppercase h-5">
                                                    {op.status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button aria-haspopup="true" size="icon" variant="ghost" className="h-8 w-8">
                                                            <MoreHorizontal className="h-4 w-4" />
                                                            <span className="sr-only">Toggle menu</span>
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                        {op.status === 'Pending Approval' && (
                                                            <>
                                                                <DropdownMenuItem onClick={() => handleUpdateStatus(op.id, 'Approved')}>
                                                                    Approve
                                                                </DropdownMenuItem>
                                                                <DropdownMenuItem onClick={() => handleUpdateStatus(op.id, 'Rejected')}>
                                                                    Reject
                                                                </DropdownMenuItem>
                                                            </>
                                                        )}
                                                        {op.status === 'Approved' && (
                                                            <DropdownMenuItem onClick={() => handleUpdateStatus(op.id, 'Suspended')}>
                                                                Suspend
                                                            </DropdownMenuItem>
                                                        )}
                                                        {(op.status === 'Suspended' || op.status === 'Rejected') && (
                                                            <DropdownMenuItem onClick={() => handleUpdateStatus(op.id, 'Approved')}>
                                                                Re-approve
                                                            </DropdownMenuItem>
                                                        )}
                                                        <DropdownMenuItem disabled>View Compliance Docs</DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </CardContent>
            </Card>
        </>
    );
}
