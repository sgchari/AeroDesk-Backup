import { PageHeader } from "@/components/dashboard/shared/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle } from "lucide-react";

export default function TeamManagementPage() {
    return (
        <>
            <PageHeader title="Team Management" description="Manage your hotel staff and their platform access.">
                 <Button>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Staff Member
                </Button>
            </PageHeader>
            <Card>
                <CardHeader>
                    <CardTitle>Your Hotel Staff</CardTitle>
                    <CardDescription>
                        A list of all staff members associated with your properties.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <p>Staff management table will be displayed here.</p>
                </CardContent>
            </Card>
        </>
    );
}
