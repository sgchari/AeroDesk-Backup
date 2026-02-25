
'use client';
import { PageHeader } from "@/components/dashboard/shared/page-header";
import { CreateRfqDialog } from "@/components/dashboard/customer/create-rfq-dialog";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { CharterRFQ, RfqStatus } from "@/lib/types";
import { MoreHorizontal, FileText, Clock, CheckCircle, Plane, Hotel, AlertTriangle, ArrowRight, Gavel, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useUser } from "@/hooks/use-user";
import { Skeleton } from "@/components/ui/skeleton";
import { useCollection, useFirestore, useMemoFirebase } from "@/firebase";
import { collection, query, where } from "firebase/firestore";
import React from "react";
import { cn } from "@/lib/utils";

const getStatusInfo = (status: RfqStatus): { text: string; icon: React.ElementType; className: string } => {
    switch (status) {
        case 'Draft':
        case 'New':
        case 'Submitted':
            return { text: 'Submitted', icon: FileText, className: 'text-gray-500 bg-gray-100' };
        case 'Pending Approval':
        case 'Reviewing':
            return { text: 'Under Review', icon: Clock, className: 'text-amber-600 bg-amber-100' };
        case 'Bidding Open':
            return { text: 'Bidding Open', icon: Gavel, className: 'text-blue-600 bg-blue-100' };
        case 'Operator Selected':
            return { text: 'Operator Selected', icon: CheckCircle, className: 'text-indigo-600 bg-indigo-100' };
        case 'Confirmed':
            return { text: 'Confirmed', icon: CheckCircle, className: 'text-green-600 bg-green-100' };
        case 'Cancelled':
        case 'Expired':
        case 'Closed':
            return { text: 'Closed', icon: XCircle, className: 'text-gray-500 bg-gray-100' };
        default:
            return { text: status, icon: AlertTriangle, className: 'text-red-600 bg-red-100' };
    }
}

const TripCard = ({ rfq }: { rfq: CharterRFQ }) => {
    const statusInfo = getStatusInfo(rfq.status);
    return (
        <Card className="bg-card flex flex-col">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{rfq.departure} <ArrowRight className="inline h-4 w-4 mx-1" /> {rfq.arrival}</CardTitle>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                        <Button aria-haspopup="true" size="icon" variant="ghost" className="h-8 w-8 -mt-2 -mr-2">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Toggle menu</span>
                        </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem>View Details</DropdownMenuItem>
                        <DropdownMenuItem>Compare Quotations</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
                <CardDescription className="font-code text-xs">{rfq.id}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow space-y-3 text-sm">
                <div className="flex items-center text-muted-foreground">
                    <Plane className="mr-2 h-4 w-4" />
                    <span>{new Date(rfq.departureDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                </div>
                 <div className="flex items-center text-muted-foreground">
                    {rfq.hotelRequired ? <Hotel className="mr-2 h-4 w-4 text-primary" /> : <Hotel className="mr-2 h-4 w-4" /> }
                    <span>{rfq.hotelRequired ? 'Hotel stay requested' : 'No hotel requested'}</span>
                </div>
            </CardContent>
            <CardFooter>
                 <Badge className={cn("w-full justify-center", statusInfo.className)}>
                    <statusInfo.icon className="mr-2 h-4 w-4"/>
                    {statusInfo.text}
                </Badge>
            </CardFooter>
        </Card>
    );
};

export function CustomerDashboard() {
  const { user, isLoading: isUserLoading } = useUser();
  const firestore = useFirestore();

  const rfqsQuery = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return query(collection(firestore, 'charterRFQs'), where('customerId', '==', user.id));
  }, [firestore, user]);
  const { data: rfqs, isLoading: rfqsLoading } = useCollection<CharterRFQ>(rfqsQuery, 'charterRFQs');

  const isLoading = isUserLoading || rfqsLoading;

  return (
    <>
      <PageHeader title="My Trips" description="Manage your flight requests and view their status.">
        <CreateRfqDialog />
      </PageHeader>
      
      {isLoading ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-64 w-full" />
        </div>
      ) : (
        <>
            {rfqs && rfqs.length > 0 ? (
                 <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {rfqs.map(rfq => <TripCard key={rfq.id} rfq={rfq} />)}
                </div>
            ) : (
                <div className="text-center py-20 border-2 border-dashed rounded-lg">
                    <FileText className="mx-auto h-12 w-12 text-muted-foreground"/>
                    <h3 className="mt-4 text-lg font-semibold">No Trips Requested Yet</h3>
                    <p className="mt-1 text-sm text-muted-foreground">Get started by creating your first flight request.</p>
                    <div className="mt-6">
                        <CreateRfqDialog />
                    </div>
                </div>
            )}
        </>
      )}
    </>
  );
}
