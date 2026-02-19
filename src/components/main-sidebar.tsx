'use client';
import {
  Bell,
  Home,
  Users,
  Plane,
  FileText,
  Building,
  Briefcase,
  ShieldCheck,
  BarChart2,
  Settings,
  GanttChartSquare
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { cn } from '@/lib/utils';
import { useUser } from '@/hooks/use-user';
import type { UserRole } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Logo } from './logo';

const navItems = {
  Customer: [
    { href: '/dashboard', label: 'Dashboard', icon: Home },
    { href: '/dashboard/charter-rfq', label: 'My Charter RFQs', icon: FileText },
  ],
  Operator: [
    { href: '/dashboard', label: 'Dashboard', icon: Home },
    { href: '/dashboard/operator/rfq-marketplace', label: 'RFQ Marketplace', icon: GanttChartSquare },
    { href: '/dashboard/operator/fleet', label: 'My Fleet', icon: Plane },
    { href: '/dashboard/operator/empty-legs', label: 'Empty Legs', icon: Plane },
  ],
  'Authorized Distributor': [
    { href: '/dashboard', label: 'Dashboard', icon: Home },
    { href: '/dashboard/distributor/empty-legs', label: 'Approved Empty Legs', icon: Plane },
  ],
  'CTD Requester': [
    { href: '/dashboard', label: 'Dashboard', icon: Home },
    { href: '/dashboard/ctd/requests', label: 'My Requests', icon: FileText },
  ],
  'CTD Approver': [
    { href: '/dashboard', label: 'Dashboard', icon: Home },
    { href: '/dashboard/ctd/approvals', label: 'Pending Approvals', icon: ShieldCheck },
    { href: '/dashboard/ctd/analytics', label: 'Analytics', icon: BarChart2 },
  ],
  'CTD Admin': [
    { href: '/dashboard', label: 'Dashboard', icon: Home },
    { href: '/dashboard/ctd/approvals', label: 'All Requests', icon: GanttChartSquare },
    { href: '/dashboard/ctd/policies', label: 'Travel Policies', icon: Settings },
    { href: '/dashboard/ctd/analytics', label: 'Analytics', icon: BarChart2 },
  ],
  'Hotel Partner': [
    { href: '/dashboard', label: 'Dashboard', icon: Home },
    { href: '/dashboard/hotel/requests', label: 'Accommodation Requests', icon: Briefcase },
    { href: '/dashboard/hotel/properties', label: 'My Properties', icon: Building },
  ],
  Admin: [
    { href: '/dashboard', label: 'Overview', icon: Home },
    { href: '/dashboard/admin/approvals', label: 'Platform Approvals', icon: ShieldCheck },
    { href: '/dashboard/admin/users', label: 'User Management', icon: Users },
    { href: '/dashboard/admin/audit-trail', label: 'Audit Trail', icon: FileText },
    { href: '/dashboard/admin/settings', label: 'Platform Settings', icon: Settings },
  ],
};

export function MainSidebar() {
  const pathname = usePathname();
  const { user } = useUser();
  const currentNavItems = navItems[user.role as UserRole] || [];

  return (
    <div className="hidden border-r bg-muted/40 md:block">
        <div className="flex h-full max-h-screen flex-col gap-2">
            <div className="flex h-16 items-center border-b px-6">
            <Link href="/" className="flex items-center gap-2 font-semibold">
                <Logo />
            </Link>
            </div>
            <div className="flex-1 overflow-auto py-2">
            <nav className="grid items-start px-4 text-sm font-medium">
                {currentNavItems.map(({ href, label, icon: Icon }) => (
                <Link
                    key={href}
                    href={href}
                    className={cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary',
                    pathname === href && 'bg-muted text-primary'
                    )}
                >
                    <Icon className="h-4 w-4" />
                    {label}
                </Link>
                ))}
            </nav>
            </div>
        </div>
    </div>
  );
}
