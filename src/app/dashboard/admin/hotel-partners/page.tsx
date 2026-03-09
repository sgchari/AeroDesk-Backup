'use client';

import { PageHeader } from "@/components/dashboard/shared/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useCollection, useFirestore, updateDocumentNonBlocking } from "@/firebase";
import type { HotelPartner } from "@/lib/types";
import { MoreHorizontal, Building, Star, ShieldCheck, Ban, CheckCircle2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";

export default function HotelPartnerManagementPage() {
    const firestore = useFirestore();
    const { toast } = useToast();
    const { data: hotels, isLoading } = useCollection<HotelPartner>(null, 'hotelPartners');

    const handleUpdateStatus = (hotelId: string, status: string, companyName: string) => {
        const mockDocRef = { path: `hotelPartners/${hotelId}` } as any;
        updateDocumentNonBlocking(mockDocRef, { status });
        
        toast({
            title: "Hospitality Registry Sync",
            description: `${companyName} marked as ${status.replace('_', ' ')}.`,
        });
    };

    return (
        <div className="space-y-6">
            <PageHeader title="Hospitality Governance" description="Manage verified hotel partners and premium stay providers." />

            <Card className="bg-card">
                <CardHeader>
                    <CardTitle>Verified Hospitality Nodes</CardTitle>
                    <CardDescription>Hotels synchronized with charter mission arrival protocols.</CardDescription>
                </CardHeader>
                <CardContent>
                    {isLoading ? <Skeleton className="h-64 w-full" /> : (
                        <Table>
                            <TableHeader>
                                <TableRow className="border-white/5 hover:bg-transparent">
                                    <TableHead className="text-[10px] uppercase font-black">Partner / Property</TableHead>
                                    <TableHead className="text-[10px] uppercase font-black">Contact Node</TableHead>
                                    <TableHead className="text-[10px] uppercase font-black text-center">Status</TableHead>
                                    <TableHead className="text-right pr-6"><span className="sr-only">Actions</span></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {hotels?.map((hotel) => (
                                    <TableRow key={hotel.id} className="border-white/5 group hover:bg-white/[0.02]">
                                        <TableCell className="py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-amber-500/10 rounded-lg">
                                                    <Building className="h-4 w-4 text-amber-500" />
                                                </div>
                                                <div className="space-y-0.5">
                                                    <p className="text-sm font-bold text-white">{hotel.hotelName || hotel.companyName}</p>
                                                    <p className="text-[9px] text-muted-foreground uppercase font-code tracking-tighter">{hotel.id}</p>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <p className="text-xs text-foreground font-medium">{hotel.contactEmail}</p>
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <Badge className={hotel.status === 'ACTIVE' ? "bg-emerald-500/20 text-emerald-500 border-none h-5 text-[9px] font-black uppercase" : "bg-rose-500/20 text-rose-500 border-none h-5 text-[9px] font-black uppercase"}>
                                                {hotel.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right pr-6">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button size="icon" variant="ghost" className="h-8 w-8 hover:bg-white/10">
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuLabel>Property Controls</DropdownMenuLabel>
                                                    <DropdownMenuItem onClick={() => handleUpdateStatus(hotel.id, 'ACTIVE', hotel.companyName)}>
                                                        <CheckCircle2 className="h-3.5 w-3.5 mr-2 text-emerald-500" /> Verify Node
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => handleUpdateStatus(hotel.id, 'SUSPENDED', hotel.companyName)}>
                                                        <ShieldCheck className="h-3.5 w-3.5 mr-2 text-amber-500" /> Suspend
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem className="text-destructive" onClick={() => handleUpdateStatus(hotel.id, 'BLOCKED', hotel.companyName)}>
                                                        <Ban className="h-3.5 w-3.5 mr-2" /> Block Node
                                                    </DropdownMenuItem>
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
    );
}
