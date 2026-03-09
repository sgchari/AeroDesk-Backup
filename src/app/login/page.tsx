'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Logo } from '@/components/logo';
import { mockUsers } from '@/lib/data';
import type { User } from '@/lib/types';
import { LandingHeader } from '@/components/landing-header';
import { LandingFooter } from '@/components/landing-footer';
import { useUser } from '@/hooks/use-user';
import { Badge } from '@/components/ui/badge';
import { ShieldCheck, User as UserIcon, Lock, Mail, AlertCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useUser();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handleDemoLogin = (user: User) => {
    login(user.id);
    router.push('/dashboard/select-role');
  };

  const handleFormLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoggingIn(true);

    // Institutional Mock Auth Logic
    setTimeout(() => {
        const foundUser = mockUsers.find(u => u.email === email && u.password === password);
        if (foundUser) {
            login(foundUser.id);
            router.push('/dashboard/select-role');
        } else {
            setError("Invalid institutional credentials. Please verify your terminal access.");
        }
        setIsLoggingIn(false);
    }, 800);
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
          <Card className="w-full max-w-md border-white/10 bg-black/30 text-white backdrop-blur-xl shadow-2xl overflow-hidden">
            <CardHeader className="text-center pb-2 bg-white/5">
              <div className="flex justify-center mb-6">
                <Link href="/">
                  <Logo className="scale-110" />
                </Link>
              </div>
              <CardTitle className="text-2xl font-headline font-bold">Terminal Access</CardTitle>
              <CardDescription className="text-white/60 uppercase tracking-widest text-[10px] font-black mt-2">
                AeroDesk Aviation Infrastructure Gateway
              </CardDescription>
            </CardHeader>
            
            <CardContent className="pt-8">
              {/* Official Login Form */}
              <form onSubmit={handleFormLogin} className="space-y-5 mb-8">
                <div className="space-y-2">
                    <Label htmlFor="email" className="text-[10px] uppercase font-black tracking-widest text-white/60">Corporate Email</Label>
                    <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
                        <Input 
                            id="email"
                            type="email" 
                            placeholder="name@aerodesk.global" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="bg-white/5 border-white/10 pl-10 h-11 text-sm focus:ring-accent"
                            required
                        />
                    </div>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="password" className="text-[10px] uppercase font-black tracking-widest text-white/60">Terminal Key</Label>
                    <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
                        <Input 
                            id="password"
                            type="password" 
                            placeholder="••••••••" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="bg-white/5 border-white/10 pl-10 h-11 text-sm focus:ring-accent"
                            required
                        />
                    </div>
                </div>

                {error && (
                    <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 flex items-center gap-2 text-rose-500 animate-in fade-in zoom-in-95">
                        <AlertCircle className="h-4 w-4 shrink-0" />
                        <p className="text-[10px] font-bold uppercase tracking-tight">{error}</p>
                    </div>
                )}

                <Button 
                    type="submit" 
                    className="w-full h-11 bg-accent text-accent-foreground hover:bg-accent/90 font-black uppercase text-[11px] tracking-[0.2em] shadow-xl shadow-accent/10"
                    disabled={isLoggingIn}
                >
                    {isLoggingIn ? "Syncing Terminal..." : "Establish Access Link"}
                </Button>
              </form>

              <div className="relative flex items-center gap-4 mb-8">
                <div className="h-px flex-1 bg-white/10" />
                <span className="text-[9px] font-black uppercase text-white/20 tracking-[0.3em]">Institutional Demo</span>
                <div className="h-px flex-1 bg-white/10" />
              </div>

              <div className="space-y-4">
                {mockUsers.map(user => (
                  <Button 
                    key={user.id} 
                    variant="outline"
                    className="w-full h-auto py-4 px-6 bg-white/5 border-white/10 hover:bg-white/10 text-white transition-all flex items-center justify-between group rounded-xl"
                    onClick={() => handleDemoLogin(user)}>
                      <div className="flex flex-col items-start gap-1">
                        <p className="text-xs font-black uppercase tracking-wider">Initialize Simulation</p>
                        <p className="text-[9px] text-white/40 italic lowercase">{user.email} • {user.password}</p>
                      </div>
                      <ShieldCheck className="h-5 w-5 opacity-40 group-hover:text-accent group-hover:opacity-100 transition-all" />
                  </Button>
                ))}
              </div>
              
              <div className="mt-8 pt-6 border-t border-white/10 text-center space-y-4">
                <div className="flex items-center justify-center gap-2 text-[10px] text-white/40 font-bold uppercase tracking-widest">
                    <ShieldCheck className="h-3 w-3 text-primary" />
                    Encrypted Protocol Active
                </div>
                <p className="text-[11px] text-white/60 leading-relaxed max-w-xs mx-auto">
                    Access is strictly restricted to verified aviation stakeholders and authorized corporate coordination desks.
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