
import { Header } from '@/components/header';
import { MainSidebar } from '@/components/main-sidebar';
import { Sidebar, SidebarInset, SidebarProvider, SidebarRail } from '@/components/ui/sidebar';
import React from 'react';
import Link from 'next/link';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-background">
      {/* Dynamic Aviation Atmosphere Layer */}
      <div className="fixed inset-0 z-0 bg-aviation-radial" />
      
      <SidebarProvider className="relative z-10">
        <Sidebar collapsible="icon" className="border-r-0 bg-transparent">
          <MainSidebar />
        </Sidebar>
        <SidebarRail />
        <SidebarInset className="bg-transparent">
          <Header />
          <main className="flex flex-1 flex-col gap-6 p-6 lg:p-8">
            <div className="flex-1">
              {children}
            </div>
            
            <footer className="mt-auto pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] text-muted-foreground uppercase tracking-[0.2em]">
                <p>&copy; {new Date().getFullYear()} AeroDesk Aviation Infrastructure. NSOP COORDINATION ONLY.</p>
                <div className="flex gap-6">
                    <Link href="mailto:feedback@aerodesk.com" className="hover:text-accent transition-colors">Feedback & Suggestions</Link>
                    <Link href="#" className="hover:text-accent transition-colors">System Status</Link>
                </div>
            </footer>
          </main>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}
