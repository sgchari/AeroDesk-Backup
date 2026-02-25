
import { PageHeader } from "@/components/dashboard/shared/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle } from "lucide-react";

export default function TeamManagementPage() {
    return (
        <>
            <PageHeader title="Admin Team Governance" description="Manage your internal AeroDesk admin team. This is separate from global user management.">
                 <Button>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Admin User
                </Button>
            </PageHeader>
            <Card className="bg-card">
                <CardHeader>
                    <CardTitle>AeroDesk Administrators</CardTitle>
                    <CardDescription>
                        A list of all administrators with platform-wide permissions.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="text-center py-12 border-2 border-dashed rounded-lg">
                        <p className="text-muted-foreground">Admin team management table will be displayed here.</p>
                    </div>
                </CardContent>
            </Card>
        </>
    );
}
