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
            "glass-card-hover group relative overflow-hidden",
            href && "cursor-pointer"
        )}>
            {/* Soft decorative glow */}
            <div className="absolute top-0 right-0 -mr-4 -mt-4 h-24 w-24 bg-primary/5 blur-3xl rounded-full" />
            
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-[10px] uppercase font-black tracking-[0.15em] text-slate-500 group-hover:text-primary transition-colors">
                    {title}
                </CardTitle>
                <Icon className="h-4 w-4 text-slate-600 group-hover:text-primary transition-colors" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-black font-headline text-white tracking-tight">{value}</div>
                {description && <p className="text-[10px] font-bold text-slate-500 uppercase mt-1 tracking-tighter">{description}</p>}
            </CardContent>
        </Card>
    );

    if (href) {
        return <Link href={href} className="block no-underline">{cardContent}</Link>;
    }

    return cardContent;
}
