
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
    Briefcase
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCollection, useFirestore, useMemoFirebase } from "@/firebase";
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
    AreaChart, 
    Area,
    Legend
} from 'recharts';

const MOCK_REV_DATA = [
    { name: 'Jun', rev: 12.5, comm: 8.2 },
    { name: 'Jul', rev: 18.2, comm: 12.4 },
    { name: 'Aug', rev: 22.1, comm: 15.8 },
];

export default function AdminBillingEnginePage() {
    const firestore = useFirestore();

    const { data: invoices, isLoading: invoicesLoading } = useCollection<PlatformInvoice>(
        useMemoFirebase(() => null, []), 'platformInvoices'
    );

    const { data: ledger, isLoading: ledgerLoading } = useCollection<EntityBillingLedger>(
        useMemoFirebase(() => null, []), 'entityBillingLedger'
    );

    const { data: rules, isLoading: rulesLoading } = useCollection<PlatformChargeRule>(
        useMemoFirebase(() => null, []), 'platformChargeRules'
    );

    const isLoading = invoicesLoading || ledgerLoading || rulesLoading;

    const stats = {
        totalMTD: "₹ 18.2 L",
        outstanding: "₹ 4.5 L",
        overdueCount: "3",
        activeRules: rules?.filter(r => r.isActive).length.toString() || "0"
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
                <StatsCard title="Total Revenue (MTD)" value={stats.totalMTD} icon={DollarSign} description="Settled platform fees" />
                <StatsCard title="Outstanding Balances" value={stats.outstanding} icon={AlertCircle} description="Unpaid platform invoices" />
                <StatsCard title="Overdue Accounts" value={stats.overdueCount} icon={ShieldCheck} description="Action required" />
                <StatsCard title="Active Charge Rules" value={stats.activeRules} icon={Settings} description="Governance constraints" />
            </StatsGrid>

            <Tabs defaultValue="analytics" className="w-full">
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
                        <CardHeader>
                            <CardTitle>Platform Settlement Queue</CardTitle>
                            <CardDescription>Official invoices issued by AeroDesk to participating entities.</CardDescription>
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
                                        {invoices?.map((inv) => (
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
                                                    <Badge variant={inv.status === 'paid' ? 'success' : inv.status === 'overdue' ? 'destructive' : 'warning'} className="text-[9px] font-black uppercase h-5">
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
                                                {rule.chargeType === 'percentage' ? `${(rule.percentageRate * 100).toFixed(1)}% Volume Fee` : `₹ ${rule.fixedAmount} Flat Fee`}
                                            </p>
                                        </div>
                                        <Badge variant={rule.isActive ? 'default' : 'secondary'} className="text-[8px] font-black h-5">
                                            {rule.isActive ? 'ACTIVE' : 'EXPIRED'}
                                        </Badge>
                                    </div>
                                ))}
                                <Button className="w-full h-10 bg-accent text-accent-foreground hover:bg-accent/90 font-black uppercase text-[10px] tracking-[0.2em] mt-2">
                                    Define New Charge Rule
                                </Button>
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
