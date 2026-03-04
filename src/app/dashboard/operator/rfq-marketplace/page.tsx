
'use client';
import { PageHeader } from "@/components/dashboard/shared/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { CharterRFQ, RfqStatus } from "@/lib/types";
import { MoreHorizontal, Search, Gavel, FileText, Plane, Briefcase, TrendingUp, Target, XCircle, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { useCollection, useFirestore, useMemoFirebase } from "@/firebase";
import { collection, query, where } from "firebase/firestore";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { useState, useMemo } from "react";
import { SubmitQuotationDialog } from "@/components/dashboard/operator/submit-quotation-dialog";
import { SystemAdvisory } from "@/components/dashboard/operator/system-advisory";
import { StatsGrid } from "@/components/dashboard/shared/stats-grid";
import { StatsCard } from "@/components/dashboard/shared/stats-card";

export default function RfqMarketplacePage() {
  const firestore = useFirestore();
  const [selectedRfq, setSelectedRfq] = useState<CharterRFQ | null>(null);
  const [search, setSearch] = useState("");

  const rfqsQuery = useMemoFirebase(() => {
    if (!firestore || (firestore as any)._isMock) return null;
    return query(collection(firestore, 'charterRequests'));
  }, [firestore]);
  
  const { data: rfqs, isLoading } = useCollection<CharterRFQ>(rfqsQuery, 'charterRequests');

  const filteredRfqs = useMemo(() => {
    return rfqs?.filter(r => 
        (r.status === 'Bidding Open' || r.status === 'New') && (
            r.departure.toLowerCase().includes(search.toLowerCase()) || 
            r.arrival.toLowerCase().includes(search.toLowerCase()) ||
            r.id.toLowerCase().includes(search.toLowerCase())
        )
    );
  }, [rfqs, search]);

  const stats = useMemo(() => {
    const total = rfqs?.length || 0;
    const won = rfqs?.filter(r => ['charterConfirmed', 'boarding', 'departed', 'arrived', 'flightCompleted', 'tripClosed'].includes(r.status)).length || 0;
    const lost = rfqs?.filter(r => r.status === 'Closed' || r.status === 'cancelled').length || 0;
    const active = filteredRfqs?.length || 0;
    const conversion = total > 0 ? ((won / total) * 100).toFixed(1) : "0.0";

    return { active, won, lost, conversion };
  }, [rfqs, filteredRfqs]);

  return (
    <>
      <PageHeader title="Charter Demand Center" description="Global marketplace for institutional charter demand. Review synchronized leads and publish technical bids.">
         <Button variant="outline" className="gap-2 border-white/10 text-[10px] font-black uppercase tracking-widest">
            <FileText className="h-4 w-4" /> Export Operations Log
         </Button>
      </PageHeader>

      <StatsGrid>
        <StatsCard title="Active Demand" value={stats.active.toString()} icon={TrendingUp} description="RFQs open for bidding" />
        <StatsCard title="Missions Secured" value={stats.won.toString()} icon={CheckCircle2} description="Accepted quotations" />
        <StatsCard title="Lost Opportunities" value={stats.lost.toString()} icon={XCircle} description="Closed or lost leads" />
        <StatsCard title="Win Efficiency" value={`${stats.conversion}%`} icon={Target} description="Lead conversion ratio" />
      </StatsGrid>
      
      <div className="grid gap-6 mt-6">
        <Card className="bg-card">
            <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                <CardTitle>Marketplace Synchronization Feed</CardTitle>
                <CardDescription>
                    Real-time demand signals from private and corporate coordination desks.
                </CardDescription>
                </div>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder="Filter by sector or ID..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-9 sm:w-[300px] bg-muted/20 border-white/5 h-9 text-xs"
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
                            <TableRow className="border-white/5">
                                <TableHead className="text-[10px] uppercase font-black">Request ID</TableHead>
                                <TableHead className="text-[10px] uppercase font-black">Route / Sector</TableHead>
                                <TableHead className="text-[10px] uppercase font-black">Asset Pref</TableHead>
                                <TableHead className="text-[10px] uppercase font-black text-center">Pax</TableHead>
                                <TableHead className="text-[10px] uppercase font-black">Bids</TableHead>
                                <TableHead className="text-[10px] uppercase font-black">Profile</TableHead>
                                <TableHead className="text-right pr-6"><span className="sr-only">Actions</span></TableHead>
                            </TableRow>
                            </TableHeader>
                            <TableBody>
                            {filteredRfqs.map((rfq: CharterRFQ) => (
                                <TableRow key={rfq.id} className="border-white/5 hover:bg-white/[0.02] group">
                                    <TableCell className="font-medium font-code text-xs py-4">{rfq.id}</TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <Plane className="h-3.5 w-3.5 text-accent/60" />
                                            <span className="text-xs font-bold text-foreground">{rfq.departure} to {rfq.arrival}</span>
                                        </div>
                                        <p className="text-[9px] text-muted-foreground mt-0.5">{new Date(rfq.departureDate).toLocaleDateString()} @ {rfq.departureTime}</p>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className="text-[9px] uppercase font-bold tracking-tighter border-white/10 group-hover:border-accent/30">
                                            {rfq.aircraftType}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-center font-black text-xs">{rfq.pax}</TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-1.5">
                                            <div className={cn("w-1.5 h-1.5 rounded-full", (rfq.bidsCount || 0) > 3 ? "bg-rose-500" : "bg-green-500")} />
                                            <span className="text-[10px] font-bold text-white">{rfq.bidsCount || 0}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        {rfq.company ? (
                                            <Badge variant="secondary" className="h-5 text-[8px] gap-1 uppercase font-black bg-blue-500/10 text-blue-400 border-none">
                                                <Briefcase className="h-2.5 w-2.5" /> Corporate
                                            </Badge>
                                        ) : (
                                            <Badge variant="outline" className="h-5 text-[8px] uppercase font-black border-white/10">Individual</Badge>
                                        )}
                                    </TableCell>
                                    <TableCell className="text-right pr-6">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                            <Button size="icon" variant="ghost" className="h-8 w-8 hover:bg-white/10">
                                                <MoreHorizontal className="h-4 w-4" />
                                            </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                            <DropdownMenuLabel>Marketplace Controls</DropdownMenuLabel>
                                            <DropdownMenuItem onClick={() => setSelectedRfq(rfq)} className="gap-2">
                                                <Gavel className="h-3.5 w-3.5 text-accent" /> Publish Technical Bid
                                            </DropdownMenuItem>
                                            <DropdownMenuItem className="text-destructive gap-2">
                                                <XCircle className="h-3.5 w-3.5" /> Decline Lead
                                            </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))}
                            </TableBody>
                        </Table>
                    ) : (
                        <div className="text-center py-24 border-2 border-dashed rounded-lg bg-muted/5 opacity-60">
                            <Gavel className="mx-auto h-12 w-12 text-muted-foreground/20 mb-4" />
                            <p className="text-xs text-muted-foreground uppercase font-black tracking-[0.2em]">Queue Synchronized</p>
                            <p className="text-[10px] text-muted-foreground mt-1">No active demand in the current corridor sector.</p>
                        </div>
                    )}
                    </>
                )}
            </CardContent>
        </Card>

        {filteredRfqs && filteredRfqs.length > 0 && (
            <SystemAdvisory 
                level="INFO"
                title="Market Concentration Signal"
                message="High demand intensity detected for North Zone (Delhi NCR) heavy-jet missions. Optimal win-probability identified for quotations submitted with < 2 hour latency."
            />
        )}
      </div>

      <SubmitQuotationDialog 
        rfq={selectedRfq}
        open={!!selectedRfq}
        onOpenChange={(open) => !open && setSelectedRfq(null)}
      />
    </>
  );
}
