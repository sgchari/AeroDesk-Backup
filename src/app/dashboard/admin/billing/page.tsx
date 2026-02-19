import { PageHeader } from "@/components/dashboard/shared/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function BillingPage() {
    return (
        <>
            <PageHeader title="Billing Records" description="View platform subscription and participation fee records." />
            <Card>
                <CardHeader>
                    <CardTitle>All Billing Records</CardTitle>
                    <CardDescription>
                        A log of all financial transactions and subscriptions on the platform.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <p>Billing records table will be displayed here.</p>
                </CardContent>
            </Card>
        </>
    );
}
