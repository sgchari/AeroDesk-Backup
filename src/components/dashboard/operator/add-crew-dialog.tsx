'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
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
import { useUser } from '@/hooks/use-user';
import { addDocumentNonBlocking, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection } from 'firebase/firestore';
import type { Aircraft, CrewRole } from '@/lib/types';
import { Users, ShieldCheck } from 'lucide-react';

const crewSchema = z.object({
  firstName: z.string().min(2, 'Required'),
  lastName: z.string().min(2, 'Required'),
  email: z.string().email('Invalid email'),
  role: z.enum(['Captain', 'First Officer', 'Cabin Crew', 'Maintenance', 'Operations']),
  licenseNumber: z.string().min(4, 'License required for flight crew'),
  assignedAircraftId: z.string().optional(),
});

type CrewFormValues = z.infer<typeof crewSchema>;

export function AddCrewDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const { toast } = useToast();
  const { user } = useUser();
  const firestore = useFirestore();

  const { data: fleet } = useCollection<Aircraft>(
    useMemoFirebase(() => {
        if (!firestore || (firestore as any)._isMock || !user) return null;
        return collection(firestore, 'operators', user.id, 'aircrafts');
    }, [firestore, user]),
    user ? `operators/${user.id}/aircrafts` : undefined
  );

  const form = useForm<CrewFormValues>({
    resolver: zodResolver(crewSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      role: 'Captain',
      licenseNumber: '',
      assignedAircraftId: 'FLOAT',
    },
  });

  const onSubmit = (data: CrewFormValues) => {
    if (!user || !firestore) return;

    const crewCollectionRef = (firestore as any)._isMock
        ? { path: 'crew' } as any
        : collection(firestore, 'crew');
    
    const assignedAc = fleet?.find(a => a.id === data.assignedAircraftId);

    addDocumentNonBlocking(crewCollectionRef, {
        operatorId: user.id,
        ...data,
        assignedAircraftRegistration: assignedAc?.registration || 'FLOAT',
        status: 'Available',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    });

    toast({
      title: 'Personnel Initialized',
      description: `${data.firstName} ${data.lastName} has been added to the logistics registry.`,
    });
    onOpenChange(false);
    form.reset();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-2">
            <Users className="h-5 w-5 text-accent" />
            <DialogTitle>Register Flight Personnel</DialogTitle>
          </div>
          <DialogDescription>
            Enter duty credentials and assign roles for institutional logistics management.
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
                    <FormLabel>Corporate Email</FormLabel>
                    <FormControl>
                        <Input type="email" placeholder="name@operator.aero" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
            />

            <div className="grid grid-cols-2 gap-4">
                <FormField
                    control={form.control}
                    name="role"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Designated Role</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                <SelectItem value="Captain">Captain</SelectItem>
                                <SelectItem value="First Officer">First Officer</SelectItem>
                                <SelectItem value="Cabin Crew">Cabin Crew</SelectItem>
                                <SelectItem value="Maintenance">Maintenance</SelectItem>
                                <SelectItem value="Operations">Operations</SelectItem>
                            </SelectContent>
                        </Select>
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="licenseNumber"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Certification/License</FormLabel>
                        <FormControl>
                            <Input placeholder="e.g. ATPL-1234" {...field} />
                        </FormControl>
                        </FormItem>
                    )}
                />
            </div>

            <FormField
                control={form.control}
                name="assignedAircraftId"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Primary Asset Assignment</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                        <SelectTrigger>
                            <SelectValue placeholder="Select Asset (Optional)" />
                        </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            <SelectItem value="FLOAT">Floating / Not Assigned</SelectItem>
                            {fleet?.map(ac => (
                                <SelectItem key={ac.id} value={ac.id}>{ac.registration} ({ac.name})</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    </FormItem>
                )}
            />

            <div className="flex items-start gap-3 p-3 bg-accent/5 border border-accent/20 rounded-lg mt-4">
                <ShieldCheck className="h-5 w-5 text-accent shrink-0 mt-0.5" />
                <p className="text-[10px] text-muted-foreground leading-relaxed">
                    By initializing this personnel record, you certify that the individual holds valid DGCA credentials and meets all operational duty requirements.
                </p>
            </div>

            <DialogFooter className="pt-6">
                <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
                <Button type="submit" className="bg-accent text-accent-foreground hover:bg-accent/90 font-bold">Register Crew</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}