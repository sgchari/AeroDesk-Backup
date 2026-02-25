
'use client';
import { PageHeader } from "@/components/dashboard/shared/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { CharterRFQ } from "@/lib/types";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useCollection, useFirestore, useMemoFirebase } from "@/firebase";
import { collection, query, where } from "firebase/firestore";
import { Skeleton } from "@/components/ui/skeleton";

export default function RfqMarketplacePage() {
  const firestore = useFirestore();
  const rfqsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'charterRFQs'), where('status', '==', 'Bidding Open'));
  }, [firestore]);
  const { data: rfqs, isLoading } = useCollection<CharterRFQ>(rfqsQuery, 'charterRFQs');

  return (
    <>
      <PageHeader title="RFQ Marketplace" description="View all active charter requests and submit your quotations." />
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Bidding Open</CardTitle>
              <CardDescription>
                Charter requests currently open for bidding.
              </CardDescription>
            </div>
            <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                    type="search"
                    placeholder="Search by route or ID..."
                    className="pl-8 sm:w-[300px]"
                />
            </div>
          </div>
        </CardHeader>
        <CardContent>
            {isLoading ? <Skeleton className="h-64 w-full" /> : (
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
                        <TableCell className="text-center">{rfq.pax}</TableCell>
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
            )}
        </CardContent>
      </Card>
    </>
  );
}
