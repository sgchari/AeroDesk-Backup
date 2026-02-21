'use client';

import { PageHeader } from "@/components/dashboard/shared/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useCollection, useFirestore, useMemoFirebase, updateDocumentNonBlocking, deleteDocumentNonBlocking, errorEmitter, FirestorePermissionError } from "@/firebase";
import { UserRole } from "@/lib/types";
import { collection, doc, getDocs } from "firebase/firestore";
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
};

export default function UserManagementPage() {
    const firestore = useFirestore();
    const { toast } = useToast();
    const [allUsers, setAllUsers] = useState<DisplayUser[]>([]);
    const [isUsersLoading, setUsersLoading] = useState(true);
    const [userToDelete, setUserToDelete] = useState<DisplayUser | null>(null);
    const [userToEdit, setUserToEdit] = useState<DisplayUser | null>(null);

    const { data: admins, isLoading: adminsLoading } = useCollection(useMemoFirebase(() => firestore ? collection(firestore, 'platformAdmins') : null, [firestore]));
    const { data: customers, isLoading: customersLoading } = useCollection(useMemoFirebase(() => firestore ? collection(firestore, 'customers') : null, [firestore]));
    const { data: operators, isLoading: operatorsLoading } = useCollection(useMemoFirebase(() => firestore ? collection(firestore, 'operators') : null, [firestore]));
    const { data: distributors, isLoading: distributorsLoading } = useCollection(useMemoFirebase(() => firestore ? collection(firestore, 'distributors') : null, [firestore]));
    const { data: hotelPartners, isLoading: hotelPartnersLoading } = useCollection(useMemoFirebase(() => firestore ? collection(firestore, 'hotelPartners') : null, [firestore]));
    
    const { data: ctds, isLoading: ctdsLoading } = useCollection(useMemoFirebase(() => firestore ? collection(firestore, 'corporateTravelDesks') : null, [firestore]));
    const [ctdUsers, setCtdUsers] = useState<any[]>([]);
    const [ctdUsersLoading, setCtdUsersLoading] = useState(true);

    useEffect(() => {
        // This effect replaces the collectionGroup query to avoid security rule limitations.
        // It fetches users from each corporate travel desk individually.
        if (!firestore || ctds === null) {
            if (!ctdsLoading) {
                setCtdUsers([]);
                setCtdUsersLoading(false);
            }
            return;
        }

        if (ctds.length === 0) {
            setCtdUsers([]);
            setCtdUsersLoading(false);
            return;
        }

        const fetchAllCtdUsers = async () => {
            if (!firestore) return;
            setCtdUsersLoading(true);
            try {
                const allUsersPromises = ctds.map(ctd => {
                    const usersCollectionRef = collection(firestore, `corporateTravelDesks/${ctd.id}/users`);
                    return getDocs(usersCollectionRef);
                });

                const allUsersSnapshots = await Promise.all(allUsersPromises);
                const allUsersData: any[] = [];
                allUsersSnapshots.forEach(snapshot => {
                    snapshot.forEach(doc => {
                        allUsersData.push({ ...doc.data(), id: doc.id });
                    });
                });
                setCtdUsers(allUsersData);
            } catch (error: any) {
                const contextualError = new FirestorePermissionError({
                    path: 'corporateTravelDesks/[ctdId]/users', // Generic path as we don't know which one failed
                    operation: 'list'
                });
                errorEmitter.emit('permission-error', contextualError);
                console.error("Error fetching CTD users:", error);
            } finally {
                setCtdUsersLoading(false);
            }
        };

        fetchAllCtdUsers();
    }, [ctds, firestore, ctdsLoading]);


    useEffect(() => {
        const loading = adminsLoading || customersLoading || operatorsLoading || distributorsLoading || hotelPartnersLoading || ctdUsersLoading;
        setUsersLoading(loading);

        if (!loading) {
            const userMap = new Map<string, DisplayUser>();

            const addUserToMap = (user: DisplayUser) => {
                if (!userMap.has(user.id)) {
                    userMap.set(user.id, user);
                }
            };
            
            admins?.forEach(u => addUserToMap({ id: u.id, name: `${u.firstName} ${u.lastName}`, email: u.email, role: 'Admin', status: u.status, createdAt: u.createdAt }));
            customers?.forEach(u => addUserToMap({ id: u.id, name: `${u.firstName} ${u.lastName}`, email: u.email, role: 'Customer', status: u.status, createdAt: u.createdAt }));
            operators?.forEach(u => addUserToMap({ id: u.id, name: u.companyName, email: u.contactEmail, role: 'Operator', status: u.status, createdAt: u.createdAt }));
            distributors?.forEach(u => addUserToMap({ id: u.id, name: u.companyName, email: u.contactEmail, role: 'Authorized Distributor', status: u.status, createdAt: u.createdAt }));
            hotelPartners?.forEach(u => addUserToMap({ id: u.id, name: u.companyName, email: u.contactEmail, role: 'Hotel Partner', status: u.status, createdAt: u.createdAt }));
            ctdUsers?.forEach(u => addUserToMap({ id: u.id, name: `${u.firstName} ${u.lastName}`, email: u.email, role: u.role, status: u.status, createdAt: u.createdAt, ctdId: u.ctdId }));

            const normalizedUsers = Array.from(userMap.values());
            normalizedUsers.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
            
            setAllUsers(normalizedUsers);
        }

    }, [
        admins, customers, operators, distributors, hotelPartners, ctdUsers,
        adminsLoading, customersLoading, operatorsLoading, distributorsLoading, hotelPartnersLoading, ctdUsersLoading
    ]);
    
    const getCollectionPathFromRole = (user: DisplayUser): string | null => {
        const { role, ctdId } = user;
        switch (role) {
            case 'Admin': return 'platformAdmins';
            case 'Customer': return 'customers';
            case 'Operator': return 'operators';
            case 'Authorized Distributor': return 'distributors';
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
        if (!firestore) return;
        const collectionPath = getCollectionPathFromRole(user);
        if (!collectionPath) {
            toast({ title: 'Error', description: 'Invalid user role for status update.', variant: 'destructive' });
            return;
        }
        const userDocRef = doc(firestore, collectionPath, user.id);
        updateDocumentNonBlocking(userDocRef, { status });
        toast({
            title: "User Status Updated",
            description: `${user.name}'s status has been updated to ${status}.`,
        });
    };
    
    const handleDeleteUser = () => {
        if (!firestore || !userToDelete) return;

        const collectionPath = getCollectionPathFromRole(userToDelete);
        if (!collectionPath) {
            toast({ title: 'Error', description: 'Cannot delete user with invalid role.', variant: 'destructive' });
            setUserToDelete(null);
            return;
        }
        const userDocRef = doc(firestore, collectionPath, userToDelete.id);
        
        deleteDocumentNonBlocking(userDocRef);
        
        toast({
            title: "User Deleted",
            description: `${userToDelete.name} has been deleted. Note: This does not remove them from Firebase Authentication.`,
        });
        setUserToDelete(null);
    };


    return (
        <>
            <PageHeader title="User Management" description="Create, approve, and manage all platform users and their roles.">
                 <AddUserDialog />
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
                            This action cannot be undone. This will permanently delete the user&apos;s profile data
                            from Firestore. It will not remove the user from Firebase Authentication.
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
