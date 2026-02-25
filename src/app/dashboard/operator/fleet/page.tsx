
'use client';
import { PageHeader } from "@/components/dashboard/shared/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { Aircraft } from "@/lib/types";
import { MoreHorizontal, PlusCircle, CalendarDays, BarChart, FileCheck } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { useUser } from "@/hooks/use-user";
import { useCollection, useFirestore, useMemoFirebase } from "@/firebase";
import { collection } from "firebase/firestore";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";


const getStatusVariant = (status: Aircraft['status']) => {
    switch (status) {
        case 'Available': return 'default';
        case 'Under Maintenance': return 'warning';
        case 'AOG': return 'destructive';
        case 'Restricted': return 'secondary';
        default: return 'outline';
    }
}

export default function FleetManagementPage() {
  const { user, isLoading: isUserLoading } = useUser();
  const firestore = useFirestore();

  const aircraftsQuery = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return collection(firestore, 'operators', user.id, 'aircrafts');
  }, [firestore, user]);
  const { data: aircrafts, isLoading: aircraftsLoading } = useCollection<Aircraft>(aircraftsQuery, user ? `operators/${user.id}/aircrafts` : undefined);

  const isLoading = isUserLoading || aircraftsLoading;

  return (
    <>
      <PageHeader title="Fleet Management" description="Manage your aircraft registry, availability, and operational status.">
        <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Aircraft
        </Button>
      </PageHeader>
      
      {isLoading ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Skeleton className="h-56 w-full" />
            <Skeleton className="h-56 w-full" />
            <Skeleton className="h-56 w-full" />
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {aircrafts?.map((ac: Aircraft) => (
                <Card key={ac.id} className="flex flex-col">
                    <CardHeader>
                        <div className="flex items-start justify-between">
                            <div>
                                <CardTitle className="text-lg">{ac.name}</CardTitle>
                                <CardDescription className="font-code">{ac.registration}</CardDescription>
                            </div>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                <Button aria-haspopup="true" size="icon" variant="ghost" className="h-8 w-8 -mt-2 -mr-2">
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
                        </div>
                    </CardHeader>
                    <CardContent className="flex-grow space-y-3">
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Type</span>
                            <span className="font-medium">{ac.type}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Pax Capacity</span>
                            <span className="font-medium">{ac.paxCapacity}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Home Base</span>
                            <span className="font-medium">{ac.homeBase}</span>
                        </div>
                         <div className="flex items-center justify-between text-sm pt-2">
                            <span className="text-muted-foreground">Status</span>
                            <Badge variant={getStatusVariant(ac.status)}>{ac.status}</Badge>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
      )}
    </>
  );
}
