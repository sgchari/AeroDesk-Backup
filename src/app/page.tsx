'use client';

import { Button } from '@/components/ui/button';
import { Logo } from '@/components/logo';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, ShieldCheck, Menu, FileText, GanttChartSquare, Briefcase, Plane, Hotel, Wand2, Phone, Facebook, Twitter, Linkedin, Instagram, Youtube, Mail, Wallet, Banknote, Shield, CheckCircle } from 'lucide-react';
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PlaceHolderImages } from '@/lib/placeholder-images';


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
                            <SheetContent side="right" className="w-full max-w-xs sm:max-w-sm">
                                <SheetTitle className="sr-only">Mobile Menu</SheetTitle>
                                <div className="flex h-full flex-col">
                                    <div className="mb-6 flex items-center justify-between">
                                        <Logo />
                                    </div>
                                    <nav className="flex flex-col gap-4">
                                        {navLinks.map(link => (
                                            <Link key={link.label} href={link.href} className="py-2 text-lg text-muted-foreground transition-colors hover:text-foreground">
                                                {link.label}
                                            </Link>
                                        ))}
                                    </nav>
                                    <div className="mt-auto flex flex-col gap-4 border-t pt-4">
                                        <a href="tel:+919819754038" className="flex items-center gap-2 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
                                            <Phone className="h-4 w-4" />
                                            +91 98197 54038
                                        </a>
                                        <div className="grid grid-cols-2 gap-2">
                                            <Button asChild>
                                                <Link href="/login">Login</Link>
                                            </Button>
                                            <Button variant="outline" asChild>
                                                <Link href="/register">Register</Link>
                                            </Button>
                                        </div>
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
  const heroImage = PlaceHolderImages.find(p => p.id === 'landing-hero');
  const featuresImage = PlaceHolderImages.find(p => p.id === 'landing-features');
  const paymentImage = PlaceHolderImages.find(p => p.id === 'landing-payment');
  
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
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
          <div className="relative z-10 flex h-full flex-col items-center justify-center text-center">
            <div className="container max-w-3xl p-4 text-left sm:p-6 md:p-8">
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/50 bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
                <ShieldCheck className="h-4 w-4" />
                REGULATED NSOP INFRASTRUCTURE
              </div>
              <h1 className="mt-4 font-headline text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
                Request a Chartered Flight with AeroDesk
              </h1>
              <p className="mt-6 max-w-2xl text-lg text-foreground/80 md:text-xl">
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
            {featuresImage && (
                <Image
                    src={featuresImage.imageUrl}
                    alt={featuresImage.description}
                    fill
                    className="object-cover"
                    data-ai-hint={featuresImage.imageHint}
                />
            )}
            <div className="absolute inset-0 bg-background/60" />
            <div className="container relative p-4 sm:p-6 md:p-8">
                <div className="mx-auto max-w-3xl text-center">
                    <h2 className="font-headline text-3xl font-bold tracking-tight sm:text-4xl">A Comprehensive Aviation Ecosystem</h2>
                    <p className="mt-4 text-lg text-muted-foreground">
                        AeroDesk integrates every facet of the charter lifecycle into a single, compliant, and efficient digital platform.
                    </p>
                </div>

                <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {features.map((feature, index) => (
                        <Card key={index} className="border-border/50 bg-background/80 backdrop-blur-sm">
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

        <section className="relative py-16 md:py-24">
            {paymentImage && (
                <Image
                    src={paymentImage.imageUrl}
                    alt={paymentImage.description}
                    fill
                    className="object-cover"
                    data-ai-hint={paymentImage.imageHint}
                />
            )}
            <div className="absolute inset-0 bg-background/60" />
            <div className="container relative p-4 sm:p-6 md:p-8">
                <div className="mx-auto mb-12 max-w-3xl text-center">
                    <h2 className="font-headline text-3xl font-bold tracking-tight sm:text-4xl">Transparent Payment Coordination</h2>
                    <p className="mt-4 text-lg text-muted-foreground">
                        AeroDesk streamlines the payment process without handling funds, ensuring compliance and transparency for all parties.
                    </p>
                </div>

                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                    <Card className="flex flex-col border-border/50 bg-background/80 backdrop-blur-sm">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-3">
                                <div className="rounded-full border border-primary/20 bg-primary/10 p-3">
                                    <Wallet className="h-6 w-6 text-primary" />
                                </div>
                                Payment Coordination
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="flex-grow space-y-3">
                            <p className="flex items-start gap-3"><CheckCircle className="h-5 w-5 mt-0.5 shrink-0 text-green-500" /> <span>Generate professional invoices for charter and ancillary services.</span></p>
                            <p className="flex items-start gap-3"><CheckCircle className="h-5 w-5 mt-0.5 shrink-0 text-green-500" /> <span>Track payment status from pending to paid in one central place.</span></p>
                            <p className="flex items-start gap-3"><CheckCircle className="h-5 w-5 mt-0.5 shrink-0 text-green-500" /> <span>Provide clear payment instructions to all parties involved.</span></p>
                        </CardContent>
                    </Card>

                    <Card className="flex flex-col border-border/50 bg-background/80 backdrop-blur-sm">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-3">
                                 <div className="rounded-full border border-primary/20 bg-primary/10 p-3">
                                    <Banknote className="h-6 w-6 text-primary" />
                                </div>
                                Direct Payment Flow
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="flex-grow space-y-4">
                            <div>
                                <h4 className="font-semibold text-foreground">Air Charter</h4>
                                <p className="text-muted-foreground">The Customer or their designated Agent pays the licensed Aircraft Operator directly via offline methods like bank transfer, ensuring regulatory compliance.</p>
                            </div>
                             <div>
                                <h4 className="font-semibold text-foreground">Hotel Stays</h4>
                                <p className="text-muted-foreground">For accommodation, the Customer or Agent settles the payment directly with the Hotel Partner.</p>
                            </div>
                        </CardContent>
                    </Card>
                    
                    <Card className="flex flex-col border-border/50 bg-background/80 backdrop-blur-sm md:col-span-2 lg:col-span-1">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-3">
                                 <div className="rounded-full border border-primary/20 bg-primary/10 p-3">
                                    <Shield className="h-6 w-6 text-primary" />
                                </div>
                                Our Role & Revenue Model
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="flex-grow grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div>
                                <h4 className="font-semibold text-foreground mb-2">Compliance First</h4>
                                <ul className="space-y-2 text-muted-foreground text-sm">
                                    <li className="flex items-start gap-2"><ShieldCheck className="h-4 w-4 mt-0.5 shrink-0 text-primary/80" /> AeroDesk never touches funds.</li>
                                    <li className="flex items-start gap-2"><ShieldCheck className="h-4 w-4 mt-0.5 shrink-0 text-primary/80" /> Zero refund liability.</li>
                                    <li className="flex items-start gap-2"><ShieldCheck className="h-4 w-4 mt-0.5 shrink-0 text-primary/80" /> Avoids financial regulatory risk.</li>
                                    <li className="flex items-start gap-2"><ShieldCheck className="h-4 w-4 mt-0.5 shrink-0 text-primary/80" /> Prevents OTA classification triggers.</li>
                                </ul>
                            </div>
                             <div>
                                <h4 className="font-semibold text-foreground mb-2">How We Earn</h4>
                                 <ul className="space-y-2 text-muted-foreground text-sm">
                                    <li className="flex items-start gap-2"><FileText className="h-4 w-4 mt-0.5 shrink-0 text-primary/80" /> Subscription fees.</li>
                                    <li className="flex items-start gap-2"><FileText className="h-4 w-4 mt-0.5 shrink-0 text-primary/80" /> Participation fees.</li>
                                    <li className="flex items-start gap-2"><FileText className="h-4 w-4 mt-0.5 shrink-0 text-primary/80" /> Coordination / facilitation fees.</li>
                                </ul>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </section>

      </main>
      <footer className="border-t border-border bg-background">
        <div className="container py-12">
            <div className="grid grid-cols-1 gap-8 text-center sm:grid-cols-2 md:grid-cols-4 md:text-left">
                <div className="flex flex-col items-center gap-4 sm:items-start">
                    <Logo />
                </div>
                <div className="flex flex-col items-center gap-3 text-muted-foreground md:items-start">
                    <h3 className="font-semibold uppercase tracking-wider text-foreground">Get In Touch</h3>
                    <a href="tel:+919819754038" className="inline-flex items-center gap-2 hover:text-foreground">
                        <Phone className="h-4 w-4" /> +91 98197 54038
                    </a>
                    <a href="tel:+912228222202" className="inline-flex items-center gap-2 hover:text-foreground">
                        <Phone className="h-4 w-4" /> +91 22 2822 2202
                    </a>
                    <a href="mailto:info@aerodesk.com" className="inline-flex items-center gap-2 hover:text-foreground">
                        <Mail className="h-4 w-4" /> info@aerodesk.com
                    </a>
                </div>
                <div className="flex flex-col items-center gap-3 text-muted-foreground md:items-start">
                    <h3 className="font-semibold uppercase tracking-wider text-foreground">Legal</h3>
                    <Link href="/terms-of-service" className="hover:text-foreground">Terms of Service</Link>
                    <Link href="/privacy-policy" className="hover:text-foreground">Privacy Policy</Link>
                    <Link href="/safety-standards" className="hover:text-foreground">Safety Standards</Link>
                </div>
                <div className="flex flex-col items-center gap-3 md:items-end">
                    <h3 className="font-semibold uppercase tracking-wider text-foreground">Follow Us</h3>
                    <div className="flex gap-4">
                        <Link href="#" aria-label="Facebook" className="text-[#1877F2] transition-opacity hover:opacity-75"><Facebook className="h-5 w-5" /></Link>
                        <Link href="#" aria-label="Twitter" className="text-[#1DA1F2] transition-opacity hover:opacity-75"><Twitter className="h-5 w-5" /></Link>
                        <Link href="#" aria-label="LinkedIn" className="text-[#0A66C2] transition-opacity hover:opacity-75"><Linkedin className="h-5 w-5" /></Link>
                        <Link href="#" aria-label="Instagram" className="text-[#E4405F] transition-opacity hover:opacity-75"><Instagram className="h-5 w-5" /></Link>
                        <Link href="#" aria-label="Youtube" className="text-[#FF0000] transition-opacity hover:opacity-75"><Youtube className="h-5 w-5" /></Link>
                    </div>
                </div>
            </div>
            <div className="mt-8 border-t border-border pt-8 text-center text-xs text-muted-foreground">
                <p>
                    <span className="font-bold text-foreground">Disclaimer:</span> This platform facilitates non-scheduled charter operations (NSOP) only. It is not an Online Travel Agency (OTA) or a scheduled commercial airline booking system. All flights are subject to operator compliance and DGCA regulations.
                </p>
                <p className="mt-2">&copy; {new Date().getFullYear()} AeroDesk Aviation Infrastructure. All rights reserved.</p>
            </div>
        </div>
      </footer>
    </div>
  );
}
