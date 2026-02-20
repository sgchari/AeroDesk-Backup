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
  CreditCard
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { useUser } from '@/hooks/use-user';
import type { UserRole } from '@/lib/types';
import { Logo } from './logo';
import { SidebarHeader, SidebarContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarMenuSkeleton } from '@/components/ui/sidebar';

const navItems = {
  Customer: [
    { href: '/dashboard', label: 'Dashboard', icon: Home },
    { href: '/dashboard/charter-rfq', label: 'My Charter RFQs', icon: FileText },
  ],
  Operator: [
    { href: '/dashboard', label: 'Dashboard', icon: Home },
    { href: '/dashboard/operator/rfq-marketplace', label: 'RFQ Marketplace', icon: GanttChartSquare },
    { href: '/dashboard/operator/fleet', label: 'My Fleet', icon: Plane },
    { href: '/dashboard/operator/team', label: 'Manage Team', icon: Users },
    { href: '/dashboard/operator/empty-legs', label: 'Empty Legs', icon: Plane },
  ],
  'Authorized Distributor': [
    { href: '/dashboard', label: 'Dashboard', icon: Home },
    { href: '/dashboard/distributor/empty-legs', label: 'Approved Empty Legs', icon: Plane },
    { href: '/dashboard/distributor/team', label: 'Manage Team', icon: Users },
  ],
  'CTD Admin': [
    { href: '/dashboard', label: 'Dashboard', icon: Home },
    { href: '/dashboard/ctd/approvals', label: 'All Requests', icon: GanttChartSquare },
    { href: '/dashboard/ctd/policies', label: 'Travel Policies', icon: Settings },
    { href: '/dashboard/ctd/analytics', label: 'Analytics', icon: BarChart2 },
    { href: '/dashboard/ctd/team', label: 'Manage Team', icon: Users },
  ],
  'Hotel Partner': [
    { href: '/dashboard', label: 'Dashboard', icon: Home },
    { href: '/dashboard/hotel/requests', label: 'Accommodation Requests', icon: Briefcase },
    { href: '/dashboard/hotel/properties', label: 'My Properties', icon: Building },
    { href: '/dashboard/hotel/team', label: 'Manage Team', icon: Users },
  ],
  Admin: [
    { href: '/dashboard', label: 'Overview', icon: Home },
    { href: '/dashboard/admin/approvals', label: 'Platform Approvals', icon: ShieldCheck },
    { href: '/dashboard/admin/users', label: 'User Management', icon: Users },
    { href: '/dashboard/admin/operators', label: 'Operator Management', icon: Plane },
    { href: '/dashboard/admin/partners', label: 'Partner Management', icon: Briefcase },
    { href: '/dashboard/admin/corporates', label: 'Corporate Management', icon: Building },
    { href: '/dashboard/admin/team', label: 'Manage Team', icon: Users },
    { href: '/dashboard/admin/audit-trail', label: 'Audit Trail', icon: FileText },
    { href: '/dashboard/admin/billing', label: 'Billing Records', icon: CreditCard },
    { href: '/dashboard/admin/settings', label: 'Platform Settings', icon: Settings },
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
      <SidebarHeader className="flex h-16 items-center border-b px-4">
        <Link href="/" className="flex items-center gap-2 font-semibold">
            <Logo />
        </Link>
      </SidebarHeader>
      
      <SidebarContent>
        {isLoading ? <SidebarSkeleton /> : (
          <SidebarMenu>
            {currentNavItems.map(({ href, label, icon: Icon }) => (
              <SidebarMenuItem key={href}>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === href || (href !== '/dashboard' && pathname.startsWith(href))}
                  tooltip={label}
                >
                  <Link href={href}>
                    <Icon />
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
