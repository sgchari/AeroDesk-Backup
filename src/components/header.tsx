'use client';

import { Bell, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { UserNav } from '@/components/user-nav';
import { SidebarTrigger, useSidebar } from '@/components/ui/sidebar';
import { Logo } from './logo';

export function Header() {
  const { state, isMobile } = useSidebar();
  return (
    <header className="flex h-20 items-center gap-4 border-b border-white/5 bg-card/50 backdrop-blur-xl px-4 md:px-6 sticky top-0 z-30">
        <SidebarTrigger />
        {state === 'collapsed' && !isMobile ? <Logo /> : null}
        <div className="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
            <form className="ml-auto flex-1 sm:flex-initial">
                <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                    type="search"
                    placeholder="Search RFQs, Users, Logs..."
                    className="pl-8 sm:w-[300px] md:w-[200px] lg:w-[300px] bg-background/40 border-white/10"
                />
                </div>
            </form>
            <Button variant="ghost" size="icon" className="rounded-full hover:bg-white/10">
                <Bell className="h-5 w-5" />
                <span className="sr-only">Toggle notifications</span>
            </Button>
            <UserNav />
        </div>
    </header>
  );
}
