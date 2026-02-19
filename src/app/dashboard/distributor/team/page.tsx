import { PageHeader } from "@/components/dashboard/shared/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle } from "lucide-react";

export default function TeamManagementPage() {
    return (
        <>
            <PageHeader title="Team Management" description="Manage your team members and their access.">
                 <Button>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Team Member
                </Button>
            </PageHeader>
            <Card>
                <CardHeader>
                    <CardTitle>Your Team</CardTitle>
                    <CardDescription>
                        A list of all members associated with your distributorship.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <p>Team management table will be displayed here.</p>
                </CardContent>
            </Card>
        </>
    );
}
