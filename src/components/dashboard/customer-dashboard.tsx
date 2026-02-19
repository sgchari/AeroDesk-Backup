import { PageHeader } from "@/components/dashboard/shared/page-header";
import { CreateRfqDialog } from "./customer/create-rfq-dialog";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Badge } from "../ui/badge";
import { getMockDataForRole } from "@/lib/data";
import type { CharterRFQ, RfqStatus } from "@/lib/types";
import { MoreHorizontal } from "lucide-react";
import { Button } from "../ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { StatsCard } from "./shared/stats-card";
import { StatsGrid } from "./shared/stats-grid";
import { FileText, Clock, CheckCircle } from "lucide-react";

const getStatusVariant = (status: RfqStatus) => {
    switch (status) {
        case 'Draft': return 'secondary';
        case 'Pending Approval': return 'outline';
        case 'Bidding Open': return 'default';
        case 'Operator Selected': 'default';
        case 'Confirmed': return 'default';
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


export function CustomerDashboard() {
  const { rfqs } = getMockDataForRole('Customer');

  const stats = {
    active: rfqs.filter(r => r.status === 'Bidding Open').length,
    pending: rfqs.filter(r => r.status === 'Pending Approval' || r.status === 'Operator Selected').length,
    completed: rfqs.filter(r => r.status === 'Confirmed').length
  }

  return (
    <>
      <PageHeader title="Customer Dashboard" description="Manage your charter requests and view their status.">
        <CreateRfqDialog />
      </PageHeader>
      
      <StatsGrid>
        <StatsCard title="Total RFQs" value={rfqs.length.toString()} icon={FileText} description="All requests submitted" />
        <StatsCard title="Active Bidding" value={stats.active.toString()} icon={Clock} description="RFQs currently open for bids" />
        <StatsCard title="Awaiting Action" value={stats.pending.toString()} icon={Clock} description="RFQs pending your selection" />
        <StatsCard title="Confirmed Trips" value={stats.completed.toString()} icon={CheckCircle} description="Successfully confirmed charters" />
      </StatsGrid>

      <Card>
        <CardHeader>
          <CardTitle>Recent Charter RFQs</CardTitle>
          <CardDescription>
            A list of your most recent charter requests.
          </CardDescription>
        </CardHeader>
        <CardContent>
            <Table>
                <TableHeader>
                <TableRow>
                    <TableHead>RFQ ID</TableHead>
                    <TableHead>Route</TableHead>
                    <TableHead>Departure Date</TableHead>
                    <TableHead>PAX</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Bids</TableHead>
                    <TableHead>
                    <span className="sr-only">Actions</span>
                    </TableHead>
                </TableRow>
                </TableHeader>
                <TableBody>
                {rfqs.map((rfq: CharterRFQ) => (
                    <TableRow key={rfq.id}>
                        <TableCell className="font-medium font-code">{rfq.id}</TableCell>
                        <TableCell>{rfq.departure} to {rfq.arrival}</TableCell>
                        <TableCell>{rfq.departureDate}</TableCell>
                        <TableCell>{rfq.pax}</TableCell>
                        <TableCell>
                            <Badge variant={getStatusVariant(rfq.status)}>
                                <span className={cn("mr-2 h-2 w-2 rounded-full", getStatusColor(rfq.status))}></span>
                                {rfq.status}
                            </Badge>
                        </TableCell>
                        <TableCell>{rfq.bidsCount}</TableCell>
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
                                <DropdownMenuItem>View Details</DropdownMenuItem>
                                <DropdownMenuItem>Compare Bids</DropdownMenuItem>
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
