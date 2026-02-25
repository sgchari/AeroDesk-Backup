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
        <Card className={cn("bg-card", href && "transition-all hover:border-primary")}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{title}</CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{value}</div>
                {description && <p className="text-xs text-muted-foreground">{description}</p>}
            </CardContent>
        </Card>
    );

    if (href) {
        return <Link href={href}>{cardContent}</Link>;
    }

    return cardContent;
}
