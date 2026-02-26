
'use client';

import { useUser } from '@/hooks/use-user';
import { OperatorDashboard } from '@/components/dashboard/operator-dashboard';
import { AdminDashboard } from './admin-dashboard';
import { CTDDashboard } from '@/components/dashboard/ctd-dashboard';
import { TravelAgencyDashboard } from '@/components/dashboard/travel-agency-dashboard';
import { HotelDashboard } from '@/components/dashboard/hotel-dashboard';
import { Skeleton } from '@/components/ui/skeleton';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { PageHeader } from "@/components/dashboard/shared/page-header";
import { CreateRfqDialog } from "@/components/dashboard/customer/create-rfq-dialog";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ArrowRight, Plane, Armchair, Calendar, LifeBuoy } from "lucide-react";
import Link from "next/link";

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
    return (
        <>
            <PageHeader 
                title="Fly Without Convention"
                description="Your private aviation journey, perfectly coordinated. What would you like to do today?"
            >
                <CreateRfqDialog />
            </PageHeader>
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
        </>
    )
}

export default function DashboardPage() {
  const { user, isLoading, error } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) {
      return; 
    }

    if (!user && !error) {
      // Check local storage one last time to avoid race conditions during transitions
      const demoUserId = typeof window !== 'undefined' ? localStorage.getItem('demoUserId') : null;
      if (!demoUserId) {
        router.replace('/login');
      }
    }
  }, [user, isLoading, error, router]);

  const renderDashboard = () => {
    if (!user) return null;
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
  };

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  if (error) {
    return (
        <div className="p-4 rounded-md border border-destructive bg-destructive/10 text-destructive-foreground">
            <h3 className="font-bold">Governance Context Error</h3>
            <p>There was a problem loading your institutional profile. This often occurs if the session token has expired or the database record is missing.</p>
            <p className="text-xs mt-2 font-code">Details: {error.message}</p>
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
