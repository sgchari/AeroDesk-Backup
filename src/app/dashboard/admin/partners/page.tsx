
'use client';

import { PageHeader } from "@/components/dashboard/shared/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useCollection, useFirestore, useMemoFirebase } from "@/firebase";
import { User } from "@/lib/types";
import { collection, doc } from "firebase/firestore";
import { MoreHorizontal, PlusCircle } from "lucide-react";

export default function PartnerManagementPage() {
    const firestore = useFirestore();

    const { data: hotelPartners, isLoading: hotelPartnersLoading } = useCollection<User>(
        useMemoFirebase(() => firestore ? collection(firestore, 'hotelPartners') : null, [firestore]),
        'hotelPartners'
    );
    const { data: distributors, isLoading: distributorsLoading } = useCollection<User>(
        useMemoFirebase(() => firestore ? collection(firestore, 'distributors') : null, [firestore]),
        'distributors'
    );
    
    const isLoading = hotelPartnersLoading || distributorsLoading;

    return (
        <>
            <PageHeader title="Partner Governance" description="Onboard, manage, and oversee hotel partners and authorized travel agencies.">
                <Button>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Onboard New Partner
                </Button>
            </PageHeader>
            <div className="grid gap-6 lg:grid-cols-2">
                <Card className="bg-card">
                    <CardHeader>
                        <CardTitle>Hotel Partners</CardTitle>
                        <CardDescription>
                            A list of all hotel partners on the platform.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {hotelPartnersLoading ? <Skeleton className="h-48 w-full" /> : (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Hotel Group</TableHead>
                                        <TableHead>Contact</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead><span className="sr-only">Actions</span></TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {hotelPartners?.map((partner) => (
                                         <TableRow key={partner.id}>
                                            <TableCell className="font-medium">{partner.companyName}</TableCell>
                                            <TableCell>{partner.email}</TableCell>
                                            <TableCell><Badge variant={partner.status === 'Active' ? 'success' : 'secondary'}>{partner.status}</Badge></TableCell>
                                            <TableCell>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild><Button variant="ghost" size="icon" className="h-8 w-8"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                                                    <DropdownMenuContent>
                                                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                        <DropdownMenuItem>View Details</DropdownMenuItem>
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
                <Card className="bg-card">
                    <CardHeader>
                        <CardTitle>Travel Agencies</CardTitle>
                        <CardDescription>
                            A list of all authorized travel agencies (distributors).
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                       {distributorsLoading ? <Skeleton className="h-48 w-full" /> : (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Agency Name</TableHead>
                                        <TableHead>Contact</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead><span className="sr-only">Actions</span></TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {distributors?.map((agency) => (
                                         <TableRow key={agency.id}>
                                            <TableCell className="font-medium">{agency.companyName}</TableCell>
                                            <TableCell>{agency.email}</TableCell>
                                            <TableCell><Badge variant={agency.status === 'Active' ? 'success' : 'secondary'}>{agency.status}</Badge></TableCell>
                                            <TableCell>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild><Button variant="ghost" size="icon" className="h-8 w-8"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                                                    <DropdownMenuContent>
                                                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                        <DropdownMenuItem>View Details</DropdownMenuItem>
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
            </div>
        </>
    );
}
