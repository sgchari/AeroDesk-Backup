
'use client';
import { PageHeader } from "@/components/dashboard/shared/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ShieldCheck, Users, Plane, Briefcase, GanttChartSquare, Bell, Package, AlertCircle } from "lucide-react";
import { StatsCard } from "@/components/dashboard/shared/stats-card";
import { StatsGrid } from "@/components/dashboard/shared/stats-grid";
import { AuditLog, Operator } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useCollection, useFirestore, useMemoFirebase } from "@/firebase";
import { collection, query, where, orderBy, limit } from "firebase/firestore";

export function AdminDashboard() {
  const firestore = useFirestore();

  const pendingLegsQuery = useMemoFirebase(() => firestore ? query(collection(firestore, 'emptyLegs'), where('status', '==', 'Pending Approval')) : null, [firestore]);
  const { data: pendingLegs, isLoading: pendingLegsLoading } = useCollection(pendingLegsQuery, 'emptyLegs');
  
  const pendingOperatorsQuery = useMemoFirebase(() => firestore ? query(collection(firestore, 'operators'), where('status', '==', 'Pending Approval')) : null, [firestore]);
  const { data: pendingOperators, isLoading: pendingOperatorsLoading } = useCollection<Operator>(pendingOperatorsQuery, 'operators');
  
  const { data: allUsers, isLoading: usersLoading } = useCollection(useMemoFirebase(() => firestore ? collection(firestore, 'users') : null, [firestore]), 'users');
  const { data: allEmptyLegs, isLoading: emptyLegsLoading } = useCollection(useMemoFirebase(() => firestore ? collection(firestore, 'emptyLegs') : null, [firestore]), 'emptyLegs');

  const auditLogsQuery = useMemoFirebase(() => firestore ? query(collection(firestore, 'auditTrails'), orderBy('timestamp', 'desc'), limit(5)) : null, [firestore]);
  const { data: recentLogs, isLoading: auditLogsLoading } = useCollection<AuditLog>(auditLogsQuery, 'auditTrails');

  const activeRfqsQuery = useMemoFirebase(() => firestore ? query(collection(firestore, 'charterRFQs'), where('status', '==', 'Bidding Open')) : null, [firestore]);
  const { data: activeRfqs, isLoading: activeRfqsLoading } = useCollection(activeRfqsQuery, 'charterRFQs');
  
  const isLoading = pendingLegsLoading || pendingOperatorsLoading || usersLoading || emptyLegsLoading || auditLogsLoading || activeRfqsLoading;

  const totalPendingApprovals = (pendingLegs?.length ?? 0) + (pendingOperators?.length ?? 0);
  
  const stats = {
    pendingApprovals: totalPendingApprovals,
    activeEntities: allUsers?.length ?? 0,
    openCharterActivity: activeRfqs?.length ?? 0,
    emptyLegActivity: allEmptyLegs?.length ?? 0,
    complianceFlags: 0, // Mocked
    billingAlerts: 0, // Mocked
  }

  return (
    <>
      <PageHeader title="Governance Command Center" description="Instant platform situational awareness and compliance oversight." />
      
      <div className="grid gap-6">
        <StatsGrid>
            <StatsCard title="Pending Approvals" href="/dashboard/admin/approvals" value={isLoading ? <Skeleton className="h-6 w-12" /> : stats.pendingApprovals.toString()} icon={ShieldCheck} description="Items awaiting review" />
            <StatsCard title="Active Entities" href="/dashboard/admin/users" value={isLoading ? <Skeleton className="h-6 w-12" /> : stats.activeEntities.toString()} icon={Package} description="Users, operators, partners" />
            <StatsCard title="Open Charter Activity" href="#" value={isLoading ? <Skeleton className="h-6 w-12" /> : stats.openCharterActivity.toString()} icon={GanttChartSquare} description="RFQs open for bidding" />
            <StatsCard title="Empty Leg Activity" href="#" value={isLoading ? <Skeleton className="h-6 w-12" /> : stats.emptyLegActivity.toString()} icon={Plane} description="Total published empty legs" />
            <StatsCard title="Compliance Flags" href="#" value={isLoading ? <Skeleton className="h-6 w-12" /> : stats.complianceFlags.toString()} icon={AlertCircle} description="Workflows needing review" />
            <StatsCard title="Billing Alerts" href="/dashboard/admin/billing" value={isLoading ? <Skeleton className="h-6 w-12" /> : stats.billingAlerts.toString()} icon={Bell} description="Overdue & pending items" />
        </StatsGrid>
        <Card className="bg-card">
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle>Recent Audit Trail</CardTitle>
                    <CardDescription>
                        The latest high-priority activities recorded on the platform.
                    </CardDescription>
                </div>
                <Button asChild variant="outline">
                    <Link href="/dashboard/admin/audit-trail">View All</Link>
                </Button>
            </CardHeader>
            <CardContent>
              {isLoading ? <Skeleton className="h-40 w-full" /> : (
                <Table>
                    <TableHeader>
                    <TableRow>
                        <TableHead>Timestamp</TableHead>
                        <TableHead>Actor / Role</TableHead>
                        <TableHead>Action</TableHead>
                        <TableHead>Target ID</TableHead>
                    </TableRow>
                    </TableHeader>
                    <TableBody>
                    {recentLogs?.map((log: AuditLog) => (
                        <TableRow key={log.id}>
                            <TableCell>{new Date(log.timestamp).toLocaleString()}</TableCell>
                            <TableCell>
                                <div className="font-medium">{log.user}</div>
                                <div className="text-xs text-muted-foreground">{log.role}</div>
                            </TableCell>
                            <TableCell className="font-medium">{log.action}</TableCell>
                            <TableCell className="font-code text-xs">{log.targetId}</TableCell>
                        </TableRow>
                    ))}
                    </TableBody>
                </Table>
              )}
            </CardContent>
        </Card>
      </div>
    </>
  );
}
