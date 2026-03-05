
'use client';

import { useRouter } from 'next/navigation';
import { useUser } from '@/hooks/use-user';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ShieldCheck, Plane, Briefcase, Hotel, Users, User as UserIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useEffect } from 'react';

const roles = [
    { key: 'customer', label: 'Customer / HNWI', icon: UserIcon, description: 'Request charters & book empty leg seats.', color: 'text-sky-400' },
    { key: 'operator', label: 'Operator', icon: Plane, description: 'Manage fleet, quotes & positioning flights.', color: 'text-accent' },
    { key: 'agency', label: 'Travel Agency', icon: Briefcase, description: 'Manage client bookings & commissions.', color: 'text-emerald-400' },
    { key: 'corporate', label: 'Corporate Travel Desk', icon: Users, description: 'Govern employee travel & approvals.', color: 'text-sky-400' },
    { key: 'hotel', label: 'Hotel Partner', icon: Hotel, description: 'Coordinate stay requests & properties.', color: 'text-rose-400' },
    { key: 'admin', label: 'Platform Admin', icon: ShieldCheck, description: 'System governance & global audit.', color: 'text-primary' },
];

export default function RoleSelectionPage() {
    const { user, setDemoRole, isLoading } = useUser();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading && (!user || !user.demoMode)) {
            router.replace('/dashboard');
        }
    }, [user, isLoading, router]);

    const handleSelect = (key: string) => {
        setDemoRole(key);
        router.push('/dashboard');
    };

    if (isLoading) return null;

    return (
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-12rem)] space-y-8 p-4">
            <div className="text-center space-y-2">
                <h1 className="text-3xl font-black uppercase tracking-tight text-white font-headline">Select User Dashboard</h1>
                <p className="text-muted-foreground text-sm uppercase tracking-widest font-bold">Simulation context picker for super users</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full max-w-5xl">
                {roles.map((role) => (
                    <Card 
                        key={role.key} 
                        className="bg-card border-white/5 hover:border-accent/30 transition-all cursor-pointer group"
                        onClick={() => handleSelect(role.key)}
                    >
                        <CardHeader className="pb-2">
                            <div className="flex items-center justify-between mb-2">
                                <div className={`p-2 bg-white/5 rounded-lg group-hover:bg-accent/10 transition-colors`}>
                                    <role.icon className={`h-5 w-5 ${role.color}`} />
                                </div>
                                <ShieldCheck className="h-3 w-3 text-white/10 group-hover:text-accent/40" />
                            </div>
                            <CardTitle className="text-base group-hover:text-accent transition-colors">{role.label}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-xs text-muted-foreground leading-relaxed">{role.description}</p>
                            <Button variant="link" className="p-0 h-auto mt-4 text-[10px] font-black uppercase tracking-widest text-accent opacity-0 group-hover:opacity-100 transition-opacity">
                                Initialize Console
                            </Button>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
