import { Button } from '@/components/ui/button';
import { Briefcase, CheckCheck, FilePlus2 } from 'lucide-react';
import Link from 'next/link';
import { Logo } from '@/components/logo';
import { LandingHero } from '@/components/landing-hero';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="sticky top-0 z-40 w-full border-b border-border/20 bg-background/80 backdrop-blur-sm">
        <div className="container flex h-16 items-center justify-between">
          <Logo />
          <Button asChild variant="outline">
            <Link href="/login">Platform Access</Link>
          </Button>
        </div>
      </header>
      <main className="flex-1">
        <LandingHero />

        <section id="process" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container mx-auto px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-3">
                <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm text-accent">
                  Coordination Workflow
                </div>
                <h2 className="font-headline text-3xl font-bold tracking-tighter sm:text-5xl">
                  A Transparent, Request-Based Protocol
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  AeroDesk is not a booking platform. We provide the digital
                  rails for compliant charter procurement between customers,
                  corporates, and verified NSOP operators. All actions are
                  request-based and subject to multi-party confirmation.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-7xl items-start gap-8 sm:grid-cols-2 md:gap-12 lg:grid-cols-3 lg:gap-16 mt-12">
              <Card className="grid gap-2 text-center">
                <CardHeader>
                  <div className="flex items-center justify-center h-16 w-16 rounded-full bg-primary/10 text-primary mx-auto">
                    <FilePlus2 className="h-8 w-8" />
                  </div>
                  <CardTitle className="text-xl">1. Submit RFQ</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Customers and Corporate Travel Desks create a detailed
                    Request for Quotation for their charter requirements.
                  </p>
                </CardContent>
              </Card>
              <Card className="grid gap-2 text-center">
                <CardHeader>
                  <div className="flex items-center justify-center h-16 w-16 rounded-full bg-primary/10 text-primary mx-auto">
                    <Briefcase className="h-8 w-8" />
                  </div>
                  <CardTitle className="text-xl">2. Operator Quotations</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Verified NSOP operators submit competitive quotations
                    against the RFQ through the secure platform exchange.
                  </p>
                </CardContent>
              </Card>
              <Card className="grid gap-2 text-center">
                <CardHeader>
                  <div className="flex items-center justify-center h-16 w-16 rounded-full bg-primary/10 text-primary mx-auto">
                    <CheckCheck className="h-8 w-8" />
                  </div>
                  <CardTitle className="text-xl">3. Select & Confirm</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    After internal approvals, the customer selects the preferred
                    operator. Final confirmation is handled offline.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section className="w-full bg-muted/40 py-12 md:py-24 lg:py-32">
          <div className="container mx-auto grid items-center justify-center gap-4 px-4 text-center md:px-6">
            <div className="space-y-3">
              <h2 className="font-headline text-3xl font-bold tracking-tighter md:text-4xl/tight">
                Built for Governance and Auditability
              </h2>
              <p className="mx-auto max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                The platform is designed from the ground up with immutable audit
                trails to meet the strict governance requirements of public and
                private sector entities.
              </p>
            </div>
            <div className="mx-auto w-full max-w-sm space-y-2">
              <Button asChild size="lg" className="w-full" variant="outline">
                <Link href="/login">Enter Platform</Link>
              </Button>
              <p className="text-xs text-muted-foreground">
                By entering the platform, you agree to our terms of service.
              </p>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex w-full shrink-0 flex-col items-center gap-2 border-t px-4 py-6 sm:flex-row md:px-6">
        <p className="text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} AeroDesk. All rights reserved.
        </p>
        <nav className="flex gap-4 sm:ml-auto sm:gap-6">
          <Link
            href="#"
            className="text-xs hover:underline underline-offset-4"
            prefetch={false}
          >
            Terms of Service
          </Link>
          <Link
            href="#"
            className="text-xs hover:underline underline-offset-4"
            prefetch={false}
          >
            Privacy
          </Link>
        </nav>
      </footer>
    </div>
  );
}