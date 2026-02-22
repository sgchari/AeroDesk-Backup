'use client';

import { Button } from '@/components/ui/button';
import { Logo } from '@/components/logo';
import Link from 'next/link';
import {
  ShieldCheck,
  Menu,
  FileText,
  GanttChartSquare,
  Briefcase,
  Plane,
  Hotel,
  Wand2,
  Phone,
  Mail,
  Wallet,
  Banknote,
  Shield,
  CheckCircle,
} from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookingWidget } from '@/components/booking-widget';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const LandingHeader = () => {
  const navLinks = [
    { href: '#', label: 'Promotions' },
    { href: '#', label: 'Our Network' },
    { href: '#', label: 'Blog' },
    { href: '#', label: 'Media' },
  ];
  return (
    <header className="sticky top-0 z-50 w-full border-b border-primary/20 bg-primary backdrop-blur-sm">
      <div className="container flex h-20 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/">
            <Logo className="[&_svg]:text-primary-foreground/80 [&_.text-foreground]:text-primary-foreground [&_.text-primary]:text-accent" />
          </Link>
        </div>

        <nav className="absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 items-center gap-6 text-sm text-primary-foreground md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="transition-colors hover:text-primary-foreground/80"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <div className="hidden items-center gap-4 md:flex">
            <a
              href="tel:+919819754038"
              className="flex items-center gap-2 text-sm font-medium text-primary-foreground transition-colors hover:text-primary-foreground/80"
            >
              <Phone className="h-4 w-4" />
              +91 9819754038
            </a>
            <Button variant="ghost" asChild className="text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground">
              <Link href="/login">Login</Link>
            </Button>
            <Button asChild variant="accent">
              <Link href="/register">Register</Link>
            </Button>
          </div>

          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground">
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
                    {navLinks.map((link) => (
                      <Link
                        key={link.label}
                        href={link.href}
                        className="py-2 text-lg text-muted-foreground transition-colors hover:text-foreground"
                      >
                        {link.label}
                      </Link>
                    ))}
                  </nav>
                  <div className="mt-auto flex flex-col gap-4 border-t pt-4">
                    <a
                      href="tel:+919819754038"
                      className="flex items-center gap-2 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                    >
                      <Phone className="h-4 w-4" />
                      +91 9819754038
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
    title: 'Flight Request & Lifecycle Tracking',
    description:
      'Create charter requests, specify flight and accommodation needs, and maintain visibility across the full request lifecycle.',
  },
  {
    icon: GanttChartSquare,
    title: 'Operator Quotation & Fleet Management',
    description:
      'Operators can respond to charter requests with structured quotations, manage fleet availability, coordinate crew stays and logistics, and create or manage empty-leg opportunities.',
  },
  {
    icon: Briefcase,
    title: 'Corporate Travel Desk',
    description:
      'Corporate Travel Desk users can create charter requests for employees, request jet seat allocations, and coordinate associated accommodation needs.',
  },
  {
    icon: Plane,
    title: 'Available Jet Seat Allocation',
    description:
      'Access seats on select private jet flights operating on predefined routes',
  },
  {
    icon: Hotel,
    title: 'Hotel Partner Accommodation',
    description:
      'Hotels maintain inventory visibility, configure stay availability, and handle accommodation requests tied to approved charter activity.',
  },
  {
    icon: Wand2,
    title: 'AI-Assisted Compliance Review',
    description:
      'AI-assisted logic evaluates workflow inputs and highlights potential inconsistencies for administrative or operator review.',
  },
];

export default function Home() {
  const landingHero = PlaceHolderImages.find((p) => p.id === 'landing-hero')!;
  const landingFeatures = PlaceHolderImages.find((p) => p.id === 'landing-features')!;

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <LandingHeader />
      <main>
        <section className="relative w-full bg-primary text-primary-foreground">
          <Image
            src={landingHero.imageUrl}
            alt={landingHero.description}
            fill
            className="object-cover"
            data-ai-hint={landingHero.imageHint}
            priority
          />
          <div className="absolute inset-0 bg-black/60" />
          <div className="relative">

            {/* Hero Text */}
            <div className="container p-4 text-center sm:p-6 md:p-8 pt-12 pb-8">
              <div className="inline-flex items-center gap-3 rounded-full border border-primary-foreground/30 bg-primary-foreground/10 px-6 py-3 text-lg font-medium backdrop-blur-sm">
                <ShieldCheck className="h-6 w-6" />
                Fly Smarter. Stay Premium.
              </div>
              <h1 className="mt-4 text-center font-headline text-4xl font-bold tracking-tight text-white sm:text-5xl [text-shadow:0_1px_4px_rgba(0,0,0,0.1)]">
                Where <span className="text-accent">Exceptional Journey</span> Begins
              </h1>
            </div>
            
            {/* Booking Widget */}
            <div className="relative z-10">
                <div className="container">
                    <BookingWidget />
                </div>
            </div>

            {/* Features Section */}
            <div className="container p-4 sm:p-6 md:p-8 py-16 sm:py-24">
              <div className="mx-auto max-w-3xl text-center">
                <h2 className="font-headline text-3xl font-bold tracking-tight text-primary-foreground sm:text-4xl">
                  A Comprehensive Aviation Ecosystem
                </h2>
                <p className="mt-4 text-lg text-primary-foreground/80">
                  All your charter needs, coordinated through one intelligent
                  platform.
                </p>
              </div>

              <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {features.map((feature, index) => (
                  <div
                    key={index}
                    className="flex flex-col items-center text-center p-6 rounded-xl bg-blue-950/30 backdrop-blur-lg shadow-lg"
                  >
                      <div className="rounded-full border-4 border-accent/50 bg-accent/20 p-4">
                        <feature.icon className="h-8 w-8 text-accent" />
                      </div>
                      <h3 className="mt-4 text-lg font-bold text-primary-foreground">{feature.title}</h3>
                      <p className="mt-2 text-primary-foreground/80">{feature.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="bg-background py-16 sm:py-24">
          <div className="container p-4 sm:p-6 md:p-8">
            <div className="mx-auto mb-12 max-w-3xl text-center">
              <h2 className="font-headline text-3xl font-bold tracking-tight sm:text-4xl">
                Transparent Payment Coordination
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                AeroDesk streamlines the payment process without handling funds,
                ensuring compliance and transparency for all parties.
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              <Card className="flex flex-col">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <div className="rounded-full border border-primary/20 bg-primary/10 p-3">
                      <Wallet className="h-6 w-6 text-primary" />
                    </div>
                    Payment Coordination
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex-grow space-y-3">
                  <p className="flex items-start gap-3">
                    <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-green-500" />{' '}
                    <span>Generate invoices for services.</span>
                  </p>
                  <p className="flex items-start gap-3">
                    <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-green-500" />{' '}
                    <span>Track payment status (Mark as Paid/Pending).</span>
                  </p>
                  <p className="flex items-start gap-3">
                    <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-green-500" />{' '}
                    <span>
                      Provide clear payment instructions to all parties.
                    </span>
                  </p>
                </CardContent>
              </Card>

              <Card className="flex flex-col">
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
                    <h4 className="font-semibold text-foreground">
                      Air Charter Payment
                    </h4>
                    <p className="text-muted-foreground">
                      Customer / Corporate / Agent → Pays Operator Directly
                      (offline / bank transfer).
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">
                      Hotel Accommodation Payment
                    </h4>
                    <p className="text-muted-foreground">
                      Customer / Corporate / Agent → Pays Hotel Directly.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="flex flex-col md:col-span-2 lg:col-span-1">
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
                    <h4 className="font-semibold text-foreground mb-2">
                      Compliance First
                    </h4>
                    <ul className="space-y-2 text-muted-foreground text-sm">
                      <li className="flex items-start gap-2">
                        <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-primary/80" />{' '}
                        AeroDesk never touches funds.
                      </li>
                      <li className="flex items-start gap-2">
                        <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-primary/80" />{' '}
                        Zero refund liability.
                      </li>
                      <li className="flex items-start gap-2">
                        <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-primary/80" />{' '}
                        No financial regulatory risk.
                      </li>
                      <li className="flex items-start gap-2">
                        <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-primary/80" />{' '}
                        No OTA classification trigger.
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">
                      How We Earn
                    </h4>
                    <ul className="space-y-2 text-muted-foreground text-sm">
                      <li className="flex items-start gap-2">
                        <FileText className="mt-0.5 h-4 w-4 shrink-0 text-primary/80" />{' '}
                        Subscription fees.
                      </li>
                      <li className="flex items-start gap-2">
                        <FileText className="mt-0.5 h-4 w-4 shrink-0 text-primary/80" />{' '}
                        Participation fees.
                      </li>
                      <li className="flex items-start gap-2">
                        <FileText className="mt-0.5 h-4 w-4 shrink-0 text-primary/80" />{' '}
                        Coordination / facilitation fees.
                      </li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>
      <footer className="bg-secondary text-foreground">
        <div className="container py-12">
          <div className="grid grid-cols-1 gap-8 text-center sm:grid-cols-2 md:grid-cols-4 md:text-left">
            <div className="flex flex-col items-center gap-4 sm:items-start">
               <Logo />
            </div>
            <div className="flex flex-col items-center gap-3 text-muted-foreground md:items-start">
              <h3 className="font-semibold uppercase tracking-wider text-foreground">
                Get In Touch
              </h3>
              <a
                href="tel:+919819754038"
                className="inline-flex items-center gap-2 hover:text-foreground"
              >
                <Phone className="h-4 w-4" /> +91 98197 54038
              </a>
              <a
                href="tel:+912228222202"
                className="inline-flex items-center gap-2 hover:text-foreground"
              >
                <Phone className="h-4 w-4" /> +91 22 2822 2202
              </a>
              <a
                href="mailto:info@aerodesk.com"
                className="inline-flex items-center gap-2 hover:text-foreground"
              >
                <Mail className="h-4 w-4" /> info@aerodesk.com
              </a>
            </div>
            <div className="flex flex-col items-center gap-3 text-muted-foreground md:items-start">
              <h3 className="font-semibold uppercase tracking-wider text-foreground">
                Legal
              </h3>
              <Link
                href="/terms-of-service"
                className="hover:text-foreground"
              >
                Terms of Service
              </Link>
              <Link href="/privacy-policy" className="hover:text-foreground">
                Privacy Policy
              </Link>
              <Link href="/safety-standards" className="hover:text-foreground">
                Safety Standards
              </Link>
            </div>
            <div className="flex flex-col items-center gap-3 md:items-end">
              <h3 className="font-semibold uppercase tracking-wider text-foreground">
                Follow Us
              </h3>
              <div className="flex gap-4 text-muted-foreground">
                <Link
                  href="#"
                  aria-label="Facebook"
                  className="transition-opacity hover:text-foreground"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="h-5 w-5"
                  >
                    <path d="M14 13.5h2.5l1-4H14v-2c0-1.03 0-2 2-2h1.5V2.14c-.326-.043-1.557-.14-2.857-.14C11.928 2 10 3.657 10 6.7v2.8H7v4h3V22h4v-8.5z" />
                  </svg>
                </Link>
                <Link
                  href="#"
                  aria-label="Twitter"
                  className="transition-opacity hover:text-foreground"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="h-5 w-5"
                  >
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </Link>
                <Link
                  href="#"
                  aria-label="LinkedIn"
                  className="transition-opacity hover:text-foreground"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="h-5 w-5"
                  >
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                  </svg>
                </Link>
                <Link
                  href="#"
                  aria-label="Instagram"
                  className="transition-opacity hover:text-foreground"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="h-5 w-5"
                  >
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.85s-.012 3.584-.07 4.85c-.148 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07s-3.584-.012-4.85-.07c-3.252-.148-4.771-1.691-4.919-4.919-.058-1.265-.069-1.645-.069-4.85s.012-3.584.07-4.85c.148-3.225 1.664-4.771 4.919-4.919 1.266-.058 1.644-.07 4.85-.07zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948s.014 3.667.072 4.947c.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072s3.667-.014 4.947-.072c4.358-.2 6.78-2.618 6.98-6.98.059-1.281.073-1.689.073-4.948s-.014-3.667-.072-4.947c-.2-4.358-2.618-6.78-6.98-6.98-1.281-.058-1.689-.072-4.948-.072zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.162 6.162 6.162 6.162-2.759 6.162-6.162-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4s1.791-4 4-4 4 1.79 4 4-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44 1.441-.645 1.441-1.44-.645-1.44-1.441-1.44z" />
                  </svg>
                </Link>
                <Link
                  href="#"
                  aria-label="Youtube"
                  className="transition-opacity hover:text-foreground"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="h-5 w-5"
                  >
                    <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
          <div className="mt-8 border-t border-border pt-8 text-center text-xs text-muted-foreground">
            <p>
              <span className="font-bold text-foreground">Disclaimer:</span>{' '}
              This platform facilitates non-scheduled charter operations (NSOP)
              only. It is not an Online Travel Agency (OTA) or a scheduled
              commercial airline booking system. All flights are subject to
              operator compliance and DGCA regulations.
            </p>
            <p className="mt-2">
              &copy; {new Date().getFullYear()} AeroDesk Aviation
              Infrastructure. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
