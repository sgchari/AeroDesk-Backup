import { PageHeader } from "@/components/dashboard/shared/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function PartnerManagementPage() {
    return (
        <>
            <PageHeader title="Partner Management" description="Onboard and manage hotel partners and authorized distributors." />
            <Card>
                <CardHeader>
                    <CardTitle>All Partners</CardTitle>
                    <CardDescription>
                        A list of all hotel and distributor partners.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <p>Partners table will be displayed here.</p>
                </CardContent>
            </Card>
        </>
    );
}
