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
        case 'Pending Approval': return 'destructive';
        case 'Approved': return 'default';
        case 'Suspended': return 'secondary';
        default: return 'outline';
    }
}

export default function OperatorManagementPage() {
    const firestore = useFirestore();
    const { toast } = useToast();
    
    const { data: operators, isLoading } = useCollection<Operator>(
        useMemoFirebase(() => firestore ? collection(firestore, 'operators') : null, [firestore]), 
        'operators'
    );

    const handleUpdateStatus = (operatorId: string, status: Operator['status']) => {
        // The non-blocking update function is already wired to the mock store for demo mode.
        // It just needs a mock reference with a `path` property.
        const mockOperatorDocRef = { path: `operators/${operatorId}` } as any;
        updateDocumentNonBlocking(mockOperatorDocRef, { status });
    };

    return (
        <>
            <PageHeader title="Operator Management" description="Approve, reject, and manage all NSOP operators on the platform." />
            <Card className="bg-background">
                <CardHeader>
                    <CardTitle>All Operators</CardTitle>
                    <CardDescription>
                        A list of all NSOP operators on the platform.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {isLoading ? <Skeleton className="h-64 w-full" /> : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Company Name</TableHead>
                                    <TableHead>Contact Person</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead>NSOP License</TableHead>
                                    <TableHead>Registered On</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>
                                        <span className="sr-only">Actions</span>
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {operators?.map((op: Operator) => (
                                    <TableRow key={op.id}>
                                        <TableCell className="font-medium">{op.companyName}</TableCell>
                                        <TableCell>{op.contactPersonName}</TableCell>
                                        <TableCell>{op.contactEmail}</TableCell>
                                        <TableCell className="font-code">{op.nsopLicenseNumber}</TableCell>
                                        <TableCell>{new Date(op.createdAt).toLocaleDateString()}</TableCell>
                                        <TableCell>
                                            <Badge variant={getStatusVariant(op.status)}>{op.status}</Badge>
                                        </TableCell>
                                        <TableCell>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button aria-haspopup="true" size="icon" variant="ghost">
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
                                                     {op.status === 'Suspended' && (
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
                    )}
                </CardContent>
            </Card>
        </>
    );
}
