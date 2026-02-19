'use client';
import { PageHeader } from "@/components/dashboard/shared/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { ShieldCheck, Users, Plane, Briefcase, Building, CreditCard, ArrowRight } from "lucide-react";
import { StatsCard } from "./shared/stats-card";
import { StatsGrid } from "./shared/stats-grid";
import { AuditLog, User, EmptyLeg } from "@/lib/types";
import { Badge } from "../ui/badge";
import Link from "next/link";
import { Button } from "../ui/button";
import { useCollection, useFirestore, useMemoFirebase } from "@/firebase";
import { collection, query, where, limit } from "firebase/firestore";
import { Skeleton } from "../ui/skeleton";

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
  const firestore = useFirestore();

  const usersQuery = useMemoFirebase(() => firestore ? collection(firestore, 'users') : null, [firestore]);
  const { data: users, isLoading: usersLoading } = useCollection<User>(usersQuery);

  const emptyLegsQuery = useMemoFirebase(() => firestore ? query(collection(firestore, 'emptyLegFlights'), where('status', '==', 'Pending Approval')) : null, [firestore]);
  const { data: emptyLegs, isLoading: emptyLegsLoading } = useCollection<EmptyLeg>(emptyLegsQuery);
  
  const auditLogsQuery = useMemoFirebase(() => firestore ? query(collection(firestore, 'complianceNotes'), limit(5)) : null, [firestore]);
  const { data: recentLogs, isLoading: logsLoading } = useCollection<AuditLog>(auditLogsQuery);

  const isLoading = usersLoading || emptyLegsLoading || logsLoading;
  
  const stats = {
    pendingApprovals: emptyLegs?.length ?? 0,
    activeUsers: users?.length ?? 0,
    operators: users?.filter(u => u.role === 'Operator').length ?? 0,
    partners: users?.filter(u => u.role === 'Hotel Partner' || u.role === 'Authorized Distributor').length ?? 0,
  }

  return (
    <>
      <PageHeader title="Admin Control Tower" description="Oversee all platform activity and ensure compliance." />
      
      <div className="grid gap-6">
        <StatsGrid>
          <StatsCard title="Pending Approvals" value={isLoading ? <Skeleton className="h-6 w-12" /> : stats.pendingApprovals.toString()} icon={ShieldCheck} description="Items awaiting review" />
          <StatsCard title="Active Users" value={isLoading ? <Skeleton className="h-6 w-12" /> : stats.activeUsers.toString()} icon={Users} description="Across all roles" />
          <StatsCard title="Operators" value={isLoading ? <Skeleton className="h-6 w-12" /> : stats.operators.toString()} icon={Plane} description="Verified NSOP operators" />
          <StatsCard title="Partners" value={isLoading ? <Skeleton className="h-6 w-12" /> : stats.partners.toString()} icon={Briefcase} description="Hotels & Distributors" />
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
                          <TableCell>{log.timestamp?.toString()}</TableCell>
                          <TableCell>{log.user}</TableCell>
                          <TableCell><Badge variant="secondary">{log.role}</Badge></TableCell>
                          <TableCell className="font-medium">{log.action}</TableCell>
                          <TableCell className="font-code">{log.targetId}</TableCell>
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
