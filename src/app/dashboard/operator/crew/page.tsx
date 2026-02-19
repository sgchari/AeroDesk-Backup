import { PageHeader } from "@/components/dashboard/shared/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle } from "lucide-react";

export default function CrewManagementPage() {
    return (
        <>
            <PageHeader title="Crew Management" description="Manage your crew, their availability, and assignments.">
                 <Button>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Crew Member
                </Button>
            </PageHeader>
            <Card>
                <CardHeader>
                    <CardTitle>Your Crew</CardTitle>
                    <CardDescription>
                        A list of all crew members associated with your operation.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <p>Crew management table will be displayed here.</p>
                </CardContent>
            </Card>
        </>
    );
}
