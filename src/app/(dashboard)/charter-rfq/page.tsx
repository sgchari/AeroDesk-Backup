import { redirect } from 'next/navigation';

export default function RedundantCharterRfqPage() {
    // This route is now handled by /src/app/dashboard/charter-rfq/page.tsx
    redirect('/dashboard/charter-rfq');
}
