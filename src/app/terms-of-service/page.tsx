'use client';

import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LandingFooter } from '@/components/landing-footer';
import { LandingHeader } from '@/components/landing-header';

export default function TermsOfServicePage() {
  const lastUpdated = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="w-full relative min-h-screen bg-[#0B1220]">
      {/* Background Layer: Homepage Sync with Frosted Effect */}
      <div className="fixed inset-0 z-0">
        <Image
          src="https://images.unsplash.com/photo-1506929562872-bb421503ef21?auto=format&fit=crop&q=80&w=2070"
          alt="Aviation Background"
          fill
          priority
          className="object-cover"
          data-ai-hint="airplane beach"
        />
        <div className="absolute inset-0 bg-[#0B1220]/40 backdrop-blur-md" />
        <div className="absolute inset-0 bg-aviation-radial opacity-20" />
      </div>

      <div className="relative z-10 flex min-h-screen flex-col bg-transparent">
        <LandingHeader />
        <main className="flex-1 py-12 md:py-16">
          <div className="container max-w-4xl">
            <Card className="border-white/10 bg-black/30 backdrop-blur-xl text-white rounded-3xl overflow-hidden shadow-2xl">
              <CardHeader className="p-8 pb-4 border-b border-white/5">
                <CardTitle className="text-3xl md:text-4xl font-headline font-bold">
                  TERMS OF SERVICE
                </CardTitle>
                <p className="text-xs text-white/40 uppercase tracking-widest font-black mt-2">
                  Institutional Coordination Protocol • Last Updated: {lastUpdated}
                </p>
              </CardHeader>
              <CardContent className="p-8 prose prose-sm prose-invert max-w-none text-white/70 leading-relaxed">
                <p>
                  Welcome to AeroDesk. These Terms of Service (“Terms”) govern your
                  access to and use of the AeroDesk platform, including all
                  associated web applications, dashboards, and services
                  (collectively, the “Platform”).
                </p>
                <p>
                  By accessing or using AeroDesk, you agree to be bound by these
                  Terms.
                </p>

                <h2 className="text-xl font-semibold text-white mt-8 mb-4">
                  1. PLATFORM NATURE & ROLE
                </h2>
                <p>
                  AeroDesk is a digital coordination and governance platform
                  designed to facilitate structured workflows for non-scheduled
                  charter aviation operations and related ancillary services.
                </p>
                <p>AeroDesk:</p>
                <ul>
                  <li>Does not operate aircraft</li>
                  <li>Does not act as an airline</li>
                  <li>Does not issue tickets</li>
                  <li>Does not function as a travel agent or OTA</li>
                  <li>Does not sell aviation or accommodation services</li>
                </ul>
                <p>
                  All aviation services are provided by licensed third-party
                  operators, and all accommodation services are provided by
                  independent hotel partners.
                </p>

                <h2 className="text-xl font-semibold text-white mt-8 mb-4">
                  2. ELIGIBILITY & ACCOUNT REGISTRATION
                </h2>
                <p>Users must:</p>
                <ul>
                  <li>Be legally capable of entering contracts</li>
                  <li>Provide accurate registration information</li>
                  <li>Maintain confidentiality of login credentials</li>
                </ul>
                <p>
                  Corporate Travel Desk accounts and Hotel Partner accounts may
                  require verification and administrative approval.
                </p>
                <p>
                  AeroDesk reserves the right to approve, suspend, or reject
                  accounts.
                </p>

                <h2 className="text-xl font-semibold text-white mt-8 mb-4">
                  3. USER ROLES & RESPONSIBILITIES
                </h2>
                <h3 className="font-semibold text-white/90 mt-4">
                  Customers / Corporate Users
                </h3>
                <ul>
                  <li>Submit Charter Requests (RFQs)</li>
                  <li>Review operator quotations</li>
                  <li>Initiate ancillary service requests</li>
                </ul>
                <h3 className="font-semibold text-white/90 mt-4">Operators</h3>
                <ul>
                  <li>
                    Must hold valid regulatory approvals (NSOP or equivalent)
                  </li>
                  <li>
                    Responsible for accuracy of aircraft, availability, and
                    quotations
                  </li>
                  <li>Solely responsible for flight execution</li>
                </ul>
                <h3 className="font-semibold text-white/90 mt-4">
                  Authorized Distributors
                </h3>
                <ul>
                  <li>May access approved empty-leg inventory</li>
                  <li>
                    Responsible for passenger data accuracy and compliance
                  </li>
                </ul>
                <h3 className="font-semibold text-white/90 mt-4">
                  Corporate Travel Desks (CTD)
                </h3>
                <ul>
                  <li>Govern internal approval workflows</li>
                  <li>Ensure organizational policy compliance</li>
                </ul>
                <h3 className="font-semibold text-white/90 mt-4">Hotel Partners</h3>
                <ul>
                  <li>Provide accommodation confirmations</li>
                  <li>Responsible for fulfillment of lodging services</li>
                </ul>

                <h2 className="text-xl font-semibold text-white mt-8 mb-4">
                  4. SERVICE FACILITATION ONLY
                </h2>
                <p>AeroDesk facilitates coordination workflows only.</p>
                <ul>
                  <li>
                    No contract for carriage, lodging, or transport is created
                    with AeroDesk.
                  </li>
                  <li>
                    All commercial, operational, and legal obligations exist solely
                    between users and service providers.
                  </li>
                </ul>

                <h2 className="text-xl font-semibold text-white mt-8 mb-4">
                  5. PAYMENTS & COMMERCIAL TERMS
                </h2>
                <ul>
                  <li>AeroDesk does not process payments</li>
                  <li>All settlements occur offline and directly</li>
                  <li>
                    AeroDesk is not liable for disputes related to pricing or
                    settlement
                  </li>
                </ul>

                <h2 className="text-xl font-semibold text-white mt-8 mb-4">
                  6. COMPLIANCE & REGULATORY RESPONSIBILITIES
                </h2>
                <p>Users agree to comply with:</p>
                <ul>
                  <li>Applicable aviation regulations</li>
                  <li>Data protection laws</li>
                  <li>Corporate and governmental policies</li>
                </ul>
                <p>
                  Operators remain solely responsible for regulatory compliance.
                </p>

                <h2 className="text-xl font-semibold text-white mt-8 mb-4">
                  7. DATA ACCURACY & LIABILITY
                </h2>
                <p>Users must provide accurate information.</p>
                <p>AeroDesk is not responsible for:</p>
                <ul>
                  <li>Operator performance</li>
                  <li>Flight delays or cancellations</li>
                  <li>Hotel fulfillment issues</li>
                  <li>Business losses</li>
                </ul>
                <p>The Platform is provided “as-is”.</p>

                <h2 className="text-xl font-semibold text-white mt-8 mb-4">
                  8. PLATFORM AVAILABILITY
                </h2>
                <p>AeroDesk may:</p>
                <ul>
                  <li>Modify features</li>
                  <li>Suspend services</li>
                  <li>Perform maintenance</li>
                </ul>
                <p>No uptime guarantees are provided for pilot environments.</p>

                <h2 className="text-xl font-semibold text-white mt-8 mb-4">
                  9. INTELLECTUAL PROPERTY
                </h2>
                <p>
                  All platform content, design, and workflows remain property of
                  AeroDesk.
                </p>
                <p>
                  Users may not copy, resell, reverse-engineer, or misuse the
                  Platform.
                </p>

                <h2 className="text-xl font-semibold text-white mt-8 mb-4">
                  10. ACCOUNT SUSPENSION / TERMINATION
                </h2>
                <p>
                  AeroDesk may suspend or terminate accounts for:
                </p>
                <ul>
                  <li>Regulatory risk</li>
                  <li>Misuse</li>
                  <li>False information</li>
                  <li>Security concerns</li>
                </ul>

                <h2 className="text-xl font-semibold text-white mt-8 mb-4">
                  11. LIMITATION OF LIABILITY
                </h2>
                <p>To the maximum extent permitted by law:</p>
                <ul>
                  <li>AeroDesk shall not be liable for:</li>
                  <ul>
                    <li>Indirect losses</li>
                    <li>Service provider failures</li>
                    <li>Operational disruptions</li>
                    <li>Third-party disputes</li>
                  </ul>
                </ul>

                <h2 className="text-xl font-semibold text-white mt-8 mb-4">
                  12. GOVERNING LAW
                </h2>
                <p>
                  These Terms shall be governed by the laws of India.
                </p>

                <h2 className="text-xl font-semibold text-white mt-8 mb-4">13. CONTACT</h2>
                <p>For legal inquiries:</p>
                <p className="font-code text-accent">
                  legal@aerodesk.com
                </p>
              </CardContent>
            </Card>
          </div>
        </main>
        <LandingFooter />
      </div>
    </div>
  );
}
