import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { LucideIcon } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import React from "react";

type StatsCardProps = {
    title: string;
    value: React.ReactNode;
    icon: LucideIcon;
    description?: string;
    href?: string;
    onClick?: () => void;
    trend?: {
        value: string;
        positive: boolean;
    };
}

export function StatsCard({ title, value, icon: Icon, description, href, onClick, trend }: StatsCardProps) {
    const cardContent = (
        <Card 
            className={cn(
                "glass-card-hover group relative overflow-hidden h-full border-white/5",
                (href || onClick) && "cursor-pointer transition-transform active:scale-95"
            )}
            onClick={onClick}
        >
            {/* Soft decorative glow */}
            <div className="absolute top-0 right-0 -mr-4 -mt-4 h-24 w-24 bg-accent/5 blur-3xl rounded-full" />
            
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-4 pt-4">
                <CardTitle className="text-[10px] uppercase font-black tracking-[0.15em] text-muted-foreground group-hover:text-accent transition-colors line-clamp-1">
                    {title}
                </CardTitle>
                <div className="p-1.5 rounded-lg bg-muted/20 group-hover:bg-accent/10 transition-colors">
                    <Icon className="h-4 w-4 text-slate-500 group-hover:text-accent transition-colors shrink-0" />
                </div>
            </CardHeader>
            <CardContent className="px-4 pb-4">
                <div className="flex items-baseline justify-between gap-2">
                    <div className="text-2xl font-black font-headline text-white tracking-tight break-all">{value}</div>
                    {trend && (
                        <div className={cn(
                            "text-[10px] font-black px-1.5 py-0.5 rounded-md",
                            trend.positive ? "bg-emerald-500/10 text-emerald-500" : "bg-rose-500/10 text-rose-500"
                        )}>
                            {trend.positive ? '↑' : '↓'} {trend.value}
                        </div>
                    )}
                </div>
                {description && (
                    <p className="text-[10px] font-bold text-slate-500 uppercase mt-1.5 tracking-tighter line-clamp-1">
                        {description}
                    </p>
                )}
            </CardContent>
        </Card>
    );

    if (href) {
        return <Link href={href} className="block no-underline h-full">{cardContent}</Link>;
    }

    return cardContent;
}