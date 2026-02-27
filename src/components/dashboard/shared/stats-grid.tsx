import React from "react";

export function StatsGrid({ children }: { children: React.ReactNode }) {
    return (
        <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
            {children}
        </div>
    )
}
