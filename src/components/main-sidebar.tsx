
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
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { useUser } from '@/hooks/use-user';
import type { UserRole } from '@/lib/types';
import { Logo } from './logo';
import { SidebarHeader, SidebarContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarMenuSkeleton } from '@/components/ui/sidebar';

const navItems = {
  Customer: [
    { href: '/dashboard', label: 'Dashboard', icon: Home, color: 'text-sky-500' },
    { href: '/dashboard/customer/my-trips', label: 'My Trips', icon: FileText, color: 'text-blue-500' },
    { href: '/dashboard/customer/empty-legs', label: 'Available Jet Seats', icon: Armchair, color: 'text-green-500' },
    { href: '#', label: 'Support', icon: LifeBuoy, color: 'text-gray-500' },
  ],
  Operator: [
    { href: '/dashboard', label: 'Dashboard', icon: Home, color: 'text-sky-500' },
    { href: '/dashboard/operator/rfq-marketplace', label: 'Charter Requests', icon: GanttChartSquare, color: 'text-amber-500' },
    { href: '/dashboard/operator/empty-legs', label: 'Empty Legs', icon: Plane, color: 'text-green-500' },
    { href: '/dashboard/operator/fleet', label: 'Fleet & Availability', icon: Plane, color: 'text-gray-500' },
    { href: '/dashboard/operator/crew', label: 'Crew & Logistics', icon: Users, color: 'text-violet-500' },
  ],
  'Travel Agency': [
    { href: '/dashboard', label: 'Dashboard', icon: Home, color: 'text-sky-500' },
    { href: '/dashboard/travel-agency/available-seats', label: 'Available Jet Seats', icon: Armchair, color: 'text-green-500' },
    { href: '/dashboard/travel-agency/seat-requests', label: 'Seat Requests', icon: Users, color: 'text-violet-500' },
    { href: '/dashboard/travel-agency/charter-requests', label: 'Charter Requests', icon: FileText, color: 'text-blue-500' },
    { href: '/dashboard/travel-agency/accommodation-requests', label: 'Accommodation', icon: Building, color: 'text-orange-500' },
    { href: '/dashboard/travel-agency/client-activity', label: 'Client Activity', icon: GanttChartSquare, color: 'text-amber-500' },
    { href: '/dashboard/travel-agency/reports', label: 'Reports / History', icon: History, color: 'text-fuchsia-500' },
  ],
  'CTD Admin': [
    { href: '/dashboard', label: 'Dashboard', icon: Home, color: 'text-sky-500' },
    { href: '/dashboard/ctd/approvals', label: 'All Requests', icon: GanttChartSquare, color: 'text-amber-500' },
    { href: '/dashboard/ctd/policies', label: 'Travel Policies', icon: Settings, color: 'text-gray-500' },
    { href: '/dashboard/ctd/analytics', label: 'Analytics', icon: BarChart2, color: 'text-fuchsia-500' },
    { href: '/dashboard/ctd/team', label: 'Manage Team', icon: Users, color: 'text-violet-500' },
  ],
  'Hotel Partner': [
    { href: '/dashboard', label: 'Dashboard', icon: Home, color: 'text-sky-500' },
    { href: '/dashboard/hotel/requests', label: 'Accommodation Requests', icon: Briefcase, color: 'text-rose-500' },
    { href: '/dashboard/hotel/properties', label: 'My Properties', icon: Building, color: 'text-orange-500' },
    { href: '/dashboard/hotel/team', label: 'Manage Team', icon: Users, color: 'text-violet-500' },
  ],
  Admin: [
    { href: '/dashboard', label: 'Overview', icon: Home, color: 'text-sky-500' },
    { href: '/dashboard/admin/approvals', label: 'Platform Approvals', icon: ShieldCheck, color: 'text-green-500' },
    { href: '/dashboard/admin/users', label: 'User Management', icon: Users, color: 'text-violet-500' },
    { href: '/dashboard/admin/operators', label: 'Operator Management', icon: Plane, color: 'text-gray-500' },
    { href: '/dashboard/admin/partners', label: 'Partner Management', icon: Briefcase, color: 'text-rose-500' },
    { href: '/dashboard/admin/corporates', label: 'Corporate Management', icon: Building, color: 'text-orange-500' },
    { href: '/dashboard/admin/team', label: 'Manage Team', icon: Users, color: 'text-indigo-500' },
    { href: '/dashboard/admin/audit-trail', label: 'Audit Trail', icon: FileText, color: 'text-amber-500' },
    { href: '/dashboard/admin/billing', label: 'Billing Records', icon: CreditCard, color: 'text-lime-500' },
    { href: '/dashboard/admin/settings', label: 'Platform Settings', icon: Settings, color: 'text-blue-500' },
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
  const { user, isLoading } = useUser();
  const currentNavItems = user ? navItems[user.role as UserRole] || [] : [];

  return (
    <>
      <SidebarHeader className="flex h-20 items-center border-b px-4">
        <Link href="/dashboard" className="flex items-center gap-2 font-semibold group-data-[state=collapsed]:hidden">
            <Logo />
        </Link>
      </SidebarHeader>
      
      <SidebarContent>
        {isLoading ? <SidebarSkeleton /> : (
          <SidebarMenu>
            {currentNavItems.map(({ href, label, icon: Icon, color }) => (
              <SidebarMenuItem key={href}>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === href || (href !== '/dashboard' && pathname.startsWith(href))}
                  tooltip={label}
                >
                  <Link href={href}>
                    <Icon className={color} />
                    <span>{label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        )}
      </SidebarContent>
    </>
  );
}
