
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info, AlertTriangle, ShieldAlert } from "lucide-react";
import { cn } from "@/lib/utils";

type AdvisoryLevel = 'INFO' | 'WARNING' | 'CRITICAL';

interface SystemAdvisoryProps {
    level: AdvisoryLevel;
    title: string;
    message: string;
    className?: string;
}

export function SystemAdvisory({ level, title, message, className }: SystemAdvisoryProps) {
    const config = {
        INFO: { icon: Info, variant: "default" as const, textClass: "text-blue-500" },
        WARNING: { icon: AlertTriangle, variant: "default" as const, textClass: "text-amber-500" },
        CRITICAL: { icon: ShieldAlert, variant: "destructive" as const, textClass: "text-destructive" },
    }[level];

    const Icon = config.icon;

    return (
        <Alert variant={config.variant} className={cn("bg-muted/30 border-white/10", className)}>
            <Icon className={cn("h-4 w-4", config.textClass)} />
            <AlertTitle className={cn("font-bold text-xs uppercase tracking-widest", config.textClass)}>
                System Advisory: {title}
            </AlertTitle>
            <AlertDescription className="text-xs text-muted-foreground mt-1">
                {message}
            </AlertDescription>
        </Alert>
    );
}
