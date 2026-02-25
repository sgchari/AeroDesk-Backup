import { PageHeader } from "@/components/dashboard/shared/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle } from "lucide-react";

export default function CTDPoliciesPage() {
    return (
        <>
            <PageHeader title="Travel Policy Management" description="Define and manage travel policies for your organization.">
                <Button>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    New Policy Rule
                </Button>
            </PageHeader>
            <Card className="bg-card">
                <CardHeader>
                    <CardTitle>Active Policies</CardTitle>
                    <CardDescription>
                        These rules govern charter requests and approvals for your corporate account.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                     <div className="text-center py-12 border-2 border-dashed rounded-lg">
                        <p className="text-muted-foreground">Policy management interface coming soon.</p>
                    </div>
                </CardContent>
            </Card>
        </>
    );
}
