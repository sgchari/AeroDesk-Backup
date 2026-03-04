
"use client";

import { PageHeader } from "@/components/dashboard/shared/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useUser } from "@/hooks/use-user";
import { useCollection, useFirestore, useMemoFirebase } from "@/firebase";
import { collection, query, where } from "firebase/firestore";
import { Skeleton } from "@/components/ui/skeleton";
import type { User as AppUser } from "@/lib/types";
import { PlusCircle, MoreHorizontal, User, Mail, Shield } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

export default function CTDTeamManagementPage() {
    const { user, isLoading: isUserLoading } = useUser();
    const firestore = useFirestore();

    const teamQuery = useMemoFirebase(() => {
        if (!firestore || (firestore as any)._isMock || !user?.ctdId) return null;
        return collection(firestore, 'users');
    }, [firestore, user]);

    const { data: users, isLoading: teamLoading } = useCollection<AppUser>(teamQuery, 'users');

    // Filter for users in the same company
    const teamMembers = users?.filter(u => u.company === user?.company) || [];

    const isLoading = isUserLoading || teamLoading;

    return (
        <>
            <PageHeader title="Organizational Personnel" description="Manage employee travel eligibility, roles, and authorization levels.">
                 <Button>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Personnel
                </Button>
            </PageHeader>
            
            <Card className="bg-card">
                <CardHeader>
                    <CardTitle>Authorized Travelers & Admins</CardTitle>
                    <CardDescription>A list of all personnel under the {user?.company} travel governance profile.</CardDescription>
                </CardHeader>
                <CardContent>
                    {isLoading ? <Skeleton className="h-64 w-full" /> : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>User</TableHead>
                                    <TableHead>Enterprise Role</TableHead>
                                    <TableHead>Approval Level</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right"><span className="sr-only">Actions</span></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {teamMembers.map((member) => (
                                    <TableRow key={member.id}>
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-muted/20 rounded-full">
                                                    <User className="h-4 w-4 text-accent" />
                                                </div>
                                                <div>
                                                    <div className="font-medium text-xs">{member.firstName} {member.lastName}</div>
                                                    <div className="text-[10px] text-muted-foreground flex items-center gap-1">
                                                        <Mail className="h-3 w-3" /> {member.email}
                                                    </div>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className="text-[9px] uppercase font-bold">
                                                {member.role}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                                                <Shield className="h-3 w-3 text-accent/60" />
                                                {member.role === 'CTD Admin' ? 'Level 3 (Full)' : 'Level 1 (Standard)'}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant={member.status === 'active' || member.status === 'Active' ? 'default' : 'secondary'} className="text-[9px] h-5">
                                                {member.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button size="icon" variant="ghost" className="h-8 w-8">
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuLabel>Registry Actions</DropdownMenuLabel>
                                                    <DropdownMenuItem>Edit Eligibility</DropdownMenuItem>
                                                    <DropdownMenuItem>View Journey History</DropdownMenuItem>
                                                    <DropdownMenuItem className="text-destructive">Revoke Authorization</DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>
        </>
    );
}
