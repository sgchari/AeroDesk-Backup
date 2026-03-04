
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
        if (!firestore || (firestore as any)._isMock) return null;
        return query(collection(firestore, 'auditTrails'), orderBy('timestamp', 'desc'));
    }, [firestore]);
    const { data: auditLogs, isLoading } = useCollection<AuditLog>(auditLogsQuery, 'auditTrails');

    return (
        <>
            <PageHeader title="Platform Audit Trail" description="A complete, immutable log of all actions performed across the platform for forensic review.">
                <Button variant="outline" className="h-9 text-[10px] font-bold uppercase tracking-widest gap-2">
                    <Download className="h-3.5 w-3.5" /> Export Audit
                </Button>
            </PageHeader>
            <Card className="bg-card">
                <CardHeader>
                    <CardTitle>All Logged Events</CardTitle>
                    <CardDescription>
                        Search and filter through all recorded events for governance and compliance review.
                    </CardDescription>
                </CardHeader>
                <CardContent className="px-0 sm:px-6">
                    {isLoading ? <div className="p-6"><Skeleton className="h-64 w-full" /></div> : (
                        <div className="w-full overflow-x-auto">
                            <Table className="min-w-[900px]">
                                <TableHeader>
                                    <TableRow className="border-white/5">
                                        <TableHead className="text-[10px] uppercase font-black">Timestamp</TableHead>
                                        <TableHead className="text-[10px] uppercase font-black">Actor / Role</TableHead>
                                        <TableHead className="text-[10px] uppercase font-black">Action Type</TableHead>
                                        <TableHead className="text-[10px] uppercase font-black">Entity Affected</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                {auditLogs?.map((log: AuditLog) => (
                                    <TableRow key={log.id} className="border-white/5 hover:bg-white/[0.02]">
                                        <TableCell className="text-[10px] py-4">{new Date(log.timestamp).toLocaleString()}</TableCell>
                                        <TableCell>
                                            <div className="font-bold text-xs">{log.user}</div>
                                            <Badge variant="secondary" className="mt-1 text-[8px] h-4 uppercase font-black">{log.role}</Badge>
                                        </TableCell>
                                        <TableCell className="font-bold text-xs uppercase tracking-tighter text-accent">{log.action}</TableCell>
                                        <TableCell>
                                            <div className="text-[10px] text-muted-foreground">{log.details}</div>
                                            <div className="font-code text-[9px] uppercase tracking-tighter text-primary">{log.targetId}</div>
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
