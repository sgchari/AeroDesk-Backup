'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
    Dialog, 
    DialogContent, 
    DialogHeader, 
    DialogTitle, 
    DialogDescription,
    DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Lock, ShieldCheck, AlertCircle, Clock } from 'lucide-react';
import { useUser } from '@/hooks/use-user';
import { useToast } from '@/hooks/use-toast';
import { useCollection, addDocumentNonBlocking } from '@/firebase';
import type { DemoAccessSettings } from '@/lib/types';

interface DemoAccessModalProps {
    selectedRole: { id: string, title: string, email: string } | null;
    onClose: () => void;
}

export function DemoAccessModal({ selectedRole, onClose }: DemoAccessModalProps) {
    const router = useRouter();
    const { toast } = useToast();
    const { login } = useUser();
    const [password, setPassword] = useState('');
    const [attempts, setAttempts] = useState(0);
    const [isSubmitting, setIsLoggingIn] = useState(false);

    const { data: settings } = useCollection<DemoAccessSettings>(null, 'demoAccessSettings');

    const handleAccess = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedRole || isSubmitting) return;

        if (attempts >= 5) {
            toast({ title: "Access Blocked", description: "Too many failed attempts. Security protocol active.", variant: "destructive" });
            return;
        }

        setIsLoggingIn(true);

        // Simulation logic for password validation
        const config = settings?.[0] || { demoPassword: 'AeroDesk2026' };

        setTimeout(() => {
            if (password === config.demoPassword) {
                // Log access
                addDocumentNonBlocking({ path: 'demoAccessLogs' } as any, {
                    accessId: `DA-${Date.now().toString().slice(-6)}`,
                    roleAccessed: selectedRole.title,
                    accessTime: new Date().toISOString(),
                    ipAddress: "SIMULATED_PROXIMITY"
                });

                // Authenticate
                login(selectedRole.id); // Uses the email-based mapping in use-user
                
                toast({ title: "Terminal Synchronized", description: `Initializing ${selectedRole.title} simulation...` });
                
                // Explicit redirect based on role
                const redirectMap: Record<string, string> = {
                    'admin': '/dashboard/admin',
                    'operator': '/dashboard',
                    'agency': '/dashboard',
                    'corporate': '/dashboard/corporate/command-center',
                    'customer': '/dashboard',
                    'hotel': '/dashboard'
                };
                
                router.push(redirectMap[selectedRole.id] || '/dashboard');
                onClose();
            } else {
                setAttempts(prev => prev + 1);
                toast({ title: "Invalid Protocol", description: "Access password denied by gateway.", variant: "destructive" });
            }
            setIsLoggingIn(false);
        }, 800);
    };

    return (
        <Dialog open={!!selectedRole} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-[400px] border-accent/20 bg-slate-950 text-white">
                <DialogHeader className="space-y-3">
                    <div className="p-3 bg-accent/10 rounded-full w-fit mx-auto mb-2 animate-pulse">
                        <Lock className="h-6 w-6 text-accent" />
                    </div>
                    <DialogTitle className="text-center text-xl font-bold font-headline uppercase tracking-tight">Demo Access Required</DialogTitle>
                    <DialogDescription className="text-center text-white/60 text-xs">
                        Please enter the institutional demo access password to continue as <span className="text-accent font-black">{selectedRole?.title}</span>.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleAccess} className="py-6 space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="demo-pass" className="text-[10px] uppercase font-black tracking-widest text-white/40 px-1">Institutional Key</Label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/20" />
                            <Input 
                                id="demo-pass"
                                type="password" 
                                placeholder="••••••••" 
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="bg-white/5 border-white/10 pl-10 h-12 focus:ring-accent"
                                autoFocus
                            />
                        </div>
                        {attempts > 0 && (
                            <p className="text-[9px] text-rose-500 font-bold uppercase tracking-tighter text-right">
                                Security Attempts: {attempts} / 5
                            </p>
                        )}
                    </div>

                    <div className="p-3 rounded-lg bg-white/5 border border-white/10 flex items-start gap-3">
                        <ShieldCheck className="h-4 w-4 text-accent shrink-0 mt-0.5" />
                        <p className="text-[10px] text-white/40 leading-relaxed italic">
                            Demo accounts provide access to pre-populated simulation data. Destructive actions are restricted by protocol.
                        </p>
                    </div>

                    <DialogFooter>
                        <Button 
                            type="submit" 
                            disabled={isSubmitting || !password}
                            className="w-full h-12 bg-accent text-accent-foreground hover:bg-accent/90 font-black uppercase text-[11px] tracking-[0.2em]"
                        >
                            {isSubmitting ? "Synchronizing..." : "Establish Access Link"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
