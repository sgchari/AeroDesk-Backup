
'use client';
import { PageHeader } from "@/components/dashboard/shared/page-header";
import { CreateRfqDialog } from "@/components/dashboard/customer/create-rfq-dialog";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { CharterRFQ, RfqStatus } from "@/lib/types";
import { MoreHorizontal, FileText, Clock, CheckCircle, Plane, Hotel, AlertTriangle, ArrowRight, Gavel, XCircle, Users, Armchair, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useUser } from "@/hooks/use-user";
import { Skeleton } from "@/components/ui/skeleton";
import { useCollection, useFirestore, useMemoFirebase, updateDocumentNonBlocking } from "@/firebase";
import { collection, query, where, doc } from "firebase/firestore";
import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const getStatusInfo = (status: RfqStatus): { text: string; icon: React.ElementType; className: string } => {
    switch (status) {
        case 'Draft':
        case 'New':
        case 'Submitted':
            return { text: 'Under Coordination', icon: Clock, className: 'text-amber-600 bg-amber-100' };
        case 'Pending Approval':
        case 'Reviewing':
            return { text: 'Action Required', icon: AlertTriangle, className: 'text-rose-600 bg-rose-100' };
        case 'Bidding Open':
            return { text: 'Bidding Open', icon: Gavel, className: 'text-blue-600 bg-blue-100' };
        case 'Operator Selected':
            return { text: 'Finalizing', icon: Clock, className: 'text-indigo-600 bg-indigo-100' };
        case 'Confirmed':
            return { text: 'Confirmed', icon: CheckCircle, className: 'text-green-600 bg-green-100' };
        case 'Cancelled':
        case 'Expired':
        case 'Closed':
            return { text: 'Closed', icon: XCircle, className: 'text-gray-500 bg-gray-100' };
        default:
            return { text: status, icon: Info, className: 'text-gray-600 bg-gray-100' };
    }
}

const TripDetailsDialog = ({ rfq, open, onOpenChange }: { rfq: CharterRFQ | null, open: boolean, onOpenChange: (open: boolean) => void }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [catering, setCatering] = useState("");
    const [specialRequests, setSpecialRequests] = useState("");
    const firestore = useFirestore();
    const { toast } = useToast();

    useEffect(() => {
        if (rfq) {
            setCatering(rfq.catering || "");
            setSpecialRequests(rfq.specialRequirements || "");
        }
        if (!open) {
            setIsEditing(false);
        }
    }, [rfq, open]);

    if (!rfq) return null;
    const statusInfo = getStatusInfo(rfq.status);
    
    // Modifications allowed for pre-confirmation statuses
    const isModifiable = !['Confirmed', 'Cancelled', 'Expired', 'Closed'].includes(rfq.status);

    const handleSave = () => {
        if (!firestore) return;
        const rfqRef = doc(firestore, 'charterRFQs', rfq.id);
        
        updateDocumentNonBlocking(rfqRef, {
            catering,
            specialRequirements: specialRequests
        });

        setIsEditing(false);
        toast({
            title: "Journey Modified",
            description: "Your special requests have been updated and synchronized with operators.",
        });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <div className="flex items-center gap-2 mb-2">
                        <Badge className={cn(statusInfo.className)}>
                            <statusInfo.icon className="mr-1.5 h-3 w-3"/>
                            {statusInfo.text}
                        </Badge>
                        <span className="text-[10px] font-code text-muted-foreground uppercase">{rfq.id}</span>
                    </div>
                    <DialogTitle className="text-xl">
                        {isEditing ? "Modify Journey Profile" : `${rfq.departure} to ${rfq.arrival}`}
                    </DialogTitle>
                    <DialogDescription>
                        {isEditing 
                            ? "Update your preferences below. Changes will be visible to bidding operators." 
                            : "Full journey specifications and coordination status."}
                    </DialogDescription>
                </DialogHeader>

                {isEditing ? (
                    <div className="space-y-4 py-4 animate-in fade-in slide-in-from-top-2 duration-300">
                        <div className="space-y-2">
                            <Label className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest">Catering & On-board Requirements</Label>
                            <Textarea 
                                value={catering} 
                                onChange={(e) => setCatering(e.target.value)}
                                placeholder="Specify meals, beverages, newspaper preferences..."
                                className="min-h-[100px] bg-muted/20"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest">Operational Notes / Special Requests</Label>
                            <Textarea 
                                value={specialRequests} 
                                onChange={(e) => setSpecialRequests(e.target.value)}
                                placeholder="Ground transport needs, medical assistance, pet travel..."
                                className="min-h-[100px] bg-muted/20"
                            />
                        </div>
                    </div>
                ) : (
                    <div className="space-y-6 py-4">
                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-1">
                                <p className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest">Schedule</p>
                                <p className="text-sm font-medium flex items-center gap-2">
                                    <Clock className="h-3.5 w-3.5 text-accent" />
                                    {new Date(rfq.departureDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                </p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest">Guests</p>
                                <p className="text-sm font-medium flex items-center gap-2">
                                    <Users className="h-3.5 w-3.5 text-accent" />
                                    {rfq.pax} Passengers
                                </p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest">Aircraft Category</p>
                                <p className="text-sm font-medium flex items-center gap-2">
                                    <Plane className="h-3.5 w-3.5 text-accent" />
                                    {rfq.aircraftType}
                                </p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest">Stay Services</p>
                                <p className="text-sm font-medium flex items-center gap-2">
                                    <Hotel className="h-3.5 w-3.5 text-accent" />
                                    {rfq.hotelRequired ? "Stay Requested" : "No Stay"}
                                </p>
                            </div>
                        </div>
                        <Separator />
                        <div className="space-y-3">
                            <div className="space-y-1">
                                <p className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest">Catering & Special Requests</p>
                                <p className="text-xs text-muted-foreground bg-muted/30 p-2 rounded-md italic">
                                    {rfq.catering || "No special catering requirements specified."}
                                </p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest">Operational Notes</p>
                                <p className="text-xs text-muted-foreground bg-muted/30 p-2 rounded-md italic">
                                    {rfq.specialRequirements || "Standard operational profile."}
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                <div className="flex justify-between items-center pt-4 border-t gap-2">
                    {isEditing ? (
                        <>
                            <Button variant="ghost" onClick={() => setIsEditing(false)} className="flex-1 text-xs">Cancel</Button>
                            <Button onClick={handleSave} className="flex-1 text-xs bg-accent text-accent-foreground hover:bg-accent/90">Save Changes</Button>
                        </>
                    ) : (
                        <>
                            <Button variant="outline" className="flex-1 text-xs">Contact Concierge</Button>
                            {isModifiable && (
                                <Button 
                                    onClick={() => setIsEditing(true)} 
                                    className="flex-1 text-xs bg-accent text-accent-foreground hover:bg-accent/90"
                                >
                                    Modify Journey
                                </Button>
                            )}
                        </>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    )
}

const TripCard = ({ rfq, onClick }: { rfq: CharterRFQ, onClick: () => void }) => {
    const statusInfo = getStatusInfo(rfq.status);
    return (
        <Card className="bg-card flex flex-col group hover:border-accent/50 transition-all cursor-pointer" onClick={onClick}>
            <CardHeader className="pb-3">
                <div className="flex items-center justify-between mb-1">
                    <Badge variant="outline" className="text-[8px] uppercase tracking-widest font-bold border-white/10 group-hover:border-accent/30">
                        {rfq.tripType}
                    </Badge>
                    <span className="font-code text-[10px] text-muted-foreground">{rfq.id}</span>
                </div>
                <CardTitle className="text-base group-hover:text-accent transition-colors truncate">
                    {rfq.departure} <ArrowRight className="inline h-3 w-3 mx-1 text-muted-foreground" /> {rfq.arrival}
                </CardTitle>
            </CardHeader>
            <CardContent className="flex-grow space-y-3 text-[11px]">
                <div className="flex items-center text-muted-foreground">
                    <Plane className="mr-2 h-3.5 w-3.5 text-accent/60" />
                    <span>{new Date(rfq.departureDate).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                </div>
                 <div className="flex items-center text-muted-foreground">
                    <Users className="mr-2 h-3.5 w-3.5 text-accent/60" />
                    <span>{rfq.pax} Passengers • {rfq.aircraftType}</span>
                </div>
                 <div className="flex items-center text-muted-foreground">
                    <Hotel className={cn("mr-2 h-3.5 w-3.5", rfq.hotelRequired ? "text-accent" : "text-muted-foreground/40")} />
                    <span>{rfq.hotelRequired ? 'Hotel stay coordinated' : 'No stay requested'}</span>
                </div>
            </CardContent>
            <CardFooter className="pt-0">
                 <Badge className={cn("w-full justify-center text-[10px] h-7 font-bold uppercase tracking-wider", statusInfo.className)}>
                    <statusInfo.icon className="mr-1.5 h-3 w-3"/>
                    {statusInfo.text}
                </Badge>
            </CardFooter>
        </Card>
    );
};

export function CustomerDashboard() {
  const { user, isLoading: isUserLoading } = useUser();
  const firestore = useFirestore();
  const [selectedTrip, setSelectedTrip] = useState<CharterRFQ | null>(null);

  const rfqsQuery = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return query(collection(firestore, 'charterRFQs'), where('customerId', '==', user.id));
  }, [firestore, user]);
  const { data: rfqs, isLoading: rfqsLoading } = useCollection<CharterRFQ>(rfqsQuery, 'charterRFQs');

  const isLoading = isUserLoading || rfqsLoading;

  return (
    <>
      <PageHeader title="My Trips" description="Track your flight requests, view confirmations, and coordinate logistics.">
        <CreateRfqDialog />
      </PageHeader>
      
      {isLoading ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-64 w-full" />
        </div>
      ) : (
        <>
            {rfqs && rfqs.length > 0 ? (
                 <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {rfqs.map(rfq => (
                        <TripCard 
                            key={rfq.id} 
                            rfq={rfq} 
                            onClick={() => setSelectedTrip(rfq)}
                        />
                    ))}
                </div>
            ) : (
                <div className="text-center py-20 border-2 border-dashed rounded-lg bg-card/20">
                    <div className="p-4 bg-muted/20 w-fit mx-auto rounded-full mb-4">
                        <Plane className="h-10 w-10 text-muted-foreground/40"/>
                    </div>
                    <h3 className="text-lg font-semibold">No active journeys</h3>
                    <p className="mt-1 text-sm text-muted-foreground max-w-xs mx-auto mb-6">
                        Your private aviation journey begins here. Request a flight to start the coordination process.
                    </p>
                    <CreateRfqDialog />
                </div>
            )}
        </>
      )}

      <TripDetailsDialog 
        rfq={selectedTrip} 
        open={!!selectedTrip} 
        onOpenChange={(open) => !open && setSelectedTrip(null)} 
      />
    </>
  );
}
