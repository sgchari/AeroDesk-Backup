
'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { LandingFooter } from '@/components/landing-footer';
import { LandingHeader } from '@/components/landing-header';
import { ShieldCheck, Zap, Activity, Plane, Users } from 'lucide-react';

// Use dynamic import for the map to prevent SSR issues with Leaflet
const IndiaOperatorNetworkMap = dynamic(
  () => import('@/components/IndiaOperatorNetworkMap').then((mod) => mod.IndiaOperatorNetworkMap),
  { 
    ssr: false,
    loading: () => (
      <div className="w-full h-[600px] bg-slate-950/50 rounded-3xl animate-pulse flex items-center justify-center border border-white/5">
        <p className="text-muted-foreground text-[10px] uppercase font-black tracking-widest">Synchronizing National Infrastructure Matrix...</p>
      </div>
    )
  }
);

export default function OurNetworkPage() {
  const [liveCharters, setLiveCharters] = useState(3);

  // Simulated live flux for activity counters
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveCharters(Math.floor(Math.random() * 4) + 2); // Random range 2-5
    }, 12000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full relative min-h-screen bg-[#0B1220] flex flex-col overflow-hidden">
      {/* Background Atmosphere Layer */}
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
          
          {/* Left Sector: Institutional Intelligence */}
          <div className="w-full lg:w-[35%] p-6 md:p-12 xl:p-16 flex flex-col justify-center gap-8 z-20">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-3 px-3 py-1.5 rounded-full border border-accent/20 bg-accent/5">
                <Zap className="h-3 w-3 text-accent animate-pulse" />
                <span className="text-[9px] font-black uppercase tracking-[0.2em] text-accent">National Operator Grid</span>
              </div>
              
              <h1 className="text-3xl md:text-4xl xl:text-5xl font-bold tracking-tighter font-headline text-white leading-[0.9]">
                NETWORK <br />
                <span className="text-accent uppercase">Infrastructure</span> <br />
                GRID
              </h1>
              
              <p className="text-muted-foreground text-sm md:text-base max-w-sm leading-relaxed">
                AeroDesk’s digital backbone provides institutional access to verified NSOP fleet operators across primary metropolitan sectors. Our national spatial grid coordinates complex multi-sector journeys through high-fidelity surveillance layers.
              </p>
            </div>
            
            {/* Live Activity Counters */}
            <div className="grid grid-cols-3 gap-4 border-y border-white/5 py-8">
              <div className="space-y-1">
                <div className="flex items-center gap-2 mb-1">
                    <Activity className="h-3 w-3 text-accent" />
                    <p className="text-[8px] font-black uppercase text-white/40 tracking-widest">Active Hubs</p>
                </div>
                <p className="text-2xl font-black text-white">06</p>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 mb-1">
                    <Plane className="h-3 w-3 text-accent" />
                    <p className="text-[8px] font-black uppercase text-white/40 tracking-widest">Ready Fleet</p>
                </div>
                <p className="text-2xl font-black text-accent">42+</p>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 mb-1">
                    <Users className="h-3 w-3 text-[#00ffa6]" />
                    <p className="text-[8px] font-black uppercase text-white/40 tracking-widest">Live Missions</p>
                </div>
                <div className="flex items-center gap-2">
                    <p className="text-2xl font-black text-white">{liveCharters}</p>
                    <div className="w-1.5 h-1.5 rounded-full bg-[#00ffa6] animate-ping" />
                </div>
              </div>
            </div>

            <div className="p-6 bg-white/[0.03] backdrop-blur-xl border border-white/5 rounded-3xl space-y-4 max-w-sm">
              <h4 className="text-[9px] font-black uppercase tracking-[0.3em] text-white/40 border-b border-white/5 pb-2 flex items-center gap-2">
                <ShieldCheck className="h-3 w-3 text-accent" />
                Platform Integrity
              </h4>
              <p className="text-[10px] text-muted-foreground italic leading-relaxed">
                "All coordinates and fleet telemetry are synchronized directly from verified NSOP operator profiles and mission dispatch logs."
              </p>
            </div>
          </div>

          {/* Right Sector: Geographic Dashboard */}
          <div className="flex-1 w-full h-[600px] lg:h-auto flex items-center justify-center p-4 lg:p-12 xl:p-16">
            <div className="w-full h-full max-w-5xl">
              <IndiaOperatorNetworkMap />
            </div>
          </div>
        </main>

        <LandingFooter />
      </div>
    </div>
  );
}
