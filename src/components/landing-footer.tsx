'use client';
import Link from "next/link";
import { Logo } from "./logo";
import { Phone, Mail, MessageSquare, Linkedin, Twitter, Instagram } from "lucide-react";

export function LandingFooter() {
    return (
        <footer className="border-t border-white/10 bg-black/30 text-white/80 backdrop-blur-md py-4 md:py-6">
          <div className="container px-4">
            <div className="grid w-full grid-cols-1 items-start gap-6 md:gap-8 md:grid-cols-4 md:text-left">
              <div className="flex flex-col items-start col-span-2 md:col-span-1">
                <Link href="/" className="hover:opacity-90 transition-opacity">
                  <Logo />
                </Link>
              </div>

              <div className="flex flex-col items-start gap-3">
                <h3 className="font-semibold uppercase tracking-widest text-[11px] text-white">
                  Get In Touch
                </h3>
                <div className="space-y-2">
                  <a
                    href="tel:+919819754038"
                    className="flex items-center gap-2 text-xs hover:text-white transition-colors"
                  >
                    <Phone className="h-3.5 w-3.5 text-accent" /> +91 98197 54038
                  </a>
                  <a
                    href="tel:+912228222202"
                    className="flex items-center gap-2 text-xs hover:text-white transition-colors"
                  >
                    <Phone className="h-3.5 w-3.5 text-accent" /> +91 22 2822 2202
                  </a>
                  <a
                    href="mailto:info@aerodesk.com"
                    className="flex items-center gap-2 text-xs hover:text-white transition-colors"
                  >
                    <Mail className="h-3.5 w-3.5 text-accent" /> info@aerodesk.com
                  </a>
                  <a
                    href="mailto:feedback@aerodesk.com"
                    className="flex items-center gap-2 text-xs hover:text-white transition-colors"
                  >
                    <MessageSquare className="h-3.5 w-3.5 text-accent" /> Feedback
                  </a>
                </div>
              </div>

              <div className="flex flex-col items-start gap-3">
                <h3 className="font-semibold uppercase tracking-widest text-[11px] text-white">
                  Legal
                </h3>
                <nav className="flex flex-col gap-2 text-xs">
                  <Link href="/terms-of-service" className="hover:text-white transition-colors">
                    Terms of Service
                  </Link>
                  <Link href="/privacy-policy" className="hover:text-white transition-colors">
                    Privacy Policy
                  </Link>
                  <Link href="/safety-standards" className="hover:text-white transition-colors">
                    Safety Standards
                  </Link>
                </nav>
              </div>

              <div className="flex flex-col items-start gap-3">
                <h3 className="font-semibold uppercase tracking-widest text-[11px] text-white">
                  Network
                </h3>
                <p className="text-[11px] leading-relaxed text-white/60">
                  India’s Private Aviation Ecosystem.
                </p>
                <div className="flex gap-4 pt-1">
                  <Link href="#" className="text-[#0077B5] transition-opacity hover:opacity-80">
                    <Linkedin className="h-4 w-4 fill-current" />
                    <span className="sr-only">LinkedIn</span>
                  </Link>
                  <Link href="#" className="text-[#E4405F] transition-opacity hover:opacity-80">
                    <Instagram className="h-4 w-4" />
                    <span className="sr-only">Instagram</span>
                  </Link>
                  <Link href="#" className="text-[#1DA1F2] transition-opacity hover:opacity-80">
                    <Twitter className="h-4 w-4 fill-current" />
                    <span className="sr-only">Twitter</span>
                  </Link>
                </div>
              </div>
            </div>
            <div className="mt-6 md:mt-8 border-t border-white/10 pt-3 md:pt-4 text-center text-[9px] text-white/40 uppercase tracking-[0.2em]">
              <p>
                &copy; {new Date().getFullYear()} AeroDesk Aviation Infrastructure. charter coordination only.
              </p>
            </div>
          </div>
        </footer>
    );
}