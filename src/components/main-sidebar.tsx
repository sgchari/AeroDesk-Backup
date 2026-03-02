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
  Clock
} from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

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
    { href: '/dashboard', label: 'Overview', icon: Home, color: 'text-sky-400' },
    { href: '/dashboard/admin/analytics', label: 'Platform Intelligence', icon: BarChart2, color: 'text-fuchsia-400' },
    { href: '/dashboard/admin/revenue-share', label: 'Revenue Share Engine', icon: Zap, color: 'text-accent' },
    { href: '/dashboard/admin/approvals', label: 'Approvals & Compliance', icon: ShieldCheck, color: 'text-emerald-400' },
    { href: '/dashboard/admin/users', label: 'User & Entity Governance', icon: Users, color: 'text-violet-400' },
    { href: '/dashboard/admin/operators', label: 'Operator Governance', icon: Plane, color: 'text-sky-400' },
    { href: '/dashboard/admin/partners', label: 'Partner Governance', icon: Briefcase, color: 'text-rose-400' },
    { href: '/dashboard/admin/corporates', label: 'Corporate Governance', icon: Building, color: 'text-orange-400' },
    { href: '/dashboard/admin/audit-trail', label: 'Audit Trail', icon: FileText, color: 'text-amber-400' },
    { href: '/dashboard/admin/gst-verification', label: 'GST Verification', icon: Scale, color: 'text-amber-400' },
    { href: '/dashboard/admin/billing', label: 'Billing & Financials', icon: CreditCard, color: 'text-green-400' },
    { href: '/dashboard/admin/team', label: 'Admin Team Governance', icon: Users, color: 'text-blue-400' },
    { href: '/dashboard/admin/settings', label: 'System Controls', icon: Settings, color: 'text-slate-400' },
  ],
  operator: [
    { href: '/dashboard', label: 'Command Center', icon: Home, color: 'text-sky-400' },
    { href: '/dashboard/operator/rfq-marketplace', label: 'Marketplace', icon: GanttChartSquare, color: 'text-amber-400' },
    { href: '/dashboard/operator/fleet', label: 'Fleet Registry', icon: Plane, color: 'text-slate-400' },
    { href: '/dashboard/operator/crew', label: 'Crew & Logistics', icon: Users, color: 'text-sky-400' },
    { href: '/dashboard/operator/empty-legs', label: 'Empty Leg Inventory', icon: Zap, color: 'text-accent' },
    { href: '/dashboard/operator/seat-requests', label: 'Seat Request Queue', icon: Armchair, color: 'text-emerald-400' },
    { href: '/dashboard/operator/users', label: 'Firm Personnel', icon: ShieldCheck, color: 'text-violet-400' },
    { href: '/dashboard/operator/profile', label: 'Company Profile', icon: Building, color: 'text-accent' },
    { href: '/dashboard/operator/reports', label: 'Analytics', icon: BarChart2, color: 'text-fuchsia-400' },
  ],
  agency: [
    { href: '/dashboard', label: 'Dashboard', icon: Home, color: 'text-sky-400' },
    { href: '/dashboard/travel-agency/available-seats', label: 'Jet Seats', icon: Armchair, color: 'text-emerald-400' },
    { href: '/dashboard/travel-agency/charter-requests', label: 'Requests', icon: FileText, color: 'text-blue-400' },
    { href: '/dashboard/travel-agency/revenue-share', label: 'Earnings', icon: Coins, color: 'text-accent' },
  ],
  corporate: [
    { href: '/dashboard', label: 'Governance', icon: Home, color: 'text-sky-400' },
    { href: '/dashboard/ctd/requests', label: 'Demand Queue', icon: FileText, color: 'text-blue-400' },
    { href: '/dashboard/ctd/approvals', label: 'Workflows', icon: ShieldCheck, color: 'text-amber-400' },
    { href: '/dashboard/ctd/team', label: 'Personnel', icon: Users, color: 'text-violet-400' },
  ],
  hotel: [
    { href: '/dashboard', label: 'Console', icon: Home, color: 'text-sky-400' },
    { href: '/dashboard/hotel/properties', label: 'Properties', icon: Building, color: 'text-amber-400' },
    { href: '/dashboard/hotel/room-categories', label: 'Room Types', icon: BedDouble, color: 'text-violet-400' },
    { href: '/dashboard/hotel/availability', label: 'Availability', icon: Calendar, color: 'text-emerald-400' },
    { href: '/dashboard/hotel/requests', label: 'Stay Requests', icon: Clock, color: 'text-blue-400' },
    { href: '/dashboard/hotel/reports', label: 'Yield Analytics', icon: BarChart2, color: 'text-fuchsia-400' },
    { href: '/dashboard/hotel/team', label: 'Staff Management', icon: Users, color: 'text-slate-400' },
  ],
  individual: [
    { href: '/dashboard', label: 'Dashboard', icon: Home, color: 'text-sky-400' },
    { href: '/dashboard/charter-rfq', label: 'My Trips', icon: FileText, color: 'text-blue-400' },
    { href: '/dashboard/customer/empty-legs', label: 'Jet Seats', icon: Armchair, color: 'text-emerald-400' },
  ]
};

export function MainSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isLoading, logout } = useUser();
  const { isMobile, setOpenMobile } = useSidebar();

  const platformRole = user?.platformRole || 'individual';
  const currentNavItems = NAV_ITEMS[platformRole] || [];

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
                <span className="text-[10px] font-black uppercase tracking-[0.2em]">Exit Terminal</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      )}
    </>
  );
}
