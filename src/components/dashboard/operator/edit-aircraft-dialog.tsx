
'use client';

import { useEffect, useRef } from 'react';
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
import { updateDocumentNonBlocking, useFirestore } from '@/firebase';
import { doc } from 'firebase/firestore';
import type { Aircraft } from '@/lib/types';
import { Settings2, Upload } from 'lucide-react';

const aircraftSchema = z.object({
  name: z.string().min(2, 'Name is required.'),
  registration: z.string().min(3, 'Registration is required.'),
  type: z.enum(['Light Jet', 'Mid-size Jet', 'Heavy Jet', 'Turboprop']),
  paxCapacity: z.coerce.number().min(1),
  homeBase: z.string().min(3),
});

type AircraftFormValues = z.infer<typeof aircraftSchema>;

export function EditAircraftDialog({ aircraft, open, onOpenChange }: { aircraft: Aircraft | null; open: boolean; onOpenChange: (open: boolean) => void }) {
  const { toast } = useToast();
  const { user } = useUser();
  const firestore = useFirestore();
  const exteriorRef = useRef<HTMLInputElement>(null);
  const interiorRef = useRef<HTMLInputElement>(null);

  const form = useForm<AircraftFormValues>({
    resolver: zodResolver(aircraftSchema),
    defaultValues: {
      name: '',
      registration: '',
      type: 'Light Jet',
      paxCapacity: 6,
      homeBase: '',
    },
  });

  useEffect(() => {
    if (aircraft) {
      form.reset({
        name: aircraft.name,
        registration: aircraft.registration,
        type: aircraft.type,
        paxCapacity: aircraft.paxCapacity,
        homeBase: aircraft.homeBase,
      });
    }
  }, [aircraft, form]);

  const onSubmit = (data: AircraftFormValues) => {
    if (!user || !firestore || !aircraft) return;

    const path = `operators/${user.id}/aircrafts/${aircraft.id}`;
    const aircraftDocRef = (firestore as any)._isMock
        ? { path } as any
        : doc(firestore, 'operators', user.id, 'aircrafts', aircraft.id);
    
    updateDocumentNonBlocking(aircraftDocRef, {
        ...data,
        updatedAt: new Date().toISOString(),
    });

    toast({
      title: 'Specifications Updated',
      description: `Changes for ${aircraft.registration} have been published to the registry.`,
    });
    onOpenChange(false);
  };

  if (!aircraft) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-2">
            <Settings2 className="h-5 w-5 text-accent" />
            <DialogTitle>Edit Specifications: {aircraft.registration}</DialogTitle>
          </div>
          <DialogDescription>Modify technical specifications or visual assets for this asset.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
                <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Aircraft Model</FormLabel>
                    <FormControl>
                        <Input {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <FormField
                control={form.control}
                name="registration"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Registration</FormLabel>
                    <FormControl>
                        <Input {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
            </div>

            <div className="grid grid-cols-3 gap-4">
                <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Category</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                            <FormControl>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                <SelectItem value="Light Jet">Light Jet</SelectItem>
                                <SelectItem value="Mid-size Jet">Mid-size Jet</SelectItem>
                                <SelectItem value="Heavy Jet">Heavy Jet</SelectItem>
                                <SelectItem value="Turboprop">Turboprop</SelectItem>
                            </SelectContent>
                        </Select>
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="paxCapacity"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>PAX</FormLabel>
                        <FormControl>
                            <Input type="number" {...field} />
                        </FormControl>
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="homeBase"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Base</FormLabel>
                        <FormControl>
                            <Input {...field} />
                        </FormControl>
                        </FormItem>
                    )}
                />
            </div>

            <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="space-y-2">
                    <FormLabel>Update Exterior</FormLabel>
                    <Button type="button" variant="outline" size="sm" className="w-full h-9 gap-2 border-white/10" onClick={() => exteriorRef.current?.click()}>
                        <Upload className="h-3.5 w-3.5 text-accent" />
                        Replace Image
                    </Button>
                    <input type="file" ref={exteriorRef} className="hidden" accept="image/*" />
                </div>
                <div className="space-y-2">
                    <FormLabel>Update Interior</FormLabel>
                    <Button type="button" variant="outline" size="sm" className="w-full h-9 gap-2 border-white/10" onClick={() => interiorRef.current?.click()}>
                        <Upload className="h-3.5 w-3.5 text-accent" />
                        Replace Image
                    </Button>
                    <input type="file" ref={interiorRef} className="hidden" accept="image/*" />
                </div>
            </div>

            <DialogFooter className="pt-6">
                <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
                <Button type="submit" className="bg-accent text-accent-foreground">Update Specifications</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
