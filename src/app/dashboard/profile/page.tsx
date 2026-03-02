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
import { useFirestore, updateDocumentNonBlocking } from '@/firebase';
import { doc } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { User, ShieldCheck, Mail, Phone, MapPin, Building } from 'lucide-react';

const profileSchema = z.object({
  firstName: z.string().min(1, 'First name is required.'),
  lastName: z.string().min(1, 'Last name is required.'),
  phoneNumber: z.string().optional(),
  address: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export default function ProfilePage() {
  const { user, isLoading } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      phoneNumber: user?.phoneNumber || '',
      address: user?.address || '',
    },
  });

  React.useEffect(() => {
    if (user) {
      form.reset({
        firstName: user.firstName,
        lastName: user.lastName,
        phoneNumber: user.phoneNumber || '',
        address: user.address || '',
      });
    }
  }, [user, form]);

  const onSubmit = async (data: ProfileFormValues) => {
    if (!user || !firestore) return;

    const userDocRef = doc(firestore, 'users', user.id);
    updateDocumentNonBlocking(userDocRef, {
      ...data,
      updatedAt: new Date().toISOString(),
    });

    toast({
      title: 'Profile Synchronized',
      description: 'Your personnel record has been updated successfully.',
    });
  };

  if (isLoading || !user) return <div className="p-8 text-center text-muted-foreground animate-pulse">Initializing Security Context...</div>;

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Personnel Registry" 
        description="Manage your individual credentials and platform access identity." 
      />
      
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-1 bg-card border-white/5">
          <CardContent className="pt-6 text-center space-y-4">
            <div className="flex justify-center">
              <Avatar className="h-32 w-32 border-4 border-accent/20">
                <AvatarImage src={user.avatar} />
                <AvatarFallback className="text-2xl bg-accent/10 text-accent">{user.firstName[0]}{user.lastName[0]}</AvatarFallback>
              </Avatar>
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">{user.firstName} {user.lastName}</h3>
              <p className="text-xs text-muted-foreground uppercase tracking-widest font-black mt-1">{user.platformRole} • {user.firmRole}</p>
            </div>
            <div className="flex flex-wrap justify-center gap-2 pt-2">
              <Badge variant="outline" className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 uppercase text-[9px] font-black h-5">Verified Profile</Badge>
              <Badge variant="outline" className="bg-accent/10 text-accent border-accent/20 uppercase text-[9px] font-black h-5">{user.status}</Badge>
            </div>
            
            <div className="pt-6 border-t border-white/5 text-left space-y-3">
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <Mail className="h-3.5 w-3.5 text-accent" />
                <span>{user.email}</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <Phone className="h-3.5 w-3.5 text-accent" />
                <span>{user.phoneNumber || 'Terminal not linked'}</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <Building className="h-3.5 w-3.5 text-accent" />
                <span>{user.company || 'Direct Client'}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2 bg-card border-white/5">
          <CardHeader>
            <CardTitle>Security & Identification</CardTitle>
            <CardDescription>Update your personal details for manifest synchronization.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[10px] uppercase font-black text-muted-foreground">First Name</FormLabel>
                        <FormControl>
                          <Input {...field} className="bg-muted/20 border-white/10" />
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
                        <FormLabel className="text-[10px] uppercase font-black text-muted-foreground">Last Name</FormLabel>
                        <FormControl>
                          <Input {...field} className="bg-muted/20 border-white/10" />
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
                      <FormLabel className="text-[10px] uppercase font-black text-muted-foreground">Mobile Terminal</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="+91 90000 00000" className="bg-muted/20 border-white/10" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[10px] uppercase font-black text-muted-foreground">Physical Address</FormLabel>
                      <FormControl>
                        <Input {...field} className="bg-muted/20 border-white/10" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="pt-4 border-t border-white/5 flex justify-end">
                  <Button type="submit" className="bg-accent text-accent-foreground font-black uppercase text-[10px] tracking-widest h-10 px-8">
                    Commit Updates
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
