
import { PageHeader } from "@/components/dashboard/shared/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function AccommodationRequestsPage() {
    return (
        <>
            <PageHeader title="Accommodation Requests" description="Manage hotel requests for your clients." />
            <Card className="bg-card">
                <CardHeader>
                    <CardTitle>All Accommodation Requests</CardTitle>
                    <CardDescription>
                        A log of all hotel requests you have initiated.
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
