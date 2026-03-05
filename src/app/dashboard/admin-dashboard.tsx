
'use client';
import { redirect } from 'next/navigation';

export default function RedundantAdminDashboard() {
    // Component has been consolidated into /src/components/dashboard/admin-dashboard.tsx
    // The main dashboard page now dynamically imports it from the correct location.
    redirect('/dashboard');
}
