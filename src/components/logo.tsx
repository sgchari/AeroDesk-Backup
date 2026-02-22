import { cn } from '@/lib/utils';

const AeroLogoIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
        <path d="M2 11.25H22V12.75H2V11.25Z" />
        <path d="M11.25 4.5V19.5H12.75V4.5H11.25Z" />
        <path d="M9.75 19.5L12 22.5L14.25 19.5H9.75Z" />
    </svg>
);


export function Logo({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-3 group", className)}>
        <div className={cn("p-1.5 rounded-md bg-transparent border border-primary/50")}>
            <AeroLogoIcon
                className={cn("h-5 w-5 text-primary")}
                />
        </div>
        <div>
            <div className="flex items-baseline">
                <span className="font-headline text-xl font-bold tracking-wider text-foreground">AERO</span>
                <span className="font-headline text-xl font-bold tracking-wider text-primary">DESK</span>
            </div>
            <p className="text-xs text-muted-foreground -mt-1">Organized Charter Platform</p>
        </div>
    </div>
  );
}
