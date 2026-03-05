'use client';
import {
  Home,
  Users,
  Plane,
  FileText,
  Building,
  Briefcase,
  ShieldCheck,
  BarChart2,
  Settings,
  GanttChartSquare,
  CreditCard,
  Armchair,
  Coins,
  Zap,
  LogOut,
  Scale,
  BedDouble,
  Calendar,
  Clock,
  Activity,
  Radio,
  Target,
  Wand2,
  Table,
  Radar,
  Network
} from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import React, { useMemo } from 'react';

import { useUser } from '@/hooks/use-user';
import { Logo } from './logo';
import {
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSkeleton,
  useSidebar,
  SidebarFooter
} from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';

const NAV_ITEMS: Record<string, any[]> = {
  admin: [
    { href: '/dashboard', label: 'Overview', icon: Home, color: 'text-accent' },
    { href: '/dashboard/admin/occ', label: 'OCC Terminal', icon: Radio, color: 'text-emerald-400 font-bold' },
    { href: '/dashboard/admin/global-charter-radar', label: 'Charter Radar', icon: Radar, color: 'text-sky-400' },
    { href: '/dashboard/admin/jet-availability', label: 'Jet Network', icon: Network, color: 'text-amber-400' },
    { href: '/dashboard/admin/demand-intelligence', label: 'Demand Engine', icon: Target, color: 'text-rose-400' },
    { href: '/dashboard/admin/monitoring', label: 'Network Health', icon: Activity, color: 'text-rose-400' },
    { href: '/dashboard/admin/analytics', label: 'Market Analytics', icon: BarChart2, color: 'text-fuchsia-400' },
    { href: '/dashboard/admin/intelligence', label: 'Global Insights', icon: Wand2, color: 'text-accent' },
    { href: '/dashboard/admin/revenue-share', label: 'Yield Engine', icon: Zap, color: 'text-accent' },
    { href: '/dashboard/admin/users', label: 'Identity Governance', icon: Users, color: 'text-violet-400' },
    { href: '/dashboard/admin/operators', label: 'NSOP Registry', icon: Plane, color: 'text-sky-400' },
    { href: '/dashboard/admin/audit-trail', label: 'Immutable Logs', icon: FileText, color: 'text-amber-400' },
    { href: '/dashboard/admin/billing', label: 'Settlement Hub', icon: CreditCard, color: 'text-green-400' },
  ],
  operator: [
    { href: '/dashboard', label: 'Fleet Console', icon: Home, color: 'text-accent' },
    { href: '/dashboard/operator/rfq-marketplace', label: 'RFQ Exchange', icon: GanttChartSquare, color: 'text-amber-400' },
    { href: '/dashboard/operator/fleet', label: 'Asset Registry', icon: Plane, color: 'text-slate-400' },
    { href: '/dashboard/operator/empty-legs', label: 'JetSeat Exchange', icon: Zap, color: 'text-accent' },
    { href: '/dashboard/operator/fleet-intelligence', label: 'Utilization Engine', icon: Target, color: 'text-emerald-400' },
    { href: '/dashboard/operator/analytics', label: 'Utilization Stats', icon: BarChart2, color: 'text-fuchsia-400' },
    { href: '/dashboard/operator/intelligence', label: 'Route Intelligence', icon: Wand2, color: 'text-accent' },
    { href: '/dashboard/operator/reports', label: 'Yield Reports', icon: Table, color: 'text-sky-400' },
    { href: '/dashboard/operator/profile', label: 'Firm Identity', icon: Building, color: 'text-accent' },
  ],
  agency: [
    { href: '/dashboard', label: 'Agency Hub', icon: Home, color: 'text-accent' },
    { href: '/dashboard/travel-agency/available-seats', label: 'Seat Inventory', icon: Armchair, color: 'text-emerald-400' },
    { href: '/dashboard/travel-agency/charter-requests', label: 'Client Missions', icon: FileText, color: 'text-blue-400' },
    { href: '/dashboard/travel-agency/analytics', label: 'Sales Analytics', icon: BarChart2, color: 'text-fuchsia-400' },
    { href: '/dashboard/travel-agency/intelligence', label: 'Market Trends', icon: Wand2, color: 'text-accent' },
    { href: '/dashboard/travel-agency/revenue-share', label: 'Commission Ledger', icon: Coins, color: 'text-accent' },
    { href: '/dashboard/travel-agency/reports', label: 'Audit Records', icon: Table, color: 'text-sky-400' },
  ],
  corporate: [
    { href: '/dashboard', label: 'Travel Desk', icon: Home, color: 'text-accent' },
    { href: '/dashboard/ctd/requests', label: 'Employee Demand', icon: FileText, color: 'text-blue-400' },
    { href: '/dashboard/ctd/approvals', label: 'Governance Flow', icon: ShieldCheck, color: 'text-amber-400' },
    { href: '/dashboard/ctd/analytics', label: 'Spend Analysis', icon: BarChart2, color: 'text-fuchsia-400' },
    { href: '/dashboard/ctd/intelligence', label: 'Cost Insights', icon: Wand2, color: 'text-accent' },
    { href: '/dashboard/ctd/reports', label: 'Compliance Audit', icon: Table, color: 'text-sky-400' },
  ],
  hotel: [
    { href: '/dashboard', label: 'Property Portal', icon: Home, color: 'text-accent' },
    { href: '/dashboard/hotel/properties', label: 'Portfolio', icon: Building, color: 'text-amber-400' },
    { href: '/dashboard/hotel/availability', label: 'Revenue Control', icon: Calendar, color: 'text-emerald-400' },
    { href: '/dashboard/hotel/requests', label: 'Mission Stays', icon: Clock, color: 'text-blue-400' },
    { href: '/dashboard/hotel/analytics', label: 'Yield Stats', icon: BarChart2, color: 'text-fuchsia-400' },
    { href: '/dashboard/hotel/intelligence', label: 'Demand Signals', icon: Wand2, color: 'text-accent' },
    { href: '/dashboard/hotel/reports', label: 'Financial Audit', icon: Table, color: 'text-sky-400' },
  ],
  individual: [
    { href: '/dashboard', label: 'My Terminal', icon: Home, color: 'text-accent' },
    { href: '/dashboard/charter-rfq', label: 'Active Missions', icon: FileText, color: 'text-blue-400' },
    { href: '/dashboard/customer/empty-legs', label: 'JetSeat Exchange', icon: Armchair, color: 'text-emerald-400' },
    { href: '/dashboard/customer/analytics', label: 'Journey Analytics', icon: BarChart2, color: 'text-fuchsia-400' },
    { href: '/dashboard/customer/reports', label: 'Expense History', icon: Table, color: 'text-sky-400' },
  ]
};

export function MainSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isLoading, logout } = useUser();
  const { isMobile, setOpenMobile } = useSidebar();

  const platformRole = user?.platformRole || 'individual';
  const currentNavItems = useMemo(() => NAV_ITEMS[platformRole] || [], [platformRole]);

  const handleLinkClick = () => {
    if (isMobile) setOpenMobile(false);
  };

  const handleLogout = () => {
    logout();
    if (isMobile) setOpenMobile(false);
    router.push('/');
  };

  return (
    <>
      <SidebarHeader className="flex h-20 items-center border-b border-white/5 px-4 mb-2">
        <Link href="/dashboard" className="flex items-center gap-2 font-semibold group-data-[state=collapsed]:hidden" onClick={handleLinkClick}>
            <Logo />
        </Link>
      </SidebarHeader>

      <SidebarContent className="px-2">
        {isLoading ? <div className="space-y-2 p-2"><SidebarMenuSkeleton /><SidebarMenuSkeleton /></div> : (
          <SidebarMenu className="gap-1">
            {currentNavItems.map(({ href, label, icon: Icon, color }) => {
              const isActive = pathname === href || (href !== '/dashboard' && pathname.startsWith(href));
              return (
                <SidebarMenuItem key={href}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive}
                    tooltip={label}
                    onClick={handleLinkClick}
                    className={cn(
                      "transition-all duration-200 hover:bg-white/5",
                      isActive && "bg-white/5 font-bold text-white shadow-sm border-l-2 border-accent"
                    )}
                  >
                    <Link href={href}>
                      <Icon className={cn(color, "h-4 w-4")} />
                      <span className={cn("text-xs tracking-tight", isActive ? "text-white" : "text-slate-400")}>{label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        )}
      </SidebarContent>

      {!isLoading && user && (
        <SidebarFooter className="p-4 border-t border-white/5">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                onClick={handleLogout}
                className="text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-colors"
              >
                <LogOut className="h-4 w-4" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em] exit-terminal">Exit Terminal</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      )}
    </>
  );
}
