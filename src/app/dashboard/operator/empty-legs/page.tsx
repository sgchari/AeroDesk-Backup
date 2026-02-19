import { PageHeader } from "@/components/dashboard/shared/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getMockDataForRole } from "@/lib/data";
import type { EmptyLeg } from "@/lib/types";
import { MoreHorizontal, PlusCircle } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const getStatusVariant = (status: EmptyLeg['status']) => {
    switch (status) {
        case 'Pending Approval': return 'destructive';
        case 'Approved': return 'default';
        case 'Expired': return 'secondary';
        default: return 'outline';
    }
}

export default function EmptyLegsPage() {
  const { emptyLegs } = getMockDataForRole('Operator');

  return (
    <>
      <PageHeader title="Empty Leg Management" description="Create and manage your empty leg flights.">
        <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Create Empty Leg
        </Button>
      </PageHeader>
      <Card>
        <CardHeader>
          <CardTitle>Your Empty Legs</CardTitle>
          <CardDescription>
            Flights subject to admin approval before being listed on the marketplace.
          </CardDescription>
        </CardHeader>
        <CardContent>
            <Table>
                <TableHeader>
                <TableRow>
                    <TableHead>Flight ID</TableHead>
                    <TableHead>Route</TableHead>
                    <TableHead>Departure Time</TableHead>
                    <TableHead>Seats</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>
                    <span className="sr-only">Actions</span>
                    </TableHead>
                </TableRow>
                </TableHeader>
                <TableBody>
                {emptyLegs?.map((leg: EmptyLeg) => (
                    <TableRow key={leg.id}>
                        <TableCell className="font-medium font-code">{leg.id}</TableCell>
                        <TableCell>{leg.departure} to {leg.arrival}</TableCell>
                        <TableCell>{leg.departureTime}</TableCell>
                        <TableCell className="text-center">{leg.availableSeats}</TableCell>
                        <TableCell>
                            <Badge variant={getStatusVariant(leg.status)}>{leg.status}</Badge>
                        </TableCell>
                        <TableCell>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                <Button aria-haspopup="true" size="icon" variant="ghost">
                                    <MoreHorizontal className="h-4 w-4" />
                                    <span className="sr-only">Toggle menu</span>
                                </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuItem>Edit Details</DropdownMenuItem>
                                {leg.status === 'Pending Approval' && <DropdownMenuItem>Withdraw</DropdownMenuItem>}
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </TableCell>
                    </TableRow>
                ))}
                </TableBody>
            </Table>
        </CardContent>
      </Card>
    </>
  );
}
