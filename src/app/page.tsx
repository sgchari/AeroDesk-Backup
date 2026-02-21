
'use client';

import { Button } from '@/components/ui/button';
import { Logo } from '@/components/logo';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, ShieldCheck, Menu } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useRouter } from 'next/navigation';


const LandingHeader = () => {
    const router = useRouter();
    return (
        <header className="sticky top-0 z-40 w-full border-b border-border/20 bg-background/90 backdrop-blur-sm">
            <div className="container flex h-20 items-center justify-between">
                <Link href="/">
                    <Logo />
                </Link>
                <div className="hidden items-center gap-4 md:flex">
                    <span className='text-sm font-medium text-muted-foreground'>AUTHORIZED ACCESS:</span>
                    <Select onValueChange={(role) => {
                      if (role) router.push('/login');
                    }}>
                        <SelectTrigger className="w-[180px] bg-secondary border-border focus:ring-primary">
                            <SelectValue placeholder="Select Role to Simulate" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="customer">Customer</SelectItem>
                            <SelectItem value="operator">Operator</SelectItem>
                            <SelectItem value="ctd-admin">CTD Admin</SelectItem>
                            <SelectItem value="distributor">Distributor</SelectItem>
                            <SelectItem value="hotel-partner">Hotel Partner</SelectItem>
                            <SelectItem value="admin">Platform Admin</SelectItem>
                        </SelectContent>
                    </Select>
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
                                    <Link href="/login">Login to Platform</Link>
                                </Button>
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
      </header>
    );
};

const FeatureStep = ({ num, title, description }: { num: string; title: string; description: string; }) => (
    <div className="relative overflow-hidden rounded-lg border border-gray-200/10 bg-white/5 p-6 backdrop-blur-sm">
        <div className="flex items-start gap-4">
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded bg-gray-800 font-bold text-white">
            {num}
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold uppercase tracking-wider text-foreground">{title}</h3>
            <p className="mt-1 text-muted-foreground">{description}</p>
          </div>
        </div>
    </div>
);


export default function Home() {
  const heroImage = {
    imageUrl: "https://images.unsplash.com/photo-1569695663721-a82a7f955104?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    description: "Tail of an airplane on a runway at dusk",
    imageHint: "airplane tarmac dusk"
  };
  
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <LandingHeader />
      <main className="flex-1">
        <section className="relative h-[80vh] w-full overflow-hidden">
            {heroImage && (
                <Image
                    src={heroImage.imageUrl}
                    alt={heroImage.description}
                    fill
                    priority
                    className="object-cover"
                    data-ai-hint={heroImage.imageHint}
                />
            )}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
          <div className="absolute inset-0 bg-black/40" />
          <div className="relative z-10 flex h-full flex-col items-start justify-center text-left container">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/50 bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
                <ShieldCheck className="h-4 w-4" />
                REGULATED NSOP INFRASTRUCTURE
              </div>
              <h1 className="mt-4 font-headline text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
                Request a Chartered Flight with AERONEX
              </h1>
              <p className="mt-6 max-w-xl text-lg text-foreground/80 md:text-xl">
                Verified NSOP operators. Transparent quotations. Compliance-first aviation procurement for enterprise.
              </p>
              <div className="mt-8">
                <Button asChild size="lg" className="bg-white text-black hover:bg-gray-200">
                  <Link href="/login">
                    LOGIN TO ACCESS PLATFORM
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 md:py-24 bg-background">
            <div className="container">
                <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                   <FeatureStep 
                     num="1"
                     title="CREATE CHARTER REQUEST"
                     description="Submit detailed flight requirements including route, passenger count, and aircraft preference (Turbo-prop / Jet)."
                   />
                   <FeatureStep 
                     num="2"
                     title="RECEIVE OPERATOR BIDS"
                     description="Verified NSOP holders submit formal quotations with aircraft specifications and block-hour costs."
                   />
                   <FeatureStep 
                     num="3"
                     title="COMPLIANCE & SELECTION"
                     description="Select operator based on fleet verification and price. Digital audit trail for all operations."
                   />
                </div>
            </div>
        </section>
      </main>
      <footer className="border-t border-border/20 py-8">
        <div className="container grid grid-cols-1 md:grid-cols-2 gap-8 text-sm text-muted-foreground">
            <div>
                <p>&copy; {new Date().getFullYear()} AERONEX Aviation Infrastructure. All rights reserved.</p>
            </div>
            <div className="text-xs md:text-right">
                <p className="font-bold uppercase">Disclaimer</p>
                <p>
                    This platform facilitates non-scheduled charter operations (NSOP) only. It is not an Online Travel Agency (OTA) or a scheduled commercial airline booking system. All flights are subject to operator compliance and DGCA regulations.
                </p>
            </div>
        </div>
      </footer>
    </div>
  );
}
