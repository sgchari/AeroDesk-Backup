
"use client";

import { PageHeader } from "@/components/dashboard/shared/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useUser } from "@/hooks/use-user";
import { useCollection, useFirestore, useMemoFirebase } from "@/firebase";
import { collection, query, where } from "firebase/firestore";
import { Skeleton } from "@/components/ui/skeleton";
import type { CharterRFQ } from "@/lib/types";
import { Search, Filter, Plane, Clock, History } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function CTDRequestsPage() {
    const { user, isLoading: isUserLoading } = useUser();
    const firestore = useFirestore();
    const [search, setSearch] = useState("");

    const rfqsQuery = useMemoFirebase(() => {
        if (!firestore || !user?.company) return null;
        return query(collection(firestore, 'charterRFQs'), where('company', '==', user.company));
    }, [firestore, user]);

    const { data: rfqs, isLoading: requestsLoading } = useCollection<CharterRFQ>(rfqsQuery, 'charterRFQs');

    const filteredRfqs = rfqs?.filter(r => 
        r.departure.toLowerCase().includes(search.toLowerCase()) || 
        r.arrival.toLowerCase().includes(search.toLowerCase()) ||
        r.customerName.toLowerCase().includes(search.toLowerCase())
    );

    const isLoading = isUserLoading || requestsLoading;

    return (
        <>
            <PageHeader title="Corporate Travel Demand" description="Consolidated queue of all charter and travel requests within your organization." />
            
            <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="relative flex-grow">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input 
                        placeholder="Filter by employee, route, or ID..." 
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-10 bg-muted/20 border-white/10"
                    />
                </div>
                <Button variant="outline" className="gap-2 border-white/10">
                    <Filter className="h-4 w-4" />
                    Policy Filters
                </Button>
            </div>

            <Card className="bg-card">
                <CardHeader>
                    <CardTitle>Organizational Demand Queue</CardTitle>
                    <CardDescription>A complete log of employee travel needs across the request lifecycle.</CardDescription>
                </CardHeader>
                <CardContent>
                    {isLoading ? <Skeleton className="h-64 w-full" /> : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Employee</TableHead>
                                    <TableHead>Journey Detail</TableHead>
                                    <TableHead>Schedule</TableHead>
                                    <TableHead>Cost Center</TableHead>
                                    <TableHead>Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredRfqs?.map((rfq) => (
                                    <TableRow key={rfq.id}>
                                        <TableCell>
                                            <div className="font-medium text-xs">{rfq.customerName}</div>
                                            <div className="text-[10px] text-muted-foreground font-code">{rfq.id}</div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <Plane className="h-3.5 w-3.5 text-accent/60" />
                                                <span className="text-xs">{rfq.departure} → {rfq.arrival}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                <Clock className="h-3.5 w-3.5" />
                                                {new Date(rfq.departureDate).toLocaleDateString()}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <span className="font-code text-[10px] uppercase text-muted-foreground">{rfq.costCenter || 'EXECUTIVE'}</span>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant={rfq.status === 'Bidding Open' ? 'success' : rfq.status === 'Pending Approval' ? 'warning' : 'outline'} className="text-[9px] uppercase font-bold tracking-wider">
                                                {rfq.status}
                                            </Badge>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                    {(!isLoading && filteredRfqs?.length === 0) && (
                        <div className="text-center py-20 border-2 border-dashed rounded-lg">
                            <History className="mx-auto h-10 w-10 text-muted-foreground/40 mb-4" />
                            <p className="text-muted-foreground">No organizational requests found matching the current criteria.</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </>
    );
}
