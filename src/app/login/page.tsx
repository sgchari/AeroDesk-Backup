
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
import { Badge } from '@/components/ui/badge';
import { ShieldCheck, User as UserIcon } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useUser();

  const handleDemoLogin = (user: User) => {
    login(user.id);
    router.push('/dashboard/select-role');
  };

  return (
    <div className="w-full relative min-h-screen">
      {/* Background Layer */}
      <div className="fixed inset-0 z-0">
        <Image
          src="https://images.unsplash.com/photo-1506929562872-bb421503ef21?auto=format&fit=crop&q=80&w=2070"
          alt="Aviation Background"
          fill
          priority
          className="object-cover"
          data-ai-hint="airplane beach"
        />
        <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />
      </div>
      
      <div className="relative z-10 flex min-h-screen flex-col bg-transparent">
        <LandingHeader />
        
        <main className="relative z-10 flex flex-grow flex-col items-center justify-center p-4 sm:p-8">
          <Card className="w-full max-w-md border-white/10 bg-black/30 text-white backdrop-blur-xl shadow-2xl">
            <CardHeader className="text-center pb-2">
              <div className="flex justify-center mb-6">
                <Link href="/">
                  <Logo className="scale-110" />
                </Link>
              </div>
              <CardTitle className="text-2xl font-headline font-bold">AeroDesk Terminal Access</CardTitle>
              <CardDescription className="text-white/60 uppercase tracking-widest text-[10px] font-black mt-2">
                Enter credentials or initialize the institutional demo
              </CardDescription>
            </CardHeader>
            
            <CardContent className="pt-6">
              <div className="space-y-4">
                {mockUsers.map(user => (
                  <Button 
                    key={user.id} 
                    variant="outline"
                    className="w-full h-auto py-6 px-6 bg-accent text-accent-foreground border-transparent hover:bg-accent/90 transition-all flex items-center justify-between group rounded-xl"
                    onClick={() => handleDemoLogin(user)}>
                      <div className="flex flex-col items-start gap-1">
                        <Badge variant="secondary" className="bg-black/20 text-black border-none text-[8px] font-black uppercase tracking-widest px-2 mb-1">
                            Demo Super User
                        </Badge>
                        <p className="text-sm font-black uppercase tracking-wider">Initialize Simulation</p>
                        <p className="text-[10px] opacity-60 italic lowercase">{user.email}</p>
                      </div>
                      <ShieldCheck className="h-6 w-6 opacity-40 group-hover:opacity-100 transition-opacity" />
                  </Button>
                ))}
              </div>
              
              <div className="mt-8 pt-6 border-t border-white/10 text-center space-y-4">
                <div className="flex items-center justify-center gap-2 text-[10px] text-white/40 font-bold uppercase tracking-widest">
                    <ShieldCheck className="h-3 w-3 text-primary" />
                    Encrypted Protocol Active
                </div>
                <p className="text-[11px] text-white/60 leading-relaxed max-w-xs mx-auto">
                    Institutional access is currently restricted to verified NSOP operators and authorized corporate desks.
                </p>
              </div>
            </CardContent>
          </Card>
        </main>
        
        <LandingFooter />
      </div>
    </div>
  );
}
