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
import { LandingHeader } from '@/components/landing-header';
import { LandingFooter } from '@/components/landing-footer';


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
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M2 5h20" />
    <path d="M12 5v3" />
    <path d="M10 8l2-3 2 3" />
    <path d="M12 8c-4 0-5 2-5 5v3c0 3 1 5 5 5s5-2 5-5v-3c0-3-1-5-5-5z" />
    <path d="M12 8v10" />
    <path d="M7 14c2 1 8 1 10 0" />
    <path d="M9 18l-1.5 4" />
    <path d="M15 18l1.5 4" />
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
                  Where <span style={{ color: '#EEDC5B' }}>Exclusive Journeys</span>{' '}
                  Begin
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
                      <ShieldCheck className="h-6 w-6 text-accent" />
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
        
        <LandingFooter />
      </div>
    </div>
  );
}