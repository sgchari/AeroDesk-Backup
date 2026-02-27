'use client';
import Link from "next/link";
import { Logo } from "./logo";
import { Phone, Mail, MessageSquare } from "lucide-react";

export function LandingFooter() {
    return (
        <footer className="border-t border-white/10 bg-black/30 text-white/80 backdrop-blur-md py-8">
          <div className="container px-4">
            <div className="grid w-full grid-cols-1 items-start gap-12 md:grid-cols-4 md:text-left">
              <div className="flex flex-col items-start col-span-2 md:col-span-1">
                <Link href="/" className="hover:opacity-90 transition-opacity">
                  <Logo />
                </Link>
              </div>

              <div className="flex flex-col items-start gap-4">
                <h3 className="font-semibold uppercase tracking-widest text-sm text-white">
                  Get In Touch
                </h3>
                <div className="space-y-3">
                  <a
                    href="tel:+919819754038"
                    className="flex items-center gap-2 text-sm hover:text-white transition-colors"
                  >
                    <Phone className="h-4 w-4 text-accent" /> +91 98197 54038
                  </a>
                  <a
                    href="tel:+912228222202"
                    className="flex items-center gap-2 text-sm hover:text-white transition-colors"
                  >
                    <Phone className="h-4 w-4 text-accent" /> +91 22 2822 2202
                  </a>
                  <a
                    href="mailto:info@aerodesk.com"
                    className="flex items-center gap-2 text-sm hover:text-white transition-colors"
                  >
                    <Mail className="h-4 w-4 text-accent" /> info@aerodesk.com
                  </a>
                  <a
                    href="mailto:feedback@aerodesk.com"
                    className="flex items-center gap-2 text-sm hover:text-white transition-colors"
                  >
                    <MessageSquare className="h-4 w-4 text-accent" /> Feedback & Suggestions
                  </a>
                </div>
              </div>

              <div className="flex flex-col items-start gap-4">
                <h3 className="font-semibold uppercase tracking-widest text-sm text-white">
                  Legal
                </h3>
                <nav className="flex flex-col gap-3 text-sm">
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

              <div className="flex flex-col items-start gap-4">
                <h3 className="font-semibold uppercase tracking-widest text-sm text-white">
                  Network Connectivity
                </h3>
                <p className="text-xs leading-relaxed text-white/60">
                  Digitally connecting India’s Private Aviation Ecosystem.
                </p>
                <div className="flex gap-4">
                  {/* Social SVGs remained unchanged for visual brevity */}
                </div>
              </div>
            </div>
            <div className="mt-12 border-t border-white/10 pt-8 text-center text-[10px] text-white/40 uppercase tracking-[0.2em]">
              <p>
                &copy; {new Date().getFullYear()} AeroDesk Aviation Infrastructure. charter coordination only.
              </p>
            </div>
          </div>
        </footer>
    );
}
