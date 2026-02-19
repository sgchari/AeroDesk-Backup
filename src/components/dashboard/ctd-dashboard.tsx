import { PageHeader } from "@/components/dashboard/shared/page-header";
import { CreateRfqDialog } from "./customer/create-rfq-dialog";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Badge } from "../ui/badge";
import { getMockDataForRole } from "@/lib/data";
import type { CharterRFQ, RfqStatus, UserRole } from "@/lib/types";
import { MoreHorizontal, ShieldCheck, Clock, FileText, CheckCircle } from "lucide-react";
import { Button } from "../ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { StatsCard } from "./shared/stats-card";
import { StatsGrid } from "./shared/stats-grid";
import { cn } from "@/lib/utils";
import { useUser } from "@/hooks/use-user";

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
  const { user } = useUser();
  const { rfqs } = getMockDataForRole(user.role as UserRole);

  const stats = {
    pending: rfqs.filter(r => r.status === 'Pending Approval').length,
    active: rfqs.filter(r => r.status === 'Bidding Open').length,
    confirmed: rfqs.filter(r => r.status === 'Confirmed').length
  }

  const roleBasedTitle = {
    'CTD Requester': 'CTD Requester Dashboard',
    'CTD Approver': 'CTD Approver Dashboard',
    'CTD Admin': 'CTD Admin Dashboard',
  }

  return (
    <>
      <PageHeader title={roleBasedTitle[user.role as keyof typeof roleBasedTitle]} description={`Manage travel for ${user.company}.`}>
        { (user.role === 'CTD Requester' || user.role === 'CTD Admin') && <CreateRfqDialog />}
      </PageHeader>
      
      <StatsGrid>
        <StatsCard title="Total Corporate RFQs" value={rfqs.length.toString()} icon={FileText} description="Requests from your organization" />
        <StatsCard title="Pending Internal Approval" value={stats.pending.toString()} icon={ShieldCheck} description="RFQs awaiting sign-off" />
        <StatsCard title="Active RFQs" value={stats.active.toString()} icon={Clock} description="Requests open for operator bids" />
        <StatsCard title="Confirmed Corporate Trips" value={stats.confirmed.toString()} icon={CheckCircle} description="Successfully confirmed charters" />
      </StatsGrid>

      <Card>
        <CardHeader>
          <CardTitle>Corporate Charter RFQs</CardTitle>
          <CardDescription>
            A list of charter requests for your organization.
          </CardDescription>
        </CardHeader>
        <CardContent>
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
                {rfqs.map((rfq: CharterRFQ) => (
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
                                { (user.role === 'CTD Approver' || user.role === 'CTD Admin') && rfq.status === 'Pending Approval' && <DropdownMenuItem>Approve/Reject</DropdownMenuItem>}
                                <DropdownMenuItem>View Details</DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </TableCell>
                    </TableRow>
                ))}
                </TableBody>
            </Table>
        </CardContent>
      </Card>
    </>
  );
}
