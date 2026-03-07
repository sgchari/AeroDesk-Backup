'use client';

import { PageHeader } from "@/components/dashboard/shared/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { CharterRFQ } from "@/lib/types";
import { MoreHorizontal, Search, Gavel, FileText, Plane, Briefcase, TrendingUp, Target, XCircle, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { useCollection, useFirestore, useMemoFirebase } from "@/firebase";
import { collection, query } from "firebase/firestore";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import React, { useState, useMemo, memo } from "react";
import { SubmitQuotationDialog } from "@/components/dashboard/operator/submit-quotation-dialog";
import { SystemAdvisory } from "@/components/dashboard/operator/system-advisory";
import { StatsGrid } from "@/components/dashboard/shared/stats-grid";
import { StatsCard } from "@/components/dashboard/shared/stats-card";
import { cn } from "@/lib/utils";

/**
 * RFQ Marketplace Hub for Operators.
 * Optimized for institutional high-frequency data updates.
 */
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
    if (!rfqs) return [];
    return rfqs.filter(r => {
        if (!r || !r.status || !r.departure || !r.arrival) return false;
        
        const isLiveDemand = ['Bidding Open', 'New', 'rfqSubmitted'].includes(r.status);
        const matchesSearch = 
            r.departure.toLowerCase().includes(search.toLowerCase()) || 
            r.arrival.toLowerCase().includes(search.toLowerCase()) ||
            r.id.toLowerCase().includes(search.toLowerCase());
            
        return isLiveDemand && matchesSearch;
    });
  }, [rfqs, search]);

  const stats = useMemo(() => {
    if (!rfqs) return { active: 0, won: 0, lost: 0, conversion: "0.0" };
    const total = rfqs.length || 0;
    const won = rfqs.filter(r => r && ['charterConfirmed', 'boarding', 'departed', 'arrived', 'flightCompleted', 'tripClosed'].includes(r.status)).length || 0;
    const lost = rfqs.filter(r => r && (r.status === 'Closed' || r.status === 'cancelled')).length || 0;
    const active = filteredRfqs.length || 0;
    const conversion = total > 0 ? ((won / total) * 100).toFixed(1) : "0.0";

    return { active, won, lost, conversion };
  }, [rfqs, filteredRfqs]);

  return (
    <div className="space-y-6">
      <PageHeader title="Charter Demand Center" description="Global marketplace for institutional charter demand. Review synchronized leads and publish technical bids.">
         <Button variant="outline" size="sm" className="gap-2 border-white/10 text-[10px] font-black uppercase tracking-widest">
            <FileText className="h-4 w-4" /> Export Operations Log
         </Button>
      </PageHeader>

      <StatsGrid>
        <StatsCard title="Active Demand" value={isLoading ? <Skeleton className="h-6 w-8" /> : stats.active.toString()} icon={TrendingUp} description="RFQs open for bidding" />
        <StatsCard title="Missions Secured" value={isLoading ? <Skeleton className="h-6 w-8" /> : stats.won.toString()} icon={CheckCircle2} description="Accepted quotations" />
        <StatsCard title="Lost Opportunities" value={isLoading ? <Skeleton className="h-6 w-8" /> : stats.lost.toString()} icon={XCircle} description="Closed or lost leads" />
        <StatsCard title="Win Efficiency" value={isLoading ? <Skeleton className="h-6 w-12" /> : `${stats.conversion}%`} icon={Target} description="Lead conversion ratio" />
      </StatsGrid>
      
      <Card className="bg-card border-white/5">
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
        <CardContent className="px-0 sm:px-6">
            {isLoading ? <div className="p-6"><Skeleton className="h-64 w-full" /></div> : (
                <div className="w-full overflow-x-auto">
                    {filteredRfqs && filteredRfqs.length > 0 ? (
                        <Table className="min-w-[850px]">
                            <TableHeader>
                            <TableRow className="border-white/5">
                                <TableHead className="text-[10px] uppercase font-black">Request ID</TableHead>
                                <TableHead className="text-[10px] uppercase font-black">Route / Sector</TableHead>
                                <TableHead className="text-[10px] uppercase font-black">Asset Pref</TableHead>
                                <TableHead className="text-[10px] uppercase font-black text-center">Pax</TableHead>
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
                                        {rfq.company ? (
                                            <Badge variant="secondary" className="h-5 text-[8px] gap-1 uppercase font-black bg-blue-500/10 text-blue-400 border-none">
                                                <Briefcase className="h-2.5 w-2.5" /> Corporate
                                            </Badge>
                                        ) : (
                                            <Badge variant="outline" className="h-5 text-[8px] font-black uppercase border-white/10">Individual</Badge>
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
                                            <DropdownMenuItem onClick={() => setSelectedRfq(rfq)} className="gap-2 text-xs">
                                                <Gavel className="h-3.5 w-3.5 text-accent" /> Publish Technical Bid
                                            </DropdownMenuItem>
                                            <DropdownMenuItem className="text-destructive gap-2 text-xs">
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
                        <div className="text-center py-24 border-2 border-dashed rounded-lg bg-muted/5 opacity-60 m-6">
                            <Gavel className="mx-auto h-12 w-12 text-muted-foreground/20 mb-4" />
                            <p className="text-xs text-muted-foreground uppercase font-black tracking-[0.2em]">Queue Synchronized</p>
                            <p className="text-[10px] text-muted-foreground mt-1">No active demand in the current corridor sector.</p>
                        </div>
                    )}
                </div>
            )}
        </CardContent>
      </Card>

      {filteredRfqs.length > 0 && (
          <SystemAdvisory 
              level="INFO"
              title="Market Concentration Signal"
              message="High demand intensity detected for North Zone (Delhi NCR) heavy-jet missions. Optimal win-probability identified for quotations submitted with < 2 hour latency."
          />
      )}

      <SubmitQuotationDialog 
        rfq={selectedRfq}
        open={!!selectedRfq}
        onOpenChange={(open) => !open && setSelectedRfq(null)}
      />
    </div>
  );
}