
import { cn } from '@/lib/utils';

const AeroLogoIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 200 100" xmlns="http://www.w3.org/2000/svg" {...props}>
        {/* Outlines (Wings, Tail) */}
        <path d="M 80,45 C 20,20 0,70 0,60 L 0,70 C 20,90 60,95 80,65" fill="hsl(var(--secondary))" />
        <path d="M 120,45 C 180,20 200,70 200,60 L 200,70 C 180,90 140,95 120,65" fill="hsl(var(--secondary))" />
        <path d="M100 70 L 100 95 C 100 100, 95 100, 95 100 L 105 100 C 105 100, 100 100, 100 95 Z" fill="hsl(var(--secondary))" />

        {/* Wing Feathers (Accent Color) */}
        <path d="M 78,50 C 30,35 20,65 15,62 C 30,80 55,83 78,60" fill="hsl(var(--accent))" />
        <path d="M 76,55 C 45,48 40,70 35,68 C 48,80 60,82 76,65" fill="hsl(var(--accent))" />
        <path d="M 74,60 C 60,57 58,72 55,71 C 62,80 68,80 74,69" fill="hsl(var(--accent))" />
        
        <path d="M 122,50 C 170,35 180,65 185,62 C 170,80 145,83 122,60" fill="hsl(var(--accent))" />
        <path d="M 124,55 C 155,48 160,70 165,68 C 152,80 140,82 124,65" fill="hsl(var(--accent))" />
        <path d="M 126,60 C 140,57 142,72 145,71 C 138,80 132,80 126,69" fill="hsl(var(--accent))" />
        
        {/* Propeller Hub */}
        <circle cx="100" cy="60" r="22" fill="hsl(var(--secondary))" />

        {/* Propeller Blades */}
        <g transform="translate(100 60)">
            <path d="M0 -28 L -6 0 Q 0 -5 6 0 Z" transform="rotate(0)" fill="hsl(var(--muted-foreground))" />
            <path d="M0 -28 L -6 0 Q 0 -5 6 0 Z" transform="rotate(120)" fill="hsl(var(--muted-foreground))" />
            <path d="M0 -28 L -6 0 Q 0 -5 6 0 Z" transform="rotate(240)" fill="hsl(var(--muted-foreground))" />
        </g>
        
        {/* Hub Details */}
        <circle cx="100" cy="60" r="18" stroke="hsl(var(--muted))" strokeWidth="4" fill="none" />
        <circle cx="100" cy="60" r="4" fill="hsl(var(--secondary))" />
    </svg>
);


export function Logo({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-3 group [text-shadow:0_1px_2px_rgba(0,0,0,0.4)]", className)}>
        <div className={cn("p-1.5 rounded-full border-2 border-primary/80 bg-black/20")}>
            <AeroLogoIcon
                className={cn("h-8 w-8")}
                />
        </div>
        <div>
            <div className="flex items-baseline">
                <span className="font-headline text-xl font-semibold tracking-normal text-white">AERO</span>
                <span className="font-headline text-xl font-semibold tracking-normal" style={{ color: '#EEDC5B' }}>DESK</span>
            </div>
            <p className="text-xs text-white/90 -mt-1 whitespace-nowrap">Organized Charter Network</p>
        </div>
    </div>
  );
}
