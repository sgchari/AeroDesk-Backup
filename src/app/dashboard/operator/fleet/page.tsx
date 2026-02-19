import { PageHeader } from "@/components/dashboard/shared/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getMockDataForRole } from "@/lib/data";
import type { Aircraft } from "@/lib/types";
import { MoreHorizontal, PlusCircle } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

export default function FleetManagementPage() {
  const { aircrafts } = getMockDataForRole('Operator');

  return (
    <>
      <PageHeader title="Fleet Management" description="Manage your aircraft registry, availability, and operational status.">
        <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Aircraft
        </Button>
      </PageHeader>
      <Card>
        <CardHeader>
          <CardTitle>Your Fleet</CardTitle>
          <CardDescription>
            A list of all aircraft registered under your operator certificate.
          </CardDescription>
        </CardHeader>
        <CardContent>
            <Table>
                <TableHeader>
                <TableRow>
                    <TableHead>Registration</TableHead>
                    <TableHead>Aircraft Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Pax Capacity</TableHead>
                    <TableHead>Home Base</TableHead>
                    <TableHead>
                    <span className="sr-only">Actions</span>
                    </TableHead>
                </TableRow>
                </TableHeader>
                <TableBody>
                {aircrafts?.map((ac: Aircraft) => (
                    <TableRow key={ac.id}>
                        <TableCell className="font-medium font-code">{ac.registration}</TableCell>
                        <TableCell>{ac.name}</TableCell>
                        <TableCell><Badge variant="outline">{ac.type}</Badge></TableCell>
                        <TableCell className="text-center">{ac.paxCapacity}</TableCell>
                        <TableCell>{ac.homeBase}</TableCell>
                        <TableCell>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                <Button aria-haspopup="true" size="icon" variant="ghost">
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
                        </TableCell>
                    </TableRow>
                ))}
                </TableBody>
            </Table>
        </CardContent>
      </Card>
    </>
  );
}
