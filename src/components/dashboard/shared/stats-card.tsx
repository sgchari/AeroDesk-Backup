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
}

export function StatsCard({ title, value, icon: Icon, description, href }: StatsCardProps) {
    const cardContent = (
        <Card className={cn(
            "glass-card-hover group relative overflow-hidden h-full",
            href && "cursor-pointer"
        )}>
            {/* Soft decorative glow */}
            <div className="absolute top-0 right-0 -mr-4 -mt-4 h-24 w-24 bg-primary/5 blur-3xl rounded-full" />
            
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-4 pt-4">
                <CardTitle className="text-[9px] sm:text-[10px] uppercase font-black tracking-[0.1em] sm:tracking-[0.15em] text-slate-500 group-hover:text-primary transition-colors line-clamp-1">
                    {title}
                </CardTitle>
                <Icon className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-slate-600 group-hover:text-primary transition-colors shrink-0" />
            </CardHeader>
            <CardContent className="px-4 pb-4">
                <div className="text-xl sm:text-2xl font-black font-headline text-white tracking-tight break-all">{value}</div>
                {description && (
                    <p className="text-[9px] sm:text-[10px] font-bold text-slate-500 uppercase mt-1 tracking-tighter line-clamp-1">
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
