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
} from "@/components/ui/select";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useUser } from '@/hooks/use-user';
import { useFirestore, addDocumentNonBlocking } from '@/firebase';
import { Zap, ShieldCheck, PlusCircle } from 'lucide-react';

const shareConfigSchema = z.object({
  scopeType: z.enum(['global', 'entity', 'serviceType'] as const),
  serviceType: z.enum(['charter', 'seat', 'accommodation'] as const).optional(),
  agencySharePercent: z.coerce.number().min(0).max(100),
  aerodeskSharePercent: z.coerce.number().min(0).max(100),
  effectiveFrom: z.string().min(1, 'Required'),
}).refine(data => data.agencySharePercent + data.aerodeskSharePercent === 100, {
  message: "Shares must total 100%",
  path: ["aerodeskSharePercent"]
});

type ShareConfigFormValues = z.infer<typeof shareConfigSchema>;

export function CreateShareConfigDialog() {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const { user } = useUser();
  const firestore = useFirestore();

  const form = useForm<ShareConfigFormValues>({
    resolver: zodResolver(shareConfigSchema),
    defaultValues: {
      scopeType: 'global',
      agencySharePercent: 60,
      aerodeskSharePercent: 40,
      effectiveFrom: new Date().toISOString().split('T')[0],
    },
  });

  const scopeType = form.watch('scopeType');

  const onSubmit = (data: ShareConfigFormValues) => {
    if (!user || !firestore) return;

    // Use path-based reference for simulation compatibility
    const configRef = { path: 'revenueShareConfigs' } as any;
    
    addDocumentNonBlocking(configRef, {
      ...data,
      isActive: true,
      createdBy: user.id,
      createdAt: new Date().toISOString(),
    });

    toast({
      title: 'Share Protocol Configured',
      description: `New ${data.scopeType} revenue split published successfully.`,
    });
    
    setOpen(false);
    form.reset();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="h-9 gap-2 bg-accent text-accent-foreground hover:bg-accent/90 font-black uppercase text-[10px] tracking-widest">
          <PlusCircle className="h-3.5 w-3.5" /> Configure Share
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Configure Revenue Distribution</DialogTitle>
          <DialogDescription>
            Define how the platform commission is split between the Travel Agency and AeroDesk.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            <FormField
              control={form.control}
              name="scopeType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Rule Scope</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="bg-muted/20">
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="global">Global Default</SelectItem>
                      <SelectItem value="serviceType">Service Type Specific</SelectItem>
                      <SelectItem value="entity">Individual Agency Override</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

            {scopeType === 'serviceType' && (
              <FormField
                control={form.control}
                name="serviceType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Target Service</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-muted/20">
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="charter">Charter</SelectItem>
                        <SelectItem value="seat">Seats</SelectItem>
                        <SelectItem value="accommodation">Accommodation</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
            )}

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="agencySharePercent"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Agency Share (%)</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} className="bg-muted/20" />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="aerodeskSharePercent"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>AeroDesk Share (%)</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} className="bg-muted/20" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="effectiveFrom"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Effective Date</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} className="bg-muted/20" />
                  </FormControl>
                </FormItem>
              )}
            />

            <DialogFooter className="pt-4">
              <Button type="button" variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
              <Button type="submit" className="bg-accent text-accent-foreground font-bold">Activate Config</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
