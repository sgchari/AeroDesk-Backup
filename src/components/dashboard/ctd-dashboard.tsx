
"use client";

import { PageHeader } from "@/components/dashboard/shared/page-header";
import { CreateRfqDialog } from "@/components/dashboard/customer/create-rfq-dialog";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import type { CharterRFQ, RfqStatus } from "@/lib/types";
import { ShieldCheck, Clock, FileText, CheckCircle, TrendingUp, Users, ArrowRight, Plane, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatsCard } from "@/components/dashboard/shared/stats-card";
import { StatsGrid } from "@/components/dashboard/shared/stats-grid";
import { useUser } from "@/hooks/use-user";
import { Skeleton } from "@/components/ui/skeleton";
import { useCollection, useFirestore, useMemoFirebase } from "@/firebase";
import { collection, query, where } from "firebase/firestore";
import Link from "next/link";

const getStatusVariant = (status: RfqStatus) => {
    switch (status) {
        case 'Pending Approval': return 'warning';
        case 'Bidding Open': return 'success';
        case 'Confirmed': return 'default';
        default: return 'secondary';
    }
}

export function CTDDashboard() {
  const { user, isLoading: isUserLoading } = useUser();
  const firestore = useFirestore();

  const rfqsQuery = useMemoFirebase(() => {
    if (!firestore || !user || !user.company) return null;
    return query(collection(firestore, 'charterRFQs'), where('company', '==', user.company));
  }, [firestore, user]);
  
  const { data: rfqs, isLoading: rfqsLoading } = useCollection<CharterRFQ>(rfqsQuery, 'charterRFQs');

  const isLoading = isUserLoading || rfqsLoading;

  const stats = {
    pendingInternal: rfqs?.filter(r => r.status === 'Pending Approval').length ?? 0,
    activeBids: rfqs?.filter(r => r.status === 'Bidding Open').length ?? 0,
    confirmedTrips: rfqs?.filter(r => r.status === 'Confirmed').length ?? 0,
    totalSpend: "₹ 42.5 L", // Simulated
    activeTravelers: 3, // Simulated
    policyFlags: 1 // Simulated
  }

  return (
    <>
      <PageHeader title="Enterprise Governance View" description={`Immediate business situational awareness for ${user?.company}.`}>
        <CreateRfqDialog />
      </PageHeader>
      
      <StatsGrid>
        <StatsCard title="Spend Management" value={stats.totalSpend} icon={TrendingUp} description="Gross corporate volume" />
        <StatsCard title="Pending Review" href="/dashboard/ctd/approvals" value={isLoading ? <Skeleton className="h-6 w-12" /> : stats.pendingInternal.toString()} icon={ShieldCheck} description="Awaiting CTD sign-off" />
        <StatsCard title="Active Travelers" href="/dashboard/ctd/team" value={stats.activeTravelers.toString()} icon={Users} description="Personnel currently in transit" />
        <StatsCard title="Policy Alerts" href="/dashboard/ctd/policies" value={stats.policyFlags.toString()} icon={AlertCircle} description="Workflow exceptions identified" />
      </StatsGrid>

      <div className="grid gap-6 lg:grid-cols-3 mt-6">
        <Card className="lg:col-span-2 bg-card">
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle>Enterprise Demand Stream</CardTitle>
                    <CardDescription>Recent charter and travel requests across the organization.</CardDescription>
                </div>
                <Button asChild variant="ghost" size="sm" className="text-accent gap-2">
                    <Link href="/dashboard/ctd/requests">View Full Queue <ArrowRight className="h-3 w-3" /></Link>
                </Button>
            </CardHeader>
            <CardContent>
                {isLoading ? <Skeleton className="h-48 w-full" /> : (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Requester</TableHead>
                                <TableHead>Route</TableHead>
                                <TableHead>Cost Center</TableHead>
                                <TableHead>Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {rfqs?.slice(0, 5).map((rfq) => (
                                <TableRow key={rfq.id}>
                                    <TableCell className="font-medium text-xs">{rfq.customerName}</TableCell>
                                    <TableCell className="text-xs">{rfq.departure} to {rfq.arrival}</TableCell>
                                    <TableCell className="font-code text-[10px] uppercase text-muted-foreground">{rfq.costCenter || '-'}</TableCell>
                                    <TableCell>
                                        <Badge variant={getStatusVariant(rfq.status)} className="text-[9px] px-1.5 h-5 font-bold uppercase tracking-wider">
                                            {rfq.status}
                                        </Badge>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
            </CardContent>
        </Card>

        <Card className="bg-card">
            <CardHeader>
                <CardTitle>Operational Signal</CardTitle>
                <CardDescription>Movement status for active missions.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="p-3 rounded-lg bg-muted/10 border border-white/5 space-y-2">
                    <div className="flex items-center justify-between">
                        <p className="text-xs font-bold text-accent uppercase tracking-tighter">Mission: RFQ-CORP-002</p>
                        <Badge variant="default" className="h-4 text-[8px] bg-green-500">EN ROUTE</Badge>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                        <Plane className="h-3 w-3 text-muted-foreground" />
                        <span>DEL → LHR • 5 Pax</span>
                    </div>
                </div>
                
                <div className="p-3 rounded-lg bg-muted/10 border border-white/5 space-y-2 opacity-60">
                    <div className="flex items-center justify-between">
                        <p className="text-xs font-bold text-accent uppercase tracking-tighter">Mission: RFQ-CONF-002</p>
                        <Badge variant="outline" className="h-4 text-[8px]">SCHEDULED</Badge>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                        <Plane className="h-3 w-3 text-muted-foreground" />
                        <span>BLR → GOI • 2 Pax</span>
                    </div>
                </div>
            </CardContent>
        </Card>
      </div>
    </>
  );
}
