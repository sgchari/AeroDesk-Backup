
'use client';

import { Button } from '@/components/ui/button';
import { Logo } from '@/components/logo';
import Image from 'next/image';
import Link from 'next/link';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Activity, Menu, Send, ShieldCheck, Zap } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import React, { useState, useEffect } from 'react';

const LandingHeader = () => {
    return (
        <header className="sticky top-0 z-40 w-full border-b border-border/20 bg-background/80 backdrop-blur-sm">
            <div className="container flex h-20 items-center justify-between">
            <Link href="/">
                <Logo />
            </Link>
            <div className="hidden items-center gap-4 md:flex">
                <Button asChild>
                    <Link href="/login">LOGIN</Link>
                </Button>
            </div>
            <div className="md:hidden">
                <Sheet>
                    <SheetTrigger asChild>
                        <Button variant="ghost" size="icon">
                            <Menu className="h-6 w-6" />
                            <span className="sr-only">Open menu</span>
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="right">
                        <div className="flex flex-col gap-4 p-4">
                            <Logo />
                            <Button asChild>
                                <Link href="/login">Login</Link>
                            </Button>
                            <Button asChild variant="secondary">
                                <Link href="/register">Join the Network</Link>
                            </Button>
                        </div>
                    </SheetContent>
                </Sheet>
            </div>
            </div>
      </header>
    );
};

const StatItem = ({ icon: Icon, value, label }: { icon: React.ElementType, value: string, label: string }) => (
    <div className="flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-full border border-primary/20 bg-primary/10 text-primary">
            <Icon className="h-6 w-6" />
        </div>
        <div>
            <p className="text-3xl font-bold">{value}</p>
            <p className="text-sm uppercase tracking-wider text-muted-foreground">{label}</p>
        </div>
    </div>
);

export default function Home() {
  const heroImage = PlaceHolderImages.find(img => img.id === 'landing-hero');
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const handleScroll = () => {
      const newScale = 1 + window.scrollY / 2000;
      setScale(Math.min(newScale, 1.3));
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <LandingHeader />
      <main className="flex-1">
        <section className="relative h-[100vh] w-full overflow-hidden">
            {heroImage && (
                <Image
                    src={heroImage.imageUrl}
                    alt={heroImage.description}
                    fill
                    priority
                    className="object-cover transition-transform duration-500 ease-out"
                    style={{ transform: `scale(${scale})` }}
                    data-ai-hint={heroImage.imageHint}
                />
            )}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />
          <div className="sticky top-0 z-10 flex h-screen flex-col items-center justify-center pb-20 text-center">
            <div className="max-w-4xl px-4">
              <h1 className="font-headline text-5xl font-bold tracking-tight md:text-6xl lg:text-7xl">
                DIGITAL INFRASTRUCTURE <br />
                <span className="text-primary">FOR AIR CHARTER.</span>
              </h1>
              <p className="mt-6 max-w-2xl mx-auto text-lg text-foreground/80 md:text-xl">
                A simple and reliable way to manage private flights. Built for businesses and flight operators who value efficiency and transparency.
              </p>
              <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
                <Button asChild size="lg" className="w-full sm:w-auto">
                  <Link href="/register">
                    GET STARTED
                    <Activity className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="w-full sm:w-auto">
                  <Link href="/register">
                    JOIN THE NETWORK
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 md:py-20 lg:py-24 bg-background">
            <div className="container">
                <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4">
                   <StatItem icon={Send} value="110+" label="Network Operators" />
                   <StatItem icon={Activity} value="1,800+" label="Successful Flights" />
                   <StatItem icon={Zap} value="Fast" label="Onboarding" />
                   <StatItem icon={ShieldCheck} value="Highest" label="Compliance Standards" />
                </div>
            </div>
        </section>
      </main>
      <footer className="border-t border-border/20 py-6">
        <div className="container flex flex-col items-center justify-between gap-4 md:flex-row">
            <p className="text-sm text-muted-foreground">
                &copy; {new Date().getFullYear()} AeroDesk Platform. All rights reserved.
            </p>
            <div className="flex items-center gap-4">
                <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
                    Terms
                </Link>
                <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
                    Privacy
                </Link>
            </div>
        </div>
      </footer>
    </div>
  );
}
