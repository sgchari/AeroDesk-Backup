
'use client';
import { PageHeader } from "@/components/dashboard/shared/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { CharterRFQ, RfqStatus } from "@/lib/types";
import { MoreHorizontal, Search, Gavel, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { useCollection, useFirestore, useMemoFirebase } from "@/firebase";
import { collection, query } from "firebase/firestore";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { SubmitQuotationDialog } from "@/components/dashboard/operator/submit-quotation-dialog";

const getStatusVariant = (status: RfqStatus) => {
    switch (status) {
        case 'New':
        case 'Bidding Open': return 'default';
        case 'Reviewing': return 'secondary';
        case 'Quoted': return 'success';
        case 'Closed': return 'outline';
        default: return 'secondary';
    }
}

export default function RfqMarketplacePage() {
  const firestore = useFirestore();
  const [selectedRfq, setSelectedRfq] = useState<CharterRFQ | null>(null);

  const rfqsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'charterRFQs'));
  }, [firestore]);
  const { data: rfqs, isLoading } = useCollection<CharterRFQ>(rfqsQuery, 'charterRFQs');

  return (
    <>
      <PageHeader title="Charter Marketplace" description="Review all active charter requests and submit institutional quotations.">
         <Button variant="outline" className="gap-2"><FileText className="h-4 w-4" /> Export Queue</Button>
      </PageHeader>
      
      <Card className="bg-card">
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <CardTitle>Open Demand Queue</CardTitle>
              <CardDescription>
                Live charter requests open for operator bidding.
              </CardDescription>
            </div>
            <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                    type="search"
                    placeholder="Search by route or ID..."
                    className="pl-8 sm:w-[300px] bg-muted/20 border-white/5"
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
                    <TableHead>Aircraft Pref</TableHead>
                    <TableHead className="text-center">Pax</TableHead>
                    <TableHead>Requested Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                </TableRow>
                </TableHeader>
                <TableBody>
                {rfqs?.map((rfq: CharterRFQ) => (
                    <TableRow key={rfq.id}>
                        <TableCell className="font-medium font-code">{rfq.id}</TableCell>
                        <TableCell>{rfq.departure} to {rfq.arrival}</TableCell>
                        <TableCell>{rfq.aircraftType}</TableCell>
                        <TableCell className="text-center">{rfq.pax}</TableCell>
                        <TableCell>{new Date(rfq.departureDate).toLocaleDateString()}</TableCell>
                        <TableCell>
                            <Badge variant={getStatusVariant(rfq.status)} className="text-[10px] h-5 px-1.5 uppercase font-bold tracking-wider">
                                {rfq.status}
                            </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                <Button size="icon" variant="ghost">
                                    <MoreHorizontal className="h-4 w-4" />
                                </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Coordination Actions</DropdownMenuLabel>
                                <DropdownMenuItem onClick={() => setSelectedRfq(rfq)} className="gap-2">
                                    <Gavel className="h-3.5 w-3.5" /> Submit Quotation
                                </DropdownMenuItem>
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

      <SubmitQuotationDialog 
        rfq={selectedRfq}
        open={!!selectedRfq}
        onOpenChange={(open) => !open && setSelectedRfq(null)}
      />
    </>
  );
}
