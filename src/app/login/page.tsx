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
import { ShieldCheck, Plane, Briefcase, Hotel, Users, User as UserIcon } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useUser();

  const handleDemoLogin = (user: User) => {
    login(user.id);
    router.push('/dashboard');
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
        case 'Admin': return <ShieldCheck className="h-4 w-4 text-primary" />;
        case 'Operator': return <Plane className="h-4 w-4 text-accent" />;
        case 'Travel Agency': return <Briefcase className="h-4 w-4 text-emerald-400" />;
        case 'CTD Admin':
        case 'Requester': return <Users className="h-4 w-4 text-sky-400" />;
        case 'Hotel Partner': return <Hotel className="h-4 w-4 text-rose-400" />;
        default: return <UserIcon className="h-4 w-4 text-slate-400" />;
    }
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
          <Card className="w-full max-w-2xl border-white/10 bg-black/30 text-white backdrop-blur-xl shadow-2xl">
            <CardHeader className="text-center pb-2">
              <div className="flex justify-center mb-6">
                <Link href="/">
                  <Logo className="scale-110" />
                </Link>
              </div>
              <CardTitle className="text-2xl font-headline font-bold">AeroDesk Simulation Hub</CardTitle>
              <CardDescription className="text-white/60 uppercase tracking-widest text-[10px] font-black mt-2">
                Select an institutional profile to enter the coordination protocol
              </CardDescription>
            </CardHeader>
            
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {mockUsers.map(user => (
                  <Button 
                    key={user.id} 
                    variant="outline"
                    className="h-auto py-4 px-4 bg-white/5 border-white/5 hover:bg-white/10 hover:border-accent/30 transition-all flex flex-col items-start gap-2 group"
                    onClick={() => handleDemoLogin(user)}>
                      <div className="flex items-center justify-between w-full">
                        <Badge variant="outline" className="text-[8px] font-black uppercase border-white/10 group-hover:border-accent/50 group-hover:text-accent">
                            {user.role}
                        </Badge>
                        {getRoleIcon(user.role)}
                      </div>
                      <div className="text-left">
                        <p className="text-sm font-bold text-white">{user.firstName} {user.lastName}</p>
                        <p className="text-[10px] text-white/40 italic">{user.company || 'Direct Platform Access'}</p>
                      </div>
                  </Button>
                ))}
              </div>
              
              <div className="mt-8 pt-6 border-t border-white/10 text-center space-y-4">
                <div className="flex items-center justify-center gap-2 text-[10px] text-white/40 font-bold uppercase tracking-widest">
                    <ShieldCheck className="h-3 w-3 text-primary" />
                    Secure Simulation Mode Active
                </div>
                <p className="text-[11px] text-white/60 leading-relaxed max-w-sm mx-auto">
                    This is a read-only institutional demo. Registration for live NSOP coordination is currently invitation-only.
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
