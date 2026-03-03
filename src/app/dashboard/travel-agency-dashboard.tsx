
'use client';
import { PageHeader } from "@/components/dashboard/shared/page-header";
import { Plane, Users, Coins, GanttChartSquare } from "lucide-react";
import { StatsCard } from "@/components/dashboard/shared/stats-card";
import { StatsGrid } from "@/components/dashboard/shared/stats-grid";
import { useUser } from "@/hooks/use-user";
import { useDoc, useMemoFirebase } from "@/firebase";
import { Skeleton } from "@/components/ui/skeleton";
import type { DashboardSummary } from "@/lib/types";

export function TravelAgencyDashboard() {
  const { user, isLoading: isUserLoading } = useUser();

  const { data: summary, isLoading: summaryLoading } = useDoc<DashboardSummary>(
    useMemoFirebase(() => null, []), 
    user ? `agencies/${user.id}/dashboardSummary` : undefined
  );

  const isLoading = isUserLoading || summaryLoading;

  return (
    <div className="space-y-6">
      <PageHeader title="Agency Hub" description={`Performance view for ${user?.company}.`} />
      
      <StatsGrid>
        <StatsCard title="Live Inventory" href="/dashboard/travel-agency/available-seats" value={isLoading ? <Skeleton className="h-6 w-12" /> : "14"} icon={Plane} description="Marketplace seats" />
        <StatsCard title="Active Leads" href="/dashboard/travel-agency/seat-requests" value={isLoading ? <Skeleton className="h-6 w-12" /> : summary?.seatRequestsPending.toString()} icon={Users} description="Operator response pending" />
        <StatsCard title="Earnings" href="/dashboard/travel-agency/revenue-share" value={isLoading ? <Skeleton className="h-6 w-20" /> : `₹ ${(summary?.revenueThisMonth! / 1000).toFixed(1)} K`} icon={Coins} description="Accrued commission" />
        <StatsCard title="Movements" href="/dashboard/travel-agency/charter-requests" value={isLoading ? <Skeleton className="h-6 w-12" /> : summary?.confirmedTrips.toString()} icon={GanttChartSquare} description="Upcoming missions" />
      </StatsGrid>
    </div>
  );
}
