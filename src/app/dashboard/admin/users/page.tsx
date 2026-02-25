
'use client';

import { PageHeader } from "@/components/dashboard/shared/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useCollection, useFirestore, useMemoFirebase, updateDocumentNonBlocking, deleteDocumentNonBlocking } from "@/firebase";
import { User as AppUser, UserRole, CorporateTravelDesk } from "@/lib/types"; // Renamed User to AppUser to avoid conflicts
import { collection, doc } from "firebase/firestore";
import { MoreHorizontal, Pencil } from "lucide-react";
import React, { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { AddUserDialog } from "@/components/dashboard/admin/add-user-dialog";
import { EditUserDialog } from "@/components/dashboard/admin/edit-user-dialog";

// A normalized user type for the table
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
    
    // Efficiently fetch all users and corporate desks in parallel
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

        // Create a lookup map for corporate desk names for efficiency
        const ctdMap = new Map(ctds?.map(ctd => [ctd.id, ctd.companyName]));

        const normalizedUsers = allUsersRaw?.map(user => {
            let name = `${user.firstName} ${user.lastName}`;
            let linkedEntity = '-';

            // For entity-based roles, the main name is the company name.
            if (['Operator', 'Travel Agency', 'Hotel Partner', 'CTD Admin'].includes(user.role)) {
                name = user.companyName || (user.ctdId ? ctdMap.get(user.ctdId) : name) || 'N/A';
            }
            
            // For other corporate users, their name is primary, and company is the linked entity.
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
            // All other roles are assumed to be CTD users.
            case 'CTD Admin':
            case 'Corporate Admin':
            case 'Requester':
                return ctdId ? `corporateTravelDesks/${ctdId}/users` : null;
            default:
                const unhandledRole: never = role;
                console.warn(`Unhandled user role for collection path: ${unhandledRole}`);
                return null;
        }
    };
    
    const handleUpdateStatus = (user: DisplayUser, status: string) => {
        const collectionPath = getCollectionPathFromRole(user);
        if (!collectionPath) {
            toast({ title: 'Error', description: 'Invalid user role for status update.', variant: 'destructive' });
            return;
        }
        // In demo mode, we need to use a path the mock store understands for updates.
        // For roles like 'Operator', the collection is 'operators', not 'users'.
        const updatePath = ['Admin', 'Customer', 'Requester', 'Corporate Admin', 'CTD Admin'].includes(user.role) 
            ? collectionPath 
            : collectionPath.split('/')[0]; // e.g., 'operators' from 'operators/{id}/...'

        const mockUserDocRef = { path: `${updatePath}/${user.id}` } as any;
        updateDocumentNonBlocking(mockUserDocRef, { status });
    };
    
    const handleDeleteUser = () => {
        if (!userToDelete) return;

        const collectionPath = getCollectionPathFromRole(userToDelete);
        if (!collectionPath) {
            toast({ title: 'Error', description: 'Cannot delete user with invalid role.', variant: 'destructive' });
            setUserToDelete(null);
            return;
        }
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
                <CardContent>
                    {isUsersLoading ? <Skeleton className="h-64 w-full" /> : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>User / Entity</TableHead>
                                    <TableHead>Role</TableHead>
                                    <TableHead>Approval Status</TableHead>
                                    <TableHead>Linked Entity</TableHead>
                                    <TableHead>Registered On</TableHead>
                                    <TableHead>
                                        <span className="sr-only">Actions</span>
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {allUsers.map((user: DisplayUser) => (
                                    <TableRow key={user.id}>
                                        <TableCell>
                                            <div className="font-medium">{user.name}</div>
                                            <div className="text-xs text-muted-foreground">{user.email}</div>
                                        </TableCell>
                                        <TableCell><Badge variant="outline">{user.role}</Badge></TableCell>
                                        <TableCell><Badge variant={user.status === 'Active' || user.status === 'Approved' ? 'success' : user.status === 'Suspended' ? 'destructive' : 'warning'}>{user.status}</Badge></TableCell>
                                        <TableCell className="text-sm text-muted-foreground">{user.linkedEntity}</TableCell>
                                        <TableCell>{user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}</TableCell>
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
                                                    <DropdownMenuItem onClick={() => setUserToEdit(user)}>
                                                        <Pencil className="mr-2 h-4 w-4" />
                                                        Edit Profile
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    {user.status === 'Suspended' ? (
                                                        <DropdownMenuItem onClick={() => handleUpdateStatus(user, 'Active')}>
                                                            Re-activate User
                                                        </DropdownMenuItem>
                                                    ) : (
                                                        <DropdownMenuItem onClick={() => handleUpdateStatus(user, 'Suspended')}>
                                                            Suspend User
                                                        </DropdownMenuItem>
                                                    )}
                                                    <DropdownMenuItem className="text-destructive" onClick={() => setUserToDelete(user)}>
                                                        Delete User
                                                    </DropdownMenuItem>
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
            <EditUserDialog 
                user={userToEdit}
                open={!!userToEdit}
                onOpenChange={(open) => !open && setUserToEdit(null)}
            />
            <AlertDialog open={!!userToDelete} onOpenChange={(open) => !open && setUserToDelete(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the user's profile data
                            from the database. It will not remove the user from Firebase Authentication.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => setUserToDelete(null)}>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            className="bg-destructive hover:bg-destructive/90"
                            onClick={handleDeleteUser}
                        >
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
