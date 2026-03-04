
'use client';

import { PageHeader } from "@/components/dashboard/shared/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useUser } from "@/hooks/use-user";
import { useCollection, useFirestore, useMemoFirebase, updateDocumentNonBlocking } from "@/firebase";
import { collection, query, where, doc } from "firebase/firestore";
import type { Property, RoomCategory } from "@/lib/types";
import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Info, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { SystemAdvisory } from "@/components/dashboard/operator/system-advisory";
import { Separator } from "@/components/ui/separator";

export default function HotelAvailabilityPage() {
    const { user, isLoading: isUserLoading } = useUser();
    const firestore = useFirestore();
    const { toast } = useToast();
    
    const [selectedPropertyId, setSelectedPropertyId] = useState<string>("");
    const [selectedRoomId, setSelectedRoomId] = useState<string>("");
    const [date, setDate] = useState<Date | undefined>(new Date());
    const [rate, setRate] = useState<string>("");

    const { data: properties, isLoading: propsLoading } = useCollection<Property>(
        useMemoFirebase(() => {
            if (!firestore || !user || (firestore as any)._isMock) return null;
            return query(collection(firestore, 'properties'), where('hotelPartnerId', '==', user.id));
        }, [firestore, user]),
        'properties'
    );

    const { data: roomCategories, isLoading: roomsLoading } = useCollection<RoomCategory>(
        useMemoFirebase(() => {
            if (!firestore || !selectedPropertyId || (firestore as any)._isMock) return null;
            return query(collection(firestore, 'roomCategories'), where('propertyId', '==', selectedPropertyId));
        }, [firestore, selectedPropertyId]),
        'roomCategories'
    );

    const selectedRoom = roomCategories?.find(r => r.id === selectedRoomId);

    const handleSaveRate = () => {
        if (!firestore || !selectedRoomId || !rate) return;
        
        const roomRef = (firestore as any)._isMock
            ? { path: `roomCategories/${selectedRoomId}` } as any
            : doc(firestore, 'roomCategories', selectedRoomId);

        updateDocumentNonBlocking(roomRef, { nightlyRate: parseFloat(rate) });
        
        toast({
            title: "Revenue Control Updated",
            description: "New nightly rate has been synchronized across the platform.",
        });
    };

    const isLoading = isUserLoading || propsLoading;

    return (
        <>
            <PageHeader title="Availability & Rates" description="Directly control your property's revenue signals and booking blocks." />
            
            <div className="grid gap-6 lg:grid-cols-3">
                <Card className="bg-card lg:col-span-1">
                    <CardHeader>
                        <CardTitle>Inventory Selection</CardTitle>
                        <CardDescription>Select a property and room category to manage.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label>Property</Label>
                            <Select value={selectedPropertyId} onValueChange={setSelectedPropertyId}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select Property" />
                                </SelectTrigger>
                                <SelectContent>
                                    {properties?.map(p => (
                                        <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>Room Category</Label>
                            <Select value={selectedRoomId} onValueChange={setSelectedRoomId} disabled={!selectedPropertyId}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select Room Type" />
                                </SelectTrigger>
                                <SelectContent>
                                    {roomCategories?.map(r => (
                                        <SelectItem key={r.id} value={r.id}>{r.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-card lg:col-span-2">
                    <CardHeader>
                        <CardTitle>Rate & Block Management</CardTitle>
                        <CardDescription>Configure pricing and availability windows for the selected inventory.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {!selectedRoomId ? (
                            <div className="text-center py-12 border-2 border-dashed rounded-lg bg-muted/5">
                                <Info className="mx-auto h-8 w-8 text-muted-foreground/40 mb-2" />
                                <p className="text-muted-foreground">Select a room category to enable controls.</p>
                            </div>
                        ) : (
                            <div className="space-y-6 animate-in fade-in slide-in-from-top-2">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label>Standard Nightly Rate (INR)</Label>
                                        <div className="flex gap-2">
                                            <Input 
                                                type="number" 
                                                placeholder={selectedRoom?.nightlyRate?.toString() || "0.00"} 
                                                value={rate}
                                                onChange={(e) => setRate(e.target.value)}
                                                className="bg-muted/20"
                                            />
                                            <Button onClick={handleSaveRate} className="bg-accent text-accent-foreground">
                                                <Save className="h-4 w-4 mr-2" />
                                                Update
                                            </Button>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Inventory Status</Label>
                                        <SystemAdvisory 
                                            level="INFO"
                                            title="Live Signal"
                                            message="This inventory is currently visible to charter requesters and authorized distributors."
                                        />
                                    </div>
                                </div>

                                <Separator />

                                <div className="space-y-4">
                                    <Label>Availability Blocks</Label>
                                    <div className="flex flex-col md:flex-row gap-4">
                                        <div className="border rounded-md p-4 bg-background w-fit">
                                            <Calendar
                                                mode="single"
                                                selected={date}
                                                onSelect={setDate}
                                                className="rounded-md"
                                            />
                                        </div>
                                        <div className="flex-1 space-y-4">
                                            <div className="p-4 rounded-lg bg-muted/20 border border-white/5 space-y-2">
                                                <h4 className="text-sm font-bold uppercase tracking-widest text-accent">Selected Date Control</h4>
                                                <p className="text-xs text-muted-foreground">
                                                    {date ? format(date, "PPP") : "Select a date on the calendar"}
                                                </p>
                                                <div className="pt-2 flex flex-wrap gap-2">
                                                    <Button size="sm" variant="destructive" className="h-8 text-[10px] font-bold uppercase">Block Inventory</Button>
                                                    <Button size="sm" variant="outline" className="h-8 text-[10px] font-bold uppercase">Mark High Demand</Button>
                                                </div>
                                            </div>
                                            <p className="text-[10px] text-muted-foreground leading-relaxed italic">
                                                * Blocking a date will hide this room category from all new coordination requests for the selected period.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </>
    );
}
