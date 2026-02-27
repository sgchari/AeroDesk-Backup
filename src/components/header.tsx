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
    <header className="flex h-16 sm:h-20 items-center gap-4 border-b border-white/5 bg-background/30 backdrop-blur-xl px-4 sm:px-6 md:px-8 sticky top-0 z-30">
        <SidebarTrigger className="hover:bg-white/5 h-9 w-9" />
        {state === 'collapsed' && !isMobile ? <Logo className="scale-90 origin-left" /> : null}
        
        <div className="flex w-full items-center gap-2 sm:gap-4 md:ml-auto">
            <form className="ml-auto flex-1 max-w-[180px] sm:max-w-[240px] md:max-w-[320px]">
                <div className="relative group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <Input
                    type="search"
                    placeholder={isMobile ? "Search..." : "Global Intelligence Search..."}
                    className="pl-9 h-9 sm:h-10 w-full bg-white/[0.03] border-white/5 shadow-none focus-visible:ring-1 focus-visible:ring-primary/50 text-[11px] sm:text-xs font-medium placeholder:text-slate-500"
                />
                </div>
            </form>
            <div className="hidden sm:block h-8 w-px bg-white/5 mx-1" />
            <Button variant="ghost" size="icon" className="rounded-full hover:bg-white/5 text-slate-400 hover:text-white h-9 w-9">
                <Bell className="h-4 w-4" />
                <span className="sr-only">Toggle notifications</span>
            </Button>
            <UserNav />
        </div>
    </header>
  );
}
