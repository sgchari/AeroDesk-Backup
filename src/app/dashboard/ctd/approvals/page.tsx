import { PageHeader } from "@/components/dashboard/shared/page-header";
import { CTDDashboard } from "@/components/dashboard/ctd-dashboard";

export default function CTDApprovalsPage() {
    return (
        <>
            <PageHeader title="All Corporate RFQs" description="Review, approve, and manage all charter requests from your organization." />
            <CTDDashboard />
        </>
    );
}
