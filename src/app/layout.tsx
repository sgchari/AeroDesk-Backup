import type { Metadata } from 'next';
import './globals.css';
import { cn } from '@/lib/utils';
import { Toaster } from '@/components/ui/toaster';
import { Inter } from 'next/font/google';
import { UserProvider } from '@/hooks/use-user';
import { FirebaseClientProvider } from '@/firebase';
import { ShieldAlert } from 'lucide-react';

// AeroDesk Version: 1.0.7 - System Shutdown State
export const metadata: Metadata = {
  title: 'AeroDesk | Terminal Offline',
  description: 'Infrastructure services suspended.',
};

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // System shutdown flag
  const isShutdown = true;

  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Source+Code+Pro:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className={cn(
          'min-h-screen font-body antialiased bg-[#0B1220] text-white',
          inter.variable
        )}
      >
        {isShutdown ? (
          <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center space-y-8 animate-in fade-in duration-1000">
            <div className="p-8 rounded-full bg-rose-500/10 border border-rose-500/20 shadow-[0_0_50px_rgba(244,63,94,0.1)]">
              <ShieldAlert className="h-20 w-20 text-rose-500 animate-pulse" />
            </div>
            <div className="space-y-3">
              <h1 className="text-5xl font-black uppercase tracking-tighter font-headline">Terminal Offline</h1>
              <p className="text-muted-foreground text-sm uppercase tracking-[0.4em] font-black opacity-60">AeroDesk Infrastructure Shutdown</p>
            </div>
            <div className="max-w-md p-6 rounded-2xl bg-white/[0.02] border border-white/5 backdrop-blur-xl italic text-[10px] text-white/30 leading-relaxed uppercase tracking-widest">
              "The AeroDesk platform coordination services have been suspended. All institutional links, fleet registries, and mission dispatch protocols are currently inactive. System state: Hibernate."
            </div>
            <div className="pt-8 border-t border-white/5 w-64 opacity-20">
                <p className="text-[8px] font-bold uppercase tracking-[0.2em]">Ref: SYS-HALT-PROTOCOL-9</p>
            </div>
          </div>
        ) : (
          <UserProvider>
            <FirebaseClientProvider>
              {children}
              <Toaster />
            </FirebaseClientProvider>
          </UserProvider>
        )}
      </body>
    </html>
  );
}
