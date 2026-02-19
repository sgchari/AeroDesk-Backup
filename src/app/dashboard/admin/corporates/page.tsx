import { PageHeader } from "@/components/dashboard/shared/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function CorporateManagementPage() {
    return (
        <>
            <PageHeader title="Corporate Management" description="Approve Corporate Travel Desk (CTD) accounts and configure approval hierarchies." />
            <Card>
                <CardHeader>
                    <CardTitle>All Corporate Accounts</CardTitle>
                    <CardDescription>
                        A list of all corporate travel desks on the platform.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <p>Corporate accounts table will be displayed here.</p>
                </CardContent>
            </Card>
        </>
    );
}
