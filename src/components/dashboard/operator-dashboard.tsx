
'use client';
import { PageHeader } from "@/components/dashboard/shared/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import type { CharterRFQ, Aircraft, Bid } from "@/lib/types";
import { MoreHorizontal, Plane, FileText, CheckCircle, Users } from "lucide-react";
import { Button } from "../ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { StatsCard } from "./shared/stats-card";
import { StatsGrid } from "./shared/stats-grid";
import Link from "next/link";
import { Skeleton } from "../ui/skeleton";
import { useUser } from "@/hooks/use-user";
import { useCollection, useFirestore, useMemoFirebase } from "@/firebase";
import { collection, collectionGroup, query, where } from "firebase/firestore";

export function OperatorDashboard() {
  const { user, isLoading: isUserLoading } = useUser();
  const firestore = useFirestore();

  const rfqsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'charterRFQs'), where('status', '==', 'Bidding Open'));
  }, [firestore]);
  const { data: rfqs, isLoading: rfqsLoading } = useCollection<CharterRFQ>(rfqsQuery);

  const bidsQuery = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return query(collectionGroup(firestore, 'quotations'), where('operatorId', '==', user.id));
  }, [firestore, user]);
  const { data: bids, isLoading: bidsLoading } = useCollection<Bid>(bidsQuery);
  
  const aircraftsQuery = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return collection(firestore, 'operators', user.id, 'aircrafts');
  }, [firestore, user]);
  const { data: aircrafts, isLoading: aircraftsLoading } = useCollection<Aircraft>(aircraftsQuery);

  const isLoading = isUserLoading || rfqsLoading || bidsLoading || aircraftsLoading;

  const stats = {
    marketplaceRfqs: rfqs?.length ?? 0,
    activeBids: bids?.filter(b => b.status === 'Submitted').length ?? 0,
    fleetSize: aircrafts?.length ?? 0,
    totalCrew: 0, // Crew management not yet implemented
  }

  return (
    <>
      <PageHeader title="Operator Console" description="Manage your quotations, fleet, and view marketplace activity.">
        <Button asChild variant="outline"><Link href="/dashboard/operator/fleet">Manage Fleet</Link></Button>
        <Button asChild variant="outline"><Link href="/dashboard/operator/crew">Manage Crew</Link></Button>
        <Button asChild><Link href="/dashboard/operator/empty-legs">Create Empty Leg</Link></Button>
      </PageHeader>
      
      <StatsGrid>
        <StatsCard title="Active RFQs" value={isLoading ? <Skeleton className="h-6 w-12" /> : stats.marketplaceRfqs.toString()} icon={FileText} description="RFQs currently open for bidding" />
        <StatsCard title="Submitted Quotations" value={isLoading ? <Skeleton className="h-6 w-12" /> : stats.activeBids.toString()} icon={CheckCircle} description="Your active quotations" />
        <StatsCard title="Fleet Size" value={isLoading ? <Skeleton className="h-6 w-12" /> : stats.fleetSize.toString()} icon={Plane} description="Total aircraft in your fleet" />
        <StatsCard title="Total Crew" value={isLoading ? <Skeleton className="h-6 w-12" /> : stats.totalCrew.toString()} icon={Users} description="Pilots and cabin crew" />
      </StatsGrid>

      <Card>
        <CardHeader>
          <CardTitle>RFQ Marketplace</CardTitle>
          <CardDescription>
            Charter requests from customers and corporates, open for quotations.
          </CardDescription>
        </CardHeader>
        <CardContent>
           {isLoading ? <Skeleton className="h-40 w-full" /> : (
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
                                <DropdownMenuItem>Withdraw Quotation</DropdownMenuItem>
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
