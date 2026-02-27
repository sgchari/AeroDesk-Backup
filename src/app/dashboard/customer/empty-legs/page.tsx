
'use client';

import { PageHeader } from "@/components/dashboard/shared/page-header";
import { useCollection, useFirestore, useMemoFirebase } from "@/firebase";
import { collection, query } from "firebase/firestore";
import type { EmptyLeg } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Calendar, Plane, Info, Share2, ArrowRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

const EmptyLegCard = ({ leg }: { leg: EmptyLeg }) => {
    const { toast } = useToast();
    const handleRequestSeats = (legId: string) => {
        toast({
            title: "Seat Allocation Request Sent",
            description: `Your request for seats on flight ${legId} is subject to operator confirmation.`,
        });
    };

    return (
        <Card className="bg-card flex flex-col group hover:border-accent/40 transition-all duration-300 min-h-[320px]">
            <CardHeader className="pb-3 pt-6 px-6">
                <div className="flex justify-between items-center mb-3">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-accent truncate max-w-[60%]">
                        {leg.operatorName || 'Private Operator'}
                    </span>
                    <span className="text-[10px] font-bold text-muted-foreground truncate max-w-[35%]">
                        {leg.aircraftName || 'Private Jet'}
                    </span>
                </div>
                <CardTitle className="text-lg font-headline font-bold text-white whitespace-nowrap truncate overflow-hidden flex items-center gap-2">
                    {leg.departure} <span className="text-muted-foreground/40 font-light">-</span> {leg.arrival}
                </CardTitle>
            </CardHeader>
            <CardContent className="flex-grow space-y-5 px-6">
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <p className="text-[9px] uppercase font-black text-muted-foreground tracking-widest">Departure</p>
                        <div className="flex items-center text-sm text-foreground">
                            <Calendar className="mr-2 h-3.5 w-3.5 text-accent/60" />
                            <span>{new Date(leg.departureTime).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
                        </div>
                    </div>
                    <div className="space-y-1">
                        <p className="text-[9px] uppercase font-black text-muted-foreground tracking-widest">Availability</p>
                        <div className="flex items-center text-sm text-green-500 font-bold">
                            <Users className="mr-2 h-3.5 w-3.5 text-accent/60" />
                            <span>{leg.availableSeats} Seats</span>
                        </div>
                    </div>
                </div>

                <div className="p-3 bg-muted/20 rounded border border-white/5 italic text-[11px] text-muted-foreground leading-relaxed">
                    <p className="flex items-start gap-2">
                        <Info className="h-3.5 w-3.5 mt-0.5 shrink-0 text-accent/40" />
                        Subject to positioning window and operator confirmation.
                    </p>
                </div>
            </CardContent>
            <Separator className="bg-white/5 mx-6" />
            <CardFooter className="pb-6 pt-4 px-6 gap-3">
                <Button variant="ghost" size="icon" className="h-10 w-10 text-muted-foreground hover:text-accent hover:bg-accent/10">
                    <Share2 className="h-4 w-4" />
                </Button>
                <Button className="flex-1 bg-accent text-accent-foreground hover:bg-accent/90 font-black uppercase text-[10px] tracking-widest h-10" onClick={() => handleRequestSeats(leg.id)}>
                    Request Seat Access
                </Button>
            </CardFooter>
        </Card>
    );
};


export default function AvailableJetSeatsPage() {
    const firestore = useFirestore();
    const emptyLegsQuery = useMemoFirebase(() => {
        if (!firestore) return null;
        return query(collection(firestore, 'emptyLegs'));
    }, [firestore]);
    const { data: allEmptyLegs, isLoading } = useCollection<EmptyLeg>(emptyLegsQuery, 'emptyLegs');

    const availableLegs = allEmptyLegs?.filter(leg => leg.status === 'Approved' || leg.status === 'Published');

    return (
        <div className="max-w-7xl mx-auto">
            <PageHeader
                title="Available Jet Seats"
                description="Explore exclusive empty leg opportunities. Seat allocations are managed via authorized distributors or direct request."
            />
            {isLoading ? (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    <Skeleton className="h-80 w-full" />
                    <Skeleton className="h-80 w-full" />
                    <Skeleton className="h-80 w-full" />
                </div>
            ) : (
                <>
                    {availableLegs && availableLegs.length > 0 ? (
                        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                            {availableLegs.map(leg => (
                                <EmptyLegCard key={leg.id} leg={leg} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-24 border-2 border-dashed rounded-xl bg-card/20 border-white/5">
                             <div className="p-5 bg-muted/20 w-fit mx-auto rounded-full mb-6">
                                <Plane className="h-12 w-12 text-muted-foreground/40"/>
                            </div>
                             <p className="text-muted-foreground">There are currently no active empty leg opportunities synchronized.</p>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
