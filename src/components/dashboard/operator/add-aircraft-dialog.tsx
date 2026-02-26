
'use client';

import { useState, useRef } from 'react';
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
import { addDocumentNonBlocking, useFirestore } from '@/firebase';
import { collection } from 'firebase/firestore';
import { Upload, Plane, Image as ImageIcon } from 'lucide-react';

const aircraftSchema = z.object({
  name: z.string().min(2, 'Name is required.'),
  registration: z.string().min(3, 'Registration is required (e.g. VT-ABC).'),
  type: z.enum(['Light Jet', 'Mid-size Jet', 'Heavy Jet', 'Turboprop']),
  paxCapacity: z.coerce.number().min(1, 'Capacity must be at least 1.'),
  homeBase: z.string().min(3, 'Home base is required.'),
});

type AircraftFormValues = z.infer<typeof aircraftSchema>;

export function AddAircraftDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const { toast } = useToast();
  const { user } = useUser();
  const firestore = useFirestore();
  const [isUploading, setIsUploading] = useState(false);
  
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

  const onSubmit = (data: AircraftFormValues) => {
    if (!user || !firestore) return;

    const aircraftCollectionRef = collection(firestore, `operators/${user.id}/aircrafts`);
    
    // Simulate image selection
    const extFile = exteriorRef.current?.files?.[0];
    const intFile = interiorRef.current?.files?.[0];

    addDocumentNonBlocking(aircraftCollectionRef, {
        operatorId: user.id,
        ...data,
        status: 'Available',
        exteriorImageUrl: extFile ? `https://picsum.photos/seed/${extFile.name}/800/600` : 'https://images.unsplash.com/photo-1540962351504-03099e0a754b?q=80&w=800',
        interiorImageUrl: intFile ? `https://picsum.photos/seed/${intFile.name}/800/600` : 'https://images.unsplash.com/photo-1616142387171-fadb42551e7a?q=80&w=800',
        createdAt: new Date().toISOString(),
    });

    toast({
      title: 'Asset Added to Fleet',
      description: `${data.registration} has been synchronized with the platform registry.`,
    });
    onOpenChange(false);
    form.reset();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-2">
            <Plane className="h-5 w-5 text-accent" />
            <DialogTitle>Register New Fleet Asset</DialogTitle>
          </div>
          <DialogDescription>
            Enter aircraft specifications and upload visual assets for the digital registry.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
                <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Aircraft Model Name</FormLabel>
                    <FormControl>
                        <Input placeholder="e.g. Cessna Citation XLS+" {...field} />
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
                    <FormLabel>Tail Number (Registration)</FormLabel>
                    <FormControl>
                        <Input placeholder="e.g. VT-STK" {...field} />
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
                        <FormItem className="col-span-1">
                        <FormLabel>Category</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                        <FormItem className="col-span-1">
                        <FormLabel>PAX Capacity</FormLabel>
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
                        <FormItem className="col-span-1">
                        <FormLabel>Home Base</FormLabel>
                        <FormControl>
                            <Input placeholder="e.g. BOM" {...field} />
                        </FormControl>
                        </FormItem>
                    )}
                />
            </div>

            <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="space-y-2">
                    <FormLabel>Exterior Asset</FormLabel>
                    <div className="flex items-center gap-2">
                        <Button type="button" variant="outline" size="sm" className="w-full h-9 gap-2 border-white/10" onClick={() => exteriorRef.current?.click()}>
                            <Upload className="h-3.5 w-3.5 text-accent" />
                            Upload Exterior
                        </Button>
                        <input type="file" ref={exteriorRef} className="hidden" accept="image/*" />
                    </div>
                </div>
                <div className="space-y-2">
                    <FormLabel>Interior Asset</FormLabel>
                    <div className="flex items-center gap-2">
                        <Button type="button" variant="outline" size="sm" className="w-full h-9 gap-2 border-white/10" onClick={() => interiorRef.current?.click()}>
                            <Upload className="h-3.5 w-3.5 text-accent" />
                            Upload Interior
                        </Button>
                        <input type="file" ref={interiorRef} className="hidden" accept="image/*" />
                    </div>
                </div>
            </div>

            <DialogFooter className="pt-6">
                <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
                <Button type="submit" className="bg-accent text-accent-foreground hover:bg-accent/90">Initialize Asset</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
