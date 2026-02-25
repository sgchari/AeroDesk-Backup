
'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { EmptyLeg } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { useCollection, useFirestore, useMemoFirebase } from "@/firebase";
import { collection, query, where } from "firebase/firestore";
import { Skeleton } from "@/components/ui/skeleton";
import Link from 'next/link';
import { useRouter } from "next/navigation";
import { Logo } from '@/components/logo';
import {
  Menu,
  Phone,
  Mail,
} from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import React, { useState, useEffect, type FC, useRef } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';


const LandingHeader: FC<{activePage?: string}> = ({activePage}) => {
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
              className={cn("font-semibold text-white transition-colors hover:text-white/80", activePage === link.label && "text-accent")}
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
                 <div>
                  <div className="flex h-20 items-center justify-start border-b border-white/10 bg-black/30 px-3 backdrop-blur-md">
                    <Link href="/" className="-ml-4">
                      <Logo />
                    </Link>
                  </div>
                  <nav className="bg-transparent/20 p-6 backdrop-blur-none">
                    {navLinks.map((link) => (
                      <Link
                        key={link.label}
                        href={link.href}
                        className={cn("py-2 text-sm text-white/80 transition-colors hover:text-white block", activePage === link.label && "text-accent")}
                      >
                        {link.label}
                      </Link>
                    ))}
                  </nav>
                  <div className="shrink-0 border-t border-white/10 bg-black/30 p-2 backdrop-blur-md">
                    <a
                      href="tel:+919819754038"
                      className="flex items-center gap-2 text-sm font-medium text-white/80 transition-colors hover:text-white"
                    >
                      <Phone className="h-4 w-4" />
                      +91 9819754038
                    </a>
                    <div className="mt-2 grid grid-cols-2 gap-2">
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

const LandingFooter: FC = () => {
    return (
        <footer className="border-t border-white/10 bg-black/30 text-white/80 backdrop-blur-md py-1">
          <div className="container py-1">
            <div className="grid w-full grid-cols-1 items-start gap-4 md:grid-cols-4 md:text-left">
              <div className="flex flex-col items-start col-span-2 md:col-span-1">
                <Logo />
              </div>

              <div className="flex flex-col items-start gap-2">
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
              <div className="flex flex-col items-start gap-2">
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

              <div className="flex flex-col items-start gap-2">
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
    )
}

export default function PromotionsPage() {
  const firestore = useFirestore();
  const router = useRouter();

  const emptyLegsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    // For demo mode, we fetch all and filter on the client.
    // In a live app, the where clause would be applied by Firestore.
    return query(collection(firestore, 'emptyLegs'));
  }, [firestore]);
  const { data: allEmptyLegs, isLoading } = useCollection<EmptyLeg>(emptyLegsQuery, 'emptyLegs');

  // Client-side filtering for demo mode
  const emptyLegs = allEmptyLegs?.filter(leg => leg.status === 'Approved');

  const handleRequestSeats = (legId: string) => {
    router.push('/login');
  };

  return (
    <div className="w-full">
        <div
            className="fixed inset-0 z-0 bg-cover bg-center"
            style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1506929562872-bb421503ef21?q=80&w=2187&auto=format&fit=crop')",
            }}
        >
            <div className="absolute inset-0 bg-black/30" />
        </div>
        <div className="relative z-10 flex min-h-screen flex-col bg-transparent">
            <LandingHeader activePage="Promotions" />
            <main className="flex-1 py-12 md:py-16">
                <div className="container">
                    <Card className="border-white/10 bg-black/15 backdrop-blur-md text-white">
                        <CardHeader>
                            <CardTitle className="text-3xl font-headline">
                            Available Empty Leg Flights
                            </CardTitle>
                            <CardDescription className="text-white/80">
                            One-way flights available. Request seats subject to operator confirmation.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {isLoading ? <Skeleton className="h-64 w-full bg-white/10" /> : (
                            <Table>
                                <TableHeader>
                                <TableRow className="hover:bg-white/10">
                                    <TableHead className="text-white/90">Flight ID</TableHead>
                                    <TableHead className="text-white/90">Route</TableHead>
                                    <TableHead className="text-white/90">Departure</TableHead>
                                    <TableHead className="text-white/90">Available Seats</TableHead>
                                    <TableHead className="text-right text-white/90">Action</TableHead>
                                </TableRow>
                                </TableHeader>
                                <TableBody>
                                {emptyLegs?.map((leg: EmptyLeg) => (
                                    <TableRow key={leg.id} className="border-white/10 hover:bg-white/5">
                                        <TableCell className="font-medium font-code">{leg.id}</TableCell>
                                        <TableCell>{leg.departure} to {leg.arrival}</TableCell>
                                        <TableCell>{new Date(leg.departureTime).toLocaleString()}</TableCell>
                                        <TableCell className="font-bold text-center">{leg.availableSeats}</TableCell>
                                        <TableCell className="text-right">
                                            <Button size="sm" onClick={() => handleRequestSeats(leg.id)}>Request Seat Allocation</Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                </TableBody>
                            </Table>
                            )}
                            {(!isLoading && (!emptyLegs || emptyLegs.length === 0)) && (
                                <div className="text-center py-12 border-2 border-dashed border-white/20 rounded-lg">
                                    <p className="text-white/70">There are currently no empty leg promotions available.</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </main>
            <LandingFooter />
        </div>
    </div>
  );
}
