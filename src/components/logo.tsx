import { cn } from '@/lib/utils';

const AeroLogoIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg
        viewBox="0 0 24 24"
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
    >
        <path
            d="M20.94,11.35,12,6,3.06,11.35a.51.51,0,0,0-.06.71.5.5,0,0,0,.71.06L12,7.32l8.29,4.79a.5.5,0,0,0,.71-.06A.51.51,0,0,0,20.94,11.35Z"
        />
        <path
            d="M12,17.32,3.71,12.53a.5.5,0,0,0-.71.06.51.51,0,0,0,.06.71L12,18,20.94,12.6a.51.51,0,0,0,.06-.71.5.5,0,0,0-.71-.06Z"
        />
    </svg>
);


export function Logo({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-3 group", className)}>
        <div className={cn("p-2 rounded-full border-2 border-primary/50")}>
            <AeroLogoIcon
                className={cn("h-4 w-4 text-primary")}
                />
        </div>
        <div>
            <div className="flex items-baseline">
                <span className="font-headline text-xl font-semibold tracking-normal text-foreground">AERO</span>
                <span className="font-headline text-xl font-semibold tracking-normal text-accent">DESK</span>
            </div>
            <p className="text-xs text-muted-foreground -mt-1">Organized Charter Platform</p>
        </div>
    </div>
  );
}
