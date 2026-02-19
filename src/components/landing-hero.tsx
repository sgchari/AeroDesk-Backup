'use client';

import { ArrowRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export function LandingHero() {

  return (
    <section className="relative h-[80vh] md:h-[600px] w-full overflow-hidden">
      <Image
        src="https://picsum.photos/seed/jetinterior/1920/1080"
        alt="Luxurious private jet cabin"
        fill
        className="object-cover"
        data-ai-hint="jet interior"
        priority
      />
      <div className="absolute inset-0 bg-background/50" />
      <div className="relative z-10 flex h-full flex-col items-center justify-center p-4 text-center">
        <div className="bg-black/30 backdrop-blur-sm p-8 rounded-xl max-w-4xl">
            <h1 className="font-headline text-4xl font-bold tracking-tight text-primary-foreground sm:text-5xl md:text-6xl lg:text-7xl">
            Digital Infrastructure for Charter Aviation
            </h1>
            <p className="mt-6 max-w-[750px] text-lg text-primary-foreground/80 md:text-xl mx-auto">
            A compliance-first coordination platform for non-scheduled charter operations in India.
            </p>
        </div>
        <Button asChild size="lg" className="mt-8">
          <Link href="/login">
            Login <ArrowRight className="ml-2" />
          </Link>
        </Button>
      </div>
    </section>
  );
}
