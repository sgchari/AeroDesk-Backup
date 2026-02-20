
'use client';
import { PageHeader } from "@/components/dashboard/shared/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { Aircraft } from "@/lib/types";
import { MoreHorizontal, PlusCircle } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { useUser } from "@/hooks/use-user";
import { useCollection, useFirestore, useMemoFirebase } from "@/firebase";
import { collection } from "firebase/firestore";
import { Skeleton } from "@/components/ui/skeleton";

export default function FleetManagementPage() {
  const { user, isLoading: isUserLoading } = useUser();
  const firestore = useFirestore();

  const aircraftsQuery = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return collection(firestore, 'operators', user.id, 'aircrafts');
  }, [firestore, user]);
  const { data: aircrafts, isLoading: aircraftsLoading } = useCollection<Aircraft>(aircraftsQuery);

  const isLoading = isUserLoading || aircraftsLoading;

  return (
    <>
      <PageHeader title="Fleet Management" description="Manage your aircraft registry, availability, and operational status.">
        <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Aircraft
        </Button>
      </PageHeader>
      <Card>
        <CardHeader>
          <CardTitle>Your Fleet</CardTitle>
          <CardDescription>
            A list of all aircraft registered under your operator certificate.
          </CardDescription>
        </CardHeader>
        <CardContent>
            {isLoading ? <Skeleton className="h-64 w-full" /> : (
            <Table>
                <TableHeader>
                <TableRow>
                    <TableHead>Registration</TableHead>
                    <TableHead>Aircraft Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Pax Capacity</TableHead>
                    <TableHead>Home Base</TableHead>
                    <TableHead>
                    <span className="sr-only">Actions</span>
                    </TableHead>
                </TableRow>
                </TableHeader>
                <TableBody>
                {aircrafts?.map((ac: Aircraft) => (
                    <TableRow key={ac.id}>
                        <TableCell className="font-medium font-code">{ac.registration}</TableCell>
                        <TableCell>{ac.name}</TableCell>
                        <TableCell><Badge variant="outline">{ac.type}</Badge></TableCell>
                        <TableCell className="text-center">{ac.paxCapacity}</TableCell>
                        <TableCell>{ac.homeBase}</TableCell>
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
                                <DropdownMenuItem>Set Availability</DropdownMenuItem>
                                <DropdownMenuItem>View Compliance Docs</DropdownMenuItem>
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
