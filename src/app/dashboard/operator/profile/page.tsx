'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { PageHeader } from '@/components/dashboard/shared/page-header';
import { useUser } from '@/hooks/use-user';
import { useFirestore, useDoc, updateDocumentNonBlocking } from '@/firebase';
import { doc } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { ShieldCheck, Upload, AlertCircle, Building } from 'lucide-react';
import type { Operator } from '@/lib/types';

const companySchema = z.object({
  companyName: z.string().min(2, 'Company name is required.'),
  nsopLicenseNumber: z.string().min(3, 'NSOP License is required.'),
  officialEmail: z.string().email('Valid official email required.'),
  registeredAddress: z.string().min(10, 'Full registered address required.'),
  contactNumber: z.string().min(8, 'Contact number required.'),
});

type CompanyFormValues = z.infer<typeof companySchema>;

export default function OperatorCompanyProfilePage() {
  const { user } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();

  const { data: operator, isLoading } = useDoc<Operator>(
    user?.operatorId ? doc(firestore!, 'operators', user.operatorId) : null,
    user?.operatorId ? `operators/${user.operatorId}` : undefined
  );

  const form = useForm<CompanyFormValues>({
    resolver: zodResolver(companySchema),
    defaultValues: {
      companyName: '',
      nsopLicenseNumber: '',
      officialEmail: '',
      registeredAddress: '',
      contactNumber: '',
    },
  });

  React.useEffect(() => {
    if (operator) {
      form.reset({
        companyName: operator.companyName,
        nsopLicenseNumber: operator.nsopLicenseNumber,
        officialEmail: operator.officialEmail || '',
        registeredAddress: operator.registeredAddress || '',
        contactNumber: operator.contactNumber || '',
      });
    }
  }, [operator, form]);

  const isAdmin = user?.firmRole === 'admin';

  const onSubmit = async (data: CompanyFormValues) => {
    if (!operator || !firestore || !isAdmin) return;

    const opDocRef = doc(firestore, 'operators', operator.id);
    const nsopChanged = data.nsopLicenseNumber !== operator.nsopLicenseNumber;

    updateDocumentNonBlocking(opDocRef, {
      ...data,
      profileStatus: nsopChanged ? 'pendingReview' : operator.profileStatus,
      updatedAt: new Date().toISOString(),
    });

    toast({
      title: nsopChanged ? 'NSOP Credentials Updated' : 'Institutional Profile Updated',
      description: nsopChanged 
        ? 'Profile status set to Pending Review due to license changes.' 
        : 'Company details have been synchronized with the platform.',
    });
  };

  if (isLoading) return <div className="p-8 text-center text-muted-foreground animate-pulse">Synchronizing Fleet Context...</div>;
  if (!operator) return <div className="p-8 text-center">Operator record not found.</div>;

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Institutional Identity" 
        description="Manage your NSOP permit details and corporate coordination profile." 
      />
      
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6">
            <Card className="bg-card border-white/5 overflow-hidden">
                <CardHeader className="bg-accent/5 pb-4">
                    <div className="flex items-center justify-between">
                        <Badge variant="outline" className="text-[10px] font-black uppercase tracking-widest text-accent border-accent/20">Firm Profile</Badge>
                        <Badge className={operator.profileStatus === 'active' ? 'bg-green-500/20 text-green-500' : 'bg-amber-500/20 text-amber-500'}>
                            {operator.profileStatus === 'active' ? 'ACTIVE' : 'UNDER REVIEW'}
                        </Badge>
                    </div>
                    <CardTitle className="mt-4 text-white">{operator.companyName}</CardTitle>
                    <p className="text-[10px] font-code text-muted-foreground uppercase mt-1">ID: {operator.id}</p>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                    <div className="p-3 rounded-lg bg-white/[0.02] border border-white/5 flex items-center justify-between">
                        <span className="text-[10px] uppercase font-bold text-muted-foreground">Fleet Assets</span>
                        <span className="text-sm font-black text-accent">{operator.fleetCount || 0} Units</span>
                    </div>
                    <div className="p-3 rounded-lg bg-white/[0.02] border border-white/5 flex items-center justify-between">
                        <span className="text-[10px] uppercase font-bold text-muted-foreground">Base Zone</span>
                        <span className="text-sm font-bold text-white">{operator.zone || 'National'}</span>
                    </div>
                </CardContent>
            </Card>

            <Card className="bg-primary/5 border-primary/20">
                <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center gap-2">
                        <ShieldCheck className="h-4 w-4 text-primary" />
                        Compliance Protocol
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                    <p className="text-[11px] text-muted-foreground leading-relaxed italic">
                        "Updates to NSOP license numbers or official documentation trigger an immediate platform safety review."
                    </p>
                    <Button variant="outline" size="sm" className="w-full h-8 text-[9px] uppercase font-black border-white/10">
                        View Safety Management System
                    </Button>
                </CardContent>
            </Card>
        </div>

        <Card className="lg:col-span-2 bg-card border-white/5">
          <CardHeader>
            <CardTitle>Official Credentials</CardTitle>
            <CardDescription>Only Administrative Personnel can modify these institutional parameters.</CardDescription>
          </CardHeader>
          <CardContent>
            {!isAdmin && (
                <div className="mb-6 p-4 rounded-lg bg-rose-500/10 border border-rose-500/20 flex items-center gap-3">
                    <AlertCircle className="h-5 w-5 text-rose-500" />
                    <p className="text-xs text-rose-500 font-bold">Read-Only Mode: Insufficient Firm Privileges.</p>
                </div>
            )}
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="companyName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[10px] uppercase font-black text-muted-foreground">Legal Entity Name</FormLabel>
                        <FormControl>
                          <Input {...field} disabled={!isAdmin} className="bg-muted/20 border-white/10" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="nsopLicenseNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[10px] uppercase font-black text-muted-foreground">NSOP Permit Number</FormLabel>
                        <FormControl>
                          <Input {...field} disabled={!isAdmin} className="bg-muted/20 border-white/10 font-code" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                    control={form.control}
                    name="officialEmail"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel className="text-[10px] uppercase font-black text-muted-foreground">Operational Dispatch Email</FormLabel>
                        <FormControl>
                            <Input {...field} disabled={!isAdmin} className="bg-muted/20 border-white/10" />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    <FormField
                    control={form.control}
                    name="contactNumber"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel className="text-[10px] uppercase font-black text-muted-foreground">Control Tower Phone</FormLabel>
                        <FormControl>
                            <Input {...field} disabled={!isAdmin} className="bg-muted/20 border-white/10" />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                </div>

                <FormField
                  control={form.control}
                  name="registeredAddress"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[10px] uppercase font-black text-muted-foreground">Official Registered Office</FormLabel>
                      <FormControl>
                        <Textarea {...field} disabled={!isAdmin} className="bg-muted/20 border-white/10 resize-none h-24" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="pt-4 border-t border-white/5">
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-[10px] font-black uppercase text-muted-foreground">NSOP Document Asset</span>
                        <Button type="button" variant="outline" size="sm" className="h-8 text-[9px] font-black border-white/10 gap-2">
                            <Upload className="h-3 w-3" /> Replace Certificate
                        </Button>
                    </div>
                    <div className="p-4 rounded-lg border-2 border-dashed border-white/10 bg-white/[0.01] flex items-center justify-center h-24">
                        <p className="text-[10px] text-muted-foreground uppercase font-bold">NSOP_VALID_CERT_2025.PDF</p>
                    </div>
                </div>

                {isAdmin && (
                    <div className="pt-4 flex justify-end">
                        <Button type="submit" className="bg-accent text-accent-foreground font-black uppercase text-[10px] tracking-widest h-10 px-8">
                            Synchronize Identity
                        </Button>
                    </div>
                )}
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
