import { Header } from '@/components/header';
import { MainSidebar } from '@/components/main-sidebar';
import { Sidebar, SidebarInset, SidebarProvider, SidebarRail } from '@/components/ui/sidebar';
import React from 'react';

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
            {children}
          </main>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}
