
'use client';

import { PageHeader } from "@/components/dashboard/shared/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StatsCard } from "@/components/dashboard/shared/stats-card";
import { StatsGrid } from "@/components/dashboard/shared/stats-grid";
import { useCollection, useFirestore, useMemoFirebase } from "@/firebase";
import { collection, query, orderBy } from "firebase/firestore";
import { Skeleton } from "@/components/ui/skeleton";
import type { CommissionRule, RevenueShareConfig, CommissionLedgerEntry, SettlementRecord } from "@/lib/types";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { 
    Zap, 
    Coins, 
    History, 
    ShieldCheck, 
    DollarSign, 
    PieChart, 
    Users,
    Settings,
    Globe,
    Briefcase
} from "lucide-react";
import { 
    PieChart as RePieChart, 
    Pie, 
    Cell, 
    ResponsiveContainer, 
    Tooltip,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Legend
} from 'recharts';
import { Button } from "@/components/ui/button";
import { CreateRevenueRuleDialog } from "@/components/dashboard/admin/revenue/create-revenue-rule-dialog";
import { CreateShareConfigDialog } from "@/components/dashboard/admin/revenue/create-share-config-dialog";
import { cn } from "@/lib/utils";

export default function RevenueShareEnginePage() {
    const firestore = useFirestore();

    const { data: rules, isLoading: rulesLoading } = useCollection<CommissionRule>(
        useMemoFirebase(() => firestore ? collection(firestore, 'commissionRules') : null, [firestore]),
        'commissionRules'
    );

    const { data: configs, isLoading: configsLoading } = useCollection<RevenueShareConfig>(
        useMemoFirebase(() => firestore ? collection(firestore, 'revenueShareConfigs') : null, [firestore]),
        'revenueShareConfigs'
    );

    const { data: ledger, isLoading: ledgerLoading } = useCollection<CommissionLedgerEntry>(
        useMemoFirebase(() => firestore ? query(collection(firestore, 'commissionLedger'), orderBy('createdAt', 'desc')) : null, [firestore]),
        'commissionLedger'
    );

    const { data: settlements, isLoading: settlementsLoading } = useCollection<SettlementRecord>(
        useMemoFirebase(() => firestore ? collection(firestore, 'settlementRecords') : null, [firestore]),
        'settlementRecords'
    );

    const isLoading = rulesLoading || configsLoading || ledgerLoading || settlementsLoading;

    // Analytics Calculation
    const totalAeroDeskRev = ledger?.reduce((acc, curr) => acc + curr.aerodeskCommissionAmount, 0) || 0;
    const pendingSettlements = ledger?.filter(l => l.status === 'pending' && l.bookingChannel === 'agency').reduce((acc, curr) => acc + curr.agencyCommissionAmount, 0) || 0;

    const channelData = [
        { name: 'Agency Channel', value: ledger?.filter(l => l.bookingChannel === 'agency').length || 0, color: '#0EA5E9' },
        { name: 'Direct Channel', value: ledger?.filter(l => l.bookingChannel === 'direct' || l.bookingChannel === 'corporate').length || 0, color: '#EEDC5B' },
    ];

    return (
        <div className="space-y-6">
            <PageHeader 
                title="Revenue Share Engine" 
                description="Manage conditional platform splits, agency incentives, and Direct-Channel margin protection."
            >
                <div className="flex gap-2">
                    <CreateRevenueRuleDialog />
                    <CreateShareConfigDialog />
                </div>
            </PageHeader>

            <StatsGrid>
                <StatsCard title="AeroDesk Net Commission" value={`₹ ${(totalAeroDeskRev / 100000).toFixed(2)} L`} icon={DollarSign} description="Platform revenue share" />
                <StatsCard title="Agency Payouts Due" value={`₹ ${(pendingSettlements / 100000).toFixed(2)} L`} icon={Coins} description="Pending agency earnings" />
                <StatsCard title="Direct Bookings" value={channelData[1].value.toString()} icon={Globe} description="100% AeroDesk Share" />
                <StatsCard title="Active Share Rules" value={configs?.filter(c => c.isActive).length.toString() || "0"} icon={Zap} description="Agency channel logic" />
            </StatsGrid>

            <Tabs defaultValue="ledger" className="w-full">
                <TabsList className="bg-muted/20 border border-white/5 mb-6 p-1 h-auto flex flex-wrap">
                    <TabsTrigger value="ledger" className="gap-2 flex-1 min-w-[120px]">
                        <History className="h-3.5 w-3.5" /> Commission Ledger
                    </TabsTrigger>
                    <TabsTrigger value="rules" className="gap-2 flex-1 min-w-[120px]">
                        <Settings className="h-3.5 w-3.5" /> Governance Rules
                    </TabsTrigger>
                    <TabsTrigger value="settlements" className="gap-2 flex-1 min-w-[120px]">
                        <Users className="h-3.5 w-3.5" /> Agency Payouts
                    </TabsTrigger>
                    <TabsTrigger value="analytics" className="gap-2 flex-1 min-w-[120px]">
                        <PieChart className="h-3.5 w-3.5" /> Channel Analysis
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="ledger" className="space-y-6">
                    <Card className="bg-card">
                        <CardHeader>
                            <CardTitle>Institutional Commission Log</CardTitle>
                            <CardDescription>Immutable transaction records reflecting channel-based conditional splits.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {isLoading ? <Skeleton className="h-64 w-full" /> : (
                                <div className="overflow-x-auto">
                                    <Table>
                                        <TableHeader>
                                            <TableRow className="border-white/5">
                                                <TableHead className="text-[10px] uppercase font-black">Transaction ID</TableHead>
                                                <TableHead className="text-[10px] uppercase font-black">Channel</TableHead>
                                                <TableHead className="text-[10px] uppercase font-black text-right">Gross Total</TableHead>
                                                <TableHead className="text-[10px] uppercase font-black text-right">Agency Share</TableHead>
                                                <TableHead className="text-[10px] uppercase font-black text-right">AeroDesk Net</TableHead>
                                                <TableHead className="text-[10px] uppercase font-black">Status</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {ledger?.map((entry) => (
                                                <TableRow key={entry.id} className="border-white/5 hover:bg-white/[0.02]">
                                                    <TableCell className="font-code text-xs py-4">{entry.transactionId}</TableCell>
                                                    <TableCell>
                                                        <Badge variant="outline" className={cn(
                                                            "text-[8px] uppercase tracking-widest h-4",
                                                            entry.bookingChannel === 'agency' ? "border-blue-500/30 text-blue-400" : "border-yellow-500/30 text-yellow-400"
                                                        )}>
                                                            {entry.bookingChannel}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell className="text-right text-xs">₹ {entry.grossAmount.toLocaleString()}</TableCell>
                                                    <TableCell className="text-right text-xs font-bold text-sky-400">
                                                        {entry.agencyCommissionAmount > 0 ? `₹ ${entry.agencyCommissionAmount.toLocaleString()}` : '-'}
                                                    </TableCell>
                                                    <TableCell className="text-right text-xs font-bold text-accent">₹ {entry.aerodeskCommissionAmount.toLocaleString()}</TableCell>
                                                    <TableCell>
                                                        <Badge variant={entry.status === 'settled' ? 'success' : 'outline'} className="text-[9px] uppercase font-black h-5">
                                                            {entry.status}
                                                        </Badge>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="rules" className="grid gap-6 md:grid-cols-2">
                    <Card className="bg-card">
                        <CardHeader>
                            <CardTitle>Commission Rules (Total)</CardTitle>
                            <CardDescription>Total platform fee percentage per service type.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {rules?.map(rule => (
                                <div key={rule.id} className="p-4 rounded-lg bg-black/20 border border-white/5 flex items-center justify-between">
                                    <div className="space-y-1">
                                        <p className="text-xs font-bold capitalize">{rule.serviceType}</p>
                                        <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest">Effective: {new Date(rule.effectiveFrom).toLocaleDateString()}</p>
                                    </div>
                                    <Badge className="bg-primary/20 text-primary font-black text-sm">{rule.commissionRatePercent}%</Badge>
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    <Card className="bg-card">
                        <CardHeader>
                            <CardTitle>Agency Revenue Share (Conditional)</CardTitle>
                            <CardDescription>Configured split applied ONLY to Agency-Channel bookings.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {configs?.map(config => (
                                <div key={config.id} className="p-4 rounded-lg bg-black/20 border border-white/5 space-y-3">
                                    <div className="flex items-center justify-between">
                                        <Badge variant="outline" className="text-[8px] uppercase tracking-widest border-white/10">{config.scopeType}</Badge>
                                        {config.serviceType && <Badge className="text-[8px] uppercase">{config.serviceType}</Badge>}
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="flex-1 space-y-1">
                                            <p className="text-[9px] uppercase font-black text-sky-400">Agency Share</p>
                                            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                                <div className="h-full bg-sky-400" style={{ width: `${config.agencySharePercent}%` }} />
                                            </div>
                                            <p className="text-xs font-bold">{config.agencySharePercent}%</p>
                                        </div>
                                        <div className="flex-1 space-y-1">
                                            <p className="text-[9px] uppercase font-black text-accent">AeroDesk Share</p>
                                            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                                <div className="h-full bg-accent" style={{ width: `${config.aerodeskSharePercent}%` }} />
                                            </div>
                                            <p className="text-xs font-bold text-right">{config.aerodeskSharePercent}%</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            <div className="p-3 bg-accent/5 border border-accent/20 rounded-md">
                                <p className="text-[10px] text-muted-foreground leading-relaxed italic">
                                    * Direct-Channel and Corporate bookings automatically default to 100% AeroDesk share.
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="settlements" className="space-y-6">
                    <Card className="bg-card">
                        <CardHeader>
                            <CardTitle>Agency Payout Registry</CardTitle>
                            <CardDescription>Consolidated settlements for Agency-Channel commissions.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow className="border-white/5">
                                        <TableHead className="text-[10px] uppercase font-black">Agency</TableHead>
                                        <TableHead className="text-[10px] uppercase font-black">Period</TableHead>
                                        <TableHead className="text-[10px] uppercase font-black text-right">Payout Total</TableHead>
                                        <TableHead className="text-[10px] uppercase font-black">Status</TableHead>
                                        <TableHead className="text-right pr-6"><span className="sr-only">Actions</span></TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {settlements?.map(set => (
                                        <TableRow key={set.id} className="border-white/5">
                                            <TableCell className="py-4">
                                                <p className="text-xs font-bold">{set.entityName}</p>
                                                <p className="text-[10px] font-code text-muted-foreground uppercase">{set.id}</p>
                                            </TableCell>
                                            <TableCell className="text-xs">
                                                {new Date(set.settlementPeriodStart).toLocaleDateString()} - {new Date(set.settlementPeriodEnd).toLocaleDateString()}
                                            </TableCell>
                                            <TableCell className="text-right text-xs font-black text-sky-400">
                                                ₹ {set.totalAgencyCommission.toLocaleString()}
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant={set.status === 'paid' ? 'success' : 'warning'} className="text-[9px] font-black uppercase">
                                                    {set.status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right pr-6">
                                                {set.status === 'processed' && (
                                                    <Button variant="ghost" size="sm" className="h-8 text-[10px] font-black uppercase hover:text-accent">
                                                        Record Payment
                                                    </Button>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="analytics" className="space-y-6">
                    <div className="grid gap-6 md:grid-cols-2">
                        <Card className="bg-card">
                            <CardHeader>
                                <CardTitle>Channel Mix Profile</CardTitle>
                                <CardDescription>Transaction volume by booking channel.</CardDescription>
                            </CardHeader>
                            <CardContent className="h-[300px] flex flex-col items-center">
                                <ResponsiveContainer width="100%" height="100%">
                                    <RePieChart>
                                        <Pie
                                            data={channelData}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={60}
                                            outerRadius={80}
                                            paddingAngle={5}
                                            dataKey="value"
                                            stroke="none"
                                        >
                                            {channelData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                    </RePieChart>
                                </ResponsiveContainer>
                                <div className="flex gap-6 mt-2">
                                    {channelData.map(item => (
                                        <div key={item.name} className="flex items-center gap-2">
                                            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                                            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{item.name}</span>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="bg-card">
                            <CardHeader>
                                <CardTitle>Sector Yield Contribution</CardTitle>
                                <CardDescription>Platform revenue by service line.</CardDescription>
                            </CardHeader>
                            <CardContent className="h-[300px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={[
                                        { name: 'Charter', value: 12.5 },
                                        { name: 'Seats', value: 4.2 },
                                        { name: 'Stays', value: 1.8 }
                                    ]}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                                        <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} />
                                        <YAxis stroke="#94a3b8" fontSize={10} />
                                        <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b' }} />
                                        <Bar dataKey="value" name="Rev (₹ Lakhs)" fill="#0EA5E9" radius={[4, 4, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}
