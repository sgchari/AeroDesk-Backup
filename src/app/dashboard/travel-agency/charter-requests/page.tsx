'use client';
import { PageHeader } from "@/components/dashboard/shared/page-header";
import { CreateRfqDialog } from "@/components/dashboard/customer/create-rfq-dialog";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import type { CharterRFQ, RfqStatus } from "@/lib/types";
import { MoreHorizontal, ArrowRight, Plane, Users, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useUser } from "@/hooks/use-user";
import { Skeleton } from "@/components/ui/skeleton";
import { useCollection, useFirestore, useMemoFirebase } from "@/firebase";
import { collection, query, where } from "firebase/firestore";
import Link from 'next/link';

const getStatusVariant = (status: RfqStatus) => {
    switch (status) {
        case 'Draft': return 'secondary';
        case 'rfqSubmitted': return 'warning';
        case 'quoteReceived': return 'primary';
        case 'quoteAccepted': return 'success';
        case 'tripClosed': return 'outline';
        case 'cancelled': return 'destructive';
        default: return 'secondary';
    }
}

export default function CharterRequestsPage() {
  const { user, isLoading: isUserLoading } = useUser();
  const firestore = useFirestore();

  const rfqsQuery = useMemoFirebase(() => {
    if (!firestore || (firestore as any)._isMock || !user) return null;
    return query(collection(firestore, 'charterRequests'), where('requesterExternalAuthId', '==', user.id));
  }, [firestore, user]);
  const { data: rfqs, isLoading: rfqsLoading } = useCollection<CharterRFQ>(rfqsQuery, 'charterRequests');

  const isLoading = isUserLoading || rfqsLoading;

  return (
    <>
      <PageHeader title="Client Charter Requests" description="Commercial queue for institutional charter journeys managed by your agency.">
        <CreateRfqDialog />
      </PageHeader>
      
      <div className="grid gap-6">
        {isLoading ? (
            <Skeleton className="h-64 w-full" />
        ) : (
            <Card className="bg-card overflow-hidden">
                <CardHeader>
                    <CardTitle>Active Charter Coordination</CardTitle>
                    <CardDescription>Track status transitions from RFQ submission to commercial closure.</CardDescription>
                </CardHeader>
                <CardContent className="px-0">
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow className="border-white/5 hover:bg-transparent">
                                    <TableHead className="pl-6 text-[10px] uppercase font-black">Missions</TableHead>
                                    <TableHead className="text-[10px] uppercase font-black">Asset Pref</TableHead>
                                    <TableHead className="text-[10px] uppercase font-black text-center">Pax</TableHead>
                                    <TableHead className="text-[10px] uppercase font-black">Status</TableHead>
                                    <TableHead className="text-right pr-6"><span className="sr-only">Actions</span></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {rfqs?.map((rfq) => (
                                    <TableRow key={rfq.id} className="border-white/5 hover:bg-white/[0.02] group">
                                        <TableCell className="pl-6 py-4">
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-xs font-bold">{rfq.departure} to {rfq.arrival}</span>
                                                </div>
                                                <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
                                                    <span className="font-code uppercase tracking-tighter text-accent">{rfq.id}</span>
                                                    <span className="flex items-center gap-1"><Clock className="h-2.5 w-2.5" /> {new Date(rfq.departureDate).toLocaleDateString()}</span>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className="text-[9px] border-white/10 uppercase">{rfq.aircraftType}</Badge>
                                        </TableCell>
                                        <TableCell className="text-center font-bold text-xs">{rfq.pax}</TableCell>
                                        <TableCell>
                                            <Badge variant={getStatusVariant(rfq.status) as any} className="text-[9px] font-black uppercase tracking-tighter h-5">
                                                {rfq.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right pr-6">
                                            <Button asChild variant="ghost" size="sm" className="h-8 text-[10px] font-bold uppercase gap-2 hover:bg-accent/10 hover:text-accent">
                                                <Link href={`/dashboard/travel-agency/execution/${rfq.id}?type=charter`}>
                                                    Execute <ArrowRight className="h-3 w-3" />
                                                </Link>
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                    {(!rfqs || rfqs.length === 0) && (
                        <div className="text-center py-20">
                            <Plane className="mx-auto h-10 w-10 text-muted-foreground/20 mb-4" />
                            <p className="text-muted-foreground">No active charter requests.</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        )}
      </div>
    </>
  );
}