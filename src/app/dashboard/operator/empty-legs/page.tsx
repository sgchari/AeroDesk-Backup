'use client';
import { PageHeader } from "@/components/dashboard/shared/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { EmptyLeg } from "@/lib/types";
import { MoreHorizontal, PlusCircle, Globe, Ban, Armchair, Settings2 } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useUser } from "@/hooks/use-user";
import { useCollection, useFirestore, useMemoFirebase } from "@/firebase";
import { collection, query, where } from "firebase/firestore";
import { Skeleton } from "@/components/ui/skeleton";
import { CreateEmptyLegDialog } from "@/components/dashboard/operator/create-empty-leg-dialog";
import { ConfigureSeatAllocationDialog } from "@/components/dashboard/operator/configure-seat-allocation-dialog";
import { useState } from "react";

const getStatusVariant = (status: EmptyLeg['status']) => {
    switch (status) {
        case 'Draft': return 'secondary';
        case 'Pending Approval': return 'warning';
        case 'live':
        case 'Published': return 'default';
        case 'Closed': return 'outline';
        case 'Cancelled': return 'destructive';
        default: return 'secondary';
    }
}

export default function EmptyLegsPage() {
  const { user, isLoading: isUserLoading } = useUser();
  const firestore = useFirestore();
  const [selectedLeg, setSelectedLeg] = useState<EmptyLeg | null>(null);

  const emptyLegsQuery = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return query(collection(firestore, 'emptyLegs'), where('operatorId', '==', user.id));
  }, [firestore, user]);
  const { data: emptyLegs, isLoading: emptyLegsLoading } = useCollection<EmptyLeg>(emptyLegsQuery, 'emptyLegs');

  const isLoading = isUserLoading || emptyLegsLoading;

  return (
    <>
      <PageHeader title="Revenue Optimization" description="Monetize positioning flights by listing allocatable seats or publishing as full charter opportunities.">
        <div className="flex gap-2">
            <CreateEmptyLegDialog />
        </div>
      </PageHeader>
      
      <Card className="bg-card">
        <CardHeader>
          <CardTitle>Empty Leg Inventory</CardTitle>
          <CardDescription>
            Manage positioning flight availability and seat allocation parameters.
          </CardDescription>
        </CardHeader>
        <CardContent className="px-0 sm:px-6">
            <div className="w-full overflow-x-auto">
                {isLoading ? <div className="p-6"><Skeleton className="h-64 w-full" /></div> : (
                <Table className="min-w-[800px] sm:min-w-full">
                    <TableHeader>
                    <TableRow>
                        <TableHead>Asset</TableHead>
                        <TableHead>Route</TableHead>
                        <TableHead>Departure</TableHead>
                        <TableHead className="text-center">Seats</TableHead>
                        <TableHead className="text-center">Allocation</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                    </TableHeader>
                    <TableBody>
                    {emptyLegs?.map((leg: EmptyLeg) => (
                        <TableRow key={leg.id}>
                            <TableCell className="font-medium font-code">{leg.aircraftName || leg.aircraftId}</TableCell>
                            <TableCell>{leg.departure} to {leg.arrival}</TableCell>
                            <TableCell className="text-xs">{new Date(leg.departureTime).toLocaleString()}</TableCell>
                            <TableCell className="text-center">
                                <div className="flex flex-col">
                                    <span className="font-bold">{leg.availableSeats}</span>
                                    <span className="text-[8px] text-muted-foreground uppercase">Available</span>
                                </div>
                            </TableCell>
                            <TableCell className="text-center">
                                {leg.seatAllocationEnabled ? (
                                    <Badge variant="outline" className="bg-accent/10 text-accent border-accent/20 text-[8px] font-black uppercase">
                                        Enabled
                                    </Badge>
                                ) : (
                                    <span className="text-[10px] text-muted-foreground uppercase">Disabled</span>
                                )}
                            </TableCell>
                            <TableCell>
                                <Badge variant={getStatusVariant(leg.status)} className="text-[10px] h-5 font-bold uppercase tracking-wider">
                                    {leg.status}
                                </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                    <Button size="icon" variant="ghost">
                                        <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                    <DropdownMenuLabel>Inventory Controls</DropdownMenuLabel>
                                    <DropdownMenuItem onClick={() => setSelectedLeg(leg)} className="gap-2">
                                        <Armchair className="h-3.5 w-3.5" /> Configure Allocation
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem className="gap-2"><Settings2 className="h-3.5 w-3.5" /> Edit Flight Details</DropdownMenuItem>
                                    <DropdownMenuItem className="text-destructive gap-2"><Ban className="h-3.5 w-3.5" /> Cancel Flight</DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </TableCell>
                        </TableRow>
                    ))}
                    </TableBody>
                </Table>
                )}
            </div>
            {(!isLoading && (!emptyLegs || emptyLegs.length === 0)) && (
                <div className="text-center py-20 border-2 border-dashed rounded-lg bg-muted/5 mx-6">
                    <Globe className="mx-auto h-10 w-10 text-muted-foreground/20 mb-4" />
                    <p className="text-muted-foreground">No positioning flights registered.</p>
                </div>
            )}
        </CardContent>
      </Card>

      <ConfigureSeatAllocationDialog 
        leg={selectedLeg}
        open={!!selectedLeg}
        onOpenChange={(open) => !open && setSelectedLeg(null)}
      />
    </>
  );
}
