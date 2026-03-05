
import { redirect } from 'next/navigation';

export default function RedundantGroupPage() {
    // Resolved route conflict: main dashboard is handled by /src/app/dashboard/page.tsx
    redirect('/dashboard');
}
