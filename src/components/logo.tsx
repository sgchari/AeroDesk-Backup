import { cn } from '@/lib/utils';

const AeroLogoIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 64 42" xmlns="http://www.w3.org/2000/svg" {...props}>
        {/* Wings */}
        <path d="M22 16c-14 2-14 12-22 10 8 8 18 8 22-4z" className="fill-[hsl(var(--accent))]"/>
        <path d="M18 19c-10 1-10 8-18 6 6 6 14 6 18-2z" className="fill-[hsl(var(--accent))] opacity-70"/>
        <path d="M42 16c14 2 14 12 22 10-8 8-18 8-22-4z" className="fill-[hsl(var(--accent))]"/>
        <path d="M46 19c10 1 10 8 18 6-6 6-14 6-18-2z" className="fill-[hsl(var(--accent))] opacity-70"/>
        
        {/* Propeller */}
        <circle cx="32" cy="21" r="10" className="fill-[hsl(var(--secondary))]"/>
        <path d="M30 31 L 34 31 L 33 36 L 31 36 Z"  className="fill-[hsl(var(--secondary))]"/>
        <circle cx="32" cy="21" r="8" className="stroke-[hsl(var(--muted))] fill-none" strokeWidth="1.5"/>
        <circle cx="32" cy="21" r="3" className="fill-[hsl(var(--secondary))]"/>
        
        {/* Blades */}
        <g className="fill-[hsl(var(--muted-foreground))]" transform-origin="32 21">
            <path d="M32 21 L 28 8 L 36 8 Z" transform="rotate(0)"/>
            <path d="M32 21 L 28 8 L 36 8 Z" transform="rotate(120)"/>
            <path d="M32 21 L 28 8 L 36 8 Z" transform="rotate(240)"/>
        </g>
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
            <p className="text-xs text-white/90 -mt-1 whitespace-nowrap">Fly Charter, Stay Premium</p>
        </div>
    </div>
  );
}
