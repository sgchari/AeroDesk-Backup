import { PageHeader } from "@/components/dashboard/shared/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { getMockDataForRole } from "@/lib/data";
import type { CharterRFQ } from "@/lib/types";
import { MoreHorizontal, Plane, FileText, CheckCircle } from "lucide-react";
import { Button } from "../ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { StatsCard } from "./shared/stats-card";
import { StatsGrid } from "./shared/stats-grid";
import Link from "next/link";

export function OperatorDashboard() {
  const { rfqs, aircrafts, bids } = getMockDataForRole('Operator');

  const stats = {
    marketplaceRfqs: rfqs?.length ?? 0,
    activeBids: bids?.filter(b => b.status === 'Submitted').length ?? 0,
    fleetSize: aircrafts?.length ?? 0,
  }

  return (
    <>
      <PageHeader title="Operator Dashboard" description="Manage your bids, fleet, and view marketplace activity." />
      
      <StatsGrid>
        <StatsCard title="RFQ Marketplace" value={stats.marketplaceRfqs.toString()} icon={FileText} description="RFQs currently open for bidding" />
        <StatsCard title="Active Bids" value={stats.activeBids.toString()} icon={CheckCircle} description="Your submitted bids" />
        <StatsCard title="Fleet Size" value={stats.fleetSize.toString()} icon={Plane} description="Total aircraft in your fleet" />
        <Card>
            <CardHeader className="pb-2">
                <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-2">
                <Button asChild><Link href="/dashboard/operator/fleet">Manage Fleet</Link></Button>
                <Button asChild variant="secondary"><Link href="/dashboard/operator/empty-legs">Create Empty Leg</Link></Button>
            </CardContent>
        </Card>
      </StatsGrid>

      <Card>
        <CardHeader>
          <CardTitle>RFQ Marketplace</CardTitle>
          <CardDescription>
            Charter requests currently open for bidding.
          </CardDescription>
        </CardHeader>
        <CardContent>
            <Table>
                <TableHeader>
                <TableRow>
                    <TableHead>RFQ ID</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Route</TableHead>
                    <TableHead>Departure Date</TableHead>
                    <TableHead>PAX</TableHead>
                    <TableHead>Aircraft Type</TableHead>
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
                        <TableCell>{rfq.pax}</TableCell>
                        <TableCell>{rfq.aircraftType}</TableCell>
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
                                <DropdownMenuItem>Submit Quotation</DropdownMenuItem>
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
