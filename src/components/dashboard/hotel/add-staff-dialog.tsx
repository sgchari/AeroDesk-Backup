'use client';

import { useState } from 'react';
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
  FormDescription,
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
import { useUser } from '@/hooks/use-user';
import { addDocumentNonBlocking, useFirestore } from '@/firebase';
import { collection } from 'firebase/firestore';
import { UserPlus, ShieldCheck } from 'lucide-react';

const staffSchema = z.object({
  firstName: z.string().min(2, 'Required'),
  lastName: z.string().min(2, 'Required'),
  email: z.string().email('Invalid email'),
  firmRole: z.enum(['admin', 'manager', 'operations', 'viewer'] as const),
});

type StaffFormValues = z.infer<typeof staffSchema>;

export function AddStaffDialog() {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const { user: currentUser } = useUser();
  const firestore = useFirestore();

  const form = useForm<StaffFormValues>({
    resolver: zodResolver(staffSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      firmRole: 'operations',
    },
  });

  const onSubmit = (data: StaffFormValues) => {
    if (!currentUser || !currentUser.hotelPartnerId) return;

    const usersRef = collection(firestore as any, 'users');
    
    const newUser = {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        firmRole: data.firmRole,
        role: 'Hotel Staff',
        platformRole: 'hotel',
        hotelPartnerId: currentUser.hotelPartnerId,
        company: currentUser.company,
        status: 'active',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    };

    addDocumentNonBlocking(usersRef as any, newUser);

    toast({
      title: 'Personnel Registered',
      description: `${data.firstName} has been added to the hospitality management team.`,
    });
    
    setOpen(false);
    form.reset();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-accent text-accent-foreground hover:bg-accent/90">
            <UserPlus className="mr-2 h-4 w-4" />
            Add Staff Member
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[450px]">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-2">
            <ShieldCheck className="h-5 w-5 text-accent" />
            <DialogTitle>Register Hospitality Personnel</DialogTitle>
          </div>
          <DialogDescription>
            Grant platform access to a new staff member for property coordination.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
                <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                        <Input placeholder="e.g. Rahul" {...field} />
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
                        <Input placeholder="e.g. Kapoor" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
            </div>

            <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Work Email</FormLabel>
                    <FormControl>
                        <Input type="email" placeholder="name@hotelgroup.com" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
            />

            <FormField
                control={form.control}
                name="firmRole"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Institutional Role</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                        <SelectTrigger>
                            <SelectValue />
                        </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            <SelectItem value="admin">Property Admin (L3)</SelectItem>
                            <SelectItem value="manager">Hotel Manager (L2)</SelectItem>
                            <SelectItem value="operations">Front Desk / Ops (L1)</SelectItem>
                            <SelectItem value="viewer">Viewer (Read-only)</SelectItem>
                        </SelectContent>
                    </Select>
                    <FormDescription className="text-[10px]">
                        Authority level dictates access to inventory and stay data.
                    </FormDescription>
                    </FormItem>
                )}
            />

            <DialogFooter className="pt-6">
                <Button type="button" variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
                <Button type="submit" className="bg-accent text-accent-foreground hover:bg-accent/90 font-bold">Activate Account</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
