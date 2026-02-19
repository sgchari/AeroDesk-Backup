import { PageHeader } from "@/components/dashboard/shared/page-header";
import { CTDDashboard } from "@/components/dashboard/ctd-dashboard";

export default function CTDApprovalsPage() {
    // In a real app, this view could be filtered to show only requests pending the current user's approval.
    return (
        <>
            <PageHeader title="Corporate RFQ Approvals" description="Review and approve charter requests from your organization." />
            <CTDDashboard />
        </>
    );
}
