
import { PageHeader } from "@/components/dashboard/shared/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function HotelReportsPage() {
    return (
        <>
            <PageHeader title="Reports & Analytics" description="View performance metrics and generate reports for your properties." />
            <Card className="bg-card">
                <CardHeader>
                    <CardTitle>Reporting Dashboard</CardTitle>
                    <CardDescription>
                        Analytics related to occupancy, revenue, and response times will be displayed here.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="text-center py-12 border-2 border-dashed rounded-lg">
                        <p className="text-muted-foreground">Reporting features are coming soon.</p>
                    </div>
                </CardContent>
            </Card>
        </>
    );
}
