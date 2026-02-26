'use client';
import { PageHeader } from "@/components/dashboard/shared/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { Aircraft } from "@/lib/types";
import { MoreHorizontal, PlusCircle, Activity, Settings2, ShieldCheck, Users, Plane } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { useUser } from "@/hooks/use-user";
import { useCollection, useFirestore, useMemoFirebase } from "@/firebase";
import { collection } from "firebase/firestore";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";
import { UpdateAircraftStatusDialog } from "@/components/dashboard/operator/update-aircraft-status-dialog";
import { AddAircraftDialog } from "@/components/dashboard/operator/add-aircraft-dialog";
import { EditAircraftDialog } from "@/components/dashboard/operator/edit-aircraft-dialog";
import Image from "next/image";

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
  const [statusAircraft, setStatusAircraft] = useState<Aircraft | null>(null);
  const [editAircraft, setEditAircraft] = useState<Aircraft | null>(null);
  const [isAddOpen, setIsAddOpen] = useState(false);

  const aircraftsQuery = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return collection(firestore, 'operators', user.id, 'aircrafts');
  }, [firestore, user]);
  const { data: aircrafts, isLoading: aircraftsLoading } = useCollection<Aircraft>(aircraftsQuery, user ? `operators/${user.id}/aircrafts` : undefined);

  const isLoading = isUserLoading || aircraftsLoading;

  return (
    <>
      <PageHeader title="Fleet Control" description="Manage your digital aircraft registry, availability states, and technical specifications.">
        <Button onClick={() => setIsAddOpen(true)} className="bg-accent text-accent-foreground hover:bg-accent/90">
            <PlusCircle className="h-4 w-4 mr-2" />
            Add Asset
        </Button>
      </PageHeader>
      
      {isLoading ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            <Skeleton className="h-80 w-full" />
            <Skeleton className="h-80 w-full" />
            <Skeleton className="h-80 w-full" />
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {aircrafts?.map((ac: Aircraft) => (
                <Card key={ac.id} className="bg-card flex flex-col group hover:border-accent/30 transition-all overflow-hidden">
                    <div className="relative h-44 w-full bg-muted/20">
                        <Image 
                            src={ac.exteriorImageUrl || `https://images.unsplash.com/photo-1540962351504-03099e0a754b?q=80&w=800`} 
                            alt={ac.registration} 
                            fill 
                            className="object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                            data-ai-hint="private jet"
                        />
                        <div className="absolute top-2 right-2">
                            <Badge variant={getStatusVariant(ac.status)} className="h-5 font-bold uppercase tracking-tighter shadow-lg">
                                {ac.status}
                            </Badge>
                        </div>
                    </div>
                    <CardHeader className="pb-3 pt-4">
                        <div className="flex items-start justify-between">
                            <div>
                                <CardTitle className="text-base font-bold group-hover:text-accent transition-colors">{ac.name}</CardTitle>
                                <CardDescription className="font-code text-[10px] uppercase tracking-[0.2em] text-accent/60 mt-0.5">{ac.registration}</CardDescription>
                            </div>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                <Button size="icon" variant="ghost" className="h-8 w-8 -mt-1 -mr-2">
                                    <MoreHorizontal className="h-4 w-4" />
                                </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Asset Management</DropdownMenuLabel>
                                <DropdownMenuItem onClick={() => setStatusAircraft(ac)} className="gap-2">
                                    <Activity className="h-3.5 w-3.5" /> Update Operational Status
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setEditAircraft(ac)} className="gap-2">
                                    <Settings2 className="h-3.5 w-3.5" /> Edit Specifications
                                </DropdownMenuItem>
                                <DropdownMenuItem className="gap-2">
                                    <ShieldCheck className="h-3.5 w-3.5" /> Compliance Log
                                </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </CardHeader>
                    <CardContent className="flex-grow space-y-4">
                        <div className="grid grid-cols-2 gap-3">
                            <div className="p-2.5 bg-muted/10 border border-white/5 rounded-lg space-y-1">
                                <p className="text-[8px] uppercase text-muted-foreground font-black tracking-widest">Asset Class</p>
                                <p className="font-medium text-xs truncate">{ac.type}</p>
                            </div>
                            <div className="p-2.5 bg-muted/10 border border-white/5 rounded-lg space-y-1">
                                <p className="text-[8px] uppercase text-muted-foreground font-black tracking-widest">Home Base</p>
                                <p className="font-medium text-xs truncate">{ac.homeBase}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                            <Users className="h-3 w-3 text-accent/60" />
                            <span>Capacity: <span className="text-foreground font-bold">{ac.paxCapacity} PAX</span></span>
                        </div>
                    </CardContent>
                </Card>
            ))}
            
            {(!aircrafts || aircrafts.length === 0) && (
                <div className="col-span-full text-center py-20 border-2 border-dashed rounded-xl bg-muted/5">
                    <Plane className="mx-auto h-10 w-10 text-muted-foreground/20 mb-4" />
                    <p className="text-muted-foreground">Your digital fleet registry is empty.</p>
                    <Button onClick={() => setIsAddOpen(true)} variant="link" className="text-accent mt-2">Initialize First Asset</Button>
                </div>
            )}
        </div>
      )}

      <AddAircraftDialog 
        open={isAddOpen} 
        onOpenChange={setIsAddOpen} 
      />

      <EditAircraftDialog 
        aircraft={editAircraft}
        open={!!editAircraft}
        onOpenChange={(open) => !open && setEditAircraft(null)}
      />

      <UpdateAircraftStatusDialog 
        aircraft={statusAircraft}
        open={!!statusAircraft}
        onOpenChange={(open) => !open && setStatusAircraft(null)}
      />
    </>
  );
}