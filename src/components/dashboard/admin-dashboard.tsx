
'use client';
import { PageHeader } from "@/components/dashboard/shared/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { ShieldCheck, Users, Plane, Briefcase, GanttChartSquare } from "lucide-react";
import { StatsCard } from "./shared/stats-card";
import { StatsGrid } from "./shared/stats-grid";
import { AuditLog } from "@/lib/types";
import { Badge } from "../ui/badge";
import Link from "next/link";
import { Button } from "../ui/button";
import { Skeleton } from "../ui/skeleton";
import { useCollection, useFirestore, useMemoFirebase } from "@/firebase";
import { collection, query, where, orderBy, limit } from "firebase/firestore";

export function AdminDashboard() {
  const firestore = useFirestore();

  const pendingLegsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'emptyLegs'), where('status', '==', 'Pending Approval'));
  }, [firestore]);
  const { data: pendingLegs, isLoading: pendingLegsLoading } = useCollection(pendingLegsQuery);
  
  const usersQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return collection(firestore, 'customers'); // Simplified: just counting customers for now
  }, [firestore]);
  const { data: users, isLoading: usersLoading } = useCollection(usersQuery);

  const operatorsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return collection(firestore, 'operators');
  }, [firestore]);
  const { data: operators, isLoading: operatorsLoading } = useCollection(operatorsQuery);
  
  const partnersQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return collection(firestore, 'hotelPartners'); // Simplified: just hotel partners
  }, [firestore]);
  const { data: partners, isLoading: partnersLoading } = useCollection(partnersQuery);

  const auditLogsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'auditTrails'), orderBy('timestamp', 'desc'), limit(5));
  }, [firestore]);
  const { data: recentLogs, isLoading: auditLogsLoading } = useCollection<AuditLog>(auditLogsQuery);

  const activeRfqsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'charterRFQs'), where('status', '==', 'Bidding Open'));
  }, [firestore]);
  const { data: activeRfqs, isLoading: activeRfqsLoading } = useCollection(activeRfqsQuery);
  
  const isLoading = pendingLegsLoading || usersLoading || operatorsLoading || partnersLoading || auditLogsLoading || activeRfqsLoading;
  
  const stats = {
    pendingApprovals: pendingLegs?.length ?? 0,
    activeUsers: users?.length ?? 0, // Note: This is a simplified count
    operators: operators?.length ?? 0,
    partners: partners?.length ?? 0, // Note: This is a simplified count
    activeRfqs: activeRfqs?.length ?? 0,
  }

  return (
    <>
      <PageHeader title="Admin Control Tower" description="Oversee all platform activity and ensure compliance." />
      
      <div className="grid gap-6">
        <StatsGrid>
            <StatsCard title="Pending Approvals" href="/dashboard/admin/approvals" value={isLoading ? <Skeleton className="h-6 w-12" /> : stats.pendingApprovals.toString()} icon={ShieldCheck} description="Items awaiting review" />
            <StatsCard title="Active Users" href="/dashboard/admin/users" value={isLoading ? <Skeleton className="h-6 w-12" /> : stats.activeUsers.toString()} icon={Users} description="Across all roles" />
            <StatsCard title="Operators" href="/dashboard/admin/operators" value={isLoading ? <Skeleton className="h-6 w-12" /> : stats.operators.toString()} icon={Plane} description="Verified NSOP operators" />
            <StatsCard title="Partners" href="/dashboard/admin/partners" value={isLoading ? <Skeleton className="h-6 w-12" /> : stats.partners.toString()} icon={Briefcase} description="Hotels & Distributors" />
            <StatsCard title="Active RFQs" value={isLoading ? <Skeleton className="h-6 w-12" /> : stats.activeRfqs.toString()} icon={GanttChartSquare} description="Open for bidding" />
        </StatsGrid>
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle>Recent Audit Trail</CardTitle>
                    <CardDescription>
                        The latest activities recorded on the platform.
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
                        <TableHead>User</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Action</TableHead>
                        <TableHead>Target ID</TableHead>
                    </TableRow>
                    </TableHeader>
                    <TableBody>
                    {recentLogs?.map((log: AuditLog) => (
                        <TableRow key={log.id}>
                            <TableCell>{new Date(log.timestamp).toLocaleString()}</TableCell>
                            <TableCell>{log.user}</TableCell>
                            <TableCell><Badge variant="secondary">{log.role}</Badge></TableCell>
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
