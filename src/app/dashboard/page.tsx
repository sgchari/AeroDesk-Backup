
'use client';

import { useUser } from '@/hooks/use-user';
import { CustomerDashboard } from '@/components/dashboard/customer-dashboard';
import { OperatorDashboard } from '@/components/dashboard/operator-dashboard';
import { AdminDashboard } from './admin-dashboard';
import { CTDDashboard } from '@/components/dashboard/ctd-dashboard';
import { DistributorDashboard } from '@/components/dashboard/distributor-dashboard';
import { HotelDashboard } from '@/components/dashboard/hotel-dashboard';
import { Skeleton } from '@/components/ui/skeleton';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';

export default function DashboardPage() {
  const { user, isLoading, error } = useUser();
  const router = useRouter();

  useEffect(() => {
    // Only redirect if loading is complete, there is no user, AND there was no error.
    // This prevents redirecting when the profile is still loading or if there was a specific profile loading error.
    if (!isLoading && !user && !error) {
      router.replace('/login');
    }
  }, [user, isLoading, error, router]);

  const renderDashboard = () => {
    if (!user) return null;
    switch (user.role) {
      case 'Customer':
        return <CustomerDashboard />;
      case 'Operator':
        return <OperatorDashboard />;
      case 'Admin':
        return <AdminDashboard />;
      case 'CTD Admin':
        return <CTDDashboard />;
      case 'Authorized Distributor':
        return <DistributorDashboard />;
      case 'Hotel Partner':
        return <HotelDashboard />;
      default:
        return <div className="p-4">Invalid user role. Please contact support.</div>;
    }
  };

  if (isLoading || (!user && !error)) {
    return <DashboardSkeleton />;
  }

  if (error) {
    return (
        <div className="p-4 rounded-md border border-destructive bg-destructive/10 text-destructive-foreground">
            <h3 className="font-bold">Error Loading Profile</h3>
            <p>There was a problem loading your user data. This can happen if your user profile is not correctly configured in the database.</p>
            <p className="text-xs mt-2">Details: {error.message}</p>
            <Button variant="link" onClick={() => router.replace('/login')} className="p-0 mt-2 text-destructive-foreground">
              Return to Login
            </Button>
        </div>
    )
  }

  return (
    <div>
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
