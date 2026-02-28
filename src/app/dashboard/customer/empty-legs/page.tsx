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

    const handleShare = () => {
        // In a real app, this would use the Web Share API or copy a unique link
        navigator.clipboard.writeText(`https://aerodesk.com/empty-leg/${leg.id}`);
        toast({
            title: "Opportunity Shared",
            description: "Institutional link has been copied to your clipboard.",
        });
    };

    return (
        <Card className="bg-card flex flex-col group hover:border-accent/40 transition-all duration-300 w-full overflow-hidden h-full">
            <CardHeader className="pb-3 pt-6 px-6">
                <div className="flex justify-between items-center mb-4">
                    <span className="text-[9px] font-black uppercase tracking-[0.2em] text-accent">
                        {leg.operatorName || 'Private Operator'}
                    </span>
                    <span className="text-[9px] font-bold text-muted-foreground uppercase">
                        {leg.aircraftName || 'Private Jet'}
                    </span>
                </div>
                <CardTitle className="text-lg font-headline font-bold text-white text-center py-2">
                    {leg.departure} <span className="text-accent/40 px-1">—</span> {leg.arrival}
                </CardTitle>
            </CardHeader>
            <CardContent className="flex-grow space-y-6 px-6">
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex flex-col gap-1">
                        <p className="text-[8px] uppercase font-black text-muted-foreground tracking-[0.2em]">Departure Date</p>
                        <div className="flex items-center text-sm text-foreground font-medium">
                            <Calendar className="mr-2 h-3.5 w-3.5 text-accent/60" />
                            <span>{new Date(leg.departureTime).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                        </div>
                    </div>
                    <div className="flex flex-col gap-1 items-end">
                        <p className="text-[8px] uppercase font-black text-muted-foreground tracking-[0.2em]">Availability</p>
                        <div className="flex items-center text-sm text-green-500 font-black">
                            <Users className="mr-2 h-3.5 w-3.5 text-accent/60" />
                            <span>{leg.availableSeats} Seats</span>
                        </div>
                    </div>
                </div>

                <div className="p-3 bg-muted/20 rounded-lg border border-white/5 italic text-[10px] text-muted-foreground text-center flex items-center justify-center gap-2">
                    <Info className="h-3.5 w-3.5 shrink-0 text-accent/40" />
                    Final confirmation is subject to operator approval and aircraft positioning.
                </div>
            </CardContent>
            <Separator className="bg-white/5 mx-6" />
            <CardFooter className="pb-6 pt-4 px-6 gap-3">
                <Button 
                    variant="outline" 
                    size="icon" 
                    className="h-10 w-10 border-white/10 text-muted-foreground hover:text-accent hover:bg-accent/10 shrink-0"
                    onClick={handleShare}
                >
                    <Share2 className="h-4 w-4" />
                </Button>
                <Button className="flex-1 bg-accent text-accent-foreground hover:bg-accent/90 font-black uppercase text-[10px] tracking-[0.1em] h-10 shadow-xl shadow-accent/5" onClick={() => handleRequestSeats(leg.id)}>
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
        <div className="space-y-10">
            <PageHeader
                title="Available Jet Seats"
                description="Explore exclusive empty leg opportunities. Seat allocations are managed via authorized distributors or direct institutional request."
            />
            {isLoading ? (
                <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
                    <Skeleton className="h-80 w-full" />
                    <Skeleton className="h-80 w-full" />
                </div>
            ) : (
                <>
                    {availableLegs && availableLegs.length > 0 ? (
                        <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
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
