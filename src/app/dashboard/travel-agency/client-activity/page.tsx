
import { PageHeader } from "@/components/dashboard/shared/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function ClientActivityPage() {
    return (
        <>
            <PageHeader title="Client Activity" description="View a log of all requests and activities for your clients." />
            <Card className="bg-card">
                <CardHeader>
                    <CardTitle>Activity Stream</CardTitle>
                    <CardDescription>
                        A complete history of all client-related actions.
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
