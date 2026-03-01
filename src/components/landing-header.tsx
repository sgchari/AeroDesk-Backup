'use client';

import React, { useState, useEffect, type FC, useRef } from 'react';
import Link from 'next/link';
import { Menu, Phone } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import { Logo } from '@/components/logo';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';

export const LandingHeader: FC<{activePage?: string}> = ({activePage}) => {
  const lastScrollY = useRef(0);
  const [isVisible, setIsVisible] = useState(true);
  const isMobile = useIsMobile();

  useEffect(() => {
    const handleScroll = () => {
      if (!isMobile) {
        setIsVisible(true);
        return;
      }
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY.current && currentScrollY > 80) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
        window.removeEventListener('scroll', handleScroll);
    };
  }, [isMobile]);

  const navLinks = [
    { href: '/promotions', label: 'Promotions' },
    { href: '/our-network', label: 'Our Network' },
    { href: '/blog', label: 'Blog' },
    { href: '/media', label: 'Media' },
  ];
    
  return (
    <header
      className={cn(
        'sticky top-0 z-50 w-full text-white transition-transform duration-300 bg-black/30 backdrop-blur-md',
        !isVisible && isMobile && '-translate-y-full'
      )}
    >
      <div className="container flex h-20 items-center">
        <div className="flex flex-1 items-center justify-start gap-6">
          <Link href="/">
            <Logo />
          </Link>
        </div>

        <nav className="hidden items-center gap-6 text-sm md:flex flex-1 justify-center">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className={cn("font-semibold text-white transition-colors hover:text-white/80", activePage === link.label && "text-accent")}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex flex-1 items-center justify-end gap-4">
          <div className="hidden items-center gap-4 md:flex">
            <a
              href="tel:+919819754038"
              className="flex items-center gap-2 text-sm font-semibold text-white transition-colors hover:text-white/80"
            >
              <Phone className="h-4 w-4" />
              +91 9819754038
            </a>
            <Button
              variant="ghost"
              asChild
              className="font-semibold text-white hover:bg-white/10 hover:text-white"
            >
              <Link href="/login">Login</Link>
            </Button>
            <Button asChild style={{ backgroundColor: '#FFFFBD', color: 'black' }}>
              <Link href="/register">Register</Link>
            </Button>
          </div>

          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white hover:bg-white/10 hover:text-white"
                >
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent
                side="right"
                className="w-[280px] border-l-0 bg-transparent p-0 text-white"
              >
                <SheetTitle className="sr-only">Mobile Menu</SheetTitle>
                 <div>
                  <div className="flex h-20 items-center justify-start border-b border-white/10 bg-black/30 px-3 backdrop-blur-md">
                    <Link href="/" className="-ml-4">
                      <Logo />
                    </Link>
                  </div>
                  <nav className="bg-transparent/20 p-6 backdrop-blur-none">
                    {navLinks.map((link) => (
                      <Link
                        key={link.label}
                        href={link.href}
                        className={cn("py-2 text-sm text-white/80 transition-colors hover:text-white block", activePage === link.label && "text-accent")}
                      >
                        {link.label}
                      </Link>
                    ))}
                  </nav>
                  <div className="shrink-0 border-t border-white/10 bg-black/30 p-2 backdrop-blur-md">
                    <a
                      href="tel:+919819754038"
                      className="flex items-center gap-2 text-sm font-medium text-white/80 transition-colors hover:text-white"
                    >
                      <Phone className="h-4 w-4" />
                      +91 9819754038
                    </a>
                    <div className="mt-2 grid grid-cols-2 gap-2">
                      <Button asChild style={{ backgroundColor: '#FFFFBD', color: 'black' }}>
                        <Link href="/login">Login</Link>
                      </Button>
                      <Button
                        variant="ghost"
                        asChild
                        className="font-semibold text-white hover:bg-white/10"
                      >
                        <Link href="/register">Register</Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
};
