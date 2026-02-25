'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { PageHeader } from '@/components/dashboard/shared/page-header';
import { useUser } from '@/hooks/use-user';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth, useFirestore, updateDocumentNonBlocking, useStorage } from '@/firebase';
import { doc } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { updateProfile } from 'firebase/auth';
import React, { useRef, useState } from 'react';
import { getDownloadURL, ref as storageRef, uploadBytes } from 'firebase/storage';
import { Upload } from 'lucide-react';

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
  const storage = useStorage();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [localAvatarPreview, setLocalAvatarPreview] = useState<string | null>(null);

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
      setLocalAvatarPreview(null);
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
  
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setLocalAvatarPreview(previewUrl);
    } else {
      setLocalAvatarPreview(null);
    }
  };
  
  const uploadAvatar = async (file: File): Promise<string> => {
    if (!user) throw new Error('User not authenticated for upload.');
    const avatarRef = storageRef(storage, `avatars/${user.id}/${file.name}`);
    const snapshot = await uploadBytes(avatarRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);
    return downloadURL;
  };


  const onSubmit = async (data: ProfileFormValues) => {
    if (!user || !firestore || !auth?.currentUser) {
      toast({ title: 'Error', description: 'You must be logged in to update your profile.', variant: 'destructive' });
      return;
    }

    try {
        let newAvatarUrl = data.avatar;
        const file = fileInputRef.current?.files?.[0];

        if (file) {
            newAvatarUrl = await uploadAvatar(file);
            form.setValue('avatar', newAvatarUrl);
        }

        const collectionPath = getCollectionPathForRole(user.role, (user as any).ctdId);

        if (!collectionPath) {
        toast({ title: 'Error', description: 'Cannot determine user profile collection.', variant: 'destructive' });
        return;
        }

        const userDocRef = doc(firestore, collectionPath, user.id);

        await updateProfile(auth.currentUser, {
            displayName: `${data.firstName} ${data.lastName}`,
            photoURL: newAvatarUrl,
        });

        const profileUpdateData: any = {
        firstName: data.firstName,
        lastName: data.lastName,
        avatar: newAvatarUrl || null,
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
        setLocalAvatarPreview(null);
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
        <Card className="bg-card">
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

  const avatarSrc = localAvatarPreview || form.watch('avatar');

  return (
    <>
      <PageHeader title="My Profile" description="Manage your personal and contact information." />
      <Card className="bg-card">
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
                  <AvatarImage src={avatarSrc} alt={user.firstName} />
                  <AvatarFallback>{user.firstName?.[0]}{user.lastName?.[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-2">
                    <FormLabel>Profile Picture</FormLabel>
                     <div className='flex items-center gap-2'>
                        <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()}>
                            <Upload className="mr-2 h-4 w-4" />
                            Upload Image
                        </Button>
                        {localAvatarPreview && fileInputRef.current?.files?.[0] && <span className='text-sm text-muted-foreground'>{fileInputRef.current.files[0].name}</span>}
                    </div>
                    <Input
                        type="file"
                        ref={fileInputRef}
                        className="hidden"
                        accept="image/png, image/jpeg, image/gif"
                        onChange={handleFileChange}
                    />
                     <FormDescription>Upload a new image from your device.</FormDescription>
                </div>
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
