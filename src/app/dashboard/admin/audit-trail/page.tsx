import { PageHeader } from "@/components/dashboard/shared/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { getMockDataForRole } from "@/lib/data";
import { AuditLog } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { SummarizeLogButton } from "@/components/dashboard/admin/summarize-log-button";

export default function AuditTrailPage() {
    const { auditLogs } = getMockDataForRole('Admin');
    const fullLogText = auditLogs.map(log => JSON.stringify(log)).join('\n');

    return (
        <>
            <PageHeader title="Platform Audit Trail" description="A complete, immutable log of all actions performed across the platform.">
                <SummarizeLogButton logContent={fullLogText} />
                <Button variant="outline">
                    <Download className="mr-2 h-4 w-4" />
                    Export as CSV
                </Button>
            </PageHeader>
            <Card>
                <CardHeader>
                    <CardTitle>All Events</CardTitle>
                    <CardDescription>
                        Search and filter through all recorded events for governance and compliance review.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Timestamp</TableHead>
                                <TableHead>User</TableHead>
                                <TableHead>Role</TableHead>
                                <TableHead>Action</TableHead>
                                <TableHead>Details</TableHead>
                                <TableHead>Target ID</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                        {auditLogs.map((log: AuditLog) => (
                            <TableRow key={log.id}>
                                <TableCell className="text-xs">{log.timestamp}</TableCell>
                                <TableCell>{log.user}</TableCell>
                                <TableCell><Badge variant="secondary">{log.role}</Badge></TableCell>
                                <TableCell className="font-medium">{log.action}</TableCell>
                                <TableCell className="text-xs text-muted-foreground">{log.details}</TableCell>
                                <TableCell className="font-code text-xs">{log.targetId}</TableCell>
                            </TableRow>
                        ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </>
    );
}
