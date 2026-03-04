'use client';

import { PageHeader } from "@/components/dashboard/shared/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { StatsCard } from "@/components/dashboard/shared/stats-card";
import { StatsGrid } from "@/components/dashboard/shared/stats-grid";
import { useCollection, useFirestore, useMemoFirebase } from "@/firebase";
import { useUser } from "@/hooks/use-user";
import { collection, query, where, orderBy } from "firebase/firestore";
import { Skeleton } from "@/components/ui/skeleton";
import type { CommissionLedgerEntry, SettlementRecord } from "@/lib/types";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { 
    Coins, 
    Zap, 
    ArrowRight, 
    Clock, 
    CheckCircle2, 
    History,
    TrendingUp,
    Briefcase
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

export default function AgencyRevenuePortal() {
    const { user } = useUser();
    const firestore = useFirestore();

    const { data: ledger, isLoading: ledgerLoading } = useCollection<CommissionLedgerEntry>(
        useMemoFirebase(() => {
            if (!firestore || (firestore as any)._isMock || !user) return null;
            return query(
                collection(firestore, 'commissionLedger'),
                where('entityId', '==', user.id),
                orderBy('createdAt', 'desc')
            );
        }, [firestore, user]),
        'commissionLedger'
    );

    const { data: settlements, isLoading: settlementsLoading } = useCollection<SettlementRecord>(
        useMemoFirebase(() => {
            if (!firestore || (firestore as any)._isMock || !user) return null;
            return query(
                collection(firestore, 'settlementRecords'),
                where('entityId', '==', user.id),
                orderBy('createdAt', 'desc')
            );
        }, [firestore, user]),
        'settlementRecords'
    );

    const isLoading = ledgerLoading || settlementsLoading;

    const pendingEarnings = ledger?.filter(l => l.status === 'pending').reduce((acc, curr) => acc + (curr.agencyCommissionAmount || 0), 0) || 0;
    const settledEarnings = settlements?.filter(s => s.status === 'paid').reduce((acc, curr) => acc + (curr.totalAgencyCommission || 0), 0) || 0;

    return (
        <div className="space-y-6">
            <PageHeader 
                title="Earnings & Revenue Share" 
                description="Institutional visibility into your commission accruals, revenue share splits, and settlement history."
            />

            <StatsGrid>
                <StatsCard title="Accrued Earnings" value={isLoading ? <Skeleton className="h-6 w-12" /> : `₹ ${(pendingEarnings / 1000).toFixed(1)} K`} icon={Clock} description="Awaiting settlement" />
                <StatsCard title="Total Settled" value={isLoading ? <Skeleton className="h-6 w-12" /> : `₹ ${(settledEarnings / 1000).toFixed(1)} K`} icon={CheckCircle2} description="Paid to agency" />
                <StatsCard title="Avg. Share Ratio" value="65%" icon={Zap} description="Across all services" />
                <StatsCard title="Active Leads" value={ledger?.filter(l => l.status === 'pending').length.toString() || "0"} icon={Briefcase} description="In coordination" />
            </StatsGrid>

            <Tabs defaultValue="transactions" className="w-full">
                <TabsList className="bg-muted/20 border border-white/5 mb-6 p-1">
                    <TabsTrigger value="transactions" className="gap-2">
                        <History className="h-3.5 w-3.5" /> Recent Accruals
                    </TabsTrigger>
                    <TabsTrigger value="payouts" className="gap-2">
                        <Coins className="h-3.5 w-3.5" /> Payout History
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="transactions" className="space-y-6">
                    <Card className="bg-card">
                        <CardHeader>
                            <CardTitle>Commission Accrual Log</CardTitle>
                            <CardDescription>Transaction-level visibility into your revenue share per mission.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {isLoading ? <Skeleton className="h-64 w-full" /> : (
                                <Table>
                                    <TableHeader>
                                        <TableRow className="border-white/5">
                                            <TableHead className="text-[10px] uppercase font-black">Mission ID</TableHead>
                                            <TableHead className="text-[10px] uppercase font-black">Service</TableHead>
                                            <TableHead className="text-[10px] uppercase font-black text-right">Total Commission</TableHead>
                                            <TableHead className="text-[10px] uppercase font-black text-right">Your Share</TableHead>
                                            <TableHead className="text-[10px] uppercase font-black text-center">Status</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {ledger?.map((entry) => (
                                            <TableRow key={entry.id} className="border-white/5 group hover:bg-white/[0.02]">
                                                <TableCell className="py-4">
                                                    <p className="text-xs font-bold font-code group-hover:text-accent transition-colors">{entry.transactionId}</p>
                                                    <p className="text-[9px] text-muted-foreground">{entry.createdAt ? new Date(entry.createdAt).toLocaleDateString() : 'N/A'}</p>
                                                </TableCell>
                                                <TableCell className="capitalize text-[10px] font-bold">{entry.serviceType}</TableCell>
                                                <TableCell className="text-right text-xs">₹ {(entry.totalCommission || 0).toLocaleString()}</TableCell>
                                                <TableCell className="text-right text-xs font-black text-accent">
                                                    ₹ {(entry.agencyCommissionAmount || 0).toLocaleString()}
                                                    <span className="ml-1 text-[8px] text-muted-foreground">({entry.agencySharePercent}%)</span>
                                                </TableCell>
                                                <TableCell className="text-center">
                                                    <Badge variant={entry.status === 'settled' ? 'success' : 'outline'} className="text-[9px] uppercase h-5 font-black">
                                                        {entry.status}
                                                    </Badge>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="payouts" className="space-y-6">
                    <Card className="bg-card">
                        <CardHeader>
                            <CardTitle>Institutional Settlement Archive</CardTitle>
                            <CardDescription>Archive of processed payouts from AeroDesk.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow className="border-white/5">
                                        <TableHead className="text-[10px] uppercase font-black">Settlement ID</TableHead>
                                        <TableHead className="text-[10px] uppercase font-black">Period Scope</TableHead>
                                        <TableHead className="text-[10px] uppercase font-black text-right">Payout Amount</TableHead>
                                        <TableHead className="text-[10px] uppercase font-black">Status</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {settlements?.map(set => (
                                        <TableRow key={set.id} className="border-white/5">
                                            <TableCell className="py-4">
                                                <p className="text-xs font-bold font-code">{set.id}</p>
                                                <p className="text-[9px] text-muted-foreground uppercase">{set.paymentReference || 'Batch Settlement'}</p>
                                            </TableCell>
                                            <TableCell className="text-[10px]">
                                                {set.settlementPeriodStart && set.settlementPeriodEnd ? 
                                                    `${new Date(set.settlementPeriodStart).toLocaleDateString()} - ${new Date(set.settlementPeriodEnd).toLocaleDateString()}` 
                                                    : 'N/A'}
                                            </TableCell>
                                            <TableCell className="text-right text-xs font-black text-accent">₹ {(set.totalAgencyCommission || 0).toLocaleString()}</TableCell>
                                            <TableCell>
                                                <Badge className="bg-green-500/20 text-green-500 border-none text-[9px] uppercase font-black">
                                                    {set.status}
                                                </Badge>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}