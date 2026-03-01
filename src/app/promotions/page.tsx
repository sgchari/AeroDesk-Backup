
'use client';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { EmptyLeg } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { useCollection, useFirestore, useMemoFirebase } from "@/firebase";
import { collection, query } from "firebase/firestore";
import { Skeleton } from "@/components/ui/skeleton";
import { useRouter } from "next/navigation";
import { LandingHeader } from "@/components/landing-header";
import { LandingFooter } from "@/components/landing-footer";


export default function PromotionsPage() {
  const firestore = useFirestore();
  const router = useRouter();

  const emptyLegsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    // For demo mode, we fetch all and filter on the client.
    return query(collection(firestore, 'emptyLegs'));
  }, [firestore]);
  const { data: allEmptyLegs, isLoading } = useCollection<EmptyLeg>(emptyLegsQuery, 'emptyLegs');

  // Client-side filtering for demo mode
  const emptyLegs = allEmptyLegs?.filter(leg => leg.status === 'Published' || leg.status === 'Approved');

  const handleRequestSeats = (legId: string) => {
    router.push('/login');
  };

  return (
    <div className="w-full">
        {/* Background Layer: Optimized with next/image */}
        <div className="fixed inset-0 z-0">
            <Image
                src="https://images.unsplash.com/photo-1627440474139-65a5d1656f7e?q=80&w=2070&auto=format&fit=crop"
                alt="Aviation Background"
                fill
                priority
                className="object-cover"
                data-ai-hint="airplane beach"
            />
            <div className="absolute inset-0 bg-black/30" />
        </div>
        <div className="relative z-10 flex min-h-screen flex-col bg-transparent">
            <LandingHeader activePage="Promotions" />
            <main className="flex-1 py-12 md:py-16">
                <div className="container">
                    <Card className="border-white/10 bg-black/15 backdrop-blur-md text-white">
                        <CardHeader>
                            <CardTitle className="text-3xl font-headline">
                            Available Jet Seats
                            </CardTitle>
                            <CardDescription className="text-white/80">
                            Explore exclusive empty leg opportunities. Request seats subject to operator confirmation.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {isLoading ? <Skeleton className="h-64 w-full bg-white/10" /> : (
                            <Table>
                                <TableHeader>
                                <TableRow className="hover:bg-white/10 border-white/10">
                                    <TableHead className="text-white/90">Flight ID</TableHead>
                                    <TableHead className="text-white/90">Sector</TableHead>
                                    <TableHead className="text-white/90">Departure</TableHead>
                                    <TableHead className="text-white/90 text-center">Available Seats</TableHead>
                                    <TableHead className="text-right text-white/90">Action</TableHead>
                                </TableRow>
                                </TableHeader>
                                <TableBody>
                                {emptyLegs?.map((leg: EmptyLeg) => (
                                    <TableRow key={leg.id} className="border-white/10 hover:bg-white/5">
                                        <TableCell className="font-medium font-code text-accent">{leg.id}</TableCell>
                                        <TableCell className="font-bold">{leg.departure} — {leg.arrival}</TableCell>
                                        <TableCell className="text-xs text-white/70">{new Date(leg.departureTime).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</TableCell>
                                        <TableCell className="font-black text-center text-green-400">{leg.availableSeats}</TableCell>
                                        <TableCell className="text-right">
                                            <Button 
                                                size="sm" 
                                                className="bg-accent text-accent-foreground hover:bg-accent/90 font-bold uppercase text-[10px] tracking-widest h-8"
                                                onClick={() => handleRequestSeats(leg.id)}
                                            >
                                                Request Seat Access
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                </TableBody>
                            </Table>
                            )}
                            {(!isLoading && (!emptyLegs || emptyLegs.length === 0)) && (
                                <div className="text-center py-20 border-2 border-dashed border-white/20 rounded-lg">
                                    <p className="text-white/70 font-medium">There are currently no active jet seat opportunities synchronized.</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </main>
            <LandingFooter />
        </div>
    </div>
  );
}
