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
import { Upload, ShieldCheck, FileText, Globe } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { validateGSTIN } from '@/lib/tax-utils';
import { Badge } from '@/components/ui/badge';

const profileSchema = z.object({
  firstName: z.string().min(1, 'First name is required.'),
  lastName: z.string().min(1, 'Last name is required.'),
  phoneNumber: z.string().optional(),
  avatar: z.string().url('Must be a valid URL.').or(z.literal('')).optional(),
});

const gstSchema = z.object({
  legalEntityName: z.string().min(3, 'Legal name is required.'),
  gstin: z.string().refine(val => validateGSTIN(val), { message: "Invalid GSTIN format." }),
  gstRegisteredAddress: z.string().min(10, 'Full address is required.'),
});

type ProfileFormValues = z.infer<typeof profileSchema>;
type GstFormValues = z.infer<typeof gstSchema>;

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

  const gstForm = useForm<GstFormValues>({
    resolver: zodResolver(gstSchema),
    defaultValues: {
      legalEntityName: '',
      gstin: '',
      gstRegisteredAddress: '',
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
      gstForm.reset({
        legalEntityName: user.legalEntityName || '',
        gstin: user.gstin || '',
        gstRegisteredAddress: user.gstRegisteredAddress || '',
      });
      setLocalAvatarPreview(null);
    }
  }, [user, form, gstForm]);

  const getCollectionPathForRole = (role: string, ctdId?: string): string | null => {
      switch (role) {
          case 'Admin': return 'platformAdmins';
          case 'Customer': return 'customers';
          case 'Operator': return 'operators';
          case 'Travel Agency': return 'distributors';
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

        if (['Operator', 'Travel Agency', 'Hotel Partner'].includes(user.role)) {
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

  const onGstSubmit = async (data: GstFormValues) => {
    if (!user || !firestore) return;

    const collectionPath = getCollectionPathForRole(user.role, (user as any).ctdId);
    if (!collectionPath) return;

    const userDocRef = doc(firestore, collectionPath, user.id);
    
    updateDocumentNonBlocking(userDocRef, {
        ...data,
        stateCode: data.gstin.slice(0, 2),
        gstVerificationStatus: 'pending',
        updatedAt: new Date().toISOString(),
    });

    toast({
        title: 'Tax Profile Submitted',
        description: 'Your GST details are now under institutional review.',
    });
  };

  if (isLoading || !user) {
    return (
      <div className="space-y-4">
        <PageHeader title="Profile Settings" description="Manage your institutional presence." />
        <Card className="bg-card"><CardContent className="p-12"><Skeleton className="h-64 w-full" /></CardContent></Card>
      </div>
    );
  }

  const avatarSrc = localAvatarPreview || form.watch('avatar');
  const showGst = ['Operator', 'Travel Agency', 'CTD Admin', 'Corporate Admin'].includes(user.role);

  return (
    <div className="space-y-6">
      <PageHeader title="Registry & Profile" description="Manage your personal credentials and institutional tax identity." />
      
      <Tabs defaultValue="account" className="w-full">
        <TabsList className="bg-muted/20 border border-white/5 mb-6 p-1">
            <TabsTrigger value="account" className="gap-2 px-6">Account Details</TabsTrigger>
            {showGst && <TabsTrigger value="gst" className="gap-2 px-6">GST & Compliance</TabsTrigger>}
        </TabsList>

        <TabsContent value="account">
            <Card className="bg-card">
                <CardHeader>
                <CardTitle>Personnel Registry</CardTitle>
                <CardDescription>
                    Information used for manifest synchronization and institutional correspondence.
                </CardDescription>
                </CardHeader>
                <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="flex items-center gap-6 p-4 rounded-xl bg-white/[0.02] border border-white/5">
                        <Avatar className="h-24 w-24 border-2 border-accent/20">
                        <AvatarImage src={avatarSrc} alt={user.firstName} />
                        <AvatarFallback className="text-xl">{user.firstName?.[0]}{user.lastName?.[0]}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 space-y-3">
                            <Label className="text-[10px] uppercase font-black tracking-widest text-accent">Institutional Avatar</Label>
                            <div className='flex items-center gap-3'>
                                <Button type="button" variant="outline" size="sm" onClick={() => fileInputRef.current?.click()} className="h-9 border-white/10 hover:bg-white/10 text-xs">
                                    <Upload className="mr-2 h-3.5 w-3.5" />
                                    Replace Asset
                                </Button>
                                {localAvatarPreview && <span className='text-[10px] text-accent animate-pulse uppercase font-bold'>Awaiting Sync</span>}
                            </div>
                            <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField control={form.control} name="firstName" render={({ field }) => (
                            <FormItem><FormLabel className="text-xs uppercase font-bold">First Name</FormLabel><FormControl><Input {...field} className="bg-muted/20" /></FormControl><FormMessage /></FormItem>
                        )} />
                        <FormField control={form.control} name="lastName" render={({ field }) => (
                            <FormItem><FormLabel className="text-xs uppercase font-bold">Last Name</FormLabel><FormControl><Input {...field} className="bg-muted/20" /></FormControl><FormMessage /></FormItem>
                        )} />
                    </div>

                    <FormField control={form.control} name="phoneNumber" render={({ field }) => (
                        <FormItem><FormLabel className="text-xs uppercase font-bold">Mobile Terminal</FormLabel><FormControl><Input placeholder="+91 98765 43210" {...field} className="bg-muted/20" /></FormControl><FormMessage /></FormItem>
                    )} />

                    <div className="flex justify-end pt-4 border-t border-white/5">
                        <Button type="submit" disabled={form.formState.isSubmitting} className="bg-accent text-accent-foreground font-black uppercase text-[10px] tracking-widest h-10 px-8">
                        {form.formState.isSubmitting ? 'Synchronizing...' : 'Save Registry Updates'}
                        </Button>
                    </div>
                    </form>
                </Form>
                </CardContent>
            </Card>
        </TabsContent>

        {showGst && (
            <TabsContent value="gst">
                <div className="grid gap-6 lg:grid-cols-3">
                    <Card className="lg:col-span-2 bg-card">
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle>Tax Identity (India GST)</CardTitle>
                                    <CardDescription>Legal entity details for B2B tax invoicing.</CardDescription>
                                </div>
                                {user.gstVerificationStatus && (
                                    <Badge variant={user.gstVerificationStatus === 'verified' ? 'default' : 'outline'} className={cn(
                                        "h-6 uppercase text-[9px] font-black tracking-widest",
                                        user.gstVerificationStatus === 'verified' ? 'bg-green-600' : 'text-amber-500 border-amber-500/30'
                                    )}>
                                        {user.gstVerificationStatus}
                                    </Badge>
                                )}
                            </div>
                        </CardHeader>
                        <CardContent>
                            <Form {...gstForm}>
                                <form onSubmit={gstForm.handleSubmit(onGstSubmit)} className="space-y-6">
                                    <FormField control={gstForm.control} name="legalEntityName" render={({ field }) => (
                                        <FormItem><FormLabel className="text-xs uppercase font-bold">Legal Entity Name</FormLabel><FormControl><Input placeholder="e.g. Stark Aviation Pvt Ltd" {...field} className="bg-muted/20" disabled={user.gstVerificationStatus === 'verified'} /></FormControl><FormMessage /></FormItem>
                                    )} />
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <FormField control={gstForm.control} name="gstin" render={({ field }) => (
                                            <FormItem><FormLabel className="text-xs uppercase font-bold">GSTIN</FormLabel><FormControl><Input placeholder="15-char alpha-numeric" {...field} className="bg-muted/20 font-code" disabled={user.gstVerificationStatus === 'verified'} /></FormControl><FormMessage /></FormItem>
                                        )} />
                                        <div className="space-y-2">
                                            <Label className="text-xs uppercase font-bold">State Jurisdiction</Label>
                                            <div className="h-10 px-3 flex items-center bg-muted/10 border border-white/5 rounded-md text-muted-foreground text-sm font-medium">
                                                {user.stateCode ? `Code ${user.stateCode}` : "Detected from GSTIN"}
                                            </div>
                                        </div>
                                    </div>
                                    <FormField control={gstForm.control} name="gstRegisteredAddress" render={({ field }) => (
                                        <FormItem><FormLabel className="text-xs uppercase font-bold">Registered Office Address</FormLabel><FormControl><Input {...field} className="bg-muted/20" disabled={user.gstVerificationStatus === 'verified'} /></FormControl><FormMessage /></FormItem>
                                    )} />

                                    <div className="pt-4 border-t border-white/5">
                                        <Label className="text-xs uppercase font-bold block mb-3">Supporting Evidence</Label>
                                        <Button type="button" variant="outline" className="w-full h-12 border-dashed border-white/10 gap-3 group">
                                            <FileText className="h-5 w-5 text-accent" />
                                            <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground group-hover:text-accent">Upload GST Registration Certificate (PDF)</span>
                                        </Button>
                                    </div>

                                    <div className="flex justify-end pt-4">
                                        <Button type="submit" disabled={user.gstVerificationStatus === 'verified'} className="bg-accent text-accent-foreground font-black uppercase text-[10px] tracking-widest h-10 px-8">
                                            Submit for Verification
                                        </Button>
                                    </div>
                                </form>
                            </Form>
                        </CardContent>
                    </Card>

                    <div className="space-y-6">
                        <Card className="bg-primary/5 border-primary/20">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm flex items-center gap-2">
                                    <ShieldCheck className="h-4 w-4 text-primary" />
                                    Invoicing Protocol
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <p className="text-[11px] text-muted-foreground leading-relaxed italic">
                                    "Verified GST profiles enable <span className="text-white font-bold">B2B Tax Invoicing</span>. Unverified entities default to B2C simplified receipts without ITC benefits."
                                </p>
                                <div className="p-3 rounded-lg bg-black/40 border border-white/5 space-y-2">
                                    <div className="flex items-center gap-2">
                                        <Globe className="h-3 w-3 text-accent" />
                                        <span className="text-[9px] font-black uppercase tracking-widest">Supply Region</span>
                                    </div>
                                    <p className="text-[10px] font-medium">Domestic (India) - Cross-Border Sync Active</p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </TabsContent>
        )}
      </Tabs>
    </div>
  );
}
