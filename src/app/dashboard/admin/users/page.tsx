
'use client';

import { PageHeader } from "@/components/dashboard/shared/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useCollection, useFirestore, useMemoFirebase } from "@/firebase";
import { UserRole } from "@/lib/types";
import { collection } from "firebase/firestore";
import { MoreHorizontal, PlusCircle } from "lucide-react";
import React, { useState, useEffect } from "react";

// A normalized user type for the table
type DisplayUser = {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    status: string;
    createdAt: string;
};

export default function UserManagementPage() {
    const firestore = useFirestore();
    const [allUsers, setAllUsers] = useState<DisplayUser[]>([]);
    const [isUsersLoading, setUsersLoading] = useState(true);

    const { data: admins, isLoading: adminsLoading } = useCollection(useMemoFirebase(() => firestore ? collection(firestore, 'platformAdmins') : null, [firestore]));
    const { data: customers, isLoading: customersLoading } = useCollection(useMemoFirebase(() => firestore ? collection(firestore, 'customers') : null, [firestore]));
    const { data: operators, isLoading: operatorsLoading } = useCollection(useMemoFirebase(() => firestore ? collection(firestore, 'operators') : null, [firestore]));
    const { data: distributors, isLoading: distributorsLoading } = useCollection(useMemoFirebase(() => firestore ? collection(firestore, 'distributors') : null, [firestore]));
    const { data: hotelPartners, isLoading: hotelPartnersLoading } = useCollection(useMemoFirebase(() => firestore ? collection(firestore, 'hotelPartners') : null, [firestore]));
    // Not including CTD users for now to keep it simple, as it requires a collection group query.

    useEffect(() => {
        const loading = adminsLoading || customersLoading || operatorsLoading || distributorsLoading || hotelPartnersLoading;
        setUsersLoading(loading);

        if (!loading) {
            const normalizedUsers: DisplayUser[] = [];

            admins?.forEach(u => normalizedUsers.push({ id: u.id, name: `${u.firstName} ${u.lastName}`, email: u.email, role: 'Admin', status: u.status, createdAt: u.createdAt }));
            customers?.forEach(u => normalizedUsers.push({ id: u.id, name: `${u.firstName} ${u.lastName}`, email: u.email, role: 'Customer', status: u.status, createdAt: u.createdAt }));
            operators?.forEach(u => normalizedUsers.push({ id: u.id, name: u.companyName, email: u.contactEmail, role: 'Operator', status: u.status, createdAt: u.createdAt }));
            distributors?.forEach(u => normalizedUsers.push({ id: u.id, name: u.companyName, email: u.contactEmail, role: 'Authorized Distributor', status: u.status, createdAt: u.createdAt }));
            hotelPartners?.forEach(u => normalizedUsers.push({ id: u.id, name: u.companyName, email: u.contactEmail, role: 'Hotel Partner', status: u.status, createdAt: u.createdAt }));

            // Sort by creation date
            normalizedUsers.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
            
            setAllUsers(normalizedUsers);
        }

    }, [
        admins, customers, operators, distributors, hotelPartners,
        adminsLoading, customersLoading, operatorsLoading, distributorsLoading, hotelPartnersLoading
    ]);

    return (
        <>
            <PageHeader title="User Management" description="Create, approve, and manage all platform users and their roles.">
                 <Button>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add User
                </Button>
            </PageHeader>
            <Card>
                <CardHeader>
                    <CardTitle>All Platform Users</CardTitle>
                    <CardDescription>
                        A combined list of all users across all roles on the platform.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {isUsersLoading ? <Skeleton className="h-64 w-full" /> : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead>Role</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Registered On</TableHead>
                                    <TableHead>
                                        <span className="sr-only">Actions</span>
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {allUsers.map((user: DisplayUser) => (
                                    <TableRow key={user.id}>
                                        <TableCell className="font-medium">{user.name}</TableCell>
                                        <TableCell>{user.email}</TableCell>
                                        <TableCell><Badge variant="outline">{user.role}</Badge></TableCell>
                                        <TableCell><Badge variant={user.status === 'Active' || user.status === 'Approved' ? 'default' : 'secondary'}>{user.status}</Badge></TableCell>
                                        <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                                        <TableCell>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button aria-haspopup="true" size="icon" variant="ghost">
                                                        <MoreHorizontal className="h-4 w-4" />
                                                        <span className="sr-only">Toggle menu</span>
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                    <DropdownMenuItem>View Profile</DropdownMenuItem>
                                                    <DropdownMenuItem>Suspend User</DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                     {(!isUsersLoading && allUsers.length === 0) && (
                        <div className="text-center py-12 border-2 border-dashed rounded-lg">
                            <p className="text-muted-foreground">No users found on the platform.</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </>
    );
}
