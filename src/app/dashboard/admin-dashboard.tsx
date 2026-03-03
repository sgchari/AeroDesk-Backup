
'use client';
import { PageHeader } from "@/components/dashboard/shared/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ShieldCheck, Users, Plane, Briefcase, GanttChartSquare, Bell, Package, AlertCircle } from "lucide-react";
import { StatsCard } from "@/components/dashboard/shared/stats-card";
import { StatsGrid } from "@/components/dashboard/shared/stats-grid";
import { AuditLog, Operator, CharterRFQ } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useCollection, useFirestore, useMemoFirebase } from "@/firebase";
import { collection, query, where, orderBy, limit } from "firebase/firestore";
import { LiveRadarDashboardCard } from "@/components/dashboard/shared/live-radar-dashboard-card";
import { useMemo } from "react";

export function AdminDashboard() {
  const firestore = useFirestore();

  const pendingLegsQuery = useMemoFirebase(() => {
    if (!firestore || (firestore as any)._isMock) return null;
    return query(collection(firestore, 'emptyLegs'), where('status', '==', 'Pending Approval'));
  }, [firestore]);
  const { data: pendingLegs, isLoading: pendingLegsLoading } = useCollection(pendingLegsQuery, 'emptyLegs');
  
  const pendingOperatorsQuery = useMemoFirebase(() => {
    if (!firestore || (firestore as any)._isMock) return null;
    return query(collection(firestore, 'operators'), where('status', '==', 'Pending Approval'));
  }, [firestore]);
  const { data: pendingOperators, isLoading: pendingOperatorsLoading } = useCollection<Operator>(pendingOperatorsQuery, 'operators');
  
  const allUsersQuery = useMemoFirebase(() => {
    if (!firestore || (firestore as any)._isMock) return null;
    return collection(firestore, 'users');
  }, [firestore]);
  const { data: allUsers, isLoading: usersLoading } = useCollection(allUsersQuery, 'users');

  const allEmptyLegsQuery = useMemoFirebase(() => {
    if (!firestore || (firestore as any)._isMock) return null;
    return collection(firestore, 'emptyLegs');
  }, [firestore]);
  const { data: allEmptyLegs, isLoading: emptyLegsLoading } = useCollection(allEmptyLegsQuery, 'emptyLegs');

  const auditLogsQuery = useMemoFirebase(() => {
    if (!firestore || (firestore as any)._isMock) return null;
    return query(collection(firestore, 'auditTrails'), orderBy('timestamp', 'desc'), limit(5));
  }, [firestore]);
  const { data: recentLogs, isLoading: auditLogsLoading } = useCollection<AuditLog>(auditLogsQuery, 'auditTrails');

  const activeRfqsQuery = useMemoFirebase(() => {
    if (!firestore || (firestore as any)._isMock) return null;
    return query(collection(firestore, 'charterRequests'));
  }, [firestore]);
  const { data: allRfqs, isLoading: activeRfqsLoading } = useCollection<CharterRFQ>(activeRfqsQuery, 'charterRequests');
  
  const liveMissions = useMemo(() => {
    return allRfqs?.filter(m => ['departed', 'live', 'enroute', 'arrived'].includes(m.status)) || [];
  }, [allRfqs]);

  const isLoading = pendingLegsLoading || pendingOperatorsLoading || usersLoading || emptyLegsLoading || auditLogsLoading || activeRfqsLoading;

  const stats = {
    pendingApprovals: (pendingLegs?.length ?? 0) + (pendingOperators?.length ?? 0),
    activeEntities: allUsers?.length ?? 0,
    openCharterActivity: allRfqs?.filter(r => r.status === 'Bidding Open').length ?? 0,
    emptyLegActivity: allEmptyLegs?.length ?? 0,
    complianceFlags: 0,
    billingAlerts: 0,
  }

  return (
    <div className="space-y-6">
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

        {liveMissions.length > 0 && (
            <LiveRadarDashboardCard missions={liveMissions} />
        )}

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
    </div>
  );
}
