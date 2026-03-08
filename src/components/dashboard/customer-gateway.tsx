'use client';

import { useUser } from '@/hooks/use-user';
import { useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { PageHeader } from "@/components/dashboard/shared/page-header";
import { CreateRfqDialog } from "@/components/dashboard/customer/create-rfq-dialog";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ArrowRight, Plane, Armchair, Calendar, LifeBuoy } from "lucide-react";
import Link from "next/link";
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, where } from 'firebase/firestore';
import type { CharterRFQ } from '@/lib/types';
import { LiveRadarDashboardCard } from '@/components/dashboard/shared/live-radar-dashboard-card';
import { JetSeatQuickSearch } from '@/components/jet-seat-quick-search';

const quickLinks = [
    {
        title: "Charter a Flight",
        description: "Request a private flight journey.",
        icon: Plane,
        href: "/dashboard/charter-rfq",
        cta: "New Request"
    },
    {
        title: "Available Jet Seats",
        description: "Explore empty leg allocations.",
        icon: Armchair,
        href: "/dashboard/customer/empty-legs",
        cta: "View Seats"
    },
    {
        title: "Multi-City Journey",
        description: "Plan complex stopping itineraries.",
        icon: Calendar,
        href: "/dashboard/charter-rfq",
        cta: "Plan Journey"
    },
    {
        title: "Support & Concierge",
        description: "Contact our operational team.",
        icon: LifeBuoy,
        href: "#",
        cta: "Get Help"
    }
];

export function CustomerGateway() {
    const { user } = useUser();
    const firestore = useFirestore();

    const rfqsQuery = useMemoFirebase(() => {
        if (!firestore || (firestore as any)._isMock || !user) return null;
        return query(collection(firestore, 'charterRequests'), where('customerId', '==', user.id));
    }, [firestore, user]);
    const { data: rfqs } = useCollection<CharterRFQ>(rfqsQuery, 'charterRequests');

    const liveMissions = useMemo(() => {
        return rfqs?.filter(m => ['departed', 'live', 'enroute', 'arrived'].includes(m.status)) || [];
    }, [rfqs]);

    return (
        <div className="space-y-8 p-4 sm:p-8">
            <PageHeader 
                title="Fly Without Convention"
                description="Your private aviation journey, perfectly coordinated."
            >
                <CreateRfqDialog />
            </PageHeader>

            <div className="mb-10">
                <div className="text-left mb-6 px-1">
                    <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-accent/60 mb-2">JetSeat Exchange</h2>
                    <p className="text-xl font-bold text-white uppercase tracking-tight">Instant Seat Availability Search</p>
                </div>
                <JetSeatQuickSearch />
            </div>

            {liveMissions.length > 0 && (
                <LiveRadarDashboardCard missions={liveMissions} />
            )}

            <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {quickLinks.map(link => (
                    <Card key={link.title} className="bg-card group hover:border-primary transition-all duration-300">
                        <CardHeader className="flex-row items-center gap-4 space-y-0 p-4 sm:p-6">
                            <div className="p-3 bg-muted/20 rounded-xl group-hover:bg-primary/10 transition-colors">
                                <link.icon className="h-5 w-5 sm:h-6 sm:w-6 text-muted-foreground group-hover:text-primary transition-colors" />
                            </div>
                            <div>
                                <CardTitle className="text-sm sm:text-base font-bold">{link.title}</CardTitle>
                                <CardDescription className="text-xs line-clamp-1">{link.description}</CardDescription>
                            </div>
                        </CardHeader>
                        <CardContent className="px-4 sm:px-6 pb-4">
                             <Button asChild variant="link" className="p-0 text-xs font-black uppercase tracking-widest text-accent group-hover:text-accent/80">
                                <Link href={link.href} className="flex items-center gap-2">
                                    {link.cta}
                                    <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform"/>
                                </Link>
                            </Button>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}