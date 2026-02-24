
'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import type { UserRole } from '@/lib/types';
import { useAuth, useFirestore, setDocumentNonBlocking } from '@/firebase';
import { createUserWithEmailAndPassword, updateProfile, sendEmailVerification } from 'firebase/auth';
import { doc } from 'firebase/firestore';
import { Logo } from '@/components/logo';

const registerableRoles: UserRole[] = ['Customer', 'Operator', 'Authorized Distributor', 'Hotel Partner', 'CTD Admin', 'Admin'];

const registerSchema = z.object({
    name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
    email: z.string().email({ message: 'Please enter a valid email address.' }),
    role: z.enum(registerableRoles, { required_error: "You must select a user role."}),
    password: z.string().min(8, { message: 'Password must be at least 8 characters.' }),
    confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ['confirmPassword'],
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const { toast } = useToast();
  const auth = useAuth();
  const firestore = useFirestore();

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data: RegisterFormValues) => {
    if (!firestore) {
        toast({
            variant: "destructive",
            title: "Registration Failed",
            description: "Database service is not available.",
        });
        return;
    }
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
        const user = userCredential.user;

        await updateProfile(user, { displayName: data.name });
        // Not waiting for email verification to complete
        sendEmailVerification(user);

        const [firstName, ...lastNameParts] = data.name.split(' ');
        const lastName = lastNameParts.join(' ');
        const now = new Date().toISOString();
        
        let collectionPath = '';
        let docId = user.uid;
        let profileData: any = {};
        
        const baseData = {
            id: user.uid,
            externalAuthId: user.uid,
            email: user.email,
            status: 'Active',
            createdAt: now,
            updatedAt: now,
        };

        const personalData = {
            ...baseData,
            firstName,
            lastName: lastName || 'User',
        };

        switch (data.role) {
            case 'Admin':
                collectionPath = 'platformAdmins';
                profileData = { ...personalData, role: 'Admin' };
                break;
            case 'Customer':
                collectionPath = 'customers';
                profileData = { ...personalData, role: 'Customer', type: 'Individual' };
                break;
            case 'Operator':
                collectionPath = 'operators';
                profileData = { ...baseData, role: 'Operator', companyName: `${data.name}'s Company`, nsopLicenseNumber: 'PENDING', mouAcceptedAt: now, status: 'Pending Approval', contactPersonName: data.name, contactEmail: user.email };
                break;
            case 'Authorized Distributor':
                collectionPath = 'distributors';
                profileData = { ...baseData, role: 'Authorized Distributor', companyName: `${data.name}'s Agency`, maxSeatCapPerMonth: 100, mouAcceptedAt: now, status: 'Pending Approval', contactPersonName: data.name, contactEmail: user.email };
                break;
            case 'Hotel Partner':
                collectionPath = 'hotelPartners';
                profileData = { ...baseData, role: 'Hotel Partner', companyName: `${data.name}'s Hotel`, mouAcceptedAt: now, status: 'Pending Approval', contactPersonName: data.name, contactEmail: user.email };
                break;
            case 'CTD Admin':
                const ctdId = user.uid;
                const ctdCompanyName = `${data.name}'s Corp`;
                
                // Create the CorporateTravelDesk document
                const ctdDocRef = doc(firestore, 'corporateTravelDesks', ctdId);
                const ctdData = { id: ctdId, companyName: ctdCompanyName, adminExternalAuthId: user.uid, status: 'Active', createdAt: now, updatedAt: now };
                setDocumentNonBlocking(ctdDocRef, ctdData, { merge: true });
                
                // Set path for the CTD admin user document
                collectionPath = `corporateTravelDesks/${ctdId}/users`;
                profileData = { ...personalData, role: 'Corporate Admin', ctdId: ctdId };
                break;
        }

        // Create the full user profile document in its specific, role-based collection
        const profileDocRef = doc(firestore, collectionPath, docId);
        setDocumentNonBlocking(profileDocRef, profileData, { merge: true });
        
        toast({
            title: "Registration Successful!",
            description: "A verification email has been sent. Please check your inbox.",
        });
        router.push('/login');
    } catch (error: any) {
        toast({
            variant: "destructive",
            title: "Registration Failed",
            description: error.message,
        });
    }
  };

  return (
    <div className="w-full">
        <div
            className="fixed inset-0 z-0 bg-cover bg-center"
            style={{
                backgroundImage: "url('https://images.unsplash.com/photo-1506929562872-bb421503ef21?q=80&w=2187&auto=format&fit=crop')",
            }}
        >
            <div className="absolute inset-0 bg-black/30" />
        </div>
        <div className="relative z-10 flex min-h-screen flex-col items-center justify-center bg-transparent p-4">
            <Card className="w-full max-w-md border-white/10 bg-black/15 text-white backdrop-blur-md">
                <CardHeader className="text-center">
                    <div className="flex justify-center mb-4">
                        <Link href="/">
                            <Logo />
                        </Link>
                    </div>
                    <CardTitle className="text-white">Create an Account</CardTitle>
                    <CardDescription className="text-white/80">
                        Join the AeroDesk platform to streamline your aviation operations.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-white/90">Full Name</FormLabel>
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
                            <FormLabel className="text-white/90">Email Address</FormLabel>
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
                            <FormLabel className="text-white/90">I am a...</FormLabel>
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
                            <FormLabel className="text-white/90">Password</FormLabel>
                            <FormControl>
                            <Input type="password" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="confirmPassword"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-white/90">Confirm Password</FormLabel>
                            <FormControl>
                            <Input type="password" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                    <Button type="submit" variant="accent" className="w-full" disabled={form.formState.isSubmitting}>
                        {form.formState.isSubmitting ? 'Creating Account...' : 'Create Account'}
                    </Button>
                    </form>
                </Form>
                <div className="mt-4 text-center text-sm text-white/80">
                    Already have an account?{' '}
                    <Link href="/login" className="font-semibold text-accent underline-offset-4 hover:underline">
                    Login
                    </Link>
                </div>
                </CardContent>
            </Card>
        </div>
    </div>
  );
}
