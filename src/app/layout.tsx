import type { Metadata } from 'next';
import './globals.css';
import { cn } from '@/lib/utils';
import { Toaster } from '@/components/ui/toaster';
import { Inter } from 'next/font/google';
import { UserProvider } from '@/hooks/use-user';
import { FirebaseClientProvider } from '@/firebase';

export const metadata: Metadata = {
  title: 'AeroDesk | Organized Charter Network',
  description: 'Digital aviation infrastructure platform for private charters and NSOP operations.',
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
  // System shutdown flag - Set to true to suspend terminal operations
  const isShutdown = true;

  return (
    <html lang="en" className="dark">
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
        <UserProvider>
          <FirebaseClientProvider>
            {isShutdown ? (
              <div className="min-h-screen flex items-center justify-center p-4 bg-aviation-radial">
                <div className="text-center space-y-6 max-w-md p-8 rounded-3xl border border-white/10 bg-black/40 backdrop-blur-xl animate-in fade-in zoom-in-95 duration-700">
                  <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto animate-pulse">
                    <div className="w-2 h-2 rounded-full bg-accent shadow-[0_0_10px_hsl(var(--accent))]" />
                  </div>
                  <div className="space-y-2">
                    <h1 className="text-3xl font-black text-white uppercase tracking-tighter">Terminal Offline</h1>
                    <p className="text-muted-foreground uppercase text-[10px] tracking-[0.2em] font-black">Institutional Protocol Suspended</p>
                  </div>
                  <div className="h-px w-full bg-white/5" />
                  <p className="text-xs text-white/40 leading-relaxed italic">
                    All coordination services, fleet telemetry, and marketplace exchanges are currently offline. Access restricted by System Administrator.
                  </p>
                </div>
              </div>
            ) : (
              <>
                {children}
                <Toaster />
              </>
            )}
          </FirebaseClientProvider>
        </UserProvider>
      </body>
    </html>
  );
}
