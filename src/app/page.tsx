import { Button } from '@/components/ui/button';
import { Layers, ShieldCheck, GanttChartSquare, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { Logo } from '@/components/logo';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { PlaceHolderImages } from '@/lib/placeholder-images';

function FullScreenSection({ imageUrl, imageHint, children, className }: { imageUrl?: string, imageHint?: string, children: React.ReactNode, className?: string }) {
  return (
    <section className={cn("relative w-full min-h-screen flex flex-col justify-center items-center py-12 md:py-24 lg:py-32", className)}>
      {imageUrl && (
        <Image
          src={imageUrl}
          alt="Background"
          fill
          className="object-cover"
          data-ai-hint={imageHint || ''}
        />
      )}
      <div className="absolute inset-0 bg-black/60" />
      <div className="container relative z-10 mx-auto px-4 md:px-6">
        {children}
      </div>
    </section>
  );
}


export default function Home() {
  const heroImage = PlaceHolderImages.find(img => img.id === 'landing-hero');
  const featuresImage = PlaceHolderImages.find(img => img.id === 'landing-features');
  
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="sticky top-0 z-40 w-full border-b border-border/20 bg-background/80 backdrop-blur-sm">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/">
            <Logo />
          </Link>
          <div className="flex items-center gap-2">
            <Button asChild variant="ghost">
                <Link href="/login">Login</Link>
            </Button>
            <Button asChild>
                <Link href="/register">Register</Link>
            </Button>
          </div>
        </div>
      </header>
      <main className="flex-1">
        
        <FullScreenSection imageUrl={heroImage?.imageUrl} imageHint={heroImage?.imageHint}>
            <div className="text-center">
              <div className="bg-black/30 backdrop-blur-xl p-6 rounded-lg max-w-3xl mx-auto">
                  <h1 className="font-headline text-xl font-bold tracking-tight text-primary-foreground sm:text-2xl md:text-3xl">
                  Digital Infrastructure for Charter Aviation
                  </h1>
                  <p className="mt-4 max-w-[750px] text-xs text-primary-foreground/80 sm:text-sm md:text-base mx-auto">
                  A compliance-first coordination platform for non-scheduled charter operations in India.
                  </p>
              </div>
              <Button asChild size="lg" className="mt-8">
                <Link href="/login">
                  Login <ArrowRight className="ml-2" />
                </Link>
              </Button>
            </div>
        </FullScreenSection>

        <FullScreenSection imageUrl={featuresImage?.imageUrl} imageHint={featuresImage?.imageHint}>
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-3">
              <div className="inline-block rounded-lg bg-secondary px-3 py-1 text-sm text-primary">
                The AeroDesk Advantage
              </div>
              <h2 className="font-headline text-3xl font-bold tracking-tighter sm:text-5xl text-primary-foreground">
                Unified Aviation Infrastructure
              </h2>
              <p className="max-w-[900px] text-primary-foreground/80 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                AeroDesk provides a secure, compliant, and efficient digital ecosystem for all stakeholders in the non-scheduled charter market. From RFQ to final confirmation, our platform streamlines every step.
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-7xl items-start gap-8 sm:grid-cols-2 md:gap-12 lg:grid-cols-3 lg:gap-16 mt-12">
            <Card className="grid gap-2 text-center bg-card/70 border-border/50 backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-center justify-center h-16 w-16 rounded-full bg-primary/10 text-primary mx-auto">
                  <GanttChartSquare className="h-8 w-8" />
                </div>
                <CardTitle className="text-xl">Centralized Marketplace</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Access a transparent marketplace for RFQs, connecting customers with a network of verified NSOP operators.
                </p>
              </CardContent>
            </Card>
            <Card className="grid gap-2 text-center bg-card/70 border-border/50 backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-center justify-center h-16 w-16 rounded-full bg-primary/10 text-primary mx-auto">
                  <ShieldCheck className="h-8 w-8" />
                </div>
                <CardTitle className="text-xl">Compliance First</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Built-in verification and immutable audit trails ensure every action meets stringent regulatory requirements.
                </p>
              </CardContent>
            </Card>
            <Card className="grid gap-2 text-center bg-card/70 border-border/50 backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-center justify-center h-16 w-16 rounded-full bg-primary/10 text-primary mx-auto">
                  <Layers className="h-8 w-8" />
                </div>
                <CardTitle className="text-xl">Integrated Ecosystem</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Seamlessly coordinate ancillary services, including hotel and ground transport, through a single platform interface.
                </p>
              </CardContent>
            </Card>
          </div>
          <div className="grid items-center justify-center gap-4 px-4 text-center md:px-6 mt-16">
            <div className="space-y-3">
              <h2 className="font-headline text-3xl font-bold tracking-tighter md:text-4xl/tight text-primary-foreground">
                Ready to Streamline Your Operations?
              </h2>
              <p className="mx-auto max-w-[600px] text-primary-foreground/80 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Join the future of digital aviation infrastructure. Access the platform to see how AeroDesk can transform your charter procurement process.
              </p>
            </div>
            <div className="mx-auto w-full max-w-sm space-y-2">
              <Button asChild size="lg" className="w-full">
                <Link href="/login">Login</Link>
              </Button>
              <p className="text-xs text-muted-foreground">
                By entering the platform, you agree to our terms of service.
              </p>
            </div>
          </div>
        </FullScreenSection>
      </main>
      <footer className="relative z-10 flex w-full shrink-0 flex-col items-center gap-2 border-t px-4 py-6 sm:flex-row md:px-6 bg-background/80 backdrop-blur-sm">
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
