
'use client';
import { PageHeader } from "@/components/dashboard/shared/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { CharterRFQ, RfqStatus } from "@/lib/types";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useCollection, useFirestore, useMemoFirebase } from "@/firebase";
import { collection, query, where } from "firebase/firestore";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

const getStatusVariant = (status: RfqStatus) => {
    switch (status) {
        case 'New': return 'default';
        case 'Bidding Open': return 'default';
        case 'Reviewing': return 'secondary';
        case 'Quoted': return 'success';
        case 'Closed': return 'outline';
        default: return 'secondary';
    }
}

export default function RfqMarketplacePage() {
  const firestore = useFirestore();
  const rfqsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'charterRFQs'));
  }, [firestore]);
  const { data: rfqs, isLoading } = useCollection<CharterRFQ>(rfqsQuery, 'charterRFQs');

  return (
    <>
      <PageHeader title="Charter Requests Management" description="Replace email chaos. Review all active charter requests and submit your quotations.">
         <Button>Submit General Quotation</Button>
      </PageHeader>
      <Card className="bg-background">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>All Charter Requests</CardTitle>
              <CardDescription>
                Charter requests currently open for bidding or in review.
              </CardDescription>
            </div>
            <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                    type="search"
                    placeholder="Search by route or ID..."
                    className="pl-8 sm:w-[300px] bg-background"
                />
            </div>
          </div>
        </CardHeader>
        <CardContent>
            {isLoading ? <Skeleton className="h-64 w-full" /> : (
            <Table>
                <TableHeader>
                <TableRow>
                    <TableHead>Request ID</TableHead>
                    <TableHead>Route / Sector</TableHead>
                    <TableHead>Aircraft Category</TableHead>
                    <TableHead>Pax</TableHead>
                    <TableHead>Trip Type</TableHead>
                    <TableHead>Requested Schedule</TableHead>
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
                        <TableCell>{rfq.departure} to {rfq.arrival}</TableCell>
                        <TableCell>{rfq.aircraftType}</TableCell>
                        <TableCell className="text-center">{rfq.pax}</TableCell>
                        <TableCell>{rfq.tripType}</TableCell>
                        <TableCell>{rfq.departureDate}</TableCell>
                        <TableCell>
                            <Badge variant={getStatusVariant(rfq.status)}>{rfq.status}</Badge>
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
                                <DropdownMenuItem>View Details</DropdownMenuItem>
                                <DropdownMenuItem>Submit Quotation</DropdownMenuItem>
                                <DropdownMenuItem>Flag Constraints</DropdownMenuItem>
                                <DropdownMenuItem className="text-destructive">Decline Request</DropdownMenuItem>
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
