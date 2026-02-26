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
    <header className="flex h-20 items-center gap-4 border-b border-white/5 bg-background/30 backdrop-blur-xl px-6 md:px-8 sticky top-0 z-30">
        <SidebarTrigger className="hover:bg-white/5" />
        {state === 'collapsed' && !isMobile ? <Logo /> : null}
        <div className="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
            <form className="ml-auto flex-1 sm:flex-initial">
                <div className="relative group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <Input
                    type="search"
                    placeholder="Global Intelligence Search..."
                    className="pl-9 h-10 w-[240px] md:w-[280px] lg:w-[320px] bg-white/[0.03] border-white/5 shadow-none focus-visible:ring-1 focus-visible:ring-primary/50 text-xs font-medium placeholder:text-slate-500"
                />
                </div>
            </form>
            <div className="h-8 w-px bg-white/5 mx-2" />
            <Button variant="ghost" size="icon" className="rounded-full hover:bg-white/5 text-slate-400 hover:text-white">
                <Bell className="h-4 w-4" />
                <span className="sr-only">Toggle notifications</span>
            </Button>
            <UserNav />
        </div>
    </header>
  );
}
