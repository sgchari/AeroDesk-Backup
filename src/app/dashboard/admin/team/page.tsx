import { PageHeader } from "@/components/dashboard/shared/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle } from "lucide-react";

export default function TeamManagementPage() {
    return (
        <>
            <PageHeader title="Admin Team Management" description="Manage your internal AeroDesk admin team. This is separate from global user management.">
                 <Button>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Admin User
                </Button>
            </PageHeader>
            <Card>
                <CardHeader>
                    <CardTitle>AeroDesk Administrators</CardTitle>
                    <CardDescription>
                        A list of all administrators with platform-wide permissions.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <p>Admin team management table will be displayed here.</p>
                </CardContent>
            </Card>
        </>
    );
}
