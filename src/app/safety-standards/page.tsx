import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LandingFooter } from '@/components/landing-footer';
import { LandingHeader } from '@/components/landing-header';

export default function SafetyStandardsPage() {
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
          backgroundImage: "url('https://images.unsplash.com/photo-1627440474139-65a5d1656f7e?q=80&w=2070&auto=format&fit=crop')",
        }}
      >
        <div className="absolute inset-0 bg-black/30" />
      </div>
      <div className="relative z-10 flex min-h-screen flex-col bg-transparent">
        <LandingHeader />
      <main className="flex-1 py-12 md:py-16">
        <div className="container">
          <Card className="border-white/10 bg-black/15 backdrop-blur-md text-white">
            <CardHeader>
              <CardTitle className="text-3xl font-headline">
                SAFETY STANDARDS & OPERATIONAL PRINCIPLES
              </CardTitle>
              <p className="text-sm text-white/70">
                Last Updated: {lastUpdated}
              </p>
            </CardHeader>
            <CardContent className="prose prose-sm prose-invert max-w-none text-white/80">
              <h2 className="text-xl font-semibold text-white">
                1. PURPOSE OF THIS DOCUMENT
              </h2>
              <p>
                This Safety Standards & Operational Principles document defines the safety philosophy, responsibilities, and limitations governing the AeroDesk platform.
              </p>
              <p>
                AeroDesk operates as a digital coordination and workflow infrastructure system supporting non-scheduled charter aviation activities.
              </p>
              <p>
                AeroDesk does not conduct flight operations and does not assume operational control over any aircraft.
              </p>
              
              <h2 className="text-xl font-semibold text-white">
                2. PLATFORM ROLE IN SAFETY
              </h2>
              <p>
                AeroDesk is designed to support safe decision-making environments through:
              </p>
              <ul>
                <li>Structured Charter Request workflows (RFQs)</li>
                <li>Transparent operator quotation exchanges</li>
                <li>Audit-ready approval trails</li>
                <li>Compliance-aware system design</li>
                <li>Controlled empty-leg facilitation</li>
                <li>Role-based visibility and restrictions</li>
              </ul>
              <p>
                AeroDesk does not influence flight execution, aircraft dispatch, crew actions, or airworthiness decisions.
              </p>

              <h2 className="text-xl font-semibold text-white">
                3. FUNDAMENTAL SAFETY PRINCIPLE
              </h2>
              <p>
                All aviation safety responsibilities rest exclusively with the licensed aircraft operator.
              </p>
              <p>Operators are solely responsible for:</p>
              <ul>
                <li>Airworthiness of aircraft</li>
                <li>Flight planning and dispatch</li>
                <li>Crew qualification and duty compliance</li>
                <li>Maintenance and inspections</li>
                <li>Regulatory approvals</li>
                <li>Operational risk management</li>
              </ul>
              <p>
                AeroDesk does not certify, validate, or supervise flight safety.
              </p>

              <h2 className="text-xl font-semibold text-white">
                4. OPERATOR SAFETY REQUIREMENTS
              </h2>
              <p>All operators using AeroDesk must:</p>
              <ul>
                <li>Hold valid regulatory approvals (NSOP / AOC / equivalent)</li>
                <li>Maintain aircraft in accordance with aviation regulations</li>
                <li>Ensure crew qualification and recency</li>
                <li>Follow DGCA / applicable authority rules</li>
                <li>Maintain operational safety management systems (SMS)</li>
              </ul>
              <p>Operators must ensure that all data presented on AeroDesk is accurate and current.</p>

              <h2 className="text-xl font-semibold text-white">
                5. INFORMATIONAL NATURE OF PLATFORM DATA
              </h2>
              <p>Information displayed on AeroDesk is provided by third-party users.</p>
              <p>While AeroDesk may implement validation logic, AeroDesk:</p>
              <ul>
                <li>Does not guarantee operator data accuracy</li>
                <li>Does not verify airworthiness status</li>
                <li>Does not assess flight risk conditions</li>
                <li>Does not validate crew legality</li>
              </ul>
              <p>Users must independently confirm operational details where required.</p>

              <h2 className="text-xl font-semibold text-white">
                6. CHARTER REQUEST & QUOTATION SAFETY CONTEXT
              </h2>
              <p>Charter Requests (RFQs) and quotations represent commercial and coordination data only.</p>
              <p>They do not constitute:</p>
              <ul>
                <li>Flight authorization</li>
                <li>Operational dispatch clearance</li>
                <li>Safety approval</li>
                <li>Aircraft assignment confirmation</li>
              </ul>
              <p>Final flight decisions remain under operator authority.</p>

              <h2 className="text-xl font-semibold text-white">
                7. EMPTY-LEG SAFETY PRINCIPLES
              </h2>
              <p>Empty-leg listings on AeroDesk:</p>
              <ul>
                <li>Represent opportunistic non-scheduled aircraft movements</li>
                <li>Must comply with regulatory restrictions</li>
                <li>Must not imply scheduled air service</li>
                <li>Are subject to operator confirmation</li>
              </ul>
              <p>Operators remain responsible for passenger acceptance, weight limits, fuel planning, and safety compliance.</p>
              
              <h2 className="text-xl font-semibold text-white">
                8. CREW & OPERATIONAL SAFETY
              </h2>
              <p>Crew safety, flight duty time limitations, and operational readiness are:</p>
              <ul className="list-none pl-0">
                <li>✅ Entirely operator responsibilities</li>
                <li>❌ Never delegated to AeroDesk</li>
              </ul>
              <p>The platform does not monitor or enforce crew legality.</p>

              <h2 className="text-xl font-semibold text-white">
                9. HOTEL & ANCILLARY SERVICES SAFETY POSITION
              </h2>
              <p>Accommodation facilitation within AeroDesk:</p>
              <ul>
                <li>Is operationally separate from aviation safety</li>
                <li>Does not affect flight operations</li>
                <li>Does not alter operator safety obligations</li>
              </ul>
              <p>Hotels operate as independent service providers.</p>

              <h2 className="text-xl font-semibold text-white">
                10. NO OPERATIONAL CONTROL OR DISPATCH ROLE
              </h2>
              <p>AeroDesk does not function as:</p>
              <ul>
                <li>Flight dispatcher</li>
                <li>Operational control center</li>
                <li>Crew scheduler</li>
                <li>Airworthiness authority</li>
                <li>Safety monitoring system</li>
              </ul>
              <p>The platform provides workflow coordination only.</p>

              <h2 className="text-xl font-semibold text-white">
                11. USER SAFETY RESPONSIBILITIES
              </h2>
              <p>All users must:</p>
              <ul>
                <li>Provide accurate passenger information</li>
                <li>Respect operator safety limitations</li>
                <li>Follow applicable regulations</li>
                <li>Avoid misuse of platform data</li>
              </ul>
              <p>Misrepresentation of safety-critical information may result in suspension.</p>

              <h2 className="text-xl font-semibold text-white">
                12. INCIDENTS & IRREGULAR OPERATIONS
              </h2>
              <p>In the event of:</p>
              <ul>
                <li>Flight delays</li>
                <li>Cancellations</li>
                <li>Operational incidents</li>
                <li>Safety events</li>
              </ul>
              <p>Users must communicate directly with the aircraft operator.</p>
              <p>AeroDesk is not responsible for operational disruptions.</p>

              <h2 className="text-xl font-semibold text-white">
                13. LIMITATION OF SAFETY LIABILITY
              </h2>
              <p>To the maximum extent permitted by law:</p>
              <p>AeroDesk shall not be liable for:</p>
              <ul>
                <li>Flight safety outcomes</li>
                <li>Aircraft performance</li>
                <li>Crew actions</li>
                <li>Operational incidents</li>
                <li>Third-party failures</li>
              </ul>
              <p>Safety oversight is outside platform scope.</p>

              <h2 className="text-xl font-semibold text-white">
                14. SAFETY-ORIENTED DESIGN COMMITMENTS
              </h2>
              <p>AeroDesk commits to maintaining a platform environment that:</p>
              <ul>
                <li>Avoids unsafe operational representations</li>
                <li>Avoids scheduled airline-like behavior</li>
                <li>Preserves operator authority boundaries</li>
                <li>Supports compliance-aware workflows</li>
                <li>Encourages transparent coordination</li>
              </ul>

              <h2 className="text-xl font-semibold text-white">
                15. REGULATORY ALIGNMENT PRINCIPLE
              </h2>
              <p>AeroDesk is designed to coexist with regulated aviation frameworks.</p>
              <p>Nothing within the platform supersedes:</p>
              <ul>
                <li>DGCA regulations</li>
                <li>Civil aviation rules</li>
                <li>Operator manuals</li>
                <li>Safety management systems</li>
              </ul>

              <h2 className="text-xl font-semibold text-white">
                16. REPORTING SAFETY CONCERNS
              </h2>
              <p>Safety concerns relating to platform misuse may be reported to:</p>
              <p>safety@aerodesk.com</p>
              <p>Operational safety concerns must be directed to the relevant operator.</p>

            </CardContent>
          </Card>
        </div>
      </main>
      <LandingFooter />
      </div>
    </div>
  );
}
