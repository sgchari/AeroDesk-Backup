'use client';

import { PageHeader } from "@/components/dashboard/shared/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle, ShieldCheck, ShieldAlert, Settings2, Trash2 } from "lucide-react";
import { useUser } from "@/hooks/use-user";
import { useCollection, useFirestore, useMemoFirebase, updateDocumentNonBlocking, deleteDocumentNonBlocking } from "@/firebase";
import { collection, query, doc } from "firebase/firestore";
import { Skeleton } from "@/components/ui/skeleton";
import type { PolicyFlag } from "@/lib/types";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";

export default function CTDPoliciesPage() {
    const { user, isLoading: isUserLoading } = useUser();
    const firestore = useFirestore();
    const { toast } = useToast();
    const [newPolicyOpen, setNewPolicyOpen] = useState(false);

    const policiesQuery = useMemoFirebase(() => {
        if (!firestore || (firestore as any)._isMock || !user?.ctdId) return null;
        return collection(firestore, `corporateTravelDesks/${user.ctdId}/policyFlags`);
    }, [firestore, user]);

    const { data: policies, isLoading: policiesLoading } = useCollection<PolicyFlag>(policiesQuery, `corporateTravelDesks/${user?.ctdId}/policyFlags`);

    const handleToggleEnforcement = (policyId: string, currentStatus: boolean) => {
        if (!firestore || !user?.ctdId) return;
        
        const docRef = (firestore as any)._isMock
            ? { path: `corporateTravelDesks/${user.ctdId}/policyFlags/${policyId}` } as any
            : doc(firestore, `corporateTravelDesks/${user.ctdId}/policyFlags`, policyId);

        updateDocumentNonBlocking(docRef, { isEnforced: !currentStatus });
        
        toast({
            title: "Policy Status Updated",
            description: `The policy is now ${!currentStatus ? 'Enforced' : 'Advisory'}.`,
        });
    };

    const handleDeletePolicy = (policyId: string) => {
        if (!firestore || !user?.ctdId) return;
        
        const docRef = (firestore as any)._isMock
            ? { path: `corporateTravelDesks/${user.ctdId}/policyFlags/${policyId}` } as any
            : doc(firestore, `corporateTravelDesks/${user.ctdId}/policyFlags`, policyId);

        deleteDocumentNonBlocking(docRef);
    };

    const isLoading = isUserLoading || policiesLoading;

    return (
        <>
            <PageHeader title="Travel Policy Management" description="Define and manage the operational rules governing your organization's charter journeys.">
                <Dialog open={newPolicyOpen} onOpenChange={setNewPolicyOpen}>
                    <DialogTrigger asChild>
                        <Button className="bg-accent text-accent-foreground hover:bg-accent/90">
                            <PlusCircle className="mr-2 h-4 w-4" />
                            Define New Rule
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Define Governance Rule</DialogTitle>
                            <DialogDescription>Create a new policy constraint for organizational travel.</DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label>Policy Name</Label>
                                <Input placeholder="e.g. Budget Threshold Alert" />
                            </div>
                            <div className="space-y-2">
                                <Label>Functional Description</Label>
                                <Textarea placeholder="Explain how this policy should influence coordination..." />
                            </div>
                            <div className="flex items-center justify-between p-3 border rounded-lg bg-muted/20">
                                <div className="space-y-0.5">
                                    <Label>Enforce Policy</Label>
                                    <p className="text-[10px] text-muted-foreground">Block requests that violate this rule.</p>
                                </div>
                                <Switch />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="ghost" onClick={() => setNewPolicyOpen(false)}>Cancel</Button>
                            <Button onClick={() => {
                                setNewPolicyOpen(false);
                                toast({ title: "Draft Saved", description: "Policy has been initialized in advisory mode." });
                            }} className="bg-accent text-accent-foreground">Initialize Policy</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </PageHeader>
            
            <div className="grid gap-6">
                {isLoading ? (
                    <div className="grid gap-4 md:grid-cols-2">
                        <Skeleton className="h-48 w-full" />
                        <Skeleton className="h-48 w-full" />
                    </div>
                ) : (
                    <div className="grid gap-6 md:grid-cols-2">
                        {policies?.map((policy) => (
                            <Card key={policy.id} className={cn("bg-card group hover:border-accent/30 transition-all", !policy.isEnforced && "opacity-80")}>
                                <CardHeader className="pb-3">
                                    <div className="flex items-start justify-between">
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2">
                                                {policy.isEnforced ? (
                                                    <ShieldCheck className="h-4 w-4 text-green-500" />
                                                ) : (
                                                    <ShieldAlert className="h-4 w-4 text-amber-500" />
                                                )}
                                                <CardTitle className="text-base font-bold">{policy.name}</CardTitle>
                                            </div>
                                            <Badge variant={policy.isEnforced ? "default" : "outline"} className={cn("text-[9px] uppercase tracking-tighter h-4", policy.isEnforced ? "bg-green-600" : "text-amber-500 border-amber-500/30")}>
                                                {policy.isEnforced ? "Enforced (Blocking)" : "Advisory (Warning)"}
                                            </Badge>
                                        </div>
                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive" onClick={() => handleDeletePolicy(policy.id)}>
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <p className="text-xs text-muted-foreground leading-relaxed italic">
                                        "{policy.description}"
                                    </p>
                                    <div className="flex items-center justify-between pt-4 border-t border-white/5">
                                        <div className="flex items-center gap-2">
                                            <Settings2 className="h-3.5 w-3.5 text-accent/60" />
                                            <span className="text-[10px] uppercase font-bold text-accent tracking-widest">Enforcement Control</span>
                                        </div>
                                        <Switch 
                                            checked={policy.isEnforced} 
                                            onCheckedChange={() => handleToggleEnforcement(policy.id, policy.isEnforced)}
                                        />
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}

                {(!isLoading && (!policies || policies.length === 0)) && (
                    <div className="text-center py-20 border-2 border-dashed rounded-lg bg-muted/5">
                        <ShieldCheck className="mx-auto h-10 w-10 text-muted-foreground/20 mb-4" />
                        <p className="text-muted-foreground">No travel policies defined. Organizational travel currently follows standard platform protocols.</p>
                    </div>
                )}
            </div>
        </>
    );
}