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
  // System shutdown flag - Set to false to restore functionality
  const isShutdown = false;

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
            {children}
            <Toaster />
          </FirebaseClientProvider>
        </UserProvider>
      </body>
    </html>
  );
}
