import { Plane } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Logo({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Plane className="h-6 w-6 text-primary" />
      <span className="hidden font-headline text-lg font-semibold sm:inline-block">
        AeroDesk
      </span>
    </div>
  );
}
