import { PageHeader } from "@/components/dashboard/shared/page-header";
import { CTDDashboard } from "@/components/dashboard/ctd-dashboard";

export default function CTDRequestsPage() {
    // In a real app, this view could be filtered to show only requests created by the current user.
    return (
        <>
            <PageHeader title="My Charter Requests" description="A list of charter requests you have created for your organization." />
            <CTDDashboard />
        </>
    );
}
