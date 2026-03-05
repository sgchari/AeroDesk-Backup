
'use client';
import { redirect } from 'next/navigation';

export default function RedundantCtdDashboard() {
    // Component has been consolidated into /src/components/dashboard/ctd-dashboard.tsx
    redirect('/dashboard');
}
