'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { LandingHeader } from '@/components/landing-header';
import { LandingFooter } from '@/components/landing-footer';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
    ShieldCheck, 
    Plane, 
    Users, 
    Briefcase, 
    Activity, 
    Target, 
    GanttChartSquare, 
    Armchair, 
    Map as MapIcon,
    ArrowRight,
    Lock,
    Hotel
} from 'lucide-react';
import { DemoAccessModal } from '@/components/demo-access-modal';

const features = [
    { title: 'Charter Marketplace', icon: Plane, description: 'Institutional coordination for private flight journeys.' },
    { title: 'Jet Seat Marketplace', icon: Armchair, description: 'Allocatable empty-leg inventory across metro hubs.' },
    { title: 'Corporate Travel Desk', icon: Briefcase, description: 'Policy-driven approval flows and budget control.' },
    { title: 'Operator Ops Center', icon: Activity, description: 'Fleet-wide situational awareness and dispatch command.' },
    { title: 'Aviation Intelligence', icon: MapIcon, description: 'Real-time positioning and demand intensity radar.' },
];

const demoRoles = [
    { id: 'admin', title: 'Admin Portal', description: 'Platform governance, entity management, and global audit.', icon: ShieldCheck, email: 'admin-demo@aerodesk.global' },
    { id: 'operator', title: 'Operator Dashboard', description: 'Fleet management, tech bidding, and yield optimization.', icon: Plane, email: 'operator-demo@aerodesk.global' },
    { id: 'agency', title: 'Travel Agency', description: 'Client coordination, seat leads, and commission tracking.', icon: Briefcase, email: 'agency-demo@aerodesk.global' },
    { id: 'corporate', title: 'Corporate Desk', description: 'Employee travel approvals, cost centers, and spend analytics.', icon: Users, email: 'corporate-demo@aerodesk.global' },
    { id: 'customer', title: 'Customer Experience', description: 'HNWI mission tracking, seat booking, and trip command.', icon: Target, email: 'customer-demo@aerodesk.global' },
    { id: 'hotel', title: 'Hotel Partner', icon: Hotel, description: 'Stay coordination, inventory control, and arrival pulse.', email: 'hotel-demo@aerodesk.global' },
];

export default function DemoLandingPage() {
    const [selectedRole, setSelectedRole] = useState<{ id: string, title: string, email: string } | null>(null);

    return (
        <div className="w-full relative min-h-screen bg-[#0B1220]">
            <div className="fixed inset-0 z-0">
                <Image
                    src="https://images.unsplash.com/photo-1506929562872-bb421503ef21?auto=format&fit=crop&q=80&w=2070"
                    alt="Atmosphere"
                    fill
                    priority
                    className="object-cover"
                    data-ai-hint="airplane beach"
                />
                <div className="absolute inset-0 bg-black/60 backdrop-blur-md" />
            </div>

            <div className="relative z-10 flex flex-col min-h-screen">
                <LandingHeader />

                <main className="flex-1">
                    {/* Hero Section */}
                    <section className="container py-16 md:py-24 text-center space-y-6">
                        <Badge variant="outline" className="h-8 px-4 bg-accent/5 border-accent/20 text-accent font-black uppercase tracking-widest animate-in fade-in duration-1000">
                            Interactive Experience
                        </Badge>
                        <h1 className="text-4xl md:text-7xl font-bold font-headline text-white leading-tight">
                            Explore the <span className="text-accent">AeroDesk</span> <br /> Aviation Platform
                        </h1>
                        <p className="max-w-2xl mx-auto text-sm md:text-xl text-white/60 leading-relaxed">
                            AeroDesk connects charter operators, corporate travel teams, travel agencies and aviation partners through one intelligent aviation marketplace.
                        </p>
                        <div className="pt-4">
                            <Button size="lg" onClick={() => {
                                const element = document.getElementById('demo-roles');
                                element?.scrollIntoView({ behavior: 'smooth' });
                            }} className="h-14 px-10 bg-accent text-accent-foreground font-black uppercase tracking-[0.2em] shadow-2xl shadow-accent/20">
                                Enter Demo <ArrowRight className="ml-2 h-5 w-5" />
                            </Button>
                        </div>
                    </section>

                    {/* Feature Overview */}
                    <section className="container pb-20">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                            {features.map((f, i) => (
                                <Card key={i} className="bg-white/5 border-white/10 backdrop-blur-sm group hover:bg-white/10 transition-all border-dashed">
                                    <CardContent className="p-6 space-y-4">
                                        <div className="p-2 bg-accent/10 rounded-lg w-fit group-hover:scale-110 transition-transform">
                                            <f.icon className="h-5 w-5 text-accent" />
                                        </div>
                                        <div className="space-y-1">
                                            <h3 className="text-xs font-black uppercase text-white">{f.title}</h3>
                                            <p className="text-[10px] text-white/40 leading-relaxed uppercase font-bold">{f.description}</p>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </section>

                    {/* Role Selection */}
                    <section id="demo-roles" className="container py-20 border-t border-white/5">
                        <div className="mb-12 text-center">
                            <h2 className="text-2xl md:text-4xl font-bold text-white font-headline">Demo Access Roles</h2>
                            <p className="text-white/40 mt-2 uppercase tracking-widest text-[10px] font-black">Select a coordination profile to initialize the terminal.</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {demoRoles.map((role) => (
                                <Card key={role.id} className="bg-card border-white/5 hover:border-accent/30 transition-all group overflow-hidden">
                                    <CardHeader className="pb-2">
                                        <div className="flex items-center justify-between">
                                            <div className="p-3 bg-white/5 rounded-xl group-hover:bg-accent/10 transition-colors">
                                                <role.icon className="h-6 w-6 text-accent" />
                                            </div>
                                            <Lock className="h-4 w-4 text-white/10" />
                                        </div>
                                        <CardTitle className="text-lg font-bold text-white mt-4 group-hover:text-accent transition-colors">{role.title}</CardTitle>
                                        <CardDescription className="text-xs text-white/50 leading-relaxed">{role.description}</CardDescription>
                                    </CardHeader>
                                    <CardContent className="pt-4">
                                        <Button 
                                            onClick={() => setSelectedRole(role)}
                                            className="w-full bg-white/5 hover:bg-accent hover:text-accent-foreground text-[10px] font-black uppercase tracking-widest h-10"
                                        >
                                            Access Demo Terminal
                                        </Button>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </section>
                </main>

                <LandingFooter />
            </div>

            <DemoAccessModal 
                selectedRole={selectedRole} 
                onClose={() => setSelectedRole(null)} 
            />
        </div>
    );
}
