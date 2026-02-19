import { PageHeader } from "@/components/dashboard/shared/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function UserManagementPage() {
    return (
        <>
            <PageHeader title="User Management" description="Create, approve, and manage all platform users and their roles." />
            <Card>
                <CardHeader>
                    <CardTitle>All Users</CardTitle>
                    <CardDescription>
                        A list of all users on the platform across all roles.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <p>User management table will be displayed here.</p>
                </CardContent>
            </Card>
        </>
    );
}
