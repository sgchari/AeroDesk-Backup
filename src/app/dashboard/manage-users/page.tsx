'use client';

import { PageHeader } from "@/components/dashboard/shared/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useCollection, useFirestore, useMemoFirebase } from "@/firebase";
import { useUser } from "@/hooks/use-user";
import type { OrganizationUser } from "@/lib/types";
import { collection, query, where } from "firebase/firestore";
import { MoreHorizontal, PlusCircle, UserCog, Mail, Phone, ShieldCheck } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { AddOrgUserDialog } from "@/components/dashboard/shared/add-org-user-dialog";
import { useState } from "react";

export default function ManageUsersPage() {
    const { user } = useUser();
    const firestore = useFirestore();
    const [isAddOpen, setIsAddOpen] = useState(false);

    const orgId = user?.operatorId || user?.agencyId || user?.corporateId || user?.hotelPartnerId || 'NONE';
    const orgType = user?.operatorId ? 'operator' : 
                    user?.agencyId ? 'agency' : 
                    user?.corporateId ? 'corporate' : 
                    user?.hotelPartnerId ? 'hotel' : 'corporate';

    const usersQuery = useMemoFirebase(() => {
        if (!firestore || (firestore as any)._isMock || orgId === 'NONE') return null;
        return query(collection(firestore, 'organizationUsers'), where('organizationId', '==', orgId));
    }, [firestore, orgId]);

    const { data: team, isLoading } = useCollection<OrganizationUser>(usersQuery, 'organizationUsers');

    return (
        <div className="space-y-6">
            <PageHeader 
                title="Personnel Governance" 
                description={`Manage authorized users and coordination roles for ${user?.company || 'Organization'}.`} 
            >
                <Button onClick={() => setIsAddOpen(true)} className="bg-accent text-accent-foreground hover:bg-accent/90">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Register Personnel
                </Button>
            </PageHeader>

            <Card className="bg-card">
                <CardHeader>
                    <CardTitle>Team Directory</CardTitle>
                    <CardDescription>A centralized log of all users with institutional access credentials.</CardDescription>
                </CardHeader>
                <CardContent>
                    {isLoading ? <Skeleton className="h-64 w-full" /> : (
                        <Table>
                            <TableHeader>
                                <TableRow className="border-white/5">
                                    <TableHead className="text-[10px] uppercase font-black">Member</TableHead>
                                    <TableHead className="text-[10px] uppercase font-black">Institutional Role</TableHead>
                                    <TableHead className="text-[10px] uppercase font-black">Contact</TableHead>
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
                                                    <UserCog className="h-4 w-4 text-accent" />
                                                </div>
                                                <div className="space-y-0.5">
                                                    <p className="text-sm font-bold text-white">{member.name}</p>
                                                    <p className="text-[10px] text-muted-foreground font-code uppercase tracking-tighter">{member.userId}</p>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className="text-[9px] uppercase tracking-widest font-black border-white/10 bg-white/5">
                                                {member.role}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <div className="space-y-1">
                                                <p className="text-[10px] text-muted-foreground flex items-center gap-1.5"><Mail className="h-3 w-3" /> {member.email}</p>
                                                <p className="text-[10px] text-muted-foreground flex items-center gap-1.5"><Phone className="h-3 w-3" /> {member.phone}</p>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge className={member.status === 'ACTIVE' ? 'bg-emerald-500/20 text-emerald-500 border-none' : 'bg-rose-500/20 text-rose-500 border-none'}>
                                                {member.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right pr-6">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button size="icon" variant="ghost" className="h-8 w-8 hover:bg-white/10">
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuLabel>Account Control</DropdownMenuLabel>
                                                    <DropdownMenuItem>Edit Permissions</DropdownMenuItem>
                                                    <DropdownMenuItem>Reset Security Protocol</DropdownMenuItem>
                                                    <DropdownMenuItem className="text-destructive">Revoke Access</DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                    {(!isLoading && (!team || team.length === 0)) && (
                        <div className="text-center py-20 border-2 border-dashed rounded-lg bg-muted/5 opacity-60">
                            <ShieldCheck className="mx-auto h-12 w-12 text-muted-foreground/20 mb-4" />
                            <p className="text-xs text-muted-foreground uppercase font-black tracking-[0.2em]">Registry Initializing...</p>
                        </div>
                    )}
                </CardContent>
            </Card>

            <AddOrgUserDialog 
                open={isAddOpen} 
                onOpenChange={setIsAddOpen} 
                orgId={orgId}
                orgType={orgType}
            />
        </div>
    );
}
