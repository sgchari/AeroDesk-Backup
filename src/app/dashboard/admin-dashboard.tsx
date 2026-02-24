'use client';
import { PageHeader } from "@/components/dashboard/shared/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ShieldCheck, Users, Plane, Briefcase, GanttChartSquare } from "lucide-react";
import { StatsCard } from "@/components/dashboard/shared/stats-card";
import { StatsGrid } from "@/components/dashboard/shared/stats-grid";
import { AuditLog } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useCollection, useFirestore, useMemoFirebase, errorEmitter, FirestorePermissionError } from "@/firebase";
import { collection, query, where, orderBy, limit, getDocs } from "firebase/firestore";
import React, { useState, useEffect } from "react";

export function AdminDashboard() {
  const firestore = useFirestore();

  const pendingLegsQuery = useMemoFirebase(() => firestore ? query(collection(firestore, 'emptyLegs'), where('status', '==', 'Pending Approval')) : null, [firestore]);
  const { data: pendingLegs, isLoading: pendingLegsLoading } = useCollection(pendingLegsQuery);
  
  // Fetch all user types for an accurate count
  const { data: admins, isLoading: adminsLoading } = useCollection(useMemoFirebase(() => firestore ? collection(firestore, 'platformAdmins') : null, [firestore]));
  const { data: customers, isLoading: customersLoading } = useCollection(useMemoFirebase(() => firestore ? collection(firestore, 'customers') : null, [firestore]));
  const { data: operators, isLoading: operatorsLoading } = useCollection(useMemoFirebase(() => firestore ? collection(firestore, 'operators') : null, [firestore]));
  const { data: distributors, isLoading: distributorsLoading } = useCollection(useMemoFirebase(() => firestore ? collection(firestore, 'distributors') : null, [firestore]));
  const { data: hotelPartners, isLoading: hotelPartnersLoading } = useCollection(useMemoFirebase(() => firestore ? collection(firestore, 'hotelPartners') : null, [firestore]));

  // Fetch CTD users for an accurate count
  const { data: ctds, isLoading: ctdsLoading } = useCollection(useMemoFirebase(() => firestore ? collection(firestore, 'corporateTravelDesks') : null, [firestore]));
  const [ctdUsers, setCtdUsers] = useState<any[]>([]);
  const [ctdUsersLoading, setCtdUsersLoading] = useState(true);

  useEffect(() => {
    if (!firestore || ctds === null) {
      if (!ctdsLoading) {
        setCtdUsers([]);
        setCtdUsersLoading(false);
      }
      return;
    }
    if (ctds.length === 0) {
      setCtdUsers([]);
      setCtdUsersLoading(false);
      return;
    }
    const fetchAllCtdUsers = async () => {
      if (!firestore) return;
      setCtdUsersLoading(true);
      try {
        const allUsersPromises = ctds.map(ctd => {
          const usersCollectionRef = collection(firestore, `corporateTravelDesks/${ctd.id}/users`);
          return getDocs(usersCollectionRef);
        });
        const allUsersSnapshots = await Promise.all(allUsersPromises);
        const allUsersData: any[] = [];
        allUsersSnapshots.forEach(snapshot => {
          snapshot.forEach(doc => {
            allUsersData.push({ ...doc.data(), id: doc.id });
          });
        });
        setCtdUsers(allUsersData);
      } catch (error: any) {
        console.error("Error fetching CTD users for dashboard:", error);
      } finally {
        setCtdUsersLoading(false);
      }
    };
    fetchAllCtdUsers();
  }, [ctds, firestore, ctdsLoading]);


  const auditLogsQuery = useMemoFirebase(() => firestore ? query(collection(firestore, 'auditTrails'), orderBy('timestamp', 'desc'), limit(5)) : null, [firestore]);
  const { data: recentLogs, isLoading: auditLogsLoading } = useCollection<AuditLog>(auditLogsQuery);

  const activeRfqsQuery = useMemoFirebase(() => firestore ? query(collection(firestore, 'charterRFQs'), where('status', '==', 'Bidding Open')) : null, [firestore]);
  const { data: activeRfqs, isLoading: activeRfqsLoading } = useCollection(activeRfqsQuery);
  
  const userCollectionsLoading = adminsLoading || customersLoading || operatorsLoading || distributorsLoading || hotelPartnersLoading || ctdUsersLoading;
  const isLoading = pendingLegsLoading || userCollectionsLoading || auditLogsLoading || activeRfqsLoading;

  const totalUsers = (admins?.length ?? 0) + (customers?.length ?? 0) + (operators?.length ?? 0) + (distributors?.length ?? 0) + (hotelPartners?.length ?? 0) + (ctdUsers?.length ?? 0);
  const totalPartners = (distributors?.length ?? 0) + (hotelPartners?.length ?? 0);
  
  const stats = {
    pendingApprovals: pendingLegs?.length ?? 0,
    activeUsers: totalUsers,
    operators: operators?.length ?? 0,
    partners: totalPartners,
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
            <StatsCard title="Active RFQs" href="#" value={isLoading ? <Skeleton className="h-6 w-12" /> : stats.activeRfqs.toString()} icon={GanttChartSquare} description="Open for bidding" />
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
