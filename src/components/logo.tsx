
import { cn } from '@/lib/utils';

const AeroLogoIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 50 50" xmlns="http://www.w3.org/2000/svg" {...props}>
        {/* Propeller Blades */}
        <g transform="translate(25 25) rotate(-15)">
            <path d="M 0 -4 C 8 -11, 8 -20, 2 -24 L -2 -24 C -8 -20, -8 -11, 0 -4 Z" transform="rotate(0 0 0)" fill="hsl(var(--accent))" />
            <path d="M 0 -4 C 8 -11, 8 -20, 2 -24 L -2 -24 C -8 -20, -8 -11, 0 -4 Z" transform="rotate(120 0 0)" fill="hsl(var(--accent))" />
            <path d="M 0 -4 C 8 -11, 8 -20, 2 -24 L -2 -24 C -8 -20, -8 -11, 0 -4 Z" transform="rotate(240 0 0)" fill="hsl(var(--accent))" />
        </g>
        
        {/* Hub */}
        <circle cx="25" cy="25" r="4" fill="hsl(var(--secondary))" />
    </svg>
);


export function Logo({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-3 group", className)}>
        <div className={cn("p-1.5 rounded-full border-2 border-accent bg-background")}>
            <AeroLogoIcon
                className={cn("h-8 w-8")}
                />
        </div>
        <div>
            <div className="flex items-baseline">
                <span className="font-headline text-xl font-semibold tracking-normal text-foreground">AERO</span>
                <span className="font-headline text-xl font-semibold tracking-normal text-accent">DESK</span>
            </div>
            <p className="text-xs text-muted-foreground -mt-1 whitespace-nowrap">Organized Charter Network</p>
        </div>
    </div>
  );
}
