
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
import { useAuth, useFirestore, setDocumentNonBlocking, addDocumentNonBlocking } from '@/firebase';
import { createUserWithEmailAndPassword, updateProfile, sendEmailVerification } from 'firebase/auth';
import { doc, collection } from 'firebase/firestore';
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
        let specificProfileData: any = {};
        
        // This is the denormalized user data that will be stored in the top-level /users collection.
        // It's used by the useUser hook for fast, reliable profile loading.
        const generalUserData: any = {
            id: user.uid,
            externalAuthId: user.uid,
            email: user.email,
            role: data.role,
            firstName,
            lastName: lastName || 'User',
            status: 'Active',
            createdAt: now,
            updatedAt: now,
        };

        switch (data.role) {
            case 'Admin':
                collectionPath = 'platformAdmins';
                specificProfileData = { ...generalUserData };
                break;
            case 'Customer':
                collectionPath = 'customers';
                specificProfileData = { ...generalUserData, type: 'Individual' };

                // Seed a sample RFQ
                const rfqCollectionRef = collection(firestore, 'charterRFQs');
                const sampleRfq = {
                    customerId: user.uid,
                    requesterExternalAuthId: user.uid,
                    customerName: data.name,
                    tripType: 'Onward',
                    departure: 'Mumbai (VABB)',
                    arrival: 'Goa (VOGO)',
                    departureDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // a week from now
                    pax: 4,
                    aircraftType: 'Any Light Jet',
                    status: 'Bidding Open',
                    createdAt: now,
                    updatedAt: now,
                    bidsCount: 0,
                };
                addDocumentNonBlocking(rfqCollectionRef, sampleRfq);
                break;
            case 'Operator':
                collectionPath = 'operators';
                const operatorCompanyName = `${data.name}'s Company`;
                generalUserData.company = operatorCompanyName;
                specificProfileData = { ...generalUserData, companyName: operatorCompanyName, nsopLicenseNumber: 'PENDING', mouAcceptedAt: now, status: 'Pending Approval', contactPersonName: data.name, contactEmail: user.email };
                
                // Seed a sample aircraft
                const aircraftDocRef = doc(collection(firestore, 'operators', user.uid, 'aircrafts'));
                const sampleAircraft = { id: aircraftDocRef.id, operatorId: user.uid, name: 'Citation XLS+', model: 'Citation XLS+', type: 'Mid-size Jet', tailNumber: 'VT-XYZ', registration: 'VT-XYZ', seatingCapacity: 8, paxCapacity: 8, homeBase: 'VABB', status: 'Active' };
                setDocumentNonBlocking(aircraftDocRef, sampleAircraft, { merge: true });

                // Seed a sample approved empty leg
                const emptyLegDocRef = doc(collection(firestore, 'emptyLegs'));
                const sampleEmptyLeg = { id: emptyLegDocRef.id, operatorId: user.uid, aircraftId: aircraftDocRef.id, departure: 'Delhi (VIDP)', arrival: 'Jaipur (VIJP)', departureTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), availableSeats: 6, status: 'Approved', adminApprovalStatus: 'Approved', createdAt: now, updatedAt: now };
                setDocumentNonBlocking(emptyLegDocRef, sampleEmptyLeg, { merge: true });
                break;
            case 'Authorized Distributor':
                collectionPath = 'distributors';
                const distCompanyName = `${data.name}'s Agency`;
                generalUserData.company = distCompanyName;
                specificProfileData = { ...generalUserData, companyName: distCompanyName, maxSeatCapPerMonth: 100, mouAcceptedAt: now, status: 'Pending Approval', contactPersonName: data.name, contactEmail: user.email };
                break;
            case 'Hotel Partner':
                collectionPath = 'hotelPartners';
                const hotelCompanyName = `${data.name}'s Hotel`;
                generalUserData.company = hotelCompanyName;
                specificProfileData = { ...generalUserData, companyName: hotelCompanyName, mouAcceptedAt: now, status: 'Pending Approval', contactPersonName: data.name, contactEmail: user.email };
                
                // Seed a sample property and room category
                const propertyDocRef = doc(collection(firestore, 'hotelPartners', user.uid, 'properties'));
                const sampleProperty = { id: propertyDocRef.id, hotelPartnerId: user.uid, name: 'The Grand Lighthouse', address: '123 Ocean View Drive', city: 'Mumbai', country: 'India', status: 'Active', createdAt: now, updatedAt: now };
                setDocumentNonBlocking(propertyDocRef, sampleProperty, { merge: true });
                const roomCategoryDocRef = doc(collection(firestore, `hotelPartners/${user.uid}/properties/${propertyDocRef.id}/roomCategories`));
                const sampleRoomCategory = { id: roomCategoryDocRef.id, propertyId: propertyDocRef.id, name: 'Ocean View Suite', description: 'A luxurious suite with a stunning view of the Arabian Sea.', maxOccupancy: 2, baseRateMin: 15000, baseRateMax: 25000, createdAt: now, updatedAt: now };
                setDocumentNonBlocking(roomCategoryDocRef, sampleRoomCategory, { merge: true });
                break;
            case 'CTD Admin':
                const ctdId = user.uid;
                const ctdCompanyName = `${data.name}'s Corp`;
                generalUserData.ctdId = ctdId;
                generalUserData.company = ctdCompanyName;
                generalUserData.role = 'Corporate Admin';

                const ctdDocRef = doc(firestore, 'corporateTravelDesks', ctdId);
                const ctdData = { id: ctdId, companyName: ctdCompanyName, adminExternalAuthId: user.uid, status: 'Active', createdAt: now, updatedAt: now };
                setDocumentNonBlocking(ctdDocRef, ctdData, { merge: true });
                
                collectionPath = `corporateTravelDesks/${ctdId}/users`;
                specificProfileData = { ...generalUserData };

                // Seed a second 'Requester' user for the same corporate desk
                const requesterDocRef = doc(collection(firestore, `corporateTravelDesks/${ctdId}/users`));
                const requesterData = { id: requesterDocRef.id, externalAuthId: `requester_${requesterDocRef.id}`, ctdId: ctdId, email: 'employee@example.com', role: 'Requester', status: 'Active', firstName: 'Rahul', lastName: 'Verma', createdAt: now, updatedAt: now };
                setDocumentNonBlocking(requesterDocRef, requesterData, { merge: true });
                break;
        }

        // Create the denormalized user document in the top-level /users collection
        const userDocRef = doc(firestore, 'users', user.uid);
        setDocumentNonBlocking(userDocRef, generalUserData, { merge: true });

        // Create the full user profile document in its specific, role-based collection
        if (collectionPath) {
            const specificDocRef = doc(firestore, collectionPath, docId);
            setDocumentNonBlocking(specificDocRef, specificProfileData, { merge: true });
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
