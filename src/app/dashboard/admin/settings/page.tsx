import { PageHeader } from "@/components/dashboard/shared/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function PlatformSettingsPage() {
    return (
        <>
            <PageHeader title="Platform Settings" description="Configure global settings for the AeroDesk platform." />
            <Card className="bg-card">
                <CardHeader>
                    <CardTitle>General Settings</CardTitle>
                    <CardDescription>
                        Manage general platform configurations.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <p>Platform settings form will be displayed here.</p>
                </CardContent>
            </Card>
        </>
    );
}
