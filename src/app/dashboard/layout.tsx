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
    <>
      <div
        className="fixed inset-0 -z-10 bg-[#c8c8c8]"
      />
      <SidebarProvider>
        <Sidebar collapsible="icon">
          <MainSidebar />
        </Sidebar>
        <SidebarRail />
        <SidebarInset className="bg-transparent">
          <Header />
          <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
            {children}
          </main>
        </SidebarInset>
      </SidebarProvider>
    </>
  );
}
