
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/hooks/use-user';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { LayoutGrid, CheckCircle2 } from 'lucide-react';

const roles = [
    { key: 'customer', label: 'Customer / HNWI' },
    { key: 'operator', label: 'Fleet Operator' },
    { key: 'agency', label: 'Travel Agency' },
    { key: 'corporate', label: 'Corporate Travel Desk' },
    { key: 'hotel', label: 'Hotel Partner' },
    { key: 'admin', label: 'Platform Admin' },
];

export function RoleSwitcherModal() {
    const [open, setOpen] = useState(false);
    const { user, setDemoRole } = useUser();
    const router = useRouter();

    const handleSwitch = (key: string) => {
        setDemoRole(key);
        setOpen(false);
        router.push('/dashboard');
    };

    return (
        <>
            <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-4 duration-1000">
                <Button 
                    onClick={() => setOpen(true)}
                    className="bg-accent text-accent-foreground hover:bg-accent/90 font-black uppercase text-[10px] tracking-widest h-12 px-6 rounded-full shadow-2xl shadow-accent/20 border border-white/10"
                >
                    <LayoutGrid className="mr-2 h-4 w-4" />
                    Switch Role
                </Button>
            </div>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="sm:max-w-[400px]">
                    <DialogHeader>
                        <DialogTitle>Switch Simulation Context</DialogTitle>
                        <DialogDescription>
                            Instantly pivot between different AeroDesk user dashboards.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-2 py-4">
                        {roles.map((role) => {
                            const isActive = user?.role.toLowerCase().includes(role.key);
                            return (
                                <Button
                                    key={role.key}
                                    variant={isActive ? "accent" : "outline"}
                                    onClick={() => handleSwitch(role.key)}
                                    className="justify-between h-12 text-[11px] font-bold uppercase tracking-widest"
                                >
                                    {role.label}
                                    {isActive && <CheckCircle2 className="h-4 w-4" />}
                                </Button>
                            );
                        })}
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}
