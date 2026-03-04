'use client';

import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LandingFooter } from '@/components/landing-footer';
import { LandingHeader } from '@/components/landing-header';

export default function PrivacyPolicyPage() {
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
                  PRIVACY POLICY
                </CardTitle>
                <p className="text-xs text-white/40 uppercase tracking-widest font-black mt-2">
                  Institutional Data Governance • Last Updated: {lastUpdated}
                </p>
              </CardHeader>
              <CardContent className="p-8 prose prose-sm prose-invert max-w-none text-white/70 leading-relaxed">
                <p>
                  AeroDesk respects user privacy and handles data in a manner consistent with enterprise governance and regulated aviation environments.
                </p>

                <h2 className="text-xl font-semibold text-white mt-8 mb-4">
                  1. DATA CONTROLLER ROLE
                </h2>
                <p>
                  AeroDesk acts as a platform operator and data facilitator, not as a service provider of aviation or accommodation services.
                </p>

                <h2 className="text-xl font-semibold text-white mt-8 mb-4">
                  2. INFORMATION WE COLLECT
                </h2>
                <p>
                  Depending on user role, AeroDesk may collect:
                </p>
                <h3 className="font-semibold text-white/90 mt-4">Account Information</h3>
                <ul>
                  <li>Name, email, organization details</li>
                  <li>Role classification</li>
                </ul>
                <h3 className="font-semibold text-white/90 mt-4">Operational Data</h3>
                <ul>
                  <li>Charter request details</li>
                  <li>Passenger information (names, counts)</li>
                  <li>Flight preferences</li>
                  <li>Empty-leg requests</li>
                </ul>
                 <h3 className="font-semibold text-white/90 mt-4">Corporate Data</h3>
                <ul>
                  <li>Cost centers</li>
                  <li>Approval workflows</li>
                  <li>Policy notes</li>
                </ul>
                <h3 className="font-semibold text-white/90 mt-4">Hotel & Ancillary Data</h3>
                <ul>
                  <li>Accommodation requests</li>
                  <li>Confirmation references</li>
                </ul>
                <h3 className="font-semibold text-white/90 mt-4">Technical Data</h3>
                <ul>
                  <li>Device, session, usage logs</li>
                </ul>

                <h2 className="text-xl font-semibold text-white mt-8 mb-4">
                  3. PURPOSE OF DATA PROCESSING
                </h2>
                <p>Data is processed strictly for:</p>
                <ul>
                  <li>Workflow coordination</li>
                  <li>Compliance visibility</li>
                  <li>Audit trails</li>
                  <li>Platform functionality</li>
                  <li>Security monitoring</li>
                </ul>
                <p>AeroDesk does not sell personal data.</p>
                
                <h2 className="text-xl font-semibold text-white mt-8 mb-4">
                  4. DATA SHARING PRINCIPLES
                </h2>
                <p>Data may be shared only when operationally required, including with:</p>
                <ul>
                    <li>Licensed operators</li>
                    <li>Authorized distributors</li>
                    <li>Verified hotel partners</li>
                    <li>Corporate administrators</li>
                </ul>
                <p>AeroDesk does not share data for advertising purposes.</p>

                <h2 className="text-xl font-semibold text-white mt-8 mb-4">
                  5. DATA RETENTION
                </h2>
                <p>Data is retained only as long as necessary for:</p>
                <ul>
                  <li>Operational records</li>
                  <li>Audit obligations</li>
                  <li>Legal compliance</li>
                </ul>
                <p>Retention periods may vary by role.</p>

                <h2 className="text-xl font-semibold text-white mt-8 mb-4">
                  6. DATA SECURITY
                </h2>
                <p>AeroDesk employs reasonable safeguards including:</p>
                <ul>
                  <li>Access controls</li>
                  <li>Encryption</li>
                  <li>Role-based visibility</li>
                  <li>Logging and monitoring</li>
                </ul>
                <p>No system is immune from risk.</p>
                
                <h2 className="text-xl font-semibold text-white mt-8 mb-4">
                  7. USER RIGHTS
                </h2>
                <p>Subject to applicable law, users may request:</p>
                <ul>
                  <li>Access to data</li>
                  <li>Correction of inaccuracies</li>
                  <li>Account deletion (where feasible)</li>
                </ul>
                <p>Certain records may be retained for compliance.</p>
                
                <h2 className="text-xl font-semibold text-white mt-8 mb-4">
                  8. THIRD-PARTY SERVICES
                </h2>
                <p>
                  Service providers (operators / hotels) are independent data controllers for fulfillment activities.
                  AeroDesk is not responsible for third-party privacy practices.
                </p>
                
                <h2 className="text-xl font-semibold text-white mt-8 mb-4">
                  9. CROSS-BORDER DATA
                </h2>
                <p>
                  Data may be processed using secure cloud infrastructure.
                </p>
                
                <h2 className="text-xl font-semibold text-white mt-8 mb-4">
                  10. POLICY UPDATES
                </h2>
                <p>
                  AeroDesk may update this policy periodically.
                  Continued use implies acceptance.
                </p>

                <h2 className="text-xl font-semibold text-white mt-8 mb-4">11. CONTACT</h2>
                <p>For privacy inquiries:</p>
                <p className="font-code text-accent">privacy@aerodesk.com</p>

              </CardContent>
            </Card>
          </div>
        </main>
        <LandingFooter />
      </div>
    </div>
  );
}
