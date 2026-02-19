'use client';

import { PlaceHolderImages } from '@/lib/placeholder-images';
import { ArrowRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';

const heroImage = PlaceHolderImages.find((img) => img.id === 'hero-background');

export function LandingHero() {
  const [scale, setScale] = useState(1.15);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const newScale = Math.max(1, 1.15 - scrollY / 800);
      setScale(newScale);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Set initial scale

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <section className="relative h-[600px] w-full overflow-hidden">
      {heroImage && (
        <div
          className="absolute inset-0 transition-transform duration-200 ease-out"
          style={{ transform: `scale(${scale})` }}
        >
          <Image
            src={heroImage.imageUrl}
            alt={heroImage.description}
            fill
            className="object-cover"
            data-ai-hint={heroImage.imageHint}
            priority
          />
        </div>
      )}
      <div className="absolute inset-0 bg-background/80" />
      <div className="relative z-10 flex h-full flex-col items-center justify-center text-center text-primary-foreground">
        <h1 className="font-headline text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
          Digital Infrastructure for Charter Aviation
        </h1>
        <p className="mt-4 max-w-[700px] text-lg md:text-xl">
          A compliance-first coordination platform for non-scheduled charter operations in India.
        </p>
        <Button asChild size="lg" className="mt-8 border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10" variant="outline">
          <Link href="/login">
            Enter Platform <ArrowRight className="ml-2" />
          </Link>
        </Button>
      </div>
    </section>
  );
}
