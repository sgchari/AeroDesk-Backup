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
import { addDocumentNonBlocking, useFirestore } from '@/firebase';
import { collection } from 'firebase/firestore';
import { UserPlus, ShieldCheck } from 'lucide-react';

const userSchema = z.object({
  name: z.string().min(2, 'Required'),
  email: z.string().email('Invalid email'),
  phone: z.string().min(10, 'Required'),
  role: z.string().min(1, 'Role required'),
});

type UserFormValues = z.infer<typeof userSchema>;

interface AddOrgUserDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    orgId: string;
    orgType: 'operator' | 'agency' | 'corporate' | 'hotel';
}

export function AddOrgUserDialog({ open, onOpenChange, orgId, orgType }: AddOrgUserDialogProps) {
  const { toast } = useToast();
  const firestore = useFirestore();

  const form = useForm<UserFormValues>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      role: '',
    },
  });

  const onSubmit = (data: UserFormValues) => {
    if (!firestore || orgId === 'NONE') return;

    const usersRef = (firestore as any)._isMock
        ? { path: 'organizationUsers' } as any
        : collection(firestore, 'organizationUsers');
    
    addDocumentNonBlocking(usersRef, {
        ...data,
        userId: `USR-${Date.now().toString().slice(-4)}`,
        organizationId: orgId,
        organizationType: orgType,
        status: 'ACTIVE',
        createdAt: new Date().toISOString(),
    });

    toast({
      title: 'Personnel Synchronized',
      description: `${data.name} has been added to the firm registry.`,
    });
    
    onOpenChange(false);
    form.reset();
  };

  const roles = {
    operator: ['Admin', 'Fleet Manager', 'Operations Controller', 'Finance Manager', 'Crew Manager'],
    agency: ['Agency Admin', 'Booking Agent', 'Accounts Manager'],
    corporate: ['Corporate Admin', 'Travel Manager', 'Finance Approver'],
    hotel: ['Hotel Admin', 'Property Manager', 'Front Desk Lead', 'Finance Lead']
  }[orgType] || [];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[450px]">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-2">
            <ShieldCheck className="h-5 w-5 text-accent" />
            <DialogTitle>Register Firm Personnel</DialogTitle>
          </div>
          <DialogDescription>
            Grant platform coordination access to a new team member.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel className="text-[10px] uppercase font-black">Full Name</FormLabel>
                    <FormControl><Input placeholder="e.g. Rajesh Kumar" {...field} className="bg-muted/20" /></FormControl>
                    <FormMessage />
                    </FormItem>
                )}
            />

            <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel className="text-[10px] uppercase font-black">Email</FormLabel>
                    <FormControl><Input type="email" placeholder="name@firm.aero" {...field} className="bg-muted/20" /></FormControl>
                    <FormMessage />
                    </FormItem>
                )}
            />

            <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel className="text-[10px] uppercase font-black">Mobile</FormLabel>
                    <FormControl><Input placeholder="+91 90000 00000" {...field} className="bg-muted/20" /></FormControl>
                    <FormMessage />
                    </FormItem>
                )}
            />

            <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel className="text-[10px] uppercase font-black">Designated Role</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                        <SelectTrigger className="bg-muted/20">
                            <SelectValue placeholder="Select Institutional Role" />
                        </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            {roles.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}
                        </SelectContent>
                    </Select>
                    <FormDescription className="text-[10px]">Access levels are dictated by role classification.</FormDescription>
                    </FormItem>
                )}
            />

            <DialogFooter className="pt-6">
                <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
                <Button type="submit" className="bg-accent text-accent-foreground font-black uppercase text-[10px] tracking-widest px-8">Activate Access</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
