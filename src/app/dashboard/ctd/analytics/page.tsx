import { PageHeader } from "@/components/dashboard/shared/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function CTDAnalyticsPage() {
    return (
        <>
            <PageHeader title="Corporate Travel Analytics" description="Analyze your organization's charter spending and travel patterns." />
            <Card className="bg-card">
                <CardHeader>
                    <CardTitle>Travel Spend Overview</CardTitle>
                    <CardDescription>
                        Charts and data regarding corporate travel will be displayed here.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="text-center py-12 border-2 border-dashed rounded-lg">
                        <p className="text-muted-foreground">Analytics dashboard coming soon.</p>
                    </div>
                </CardContent>
            </Card>
        </>
    );
}
