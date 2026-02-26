
'use client';

import { useState, useEffect } from 'react';
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
import { useAuth, useFirestore, createDemoUser, createDemoCtd } from '@/firebase';
import { PlusCircle, Search, ShieldCheck } from 'lucide-react';
import { VERIFIED_NSOP_REGISTRY } from '@/lib/data';
import { Badge } from '@/components/ui/badge';

const registerableRoles: UserRole[] = ['Customer', 'Operator', 'Travel Agency', 'Hotel Partner', 'CTD Admin', 'Admin'];

const addUserSchema = z.object({
    name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
    email: z.string().email({ message: 'Please enter a valid email address.' }),
    role: z.enum(registerableRoles, { required_error: "You must select a user role."}),
    password: z.string().min(8, { message: 'Password must be at least 8 characters.' }),
    nsopLicense: z.string().optional(),
    companyName: z.string().optional(),
}).refine(data => data.password.length > 0, {
    message: "Password cannot be empty.",
    path: ['password'],
});

type AddUserFormValues = z.infer<typeof addUserSchema>;

export function AddUserDialog() {
  const router = useRouter();
  const { toast } = useToast();
  const firestore = useFirestore();
  const [open, setOpen] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const isDemoMode = !firestore || firestore._isMock;

  const form = useForm<AddUserFormValues>({
    resolver: zodResolver(addUserSchema),
    defaultValues: {
      name: '',
      email: '',
      password: 'password123',
      role: 'Operator',
      nsopLicense: '',
      companyName: '',
    },
  });

  const selectedRole = form.watch('role');
  const nsopInput = form.watch('nsopLicense');

  const handleLookup = () => {
    if (!nsopInput) return;
    setIsSearching(true);
    
    // Simulate API delay for looking up NSOP registry
    setTimeout(() => {
        const found = VERIFIED_NSOP_REGISTRY.find(reg => reg.nsopLicenseNumber === nsopInput);
        if (found) {
            form.setValue('companyName', found.companyName);
            toast({
                title: "Registry Data Found",
                description: `Verified: ${found.companyName} (${found.city})`,
            });
        } else {
            toast({
                variant: "destructive",
                title: "License Not Found",
                description: "This license number is not in the verified NSOP registry.",
            });
        }
        setIsSearching(false);
    }, 800);
  };
  
  const onSubmit = async (data: AddUserFormValues) => {
    if (isDemoMode) {
        let newUserId = `demo-user-${Date.now()}`;
        
        if (data.role === 'CTD Admin') {
            const ctdCompanyName = data.companyName || `${data.name.split(' ')[0]}'s Corp`;
            createDemoCtd(newUserId, ctdCompanyName);
            createDemoUser(data.name, data.email, 'Corporate Admin', newUserId);
        } else {
            const newUser = createDemoUser(data.name, data.email, data.role);
            if (data.role === 'Operator') {
                // Pre-fill operator specific data if it was looked up
                newUser.companyName = data.companyName || newUser.companyName;
                newUser.nsopLicenseNumber = data.nsopLicense;
            }
        }
        
        toast({
            title: "Demo User Created!",
            description: "The new user has been added to the simulation.",
        });
        setOpen(false);
        form.reset();
        return;
    }

    toast({ title: 'Live Mode', description: 'User creation not implemented in this path yet.', variant: 'destructive'});
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
            <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                Add User
            </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[450px]">
            <DialogHeader>
                <DialogTitle>Add New User</DialogTitle>
                <DialogDescription>
                    Create a new user account. For Operators, the system will attempt to cross-reference the NSOP registry.
                </DialogDescription>
            </DialogHeader>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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

                    {selectedRole === 'Operator' && (
                        <div className="space-y-4 p-3 border rounded-lg bg-accent/5 border-accent/20 animate-in fade-in slide-in-from-top-2">
                            <div className="flex items-center gap-2 mb-1">
                                <ShieldCheck className="h-4 w-4 text-accent" />
                                <span className="text-[10px] font-bold uppercase tracking-widest">Registry Sync</span>
                            </div>
                            <FormField
                                control={form.control}
                                name="nsopLicense"
                                render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-xs">NSOP License Number</FormLabel>
                                    <div className="flex gap-2">
                                        <FormControl>
                                            <Input placeholder="e.g. NSOP/TAJ/02" {...field} className="h-8 text-xs bg-background" />
                                        </FormControl>
                                        <Button type="button" size="sm" variant="outline" className="h-8" onClick={handleLookup} disabled={isSearching}>
                                            <Search className="h-3 w-3" />
                                        </Button>
                                    </div>
                                </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="companyName"
                                render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-xs">Company Name (Verified)</FormLabel>
                                    <FormControl>
                                        <Input {...field} className="h-8 text-xs bg-background" />
                                    </FormControl>
                                </FormItem>
                                )}
                            />
                        </div>
                    )}

                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Full Name (Executive)</FormLabel>
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
                            <FormLabel>Corporate Email</FormLabel>
                            <FormControl>
                            <Input type="email" placeholder="ananya@company.com" {...field} />
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
