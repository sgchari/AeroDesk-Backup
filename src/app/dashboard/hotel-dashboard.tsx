
'use client';
import { PageHeader } from "@/components/dashboard/shared/page-header";
import { BedDouble, Clock, Calendar, AlertTriangle } from "lucide-react";
import { StatsCard } from "@/components/dashboard/shared/stats-card";
import { StatsGrid } from "@/components/dashboard/shared/stats-grid";
import { useUser } from "@/hooks/use-user";
import { useDoc, useMemoFirebase } from "@/firebase";
import { Skeleton } from "@/components/ui/skeleton";
import type { DashboardSummary } from "@/lib/types";

export function HotelDashboard() {
  const { user, isLoading: isUserLoading } = useUser();

  const { data: summary, isLoading: summaryLoading } = useDoc<DashboardSummary>(
    useMemoFirebase(() => null, []), 
    user ? `hotelPartners/${user.id}/dashboardSummary` : undefined
  );

  const isLoading = isUserLoading || summaryLoading;

  return (
    <div className="space-y-6">
      <PageHeader title="Hospitality Console" description={`Property status for ${user?.company}.`} />
      
      <StatsGrid>
        <StatsCard title="Stay Inquiries" value={isLoading ? <Skeleton className="h-6 w-12" /> : summary?.accommodationRequestsPending.toString()} icon={Clock} description="Pending confirmation" />
        <StatsCard title="Check-ins" value={isLoading ? <Skeleton className="h-6 w-12" /> : summary?.confirmedTrips.toString()} icon={Calendar} description="Next 7 days" />
        <StatsCard title="AeroDesk Occupancy" value={isLoading ? <Skeleton className="h-6 w-12" /> : "78%"} icon={BedDouble} description="Yield from network" />
        <StatsCard title="Alerts" value={isLoading ? <Skeleton className="h-6 w-12" /> : "0"} icon={AlertTriangle} description="Inventory conflicts" />
      </StatsGrid>
    </div>
  );
}
