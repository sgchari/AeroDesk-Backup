'use client';

import { PageHeader } from "@/components/dashboard/shared/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download, FileText, History, DollarSign, Calendar, MapPin } from "lucide-react";
import { useCollection, useFirestore, useMemoFirebase } from "@/firebase";
import { useUser } from "@/hooks/use-user";
import { collection, query, where, orderBy } from "firebase/firestore";
import { Skeleton } from "@/components/ui/skeleton";
import type { CharterRFQ, Invoice } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";

export default function CustomerReportsPage() {
    const { user } = useUser();
    const { toast } = useToast();
    const firestore = useFirestore();

    const rfqsQuery = useMemoFirebase(() => {
        if (!firestore || (firestore as any)._isMock || !user) return null;
        return query(
            collection(firestore, 'charterRequests'),
            where('customerId', '==', user.id),
            orderBy('createdAt', 'desc')
        );
    }, [firestore, user]);

    const { data: rfqs, isLoading: rfqsLoading } = useCollection<CharterRFQ>(rfqsQuery, 'charterRequests');

    const handleExport = (format: string) => {
        toast({
            title: `Export Initialized`,
            description: `Mission expense history is being prepared in ${format} format.`,
        });
    };

    return (
        <div className="space-y-6">
            <PageHeader 
                title="Expense History & Reports" 
                description="Institutional log of your platform-coordinated mission expenditures and fiscal records."
            >
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="h-9 gap-2 border-white/10 font-bold uppercase text-[9px] tracking-widest" onClick={() => handleExport('PDF')}>
                        <Download className="h-3.5 w-3.5" /> Export PDF
                    </Button>
                    <Button variant="outline" size="sm" className="h-9 gap-2 border-white/10 font-bold uppercase text-[9px] tracking-widest" onClick={() => handleExport('CSV')}>
                        <FileText className="h-3.5 w-3.5" /> Export CSV
                    </Button>
                </div>
            </PageHeader>

            <Card className="bg-card">
                <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                        <History className="h-4 w-4 text-sky-400" />
                        Mission Expense Registry
                    </CardTitle>
                    <CardDescription>Archive of settled charter volumes and coordination fees.</CardDescription>
                </CardHeader>
                <CardContent>
                    {rfqsLoading ? <Skeleton className="h-64 w-full" /> : (
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow className="border-white/5">
                                        <TableHead className="text-[10px] uppercase font-black">Mission / Date</TableHead>
                                        <TableHead className="text-[10px] uppercase font-black">Route Index</TableHead>
                                        <TableHead className="text-[10px] uppercase font-black text-right">Settled Value</TableHead>
                                        <TableHead className="text-[10px] uppercase font-black text-center">Protocol State</TableHead>
                                        <TableHead className="text-right pr-6"><span className="sr-only">Actions</span></TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {rfqs?.map((rfq) => (
                                        <TableRow key={rfq.id} className="border-white/5 group hover:bg-white/[0.02]">
                                            <TableCell className="py-4">
                                                <div className="space-y-1">
                                                    <p className="text-xs font-bold font-code group-hover:text-sky-400 transition-colors">{rfq.id}</p>
                                                    <p className="text-[9px] text-muted-foreground flex items-center gap-1">
                                                        <Calendar className="h-2.5 w-2.5" /> {new Date(rfq.departureDate).toLocaleDateString()}
                                                    </p>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2 text-xs font-medium">
                                                    <MapPin className="h-3 w-3 text-sky-400/60" />
                                                    {rfq.departure.split(' (')[0]} → {rfq.arrival.split(' (')[0]}
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-right text-sm font-black text-accent">
                                                ₹ {rfq.totalAmount?.toLocaleString() || '---'}
                                            </TableCell>
                                            <TableCell className="text-center">
                                                <Badge variant="outline" className="text-[9px] uppercase font-black h-5 border-white/10">
                                                    {rfq.status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right pr-6">
                                                <Button variant="ghost" size="sm" className="h-8 text-[10px] font-black uppercase tracking-widest hover:text-sky-400">
                                                    Invoice <Download className="ml-2 h-3 w-3" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                            {(!rfqs || rfqs.length === 0) && (
                                <div className="text-center py-20 border-2 border-dashed rounded-xl bg-white/[0.01] border-white/5">
                                    <p className="text-xs text-muted-foreground uppercase font-black tracking-widest">No settled records identified</p>
                                </div>
                            )}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
