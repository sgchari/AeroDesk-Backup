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
        <Card className="bg-card flex flex-col group hover:border-accent/40 transition-all duration-300 w-full max-w-3xl mx-auto overflow-hidden">
            <CardHeader className="pb-3 pt-6 px-8">
                <div className="flex justify-between items-center mb-4">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-accent">
                        {leg.operatorName || 'Private Operator'}
                    </span>
                    <span className="text-[10px] font-bold text-muted-foreground">
                        {leg.aircraftName || 'Private Jet'}
                    </span>
                </div>
                <CardTitle className="text-2xl md:text-3xl font-headline font-bold text-white text-center py-4">
                    {leg.departure} <span className="text-accent/40 px-2">—</span> {leg.arrival}
                </CardTitle>
            </CardHeader>
            <CardContent className="flex-grow space-y-6 px-8">
                <div className="flex flex-wrap items-center justify-center gap-8">
                    <div className="flex flex-col items-center gap-1">
                        <p className="text-[9px] uppercase font-black text-muted-foreground tracking-[0.2em]">Departure Date</p>
                        <div className="flex items-center text-base text-foreground font-medium">
                            <Calendar className="mr-2 h-4 w-4 text-accent/60" />
                            <span>{new Date(leg.departureTime).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                        </div>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                        <p className="text-[9px] uppercase font-black text-muted-foreground tracking-[0.2em]">Live Availability</p>
                        <div className="flex items-center text-base text-green-500 font-black">
                            <Users className="mr-2 h-4 w-4 text-accent/60" />
                            <span>{leg.availableSeats} Seats Remaining</span>
                        </div>
                    </div>
                </div>

                <div className="p-4 bg-muted/20 rounded-xl border border-white/5 italic text-xs text-muted-foreground text-center flex items-center justify-center gap-3">
                    <Info className="h-4 w-4 shrink-0 text-accent/40" />
                    Subject to positioning window and operator confirmation.
                </div>
            </CardContent>
            <Separator className="bg-white/5 mx-8" />
            <CardFooter className="pb-8 pt-6 px-8 gap-4">
                <Button variant="outline" size="icon" className="h-12 w-12 border-white/10 text-muted-foreground hover:text-accent hover:bg-accent/10 shrink-0">
                    <Share2 className="h-5 w-5" />
                </Button>
                <Button className="flex-1 bg-accent text-accent-foreground hover:bg-accent/90 font-black uppercase text-xs tracking-[0.2em] h-12 shadow-xl shadow-accent/5" onClick={() => handleRequestSeats(leg.id)}>
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
        <div className="max-w-6xl mx-auto space-y-10">
            <PageHeader
                title="Available Jet Seats"
                description="Explore exclusive empty leg opportunities. Seat allocations are managed via authorized distributors or direct institutional request."
            />
            {isLoading ? (
                <div className="grid gap-8">
                    <Skeleton className="h-80 w-full max-w-3xl mx-auto" />
                    <Skeleton className="h-80 w-full max-w-3xl mx-auto" />
                </div>
            ) : (
                <>
                    {availableLegs && availableLegs.length > 0 ? (
                        <div className="grid gap-10 lg:grid-cols-1 xl:grid-cols-1 items-center justify-center">
                            {availableLegs.map(leg => (
                                <EmptyLegCard key={leg.id} leg={leg} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-24 border-2 border-dashed rounded-xl bg-card/20 border-white/5 max-w-3xl mx-auto">
                             <div className="p-6 bg-muted/20 w-fit mx-auto rounded-full mb-6">
                                <Plane className="h-12 w-12 text-muted-foreground/40"/>
                            </div>
                             <p className="text-muted-foreground uppercase font-bold tracking-widest">No active empty legs synchronized</p>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
