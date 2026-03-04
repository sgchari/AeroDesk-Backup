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
import { Settings, ShieldCheck, PlusCircle } from 'lucide-react';

const chargeRuleSchema = z.object({
  entityType: z.enum(['Operator', 'Travel Agency', 'Hotel Partner', 'Corporate Admin'] as const),
  serviceType: z.enum(['charter', 'seat', 'accommodation', 'subscription'] as const),
  chargeType: z.enum(['percentage', 'fixed', 'hybrid'] as const),
  percentageRate: z.coerce.number().min(0, 'Rate cannot be negative').max(100, 'Maximum 100%').default(5),
  fixedAmount: z.coerce.number().min(0, 'Amount cannot be negative').default(0),
  effectiveFrom: z.string().min(1, 'Required'),
});

type ChargeRuleFormValues = z.infer<typeof chargeRuleSchema>;

export function CreateChargeRuleDialog() {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const { user } = useUser();
  const firestore = useFirestore();

  const form = useForm<ChargeRuleFormValues>({
    resolver: zodResolver(chargeRuleSchema),
    defaultValues: {
      entityType: 'Operator',
      serviceType: 'charter',
      chargeType: 'percentage',
      percentageRate: 5,
      fixedAmount: 0,
      effectiveFrom: new Date().toISOString().split('T')[0],
    },
  });

  const chargeType = form.watch('chargeType');

  const onSubmit = async (data: ChargeRuleFormValues) => {
    try {
      if (!user) {
        toast({ title: 'Auth Error', description: 'Institutional session not active.', variant: 'destructive' });
        return;
      }

      const rulesRef = { path: 'platformChargeRules' } as any;
      
      await addDocumentNonBlocking(rulesRef, {
        ...data,
        percentageRate: data.percentageRate / 100, // Convert whole number to decimal for institutional storage
        isActive: true,
        createdBy: user.id,
        createdAt: new Date().toISOString(),
      });

      toast({
        title: 'Governance Rule Published',
        description: `New rate of ${data.percentageRate}% for ${data.entityType} is now active in the registry.`,
      });
      
      setOpen(false);
      form.reset();
    } catch (err) {
      toast({ title: 'Processing Error', description: 'Failed to synchronize governance parameters.', variant: 'destructive' });
    }
  };

  const onInvalid = (errors: any) => {
    toast({
      title: "Input Validation Required",
      description: "Please ensure all governance parameters meet platform standards.",
      variant: "destructive",
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full h-10 bg-accent text-accent-foreground hover:bg-accent/90 font-black uppercase text-[10px] tracking-[0.2em] mt-2">
          <PlusCircle className="mr-2 h-4 w-4" />
          Define New Charge Rule
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-2">
            <Settings className="h-5 w-5 text-accent" />
            <DialogTitle>Configure Platform Governance</DialogTitle>
          </div>
          <DialogDescription>
            Define new commission rates or transaction fees. Publishing this rule will synchronize parameters across the invoicing engine.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit, onInvalid)} className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="entityType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[10px] uppercase font-black">Entity Group</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-muted/20 text-xs">
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Operator">Operators (NSOP)</SelectItem>
                        <SelectItem value="Travel Agency">Agencies</SelectItem>
                        <SelectItem value="Hotel Partner">Hotels</SelectItem>
                        <SelectItem value="Corporate Admin">Corporate Travel</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="serviceType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[10px] uppercase font-black">Service Line</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-muted/20 text-xs">
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="charter">Full Charter</SelectItem>
                        <SelectItem value="seat">Jet Seats (EL)</SelectItem>
                        <SelectItem value="accommodation">Stays</SelectItem>
                        <SelectItem value="subscription">Membership</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="chargeType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[10px] uppercase font-black">Revenue Model</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="bg-muted/20 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="percentage">Volume Percentage</SelectItem>
                      <SelectItem value="fixed">Flat Transaction Fee</SelectItem>
                      <SelectItem value="hybrid">Hybrid (Fixed + %)</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              {(chargeType === 'percentage' || chargeType === 'hybrid') && (
                <FormField
                  control={form.control}
                  name="percentageRate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[10px] uppercase font-black">Rate (%)</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="7.0" {...field} className="bg-muted/20 text-xs" />
                      </FormControl>
                      <FormDescription className="text-[9px]">Enter whole number (e.g. 7.0 for 7%)</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              {(chargeType === 'fixed' || chargeType === 'hybrid') && (
                <FormField
                  control={form.control}
                  name="fixedAmount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[10px] uppercase font-black">Fixed Amount (INR)</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="500" {...field} className="bg-muted/20 text-xs" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>

            <FormField
              control={form.control}
              name="effectiveFrom"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[10px] uppercase font-black">Effective Date</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} className="bg-muted/20 text-xs" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="p-3 rounded-lg bg-accent/5 border border-accent/20 flex items-start gap-3 mt-2">
              <ShieldCheck className="h-4 w-4 text-accent shrink-0 mt-0.5" />
              <p className="text-[10px] text-muted-foreground leading-relaxed italic">
                New rules will supersede existing configurations for all new transactions. Audit trails are recorded for all parameter changes.
              </p>
            </div>

            <DialogFooter className="pt-4">
              <Button type="button" variant="ghost" onClick={() => setOpen(false)} className="text-[10px] uppercase font-black">Cancel</Button>
              <Button type="submit" className="bg-accent text-accent-foreground font-black uppercase text-[10px] px-8">Publish Rule</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}