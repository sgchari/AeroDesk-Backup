
'use client';
import { PageHeader } from "@/components/dashboard/shared/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { MoreHorizontal, PlusCircle, BedDouble, Users, Image as ImageIcon } from "lucide-react";
import { useUser } from "@/hooks/use-user";
import { useCollection, useFirestore, useMemoFirebase } from "@/firebase";
import { collection, query, where } from "firebase/firestore";
import type { Property, RoomCategory } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";

export default function HotelRoomCategoriesPage() {
    const { user, isLoading: isUserLoading } = useUser();
    const firestore = useFirestore();

    const propertiesQuery = useMemoFirebase(() => {
        if (!firestore || !user || (firestore as any)._isMock) return null;
        return query(collection(firestore, 'properties'), where('hotelPartnerId', '==', user.id));
    }, [firestore, user]);
    const { data: properties, isLoading: propertiesLoading } = useCollection<Property>(propertiesQuery, 'properties');

    const roomCategoriesQuery = useMemoFirebase(() => {
        if (!firestore || (firestore as any)._isMock) return null;
        return collection(firestore, 'roomCategories');
    }, [firestore]);
    const { data: allRoomCategories, isLoading: roomsLoading } = useCollection<RoomCategory>(roomCategoriesQuery, 'roomCategories');
    
    const isLoading = isUserLoading || propertiesLoading || roomsLoading;

    return (
        <>
            <PageHeader title="Room Management" description="Manage room types, details, and photos for your properties.">
                <Button>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add New Room Type
                </Button>
            </PageHeader>
            
            {isLoading ? (
                <div className="space-y-6">
                    <Skeleton className="h-96 w-full" />
                    <Skeleton className="h-96 w-full" />
                </div>
            ) : (
                <div className="space-y-8">
                    {properties && properties.length > 0 ? (
                        properties.map(prop => {
                            const propertyRooms = allRoomCategories?.filter(room => room.propertyId === prop.id) || [];
                            return (
                                <Card key={prop.id} className="bg-card">
                                    <CardHeader>
                                        <CardTitle>{prop.name}</CardTitle>
                                        <CardDescription>{prop.city}</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        {propertyRooms.length > 0 ? (
                                            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                                                {propertyRooms.map(room => (
                                                    <Card key={room.id} className="bg-background flex flex-col overflow-hidden">
                                                        <div className="relative h-40 w-full">
                                                            <Image 
                                                                src={room.imageUrl || 'https://picsum.photos/seed/room/600/400'} 
                                                                alt={room.name || 'Hotel Room'} 
                                                                fill 
                                                                className="object-cover" 
                                                            />
                                                        </div>
                                                        <CardHeader className="pb-4">
                                                            <div className="flex items-start justify-between">
                                                                <CardTitle className="text-base">{room.name}</CardTitle>
                                                                <DropdownMenu>
                                                                    <DropdownMenuTrigger asChild>
                                                                        <Button aria-haspopup="true" size="icon" variant="ghost" className="h-7 w-7 -mt-2 -mr-2">
                                                                            <MoreHorizontal className="h-4 w-4" />
                                                                            <span className="sr-only">Toggle menu</span>
                                                                        </Button>
                                                                    </DropdownMenuTrigger>
                                                                    <DropdownMenuContent align="end">
                                                                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                                        <DropdownMenuItem>Edit Room</DropdownMenuItem>
                                                                        <DropdownMenuItem>Set Availability</DropdownMenuItem>
                                                                    </DropdownMenuContent>
                                                                </DropdownMenu>
                                                            </div>
                                                            <CardDescription className="text-xs line-clamp-2">{room.description}</CardDescription>
                                                        </CardHeader>
                                                        <CardContent className="flex-grow space-y-2 text-sm">
                                                            <div className="flex items-center text-muted-foreground">
                                                                <Users className="mr-2 h-4 w-4" />
                                                                <span>Max Occupancy: {room.maxOccupancy}</span>
                                                            </div>
                                                            <div className="flex items-center text-muted-foreground">
                                                                <BedDouble className="mr-2 h-4 w-4" />
                                                                <span>Bedding: {room.beddingType}</span>
                                                            </div>
                                                        </CardContent>
                                                    </Card>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="text-center py-12 border-2 border-dashed rounded-lg">
                                                <p className="text-muted-foreground">No room categories added for this property yet.</p>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            )
                        })
                    ) : (
                        <div className="text-center py-20 border-2 border-dashed rounded-lg">
                            <p className="text-muted-foreground">You have not added any properties yet. Add a property to manage rooms.</p>
                        </div>
                    )}
                </div>
            )}
        </>
    );
}
