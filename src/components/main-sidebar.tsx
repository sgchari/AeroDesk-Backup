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
  LifeBuoy,
  Armchair,
  History,
  BedDouble,
  Bell,
  CalendarCheck,
  Coins,
  Zap,
  LogOut
} from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

import { useUser } from '@/hooks/use-user';
import type { UserRole } from '@/lib/types';
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

const navItems: Record<string, any[]> = {
  Customer: [
    { href: '/dashboard', label: 'Dashboard', icon: Home, color: 'text-sky-400' },
    { href: '/dashboard/charter-rfq', label: 'My Trips', icon: FileText, color: 'text-blue-400' },
    { href: '/dashboard/customer/empty-legs', label: 'Available Jet Seats', icon: Armchair, color: 'text-emerald-400' },
    { href: '#', label: 'Support', icon: LifeBuoy, color: 'text-slate-400' },
  ],
  Requester: [
    { href: '/dashboard', label: 'Dashboard', icon: Home, color: 'text-sky-400' },
    { href: '/dashboard/charter-rfq', label: 'My Trips', icon: FileText, color: 'text-blue-400' },
    { href: '/dashboard/customer/empty-legs', label: 'Available Jet Seats', icon: Armchair, color: 'text-emerald-400' },
    { href: '#', label: 'Support', icon: LifeBuoy, color: 'text-slate-400' },
  ],
  Operator: [
    { href: '/dashboard', label: 'Command Center', icon: Home, color: 'text-sky-400' },
    { href: '/dashboard/operator/rfq-marketplace', label: 'Charter Marketplace', icon: GanttChartSquare, color: 'text-amber-400' },
    { href: '/dashboard/operator/empty-legs', label: 'Empty Leg Management', icon: Plane, color: 'text-emerald-400' },
    { href: '/dashboard/operator/seat-requests', label: 'Seat Requests', icon: Users, color: 'text-violet-400' },
    { href: '/dashboard/operator/fleet', label: 'Fleet & Availability', icon: Plane, color: 'text-slate-400' },
    { href: '/dashboard/operator/crew', label: 'Crew & Logistics', icon: Users, color: 'text-blue-400' },
    { href: '/dashboard/operator/reports', label: 'Analytics & Insights', icon: BarChart2, color: 'text-fuchsia-400' },
  ],
  'Travel Agency': [
    { href: '/dashboard', label: 'Dashboard', icon: Home, color: 'text-sky-400' },
    { href: '/dashboard/travel-agency/available-seats', label: 'Available Jet Seats', icon: Armchair, color: 'text-emerald-400' },
    { href: '/dashboard/travel-agency/seat-requests', label: 'Seat Requests', icon: Users, color: 'text-violet-400' },
    { href: '/dashboard/travel-agency/charter-requests', label: 'Charter Requests', icon: FileText, color: 'text-blue-400' },
    { href: '/dashboard/travel-agency/accommodation-requests', label: 'Accommodation', icon: Building, color: 'text-orange-400' },
    { href: '/dashboard/travel-agency/revenue-share', label: 'Earnings & Revenue', icon: Coins, color: 'text-accent' },
    { href: '/dashboard/travel-agency/reports', label: 'Reports / History', icon: History, color: 'text-fuchsia-400' },
  ],
  'CTD Admin': [
    { href: '/dashboard', label: 'Governance Dashboard', icon: Home, color: 'text-sky-400' },
    { href: '/dashboard/ctd/requests', label: 'Demand Queue', icon: FileText, color: 'text-blue-400' },
    { href: '/dashboard/ctd/approvals', label: 'Approval Workflows', icon: ShieldCheck, color: 'text-amber-400' },
    { href: '/dashboard/customer/empty-legs', label: 'Available Jet Seats', icon: Armchair, color: 'text-emerald-400' },
    { href: '/dashboard/ctd/analytics', label: 'Reports / Analytics', icon: BarChart2, color: 'text-fuchsia-400' },
    { href: '/dashboard/ctd/team', label: 'Personnel Registry', icon: Users, color: 'text-violet-400' },
    { href: '/dashboard/ctd/policies', label: 'Travel Policies', icon: Settings, color: 'text-slate-400' },
  ],
  'Corporate Admin': [
    { href: '/dashboard', label: 'Governance Dashboard', icon: Home, color: 'text-sky-400' },
    { href: '/dashboard/ctd/requests', label: 'Demand Queue', icon: FileText, color: 'text-blue-400' },
    { href: '/dashboard/ctd/approvals', label: 'Approval Workflows', icon: ShieldCheck, color: 'text-amber-400' },
    { href: '/dashboard/customer/empty-legs', label: 'Available Jet Seats', icon: Armchair, color: 'text-emerald-400' },
    { href: '/dashboard/ctd/analytics', label: 'Reports / Analytics', icon: BarChart2, color: 'text-fuchsia-400' },
    { href: '/dashboard/ctd/team', label: 'Personnel Registry', icon: Users, color: 'text-violet-400' },
    { href: '/dashboard/ctd/policies', label: 'Travel Policies', icon: Settings, color: 'text-slate-400' },
  ],
  'Hotel Partner': [
    { href: '/dashboard', label: 'Dashboard', icon: Home, color: 'text-sky-400' },
    { href: '/dashboard/hotel/requests', label: 'Stay Requests', icon: Briefcase, color: 'text-rose-400' },
    { href: '/dashboard/hotel/availability', label: 'Availability & Rates', icon: CalendarCheck, color: 'text-amber-400' },
    { href: '/dashboard/hotel/properties', label: 'Properties', icon: Building, color: 'text-orange-400' },
    { href: '/dashboard/hotel/room-categories', label: 'Room categories', icon: BedDouble, color: 'text-teal-400' },
    { href: '/dashboard/hotel/reports', label: 'Reports / History', icon: History, color: 'text-fuchsia-400' },
  ],
  Admin: [
    { href: '/dashboard', label: 'Overview', icon: Home, color: 'text-sky-400' },
    { href: '/dashboard/admin/analytics', label: 'Platform Intelligence', icon: BarChart2, color: 'text-fuchsia-400' },
    { href: '/dashboard/admin/revenue-share', label: 'Revenue Share Engine', icon: Zap, color: 'text-accent' },
    { href: '/dashboard/admin/approvals', label: 'Approvals & Compliance', icon: ShieldCheck, color: 'text-emerald-400' },
    { href: '/dashboard/admin/users', label: 'User & Entity Governance', icon: Users, color: 'text-violet-400' },
    { href: '/dashboard/admin/operators', label: 'Operator Governance', icon: Plane, color: 'text-slate-400' },
    { href: '/dashboard/admin/partners', label: 'Partner Governance', icon: Briefcase, color: 'text-rose-400' },
    { href: '/dashboard/admin/corporates', label: 'Corporate Governance', icon: Building, color: 'text-orange-400' },
    { href: '/dashboard/admin/audit-trail', label: 'Audit Trail', icon: FileText, color: 'text-amber-400' },
    { href: '/dashboard/admin/billing', label: 'Billing & Financials', icon: CreditCard, color: 'text-lime-400' },
    { href: '/dashboard/admin/team', label: 'Admin Team Governance', icon: Users, color: 'text-indigo-400' },
    { href: '/dashboard/admin/settings', label: 'System Controls', icon: Settings, color: 'text-blue-400' },
  ],
};

function SidebarSkeleton() {
    return (
      <div className="flex-1 overflow-auto py-2 px-2">
        <div className="grid items-start text-sm font-medium gap-1">
          <SidebarMenuSkeleton showIcon />
          <SidebarMenuSkeleton showIcon />
          <SidebarMenuSkeleton showIcon />
          <SidebarMenuSkeleton showIcon />
          <SidebarMenuSkeleton showIcon />
        </div>
      </div>
    )
}

export function MainSidebar({ className }: { className?: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isLoading, logout } = useUser();
  const { isMobile, setOpenMobile } = useSidebar();
  const currentNavItems = user ? navItems[user.role as string] || [] : [];

  const handleLinkClick = () => {
    if (isMobile) {
      setOpenMobile(false);
    }
  };

  const handleLogout = () => {
    logout();
    if (isMobile) {
      setOpenMobile(false);
    }
    // Redirection to homepage
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
        {isLoading ? <SidebarSkeleton /> : (
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
                      isActive && "active-glow font-bold text-white shadow-sm"
                    )}
                  >
                    <Link href={href}>
                      <Icon className={cn(color, isActive && "pulse-primary")} />
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
                <span className="text-[10px] font-black uppercase tracking-[0.2em]">Logout System</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      )}
    </>
  );
}
