
'use client';
import { PageHeader } from "@/components/dashboard/shared/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { MoreHorizontal, PlusCircle, Building, MapPin } from "lucide-react";
import { useUser } from "@/hooks/use-user";
import { useCollection, useFirestore, useMemoFirebase } from "@/firebase";
import { collection, query, where } from "firebase/firestore";
import type { Property } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

export default function HotelPropertiesPage() {
    const { user, isLoading: isUserLoading } = useUser();
    const firestore = useFirestore();

    const propertiesQuery = useMemoFirebase(() => {
        if (!firestore || !user || (firestore as any)._isMock) return null;
        return query(collection(firestore, 'properties'), where('hotelPartnerId', '==', user.id));
    }, [firestore, user]);
    const { data: properties, isLoading: propertiesLoading } = useCollection<Property>(propertiesQuery, 'properties');

    const isLoading = isUserLoading || propertiesLoading;

    return (
        <>
            <PageHeader title="Property Management" description="Manage your hotel properties, room categories, and availability.">
                <Button>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add New Property
                </Button>
            </PageHeader>
            
            {isLoading ? (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    <Skeleton className="h-80 w-full" />
                    <Skeleton className="h-80 w-full" />
                    <Skeleton className="h-80 w-full" />
                </div>
            ) : (
                <>
                {properties && properties.length > 0 ? (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {properties.map(prop => (
                            <Card key={prop.id} className="bg-card flex flex-col overflow-hidden">
                                <div className="relative h-48 w-full">
                                    <Image 
                                        src={prop.imageUrl || 'https://picsum.photos/seed/hotel/600/400'} 
                                        alt={prop.name || 'Hotel Property'} 
                                        fill 
                                        className="object-cover" 
                                    />
                                </div>
                                <CardHeader>
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <CardTitle className="text-lg">{prop.name}</CardTitle>
                                            <CardDescription>{prop.propertyType || 'Hotel'}</CardDescription>
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
                                                <DropdownMenuItem>Edit Property</DropdownMenuItem>
                                                <DropdownMenuItem>Manage Rooms</DropdownMenuItem>
                                                <DropdownMenuItem>Set Availability</DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                </CardHeader>
                                <CardContent className="flex-grow space-y-3 text-sm">
                                    <div className="flex items-center text-muted-foreground">
                                        <MapPin className="mr-2 h-4 w-4" />
                                        <span>{prop.city}</span>
                                    </div>
                                </CardContent>
                                <CardFooter>
                                    <Badge variant={prop.status === 'Active' ? 'success' : 'secondary'}>{prop.status}</Badge>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 border-2 border-dashed rounded-lg">
                        <Building className="mx-auto h-12 w-12 text-muted-foreground"/>
                        <h3 className="mt-4 text-lg font-semibold">No Properties Added Yet</h3>
                        <p className="mt-1 text-sm text-muted-foreground">Get started by adding your first property.</p>
                        <div className="mt-6">
                            <Button>
                                <PlusCircle className="mr-2 h-4 w-4" />
                                Add New Property
                            </Button>
                        </div>
                    </div>
                )}
                </>
            )}
        </>
    );
}
