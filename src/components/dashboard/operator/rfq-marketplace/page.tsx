
'use client';
import { PageHeader } from "@/components/dashboard/shared/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { CharterRFQ, RfqStatus } from "@/lib/types";
import { MoreHorizontal, Search, Gavel, FileText, Plane, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { useCollection, useFirestore, useMemoFirebase } from "@/firebase";
import { collection, query, where } from "firebase/firestore";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { SubmitQuotationDialog } from "@/components/dashboard/operator/submit-quotation-dialog";
import { SystemAdvisory } from "@/components/dashboard/operator/system-advisory";
import Link from 'next/link';

export default function RfqMarketplacePage() {
  const firestore = useFirestore();
  const [selectedRfq, setSelectedRfq] = useState<CharterRFQ | null>(null);
  const [search, setSearch] = useState("");

  const rfqsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'charterRequests'));
  }, [firestore]);
  
  const { data: rfqs, isLoading } = useCollection<CharterRFQ>(rfqsQuery, 'charterRequests');

  const filteredRfqs = rfqs?.filter(r => 
    (r.status === 'Bidding Open' || r.status === 'New') && (
        r.departure.toLowerCase().includes(search.toLowerCase()) || 
        r.arrival.toLowerCase().includes(search.toLowerCase()) ||
        r.id.toLowerCase().includes(search.toLowerCase())
    )
  );

  return (
    <>
      <PageHeader title="Charter Marketplace" description="Review active charter demand and submit institutional quotations.">
         <Button variant="outline" className="gap-2 border-white/10"><FileText className="h-4 w-4" /> Export Queue</Button>
      </PageHeader>
      
      <Card className="bg-card">
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <CardTitle>Open Demand Queue</CardTitle>
              <CardDescription>
                Synchronized requests currently open for operator bidding.
              </CardDescription>
            </div>
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                    type="search"
                    placeholder="Filter by sector or ID..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-9 sm:w-[300px] bg-muted/20 border-white/5"
                />
            </div>
          </div>
        </CardHeader>
        <CardContent>
            {isLoading ? <Skeleton className="h-64 w-full" /> : (
                <>
                {filteredRfqs && filteredRfqs.length > 0 ? (
                    <Table>
                        <TableHeader>
                        <TableRow>
                            <TableHead>Request ID</TableHead>
                            <TableHead>Route / Sector</TableHead>
                            <TableHead>Asset Pref</TableHead>
                            <TableHead className="text-center">Pax</TableHead>
                            <TableHead>Requested Date</TableHead>
                            <TableHead>Profile</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                        </TableHeader>
                        <TableBody>
                        {filteredRfqs.map((rfq: CharterRFQ) => (
                            <TableRow key={rfq.id} className="group">
                                <TableCell className="font-medium font-code text-xs">{rfq.id}</TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        <Plane className="h-3 w-3 text-accent/60" />
                                        <span className="text-sm">{rfq.departure} to {rfq.arrival}</span>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <Badge variant="outline" className="text-[9px] uppercase font-bold tracking-tighter">
                                        {rfq.aircraftType}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-center font-bold">{rfq.pax}</TableCell>
                                <TableCell className="text-xs text-muted-foreground">{new Date(rfq.departureDate).toLocaleDateString()}</TableCell>
                                <TableCell>
                                    {rfq.company ? (
                                        <Badge variant="secondary" className="h-5 text-[8px] gap-1 uppercase">
                                            <Briefcase className="h-2.5 w-2.5" /> Corporate
                                        </Badge>
                                    ) : (
                                        <Badge variant="outline" className="h-5 text-[8px] uppercase">Individual</Badge>
                                    )}
                                </TableCell>
                                <TableCell className="text-right">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                        <Button size="icon" variant="ghost" className="h-8 w-8">
                                            <MoreHorizontal className="h-4 w-4" />
                                        </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                        <DropdownMenuLabel>Marketplace Actions</DropdownMenuLabel>
                                        <DropdownMenuItem onClick={() => setSelectedRfq(rfq)} className="gap-2">
                                            <Gavel className="h-3.5 w-3.5 text-accent" /> Submit Quotation
                                        </DropdownMenuItem>
                                        <DropdownMenuItem className="text-destructive">Decline Request</DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))}
                        </TableBody>
                    </Table>
                ) : (
                    <div className="text-center py-20 border-2 border-dashed rounded-lg bg-muted/5">
                        <Gavel className="mx-auto h-10 w-10 text-muted-foreground/20 mb-4" />
                        <p className="text-muted-foreground font-medium">No active demand found.</p>
                        <p className="text-[10px] text-muted-foreground/60 uppercase tracking-widest mt-1">Marketplace synchronized • Standing by</p>
                    </div>
                )}
                </>
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
