
import { PageHeader } from "@/components/dashboard/shared/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function ReportsPage() {
    return (
        <>
            <PageHeader title="Reports & History" description="Generate and view reports on your sales and client activities." />
            <Card className="bg-card">
                <CardHeader>
                    <CardTitle>Reporting Dashboard</CardTitle>
                    <CardDescription>
                        Analytics and reporting tools for your agency.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="text-center py-12 border-2 border-dashed rounded-lg">
                        <p className="text-muted-foreground">This feature is coming soon.</p>
                    </div>
                </CardContent>
            </Card>
        </>
    );
}
