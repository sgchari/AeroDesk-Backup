import { cn } from '@/lib/utils';
import { ShieldCheck } from 'lucide-react';

export function Logo({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-3 group", className)}>
        <div className={cn("p-1.5 rounded-md bg-transparent border border-primary/50")}>
            <ShieldCheck
                className={cn("h-5 w-5 text-primary")}
                />
        </div>
      <div className='flex flex-col -space-y-1.5'>
        <span className={cn(
            "font-headline text-xl font-bold tracking-wider text-foreground"
            )}>
          AeroDesk
        </span>
        <span className={cn(
            'text-[0.6rem] font-semibold tracking-[0.2em] text-muted-foreground'
            )}>REGULATED MARKETPLACE</span>
      </div>
    </div>
  );
}
