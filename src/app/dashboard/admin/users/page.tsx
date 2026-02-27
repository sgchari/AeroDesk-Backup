
'use client';

import { PageHeader } from "@/components/dashboard/shared/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useCollection, useFirestore, useMemoFirebase, updateDocumentNonBlocking, deleteDocumentNonBlocking } from "@/firebase";
import { User as AppUser, UserRole, CorporateTravelDesk } from "@/lib/types";
import { collection, doc } from "firebase/firestore";
import { MoreHorizontal, Pencil } from "lucide-react";
import React, { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { AddUserDialog } from "@/components/dashboard/admin/add-user-dialog";
import { EditUserDialog } from "@/components/dashboard/admin/edit-user-dialog";

type DisplayUser = {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    status: string;
    createdAt: string;
    ctdId?: string;
    linkedEntity?: string;
};

export default function UserManagementPage() {
    const firestore = useFirestore();
    const { toast } = useToast();
    const [allUsers, setAllUsers] = useState<DisplayUser[]>([]);
    const [isUsersLoading, setUsersLoading] = useState(true);
    const [userToDelete, setUserToDelete] = useState<DisplayUser | null>(null);
    const [userToEdit, setUserToEdit] = useState<DisplayUser | null>(null);
    
    const { data: allUsersRaw, isLoading: usersRawLoading } = useCollection<AppUser>(
        useMemoFirebase(() => firestore ? collection(firestore, 'users') : null, [firestore]), 'users'
    );
    const { data: ctds, isLoading: ctdsLoading } = useCollection<CorporateTravelDesk>(
        useMemoFirebase(() => firestore ? collection(firestore, 'corporateTravelDesks') : null, [firestore]), 'corporateTravelDesks'
    );

    useEffect(() => {
        const loading = usersRawLoading || ctdsLoading;
        setUsersLoading(loading);
        if (loading) return;

        const ctdMap = new Map(ctds?.map(ctd => [ctd.id, ctd.companyName]));

        const normalizedUsers = allUsersRaw?.map(user => {
            let name = `${user.firstName} ${user.lastName}`;
            let linkedEntity = '-';

            if (['Operator', 'Travel Agency', 'Hotel Partner', 'CTD Admin'].includes(user.role)) {
                name = user.companyName || (user.ctdId ? ctdMap.get(user.ctdId) : name) || 'N/A';
            }
            
            if (['Corporate Admin', 'Requester'].includes(user.role) && user.ctdId && ctdMap.has(user.ctdId)) {
                linkedEntity = ctdMap.get(user.ctdId) || '-';
            }

            return {
                id: user.id,
                name: name,
                email: user.email,
                role: user.role,
                status: user.status,
                createdAt: user.createdAt,
                ctdId: user.ctdId,
                linkedEntity: linkedEntity,
            };
        }).sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());

        setAllUsers(normalizedUsers || []);

    }, [allUsersRaw, ctds, usersRawLoading, ctdsLoading]);
    
    const getCollectionPathFromRole = (user: DisplayUser): string | null => {
        const { role, ctdId } = user;
        switch (role) {
            case 'Admin': return 'platformAdmins';
            case 'Customer': return 'customers';
            case 'Operator': return 'operators';
            case 'Travel Agency': return 'distributors';
            case 'Hotel Partner': return 'hotelPartners';
            case 'CTD Admin':
            case 'Corporate Admin':
            case 'Requester':
                return ctdId ? `corporateTravelDesks/${ctdId}/users` : null;
            default: return null;
        }
    };
    
    const handleUpdateStatus = (user: DisplayUser, status: string) => {
        const collectionPath = getCollectionPathFromRole(user);
        if (!collectionPath) return;
        const updatePath = ['Admin', 'Customer', 'Requester', 'Corporate Admin', 'CTD Admin'].includes(user.role) 
            ? collectionPath 
            : collectionPath.split('/')[0];

        const mockUserDocRef = { path: `${updatePath}/${user.id}` } as any;
        updateDocumentNonBlocking(mockUserDocRef, { status });
    };
    
    const handleDeleteUser = () => {
        if (!userToDelete) return;
        const collectionPath = getCollectionPathFromRole(userToDelete);
        if (!collectionPath) return;
        const deletePath = ['Admin', 'Customer', 'Requester', 'Corporate Admin', 'CTD Admin'].includes(userToDelete.role) 
            ? collectionPath 
            : collectionPath.split('/')[0];

        const mockUserDocRef = { path: `${deletePath}/${userToDelete.id}` } as any;
        deleteDocumentNonBlocking(mockUserDocRef);
        setUserToDelete(null);
    };

    return (
        <>
            <PageHeader title="User & Entity Governance" description="Create, approve, and manage all platform users and their roles.">
                 <AddUserDialog />
            </PageHeader>
            <Card className="bg-card">
                <CardHeader>
                    <CardTitle>All Platform Entities</CardTitle>
                    <CardDescription>
                        A combined list of all users and entities across all roles on the platform.
                    </CardDescription>
                </CardHeader>
                <CardContent className="px-0 sm:px-6">
                    {isUsersLoading ? <div className="p-6"><Skeleton className="h-64 w-full" /></div> : (
                        <div className="w-full overflow-x-auto">
                            <Table className="min-w-[1000px]">
                                <TableHeader>
                                    <TableRow className="border-white/5">
                                        <TableHead className="text-[10px] uppercase font-black">User / Entity</TableHead>
                                        <TableHead className="text-[10px] uppercase font-black">Role</TableHead>
                                        <TableHead className="text-[10px] uppercase font-black">Approval Status</TableHead>
                                        <TableHead className="text-[10px] uppercase font-black">Linked Entity</TableHead>
                                        <TableHead className="text-[10px] uppercase font-black">Registered On</TableHead>
                                        <TableHead className="text-right"><span className="sr-only">Actions</span></TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {allUsers.map((user: DisplayUser) => (
                                        <TableRow key={user.id} className="border-white/5 hover:bg-white/[0.02]">
                                            <TableCell className="py-4">
                                                <div className="font-bold text-sm">{user.name}</div>
                                                <div className="text-[10px] text-muted-foreground">{user.email}</div>
                                            </TableCell>
                                            <TableCell><Badge variant="outline" className="text-[9px] uppercase">{user.role}</Badge></TableCell>
                                            <TableCell><Badge variant={user.status === 'Active' || user.status === 'Approved' ? 'success' : 'destructive'} className="text-[9px] uppercase">{user.status}</Badge></TableCell>
                                            <TableCell className="text-xs text-muted-foreground">{user.linkedEntity}</TableCell>
                                            <TableCell className="text-xs">{user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}</TableCell>
                                            <TableCell className="text-right">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button size="icon" variant="ghost" className="h-8 w-8">
                                                            <MoreHorizontal className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                        <DropdownMenuItem onClick={() => setUserToEdit(user)}>
                                                            <Pencil className="mr-2 h-4 w-4" /> Edit Profile
                                                        </DropdownMenuItem>
                                                        <DropdownMenuSeparator />
                                                        {user.status === 'Suspended' ? (
                                                            <DropdownMenuItem onClick={() => handleUpdateStatus(user, 'Active')}>Activate</DropdownMenuItem>
                                                        ) : (
                                                            <DropdownMenuItem onClick={() => handleUpdateStatus(user, 'Suspended')}>Suspend</DropdownMenuItem>
                                                        )}
                                                        <DropdownMenuItem className="text-destructive" onClick={() => setUserToDelete(user)}>Delete</DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </CardContent>
            </Card>
            <EditUserDialog 
                user={userToEdit}
                open={!!userToEdit}
                onOpenChange={(open) => !open && setUserToEdit(null)}
            />
            <AlertDialog open={!!userToDelete} onOpenChange={(open) => !open && setUserToDelete(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Entity Record?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the entity's platform profile.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction className="bg-destructive" onClick={handleDeleteUser}>Delete</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
