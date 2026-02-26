
'use client';

import { PageHeader } from "@/components/dashboard/shared/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useUser } from "@/hooks/use-user";
import { useCollection, useFirestore, useMemoFirebase } from "@/firebase";
import { collection, query, where } from "firebase/firestore";
import { Skeleton } from "@/components/ui/skeleton";
import type { AccommodationRequest } from "@/lib/types";
import { History, TrendingUp, BedDouble, CalendarCheck, Download, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatsCard } from "@/components/dashboard/shared/stats-card";
import { StatsGrid } from "@/components/dashboard/shared/stats-grid";
import { Input } from "@/components/ui/input";
import { useState } from "react";

export default function HotelReportsPage() {
    const { user, isLoading: isUserLoading } = useUser();
    const firestore = useFirestore();
    const [searchTerm, setSearchTerm] = useState("");

    const requestsQuery = useMemoFirebase(() => {
        if (!firestore || !user) return null;
        return query(collection(firestore, 'accommodationRequests'), where('hotelPartnerId', '==', user.id));
    }, [firestore, user]);

    const { data: requests, isLoading: requestsLoading } = useCollection<AccommodationRequest>(
        requestsQuery, 
        'accommodationRequests'
    );

    const isLoading = isUserLoading || requestsLoading;

    // Simulate historical data by looking at confirmed/declined/completed requests
    const historicalRequests = requests?.filter(r => 
        ['Confirmed', 'Declined', 'Completed'].includes(r.status)
    ) || [];

    const filteredHistory = historicalRequests.filter(r => 
        r.guestName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.propertyName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.id.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const stats = {
        totalMovements: historicalRequests.length,
        confirmedNights: historicalRequests.filter(r => r.status === 'Confirmed').length * 2, // simulated multiplier
        conversion: historicalRequests.length > 0 
            ? Math.round((historicalRequests.filter(r => r.status === 'Confirmed').length / historicalRequests.length) * 100) 
            : 0
    };

    return (
        <>
            <PageHeader 
                title="Historical Performance & Audit" 
                description="View aggregate metrics and a complete audit trail of all stay coordination activity."
            >
                <Button variant="outline" className="gap-2">
                    <Download className="h-4 w-4" />
                    Export Audit Log
                </Button>
            </PageHeader>

            <StatsGrid>
                <StatsCard 
                    title="Total Requests Processed" 
                    value={isLoading ? <Skeleton className="h-6 w-12" /> : stats.totalMovements.toString()} 
                    icon={History} 
                    description="Confirmed & Declined" 
                />
                <StatsCard 
                    title="AeroDesk Occupancy" 
                    value={isLoading ? <Skeleton className="h-6 w-12" /> : stats.confirmedNights.toString()} 
                    icon={BedDouble} 
                    description="Room nights confirmed" 
                />
                <StatsCard 
                    title="Inquiry Conversion" 
                    value={isLoading ? <Skeleton className="h-6 w-12" /> : `${stats.conversion}%`} 
                    icon={TrendingUp} 
                    description="Request to Confirmation" 
                />
                <StatsCard 
                    title="Partner Tier" 
                    value="Verified" 
                    icon={CalendarCheck} 
                    description="NSOP Infrastructure Partner" 
                />
            </StatsGrid>

            <div className="flex flex-col md:flex-row gap-4 my-6">
                <div className="relative flex-grow">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input 
                        placeholder="Search by guest, property, or ID..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 bg-muted/20 border-white/10 h-11"
                    />
                </div>
            </div>

            <Card className="bg-card">
                <CardHeader>
                    <CardTitle>Stay Coordination History</CardTitle>
                    <CardDescription>
                        A complete record of accommodation requests linked to platform charter activity.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {isLoading ? <Skeleton className="h-64 w-full" /> : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Request ID</TableHead>
                                    <TableHead>Guest / Client</TableHead>
                                    <TableHead>Property</TableHead>
                                    <TableHead>Execution Date</TableHead>
                                    <TableHead>Outcome</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredHistory.map((req) => (
                                    <TableRow key={req.id}>
                                        <TableCell className="font-code text-xs font-bold">{req.id}</TableCell>
                                        <TableCell className="text-sm">{req.guestName || 'VIP Client'}</TableCell>
                                        <TableCell className="text-sm text-muted-foreground">{req.propertyName}</TableCell>
                                        <TableCell className="text-xs text-muted-foreground">{new Date(req.checkIn).toLocaleDateString()}</TableCell>
                                        <TableCell>
                                            <Badge variant={req.status === 'Confirmed' ? 'success' : req.status === 'Declined' ? 'destructive' : 'secondary'} className="text-[10px] uppercase font-bold tracking-wider">
                                                {req.status}
                                            </Badge>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                    {(!isLoading && filteredHistory.length === 0) && (
                        <div className="text-center py-20 border-2 border-dashed rounded-lg bg-muted/5">
                            <p className="text-muted-foreground">No historical records match your filter criteria.</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </>
    );
}
