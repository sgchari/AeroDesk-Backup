'use client';

import React from 'react';
import Image from 'next/image';
import { LandingFooter } from '@/components/landing-footer';
import { LandingHeader } from '@/components/landing-header';
import { IndiaOperatorNetworkMap } from '@/components/IndiaOperatorNetworkMap';
import { ShieldCheck } from 'lucide-react';

export default function OurNetworkPage() {
  return (
    <div className="w-full relative min-h-screen bg-[#0B1220] flex flex-col overflow-hidden">
      {/* Background Layer: Dimmed Atmosphere */}
      <div className="fixed inset-0 z-0">
        <Image
          src="https://images.unsplash.com/photo-1506929562872-bb421503ef21?auto=format&fit=crop&q=80&w=2070"
          alt="Atmosphere"
          fill
          priority
          className="object-cover opacity-5 blur-3xl"
          data-ai-hint="airplane beach"
        />
        <div className="absolute inset-0 bg-aviation-radial opacity-90" />
      </div>

      <div className="relative z-10 flex flex-col flex-1">
        <LandingHeader activePage="Our Network" />
        
        <main className="flex-1 flex flex-col lg:flex-row items-stretch overflow-hidden">
          
          {/* Left Intelligence Column (35%) */}
          <div className="w-full lg:w-[35%] p-6 md:p-12 xl:p-20 flex flex-col justify-center gap-8 z-20">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-3 px-3 py-1.5 rounded-full border border-accent/20 bg-accent/5">
                <div className="w-2 h-2 rounded-full bg-[#00ffa6] animate-pulse shadow-[0_0_8px_#00ffa6]" />
                <span className="text-[9px] font-black uppercase tracking-[0.2em] text-accent">Spatial Engine Initialized</span>
              </div>
              
              <h1 className="text-4xl md:text-5xl xl:text-7xl font-bold tracking-tighter font-headline text-white leading-[0.9]">
                NATIONAL <br />
                <span className="text-accent uppercase">Operator</span> <br />
                GRID
              </h1>
              
              <p className="text-muted-foreground text-sm md:text-base max-w-sm leading-relaxed">
                AeroDesk’s national aviation backbone visualized through a high-fidelity geographic coordination layer. Our network provides institutional-grade access to NSOP fleet operators across primary metropolitan hubs.
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-8">
              <div className="space-y-1">
                <p className="text-[8px] font-black uppercase text-white/40 tracking-[0.2em]">Validated Hubs</p>
                <p className="text-3xl font-black text-white">06</p>
              </div>
              <div className="space-y-1">
                <p className="text-[8px] font-black uppercase text-white/40 tracking-[0.2em]">Ready Fleet</p>
                <p className="text-3xl font-black text-accent">42+</p>
              </div>
            </div>

            <div className="p-6 bg-white/[0.03] backdrop-blur-xl border border-white/5 rounded-3xl space-y-4 max-w-sm">
              <h4 className="text-[9px] font-black uppercase tracking-[0.3em] text-white/40 border-b border-white/5 pb-2 flex items-center gap-2">
                <ShieldCheck className="h-3 w-3 text-accent" />
                Network Integrity
              </h4>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-[#00ffa6]" style={{ filter: 'drop-shadow(0 0 4px #00ffa6)' }} />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-white/80">Active Operator Base</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-4 h-0.5 border-t border-dashed border-[#00d4ff]" />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-white/40">Mission Corridor</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Spatial Map Sector (65%) */}
          <div className="flex-1 w-full h-full flex items-center justify-center p-4 lg:p-12 xl:p-16">
            <div className="w-full h-[600px] max-w-5xl">
              <IndiaOperatorNetworkMap />
            </div>
          </div>
        </main>

        <LandingFooter />
      </div>
    </div>
  );
}
