
'use client';
import { PageHeader } from "@/components/dashboard/shared/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { EmptyLeg } from "@/lib/types";
import { MoreHorizontal, PlusCircle, Globe, Ban } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { useUser } from "@/hooks/use-user";
import { useCollection, useFirestore, useMemoFirebase } from "@/firebase";
import { collection, query, where } from "firebase/firestore";
import { Skeleton } from "@/components/ui/skeleton";
import { CreateEmptyLegDialog } from "@/components/dashboard/operator/create-empty-leg-dialog";

const getStatusVariant = (status: EmptyLeg['status']) => {
    switch (status) {
        case 'Draft': return 'secondary';
        case 'Pending Approval': return 'warning';
        case 'Published': return 'default';
        case 'Closed': return 'outline';
        case 'Cancelled': return 'destructive';
        default: return 'secondary';
    }
}

export default function EmptyLegsPage() {
  const { user, isLoading: isUserLoading } = useUser();
  const firestore = useFirestore();

  const emptyLegsQuery = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return query(collection(firestore, 'emptyLegs'), where('operatorId', '==', user.id));
  }, [firestore, user]);
  const { data: emptyLegs, isLoading: emptyLegsLoading } = useCollection<EmptyLeg>(emptyLegsQuery, 'emptyLegs');

  const isLoading = isUserLoading || emptyLegsLoading;

  return (
    <>
      <PageHeader title="Revenue Optimization" description="Monetize positioning flights by listing allocatable seats on the marketplace.">
        <CreateEmptyLegDialog />
      </PageHeader>
      
      <Card className="bg-card">
        <CardHeader>
          <CardTitle>Empty Leg Inventory</CardTitle>
          <CardDescription>
            Flights subject to platform governance before synchronization with distributors.
          </CardDescription>
        </CardHeader>
        <CardContent>
            {isLoading ? <Skeleton className="h-64 w-full" /> : (
            <Table>
                <TableHeader>
                <TableRow>
                    <TableHead>Asset</TableHead>
                    <TableHead>Route</TableHead>
                    <TableHead>Departure</TableHead>
                    <TableHead className="text-center">Available</TableHead>
                    <TableHead className="text-center">Booked</TableHead>
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
                        <TableCell className="text-center font-bold">{leg.availableSeats}</TableCell>
                        <TableCell className="text-center">{leg.seatsAllocated || 0}</TableCell>
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
                                <DropdownMenuItem className="gap-2">Edit Details</DropdownMenuItem>
                                {leg.status === 'Draft' && <DropdownMenuItem className="gap-2 text-green-500 font-medium">Publish to Marketplace</DropdownMenuItem>}
                                <DropdownMenuItem className="text-destructive gap-2"><Ban className="h-3.5 w-3.5" /> Cancel Leg</DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </TableCell>
                    </TableRow>
                ))}
                </TableBody>
            </Table>
            )}
        </CardContent>
      </Card>
    </>
  );
}
