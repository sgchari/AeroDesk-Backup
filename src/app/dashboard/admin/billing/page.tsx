
'use client';

import { PageHeader } from "@/components/dashboard/shared/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StatsCard } from "@/components/dashboard/shared/stats-card";
import { StatsGrid } from "@/components/dashboard/shared/stats-grid";
import { 
    DollarSign, 
    BarChart2, 
    Settings, 
    FileText, 
    History, 
    Download, 
    AlertCircle, 
    ShieldCheck, 
    Activity,
    CreditCard,
    Briefcase,
    Zap,
    XCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCollection, useFirestore, useMemoFirebase, updateDocumentNonBlocking } from "@/firebase";
import { Skeleton } from "@/components/ui/skeleton";
import type { PlatformInvoice, EntityBillingLedger, PlatformChargeRule } from "@/lib/types";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { 
    BarChart, 
    Bar, 
    XAxis, 
    YAxis, 
    CartesianGrid, 
    Tooltip, 
    ResponsiveContainer, 
    Legend
} from 'recharts';
import { cn } from "@/lib/utils";
import { CreateChargeRuleDialog } from "@/components/dashboard/admin/billing/create-charge-rule-dialog";
import { useToast } from "@/hooks/use-toast";
import { doc, collection } from "firebase/firestore";
import { useState, useMemo } from "react";

const MOCK_REV_DATA = [
    { name: 'Jun', rev: 12.5, comm: 8.2 },
    { name: 'Jul', rev: 18.2, comm: 12.4 },
    { name: 'Aug', rev: 22.1, comm: 15.8 },
];

export default function AdminBillingEnginePage() {
    const firestore = useFirestore();
    const { toast } = useToast();
    const [activeTab, setActiveTab] = useState("analytics");
    const [invoiceFilter, setInvoiceFilter] = useState<string | null>(null);

    const { data: invoices, isLoading: invoicesLoading } = useCollection<PlatformInvoice>(
        useMemoFirebase(() => {
            if (!firestore) return null;
            return collection(firestore, 'platformInvoices');
        }, [firestore]), 
        'platformInvoices'
    );

    const { data: ledger, isLoading: ledgerLoading } = useCollection<EntityBillingLedger>(
        useMemoFirebase(() => {
            if (!firestore) return null;
            return collection(firestore, 'entityBillingLedger');
        }, [firestore]), 
        'entityBillingLedger'
    );

    const { data: rules, isLoading: rulesLoading } = useCollection<PlatformChargeRule>(
        useMemoFirebase(() => {
            if (!firestore) return null;
            return collection(firestore, 'platformChargeRules');
        }, [firestore]), 
        'platformChargeRules'
    );

    const isLoading = invoicesLoading || ledgerLoading || rulesLoading;

    const filteredInvoices = useMemo(() => {
        if (!invoices) return [];
        if (!invoiceFilter) return invoices;
        return invoices.filter(inv => inv.status === invoiceFilter);
    }, [invoices, invoiceFilter]);

    const handleToggleRule = (ruleId: string, currentState: boolean) => {
        if (!firestore) return;
        const ruleRef = doc(firestore, 'platformChargeRules', ruleId);
        updateDocumentNonBlocking(ruleRef, { isActive: !currentState });
        
        toast({
            title: currentState ? "Rule Deactivated" : "Rule Activated",
            description: "Platform governance parameters have been updated.",
        });
    };

    const stats = {
        totalMTD: "₹ 18.2 L",
        outstanding: "₹ 4.5 L",
        overdueCount: "3",
        activeRules: rules?.filter(r => r.isActive).length.toString() || "0"
    };

    const showDetails = (tab: string, filter: string | null = null) => {
        setActiveTab(tab);
        setInvoiceFilter(filter);
        if (filter) {
            toast({
                title: "View Filtered",
                description: `Displaying ${filter} platform settlements.`,
            });
        }
    };

    return (
        <div className="space-y-6">
            <PageHeader 
                title="Financial Governance & Billing" 
                description="Consolidated platform revenue management, charge configuration, and institutional settlement audit."
            >
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="h-9 gap-2 border-white/10 font-bold uppercase text-[9px] tracking-widest">
                        <Download className="h-3.5 w-3.5" /> Export Audit Trail
                    </Button>
                    <Button className="h-9 bg-accent text-accent-foreground hover:bg-accent/90 font-bold uppercase text-[9px] tracking-widest">
                        Run Batch Invoicing
                    </Button>
                </div>
            </PageHeader>

            <StatsGrid>
                <StatsCard 
                    title="Total Revenue (MTD)" 
                    value={stats.totalMTD} 
                    icon={DollarSign} 
                    description="Settled platform fees" 
                    onClick={() => showDetails("analytics")}
                />
                <StatsCard 
                    title="Outstanding Balances" 
                    value={stats.outstanding} 
                    icon={AlertCircle} 
                    description="Unpaid platform invoices" 
                    onClick={() => showDetails("invoices", "issued")}
                />
                <StatsCard 
                    title="Overdue Accounts" 
                    value={stats.overdueCount} 
                    icon={XCircle} 
                    description="Action required" 
                    onClick={() => showDetails("invoices", "overdue")}
                />
                <StatsCard 
                    title="Active Charge Rules" 
                    value={stats.activeRules} 
                    icon={Settings} 
                    description="Governance constraints" 
                    onClick={() => showDetails("settings")}
                />
            </StatsGrid>

            <Tabs value={activeTab} onValueChange={(val) => { setActiveTab(val); setInvoiceFilter(null); }} className="w-full">
                <TabsList className="bg-muted/20 border border-white/5 mb-6 p-1 h-auto flex flex-wrap">
                    <TabsTrigger value="analytics" className="gap-2 flex-1 min-w-[120px]">
                        <BarChart2 className="h-3.5 w-3.5" /> Revenue Intelligence
                    </TabsTrigger>
                    <TabsTrigger value="invoices" className="gap-2 flex-1 min-w-[120px]">
                        <FileText className="h-3.5 w-3.5" /> Platform Invoices
                    </TabsTrigger>
                    <TabsTrigger value="ledger" className="gap-2 flex-1 min-w-[120px]">
                        <History className="h-3.5 w-3.5" /> Billing Ledger
                    </TabsTrigger>
                    <TabsTrigger value="settings" className="gap-2 flex-1 min-w-[120px]">
                        <Settings className="h-3.5 w-3.5" /> Charge Configuration
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="analytics" className="space-y-6 animate-in fade-in slide-in-from-top-2">
                    <div className="grid gap-6 lg:grid-cols-3">
                        <Card className="lg:col-span-2 bg-card">
                            <CardHeader>
                                <CardTitle>Platform Revenue Mix</CardTitle>
                                <CardDescription>Commission vs. Subscription revenue tracking.</CardDescription>
                            </CardHeader>
                            <CardContent className="h-[350px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={MOCK_REV_DATA}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                                        <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} />
                                        <YAxis stroke="#94a3b8" fontSize={10} />
                                        <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b' }} />
                                        <Legend />
                                        <Bar dataKey="rev" name="Gross Volume (Cr)" fill="#0EA5E9" radius={[4, 4, 0, 0]} />
                                        <Bar dataKey="comm" name="Platform Fees (L)" fill="#EEDC5B" radius={[4, 4, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>

                        <Card className="bg-card">
                            <CardHeader>
                                <CardTitle>Contribution Analysis</CardTitle>
                                <CardDescription>Revenue share by stakeholder role.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6 py-4">
                                <div className="p-4 rounded-xl bg-primary/5 border border-primary/10 space-y-3">
                                    <div className="flex items-center justify-between">
                                        <p className="text-[10px] font-black text-primary uppercase tracking-widest">Operators</p>
                                        <Activity className="h-3.5 w-3.5 text-primary" />
                                    </div>
                                    <p className="text-2xl font-black text-foreground">62.4%</p>
                                    <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                                        <div className="h-full bg-primary w-[62%]" />
                                    </div>
                                </div>
                                <div className="p-4 rounded-xl bg-accent/5 border border-accent/10 space-y-3">
                                    <div className="flex items-center justify-between">
                                        <p className="text-[10px] font-black text-accent uppercase tracking-widest">Agencies</p>
                                        <Briefcase className="h-3.5 w-3.5 text-accent" />
                                    </div>
                                    <p className="text-2xl font-black text-foreground">28.1%</p>
                                    <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                                        <div className="h-full bg-accent w-[28%]" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                <TabsContent value="invoices" className="space-y-6 animate-in fade-in slide-in-from-top-2">
                    <Card className="bg-card">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle>Platform Settlement Queue</CardTitle>
                                <CardDescription>
                                    {invoiceFilter ? `Displaying ${invoiceFilter} platform invoices.` : 'Official invoices issued by AeroDesk to participating entities.'}
                                </CardDescription>
                            </div>
                            {invoiceFilter && (
                                <Button variant="ghost" size="sm" onClick={() => setInvoiceFilter(null)} className="h-8 text-[9px] uppercase font-bold gap-2">
                                    Clear Filter <XCircle className="h-3 w-3" />
                                </Button>
                            )}
                        </CardHeader>
                        <CardContent>
                            {isLoading ? <Skeleton className="h-64 w-full" /> : (
                                <Table>
                                    <TableHeader>
                                        <TableRow className="border-white/5">
                                            <TableHead className="text-[10px] uppercase font-black">Invoice ID</TableHead>
                                            <TableHead className="text-[10px] uppercase font-black">Entity</TableHead>
                                            <TableHead className="text-[10px] uppercase font-black">Amount</TableHead>
                                            <TableHead className="text-[10px] uppercase font-black">Due Date</TableHead>
                                            <TableHead className="text-[10px] uppercase font-black text-center">Status</TableHead>
                                            <TableHead className="text-right pr-6"><span className="sr-only">Actions</span></TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filteredInvoices.map((inv) => (
                                            <TableRow key={inv.id} className="border-white/5 group hover:bg-white/[0.02]">
                                                <TableCell className="font-code text-xs font-bold text-accent py-4">{inv.id}</TableCell>
                                                <TableCell>
                                                    <div className="space-y-0.5">
                                                        <p className="text-xs font-bold">{inv.entityName}</p>
                                                        <p className="text-[9px] text-muted-foreground uppercase">{inv.entityType}</p>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-xs font-bold whitespace-nowrap">₹ {inv.totalAmount.toLocaleString()}</TableCell>
                                                <TableCell className="text-[10px] text-muted-foreground">{new Date(inv.dueDate).toLocaleDateString()}</TableCell>
                                                <TableCell className="text-center">
                                                    <Badge className={cn(
                                                        "text-[9px] font-black uppercase h-5",
                                                        inv.status === 'paid' ? 'bg-green-500/20 text-green-500' : 
                                                        inv.status === 'overdue' ? 'bg-rose-500/20 text-rose-500' : 'bg-amber-500/20 text-amber-500'
                                                    )}>
                                                        {inv.status}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-right pr-6">
                                                    <Button variant="ghost" size="sm" className="h-8 text-[9px] font-black uppercase tracking-widest hover:text-accent">
                                                        Verify Payment
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            )}
                            {(!isLoading && filteredInvoices.length === 0) && (
                                <div className="text-center py-20 border-2 border-dashed rounded-lg bg-muted/5">
                                    <p className="text-muted-foreground italic">No settlement records found matching the current criteria.</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="ledger" className="space-y-6 animate-in fade-in slide-in-from-top-2">
                    <Card className="bg-card">
                        <CardHeader>
                            <CardTitle>Master Billing Ledger</CardTitle>
                            <CardDescription>Granular transactional log of platform charges and commissions.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {isLoading ? <Skeleton className="h-64 w-full" /> : (
                                <Table>
                                    <TableHeader>
                                        <TableRow className="border-white/5">
                                            <TableHead className="text-[10px] uppercase font-black">Transaction ID</TableHead>
                                            <TableHead className="text-[10px] uppercase font-black">Service</TableHead>
                                            <TableHead className="text-[10px] uppercase font-black text-right">Gross</TableHead>
                                            <TableHead className="text-[10px] uppercase font-black text-right">Charge</TableHead>
                                            <TableHead className="text-[10px] uppercase font-black text-center">Ledger State</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {ledger?.map((entry) => (
                                            <TableRow key={entry.id} className="border-white/5 hover:bg-white/[0.01]">
                                                <TableCell className="font-code text-[10px] py-3 text-muted-foreground">{entry.relatedTransactionId}</TableCell>
                                                <TableCell>
                                                    <Badge variant="outline" className="text-[8px] uppercase tracking-widest">{entry.serviceType}</Badge>
                                                </TableCell>
                                                <TableCell className="text-right text-[11px]">₹ {entry.grossAmount.toLocaleString()}</TableCell>
                                                <TableCell className="text-right text-[11px] font-bold text-accent">₹ {entry.platformChargeAmount.toLocaleString()}</TableCell>
                                                <TableCell className="text-center">
                                                    <div className="flex items-center justify-center gap-1.5">
                                                        <div className={cn("w-1.5 h-1.5 rounded-full", entry.ledgerStatus === 'paid' ? "bg-green-500" : "bg-amber-500")} />
                                                        <span className="text-[9px] uppercase font-bold text-muted-foreground">{entry.ledgerStatus}</span>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="settings" className="space-y-6 animate-in fade-in slide-in-from-top-2">
                    <div className="grid gap-6 md:grid-cols-2">
                        <Card className="bg-card border-l-4 border-l-accent">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Settings className="h-4 w-4 text-accent" />
                                    Charge Rule Governance
                                </CardTitle>
                                <CardDescription>Configure commission rates and transaction fees for the ecosystem.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {rules?.map((rule) => (
                                    <div key={rule.id} className="p-4 rounded-lg bg-black/20 border border-white/5 flex items-center justify-between group">
                                        <div className="space-y-1">
                                            <p className="text-xs font-bold text-foreground">{rule.entityType} • {rule.serviceType}</p>
                                            <p className="text-[10px] text-muted-foreground">
                                                {rule.chargeType === 'percentage' ? `${(rule.percentageRate * 100).toFixed(1)}% Volume Fee` : 
                                                 rule.chargeType === 'fixed' ? `₹ ${rule.fixedAmount} Flat Fee` :
                                                 `₹ ${rule.fixedAmount} + ${(rule.percentageRate * 100).toFixed(1)}%`}
                                            </p>
                                        </div>
                                        <Button 
                                            variant={rule.isActive ? 'default' : 'outline'} 
                                            size="sm" 
                                            className={cn(
                                                "text-[8px] font-black h-6",
                                                !rule.isActive && "border-white/10 text-muted-foreground"
                                            )}
                                            onClick={() => handleToggleRule(rule.id, rule.isActive)}
                                        >
                                            {rule.isActive ? 'ACTIVE' : 'INACTIVE'}
                                        </Button>
                                    </div>
                                ))}
                                <CreateChargeRuleDialog />
                            </CardContent>
                        </Card>

                        <Card className="bg-card">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <CreditCard className="h-4 w-4 text-primary" />
                                    Subscription Tiers
                                </CardTitle>
                                <CardDescription>Manage recurring platform access plans.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="p-4 rounded-lg border border-white/5 space-y-3">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h4 className="text-sm font-bold">Pro Fleet Access</h4>
                                            <p className="text-[10px] text-muted-foreground">Monthly recurrence</p>
                                        </div>
                                        <span className="text-lg font-black text-primary">₹ 15,000</span>
                                    </div>
                                    <div className="flex gap-4 pt-2 border-t border-white/5">
                                        <div className="space-y-0.5">
                                            <p className="text-[8px] uppercase font-black text-muted-foreground">Override Rate</p>
                                            <p className="text-[10px] font-bold">3.0%</p>
                                        </div>
                                        <div className="space-y-0.5">
                                            <p className="text-[8px] uppercase font-black text-muted-foreground">Trans. Limit</p>
                                            <p className="text-[10px] font-bold">UNLIMITED</p>
                                        </div>
                                    </div>
                                </div>
                                <Button variant="outline" className="w-full h-10 border-white/10 text-[10px] font-bold uppercase tracking-widest">
                                    Configure Plans
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}
