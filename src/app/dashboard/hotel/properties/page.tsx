import { PageHeader } from "@/components/dashboard/shared/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle } from "lucide-react";

export default function HotelPropertiesPage() {
    return (
        <>
            <PageHeader title="Property Management" description="Manage your hotel properties, room categories, and availability.">
                <Button>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add New Property
                </Button>
            </PageHeader>
            <Card className="bg-background">
                <CardHeader>
                    <CardTitle>Your Properties</CardTitle>
                    <CardDescription>
                        A list of your properties onboarded to the AeroDesk platform.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="text-center py-12 border-2 border-dashed rounded-lg">
                        <p className="text-muted-foreground">You haven&apos;t added any properties yet.</p>
                        <Button variant="link" className="mt-2">Add your first property</Button>
                    </div>
                </CardContent>
            </Card>
        </>
    );
}
