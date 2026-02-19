import { PageHeader } from "@/components/dashboard/shared/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function OperatorManagementPage() {
    return (
        <>
            <PageHeader title="Operator Management" description="Approve operators, view fleet & compliance data, and manage access." />
            <Card>
                <CardHeader>
                    <CardTitle>All Operators</CardTitle>
                    <CardDescription>
                        A list of all NSOP operators on the platform.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <p>Operators table will be displayed here.</p>
                </CardContent>
            </Card>
        </>
    );
}
