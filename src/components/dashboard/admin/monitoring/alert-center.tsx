'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useCollection, useFirestore, updateDocumentNonBlocking } from "@/firebase";
import type { SystemAlert } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShieldCheck, AlertCircle, Clock, CheckCircle2, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";

export function AlertCenter() {
    const firestore = useFirestore();
    const { toast } = useToast();
    const [mounted, setMounted] = useState(false);
    
    useEffect(() => {
        setMounted(true);
    }, []);

    const { data: alerts, isLoading } = useCollection<SystemAlert>(null, 'alerts');

    const activeAlerts = alerts?.filter(a => a.status === 'active') || [];

    const handleResolve = (alertId: string) => {
        if (!firestore) return;
        const alertRef = { path: `alerts/${alertId}` } as any;
        updateDocumentNonBlocking(alertRef, { status: 'resolved' });
        
        toast({
            title: "Security State Updated",
            description: "Institutional alert has been successfully resolved.",
        });
    };

    return (
        <Card className="bg-card">
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle className="text-base flex items-center gap-2">
                        <ShieldCheck className="h-4 w-4 text-accent" />
                        Governance Alert Center
                    </CardTitle>
                    <CardDescription>Active security and operational anomalies.</CardDescription>
                </div>
                <Badge variant="outline" className="bg-accent/5 text-accent border-accent/20 font-black h-5">
                    {activeAlerts.length} ACTIVE
                </Badge>
            </CardHeader>
            <CardContent className="space-y-3">
                {activeAlerts.length > 0 ? activeAlerts.map(alert => (
                    <div key={alert.id} className={cn(
                        "p-4 rounded-xl border flex items-start gap-4 transition-all hover:bg-white/[0.02]",
                        alert.severity === 'high' ? "bg-rose-500/5 border-rose-500/20" : 
                        alert.severity === 'medium' ? "bg-amber-500/5 border-amber-500/20" : "bg-blue-500/5 border-blue-500/20"
                    )}>
                        <div className={cn(
                            "p-2 rounded-lg shrink-0",
                            alert.severity === 'high' ? "bg-rose-500/10 text-rose-500" : 
                            alert.severity === 'medium' ? "bg-amber-500/10 text-amber-500" : "bg-blue-500/10 text-blue-500"
                        )}>
                            <AlertCircle className="h-4 w-4" />
                        </div>
                        <div className="flex-1 space-y-1">
                            <div className="flex items-center gap-2">
                                <span className="text-[10px] font-black uppercase tracking-widest">{alert.type}</span>
                                <div className="w-1 h-1 rounded-full bg-white/20" />
                                <span className="text-[10px] font-bold text-muted-foreground flex items-center gap-1">
                                    <Clock className="h-2.5 w-2.5" /> 
                                    {mounted ? new Date(alert.timestamp).toLocaleTimeString() : '...'}
                                </span>
                            </div>
                            <p className="text-xs font-bold text-foreground leading-relaxed">{alert.message}</p>
                        </div>
                        <Button 
                            onClick={() => handleResolve(alert.id)}
                            variant="ghost" 
                            size="sm" 
                            className="h-8 text-[9px] font-black uppercase tracking-widest hover:text-emerald-500"
                        >
                            <CheckCircle2 className="h-3 w-3 mr-1.5" /> Resolve
                        </Button>
                    </div>
                )) : (
                    <div className="text-center py-12 opacity-50">
                        <Zap className="h-8 w-8 mx-auto text-muted-foreground/20 mb-3" />
                        <p className="text-xs text-muted-foreground uppercase font-black tracking-widest">Protocol Clear: No Active Anomalies</p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}