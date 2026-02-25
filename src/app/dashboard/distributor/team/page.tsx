
'use client';

import { PageHeader } from "@/components/dashboard/shared/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useCollection, useFirestore, useMemoFirebase } from "@/firebase";
import { useUser } from "@/hooks/use-user";
import { User } from "@/lib/types";
import { collection } from "firebase/firestore";
import { MoreHorizontal, PlusCircle } from "lucide-react";
import React from 'react';

export default function TeamManagementPage() {
    const firestore = useFirestore();
    const { user: currentUser, isLoading: isUserLoading } = useUser();

    // Fetch all distributors to find team members
    const { data: allDistributors, isLoading: distributorsLoading } = useCollection<User>(
        useMemoFirebase(() => firestore ? collection(firestore, 'distributors') : null, [firestore]),
        'distributors'
    );

    const isLoading = isUserLoading || distributorsLoading;
    
    // Filter for team members of the current distributor's company
    const teamMembers = React.useMemo(() => {
        if (!currentUser || !allDistributors) return [];
        return allDistributors.filter(distributor => distributor.company === currentUser.company);
    }, [currentUser, allDistributors]);


    return (
        <>
            <PageHeader title="Team Management" description="Manage your team members and their access.">
                 <Button disabled>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Team Member
                </Button>
            </PageHeader>
            <Card className="bg-background">
                <CardHeader>
                    <CardTitle>Your Team</CardTitle>
                    <CardDescription>
                        A list of all members associated with your distributorship.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {isLoading ? <Skeleton className="h-64 w-full" /> : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>
                                        <span className="sr-only">Actions</span>
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {teamMembers.map((member) => (
                                    <TableRow key={member.id}>
                                        <TableCell className="font-medium">{`${member.firstName} ${member.lastName}`}</TableCell>
                                        <TableCell>{member.email}</TableCell>
                                        <TableCell><Badge variant={member.status === 'Active' ? 'default' : 'secondary'}>{member.status}</Badge></TableCell>
                                        <TableCell>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button aria-haspopup="true" size="icon" variant="ghost" disabled={member.id === currentUser?.id}>
                                                        <MoreHorizontal className="h-4 w-4" />
                                                        <span className="sr-only">Toggle menu</span>
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                    <DropdownMenuItem disabled>Edit Profile</DropdownMenuItem>
                                                    <DropdownMenuItem disabled className="text-destructive">Remove from Team</DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                     {(!isLoading && (!teamMembers || teamMembers.length === 0)) && (
                        <div className="text-center py-12 border-2 border-dashed rounded-lg">
                            <p className="text-muted-foreground">No team members found.</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </>
    );
}
