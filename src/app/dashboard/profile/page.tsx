'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { PageHeader } from '@/components/dashboard/shared/page-header';
import { useUser } from '@/hooks/use-user';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth, useFirestore, updateDocumentNonBlocking } from '@/firebase';
import { doc } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { updateProfile } from 'firebase/auth';
import React from 'react';

const profileSchema = z.object({
  firstName: z.string().min(1, 'First name is required.'),
  lastName: z.string().min(1, 'Last name is required.'),
  phoneNumber: z.string().optional(),
  avatar: z.string().url('Must be a valid URL.').or(z.literal('')).optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export default function ProfilePage() {
  const { user, isLoading, error } = useUser();
  const auth = useAuth();
  const firestore = useFirestore();
  const { toast } = useToast();

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      phoneNumber: '',
      avatar: '',
    },
  });

  React.useEffect(() => {
    if (user) {
      form.reset({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        phoneNumber: user.phoneNumber || (user as any).contactNumber || '',
        avatar: user.avatar || '',
      });
    }
  }, [user, form]);

  const getCollectionPathForRole = (role: string, ctdId?: string): string | null => {
      switch (role) {
          case 'Admin': return 'platformAdmins';
          case 'Customer': return 'customers';
          case 'Operator': return 'operators';
          case 'Authorized Distributor': return 'distributors';
          case 'Hotel Partner': return 'hotelPartners';
          case 'CTD Admin':
          case 'Corporate Admin':
              return ctdId ? `corporateTravelDesks/${ctdId}/users` : null;
          default:
              return null;
      }
  };

  const onSubmit = async (data: ProfileFormValues) => {
    if (!user || !firestore || !auth.currentUser) {
      toast({ title: 'Error', description: 'You must be logged in to update your profile.', variant: 'destructive' });
      return;
    }

    const collectionPath = getCollectionPathForRole(user.role, (user as any).ctdId);

    if (!collectionPath) {
      toast({ title: 'Error', description: 'Cannot determine user profile collection.', variant: 'destructive' });
      return;
    }

    const userDocRef = doc(firestore, collectionPath, user.id);

    try {
        await updateProfile(auth.currentUser, {
            displayName: `${data.firstName} ${data.lastName}`,
            photoURL: data.avatar,
        });

        const profileUpdateData: any = {
          firstName: data.firstName,
          lastName: data.lastName,
          avatar: data.avatar || null,
          phoneNumber: data.phoneNumber || null,
          updatedAt: new Date().toISOString(),
        };

        // Handle role-specific field names
        if (['Operator', 'Distributor', 'Hotel Partner'].includes(user.role)) {
          profileUpdateData.contactPersonName = `${data.firstName} ${data.lastName}`;
          profileUpdateData.contactPhone = data.phoneNumber || null;
        }
        if (user.role === 'Customer') {
          profileUpdateData.contactNumber = data.phoneNumber || null;
        }

        updateDocumentNonBlocking(userDocRef, profileUpdateData);

        toast({
            title: 'Profile Updated',
            description: 'Your profile has been successfully updated.',
        });
    } catch (e: any) {
        toast({
            title: 'Update Failed',
            description: e.message || 'An error occurred while updating your profile.',
            variant: 'destructive',
        });
    }
  };

  if (isLoading || !user) {
    return (
      <div className="space-y-4">
        <PageHeader title="My Profile" description="Manage your personal and contact information." />
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-64" />
          </CardHeader>
          <CardContent className="space-y-6">
             <Skeleton className="h-20 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <div className="flex justify-end">
              <Skeleton className="h-10 w-24" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  if (error) {
      return <div>Error loading user profile. {error.message}</div>
  }

  return (
    <>
      <PageHeader title="My Profile" description="Manage your personal and contact information." />
      <Card>
        <CardHeader>
          <CardTitle>Profile Details</CardTitle>
          <CardDescription>
            This information will be displayed on your profile and used for communication.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="flex items-center gap-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={form.watch('avatar')} alt={user.firstName} />
                  <AvatarFallback>{user.firstName?.[0]}{user.lastName?.[0]}</AvatarFallback>
                </Avatar>
                <FormField
                  control={form.control}
                  name="avatar"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Profile Picture URL</FormLabel>
                      <FormControl>
                        <Input placeholder="https://example.com/image.png" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input placeholder="+91 98765 43210" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end">
                <Button type="submit" disabled={form.formState.isSubmitting}>
                  {form.formState.isSubmitting ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </>
  );
}
