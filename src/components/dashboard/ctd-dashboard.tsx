
'use client';
import { PageHeader } from "@/components/dashboard/shared/page-header";
import { CreateRfqDialog } from "./customer/create-rfq-dialog";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Badge } from "../ui/badge";
import type { CharterRFQ, RfqStatus } from "@/lib/types";
import { MoreHorizontal, ShieldCheck, Clock, FileText, CheckCircle } from "lucide-react";
import { Button } from "../ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { StatsCard } from "./shared/stats-card";
import { StatsGrid } from "./shared/stats-grid";
import { cn } from "@/lib/utils";
import { useUser } from "@/hooks/use-user";
import { Skeleton } from "../ui/skeleton";
import { useCollection, useFirestore, useMemoFirebase } from "@/firebase";
import { collection, query, where } from "firebase/firestore";

const getStatusVariant = (status: RfqStatus) => {
    switch (status) {
        case 'Draft': return 'secondary';
        case 'Pending Approval': return 'outline';
        case 'Bidding Open': return 'default';
        default: return 'secondary';
    }
}

const getStatusColor = (status: RfqStatus) => {
    switch (status) {
        case 'Bidding Open': return 'bg-green-500';
        case 'Confirmed': return 'bg-blue-500';
        case 'Pending Approval': return 'bg-yellow-500';
        default: return 'bg-gray-500';
    }
}

export function CTDDashboard() {
  const { user, isLoading: isUserLoading } = useUser();
  const firestore = useFirestore();

  const rfqsQuery = useMemoFirebase(() => {
    if (!firestore || !user || !user.company) return null;
    // This query assumes a 'company' field is stored on the RFQ document for corporate RFQs.
    return query(collection(firestore, 'charterRFQs'), where('company', '==', user.company));
  }, [firestore, user]);
  const { data: rfqs, isLoading: rfqsLoading } = useCollection<CharterRFQ>(rfqsQuery);

  const isLoading = isUserLoading || rfqsLoading;

  const stats = {
    pending: rfqs?.filter(r => r.status === 'Pending Approval').length ?? 0,
    active: rfqs?.filter(r => r.status === 'Bidding Open').length ?? 0,
    confirmed: rfqs?.filter(r => r.status === 'Confirmed').length ?? 0,
    total: rfqs?.length ?? 0
  }

  return (
    <>
      <PageHeader title="CTD Admin Dashboard" description={`Manage travel for ${user?.company}.`}>
        <CreateRfqDialog />
      </PageHeader>
      
      <StatsGrid>
        <StatsCard title="Total Corporate RFQs" value={isLoading ? <Skeleton className="h-6 w-12" /> : stats.total.toString()} icon={FileText} description="Requests from your organization" />
        <StatsCard title="Pending Internal Approval" value={isLoading ? <Skeleton className="h-6 w-12" /> : stats.pending.toString()} icon={ShieldCheck} description="RFQs awaiting sign-off" />
        <StatsCard title="Active RFQs" value={isLoading ? <Skeleton className="h-6 w-12" /> : stats.active.toString()} icon={Clock} description="Requests open for operator bids" />
        <StatsCard title="Confirmed Corporate Trips" value={isLoading ? <Skeleton className="h-6 w-12" /> : stats.confirmed.toString()} icon={CheckCircle} description="Successfully confirmed charters" />
      </StatsGrid>

      <Card>
        <CardHeader>
          <CardTitle>Corporate Charter RFQs</CardTitle>
          <CardDescription>
            A list of charter requests for your organization.
          </CardDescription>
        </CardHeader>
        <CardContent>
            {isLoading ? <Skeleton className="h-40 w-full" /> : (
            <Table>
                <TableHeader>
                <TableRow>
                    <TableHead>RFQ ID</TableHead>
                    <TableHead>Requester</TableHead>
                    <TableHead>Route</TableHead>
                    <TableHead>Departure</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>
                    <span className="sr-only">Actions</span>
                    </TableHead>
                </TableRow>
                </TableHeader>
                <TableBody>
                {rfqs?.map((rfq: CharterRFQ) => (
                    <TableRow key={rfq.id}>
                        <TableCell className="font-medium font-code">{rfq.id}</TableCell>
                        <TableCell>{rfq.customerName}</TableCell>
                        <TableCell>{rfq.departure} to {rfq.arrival}</TableCell>
                        <TableCell>{rfq.departureDate}</TableCell>
                        <TableCell>
                            <Badge variant={getStatusVariant(rfq.status)}>
                                <span className={cn("mr-2 h-2 w-2 rounded-full", getStatusColor(rfq.status))}></span>
                                {rfq.status}
                            </Badge>
                        </TableCell>
                        <TableCell>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                <Button aria-haspopup="true" size="icon" variant="ghost">
                                    <MoreHorizontal className="h-4 w-4" />
                                    <span className="sr-only">Toggle menu</span>
                                </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                { rfq.status === 'Pending Approval' && <DropdownMenuItem>Approve/Reject</DropdownMenuItem>}
                                <DropdownMenuItem>View Details</DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </TableCell>
                    </TableRow>
                ))}
                </TableBody>
            </Table>
            )}
        </CardContent>
      </Card>
    </>
  );
}
