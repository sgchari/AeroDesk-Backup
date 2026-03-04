
'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
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
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useFirestore, updateDocumentNonBlocking } from '@/firebase';
import { doc } from 'firebase/firestore';
import type { UserRole } from '@/lib/types';
import { FormDescription } from '@/components/ui/form';

// A normalized user type for the table from the users page
type DisplayUser = {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    status: string;
    createdAt: string;
    ctdId?: string;
};

interface EditUserDialogProps {
  user: DisplayUser | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const editUserSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
});

type EditUserFormValues = z.infer<typeof editUserSchema>;

// This helper is also in users/page.tsx. It determines the Firestore collection for a given user role.
const getCollectionPathFromRole = (user: DisplayUser): string | null => {
    const { role, ctdId } = user;
    switch (role) {
        case 'Admin': return 'platformAdmins';
        case 'Customer': return 'customers';
        case 'Operator': return 'operators';
        case 'Travel Agency': return 'distributors';
        case 'Hotel Partner': return 'hotelPartners';
        // CTD roles are nested under corporateTravelDesks
        case 'CTD Admin':
        case 'Corporate Admin':
        case 'Requester':
            return ctdId ? `corporateTravelDesks/${ctdId}/users` : null;
        default:
            return null;
    }
};

export function EditUserDialog({ user, open, onOpenChange }: EditUserDialogProps) {
  const { toast } = useToast();
  const firestore = useFirestore();

  const form = useForm<EditUserFormValues>({
    resolver: zodResolver(editUserSchema),
    defaultValues: {
      name: '',
    },
  });

  useEffect(() => {
    if (user) {
      form.reset({
        name: user.name,
      });
    }
  }, [user, form]);

  const onSubmit = async (data: EditUserFormValues) => {
    if (!firestore || !user) {
      toast({ title: 'Error', description: 'No user selected or database unavailable.', variant: 'destructive' });
      return;
    }

    const collectionPath = getCollectionPathFromRole(user);
    if (!collectionPath) {
      toast({ title: 'Error', description: 'Invalid user role for update.', variant: 'destructive' });
      return;
    }

    const userDocRef = (firestore as any)._isMock
        ? { path: `${collectionPath}/${user.id}` } as any
        : doc(firestore, collectionPath, user.id);

    const profileUpdateData: any = {
      updatedAt: new Date().toISOString(),
    };
    
    const isCompany = ['Operator', 'Travel Agency', 'Hotel Partner'].includes(user.role);

    if (isCompany) {
        profileUpdateData.companyName = data.name;
    } else {
        const [firstName, ...lastNameParts] = data.name.split(' ');
        const lastName = lastNameParts.join(' ');
        profileUpdateData.firstName = firstName;
        profileUpdateData.lastName = lastName || ' '; 
        
        if (user.role === 'Operator' || user.role === 'Travel Agency' || user.role === 'Hotel Partner') {
            profileUpdateData.contactPersonName = data.name;
        }
    }

    updateDocumentNonBlocking(userDocRef, profileUpdateData);

    toast({
      title: 'Profile Updated',
      description: `${data.name}'s profile has been successfully updated.`,
    });
    onOpenChange(false);
  };

  if (!user) return null;

  const isCompany = ['Operator', 'Travel Agency', 'Hotel Partner'].includes(user.role);
  const nameLabel = isCompany ? 'Company Name' : 'Full Name';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit User Profile</DialogTitle>
          <DialogDescription>
            Make changes to the user's profile. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{nameLabel}</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormItem>
                <FormLabel>Email</FormLabel>
                <Input value={user.email} disabled />
                <FormDescription>Email address cannot be changed.</FormDescription>
            </FormItem>

            <FormItem>
                <FormLabel>Role</FormLabel>
                <Input value={user.role} disabled />
                 <FormDescription>User role cannot be changed.</FormDescription>
            </FormItem>

            <DialogFooter className="pt-4">
                <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
                <Button type="submit" disabled={form.formState.isSubmitting}>
                    {form.formState.isSubmitting ? 'Saving...' : 'Save Changes'}
                </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
