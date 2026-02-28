
// Redundant page removed to resolve route conflict.
import { redirect } from 'next/navigation';
export default function RedundantPage() {
  redirect('/dashboard');
}
