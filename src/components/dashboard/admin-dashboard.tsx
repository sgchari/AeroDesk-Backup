import { PageHeader } from "@/components/dashboard/shared/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { getMockDataForRole } from "@/lib/data";
import { ShieldCheck, Users, Plane, FileText, Briefcase, Building, CreditCard, ArrowRight } from "lucide-react";
import { StatsCard } from "./shared/stats-card";
import { StatsGrid } from "./shared/stats-grid";
import { AuditLog } from "@/lib/types";
import { Badge } from "../ui/badge";
import Link from "next/link";
import { Button } from "../ui/button";

function ManagementCard({ title, description, link, icon: Icon }: { title: string, description: string, link: string, icon: React.ElementType }) {
  return (
    <Card className="flex flex-col">
        <CardHeader>
            <div className="flex items-start justify-between">
                <div>
                    <CardTitle className="text-lg">{title}</CardTitle>
                    <CardDescription className="mt-1">{description}</CardDescription>
                </div>
                <div className="p-2 bg-muted rounded-md">
                    <Icon className="h-6 w-6 text-muted-foreground" />
                </div>
            </div>
        </CardHeader>
        <CardContent className="mt-auto">
            <Button asChild variant="outline" className="w-full">
                <Link href={link}>
                    Manage <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
            </Button>
        </CardContent>
    </Card>
  )
}

export function AdminDashboard() {
  const { users, emptyLegs, auditLogs } = getMockDataForRole('Admin');
  
  const stats = {
    pendingApprovals: emptyLegs?.filter(e => e.status === 'Pending Approval').length ?? 0,
    activeUsers: users?.length ?? 0,
    operators: users?.filter(u => u.role === 'Operator').length ?? 0,
    partners: users?.filter(u => u.role === 'Hotel Partner' || u.role === 'Authorized Distributor').length ?? 0,
  }

  const recentLogs = auditLogs?.slice(0, 5) ?? [];

  return (
    <>
      <PageHeader title="Admin Control Tower" description="Oversee all platform activity and ensure compliance." />
      
      <div className="grid gap-6">
        <StatsGrid>
          <StatsCard title="Pending Approvals" value={stats.pendingApprovals.toString()} icon={ShieldCheck} description="Items awaiting review" />
          <StatsCard title="Active Users" value={stats.activeUsers.toString()} icon={Users} description="Across all roles" />
          <StatsCard title="Operators" value={stats.operators.toString()} icon={Plane} description="Verified NSOP operators" />
          <StatsCard title="Partners" value={stats.partners.toString()} icon={Briefcase} description="Hotels & Distributors" />
        </StatsGrid>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <ManagementCard
            title="User Management"
            description="Manage all platform users, roles, and verification statuses."
            link="/dashboard/admin/users"
            icon={Users}
          />
          <ManagementCard
            title="Operator Management"
            description="Approve operators, view fleets, and manage access."
            link="/dashboard/admin/operators"
            icon={Plane}
          />
          <ManagementCard
            title="Partner Management"
            description="Onboard and manage hotel and distributor partners."
            link="/dashboard/admin/partners"
            icon={Briefcase}
          />
          <ManagementCard
            title="Corporate Management"
            description="Manage CTD accounts and approval hierarchies."
            link="/dashboard/admin/corporates"
            icon={Building}
          />
           <ManagementCard
            title="Billing Records"
            description="View subscription and participation fee records."
            link="/dashboard/admin/billing"
            icon={CreditCard}
          />
           <ManagementCard
            title="Platform Approvals"
            description="Review empty-legs, verifications, and workflows."
            link="/dashboard/admin/approvals"
            icon={ShieldCheck}
          />
        </div>

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
      </div>
    </>
  );
}
