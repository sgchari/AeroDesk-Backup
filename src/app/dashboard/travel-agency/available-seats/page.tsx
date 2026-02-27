
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
    <Card className="bg-card flex flex-col group hover:border-accent/40 transition-all duration-300">
        <CardHeader className="pb-3 pt-5 px-5">
            <div className="flex justify-between items-center mb-2">
                <span className="text-[9px] font-black uppercase tracking-[0.15em] text-accent">
                    {leg.operatorName || 'Private Operator'}
                </span>
                <span className="text-[9px] font-bold text-muted-foreground">
                    {leg.aircraftName || 'Jet Opportunity'}
                </span>
            </div>
            <CardTitle className="text-base flex items-center flex-wrap gap-x-2 leading-tight font-headline font-bold">
                <span className="text-white">{leg.departure}</span>
                <span className="text-muted-foreground/40 font-light">-</span>
                <span className="text-white">{leg.arrival}</span>
            </CardTitle>
        </CardHeader>
        <CardContent className="flex-grow space-y-4 px-5 text-xs">
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                    <p className="text-[9px] uppercase font-bold text-muted-foreground tracking-tighter">Departure Window</p>
                    <div className="flex items-center gap-2">
                        <Calendar className="h-3.5 w-3.5 text-accent/60" />
                        <span>{new Date(leg.departureTime).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
                    </div>
                </div>
                <div className="space-y-1">
                    <p className="text-[9px] uppercase font-bold text-muted-foreground tracking-tighter">Availability</p>
                    <div className="flex items-center gap-2">
                        <Users className="h-3.5 w-3.5 text-accent/60" />
                        <span className="font-bold text-green-500">{leg.availableSeats} Seats</span>
                    </div>
                </div>
            </div>
            
            <div className="p-2.5 bg-muted/20 rounded border border-white/5 italic text-[10px] text-muted-foreground leading-relaxed">
                <p className="flex items-start gap-2">
                    <Info className="h-3 w-3 mt-0.5 shrink-0" />
                    Subject to positioning window and operator confirmation.
                </p>
            </div>
        </CardContent>
        <Separator className="bg-white/5" />
        <CardFooter className="py-3 px-5 flex gap-2">
            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-accent">
                <Share2 className="h-4 w-4" />
            </Button>
            <Button onClick={onAction} className="flex-1 h-9 text-xs bg-accent text-accent-foreground hover:bg-accent/90 font-bold">
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
    <div className="max-w-7xl mx-auto">
      <PageHeader title="Approved Jet Seats" description="Browse allocatable inventory from verified network operators. No instant bookings; all requests are subject to coordination." />
      
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
                placeholder="Search by sector (e.g. Mumbai)..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 bg-muted/20 border-white/10 h-11"
            />
        </div>
        <Button variant="outline" className="h-11 gap-2 border-white/10">
            <Filter className="h-4 w-4" />
            Inventory Filters
        </Button>
      </div>

      {isLoading ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-64 w-full" />
        </div>
      ) : (
        <>
            {filteredLegs && filteredLegs.length > 0 ? (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {filteredLegs.map(leg => (
                        <OpportunityCard key={leg.id} leg={leg} onAction={() => setLegToRequest(leg)} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-20 border-2 border-dashed rounded-lg bg-card/20">
                    <div className="p-4 bg-muted/20 w-fit mx-auto rounded-full mb-4">
                        <Plane className="h-10 w-10 text-muted-foreground/40"/>
                    </div>
                    <h3 className="text-lg font-semibold">No matches found</h3>
                    <p className="mt-1 text-sm text-muted-foreground max-w-xs mx-auto">
                        Adjust your search or check back later for new operator-published inventory.
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
