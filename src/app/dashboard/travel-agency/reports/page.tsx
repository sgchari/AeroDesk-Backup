'use client';

import { PageHeader } from "@/components/dashboard/shared/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useUser } from "@/hooks/use-user";
import { useCollection, useFirestore, useMemoFirebase } from "@/firebase";
import { collection, query, where, collectionGroup } from "firebase/firestore";
import { Skeleton } from "@/components/ui/skeleton";
import type { CharterRFQ, EmptyLegSeatAllocationRequest } from "@/lib/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StatsCard } from "@/components/dashboard/shared/stats-card";
import { StatsGrid } from "@/components/dashboard/shared/stats-grid";
import { Download, Search, Filter, History, TrendingUp, DollarSign, Plane } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

export default function AgencyReportsPage() {
    const { user, isLoading: isUserLoading } = useUser();
    const firestore = useFirestore();
    const [searchTerm, setSearchTerm] = useState("");

    // Fetch Charter History
    const charterQuery = useMemoFirebase(() => {
        if (!firestore || !user) return null;
        return query(collection(firestore, 'charterRFQs'), where('requesterExternalAuthId', '==', user.id));
    }, [firestore, user]);
    const { data: charters, isLoading: charterLoading } = useCollection<CharterRFQ>(charterQuery, 'charterRFQs');

    // Fetch Seat Request History
    const seatQuery = useMemoFirebase(() => {
        if (!firestore || !user) return null;
        return query(collectionGroup(firestore, 'seatAllocationRequests'), where('requesterExternalAuthId', '==', user.id));
    }, [firestore, user]);
    const { data: seatRequests, isLoading: seatLoading } = useCollection<EmptyLegSeatAllocationRequest>(seatQuery, 'emptyLegs/all/seatAllocationRequests');

    const isLoading = isUserLoading || charterLoading || seatLoading;

    // Filter logic for "History" (Closed/Confirmed/Cancelled)
    const charterHistory = charters?.filter(c => ['Confirmed', 'Cancelled', 'Expired', 'Closed'].includes(c.status)) || [];
    const seatHistory = seatRequests?.filter(s => ['Approved', 'Rejected', 'Cancelled'].includes(s.status)) || [];

    // Filter by search term
    const filteredCharters = charterHistory.filter(c => 
        c.departure.toLowerCase().includes(searchTerm.toLowerCase()) || 
        c.arrival.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.id.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const filteredSeats = seatHistory.filter(s => 
        s.emptyLegId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (s.clientReference?.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    // Calculate mock stats
    const totalCharters = charterHistory.length;
    const confirmedCharters = charterHistory.filter(c => c.status === 'Confirmed').length;
    const conversionRate = totalCharters > 0 ? Math.round((confirmedCharters / totalCharters) * 100) : 0;

    return (
        <>
            <PageHeader 
                title="Reports & History" 
                description="Audit institutional performance, track client trends, and export historical coordination data."
            >
                <Button variant="outline" className="gap-2">
                    <Download className="h-4 w-4" />
                    Export Audit CSV
                </Button>
            </PageHeader>

            <StatsGrid>
                <StatsCard 
                    title="Gross Coordination Value" 
                    value={isLoading ? <Skeleton className="h-6 w-20" /> : "₹ 1.2 Cr"} 
                    icon={DollarSign} 
                    description="Simulated total volume" 
                />
                <StatsCard 
                    title="Completed Movements" 
                    value={isLoading ? <Skeleton className="h-6 w-12" /> : (charterHistory.filter(c => c.status === 'Confirmed').length + seatHistory.filter(s => s.status === 'Approved').length).toString()} 
                    icon={Plane} 
                    description="Successfully synchronized" 
                />
                <StatsCard 
                    title="Inquiry Conversion" 
                    value={isLoading ? <Skeleton className="h-6 w-12" /> : `${conversionRate}%`} 
                    icon={TrendingUp} 
                    description="RFQ to Confirmation" 
                />
                <StatsCard 
                    title="Audit Records" 
                    value={isLoading ? <Skeleton className="h-6 w-12" /> : (charterHistory.length + seatHistory.length).toString()} 
                    icon={History} 
                    description="Total historical logs" 
                />
            </StatsGrid>

            <div className="flex flex-col md:flex-row gap-4 my-6">
                <div className="relative flex-grow">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input 
                        placeholder="Filter by sector, client ref, or ID..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 bg-muted/20 border-white/10"
                    />
                </div>
                <Button variant="outline" className="gap-2 border-white/10">
                    <Filter className="h-4 w-4" />
                    Date Filter
                </Button>
            </div>

            <Tabs defaultValue="charters" className="w-full">
                <TabsList className="bg-muted/20 border border-white/5 mb-4">
                    <TabsTrigger value="charters">Charter History</TabsTrigger>
                    <TabsTrigger value="seats">Seat Allocation History</TabsTrigger>
                </TabsList>

                <TabsContent value="charters">
                    <Card className="bg-card">
                        <CardHeader>
                            <CardTitle>Historical Charter RFQs</CardTitle>
                            <CardDescription>Detailed audit of institutional flight requests initiated by your agency.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {isLoading ? <Skeleton className="h-64 w-full" /> : (
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>RFQ ID</TableHead>
                                            <TableHead>Sector</TableHead>
                                            <TableHead>Execution Date</TableHead>
                                            <TableHead className="text-center">PAX</TableHead>
                                            <TableHead>Status</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filteredCharters.map((c) => (
                                            <TableRow key={c.id}>
                                                <TableCell className="font-code text-xs font-bold">{c.id}</TableCell>
                                                <TableCell className="text-sm">{c.departure} → {c.arrival}</TableCell>
                                                <TableCell className="text-xs text-muted-foreground">{new Date(c.departureDate).toLocaleDateString()}</TableCell>
                                                <TableCell className="text-center font-medium">{c.pax}</TableCell>
                                                <TableCell>
                                                    <Badge variant={c.status === 'Confirmed' ? 'success' : 'outline'} className="text-[10px] uppercase font-bold">
                                                        {c.status}
                                                    </Badge>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            )}
                            {(!isLoading && filteredCharters.length === 0) && (
                                <div className="text-center py-12 border-2 border-dashed rounded-lg bg-muted/5">
                                    <p className="text-muted-foreground">No historical charter records found for the current filter.</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="seats">
                    <Card className="bg-card">
                        <CardHeader>
                            <CardTitle>Historical Seat Leads</CardTitle>
                            <CardDescription>Archive of commercial seat allocation requests and outcomes.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {isLoading ? <Skeleton className="h-64 w-full" /> : (
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Lead ID</TableHead>
                                            <TableHead>Flight Ref</TableHead>
                                            <TableHead>Client Reference</TableHead>
                                            <TableHead className="text-center">Seats</TableHead>
                                            <TableHead>Outcome</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filteredSeats.map((s) => (
                                            <TableRow key={s.id}>
                                                <TableCell className="font-code text-xs">{s.id}</TableCell>
                                                <TableCell className="font-code text-[10px] uppercase text-accent">{s.emptyLegId}</TableCell>
                                                <TableCell className="text-sm font-medium">{s.clientReference || 'N/A'}</TableCell>
                                                <TableCell className="text-center font-bold">{s.numberOfSeats}</TableCell>
                                                <TableCell>
                                                    <Badge variant={s.status === 'Approved' ? 'success' : s.status === 'Rejected' ? 'destructive' : 'secondary'} className="text-[10px] uppercase font-bold">
                                                        {s.status}
                                                    </Badge>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            )}
                            {(!isLoading && filteredSeats.length === 0) && (
                                <div className="text-center py-12 border-2 border-dashed rounded-lg bg-muted/5">
                                    <p className="text-muted-foreground">No historical seat allocation records found.</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </>
    );
}
