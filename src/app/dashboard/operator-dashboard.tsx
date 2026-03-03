
'use client';
import { PageHeader } from "@/components/dashboard/shared/page-header";
import { ShieldCheck, Activity, Users, AlertTriangle } from "lucide-react";
import { StatsCard } from "@/components/dashboard/shared/stats-card";
import { StatsGrid } from "@/components/dashboard/shared/stats-grid";
import { useUser } from "@/hooks/use-user";
import { useDoc, useMemoFirebase } from "@/firebase";
import { Skeleton } from "@/components/ui/skeleton";
import type { DashboardSummary } from "@/lib/types";

export function OperatorDashboard() {
  const { user, isLoading: isUserLoading } = useUser();

  // CRITICAL: Reads ONLY the pre-computed summary document
  const { data: summary, isLoading: summaryLoading } = useDoc<DashboardSummary>(
    useMemoFirebase(() => null, []), 
    user ? `operators/${user.id}/dashboardSummary` : undefined
  );

  const isLoading = isUserLoading || summaryLoading;

  return (
    <div className="space-y-6">
      <PageHeader title="Operator Command Center" description={`Situational awareness for ${user?.company || 'Fleet'}.`} />
      
      <StatsGrid>
        <StatsCard 
          title="Active Missions" 
          value={isLoading ? <Skeleton className="h-6 w-12" /> : summary?.confirmedTrips.toString()} 
          icon={Activity} 
          description="In execution" 
        />
        <StatsCard 
          title="Pending RFQs" 
          href="/dashboard/operator/rfq-marketplace" 
          value={isLoading ? <Skeleton className="h-6 w-12" /> : summary?.pendingRequests.toString()} 
          icon={ShieldCheck} 
          description="New marketplace demand" 
        />
        <StatsCard 
          title="Seat Leads" 
          href="/dashboard/operator/seat-requests" 
          value={isLoading ? <Skeleton className="h-6 w-12" /> : summary?.seatRequestsPending.toString()} 
          icon={Users} 
          description="Manifest review required" 
        />
        <StatsCard 
          title="Revenue (MTD)" 
          value={isLoading ? <Skeleton className="h-6 w-20" /> : `₹ ${(summary?.revenueThisMonth! / 100000).toFixed(1)} L`} 
          icon={Activity} 
          description="Settled volume" 
        />
      </StatsGrid>

      <div className="p-4 bg-accent/5 border border-accent/20 rounded-lg">
        <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest flex items-center gap-2">
          <ShieldCheck className="h-3 w-3" /> Low-Cost Optimization Protocol Active
        </p>
        <p className="text-[9px] text-muted-foreground mt-1">This dashboard uses single-document reads for real-time counters. Collection scans are disabled to protect billing thresholds.</p>
      </div>
    </div>
  );
}
