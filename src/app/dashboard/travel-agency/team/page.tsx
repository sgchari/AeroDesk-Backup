
'use client';

import { PageHeader } from "@/components/dashboard/shared/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useCollection, useFirestore, useMemoFirebase, updateDocumentNonBlocking, addDocumentNonBlocking } from "@/firebase";
import { useUser } from "@/hooks/use-user";
import type { User, FirmRole } from "@/lib/types";
import { collection, query, where, doc } from "firebase/firestore";
import { MoreHorizontal, Shield, Mail, Users } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { InvitePersonnelDialog } from "@/components/dashboard/travel-agency/invite-personnel-dialog";

export default function AgencyTeamManagementPage() {
    const { user: currentUser } = useUser();
    const firestore = useFirestore();
    const { toast } = useToast();

    const usersQuery = useMemoFirebase(() => {
        if (!firestore || (firestore as any)._isMock || !currentUser?.agencyId) return null;
        return query(collection(firestore, 'users'), where('agencyId', '==', currentUser.agencyId));
    }, [firestore, currentUser?.agencyId]);

    const { data: team, isLoading } = useCollection<User>(usersQuery, 'users');

    const handleRoleChange = (userId: string, newRole: FirmRole) => {
        if (!firestore) return;
        const userRef = (firestore as any)._isMock ? { path: `users/${userId}` } as any : doc(firestore, 'users', userId);
        updateDocumentNonBlocking(userRef, { firmRole: newRole });
        toast({ title: "Privileges Updated", description: `Agency staff role has been set to ${newRole}.` });
    };

    const handleStatusToggle = (userId: string, currentStatus: string) => {
        if (!firestore) return;
        const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
        const userRef = (firestore as any)._isMock ? { path: `users/${userId}` } as any : doc(firestore, 'users', userId);
        updateDocumentNonBlocking(userRef, { status: newStatus });
        toast({ title: "Account State Synchronized", description: `Access has been ${newStatus === 'active' ? 'granted' : 'revoked'}.` });
    };

    const isAdmin = currentUser?.firmRole === 'admin';

    return (
        <div className="space-y-6">
            <PageHeader 
                title="Agency Personnel Governance" 
                description={`Manage commercial staff and authorization levels for ${currentUser?.company}.`} 
            >
                {isAdmin && (
                    <InvitePersonnelDialog />
                )}
            </PageHeader>

            <Card className="bg-card border-white/5">
                <CardHeader>
                    <CardTitle>Authorized Commercial Personnel</CardTitle>
                    <CardDescription>A centralized registry of staff with access to client movements and commercial data.</CardDescription>
                </CardHeader>
                <CardContent>
                    {isLoading ? <Skeleton className="h-64 w-full" /> : (
                        <Table>
                            <TableHeader>
                                <TableRow className="border-white/5">
                                    <TableHead className="text-[10px] uppercase font-black">Personnel</TableHead>
                                    <TableHead className="text-[10px] uppercase font-black">Institutional Role</TableHead>
                                    <TableHead className="text-[10px] uppercase font-black">Clearance</TableHead>
                                    <TableHead className="text-[10px] uppercase font-black">Status</TableHead>
                                    <TableHead className="text-right pr-6"><span className="sr-only">Actions</span></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {team?.map((member) => (
                                    <TableRow key={member.id} className="border-white/5 hover:bg-white/[0.02] group">
                                        <TableCell className="py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-accent/10 rounded-full">
                                                    <Shield className="h-4 w-4 text-accent" />
                                                </div>
                                                <div className="space-y-0.5">
                                                    <p className="text-sm font-bold text-white">{member.firstName} {member.lastName}</p>
                                                    <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                                                        <Mail className="h-3 w-3" /> {member.email}
                                                    </div>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className="text-[9px] uppercase tracking-widest font-black border-white/10 bg-white/5">
                                                {member.firmRole}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground">
                                                {member.firmRole === 'admin' ? 'L3 FULL CONTROL' : 'L1 STANDARD'}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge className={member.status === 'active' ? 'bg-emerald-500/20 text-emerald-500 border-none h-5 uppercase text-[9px]' : 'bg-rose-500/20 text-rose-500 border-none h-5 uppercase text-[9px]'}>
                                                {member.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right pr-6">
                                            {isAdmin && member.id !== currentUser?.id && (
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button size="icon" variant="ghost" className="h-8 w-8 hover:bg-white/10">
                                                            <MoreHorizontal className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuLabel>Staff Governance</DropdownMenuLabel>
                                                        <DropdownMenuItem onClick={() => handleRoleChange(member.id, 'manager')}>Upgrade to Manager</DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => handleRoleChange(member.id, 'finance')}>Set Finance Lead</DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => handleRoleChange(member.id, 'operations')}>Set Commercial Lead</DropdownMenuItem>
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuItem 
                                                            className={member.status === 'active' ? 'text-rose-500' : 'text-emerald-500'}
                                                            onClick={() => handleStatusToggle(member.id, member.status)}
                                                        >
                                                            {member.status === 'active' ? 'Revoke Access' : 'Grant Access'}
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                    {(!isLoading && (!team || team.length === 0)) && (
                        <div className="text-center py-20 border-2 border-dashed rounded-lg bg-muted/5 opacity-60">
                            <Users className="mx-auto h-12 w-12 text-muted-foreground/20 mb-4" />
                            <p className="text-xs text-muted-foreground uppercase font-black tracking-[0.2em]">Registry Initializing...</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
