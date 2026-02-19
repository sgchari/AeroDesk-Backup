import { PageHeader } from "@/components/dashboard/shared/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { getMockDataForRole } from "@/lib/data";
import { ShieldCheck, Users, Plane, FileText } from "lucide-react";
import { StatsCard } from "./shared/stats-card";
import { StatsGrid } from "./shared/stats-grid";
import { AuditLog } from "@/lib/types";
import { Badge } from "../ui/badge";
import Link from "next/link";
import { Button } from "../ui/button";

export function AdminDashboard() {
  const { users, emptyLegs, auditLogs } = getMockDataForRole('Admin');
  
  const stats = {
    pendingApprovals: emptyLegs?.filter(e => e.status === 'Pending Approval').length ?? 0,
    activeUsers: users?.length ?? 0,
    totalAircraft: getMockDataForRole('Admin').aircrafts?.length ?? 0,
    auditEvents: auditLogs?.length ?? 0,
  }

  const recentLogs = auditLogs?.slice(0, 5) ?? [];

  return (
    <>
      <PageHeader title="Admin Control Tower" description="Oversee all platform activity and ensure compliance." />
      
      <StatsGrid>
        <StatsCard title="Pending Approvals" value={stats.pendingApprovals.toString()} icon={ShieldCheck} description="Items awaiting your review" />
        <StatsCard title="Active Users" value={stats.activeUsers.toString()} icon={Users} description="Across all roles" />
        <StatsCard title="Total Aircraft" value={stats.totalAircraft.toString()} icon={Plane} description="Registered on the platform" />
        <StatsCard title="Total Audit Events" value={stats.auditEvents.toString()} icon={FileText} description="Logged platform activities" />
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
                {recentLogs.map((log: AuditLog) => (
                    <TableRow key={log.id}>
                        <TableCell>{log.timestamp}</TableCell>
                        <TableCell>{log.user}</TableCell>
                        <TableCell><Badge variant="secondary">{log.role}</Badge></TableCell>
                        <TableCell className="font-medium">{log.action}</TableCell>
                        <TableCell className="font-code">{log.targetId}</TableCell>
                    </TableRow>
                ))}
                </TableBody>
            </Table>
        </CardContent>
      </Card>
    </>
  );
}
