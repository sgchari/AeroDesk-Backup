
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import type { UserRole } from '@/lib/types';
import { useAuth, useFirestore, setDocumentNonBlocking } from '@/firebase';
import { createUserWithEmailAndPassword, updateProfile, sendEmailVerification, signOut } from 'firebase/auth';
import { doc, collection } from 'firebase/firestore';
import { PlusCircle } from 'lucide-react';

const registerableRoles: UserRole[] = ['Customer', 'Operator', 'Authorized Distributor', 'Hotel Partner', 'CTD Admin', 'Admin'];

const addUserSchema = z.object({
    name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
    email: z.string().email({ message: 'Please enter a valid email address.' }),
    role: z.enum(registerableRoles, { required_error: "You must select a user role."}),
    password: z.string().min(8, { message: 'Password must be at least 8 characters.' }),
}).refine(data => data.password.length > 0, {
    message: "Password cannot be empty.",
    path: ['password'],
});

type AddUserFormValues = z.infer<typeof addUserSchema>;

export function AddUserDialog() {
  const router = useRouter();
  const { toast } = useToast();
  const auth = useAuth();
  const firestore = useFirestore();
  const [open, setOpen] = useState(false);

  const form = useForm<AddUserFormValues>({
    resolver: zodResolver(addUserSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
  });
  
  const onSubmit = async (data: AddUserFormValues) => {
    if (!firestore) {
        toast({
            variant: "destructive",
            title: "Creation Failed",
            description: "Database service is not available.",
        });
        return;
    }
    try {
        // IMPORTANT: This will sign out the admin and sign in the new user temporarily.
        const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
        const user = userCredential.user;

        await updateProfile(user, { displayName: data.name });
        sendEmailVerification(user); // Not awaited

        const [firstName, ...lastNameParts] = data.name.split(' ');
        const lastName = lastNameParts.join(' ');
        const now = new Date().toISOString();
        
        let collectionPath = '';
        let docId = user.uid;
        let userProfileData: any = {};
        let userMappingData: any = { role: data.role };
        
        const commonData = {
            id: user.uid,
            externalAuthId: user.uid,
            email: user.email,
            status: 'Active',
            createdAt: now,
            updatedAt: now,
        };

        switch (data.role) {
            case 'Admin':
                collectionPath = 'platformAdmins';
                userProfileData = { ...commonData, firstName, lastName: lastName || 'User' };
                break;
            case 'Customer':
                collectionPath = 'customers';
                userProfileData = { ...commonData, type: 'Individual', firstName, lastName: lastName || 'User' };
                break;
            case 'Operator':
                collectionPath = 'operators';
                userProfileData = { ...commonData, companyName: `${data.name}'s Company`, nsopLicenseNumber: 'PENDING', mouAcceptedAt: now, status: 'Pending Approval', contactPersonName: data.name, contactEmail: user.email };
                break;
            case 'Authorized Distributor':
                collectionPath = 'distributors';
                userProfileData = { ...commonData, companyName: `${data.name}'s Agency`, maxSeatCapPerMonth: 100, mouAcceptedAt: now, status: 'Pending Approval', contactPersonName: data.name, contactEmail: user.email };
                break;
            case 'Hotel Partner':
                collectionPath = 'hotelPartners';
                userProfileData = { ...commonData, companyName: `${data.name}'s Hotel`, mouAcceptedAt: now, status: 'Pending Approval', contactPersonName: data.name, contactEmail: user.email };
                break;
            case 'CTD Admin':
                const ctdId = user.uid;
                userMappingData.ctdId = ctdId; // Add ctdId to the mapping

                const ctdDocRef = doc(firestore, 'corporateTravelDesks', ctdId);
                const ctdData = {
                    id: ctdId,
                    companyName: `${data.name}'s Corp`,
                    adminExternalAuthId: user.uid,
                    status: 'Active',
                    createdAt: now,
                    updatedAt: now,
                };
                setDocumentNonBlocking(ctdDocRef, ctdData, { merge: true });
                
                collectionPath = `corporateTravelDesks/${ctdId}/users`;
                docId = user.uid;
                userProfileData = {
                    ...commonData,
                    ctdId: ctdId,
                    role: 'Corporate Admin',
                    firstName,
                    lastName: lastName || 'User',
                };
                break;
        }

        // Create the user role mapping document
        const userMappingDocRef = doc(firestore, 'users', user.uid);
        setDocumentNonBlocking(userMappingDocRef, userMappingData, { merge: true });

        if (collectionPath && Object.keys(userProfileData).length > 0) {
            const userDocRef = doc(firestore, collectionPath, docId);
            setDocumentNonBlocking(userDocRef, userProfileData, { merge: true });
        }
        
        toast({
            title: "User Created Successfully!",
            description: "A verification email has been sent. You will now be logged out.",
        });

        // Sign out the new user to re-authenticate the admin
        await signOut(auth);
        router.push('/login');

    } catch (error: any) {
        toast({
            variant: "destructive",
            title: "Creation Failed",
            description: error.message,
        });
        // If user creation failed, the admin might still be logged in.
        // If it succeeded but something else failed, the admin might be logged out.
        // We can try to sign out just in case to force a clean state.
        try {
            await signOut(auth);
            router.push('/login');
        } catch (e) {
            // ignore signout errors
        }
    } finally {
        setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
            <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                Add User
            </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
                <DialogTitle>Add New User</DialogTitle>
                <DialogDescription>
                    Create a new user account and assign them a role. The user will be sent a verification email.
                    <br/><strong className="text-destructive/80 mt-2 block">Note:</strong> You will be logged out after creating a user and must log back in.
                </DialogDescription>
            </DialogHeader>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Full Name</FormLabel>
                            <FormControl>
                            <Input placeholder="Ananya Sharma" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email Address</FormLabel>
                            <FormControl>
                            <Input type="email" placeholder="ananya.sharma@example.com" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="role"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>User Role</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a user type" />
                                </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {registerableRoles.map(role => (
                                        <SelectItem key={role} value={role}>{role}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Temporary Password</FormLabel>
                            <FormControl>
                            <Input type="password" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                    <DialogFooter className="pt-2">
                        <Button type="button" variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
                        <Button type="submit" disabled={form.formState.isSubmitting}>
                            {form.formState.isSubmitting ? 'Creating...' : 'Create User'}
                        </Button>
                    </DialogFooter>
                </form>
            </Form>
        </DialogContent>
    </Dialog>
  );
}
