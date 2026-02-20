import { cn } from '@/lib/utils';

export function Logo({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-2 group", className)}>
        <div className={cn("p-1.5 rounded-md bg-primary-foreground")}>
            <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className={cn("transition-colors h-6 w-6 text-background")}
                >
                 <path d="M5 7V17" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
                 <path d="M12 5V19" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
                 <path d="M19 7V17" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
            </svg>
        </div>
      <div className='flex flex-col -space-y-1.5'>
        <span className={cn(
            "font-headline text-2xl font-bold tracking-wider text-foreground"
            )}>
          AERODESK
        </span>
        <span className={cn(
            'text-[0.6rem] font-semibold tracking-[0.2em] text-foreground/70'
            )}>PLATFORM</span>
      </div>
    </div>
  );
}
