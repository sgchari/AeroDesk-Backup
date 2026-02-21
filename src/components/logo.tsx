import { cn } from '@/lib/utils';
import { SlidersHorizontal } from 'lucide-react';

export function Logo({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-3 group", className)}>
        <div className={cn("p-1.5 rounded-md bg-transparent border border-primary/50")}>
            <SlidersHorizontal
                className={cn("h-5 w-5 text-primary")}
                />
        </div>
        <div>
            <div className="flex items-baseline">
                <span className="font-headline text-xl font-bold tracking-wider text-foreground">AERO</span>
                <span className="font-headline text-xl font-bold tracking-wider text-primary">DESK</span>
            </div>
            <p className="text-xs text-muted-foreground -mt-1">Organized Charter Marketplace</p>
        </div>
    </div>
  );
}
