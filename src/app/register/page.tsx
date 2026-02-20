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
import { Logo } from '@/components/logo';
import type { UserRole } from '@/lib/types';
import { useAuth, useFirestore, setDocumentNonBlocking } from '@/firebase';
import { createUserWithEmailAndPassword, updateProfile, sendEmailVerification } from 'firebase/auth';
import { doc } from 'firebase/firestore';

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
        await sendEmailVerification(user);

        const [firstName, ...lastNameParts] = data.name.split(' ');
        const lastName = lastNameParts.join(' ');
        const now = new Date().toISOString();
        
        let collectionPath = '';
        let docId = user.uid;
        let userProfileData: any = {};
        
        const commonData = {
            externalAuthId: user.uid,
            email: user.email,
            status: 'Active',
            createdAt: now,
            updatedAt: now,
        };

        switch (data.role) {
            case 'Admin':
                collectionPath = 'platformAdmins';
                userProfileData = { ...commonData, id: user.uid, firstName, lastName: lastName || 'User' };
                break;
            case 'Customer':
                collectionPath = 'customers';
                userProfileData = { ...commonData, id: user.uid, type: 'Individual' };
                break;
            case 'Operator':
                collectionPath = 'operators';
                userProfileData = { ...commonData, id: user.uid, companyName: `${data.name}'s Company`, nsopLicenseNumber: 'PENDING', mouAcceptedAt: now, status: 'Pending Approval' };
                break;
            case 'Authorized Distributor':
                collectionPath = 'distributors';
                userProfileData = { ...commonData, id: user.uid, companyName: `${data.name}'s Agency`, maxSeatCapPerMonth: 100, mouAcceptedAt: now, status: 'Pending Approval' };
                break;
            case 'Hotel Partner':
                collectionPath = 'hotelPartners';
                userProfileData = { ...commonData, id: user.uid, companyName: `${data.name}'s Hotel`, mouAcceptedAt: now, status: 'Pending Approval' };
                break;
            case 'CTD Admin':
                // For CTD Admin, we create a new CorporateTravelDesk and a CTDUser
                const ctdId = `ctd_${user.uid}`;
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
                userProfileData = {
                    id: user.uid,
                    externalAuthId: user.uid,
                    ctdId: ctdId,
                    role: 'Corporate Admin',
                    status: 'Active',
                    createdAt: now,
                    updatedAt: now,
                };
                break;
        }

        if (collectionPath && Object.keys(userProfileData).length > 0) {
            const userDocRef = doc(firestore, collectionPath, docId);
            setDocumentNonBlocking(userDocRef, userProfileData, { merge: true });
        }
        
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
    <div className="flex min-h-screen flex-col items-center justify-center bg-muted/40 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <Link href="/">
                <Logo />
              </Link>
            </div>
          <CardTitle>Create an Account</CardTitle>
          <CardDescription>
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
                    <FormLabel>I am a...</FormLabel>
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
                    <FormLabel>Password</FormLabel>
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
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? 'Creating Account...' : 'Create Account'}
              </Button>
            </form>
          </Form>
          <div className="mt-4 text-center text-sm">
            Already have an account?{' '}
            <Link href="/login" className="underline">
              Login
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
