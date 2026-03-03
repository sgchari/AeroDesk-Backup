import type { Metadata } from 'next';
import './globals.css';
import { cn } from '@/lib/utils';
import { Toaster } from '@/components/ui/toaster';
import { Inter } from 'next/font/google';
import { UserProvider } from '@/hooks/use-user';
import { FirebaseClientProvider } from '@/firebase';

// AeroDesk Version: 1.0.6 - SEO & Performance Optimized
export const metadata: Metadata = {
  title: 'AeroDesk | Digital Aviation Infrastructure for Private Charters in India',
  description:
    'The premier digital platform for Indian NSOP operations. Coordinate private jet charters, empty leg seat allocations, and premium hotel stays through a unified institutional network.',
  keywords: [
    'Private Jet Charter India',
    'NSOP Operations India',
    'Empty Leg Flights India',
    'Corporate Jet Rental Mumbai',
    'Aviation Compliance Software',
    'Digital Aviation Infrastructure',
    'Private Flight Coordination Delhi',
    'AeroDesk Network'
  ],
  authors: [{ name: 'AeroDesk Engineering' }],
  viewport: 'width=device-width, initial-scale=1',
  robots: 'index, follow',
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://aerodesk.aero',
    title: 'AeroDesk | Fly Private. Stay Premium.',
    description: 'Digital coordination and governance for India’s private aviation ecosystem.',
    siteName: 'AeroDesk',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AeroDesk | Private Aviation Infrastructure',
    description: 'Coordinating India’s non-scheduled flight operations through institutional digital layers.',
  },
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
          'min-h-screen font-body antialiased',
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
