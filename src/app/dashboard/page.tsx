
'use client';

import { useUser } from '@/hooks/use-user';
import { Skeleton } from '@/components/ui/skeleton';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo } from 'react';
import dynamic from 'next/dynamic';

// Shared loading skeleton for all dashboards to ensure layout stability
function DashboardSkeleton() {
    return (
        <div className="space-y-8 p-4 sm:p-8 animate-in fade-in duration-500">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <Skeleton className="h-10 w-64 rounded-lg bg-white/5" />
                <Skeleton className="h-10 w-32 rounded-lg bg-white/5" />
            </div>
            <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
                <Skeleton className="h-28 rounded-2xl bg-white/5" />
                <Skeleton className="h-28 rounded-2xl bg-white/5" />
                <Skeleton className="h-28 rounded-2xl bg-white/5" />
                <Skeleton className="h-28 rounded-2xl bg-white/5" />
            </div>
            <Skeleton className="h-[400px] w-full rounded-3xl bg-white/5" />
        </div>
    )
}

// Institutional Dashboard Variants - Consistently loaded with ssr: false for map/chart safety
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

  const dashboardView = useMemo(() => {
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
          return (
            <div className="flex items-center justify-center min-h-[60vh] p-12 text-center text-muted-foreground italic border-2 border-dashed border-white/5 rounded-2xl opacity-50">
                Initializing operational context...
            </div>
          );
      }
  }, [user?.role]);

  if (isLoading && !user) {
    return <DashboardSkeleton />;
  }

  if (error) {
    return (
        <div className="p-8 rounded-2xl border border-destructive bg-destructive/5 text-destructive-foreground mx-auto max-w-2xl mt-12">
            <h3 className="font-black uppercase tracking-widest text-xs mb-2">Governance Context Error</h3>
            <p className="text-sm opacity-80">There was a problem loading your institutional profile. Details: {error.message}</p>
            <button onClick={() => window.location.reload()} className="mt-4 text-xs font-bold underline">Retry Terminal Connection</button>
        </div>
    )
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-700 max-w-full">
      {dashboardView}
    </div>
  );
}
