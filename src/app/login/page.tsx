
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Logo } from '@/components/logo';
import { mockUsers } from '@/lib/data';
import type { User } from '@/lib/types';
import { LandingHeader } from '@/components/landing-header';
import { LandingFooter } from '@/components/landing-footer';
import { useUser } from '@/hooks/use-user';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useUser();

  const handleDemoLogin = (user: User) => {
    // Call context login to stabilize state before navigation
    login(user.id);
    router.push('/dashboard');
  };

  return (
    <div className="w-full relative min-h-screen">
      {/* Background Layer: Optimized with next/image */}
      <div className="fixed inset-0 z-0">
        <Image
          src="https://images.unsplash.com/photo-1506929562872-bb421503ef21?auto=format&fit=crop&q=80&w=2070"
          alt="Aviation Background"
          fill
          priority
          className="object-cover"
          data-ai-hint="airplane beach"
        />
        <div className="absolute inset-0 bg-black/30" />
      </div>
      <div className="relative z-10 flex min-h-screen flex-col bg-transparent">
        <LandingHeader />
        <main className="relative z-10 flex flex-grow flex-col items-center justify-center p-4">
          <Card className="w-full max-w-md border-white/10 bg-black/15 text-white backdrop-blur-md">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <Link href="/">
                  <Logo />
                </Link>
              </div>
              <CardTitle className="text-white">AeroDesk Demo</CardTitle>
              <CardDescription className="text-white/80">Select a user role to explore the dashboard.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                {mockUsers.map(user => (
                  <Button 
                    key={user.id} 
                    variant="outline"
                    className="bg-transparent text-white hover:bg-white/10 hover:text-white"
                    onClick={() => handleDemoLogin(user)}>
                      Login as {user.role}
                  </Button>
                ))}
              </div>
              <div className="mt-6 text-center text-sm text-white/80">
                This is a read-only demo with mock data.
                <br />
                <Link href="/register" className="font-semibold text-accent underline-offset-4 hover:underline">
                  Register for a live account
                </Link> is disabled.
              </div>
            </CardContent>
          </Card>
        </main>
        <LandingFooter />
      </div>
    </div>
  );
}
