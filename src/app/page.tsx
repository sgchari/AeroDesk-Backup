'use client';

import { Button } from '@/components/ui/button';
import { Logo } from '@/components/logo';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, ShieldCheck, Menu, FileText, GanttChartSquare, Briefcase, Plane, Hotel, Wand2, Phone, Facebook, Twitter, Linkedin, Instagram, Youtube, Mail } from 'lucide-react';
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
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
                
                <nav className="absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 items-center gap-6 text-sm md:flex">
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
                            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                                <SheetTitle className="sr-only">Mobile Menu</SheetTitle>
                                <div className="flex flex-col gap-6 p-6">
                                    <Logo />
                                    <nav className="flex flex-col gap-4">
                                        {navLinks.map(link => (
                                            <Link key={link.label} href={link.href} className="py-2 text-lg text-muted-foreground transition-colors hover:text-foreground">
                                                {link.label}
                                            </Link>
                                        ))}
                                    </nav>
                                    <div className="flex flex-col gap-2 border-t pt-4">
                                        <a href="tel:+919819754038" className="flex items-center gap-2 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
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
        <section className="relative h-[70vh] w-full overflow-hidden md:h-[80vh]">
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
          <div className="relative z-10 flex h-full flex-col items-center justify-center text-center container">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/50 bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
                <ShieldCheck className="h-4 w-4" />
                REGULATED NSOP INFRASTRUCTURE
              </div>
              <h1 className="mt-4 font-headline text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
                Request a Chartered Flight with AeroDesk
              </h1>
              <p className="mt-6 max-w-2xl mx-auto text-lg text-foreground/80 md:text-xl">
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
            <div className="absolute inset-0 bg-black/80" />
            <div className="container relative">
                <div className="mx-auto max-w-3xl text-center">
                    <h2 className="font-headline text-3xl font-bold tracking-tight sm:text-4xl">A Comprehensive Aviation Ecosystem</h2>
                    <p className="mt-4 text-lg text-muted-foreground">
                        AeroDesk integrates every facet of the charter lifecycle into a single, compliant, and efficient digital platform.
                    </p>
                </div>

                <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {features.map((feature, index) => (
                        <Card key={index} className="border-border/50 bg-black/0 backdrop-blur-none">
                            <CardHeader className="flex flex-row items-center gap-4">
                                <div className="rounded-full border border-primary/20 bg-primary/10 p-3">
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
      <footer className="border-t border-border/20 bg-background">
        <div className="container py-8 md:py-12">
          <div className="grid grid-cols-1 gap-8 text-sm sm:grid-cols-2 lg:grid-cols-4">
            
            <div className="space-y-4">
              <div>
                <Logo />
                <p className="mt-4 text-muted-foreground">&copy; {new Date().getFullYear()} AeroDesk Aviation Infrastructure. All rights reserved.</p>
              </div>
            </div>

            
            <div className="flex flex-col items-start sm:items-center">
              <h3 className="mb-4 font-semibold uppercase tracking-wider">Get In Touch</h3>
              <div className="flex flex-col items-start gap-3 text-muted-foreground sm:items-center">
                <a href="tel:+919819754038" className="flex items-center gap-2 hover:text-foreground">
                    <Phone className="h-4 w-4" /> +91 98197 54038
                </a>
                <a href="tel:+912228222202" className="flex items-center gap-2 hover:text-foreground">
                    <Phone className="h-4 w-4" /> +91 22 2822 2202
                </a>
                <a href="mailto:info@aerodesk.com" className="flex items-center gap-2 hover:text-foreground">
                    <Mail className="h-4 w-4" /> info@aerodesk.com
                </a>
              </div>
            </div>

            <div className="flex flex-col items-start sm:items-center lg:items-start">
              <h3 className="mb-4 font-semibold uppercase tracking-wider">Legal</h3>
              <div className="flex flex-col items-start gap-3 text-muted-foreground sm:items-center lg:items-start">
                <Link href="/terms-of-service" className="hover:text-foreground">Terms of Service</Link>
                <Link href="/privacy-policy" className="hover:text-foreground">Privacy Policy</Link>
                <Link href="/safety-standards" className="hover:text-foreground">Safety Standards</Link>
              </div>
            </div>
            
            <div className="sm:text-right">
              <h3 className="mb-4 font-semibold uppercase tracking-wider sm:text-right">Follow Us</h3>
              <div className="flex gap-4 sm:justify-end">
                  <Link href="#" aria-label="Facebook" className="text-[#1877F2] transition-opacity hover:opacity-75"><Facebook className="h-5 w-5" /></Link>
                  <Link href="#" aria-label="Twitter" className="text-[#1DA1F2] transition-opacity hover:opacity-75"><Twitter className="h-5 w-5" /></Link>
                  <Link href="#" aria-label="LinkedIn" className="text-[#0A66C2] transition-opacity hover:opacity-75"><Linkedin className="h-5 w-5" /></Link>
                  <Link href="#" aria-label="Instagram" className="text-[#E4405F] transition-opacity hover:opacity-75"><Instagram className="h-5 w-5" /></Link>
                  <Link href="#" aria-label="Youtube" className="text-[#FF0000] transition-opacity hover:opacity-75"><Youtube className="h-5 w-5" /></Link>
              </div>
            </div>
          </div>
           <div className="mt-8 border-t border-border/20 pt-8 text-center text-xs text-muted-foreground">
                <p>
                    <span className="font-bold text-foreground">Disclaimer:</span> This platform facilitates non-scheduled charter operations (NSOP) only. It is not an Online Travel Agency (OTA) or a scheduled commercial airline booking system. All flights are subject to operator compliance and DGCA regulations.
                </p>
            </div>
        </div>
      </footer>
    </div>
  );
}
