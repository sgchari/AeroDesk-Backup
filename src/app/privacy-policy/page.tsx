import { Logo } from '@/components/logo';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';

export default function PrivacyPolicyPage() {
  const lastUpdated = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

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
        <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-black/30 backdrop-blur-md">
            <div className="container flex h-20 items-center justify-between">
                <div className="flex items-center gap-6">
                    <Link href="/">
                        <Logo />
                    </Link>
                </div>
            </div>
        </header>
        <main className="flex-1 py-12 md:py-16">
          <div className="container">
            <Card className="border-white/10 bg-black/15 backdrop-blur-md text-white">
              <CardHeader>
                <CardTitle className="text-3xl font-headline">
                  AERODESK – PRIVACY POLICY
                </CardTitle>
                <p className="text-sm text-white/70">
                  Last Updated: {lastUpdated}
                </p>
              </CardHeader>
              <CardContent className="prose prose-sm prose-invert max-w-none text-white/80">
                <p>
                  AeroDesk respects user privacy and handles data in a manner consistent with enterprise governance and regulated aviation environments.
                </p>

                <h2 className="text-xl font-semibold text-white">
                  1. DATA CONTROLLER ROLE
                </h2>
                <p>
                  AeroDesk acts as a platform operator and data facilitator, not as a service provider of aviation or accommodation services.
                </p>

                <h2 className="text-xl font-semibold text-white">
                  2. INFORMATION WE COLLECT
                </h2>
                <p>
                  Depending on user role, AeroDesk may collect:
                </p>
                <h3 className="font-semibold text-white/90">Account Information</h3>
                <ul>
                  <li>Name, email, organization details</li>
                  <li>Role classification</li>
                </ul>
                <h3 className="font-semibold text-white/90">Operational Data</h3>
                <ul>
                  <li>Charter request details</li>
                  <li>Passenger information (names, counts)</li>
                  <li>Flight preferences</li>
                  <li>Empty-leg requests</li>
                </ul>
                 <h3 className="font-semibold text-white/90">Corporate Data</h3>
                <ul>
                  <li>Cost centers</li>
                  <li>Approval workflows</li>
                  <li>Policy notes</li>
                </ul>
                <h3 className="font-semibold text-white/90">Hotel & Ancillary Data</h3>
                <ul>
                  <li>Accommodation requests</li>
                  <li>Confirmation references</li>
                </ul>
                <h3 className="font-semibold text-white/90">Technical Data</h3>
                <ul>
                  <li>Device, session, usage logs</li>
                </ul>

                <h2 className="text-xl font-semibold text-white">
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
                
                <h2 className="text-xl font-semibold text-white">
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

                <h2 className="text-xl font-semibold text-white">
                  5. DATA RETENTION
                </h2>
                <p>Data is retained only as long as necessary for:</p>
                <ul>
                  <li>Operational records</li>
                  <li>Audit obligations</li>
                  <li>Legal compliance</li>
                </ul>
                <p>Retention periods may vary by role.</p>

                <h2 className="text-xl font-semibold text-white">
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
                
                <h2 className="text-xl font-semibold text-white">
                  7. USER RIGHTS
                </h2>
                <p>Subject to applicable law, users may request:</p>
                <ul>
                  <li>Access to data</li>
                  <li>Correction of inaccuracies</li>
                  <li>Account deletion (where feasible)</li>
                </ul>
                <p>Certain records may be retained for compliance.</p>
                
                <h2 className="text-xl font-semibold text-white">
                  8. THIRD-PARTY SERVICES
                </h2>
                <p>
                  Service providers (operators / hotels) are independent data controllers for fulfillment activities.
                  AeroDesk is not responsible for third-party privacy practices.
                </p>
                
                <h2 className="text-xl font-semibold text-white">
                  9. CROSS-BORDER DATA
                </h2>
                <p>
                  Data may be processed using secure cloud infrastructure.
                </p>
                
                <h2 className="text-xl font-semibold text-white">
                  10. POLICY UPDATES
                </h2>
                <p>
                  AeroDesk may update this policy periodically.
                  Continued use implies acceptance.
                </p>

                <h2 className="text-xl font-semibold text-white">11. CONTACT</h2>
                <p>For privacy inquiries:</p>
                <p>privacy@aerodesk.com</p>

              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
