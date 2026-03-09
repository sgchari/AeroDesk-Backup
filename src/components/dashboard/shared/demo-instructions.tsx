'use client';

import { Card, CardContent } from "@/components/ui/card";
import { Sparkles, ArrowRight, Plane, Armchair, ShieldCheck, Activity, Target } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useUser } from "@/hooks/use-user";

export function DemoInstructions() {
    const { user } = useUser();
    
    const scenarios = [
        { label: "Create a charter request", icon: Plane },
        { label: "Submit a jet seat booking", icon: Armchair },
        { label: "Approve charter RFQ as operator", icon: ShieldCheck },
        { label: "Explore aviation radar map", icon: Activity },
        { label: "View platform analytics", icon: Target },
    ];

    return (
        <Card className="bg-accent/5 border-accent/20 overflow-hidden relative group">
            <div className="absolute top-0 right-0 -mt-12 -mr-12 w-48 h-48 bg-accent/5 blur-[80px] rounded-full pointer-events-none" />
            <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-accent/10 rounded-lg">
                        <Sparkles className="h-5 w-5 text-accent animate-pulse" />
                    </div>
                    <div>
                        <h3 className="text-sm font-black uppercase tracking-[0.2em] text-accent">Suggested Demo Scenarios</h3>
                        <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest">Initial Audit & Workflow Exploration</p>
                    </div>
                </div>

                <div className="flex flex-wrap gap-2">
                    {scenarios.map((s, i) => (
                        <div key={i} className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/20 border border-white/5 hover:border-accent/30 transition-all cursor-default">
                            <s.icon className="h-3 w-3 text-accent/60" />
                            <span className="text-[9px] font-bold text-white/70 uppercase tracking-tighter">{s.label}</span>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
