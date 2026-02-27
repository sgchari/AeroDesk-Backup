
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
import { collection } from 'firebase/firestore';
import { Settings, ShieldCheck, PlusCircle } from 'lucide-react';

const revenueRuleSchema = z.object({
  serviceType: z.enum(['charter', 'seat', 'accommodation'] as const),
  commissionRatePercent: z.coerce.number().min(0).max(100),
  effectiveFrom: z.string().min(1, 'Required'),
});

type RevenueRuleFormValues = z.infer<typeof revenueRuleSchema>;

export function CreateRevenueRuleDialog() {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const { user } = useUser();
  const firestore = useFirestore();

  const form = useForm<RevenueRuleFormValues>({
    resolver: zodResolver(revenueRuleSchema),
    defaultValues: {
      serviceType: 'charter',
      commissionRatePercent: 5,
      effectiveFrom: new Date().toISOString().split('T')[0],
    },
  });

  const onSubmit = (data: RevenueRuleFormValues) => {
    if (!user || !firestore) return;

    const rulesRef = collection(firestore, 'commissionRules');
    
    addDocumentNonBlocking(rulesRef, {
      ...data,
      isActive: true,
      createdBy: user.id,
      createdAt: new Date().toISOString(),
    });

    toast({
      title: 'Platform Rule Updated',
      description: `New ${data.serviceType} commission rate defined as ${data.commissionRatePercent}%.`,
    });
    
    setOpen(false);
    form.reset();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="h-9 gap-2 border-white/10 font-black uppercase text-[10px] tracking-widest">
          <Settings className="h-3.5 w-3.5" /> Define Rate
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[450px]">
        <DialogHeader>
          <DialogTitle>Define Total Platform Rate</DialogTitle>
          <DialogDescription>
            Specify the total commission percentage AeroDesk captures from service providers.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            <FormField
              control={form.control}
              name="serviceType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Service Category</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="bg-muted/20">
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="charter">Air Charter</SelectItem>
                      <SelectItem value="seat">Jet Seat (Empty Leg)</SelectItem>
                      <SelectItem value="accommodation">Accommodation</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="commissionRatePercent"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Total Commission (%)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="5.0" {...field} className="bg-muted/20" />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="effectiveFrom"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Effective From Date</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} className="bg-muted/20" />
                  </FormControl>
                </FormItem>
              )}
            />

            <div className="p-3 rounded-lg bg-accent/5 border border-accent/20 flex items-start gap-3 mt-2">
              <ShieldCheck className="h-4 w-4 text-accent shrink-0 mt-0.5" />
              <p className="text-[10px] text-muted-foreground leading-relaxed">
                Rules take immediate effect for all new transactions confirmed after the effective date.
              </p>
            </div>

            <DialogFooter className="pt-4">
              <Button type="button" variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
              <Button type="submit" className="bg-accent text-accent-foreground font-bold">Publish Rule</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
