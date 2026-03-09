'use client';

import React, { useMemo } from 'react';
import { PageHeader } from "@/components/dashboard/shared/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useCollection, useUser, useFirestore, useMemoFirebase } from "@/firebase";
import { collection, query, where } from "firebase/firestore";
import { Skeleton } from "@/components/ui/skeleton";
import type { CorporateOrganization, CostCenter, CorporatePayment } from "@/lib/types";
import { 
    Wallet, 
    Coins, 
    History, 
    TrendingUp, 
    ShieldCheck, 
    Zap, 
    Download, 
    ArrowUpRight,
    CreditCard,
    Building
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
    ResponsiveContainer, 
    AreaChart, 
    Area, 
    XAxis, 
    YAxis, 
    Tooltip, 
    CartesianGrid,
    BarChart,
    Bar
} from 'recharts';

const MOCK_FLOW_DATA = [
    { month: 'Oct', spend: 4500000 },
    { month: 'Nov', spend: 5200000 },
    { month: 'Dec', spend: 8100000 },
    { month: 'Jan', spend: 6800000 },
    { month: 'Feb', spend: 12500000 },
];

export default function CorporateBudgetsPage() {
    const { user } = useUser();
    const firestore = useFirestore();

    const { data: orgs, isLoading: orgLoading } = useCollection<CorporateOrganization>(
        useMemoFirebase(() => {
            if (!firestore || (firestore as any)._isMock || !user?.corporateId) return null;
            return query(collection(firestore, 'corporateOrganizations'), where('corporateId', '==', user.corporateId));
        }, [firestore, user?.corporateId]),
        'corporateOrganizations'
    );

    const { data: centers, isLoading: centersLoading } = useCollection<CostCenter>(
        useMemoFirebase(() => {
            if (!firestore || (firestore as any)._isMock || !user?.corporateId) return null;
            return query(collection(firestore, 'costCenters'), where('corporateId', '==', user.corporateId));
        }, [firestore, user?.corporateId]),
        'costCenters'
    );

    const { data: payments, isLoading: paymentsLoading } = useCollection<CorporatePayment>(
        useMemoFirebase(() => {
            if (!firestore || (firestore as any)._isMock) return null;
            return collection(firestore, 'corporatePayments');
        }, [firestore]),
        'corporatePayments'
    );

    const myOrg = orgs?.[0] || { annualAviationBudget: 100000000, usedBudget: 42000000, companyName: user?.company || 'Organization' };
    const remainingBudget = myOrg.annualAviationBudget - myOrg.usedBudget;
    const utilizationPercent = Math.round((myOrg.usedBudget / myOrg.annualAviationBudget) * 100);

    const isLoading = orgLoading || centersLoading || paymentsLoading;

    return (
        <div className="space-y-6">
            <PageHeader 
                title="Finance & Budget Control" 
                description={`Aviation spend management and cost-center audit for ${myOrg.companyName}.`}
            >
                <Button variant="outline" className="h-9 gap-2 border-white/10 text-[10px] font-black uppercase tracking-widest">
                    <Download className="h-3.5 w-3.5" /> Export Fiscal Report
                </Button>
            </PageHeader>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="bg-card border-l-4 border-l-emerald-500 shadow-xl">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-[10px] uppercase text-muted-foreground font-black tracking-widest">Annual Aviation Budget</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-black text-white">₹ {(myOrg.annualAviationBudget / 10000000).toFixed(1)} Cr</div>
                        <p className="text-[10px] text-muted-foreground uppercase font-bold mt-1 tracking-tighter">Fiscal Cycle 2025</p>
                    </CardContent>
                </Card>
                <Card className="bg-card border-l-4 border-l-accent shadow-xl">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-[10px] uppercase text-muted-foreground font-black tracking-widest">Utilized to Date</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-black text-accent">₹ {(myOrg.usedBudget / 10000000).toFixed(1)} Cr</div>
                        <div className="h-1 w-full bg-white/5 rounded-full mt-2 overflow-hidden">
                            <div className="h-full bg-accent" style={{ width: `${utilizationPercent}%` }} />
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-card border-l-4 border-l-sky-500 shadow-xl">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-[10px] uppercase text-muted-foreground font-black tracking-widest">Remaining Liquidity</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-black text-white">₹ {(remainingBudget / 10000000).toFixed(1)} Cr</div>
                        <p className="text-[10px] text-sky-500 uppercase font-bold mt-1 tracking-tighter">{100 - utilizationPercent}% Buffer</p>
                    </CardContent>
                </Card>
            </div>

            <Tabs defaultValue="centers" className="w-full">
                <TabsList className="bg-muted/20 border border-white/5 mb-6 p-1 h-auto flex flex-wrap">
                    <TabsTrigger value="centers" className="gap-2 flex-1 min-w-[120px]">
                        <Building className="h-3.5 w-3.5" /> Cost Center Yield
                    </TabsTrigger>
                    <TabsTrigger value="settlements" className="gap-2 flex-1 min-w-[120px]">
                        <History className="h-3.5 w-3.5" /> Settlement Registry
                    </TabsTrigger>
                    <TabsTrigger value="intensity" className="gap-2 flex-1 min-w-[120px]">
                        <TrendingUp className="h-3.5 w-3.5" /> Spend Intensity
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="centers" className="space-y-6">
                    <Card className="bg-card border-white/5 overflow-hidden shadow-2xl">
                        <CardHeader>
                            <CardTitle>Departmental Budget Tracking</CardTitle>
                            <CardDescription>Consolidated view of aviation spend limits across institutional cost centers.</CardDescription>
                        </CardHeader>
                        <CardContent className="p-0">
                            {isLoading ? <Skeleton className="h-64 w-full" /> : (
                                <Table>
                                    <TableHeader>
                                        <TableRow className="border-white/5 hover:bg-transparent">
                                            <TableHead className="pl-6 text-[10px] uppercase font-black">Cost Center / Dept</TableHead>
                                            <TableHead className="text-[10px] uppercase font-black">Allocated (INR)</TableHead>
                                            <TableHead className="text-[10px] uppercase font-black">Utilized (INR)</TableHead>
                                            <TableHead className="text-[10px] uppercase font-black">Burn Rate</TableHead>
                                            <TableHead className="text-right pr-6"><span className="sr-only">Actions</span></TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {centers?.map((center) => {
                                            const ratio = (center.usedBudget / center.allocatedBudget) * 100;
                                            return (
                                                <TableRow key={center.id} className="border-white/5 hover:bg-white/[0.02] group">
                                                    <TableCell className="pl-6 py-4">
                                                        <p className="text-sm font-bold text-white uppercase group-hover:text-accent transition-colors">{center.departmentName}</p>
                                                        <p className="text-[9px] text-muted-foreground uppercase font-code tracking-tighter">ID: {center.costCenterId}</p>
                                                    </TableCell>
                                                    <TableCell className="text-xs font-medium text-white/60">₹ {(center.allocatedBudget / 100000).toFixed(1)} L</TableCell>
                                                    <TableCell className="text-xs font-black text-accent">₹ {(center.usedBudget / 100000).toFixed(1)} L</TableCell>
                                                    <TableCell>
                                                        <div className="w-32 space-y-1">
                                                            <div className="flex justify-between text-[8px] font-black uppercase text-muted-foreground">
                                                                <span>{Math.round(ratio)}%</span>
                                                            </div>
                                                            <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                                                                <div 
                                                                    className={cn("h-full transition-all duration-1000", ratio > 80 ? "bg-rose-500" : "bg-emerald-500")} 
                                                                    style={{ width: `${ratio}%` }} 
                                                                />
                                                            </div>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="text-right pr-6">
                                                        <Button variant="ghost" size="sm" className="h-8 text-[9px] font-black uppercase tracking-widest text-white/40 hover:text-white">
                                                            Audit Dept
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>
                                            )
                                        })}
                                    </TableBody>
                                </Table>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="settlements" className="space-y-6">
                    <Card className="bg-card border-white/5">
                        <CardHeader>
                            <CardTitle>Commercial Settlement Log</CardTitle>
                            <CardDescription>Archive of bank transfers and institutional payments cleared by Finance.</CardDescription>
                        </CardHeader>
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader>
                                    <TableRow className="border-white/5">
                                        <TableHead className="pl-6 text-[10px] uppercase font-black">Payment Ref / Date</TableHead>
                                        <TableHead className="text-[10px] uppercase font-black">Mission ID</TableHead>
                                        <TableHead className="text-[10px] uppercase font-black">Method</TableHead>
                                        <TableHead className="text-[10px] uppercase font-black">Amount</TableHead>
                                        <TableHead className="text-right pr-6 text-[10px] uppercase font-black">Status</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {payments?.map((pay) => (
                                        <TableRow key={pay.id} className="border-white/5 hover:bg-white/[0.02]">
                                            <TableCell className="pl-6 py-4">
                                                <p className="text-xs font-bold text-white font-code">{pay.paymentReference}</p>
                                                <p className="text-[9px] text-muted-foreground uppercase font-black">{new Date(pay.createdAt).toLocaleDateString()}</p>
                                            </TableCell>
                                            <TableCell className="font-code text-[10px] text-accent font-bold uppercase">{pay.corporateRequestId}</TableCell>
                                            <TableCell className="text-[10px] font-bold text-white/60 uppercase">{pay.paymentMethod}</TableCell>
                                            <TableCell className="text-sm font-black text-white">₹ {pay.amount.toLocaleString()}</TableCell>
                                            <TableCell className="text-right pr-6">
                                                <Badge className={cn(
                                                    "text-[9px] font-black uppercase h-5 border-none",
                                                    pay.paymentStatus === 'VERIFIED' ? "bg-emerald-500/20 text-emerald-500" : "bg-blue-500/20 text-blue-400"
                                                )}>
                                                    {pay.paymentStatus}
                                                </Badge>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="intensity" className="space-y-6">
                    <div className="grid gap-6 lg:grid-cols-3">
                        <Card className="lg:col-span-2 bg-card">
                            <CardHeader>
                                <CardTitle>Institutional Spend Velocity</CardTitle>
                                <CardDescription>5-month rolling aviation spend intensity audit.</CardDescription>
                            </CardHeader>
                            <CardContent className="h-[350px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={MOCK_FLOW_DATA}>
                                        <defs>
                                            <linearGradient id="colorSpendFin" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                                                <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                                        <XAxis dataKey="month" stroke="#94a3b8" fontSize={10} axisLine={false} tickLine={false} />
                                        <YAxis stroke="#94a3b8" fontSize={10} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${v/10000000}Cr`} />
                                        <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px' }} />
                                        <Area type="monotone" dataKey="spend" stroke="#10B981" fillOpacity={1} fill="url(#colorSpendFin)" name="Spend" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>

                        <div className="space-y-6">
                            <Card className="bg-primary/5 border-primary/20">
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-xs font-black uppercase text-primary flex items-center gap-2">
                                        <ShieldCheck className="h-4 w-4" /> Policy Enforcement
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3 pt-2">
                                    <div className="p-3 bg-black/40 border border-white/5 rounded-lg space-y-2">
                                        <div className="flex items-center justify-between text-[10px]">
                                            <span className="text-muted-foreground font-bold uppercase">Threshold Trigger</span>
                                            <span className="text-white font-bold">₹ 20 L</span>
                                        </div>
                                        <div className="flex items-center justify-between text-[10px]">
                                            <span className="text-muted-foreground font-bold uppercase">Escalation Node</span>
                                            <Badge variant="outline" className="text-[8px] h-4 border-accent/20 text-accent">CFO_OFFICE</Badge>
                                        </div>
                                    </div>
                                    <p className="text-[10px] text-muted-foreground leading-relaxed italic opacity-60">
                                        * Missions exceeding the ₹ 20 L threshold automatically transition to Finance Approval for CFO sign-off.
                                    </p>
                                </CardContent>
                            </Card>

                            <Card className="bg-accent/5 border-accent/20">
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-xs font-black uppercase text-accent flex items-center gap-2">
                                        <Zap className="h-4 w-4" /> AI Yield Advisor
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-[11px] text-muted-foreground leading-relaxed italic">
                                        "Detected 15% budget drift in R&D Operations. Suggest transitioning non-critical regional missions to the JetSeat Exchange model to optimize remaining quarterly buffer."
                                    </p>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}
