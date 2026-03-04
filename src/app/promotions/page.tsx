
'use client';

import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { LandingHeader } from '@/components/landing-header';
import { LandingFooter } from '@/components/landing-footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useCollection, useFirestore, useMemoFirebase } from "@/firebase";
import { collection, query, where } from "firebase/firestore";
import { ShieldCheck, Zap, Star, Plane, Armchair, ArrowRight, Wallet, Clock, Tag } from 'lucide-react';
import type { EmptyLeg } from '@/lib/types';

const promoFeatures = [
  {
    icon: Tag,
    title: 'Dynamic Empty Legs',
    description: 'Opportunistic seat inventory on positioning flights at ~40-60% commercial-plus discounts.'
  },
  {
    icon: Wallet,
    title: 'Institutional Rates',
    description: 'Direct-to-operator pricing loops without intermediary markups or management fees.'
  },
  {
    icon: Zap,
    title: 'Priority Dispatch',
    description: 'Expedited coordination protocol for time-critical mission starts via verified fleet.'
  }
];

export default function PromotionsPage() {
  const firestore = useFirestore();
  const router = useRouter();

  const emptyLegsQuery = useMemoFirebase(() => {
    if (!firestore || (firestore as any)._isMock) return null;
    return query(collection(firestore, 'emptyLegs'), where('status', 'in', ['Published', 'Approved', 'live']));
  }, [firestore]);
  
  const { data: emptyLegsRaw, isLoading } = useCollection<EmptyLeg>(emptyLegsQuery, 'emptyLegs');

  const emptyLegs = emptyLegsRaw || [];

  const handleAction = () => {
    router.push('/login');
  };

  return (
    <div className="w-full relative min-h-screen bg-[#0B1220] flex flex-col overflow-hidden">
      {/* Background Layer: Homepage Sync */}
      <div className="fixed inset-0 z-0">
        <Image
          src="https://images.unsplash.com/photo-1506929562872-bb421503ef21?auto=format&fit=crop&q=80&w=2070"
          alt="Aviation Background"
          fill
          priority
          className="object-cover"
          data-ai-hint="airplane beach"
        />
        <div className="absolute inset-0 bg-[#0B1220]/40 backdrop-blur-md" />
        <div className="absolute inset-0 bg-aviation-radial opacity-20" />
      </div>

      <div className="relative z-10 flex flex-col flex-1">
        <LandingHeader activePage="Promotions" />

        <main className="flex-1 py-10 md:py-16">
          <div className="container px-4">
            
            {/* Hero Header */}
            <div className="max-w-4xl mb-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-accent/20 bg-accent/5 mb-4">
                <Star className="h-3 w-3 text-accent fill-accent" />
                <span className="text-[9px] font-black uppercase tracking-[0.2em] text-accent">Exclusive Opportunities</span>
              </div>
              <h1 className="text-2xl md:text-5xl font-bold tracking-tighter font-headline text-white leading-tight mb-4 flex flex-wrap items-center gap-x-3">
                INSTITUTIONAL 
                <span className="text-accent uppercase font-black">Privileges</span>
              </h1>
              <p className="text-muted-foreground text-sm md:text-base max-w-xl leading-relaxed">
                Access AeroDesk’s secondary marketplace for repositioning flights and network-exclusive seat allocations. Coordinate luxury with operational efficiency.
              </p>
            </div>

            {/* Promo Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
              {promoFeatures.map((feature, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 backdrop-blur-xl group hover:border-accent/30 transition-all duration-500">
                  <div className="p-2 bg-accent/10 rounded-xl w-fit mb-3 group-hover:scale-110 transition-transform">
                    <feature.icon className="h-5 w-5 text-accent" />
                  </div>
                  <h3 className="text-sm font-bold text-white mb-1.5">{feature.title}</h3>
                  <p className="text-xs text-white/50 leading-relaxed">{feature.description}</p>
                </div>
              ))}
            </div>

            {/* Opportunities Table */}
            <Card className="border-white/10 bg-white/[0.02] backdrop-blur-3xl text-white rounded-3xl overflow-hidden shadow-2xl">
              <CardHeader className="p-6 md:p-8 border-b border-white/5 bg-accent/5">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <CardTitle className="text-xl md:text-2xl font-headline flex items-center gap-3">
                      <Plane className="h-5 w-5 md:h-6 md:w-6 text-accent" />
                      Approved Jet Seats
                    </CardTitle>
                    <CardDescription className="text-white/50 mt-1">
                      Secondary marketplace for empty-leg inventory from verified NSOP fleet operators.
                    </CardDescription>
                  </div>
                  <Badge variant="outline" className="w-fit bg-accent/5 border-accent/20 text-accent font-black text-[10px] h-7 uppercase tracking-[0.1em] px-4">
                    {emptyLegs.length} Active Listings
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  {isLoading ? (
                    <div className="p-8 space-y-4">
                      <Skeleton className="h-12 w-full bg-white/5" />
                      <Skeleton className="h-12 w-full bg-white/5" />
                      <Skeleton className="h-12 w-full bg-white/5" />
                    </div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow className="hover:bg-transparent border-white/5">
                          <TableHead className="pl-8 text-white/40 uppercase font-black text-[10px] tracking-widest h-14">Sector Index</TableHead>
                          <TableHead className="text-white/40 uppercase font-black text-[10px] tracking-widest h-14">Asset Class</TableHead>
                          <TableHead className="text-white/40 uppercase font-black text-[10px] tracking-widest h-14 text-center">Seats</TableHead>
                          <TableHead className="text-right text-white/40 uppercase font-black text-[10px] tracking-widest h-14 pr-8">Price / Seat</TableHead>
                          <TableHead className="text-right pr-8 text-white/40 uppercase font-black text-[10px] tracking-widest h-14">Action</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {emptyLegs.length > 0 ? emptyLegs.map((leg: EmptyLeg) => (
                          <TableRow key={leg.id} className="border-white/5 hover:bg-white/[0.03] group transition-colors">
                            <TableCell className="pl-8 py-6">
                              <div className="space-y-1">
                                <div className="text-sm font-black text-white group-hover:text-accent transition-colors">
                                  {leg.departure} <span className="text-white/20 px-2">—</span> {leg.arrival}
                                </div>
                                <div className="flex items-center gap-2 text-[10px] font-code text-white/40 uppercase tracking-tighter">
                                    <Clock className="h-2.5 w-2.5" /> {new Date(leg.departureTime).toLocaleDateString()}
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                                <Badge variant="outline" className="text-[9px] uppercase border-white/10 group-hover:border-accent/30 text-white/60">
                                    {leg.aircraftType || 'Private Jet'}
                                </Badge>
                            </TableCell>
                            <TableCell className="text-center">
                              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 text-green-400 border border-green-500/20">
                                <Armchair className="h-3 w-3" />
                                <span className="text-xs font-black">{leg.availableSeats}</span>
                              </div>
                            </TableCell>
                            <TableCell className="text-right pr-8">
                                <p className="text-sm font-black text-accent">₹ {leg.pricePerSeat?.toLocaleString() || (leg.estimatedPricePerSeat?.toLocaleString()) || '---'}</p>
                                <p className="text-[8px] text-white/30 uppercase font-bold">Inc. Taxes</p>
                            </TableCell>
                            <TableCell className="text-right pr-8">
                              <Button 
                                size="sm" 
                                className="bg-accent text-accent-foreground hover:bg-accent/90 font-black uppercase text-[10px] tracking-widest h-9 px-6 group/btn shadow-xl shadow-accent/10"
                                onClick={handleAction}
                              >
                                Book Seat
                                <ArrowRight className="ml-2 h-3 w-3 transition-transform group-hover/btn:translate-x-1" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        )) : (
                          <TableRow>
                            <TableCell colSpan={5} className="h-64 text-center">
                              <div className="flex flex-col items-center gap-4 opacity-40">
                                <Plane className="h-12 w-12" />
                                <p className="text-sm font-medium uppercase tracking-[0.2em]">No opportunities currently synchronized</p>
                              </div>
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Legal Advisory */}
            <div className="mt-12 p-6 rounded-2xl bg-white/[0.02] border border-white/5 flex items-start gap-4">
              <ShieldCheck className="h-5 w-5 text-white/20 shrink-0 mt-0.5" />
              <p className="text-[10px] text-white/30 leading-relaxed uppercase tracking-widest">
                All empty-leg inventory represents opportunistic aircraft positioning flights. Availability is subject to NSOP operational clearance and final operator confirmation. 
                Displayed rates are platform-coordinated estimations for institutional seat allocations.
              </p>
            </div>

          </div>
        </main>

        <LandingFooter />
      </div>
    </div>
  );
}
