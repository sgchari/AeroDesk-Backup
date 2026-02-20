
'use client';
import { PageHeader } from "@/components/dashboard/shared/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { ShieldCheck, Users, Plane, Briefcase, Building, CreditCard, ArrowRight, GanttChartSquare } from "lucide-react";
import { StatsCard } from "./shared/stats-card";
import { StatsGrid } from "./shared/stats-grid";
import { AuditLog } from "@/lib/types";
import { Badge } from "../ui/badge";
import Link from "next/link";
import { Button } from "../ui/button";
import { Skeleton } from "../ui/skeleton";
import { useCollection, useFirestore, useMemoFirebase } from "@/firebase";
import { collection, query, where, orderBy, limit } from "firebase/firestore";
import { Treemap, ResponsiveContainer } from "recharts";
import { ChartContainer } from "@/components/ui/chart";

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

const CustomizedContent = ({ root, depth, x, y, width, height, index, name, count, fill }) => {
    if (width < 50 || height < 30) return null;
    return (
        <g>
            <rect
                x={x}
                y={y}
                width={width}
                height={height}
                style={{
                    fill: fill,
                    stroke: '#fff',
                    strokeWidth: 2,
                }}
            />
            <text
                x={x + width / 2}
                y={y + height / 2}
                textAnchor="middle"
                dominantBaseline="middle"
                fill="#fff"
                className="text-sm font-medium"
            >
                {name}
            </text>
             <text
                x={x + width / 2}
                y={y + height / 2 + 18}
                textAnchor="middle"
                fill="#fff"
                className="text-lg font-bold"
            >
                {count}
            </text>
        </g>
    );
};


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

  const heatmapData = [
      { name: 'Pending Approvals', count: stats.pendingApprovals, fill: 'hsl(var(--chart-1))' },
      { name: 'Active Users', count: stats.activeUsers, fill: 'hsl(var(--chart-2))' },
      { name: 'Operators', count: stats.operators, fill: 'hsl(var(--chart-3))' },
      { name: 'Partners', count: stats.partners, fill: 'hsl(var(--chart-4))' },
      { name: 'Active RFQs', count: stats.activeRfqs, fill: 'hsl(var(--chart-5))' },
  ].filter(d => d.count > 0);

  return (
    <>
      <PageHeader title="Admin Control Tower" description="Oversee all platform activity and ensure compliance." />
      
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 grid gap-6">
          <StatsGrid>
            <StatsCard title="Pending Approvals" value={isLoading ? <Skeleton className="h-6 w-12" /> : stats.pendingApprovals.toString()} icon={ShieldCheck} description="Items awaiting review" />
            <StatsCard title="Active Users" value={isLoading ? <Skeleton className="h-6 w-12" /> : stats.activeUsers.toString()} icon={Users} description="Across all roles" />
            <StatsCard title="Operators" value={isLoading ? <Skeleton className="h-6 w-12" /> : stats.operators.toString()} icon={Plane} description="Verified NSOP operators" />
            <StatsCard title="Partners" value={isLoading ? <Skeleton className="h-6 w-12" /> : stats.partners.toString()} icon={Briefcase} description="Hotels & Distributors" />
            <StatsCard title="Active RFQs" value={isLoading ? <Skeleton className="h-6 w-12" /> : stats.activeRfqs.toString()} icon={GanttChartSquare} description="Open for bidding" />
          </StatsGrid>

          <div className="grid gap-6 md:grid-cols-2">
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
        <div className="lg:col-span-1">
          <Card>
              <CardHeader>
                  <CardTitle>Platform Heatmap</CardTitle>
                  <CardDescription>Overview of key platform metrics.</CardDescription>
              </CardHeader>
              <CardContent className="h-[400px] w-full p-0">
                  {isLoading ? <Skeleton className="h-full w-full" /> : (
                    <ResponsiveContainer width="100%" height="100%">
                      <Treemap
                          width={400}
                          height={200}
                          data={heatmapData}
                          dataKey="count"
                          stroke="#fff"
                          aspectRatio={1}
                          content={<CustomizedContent />}
                      />
                    </ResponsiveContainer>
                  )}
              </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
