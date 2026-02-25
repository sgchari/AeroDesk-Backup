import { PageHeader } from "@/components/dashboard/shared/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle } from "lucide-react";

export default function TeamManagementPage() {
    return (
        <>
            <PageHeader title="Team Management" description="Manage your corporate team members and their roles.">
                 <Button>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Team Member
                </Button>
            </PageHeader>
            <Card className="bg-card">
                <CardHeader>
                    <CardTitle>Your Corporate Team</CardTitle>
                    <CardDescription>
                        A list of all employees managed under this Corporate Travel Desk.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <p>Team management table will be displayed here.</p>
                </CardContent>
            </Card>
        </>
    );
}
