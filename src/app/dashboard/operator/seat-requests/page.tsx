
'use client';
import { PageHeader } from "@/components/dashboard/shared/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { EmptyLegSeatAllocationRequest } from "@/lib/types";
import { MoreHorizontal, Users, CheckCircle, XCircle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useCollection, useFirestore, useMemoFirebase } from "@/firebase";
import { collectionGroup, query } from "firebase/firestore";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { ProcessSeatRequestDialog } from "@/components/dashboard/operator/process-seat-request-dialog";

export default function SeatRequestsPage() {
  const firestore = useFirestore();
  const [selectedRequest, setSelectedRequest] = useState<EmptyLegSeatAllocationRequest | null>(null);

  // Fetch seat requests using the normalized institutional path
  const requestsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collectionGroup(firestore, 'seatAllocationRequests'));
  }, [firestore]);
  
  const { data: requests, isLoading } = useCollection<EmptyLegSeatAllocationRequest>(requestsQuery, 'seatAllocationRequests');

  return (
    <>
      <PageHeader title="Seat Allocation Queue" description="Review time-critical seat allocation leads for your active empty legs." />
      
      <Card className="bg-card border-l-4 border-l-accent shadow-2xl">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
                <CardTitle>Incoming Commercial Leads</CardTitle>
                <CardDescription>
                    Requests for individual seats awaiting operator confirmation.
                </CardDescription>
            </div>
            {requests && requests.length > 0 && (
                <Badge variant="outline" className="bg-accent/10 border-accent/20 text-accent font-black text-[9px] uppercase tracking-widest">
                    {requests.filter(r => r.status === 'Requested').length} PENDING
                </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="px-0 sm:px-6">
            <div className="w-full overflow-x-auto">
                {isLoading ? <div className="p-6"><Skeleton className="h-64 w-full" /></div> : (
                <Table className="min-w-[850px] sm:min-w-full">
                    <TableHeader>
                    <TableRow className="border-white/5">
                        <TableHead className="text-[10px] uppercase font-black text-muted-foreground">Lead ID</TableHead>
                        <TableHead className="text-[10px] uppercase font-black text-muted-foreground">Empty Leg Ref</TableHead>
                        <TableHead className="text-[10px] uppercase font-black text-muted-foreground">Passenger / Client</TableHead>
                        <TableHead className="text-center text-[10px] uppercase font-black text-muted-foreground">Seats</TableHead>
                        <TableHead className="text-[10px] uppercase font-black text-muted-foreground">Received</TableHead>
                        <TableHead className="text-[10px] uppercase font-black text-muted-foreground">Status</TableHead>
                        <TableHead className="text-right text-[10px] uppercase font-black text-muted-foreground">Actions</TableHead>
                    </TableRow>
                    </TableHeader>
                    <TableBody>
                    {requests?.map((req: EmptyLegSeatAllocationRequest) => (
                        <TableRow key={req.id} className="border-white/5 hover:bg-white/[0.02] group">
                            <TableCell className="font-medium font-code text-xs py-4">{req.id}</TableCell>
                            <TableCell className="font-code text-xs text-accent">{req.emptyLegId}</TableCell>
                            <TableCell className="whitespace-nowrap">
                                <div className="font-bold text-sm text-foreground">{req.passengerName || 'Institutional Client'}</div>
                                <div className="text-[9px] text-muted-foreground uppercase font-medium">{req.clientReference || 'Direct Request'}</div>
                            </TableCell>
                            <TableCell className="text-center font-black text-xs">{req.numberOfSeats}</TableCell>
                            <TableCell className="text-[10px] text-muted-foreground whitespace-nowrap">
                                <div className="flex items-center gap-1">
                                    <Clock className="h-3 w-3" />
                                    {new Date(req.requestDateTime).toLocaleString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                                </div>
                            </TableCell>
                            <TableCell>
                                <Badge variant={req.status === 'Requested' ? 'warning' : req.status === 'Approved' ? 'success' : 'outline'} className="text-[10px] h-5 font-bold uppercase tracking-wider whitespace-nowrap">
                                    {req.status}
                                </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                    <Button size="icon" variant="ghost" className="h-8 w-8 hover:bg-white/10">
                                        <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                    <DropdownMenuLabel>Coordination Actions</DropdownMenuLabel>
                                    <DropdownMenuItem onClick={() => setSelectedRequest(req)} className="gap-2">
                                        <CheckCircle className="h-3.5 w-3.5 text-green-500" /> Review & Approve
                                    </DropdownMenuItem>
                                    <DropdownMenuItem className="text-destructive gap-2">
                                        <XCircle className="h-3.5 w-3.5" /> Decline Request
                                    </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </TableCell>
                        </TableRow>
                    ))}
                    </TableBody>
                </Table>
                )}
            </div>
            {(!isLoading && (!requests || requests.length === 0)) && (
                <div className="text-center py-24 border-2 border-dashed rounded-lg bg-muted/5 border-white/5 opacity-60">
                    <Users className="mx-auto h-12 w-12 text-muted-foreground/20 mb-4" />
                    <p className="text-xs text-muted-foreground uppercase font-black tracking-[0.2em]">Queue Clear</p>
                    <p className="text-[10px] text-muted-foreground mt-1">No active seat requests in the coordination workspace.</p>
                </div>
            )}
        </CardContent>
      </Card>

      <ProcessSeatRequestDialog 
        request={selectedRequest}
        open={!!selectedRequest}
        onOpenChange={(open) => !open && setSelectedRequest(null)}
      />
    </>
  );
}
