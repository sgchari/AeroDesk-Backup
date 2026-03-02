'use client';

import { PageHeader } from "@/components/dashboard/shared/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useCollection, useFirestore, useMemoFirebase, addDocumentNonBlocking } from "@/firebase";
import { collection, query, doc } from "firebase/firestore";
import { Skeleton } from "@/components/ui/skeleton";
import { Settings, PlusCircle, History, ShieldCheck, Zap } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { TaxConfig } from "@/lib/types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";

export default function TaxSettingsPage() {
    const firestore = useFirestore();
    const { toast } = useToast();
    const [isAdding, setIsAdding] = useState(false);

    const { data: configs, isLoading } = useCollection<TaxConfig>(
        useMemoFirebase(() => firestore ? collection(firestore, 'taxConfig') : null, [firestore]),
        'taxConfig'
    );

    const handleAddRule = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!firestore) return;

        const formData = new FormData(e.currentTarget);
        const newRule = {
            serviceType: formData.get('serviceType'),
            taxRatePercent: Number(formData.get('taxRate')),
            sacCode: formData.get('sacCode'),
            effectiveFrom: new Date().toISOString().split('T')[0],
            isActive: true
        };

        addDocumentNonBlocking(collection(firestore, 'taxConfig'), newRule);
        toast({ title: "Tax Rule Updated", description: "New GST parameters have been synchronized with the invoicing engine." });
        setIsAdding(false);
    };

    return (
        <div className="space-y-6">
            <PageHeader 
                title="Global Tax Configuration" 
                description="Manage GST rates, SAC codes, and institutional invoicing parameters."
            />

            <div className="grid gap-6 lg:grid-cols-3">
                <Card className="lg:col-span-2 bg-card">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle>Active GST Rules</CardTitle>
                            <CardDescription>Standard tax rates applied to platform services.</CardDescription>
                        </div>
                        <Button onClick={() => setIsAdding(!isAdding)} size="sm" variant="outline" className="h-8 gap-2 border-white/10 text-[9px] font-black uppercase tracking-widest">
                            <PlusCircle className="h-3 w-3" /> New Rule
                        </Button>
                    </CardHeader>
                    <CardContent>
                        {isLoading ? <Skeleton className="h-48 w-full" /> : (
                            <Table>
                                <TableHeader>
                                    <TableRow className="border-white/5">
                                        <TableHead className="text-[10px] uppercase font-black">Service Line</TableHead>
                                        <TableHead className="text-[10px] uppercase font-black">Rate (%)</TableHead>
                                        <TableHead className="text-[10px] uppercase font-black">SAC Code</TableHead>
                                        <TableHead className="text-[10px] uppercase font-black">Effective</TableHead>
                                        <TableHead className="text-right text-[10px] uppercase font-black">Status</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {configs?.map((config) => (
                                        <TableRow key={config.id} className="border-white/5">
                                            <TableCell className="font-bold py-4 uppercase text-xs">{config.serviceType}</TableCell>
                                            <TableCell className="font-black text-accent">{config.taxRatePercent}%</TableCell>
                                            <TableCell className="font-code text-xs">{config.sacCode}</TableCell>
                                            <TableCell className="text-xs text-muted-foreground">{new Date(config.effectiveFrom).toLocaleDateString()}</TableCell>
                                            <TableCell className="text-right">
                                                <Badge variant={config.isActive ? 'default' : 'secondary'} className="text-[8px] h-4 uppercase">
                                                    {config.isActive ? 'Active' : 'Archived'}
                                                </Badge>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        )}
                    </CardContent>
                </Card>

                <div className="space-y-6">
                    {isAdding && (
                        <Card className="bg-card border-accent/20 animate-in slide-in-from-top-4 duration-500">
                            <CardHeader>
                                <CardTitle className="text-base flex items-center gap-2">
                                    <Zap className="h-4 w-4 text-accent" />
                                    Configure New Rule
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleAddRule} className="space-y-4">
                                    <div className="space-y-1.5">
                                        <Label className="text-[10px] uppercase font-black">Service Type</Label>
                                        <Input name="serviceType" placeholder="e.g. charter" className="h-8 text-xs bg-muted/20" required />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1.5">
                                            <Label className="text-[10px] uppercase font-black">GST Rate (%)</Label>
                                            <Input name="taxRate" type="number" placeholder="18" className="h-8 text-xs bg-muted/20" required />
                                        </div>
                                        <div className="space-y-1.5">
                                            <Label className="text-[10px] uppercase font-black">SAC Code</Label>
                                            <Input name="sacCode" placeholder="9964" className="h-8 text-xs bg-muted/20" required />
                                        </div>
                                    </div>
                                    <Button type="submit" className="w-full bg-accent text-accent-foreground h-9 text-[10px] font-black uppercase">Publish Parameters</Button>
                                </form>
                            </CardContent>
                        </Card>
                    )}

                    <Card className="bg-card">
                        <CardHeader>
                            <CardTitle className="text-sm flex items-center gap-2">
                                <ShieldCheck className="h-4 w-4 text-primary" />
                                Compliance Guide
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <p className="text-[11px] text-muted-foreground leading-relaxed">
                                AeroDesk applies Indian GST rules based on the <span className="text-white font-bold">Place of Supply</span> protocol.
                            </p>
                            <ul className="space-y-2">
                                <li className="flex items-center gap-2 text-[10px]">
                                    <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                                    <span>Intra-state: CGST + SGST split</span>
                                </li>
                                <li className="flex items-center gap-2 text-[10px]">
                                    <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                                    <span>Inter-state: IGST full rate</span>
                                </li>
                            </ul>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
