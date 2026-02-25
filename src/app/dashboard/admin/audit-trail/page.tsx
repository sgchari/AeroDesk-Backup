
'use client';
import { PageHeader } from "@/components/dashboard/shared/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { AuditLog } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { useCollection, useFirestore, useMemoFirebase } from "@/firebase";
import { collection, query, orderBy } from "firebase/firestore";
import { Skeleton } from "@/components/ui/skeleton";

export default function AuditTrailPage() {
    const firestore = useFirestore();
    const auditLogsQuery = useMemoFirebase(() => {
        if (!firestore) return null;
        return query(collection(firestore, 'auditTrails'), orderBy('timestamp', 'desc'));
    }, [firestore]);
    const { data: auditLogs, isLoading } = useCollection<AuditLog>(auditLogsQuery, 'auditTrails');

    return (
        <>
            <PageHeader title="Platform Audit Trail" description="A complete, immutable log of all actions performed across the platform for forensic review.">
                <Button variant="outline">
                    <Download className="mr-2 h-4 w-4" />
                    Export as CSV
                </Button>
            </PageHeader>
            <Card className="bg-card">
                <CardHeader>
                    <CardTitle>All Logged Events</CardTitle>
                    <CardDescription>
                        Search and filter through all recorded events for governance and compliance review.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {isLoading ? <Skeleton className="h-64 w-full" /> : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Timestamp</TableHead>
                                    <TableHead>Actor / Role</TableHead>
                                    <TableHead>Action Type</TableHead>
                                    <TableHead>Entity Affected</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                            {auditLogs?.map((log: AuditLog) => (
                                <TableRow key={log.id}>
                                    <TableCell className="text-xs">{new Date(log.timestamp).toLocaleString()}</TableCell>
                                    <TableCell>
                                        <div className="font-medium">{log.user}</div>
                                        <Badge variant="secondary" className="mt-1">{log.role}</Badge>
                                    </TableCell>
                                    <TableCell className="font-medium">{log.action}</TableCell>
                                    <TableCell>
                                        <div className="text-xs text-muted-foreground">{log.details}</div>
                                        <div className="font-code text-xs">{log.targetId}</div>
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
