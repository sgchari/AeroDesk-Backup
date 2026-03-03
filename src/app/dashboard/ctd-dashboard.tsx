
'use client';
import { PageHeader } from "@/components/dashboard/shared/page-header";
import { TrendingUp, ShieldCheck, Users, AlertCircle } from "lucide-react";
import { StatsCard } from "@/components/dashboard/shared/stats-card";
import { StatsGrid } from "@/components/dashboard/shared/stats-grid";
import { useUser } from "@/hooks/use-user";
import { useDoc, useMemoFirebase } from "@/firebase";
import { Skeleton } from "@/components/ui/skeleton";
import type { DashboardSummary } from "@/lib/types";

export function CTDDashboard() {
  const { user, isLoading: isUserLoading } = useUser();

  const { data: summary, isLoading: summaryLoading } = useDoc<DashboardSummary>(
    useMemoFirebase(() => null, []), 
    user ? `corporates/${user.id}/dashboardSummary` : undefined
  );

  const isLoading = isUserLoading || summaryLoading;

  return (
    <div className="space-y-6">
      <PageHeader title="Corporate Governance" description={`Oversight for ${user?.company}.`} />
      
      <StatsGrid>
        <StatsCard title="Spend (MTD)" value={isLoading ? <Skeleton className="h-6 w-16" /> : `₹ ${(summary?.revenueThisMonth! / 100000).toFixed(1)} L`} icon={TrendingUp} description="Institutional spend" />
        <StatsCard title="Awaiting Sign-off" href="/dashboard/ctd/approvals" value={isLoading ? <Skeleton className="h-6 w-8" /> : summary?.pendingRequests.toString()} icon={ShieldCheck} description="Internal workflow" />
        <StatsCard title="Policy Flags" href="/dashboard/ctd/policies" value={isLoading ? <Skeleton className="h-6 w-8" /> : "2"} icon={AlertCircle} description="Exceptions flagged" />
        <StatsCard title="Active Personnel" href="/dashboard/ctd/team" value={isLoading ? <Skeleton className="h-6 w-8" /> : "42"} icon={Users} description="Eligible travelers" />
      </StatsGrid>
    </div>
  );
}
