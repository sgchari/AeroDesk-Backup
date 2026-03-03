'use client';

import { useUser } from '@/hooks/use-user';
import { Skeleton } from '@/components/ui/skeleton';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { PageHeader } from "@/components/dashboard/shared/page-header";
import { CreateRfqDialog } from "@/components/dashboard/customer/create-rfq-dialog";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ArrowRight, Plane, Armchair, Calendar, LifeBuoy, AlertTriangle } from "lucide-react";
import Link from "next/link";
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, where } from 'firebase/firestore';
import type { CharterRFQ } from '@/lib/types';
import { LiveRadarDashboardCard } from '@/components/dashboard/shared/live-radar-dashboard-card';
import dynamic from 'next/dynamic';

// Dynamic Imports to reduce initial compilation load and bundle size
const AdminDashboard = dynamic(() => import('./admin-dashboard').then(mod => mod.AdminDashboard), { 
    loading: () => <DashboardSkeleton /> 
});
const OperatorDashboard = dynamic(() => import('./operator-dashboard').then(mod => mod.OperatorDashboard), { 
    loading: () => <DashboardSkeleton /> 
});
const CTDDashboard = dynamic(() => import('./ctd-dashboard').then(mod => mod.CTDDashboard), { 
    loading: () => <DashboardSkeleton /> 
});
const TravelAgencyDashboard = dynamic(() => import('./travel-agency-dashboard').then(mod => mod.TravelAgencyDashboard), { 
    loading: () => <DashboardSkeleton /> 
});
const HotelDashboard = dynamic(() => import('./hotel-dashboard').then(mod => mod.HotelDashboard), { 
    loading: () => <DashboardSkeleton /> 
});

const quickLinks = [
    {
        title: "Charter a Flight",
        description: "Request a private flight for any journey.",
        icon: Plane,
        href: "/dashboard/charter-rfq",
        cta: "New Request"
    },
    {
        title: "Available Jet Seats",
        description: "Explore and request seats on empty leg flights.",
        icon: Armchair,
        href: "/dashboard/customer/empty-legs",
        cta: "View Seats"
    },
    {
        title: "Multi-City Journey",
        description: "Plan a complex trip with multiple stops.",
        icon: Calendar,
        href: "/dashboard/charter-rfq",
        cta: "Plan Journey"
    },
    {
        title: "Support & Concierge",
        description: "Contact our team for assistance.",
        icon: LifeBuoy,
        href: "#",
        cta: "Get Help"
    }
];

function CustomerGateway() {
    const { user } = useUser();
    const firestore = useFirestore();

    const rfqsQuery = useMemoFirebase(() => {
        if (!firestore || !user) return null;
        return query(collection(firestore, 'charterRequests'), where('customerId', '==', user.id));
    }, [firestore, user]);
    const { data: rfqs } = useCollection<CharterRFQ>(rfqsQuery, 'charterRequests');

    const liveMissions = useMemo(() => {
        return rfqs?.filter(m => ['departed', 'live', 'enroute', 'arrived'].includes(m.status)) || [];
    }, [rfqs]);

    return (
        <div className="space-y-6">
            <PageHeader 
                title="Fly Without Convention"
                description="Your private aviation journey, perfectly coordinated. What would you like to do today?"
            >
                <CreateRfqDialog />
            </PageHeader>

            {liveMissions.length > 0 && (
                <LiveRadarDashboardCard missions={liveMissions} />
            )}

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {quickLinks.map(link => (
                    <Card key={link.title} className="bg-card group hover:border-primary transition-colors">
                        <CardHeader className="flex-row items-center gap-4 space-y-0">
                            <div className="p-3 bg-muted rounded-lg">
                                <link.icon className="h-6 w-6 text-muted-foreground" />
                            </div>
                            <div>
                                <CardTitle>{link.title}</CardTitle>
                                <CardDescription>{link.description}</CardDescription>
                            </div>
                        </CardHeader>
                        <CardContent>
                             <Button asChild variant="link" className="p-0">
                                <Link href={link.href}>
                                    {link.cta}
                                    <ArrowRight className="ml-2 h-4 w-4"/>
                                </Link>
                            </Button>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}

export default function DashboardPage() {
  const { user, isLoading, error } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user && !error) {
      router.replace('/');
    }
  }, [user, isLoading, error, router]);

  const renderDashboard = () => {
    if (!user) return null;

    // GST Compliance Lock Check
    const isRestrictedRole = ['Operator', 'Travel Agency', 'CTD Admin', 'Corporate Admin'].includes(user.role);
    const gstRequirement = isRestrictedRole && user.gstVerificationStatus !== 'verified';

    const dashboard = (() => {
        switch (user.role) {
            case 'Customer':
            case 'Requester':
              return <CustomerGateway />;
            case 'Operator':
              return <OperatorDashboard />;
            case 'Admin':
              return <AdminDashboard />;
            case 'CTD Admin':
            case 'Corporate Admin':
              return <CTDDashboard />;
            case 'Travel Agency':
              return <TravelAgencyDashboard />;
            case 'Hotel Partner':
              return <HotelDashboard />;
            default:
              return <div className="p-4">Invalid user role context. Please contact platform support.</div>;
          }
    })();

    return (
        <div className="space-y-6">
            {gstRequirement && (
                <Alert variant="destructive" className="bg-amber-500/10 border-amber-500/20 text-amber-500 animate-in fade-in slide-in-from-top-4">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle className="font-black uppercase text-[10px] tracking-widest">Compliance Warning: GST Verification Required</AlertTitle>
                    <AlertDescription className="text-xs">
                        Institutional invoicing and settlement features are restricted until your GST profile is verified. 
                        <Button asChild variant="link" className="h-auto p-0 ml-2 text-amber-500 font-bold hover:text-amber-400">
                            <Link href="/dashboard/profile">Complete Tax Profile</Link>
                        </Button>
                    </AlertDescription>
                </Alert>
            )}
            {dashboard}
        </div>
    );
  };

  if (isLoading && !user) {
    return <DashboardSkeleton />;
  }

  if (error) {
    return (
        <div className="p-4 rounded-md border border-destructive bg-destructive/10 text-destructive-foreground">
            <h3 className="font-bold">Governance Context Error</h3>
            <p>There was a problem loading your institutional profile. Details: {error.message}</p>
            <Button variant="link" onClick={() => router.replace('/login')} className="p-0 mt-2 text-destructive-foreground">
              Re-authenticate to Platform
            </Button>
        </div>
    )
  }

  return (
    <div className="animate-in fade-in duration-500">
      {renderDashboard()}
    </div>
  );
}

function DashboardSkeleton() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <Skeleton className="h-12 w-1/3" />
                <Skeleton className="h-10 w-32" />
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Skeleton className="h-32" />
                <Skeleton className="h-32" />
                <Skeleton className="h-32" />
                <Skeleton className="h-32" />
            </div>
            <Skeleton className="h-96" />
        </div>
    )
}
