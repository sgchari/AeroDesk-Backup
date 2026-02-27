
'use client';

import { PageHeader } from "@/components/dashboard/shared/page-header";
import { useCollection, useFirestore, useMemoFirebase } from "@/firebase";
import { collection, query } from "firebase/firestore";
import type { EmptyLeg } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Calendar, Plane, ArrowRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

const EmptyLegCard = ({ leg }: { leg: EmptyLeg }) => {
    const { toast } = useToast();
    const handleRequestSeats = (legId: string) => {
        toast({
            title: "Seat Allocation Request Sent",
            description: `Your request for seats on flight ${legId} is subject to operator confirmation.`,
        });
    };

    return (
        <Card className="bg-card flex flex-col hover:border-accent/50 transition-all duration-300">
            <CardHeader className="pb-3 pt-5 px-5">
                <div className="flex justify-between items-center mb-2">
                    <span className="text-[9px] font-black uppercase tracking-[0.15em] text-accent">
                        {leg.operatorName || 'Private Operator'}
                    </span>
                    <span className="text-[9px] font-bold text-muted-foreground">
                        {leg.aircraftName || 'Private Jet'}
                    </span>
                </div>
                <CardTitle className="text-base flex items-center flex-wrap gap-x-2 leading-tight font-headline font-bold">
                    <span className="text-white">{leg.departure}</span>
                    <span className="text-muted-foreground/40 font-light">-</span>
                    <span className="text-white">{leg.arrival}</span>
                </CardTitle>
            </CardHeader>
            <CardContent className="flex-grow space-y-3 px-5">
                 <div className="flex items-center text-xs text-muted-foreground">
                    <Calendar className="mr-2 h-3.5 w-3.5 text-accent/60" />
                    <span>{new Date(leg.departureTime).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                </div>
                <div className="flex items-center text-xs text-muted-foreground">
                    <Users className="mr-2 h-3.5 w-3.5 text-accent/60" />
                    <span>{leg.availableSeats} Seats Available</span>
                </div>
                <div className="flex items-center text-xs text-muted-foreground">
                    <Plane className="mr-2 h-3.5 w-3.5 text-accent/60" />
                    <span className="font-code text-[10px] uppercase tracking-tighter">{leg.id}</span>
                </div>
            </CardContent>
            <CardFooter className="pb-5 pt-0 px-5">
                <Button className="w-full bg-accent text-accent-foreground hover:bg-accent/90 font-bold h-9 text-xs" onClick={() => handleRequestSeats(leg.id)}>
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
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    <Skeleton className="h-64 w-full" />
                    <Skeleton className="h-64 w-full" />
                    <Skeleton className="h-64 w-full" />
                    <Skeleton className="h-64 w-full" />
                </div>
            ) : (
                <>
                    {availableLegs && availableLegs.length > 0 ? (
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                            {availableLegs.map(leg => (
                                <EmptyLegCard key={leg.id} leg={leg} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20 border-2 border-dashed rounded-lg bg-card/20">
                             <p className="text-muted-foreground">There are currently no active empty leg opportunities synchronized.</p>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
