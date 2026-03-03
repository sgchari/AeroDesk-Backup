'use client';

import {
  type FC,
} from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import {
  ShieldCheck,
  FileText,
  GanttChartSquare,
  Briefcase,
  Hotel,
  Wand2,
  Wallet,
  Banknote,
  CheckCircle,
  Armchair,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookingWidget } from '@/components/booking-widget';
import { LandingHeader } from '@/components/landing-header';
import { LandingFooter } from '@/components/landing-footer';

const features = [
  {
    icon: FileText,
    title: 'Charter Request & Journey Tracking',
    description:
      'Seamlessly initiate private flight requests (RFQs) and monitor every operational stage from dispatch to destination arrival.',
  },
  {
    icon: GanttChartSquare,
    title: 'Operator Fleet & Yield Management',
    description:
      'Verified NSOP holders can manage aircraft availability, respond to institutional demand, and optimize yield through seat allocations.',
  },
  {
    icon: Briefcase,
    title: 'Corporate Travel Governance',
    description:
      'Enterprise-grade coordination for travel desks, enabling policy compliance, multi-level approvals, and employee movement tracking.',
  },
  {
    icon: Armchair,
    title: 'Institutional Jet Seat Access',
    description:
      'Discover and request seats on approved empty-leg positioning flights operating across high-density Indian aviation corridors.',
  },
  {
    icon: Hotel,
    title: 'Curated Hotel Stays',
    description:
      'Automatic destination stay coordination with verified hotel partners, synchronized directly with flight arrival schedules.',
  },
  {
    icon: Wand2,
    title: 'Digital Compliance Guard',
    description:
      'Advanced platform logic ensures all workflows adhere to institutional governance and operational transparency standards.',
  },
];

export default function Home() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "AeroDesk",
    "url": "https://aerodesk.aero",
    "logo": "https://aerodesk.aero/logo.png",
    "description": "Digital aviation infrastructure platform for private charters and NSOP operations in India.",
    "serviceType": [
      "Private Jet Charter Coordination",
      "Corporate Travel Governance",
      "Empty Leg Seat Allocation",
      "Institutional Aviation Logistics"
    ],
    "areaServed": "India",
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+91-9819754038",
      "contactType": "customer service",
      "email": "info@aerodesk.com"
    }
  };

  return (
    <div className="w-full relative min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="fixed inset-0 z-0">
        <Image
          src="https://images.unsplash.com/photo-1506929562872-bb421503ef21?auto=format&fit=crop&q=80&w=2070"
          alt="Premium Private Jet Background"
          fill
          priority
          className="object-cover"
          data-ai-hint="private jet"
        />
        <div className="absolute inset-0 bg-black/30" />
      </div>

      <div className="relative z-10 flex min-h-screen flex-col overflow-x-hidden bg-transparent">
        <LandingHeader />

        <main className="flex-grow">
          <section className="relative w-full text-white">
            <div className="relative">
              <div className="container space-y-6 px-4 pb-4 pt-12 md:pt-16 lg:pt-24 text-center">
                <div className="inline-flex items-center gap-2 md:gap-3 rounded-full border border-white/20 bg-black/10 px-4 py-2 md:px-6 md:py-3 text-sm md:text-lg font-medium backdrop-blur-md animate-in fade-in slide-in-from-top-4 duration-1000">
                  <ShieldCheck className="h-4 w-4 md:h-6 md:w-6 text-accent" />
                  Fly Private. Stay Premium.
                </div>
                <h1 className="text-center font-headline text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white [text-shadow:0_1px_4px_rgba(0,0,0,0.1)] leading-tight px-2">
                  Digital Infrastructure for <br className="hidden md:block" />
                  <span className="text-accent">Exclusive Aviation Journeys</span>
                </h1>
                <p className="mx-auto max-w-2xl text-base md:text-xl text-white/80 px-4">
                  Coordinating India’s premier private charter network through institutional digital layers and compliance-first design.
                </p>
              </div>

              <div className="relative z-10 py-6 px-4">
                <div className="container p-0">
                  <BookingWidget />
                </div>
              </div>

              <div className="container p-4 pt-12 sm:p-6 md:p-8">
                <div className="mx-auto max-w-3xl text-center">
                  <h2 className="font-headline text-2xl md:text-4xl font-bold tracking-tight text-white">
                    A Unified Private Aviation Ecosystem
                  </h2>
                  <p className="mt-4 text-base md:text-lg text-white/80">
                    AeroDesk orchestrates the complex interplay between fleet operators, corporate travel desks, and hospitality partners across India.
                  </p>
                </div>

                <div className="mt-12 grid gap-4 md:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                  {features.map((feature, index) => (
                    <div
                      key={index}
                      className="flex flex-col items-center rounded-xl border border-white/10 bg-black/15 p-6 text-center backdrop-blur-md hover:bg-white/5 transition-colors group"
                    >
                      <div className="p-3 bg-accent/10 rounded-full group-hover:scale-110 transition-transform">
                        <feature.icon className="h-6 w-6 md:h-7 md:w-7 text-accent" />
                      </div>
                      <h3 className="mt-4 text-lg font-bold text-white">
                        {feature.title}
                      </h3>
                      <p className="mt-2 text-sm text-white/70 leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <section className="bg-transparent pt-12 pb-16 sm:pb-24 px-4">
            <div className="container p-0">
              <div className="mx-auto mb-16 max-w-3xl text-center">
                <h2 className="font-headline text-2xl md:text-4xl font-bold tracking-tight text-white">
                  Transparent Coordination & Settlements
                </h2>
                <p className="mt-4 text-base md:text-lg text-white/80">
                  We streamline the private aviation lifecycle without handling client funds, ensuring maximum transparency and regulatory compliance.
                </p>
              </div>

              <div className="grid gap-6 md:gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                <Card className="flex flex-col border-white/10 bg-black/15 backdrop-blur-md">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3 text-white">
                      <Wallet className="h-6 w-6 text-accent" />
                      Platform Coordination
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex-grow space-y-3 text-white/80 text-sm">
                    <p className="flex items-start gap-3">
                      <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-green-500" />{' '}
                      <span>Institutional pro-forma invoicing for all services.</span>
                    </p>
                    <p className="flex items-start gap-3">
                      <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-green-500" />{' '}
                      <span>Real-time payment status tracking and verification.</span>
                    </p>
                    <p className="flex items-start gap-3">
                      <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-green-500" />{' '}
                      <span>Structured direct settlement instructions for all parties.</span>
                    </p>
                  </CardContent>
                </Card>

                <Card className="flex flex-col border-white/10 bg-black/15 backdrop-blur-md">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3 text-white">
                      <Banknote className="h-6 w-6 text-accent" />
                      Direct Settlement Flow
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex-grow space-y-6">
                    <div className="flex items-start gap-3">
                      <CheckCircle className="mt-1 h-5 w-5 shrink-0 text-green-500" />
                      <div>
                        <h4 className="font-semibold text-white">
                          Aviation Services
                        </h4>
                        <p className="text-xs text-white/80">
                          Requesters pay licensed NSOP operators directly via bank transfer, preserving commercial integrity.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="mt-1 h-5 w-5 shrink-0 text-green-500" />
                      <div>
                        <h4 className="font-semibold text-white">
                          Hospitality Services
                        </h4>
                        <p className="text-xs text-white/80">
                          Accommodation settlements are handled directly with our verified hotel partners at the property level.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="flex flex-col border-white/10 bg-black/15 backdrop-blur-md md:col-span-2 lg:col-span-1">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3 text-white">
                      <ShieldCheck className="h-6 w-6 text-accent" />
                      Platform Integrity
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex-grow grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div>
                      <h4 className="mb-2 font-semibold text-white">
                        Zero Risk Model
                      </h4>
                      <ul className="space-y-2 text-xs text-white/80">
                        <li className="flex items-start gap-2">
                          <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />{' '}
                          No fund handling.
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />{' '}
                          Zero refund liability.
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />{' '}
                          Full audit transparency.
                        </li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="mb-2 font-semibold text-white">
                        Value Creation
                      </h4>
                      <ul className="space-y-2 text-xs text-white/80">
                        <li className="flex items-start gap-2">
                          <FileText className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />{' '}
                          Tiered Subscriptions.
                        </li>
                        <li className="flex items-start gap-2">
                          <FileText className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />{' '}
                          Marketplace Participation.
                        </li>
                        <li className="flex items-start gap-2">
                          <FileText className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />{' '}
                          Operational Efficiency.
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
