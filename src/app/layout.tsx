import type { Metadata } from 'next';
import './globals.css';
import { cn } from '@/lib/utils';
import { Toaster } from '@/components/ui/toaster';
import { Inter } from 'next/font/google';
import { UserProvider } from '@/hooks/use-user';
import { FirebaseClientProvider } from '@/firebase';

export const metadata: Metadata = {
  title: 'AeroDesk',
  description:
    'A compliance-first digital aviation infrastructure platform for non-scheduled charter operations (NSOP) in India.',
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
          inter.variable,
          process.env.NODE_ENV === 'development' ? 'debug-screens' : ''
        )}
      >
        <FirebaseClientProvider>
          <UserProvider>
            {children}
            <Toaster />
          </UserProvider>
        </FirebaseClientProvider>
      </body>
    </html>
  );
}
