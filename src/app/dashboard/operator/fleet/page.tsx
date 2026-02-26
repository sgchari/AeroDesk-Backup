
'use client';
import { PageHeader } from "@/components/dashboard/shared/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { Aircraft } from "@/lib/types";
import { MoreHorizontal, PlusCircle, Activity } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { useUser } from "@/hooks/use-user";
import { useCollection, useFirestore, useMemoFirebase } from "@/firebase";
import { collection } from "firebase/firestore";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";
import { UpdateAircraftStatusDialog } from "@/components/dashboard/operator/update-aircraft-status-dialog";

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
  const [selectedAircraft, setSelectedAircraft] = useState<Aircraft | null>(null);

  const aircraftsQuery = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return collection(firestore, 'operators', user.id, 'aircrafts');
  }, [firestore, user]);
  const { data: aircrafts, isLoading: aircraftsLoading } = useCollection<Aircraft>(aircraftsQuery, user ? `operators/${user.id}/aircrafts` : undefined);

  const isLoading = isUserLoading || aircraftsLoading;

  return (
    <>
      <PageHeader title="Fleet Control" description="Manage your digital aircraft registry, availability states, and AOG synchronization.">
        <Button variant="outline" className="gap-2"><PlusCircle className="h-4 w-4" /> Add Asset</Button>
      </PageHeader>
      
      {isLoading ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            <Skeleton className="h-56 w-full" />
            <Skeleton className="h-56 w-full" />
            <Skeleton className="h-56 w-full" />
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {aircrafts?.map((ac: Aircraft) => (
                <Card key={ac.id} className="bg-card flex flex-col group hover:border-accent/30 transition-all">
                    <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                            <div>
                                <CardTitle className="text-base font-bold group-hover:text-accent transition-colors">{ac.name}</CardTitle>
                                <CardDescription className="font-code text-xs uppercase tracking-widest">{ac.registration}</CardDescription>
                            </div>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                <Button size="icon" variant="ghost" className="h-8 w-8 -mt-2 -mr-2">
                                    <MoreHorizontal className="h-4 w-4" />
                                </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Asset Management</DropdownMenuLabel>
                                <DropdownMenuItem onClick={() => setSelectedAircraft(ac)} className="gap-2">
                                    <Activity className="h-3.5 w-3.5" /> Update Status
                                </DropdownMenuItem>
                                <DropdownMenuItem>Edit Specifications</DropdownMenuItem>
                                <DropdownMenuItem>Compliance Logs</DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </CardHeader>
                    <CardContent className="flex-grow space-y-3">
                        <div className="flex items-center justify-between text-[11px] uppercase tracking-tighter text-muted-foreground border-b border-white/5 pb-2">
                            <span>Status</span>
                            <Badge variant={getStatusVariant(ac.status)} className="h-5 font-bold">{ac.status}</Badge>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                            <div className="p-2 bg-muted/20 rounded">
                                <p className="text-[9px] uppercase text-muted-foreground font-bold">Category</p>
                                <p className="font-medium truncate">{ac.type}</p>
                            </div>
                            <div className="p-2 bg-muted/20 rounded">
                                <p className="text-[9px] uppercase text-muted-foreground font-bold">Base</p>
                                <p className="font-medium truncate">{ac.homeBase}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
      )}

      <UpdateAircraftStatusDialog 
        aircraft={selectedAircraft}
        open={!!selectedAircraft}
        onOpenChange={(open) => !open && setSelectedAircraft(null)}
      />
    </>
  );
}
