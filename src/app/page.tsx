
'use client';

import {
  useState,
  useEffect,
  type FC,
  useRef,
} from 'react';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/logo';
import Link from 'next/link';
import {
  ShieldCheck,
  Menu,
  FileText,
  GanttChartSquare,
  Briefcase,
  Hotel,
  Wand2,
  Phone,
  Mail,
  Wallet,
  Banknote,
  Shield,
  CheckCircle,
  Armchair,
  Plane,
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
import { useIsMobile } from '@/hooks/use-mobile';


const LandingHeader: FC = () => {
  const lastScrollY = useRef(0);
  const [isVisible, setIsVisible] = useState(true);
  const isMobile = useIsMobile();

  useEffect(() => {
    const handleScroll = () => {
      if (!isMobile) {
        setIsVisible(true);
        return;
      }
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY.current && currentScrollY > 80) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
        window.removeEventListener('scroll', handleScroll);
    };
  }, [isMobile]);

  const navLinks = [
    { href: '/promotions', label: 'Promotions' },
    { href: '#', label: 'Our Network' },
    { href: '#', label: 'Blog' },
    { href: '#', label: 'Media' },
  ];

  return (
    <header
      className={cn(
        'sticky top-0 z-50 w-full text-white transition-transform duration-300 bg-black/30 backdrop-blur-md',
        !isVisible && isMobile && '-translate-y-full'
      )}
    >
      <div className="container flex h-20 items-center">
        <div className="flex flex-1 items-center justify-start gap-6">
          <Link href="/">
            <Logo />
          </Link>
        </div>

        <nav className="hidden items-center gap-6 text-sm md:flex flex-1 justify-center">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="font-semibold text-white transition-colors hover:text-white/80"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex flex-1 items-center justify-end gap-4">
          <div className="hidden items-center gap-4 md:flex">
            <a
              href="tel:+919819754038"
              className="flex items-center gap-2 text-sm font-semibold text-white transition-colors hover:text-white/80"
            >
              <Phone className="h-4 w-4" />
              +91 9819754038
            </a>
            <Button
              variant="ghost"
              asChild
              className="font-semibold text-white hover:bg-white/10 hover:text-white"
            >
              <Link href="/login">Login</Link>
            </Button>
            <Button asChild style={{ backgroundColor: '#EEDC5B', color: 'black' }}>
              <Link href="/register">Register</Link>
            </Button>
          </div>

          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white hover:bg-white/10 hover:text-white"
                >
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent
                side="right"
                className="w-[280px] border-l-0 bg-transparent p-0 text-white"
              >
                <SheetTitle className="sr-only">Mobile Menu</SheetTitle>
                 <div className="flex flex-col">
                   <div className="flex h-16 shrink-0 items-center border-b border-white/10 bg-black/30 px-3 backdrop-blur-md">
                    <Link href="/" className="-ml-1">
                        <Logo />
                    </Link>
                  </div>
                  <nav className="bg-transparent p-6 backdrop-blur-none">
                    {navLinks.map((link) => (
                      <Link
                        key={link.label}
                        href={link.href}
                        className="block py-2 text-sm text-white/80 transition-colors hover:text-white"
                      >
                        {link.label}
                      </Link>
                    ))}
                  </nav>
                  <div className="flex flex-col gap-2 border-t border-white/10 bg-black/30 p-2 backdrop-blur-md">
                    <a
                      href="tel:+919819754038"
                      className="flex items-center gap-2 text-sm font-medium text-white/80 transition-colors hover:text-white"
                    >
                      <Phone className="h-4 w-4" />
                      +91 9819754038
                    </a>
                    <div className="grid grid-cols-2 gap-2">
                      <Button asChild style={{ backgroundColor: '#EEDC5B', color: 'black' }}>
                        <Link href="/login">Login</Link>
                      </Button>
                      <Button
                        variant="ghost"
                        asChild
                        className="font-semibold text-white hover:bg-white/10"
                      >
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
    icon: Armchair,
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

const HelicopterIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path d="M12,4.5c-4.43,0-8,0.7-8,1.5S7.57,7.5,12,7.5s8-0.7,8-1.5S16.43,4.5,12,4.5z M19.74,10.68 c-0.29-0.29-0.76-0.29-1.06,0l-1.53,1.53c-0.12,0.12-0.18,0.27-0.18,0.43v1.86l-4.17-2.39v-0.01c0-0.45-0.28-0.85-0.7-1.02 c-1.08-0.43-3.6-1.02-4.52-1.16C7.03,9.88,6.5,10.3,6.5,10.9v0.01c0,0.14,0.04,0.28,0.1,0.4l1.19,2.06l-4.38,2.1 C3.01,15.65,2.8,16,2.8,16.4v0.01c0,0.47,0.3,0.88,0.75,0.98l1.73,0.38c0.2,0.04,0.4,0.04,0.61,0.01 c0.54-0.09,1-0.4,1.23-0.89l0.01,0c0,0,0,0,0,0l1.2-2.8l5.22,2.99l-0.72,2.15c-0.18,0.52-0.01,1.1,0.4,1.49l0.98,0.98 c0.33,0.33,0.85,0.41,1.26,0.21l3.52-1.76c0.41-0.2,0.68-0.6,0.68-1.06V11.8c0-0.41-0.19-0.79-0.5-1.03L19.74,10.68z"/>
    </svg>
);


export default function Home() {
  return (
    <div className="w-full">
      {/* Background Layer: Fixed to the viewport, sits behind everything else */}
      <div
        className="fixed inset-0 z-0 bg-cover bg-center"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1506929562872-bb421503ef21?q=80&w=2187&auto=format&fit=crop')",
        }}
      >
        <div className="absolute inset-0 bg-black/30" />
      </div>

      {/* Content Layer: Sits on top of the background and handles scrolling */}
      <div className="relative z-10 flex min-h-screen flex-col overflow-x-hidden bg-transparent">
        <LandingHeader />

        <main className="flex-grow">
          <section className="relative w-full text-white">
            <div className="relative">
              <div className="container space-y-6 px-4 pb-4 pt-16 text-center sm:px-6 md:px-8">
                <div className="inline-flex items-center gap-3 rounded-full border border-white/20 bg-black/10 px-6 py-3 text-lg font-medium backdrop-blur-md">
                  <ShieldCheck className="h-6 w-6 text-accent" />
                  Fly Charter. Stay Premium.
                </div>
                <h1 className="text-center font-headline text-4xl font-bold tracking-tight text-white sm:text-5xl [text-shadow:0_1px_4px_rgba(0,0,0,0.1)]">
                  Where <span style={{ color: '#EEDC5B' }}>Exclusive Journey</span>{' '}
                  Begins
                </h1>
              </div>

              <div className="relative z-10 py-6">
                <div className="container">
                  <BookingWidget />
                </div>
              </div>

              <div className="container p-4 pt-2 sm:p-6 md:p-8">
                <div className="mx-auto max-w-3xl text-center">
                  <h2 className="font-headline text-3xl font-bold tracking-tight text-white sm:text-4xl">
                    A Comprehensive Aviation Ecosystem
                  </h2>
                  <p className="mt-4 text-lg text-white/80">
                    All your charter needs, coordinated through one intelligent
                    platform.
                  </p>
                </div>

                <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                  {features.map((feature, index) => (
                    <div
                      key={index}
                      className="flex flex-col items-center rounded-xl border-white/10 bg-black/15 p-6 text-center backdrop-blur-md"
                    >
                      <feature.icon className="h-10 w-10 text-yellow-300" />
                      <h3 className="mt-4 text-lg font-bold text-white">
                        {feature.title}
                      </h3>
                      <p className="mt-2 text-white/80">
                        {feature.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <section className="bg-transparent pt-2 pb-6 sm:pb-8">
            <div className="container p-4 sm:p-6 md:p-8">
              <div className="mx-auto mb-12 max-w-3xl text-center">
                <h2 className="font-headline text-3xl font-bold tracking-tight text-white sm:text-4xl">
                  Transparent Payment Coordination
                </h2>
                <p className="mt-4 text-lg text-white/80">
                  AeroDesk streamlines the payment process without handling funds,
                  ensuring compliance and transparency for all parties.
                </p>
              </div>

              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                <Card className="flex flex-col border-white/10 bg-black/15 backdrop-blur-md">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3 text-white">
                      <Wallet className="h-6 w-6 text-accent" />
                      Payment Coordination
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex-grow space-y-3 text-white/80">
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

                <Card className="flex flex-col border-white/10 bg-black/15 backdrop-blur-md">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3 text-white">
                      <Banknote className="h-6 w-6 text-accent" />
                      Direct Payment Flow
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex-grow space-y-4">
                    <div>
                      <h4 className="font-semibold text-white">
                        Air Charter Payment
                      </h4>
                      <p className="text-white/80">
                        Customer / Corporate / Agent → Pays Operator Directly
                        (offline / bank transfer).
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-white">
                        Hotel Accommodation Payment
                      </h4>
                      <p className="text-white/80">
                        Customer / Corporate / Agent → Pays Hotel Directly.
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="flex flex-col border-white/10 bg-black/15 backdrop-blur-md md:col-span-2 lg:col-span-1">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3 text-white">
                      <Shield className="h-6 w-6 text-accent" />
                      Our Role & Revenue Model
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex-grow grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div>
                      <h4 className="mb-2 font-semibold text-white">
                        Compliance First
                      </h4>
                      <ul className="space-y-2 text-sm text-white/80">
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
                      <h4 className="mb-2 font-semibold text-white">
                        How We Earn
                      </h4>
                      <ul className="space-y-2 text-sm text-white/80">
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
        
        <footer className="border-t border-white/10 bg-black/30 text-white/80 backdrop-blur-md py-2">
          <div className="container py-2">
            <div className="grid w-full grid-cols-1 items-start gap-6 md:grid-cols-4 md:text-left">
              <div className="flex flex-col items-start col-span-2 md:col-span-1">
                <Logo />
              </div>

              <div className="flex flex-col items-start gap-3">
                <h3 className="font-semibold uppercase tracking-wider text-white">
                  Get In Touch
                </h3>
                <a
                  href="tel:+919819754038"
                  className="inline-flex items-center gap-2 hover:text-white"
                >
                  <Phone className="h-4 w-4" /> +91 98197 54038
                </a>
                <a
                  href="tel:+912228222202"
                  className="inline-flex items-center gap-2 hover:text-white"
                >
                  <Phone className="h-4 w-4" /> +91 22 2822 2202
                </a>
                <a
                  href="mailto:info@aerodesk.com"
                  className="inline-flex items-center gap-2 hover:text-white"
                >
                  <Mail className="h-4 w-4" /> info@aerodesk.com
                </a>
              </div>
              <div className="flex flex-col items-start gap-3">
                <h3 className="font-semibold uppercase tracking-wider text-white">
                  Legal
                </h3>
                <Link href="/terms-of-service" className="hover:text-white">
                  Terms of Service
                </Link>
                <Link href="/privacy-policy" className="hover:text-white">
                  Privacy Policy
                </Link>
                <Link href="/safety-standards" className="hover:text-white">
                  Safety Standards
                </Link>
              </div>

              <div className="flex flex-col items-start gap-3">
                <h3 className="font-semibold uppercase tracking-wider text-white">
                  Follow Us
                </h3>
                <div className="flex gap-4">
                  <Link
                    href="#"
                    aria-label="Facebook"
                    className="transition-opacity hover:opacity-80"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="#1877F2"
                      className="h-5 w-5"
                    >
                      <path d="M14 13.5h2.5l1-4H14v-2c0-1.03 0-2 2-2h1.5V2.14c-.326-.043-1.557-.14-2.857-.14C11.928 2 10 3.657 10 6.7v2.8H7v4h3V22h4v-8.5z" />
                    </svg>
                  </Link>
                  <Link
                    href="#"
                    aria-label="Twitter"
                    className="transition-opacity hover:opacity-80"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="#1DA1F2"
                      className="h-5 w-5"
                    >
                      <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" />
                    </svg>
                  </Link>
                  <Link
                    href="#"
                    aria-label="LinkedIn"
                    className="transition-opacity hover:opacity-80"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="#0A66C2"
                      className="h-5 w-5"
                    >
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                    </svg>
                  </Link>
                  <Link
                    href="#"
                    aria-label="Instagram"
                    className="transition-opacity hover:opacity-80"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      className="h-5 w-5"
                    >
                      <defs>
                        <radialGradient id="ig-gradient" cx="30%" cy="107%" r="150%">
                          <stop offset="0%" style={{stopColor: '#fdf497', stopOpacity: 1}} />
                          <stop offset="5%" style={{stopColor: '#fdf497', stopOpacity: 1}} />
                          <stop offset="45%" style={{stopColor: '#fd5949', stopOpacity: 1}} />
                          <stop offset="60%" style={{stopColor: '#d6249f', stopOpacity: 1}} />
                          <stop offset="90%" style={{stopColor: '#285AEB', stopOpacity: 1}} />
                        </radialGradient>
                      </defs>
                      <path
                        fill="url(#ig-gradient)"
                        d="M12 0C8.74 0 8.333.015 7.053.072 5.775.129 4.905.333 4.14.63c-.784.305-1.459.717-2.126 1.384S.935 3.356.63 4.14C.333 4.905.129 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.057 1.277.261 2.148.558 2.913.306.784.718 1.459 1.384 2.126.667.666 1.342 1.079 2.126 1.384.766.296 1.636.502 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.057 2.148-.262 2.913-.558.784-.305 1.459-.718 2.126-1.384.666-.667 1.079-1.342 1.384-2.126.296-.765.502-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.057-1.277-.262-2.148-.558-2.913-.306-.784-.718-1.459-1.384-2.126C20.659.935 19.984.523 19.2.217c-.765-.297-1.636-.503-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.056 1.17-.249 1.805-.413 2.227-.217.562-.477.96-.896 1.382-.42.419-.819.679-1.381-.896-.423.164-1.057.36-2.227.413-1.266.057-1.646.07-4.85.07-3.203 0-3.585-.015-4.85-.071-1.17-.055-1.805-.249-2.227-.415-.562-.217-.96-.477-1.382-.896-.419-.42-.679-.819-.896-1.381-.164-.422-.36-1.057-.413-2.227-.057-1.266-.07-1.646-.07-4.85s.015-3.585.071-4.85c.055-1.17.249-1.805.415-2.227.217-.562.477.96.896-1.382.42-.419.819.679 1.381-.896.422-.164 1.057-.36 2.227-.413C8.415 2.175 8.797 2.16 12 2.16zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.88 1.44 1.44 0 000-2.88z"
                      />
                    </svg>
                  </Link>
                  <Link
                    href="#"
                    aria-label="Youtube"
                    className="transition-opacity hover:opacity-80"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="#FF0000"
                      className="h-5 w-5"
                    >
                      <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
                    </svg>
                  </Link>
                </div>
            </div>
            </div>
            <div className="mt-6 border-t border-white/10 pt-6 text-center text-xs text-white/60">
              <p>
                <span className="font-bold text-white/80">Disclaimer:</span>{' '}
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
    </div>
  );
}
