
'use client';

import { Header } from '@/components/header';
import { MainSidebar } from '@/components/main-sidebar';
import { Sidebar, SidebarInset, SidebarProvider, SidebarRail } from '@/components/ui/sidebar';
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { DemoBanner } from '@/components/demo-banner';
import { useUser } from '@/hooks/use-user';
import { RoleSwitcherModal } from '@/components/role-switcher-modal';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useUser();
  const showDemoLayer = user?.demoMode === true;

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-background">
      {/* Dynamic Aviation Atmosphere Layer - Optimized */}
      <div className="fixed inset-0 z-0 bg-aviation-radial" />
      
      {/* Secondary Depth Layer */}
      <div className="fixed inset-0 z-0 opacity-20 mix-blend-overlay">
        <Image 
          src="https://images.unsplash.com/photo-1506929562872-bb421503ef21?auto=format&fit=crop&q=80&w=2070"
          alt="Atmosphere"
          fill
          className="object-cover"
          priority
          data-ai-hint="airplane beach"
        />
      </div>
      
      <div className="relative z-10 flex flex-col min-h-screen">
        {showDemoLayer && <DemoBanner />}
        
        <SidebarProvider className="flex-1">
          <Sidebar collapsible="icon" className="border-r-0 bg-transparent">
            <MainSidebar />
          </Sidebar>
          <SidebarRail />
          <SidebarInset className="bg-transparent overflow-x-hidden">
            <Header />
            <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-8 lg:p-8 min-w-0">
              <div className="flex-1 w-full animate-in fade-in duration-500">
                {children}
              </div>
              
              <footer className="mt-auto pt-2 md:pt-4 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-2 md:gap-4 text-[10px] text-muted-foreground uppercase tracking-[0.2em]">
                  <p className="text-center md:text-left">&copy; {new Date().getFullYear()} AeroDesk Aviation Infrastructure.</p>
                  <div className="flex gap-6">
                      <Link href="mailto:feedback@aerodesk.com" className="hover:text-accent transition-colors">Feedback</Link>
                      <Link href="#" className="hover:text-accent transition-colors">System Status</Link>
                  </div>
              </footer>
            </main>
          </SidebarInset>
        </SidebarProvider>
      </div>

      {showDemoLayer && <RoleSwitcherModal />}
    </div>
  );
}
