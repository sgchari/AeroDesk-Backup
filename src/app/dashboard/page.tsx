
'use client';

import { useUser } from '@/hooks/use-user';
import { Skeleton } from '@/components/ui/skeleton';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import dynamic from 'next/dynamic';

// Institutional Dashboard Variants - Consolidated in components/dashboard
const AdminDashboard = dynamic(() => import('@/components/dashboard/admin-dashboard').then(mod => mod.AdminDashboard), { 
    ssr: false,
    loading: () => <DashboardSkeleton /> 
});
const OperatorDashboard = dynamic(() => import('@/components/dashboard/operator-dashboard').then(mod => mod.OperatorDashboard), { 
    ssr: false,
    loading: () => <DashboardSkeleton /> 
});
const CTDDashboard = dynamic(() => import('@/components/dashboard/ctd-dashboard').then(mod => mod.CTDDashboard), { 
    ssr: false,
    loading: () => <DashboardSkeleton /> 
});
const TravelAgencyDashboard = dynamic(() => import('@/components/dashboard/travel-agency-dashboard').then(mod => mod.TravelAgencyDashboard), { 
    ssr: false,
    loading: () => <DashboardSkeleton /> 
});
const HotelDashboard = dynamic(() => import('@/components/dashboard/hotel-dashboard').then(mod => mod.HotelDashboard), { 
    ssr: false,
    loading: () => <DashboardSkeleton /> 
});
const CustomerGateway = dynamic(() => import('@/components/dashboard/customer-gateway').then(mod => mod.CustomerGateway), { 
    ssr: false,
    loading: () => <DashboardSkeleton /> 
});

export default function DashboardPage() {
  const { user, isLoading, error } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user && !error) {
      router.replace('/');
    }
    // Redirect super user to role selection if no simulation role is picked
    if (!isLoading && user && user.role === 'demo_super_user' && !user.platformRole) {
        router.replace('/dashboard/select-role');
    }
  }, [user, isLoading, error, router]);

  const renderDashboard = () => {
    if (!user) return null;

    // Direct dashboard resolution based on platform role
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
          return <div className="p-12 text-center text-muted-foreground italic border-2 border-dashed rounded-2xl opacity-50">Initializing operational context...</div>;
      }
  };

  if (isLoading && !user) {
    return <DashboardSkeleton />;
  }

  if (error) {
    return (
        <div className="p-8 rounded-2xl border border-destructive bg-destructive/5 text-destructive-foreground">
            <h3 className="font-black uppercase tracking-widest text-xs mb-2">Governance Context Error</h3>
            <p className="text-sm opacity-80">There was a problem loading your institutional profile. Details: {error.message}</p>
            <button onClick={() => window.location.reload()} className="mt-4 text-xs font-bold underline">Retry Terminal Connection</button>
        </div>
    )
  }

  return (
    <div className="animate-in fade-in duration-700 max-w-full">
      {renderDashboard()}
    </div>
  );
}

function DashboardSkeleton() {
    return (
        <div className="space-y-8 p-4 sm:p-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <Skeleton className="h-10 w-64 rounded-lg" />
                <Skeleton className="h-10 w-32 rounded-lg" />
            </div>
            <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
                <Skeleton className="h-32 rounded-2xl" />
                <Skeleton className="h-32 rounded-2xl" />
                <Skeleton className="h-32 rounded-2xl" />
                <Skeleton className="h-32 rounded-2xl" />
            </div>
            <Skeleton className="h-[450px] w-full rounded-3xl" />
        </div>
    )
}
