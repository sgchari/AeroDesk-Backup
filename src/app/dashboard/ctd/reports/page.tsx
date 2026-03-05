'use client';

import { PageHeader } from "@/components/dashboard/shared/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download, FileText, PieChart, TrendingUp, Users, Briefcase, Calendar } from "lucide-react";
import { useCollection, useFirestore, useMemoFirebase } from "@/firebase";
import { useUser } from "@/hooks/use-user";
import { collection, query, where, orderBy } from "firebase/firestore";
import { Skeleton } from "@/components/ui/skeleton";
import type { CharterRFQ } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";

export default function CorporateReportsPage() {
    const { user } = useUser();
    const { toast } = useToast();
    const firestore = useFirestore();

    const rfqsQuery = useMemoFirebase(() => {
        if (!firestore || (firestore as any)._isMock || !user?.company) return null;
        return query(
            collection(firestore, 'charterRequests'),
            where('company', '==', user.company),
            orderBy('createdAt', 'desc')
        );
    }, [firestore, user]);

    const { data: rfqs, isLoading } = useCollection<CharterRFQ>(rfqsQuery, 'charterRequests');

    const handleExport = (reportType: string) => {
        toast({
            title: "Report Generation Active",
            description: `${reportType} is being compiled from institutional archives.`,
        });
    };

    return (
        <div className="space-y-6">
            <PageHeader 
                title="Institutional Audit & Reports" 
                description={`Consolidated travel governance and spend auditing for ${user?.company || 'Corporate Desk'}.`}
            >
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="h-9 gap-2 border-white/10 font-bold uppercase text-[9px] tracking-widest" onClick={() => handleExport('Spend Analysis')}>
                        <TrendingUp className="h-3.5 w-3.5" /> Spend Report
                    </Button>
                    <Button variant="outline" size="sm" className="h-9 gap-2 border-white/10 font-bold uppercase text-[9px] tracking-widest" onClick={() => handleExport('Compliance Audit')}>
                        <FileText className="h-3.5 w-3.5" /> Compliance PDF
                    </Button>
                </div>
            </PageHeader>

            <div className="grid gap-6 md:grid-cols-3">
                <Card className="bg-card">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-black uppercase tracking-widest text-muted-foreground">Budget Utilization</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-2xl font-black text-white">₹ 42.5 L</p>
                        <div className="h-1.5 w-full bg-white/5 rounded-full mt-3 overflow-hidden">
                            <div className="h-full bg-sky-400 w-[68%]" />
                        </div>
                        <p className="text-[10px] text-muted-foreground mt-2 uppercase font-bold">68% of Quarterly Allocation</p>
                    </CardContent>
                </Card>
                <Card className="bg-card">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-black uppercase tracking-widest text-muted-foreground">Policy Alignment</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-2xl font-black text-emerald-500">94.2%</p>
                        <div className="h-1.5 w-full bg-white/5 rounded-full mt-3 overflow-hidden">
                            <div className="h-full bg-emerald-500 w-[94%]" />
                        </div>
                        <p className="text-[10px] text-muted-foreground mt-2 uppercase font-bold">Adherence to Core Protocols</p>
                    </CardContent>
                </Card>
                <Card className="bg-card">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-black uppercase tracking-widest text-muted-foreground">Active Manifests</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-2xl font-black text-accent">12</p>
                        <div className="h-1.5 w-full bg-white/5 rounded-full mt-3 overflow-hidden">
                            <div className="h-full bg-accent w-[45%]" />
                        </div>
                        <p className="text-[10px] text-muted-foreground mt-2 uppercase font-bold">Authorized Personnel Movements</p>
                    </CardContent>
                </Card>
            </div>

            <Card className="bg-card">
                <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                        <PieChart className="h-4 w-4 text-primary" />
                        Organizational Spend Ledger
                    </CardTitle>
                    <CardDescription>Immutable log of employee travel requests and institutional settlements.</CardDescription>
                </CardHeader>
                <CardContent>
                    {isLoading ? <Skeleton className="h-64 w-full" /> : (
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow className="border-white/5">
                                        <TableHead className="text-[10px] uppercase font-black">Personnel / ID</TableHead>
                                        <TableHead className="text-[10px] uppercase font-black">Cost Center</TableHead>
                                        <TableHead className="text-[10px] uppercase font-black">Mission Sector</TableHead>
                                        <TableHead className="text-[10px] uppercase font-black text-right">Value (INR)</TableHead>
                                        <TableHead className="text-[10px] uppercase font-black text-center">Status</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {rfqs?.map((rfq) => (
                                        <TableRow key={rfq.id} className="border-white/5 hover:bg-white/[0.02] group">
                                            <TableCell className="py-4">
                                                <div className="space-y-1">
                                                    <p className="text-xs font-bold text-white">{rfq.customerName}</p>
                                                    <p className="text-[9px] text-muted-foreground font-code uppercase">{rfq.id}</p>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="outline" className="text-[9px] uppercase font-bold border-white/10 bg-white/5">
                                                    {rfq.costCenter || 'EXECUTIVE'}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <p className="text-[11px] font-medium text-muted-foreground">
                                                    {rfq.departure.split(' (')[0]} » {rfq.arrival.split(' (')[0]}
                                                </p>
                                                <p className="text-[9px] text-muted-foreground/60">{new Date(rfq.departureDate).toLocaleDateString()}</p>
                                            </TableCell>
                                            <TableCell className="text-right text-xs font-black text-accent">
                                                ₹ {rfq.totalAmount?.toLocaleString() || '---'}
                                            </TableCell>
                                            <TableCell className="text-center">
                                                <Badge className="text-[9px] uppercase font-black h-5">
                                                    {rfq.status}
                                                </Badge>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                            {(!rfqs || rfqs.length === 0) && (
                                <div className="text-center py-20 opacity-50">
                                    <Briefcase className="h-10 w-10 mx-auto text-muted-foreground/20 mb-4" />
                                    <p className="text-xs text-muted-foreground uppercase font-black tracking-widest">No active audit records</p>
                                </div>
                            )}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
