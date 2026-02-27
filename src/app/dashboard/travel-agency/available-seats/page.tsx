'use client';
import { PageHeader } from "@/components/dashboard/shared/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import type { EmptyLeg } from "@/lib/types";
import { Plane, Users, Calendar, Search, Filter, Info, Share2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCollection, useFirestore, useMemoFirebase } from "@/firebase";
import { collection, query, where } from "firebase/firestore";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";
import { RequestSeatAllocationDialog } from "@/components/dashboard/travel-agency/request-seat-allocation-dialog";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

const OpportunityCard = ({ leg, onAction }: { leg: EmptyLeg, onAction: () => void }) => (
    <Card className="bg-card flex flex-col group hover:border-accent/40 transition-all duration-300 w-full max-w-3xl mx-auto overflow-hidden">
        <CardHeader className="pb-3 pt-6 px-8">
            <div className="flex justify-between items-center mb-4">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-accent">
                    {leg.operatorName || 'Private Operator'}
                </span>
                <span className="text-[10px] font-bold text-muted-foreground">
                    {leg.aircraftName || 'Jet Opportunity'}
                </span>
            </div>
            <CardTitle className="text-2xl md:text-3xl font-headline font-bold text-white text-center py-4">
                {leg.departure} <span className="text-accent/40 px-2">—</span> {leg.arrival}
            </CardTitle>
        </CardHeader>
        <CardContent className="flex-grow space-y-6 px-8">
            <div className="flex flex-wrap items-center justify-center gap-8">
                <div className="flex flex-col items-center gap-1">
                    <p className="text-[9px] uppercase font-black text-muted-foreground tracking-[0.2em]">Positioning Date</p>
                    <div className="flex items-center text-base text-foreground font-medium">
                        <Calendar className="h-4 w-4 mr-2 text-accent/60" />
                        <span>{new Date(leg.departureTime).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                    </div>
                </div>
                <div className="flex flex-col items-center gap-1">
                    <p className="text-[9px] uppercase font-black text-muted-foreground tracking-[0.2em]">Recoverable Seats</p>
                    <div className="flex items-center text-base text-green-500 font-black">
                        <Users className="h-4 w-4 mr-2 text-accent/60" />
                        <span>{leg.availableSeats} Seats Available</span>
                    </div>
                </div>
            </div>
            
            <div className="p-4 bg-muted/20 rounded-xl border border-white/5 italic text-xs text-muted-foreground text-center flex items-center justify-center gap-3">
                <Info className="h-4 w-4 shrink-0 text-accent/40" />
                Subject to positioning window and operator confirmation.
            </div>
        </CardContent>
        <Separator className="bg-white/5 mx-8" />
        <CardFooter className="py-6 px-8 flex gap-4">
            <Button variant="outline" size="icon" className="h-12 w-12 border-white/10 text-muted-foreground hover:text-accent hover:bg-accent/10 shrink-0">
                <Share2 className="h-5 w-5" />
            </Button>
            <Button onClick={onAction} className="flex-1 h-12 text-xs bg-accent text-accent-foreground hover:bg-accent/90 font-black uppercase tracking-[0.2em] shadow-xl shadow-accent/5">
                Request Seat Block
            </Button>
        </CardFooter>
    </Card>
);

export default function AvailableSeatsPage() {
  const firestore = useFirestore();
  const [legToRequest, setLegToRequest] = useState<EmptyLeg | null>(null);
  const [search, setSearch] = useState('');

  const emptyLegsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'emptyLegs'), where('status', 'in', ['Approved', 'Published']));
  }, [firestore]);
  
  const { data: allEmptyLegs, isLoading } = useCollection<EmptyLeg>(emptyLegsQuery, 'emptyLegs');
  
  const filteredLegs = allEmptyLegs?.filter(leg => 
    leg.departure.toLowerCase().includes(search.toLowerCase()) || 
    leg.arrival.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto space-y-10">
      <PageHeader title="Approved Jet Seats" description="Browse allocatable inventory from verified network operators. No instant bookings; all requests are subject to institutional coordination." />
      
      <div className="flex flex-col md:flex-row gap-4 max-w-3xl mx-auto">
        <div className="relative flex-grow">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
                placeholder="Search by sector (e.g. Mumbai)..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-11 bg-muted/20 border-white/10 h-12 text-base"
            />
        </div>
        <Button variant="outline" className="h-12 px-6 gap-2 border-white/10 font-bold uppercase text-xs tracking-widest shrink-0">
            <Filter className="h-4 w-4" />
            Market Filters
        </Button>
      </div>

      {isLoading ? (
        <div className="grid gap-8">
            <Skeleton className="h-80 w-full max-w-3xl mx-auto" />
            <Skeleton className="h-80 w-full max-w-3xl mx-auto" />
        </div>
      ) : (
        <>
            {filteredLegs && filteredLegs.length > 0 ? (
                <div className="grid gap-10 items-center justify-center">
                    {filteredLegs.map(leg => (
                        <OpportunityCard key={leg.id} leg={leg} onAction={() => setLegToRequest(leg)} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-24 border-2 border-dashed rounded-xl bg-card/20 border-white/5 max-w-3xl mx-auto">
                    <div className="p-6 bg-muted/20 w-fit mx-auto rounded-full mb-6">
                        <Plane className="h-12 w-12 text-muted-foreground/40"/>
                    </div>
                    <h3 className="text-xl font-bold text-white uppercase tracking-widest">No sector matches</h3>
                    <p className="mt-2 text-sm text-muted-foreground max-w-sm mx-auto italic">
                        Adjust your parameters or standby for operator updates.
                    </p>
                </div>
            )}
        </>
      )}

      <RequestSeatAllocationDialog 
        emptyLeg={legToRequest}
        open={!!legToRequest}
        onOpenChange={(open) => !open && setLegToRequest(null)}
      />
    </div>
  );
}
