'use client';

import { Button } from '@/components/ui/button';
import { Logo } from '@/components/logo';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, ShieldCheck, Menu, FileText, GanttChartSquare, Briefcase, Plane, Hotel, Wand2, Phone } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';


const LandingHeader = () => {
    const navLinks = [
        { href: "#", label: "Promotions" },
        { href: "#", label: "Our Network" },
        { href: "#", label: "Blog" },
        { href: "#", label: "Media" },
    ];
    return (
        <header className="sticky top-0 z-40 w-full border-b border-border/20 bg-background/90 backdrop-blur-sm">
            <div className="container flex h-20 items-center justify-between">
                <div className="flex items-center gap-6">
                    <Link href="/">
                        <Logo />
                    </Link>
                </div>
                
                <nav className="hidden items-center gap-6 text-sm md:flex">
                    {navLinks.map(link => (
                        <Link key={link.label} href={link.href} className="text-muted-foreground transition-colors hover:text-foreground">
                            {link.label}
                        </Link>
                    ))}
                </nav>
                
                <div className="flex items-center gap-4">
                    <div className="hidden items-center gap-4 md:flex">
                        <a href="tel:+919819754038" className="flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
                            <Phone className="h-4 w-4" />
                            +91 98197 54038
                        </a>
                        <Button variant="ghost" asChild>
                            <Link href="/login">Login</Link>
                        </Button>
                        <Button asChild>
                            <Link href="/register">Register</Link>
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
                                <div className="flex flex-col gap-6 p-6">
                                    <Logo />
                                    <nav className="flex flex-col gap-4">
                                        {navLinks.map(link => (
                                            <Link key={link.label} href={link.href} className="text-muted-foreground transition-colors hover:text-foreground py-2 text-lg">
                                                {link.label}
                                            </Link>
                                        ))}
                                    </nav>
                                    <div className="flex flex-col gap-2 border-t pt-4">
                                        <a href="tel:+919819754038" className="flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground py-2">
                                            <Phone className="h-4 w-4" />
                                            +91 98197 54038
                                        </a>
                                    <Button asChild>
                                        <Link href="/login">Login</Link>
                                    </Button>
                                    <Button variant="outline" asChild>
                                        <Link href="/register">Register</Link>
                                    </Button>
                                    </div>
                                </div>
                            </SheetContent>
                        </Sheet>
                    </div>
                </div>
            </div>
      </header>
    );
};

const features = [
    {
        icon: FileText,
        title: "Charter RFQ Management",
        description: "Customers can create and manage charter RFQs, including specifying flight requirements and viewing the RFQ lifecycle."
    },
    {
        icon: GanttChartSquare,
        title: "Operator Quotation Exchange",
        description: "Operators can submit bids on RFQs, manage their aircraft fleet, and set aircraft blackout dates."
    },
    {
        icon: Briefcase,
        title: "Corporate Travel Desk (CTD) Approval System",
        description: "CTD users can create RFQs on behalf of employees, manage approval workflows, and generate analytics reports."
    },
    {
        icon: Plane,
        title: "Empty-Leg Seat Allocation",
        description: "Authorized distributors can view approved empty-leg flights and manage seat allocation requests within enforced distributor seat caps."
    },
    {
        icon: Hotel,
        title: "Hotel Accommodation Facilitation",
        description: "Hotel partners can manage properties, define availability and rates, and receive accommodation requests linked to approved trips."
    },
    {
        icon: Wand2,
        title: "Automated Compliance Check Tool",
        description: "AI tool will verify inputs across different phases against compliance policies and standards for NSOP in India, flagging inconsistencies for review."
    }
];


export default function Home() {
  const heroImage = {
    imageUrl: "https://images.unsplash.com/photo-1715882632868-4ec5ab721e7d?q=80&w=2560&auto=format&fit=crop",
    description: "Luxurious interior of a private jet cabin",
    imageHint: "jet cabin interior"
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
                Request a Chartered Flight with AeroDesk
              </h1>
              <p className="mt-6 max-w-xl text-lg text-foreground/80 md:text-xl">
                Verified NSOP operators. Transparent quotations. Compliance-first aviation procurement for enterprise.
              </p>
              <div className="mt-8">
                <Button asChild size="lg">
                  <Link href="/register">
                    Get Started
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        <section className="relative py-16 md:py-24">
            <Image
                src="https://images.unsplash.com/photo-1616142386326-311ee7ea3888?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwzfHxqZXQlMjBpbnRlcmlvcnxlbnwwfHx8fDE3NzE2NDk2MTV8MA&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Private jet cabin background"
                fill
                className="object-cover"
                data-ai-hint="jet interior"
            />
            <div className="absolute inset-0 bg-black/60" />
            <div className="container relative">
                <div className="text-center max-w-3xl mx-auto">
                    <h2 className="text-3xl font-bold font-headline tracking-tight sm:text-4xl">A Comprehensive Aviation Ecosystem</h2>
                    <p className="mt-4 text-lg text-muted-foreground">
                        AeroDesk integrates every facet of the charter lifecycle into a single, compliant, and efficient digital platform.
                    </p>
                </div>

                <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {features.map((feature, index) => (
                        <Card key={index} className="bg-card/80 border-border/50 backdrop-blur-lg">
                            <CardHeader className="flex flex-row items-center gap-4">
                                <div className="bg-primary/10 p-3 rounded-full border border-primary/20">
                                    <feature.icon className="h-6 w-6 text-primary" />
                                </div>
                                <CardTitle className="text-lg">{feature.title}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground">{feature.description}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </section>

      </main>
      <footer className="border-t border-border/20 py-8">
        <div className="container grid grid-cols-1 md:grid-cols-2 gap-8 text-sm text-muted-foreground">
            <div>
                <p>&copy; {new Date().getFullYear()} AeroDesk Aviation Infrastructure. All rights reserved.</p>
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
