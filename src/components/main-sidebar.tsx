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
  Network,
  Command,
  TrendingUp,
  UserCog,
  BriefcaseIcon,
  Sparkles,
  Wrench,
  LayoutDashboard,
  Wallet,
  ClipboardList,
  AlertCircle,
  History
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
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent
} from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';

const ADMIN_NAV = [
  { group: "Platform Hub", items: [
    { href: '/dashboard/admin', label: 'Admin Overview', icon: Home, color: 'text-accent' },
    { href: '/dashboard/admin/occ', label: 'OCC Terminal', icon: Radio, color: 'text-emerald-400 font-bold' },
    { href: '/dashboard/admin/monitoring', label: 'System Health', icon: Activity, color: 'text-rose-400' },
    { href: '/dashboard/admin/alerts', label: 'System Alerts', icon: AlertCircle, color: 'text-rose-500' },
  ]},
  { group: "Entity Management", items: [
    { href: '/dashboard/admin/users', label: 'Users', icon: Users, color: 'text-violet-400' },
    { href: '/dashboard/admin/operators', label: 'Operators', icon: Plane, color: 'text-sky-400' },
    { href: '/dashboard/admin/agencies', label: 'Travel Agencies', icon: Briefcase, color: 'text-emerald-400' },
    { href: '/dashboard/admin/hotel-partners', label: 'Hotel Partners', icon: Building, color: 'text-amber-400' },
    { href: '/dashboard/admin/corporates', label: 'Corporate Desks', icon: LayoutDashboard, color: 'text-blue-400' },
  ]},
  { group: "Analytical Reports", items: [
    { href: '/dashboard/admin/reports/charters', label: 'Charter Analytics', icon: GanttChartSquare, color: 'text-amber-400' },
    { href: '/dashboard/admin/reports/jet-seats', label: 'Seat Marketplace', icon: Armchair, color: 'text-sky-400' },
    { href: '/dashboard/admin/reports/revenue', label: 'Revenue Reports', icon: Coins, color: 'text-green-400' },
    { href: '/dashboard/admin/reports/usage', label: 'Usage Analytics', icon: BarChart2, color: 'text-fuchsia-400' },
  ]},
  { group: "Governance", items: [
    { href: '/dashboard/admin/logs', label: 'Activity Logs', icon: History, color: 'text-slate-400' },
    { href: '/dashboard/admin/audit-trail', label: 'Admin Audit', icon: FileText, color: 'text-amber-400' },
    { href: '/dashboard/admin/billing', label: 'Settlement Hub', icon: CreditCard, color: 'text-green-400' },
    { href: '/dashboard/admin/settings', label: 'Platform Settings', icon: Settings, color: 'text-slate-400' },
  ]}
];

const NAV_ITEMS: Record<string, any[]> = {
  operator: [
    { href: '/dashboard', label: 'Overview', icon: Home, color: 'text-accent' },
    { href: '/dashboard/operator/operations', label: 'Operations Center', icon: Radio, color: 'text-emerald-400 font-bold' },
    { href: '/dashboard/operator/rfq-marketplace', label: 'RFQ Exchange', icon: GanttChartSquare, color: 'text-amber-400' },
    { href: '/dashboard/operator/intelligence', label: 'Yield Intelligence', icon: Sparkles, color: 'text-accent' },
    { href: '/dashboard/operator/fleet', label: 'Asset Registry', icon: Plane, color: 'text-slate-400' },
    { href: '/dashboard/operator/maintenance', label: 'Maintenance (MRO)', icon: Wrench, color: 'text-rose-400' },
    { href: '/dashboard/operator/empty-legs', label: 'JetSeat Exchange', icon: Zap, color: 'text-accent' },
    { href: '/dashboard/operator/crew-operations', label: 'Crew & Logistics', icon: Users, color: 'text-sky-400' },
    { href: '/dashboard/manage-users', label: 'Personnel', icon: UserCog, color: 'text-amber-400' },
    { href: '/dashboard/operator/profile', label: 'Firm Identity', icon: Building, color: 'text-accent' },
  ],
  agency: [
    { href: '/dashboard', label: 'Agency Hub', icon: Home, color: 'text-accent' },
    { href: '/dashboard/travel-agency/available-seats', label: 'Seat Inventory', icon: Armchair, color: 'text-emerald-400' },
    { href: '/dashboard/travel-agency/seat-requests', label: 'Seat Leads', icon: Users, color: 'text-blue-400' },
    { href: '/dashboard/travel-agency/charter-requests', label: 'Client Missions', icon: FileText, color: 'text-blue-400' },
    { href: '/dashboard/travel-agency/analytics', label: 'Sales Analytics', icon: BarChart2, color: 'text-fuchsia-400' },
    { href: '/dashboard/travel-agency/revenue-share', label: 'Commission Ledger', icon: Coins, color: 'text-accent' },
    { href: '/dashboard/manage-users', label: 'Team', icon: UserCog, color: 'text-amber-400' },
  ],
  corporate: [
    { href: '/dashboard/corporate/command-center', label: 'Command Center', icon: LayoutDashboard, color: 'text-emerald-400 font-bold' },
    { href: '/dashboard/corporate/travel-desk', label: 'Travel Desk', icon: Briefcase, color: 'text-sky-400' },
    { href: '/dashboard/corporate/requests', label: 'Demand Queue', icon: ClipboardList, color: 'text-blue-400' },
    { href: '/dashboard/corporate/approvals', label: 'Approval Hierarchy', icon: ShieldCheck, color: 'text-amber-400' },
    { href: '/dashboard/corporate/budgets', label: 'Finance & Budget', icon: Wallet, color: 'text-green-400' },
    { href: '/dashboard/corporate/analytics', label: 'Aviation Spend', icon: BarChart2, color: 'text-fuchsia-400' },
    { href: '/dashboard/ctd/available-seats', label: 'Seat Inventory', icon: Armchair, color: 'text-accent' },
    { href: '/dashboard/manage-users', label: 'Authorized Roster', icon: UserCog, color: 'text-slate-400' },
  ],
  hotel: [
    { href: '/dashboard', label: 'Property Portal', icon: Home, color: 'text-accent' },
    { href: '/dashboard/hotel/properties', label: 'Portfolio', icon: Building, color: 'text-amber-400' },
    { href: '/dashboard/hotel/availability', label: 'Revenue Control', icon: Calendar, color: 'text-emerald-400' },
    { href: '/dashboard/hotel/requests', label: 'Mission Stays', icon: Clock, color: 'text-blue-400' },
    { href: '/dashboard/hotel/analytics', label: 'Yield Stats', icon: BarChart2, color: 'text-fuchsia-400' },
    { href: '/dashboard/manage-users', label: 'Staff Management', icon: UserCog, color: 'text-accent' },
  ],
  individual: [
    { href: '/dashboard', label: 'My Terminal', icon: Home, color: 'text-accent' },
    { href: '/dashboard/customer/trip-command', label: 'Trip Command', icon: Command, color: 'text-emerald-400 font-bold' },
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

  const handleLinkClick = () => {
    if (isMobile) setOpenMobile(false);
  };

  const handleLogout = () => {
    logout();
    if (isMobile) setOpenMobile(false);
    router.push('/');
  };

  if (isLoading) return <div className="space-y-2 p-2"><SidebarMenuSkeleton /><SidebarMenuSkeleton /></div>;

  return (
    <>
      <SidebarHeader className="flex h-20 items-center border-b border-white/5 px-4 mb-2">
        <Link href="/dashboard" className="flex items-center gap-2 font-semibold group-data-[state=collapsed]:hidden" onClick={handleLinkClick}>
            <Logo />
        </Link>
      </SidebarHeader>

      <SidebarContent className="px-2">
        {platformRole === 'admin' ? (
          ADMIN_NAV.map((group) => (
            <SidebarGroup key={group.group}>
              <SidebarGroupLabel className="text-[10px] uppercase font-black tracking-widest text-muted-foreground/60 px-4 py-2">
                {group.group}
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {group.items.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                      <SidebarMenuItem key={item.href}>
                        <SidebarMenuButton
                          asChild
                          isActive={isActive}
                          tooltip={item.label}
                          onClick={handleLinkClick}
                          className={cn(
                            "transition-all duration-200 hover:bg-white/5",
                            isActive && "bg-white/5 font-bold text-white border-l-2 border-accent"
                          )}
                        >
                          <Link href={item.href}>
                            <item.icon className={cn(item.color, "h-4 w-4")} />
                            <span className="text-xs">{item.label}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          ))
        ) : (
          <SidebarMenu className="gap-1">
            {(NAV_ITEMS[platformRole] || []).map(({ href, label, icon: Icon, color }) => {
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

      {user && (
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
