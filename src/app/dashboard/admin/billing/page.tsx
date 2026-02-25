
'use client';

import { PageHeader } from "@/components/dashboard/shared/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { useCollection, useFirestore, useMemoFirebase } from "@/firebase";
import { BillingRecord } from "@/lib/types";
import { collection, query, orderBy } from "firebase/firestore";
import { Skeleton } from "@/components/ui/skeleton";

const getStatusVariant = (status: BillingRecord['status']) => {
    switch (status) {
        case 'Paid': return 'success';
        case 'Pending': return 'secondary';
        case 'Overdue': return 'destructive';
        default: return 'outline';
    }
}

export default function BillingPage() {
    const firestore = useFirestore();
    const billingRecordsQuery = useMemoFirebase(() => {
        if (!firestore) return null;
        return query(collection(firestore, 'billingRecords'), orderBy('date', 'desc'));
    }, [firestore]);
    const { data: billingRecords, isLoading } = useCollection<BillingRecord>(billingRecordsQuery, 'billingRecords');
    
    return (
        <>
            <PageHeader title="Billing & Financial Governance" description="View platform subscription fees, participation records, and financial events.">
                <Button variant="outline">
                    <Download className="mr-2 h-4 w-4" />
                    Export Report
                </Button>
            </PageHeader>
            <Card className="bg-card">
                <CardHeader>
                    <CardTitle>All Billing Records</CardTitle>
                    <CardDescription>
                        A log of all financial transactions and subscriptions on the platform.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {isLoading ? <Skeleton className="h-64 w-full" /> : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Record ID</TableHead>
                                    <TableHead>Entity</TableHead>
                                    <TableHead>Event Type</TableHead>
                                    <TableHead>Amount</TableHead>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {billingRecords?.map((record) => (
                                    <TableRow key={record.id}>
                                        <TableCell className="font-medium font-code">{record.id}</TableCell>
                                        <TableCell>{record.entityName}</TableCell>
                                        <TableCell>{record.eventType}</TableCell>
                                        <TableCell>{new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(record.amount)}</TableCell>
                                        <TableCell>{new Date(record.date).toLocaleDateString()}</TableCell>
                                        <TableCell>
                                            <Badge variant={getStatusVariant(record.status)}>{record.status}</Badge>
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
