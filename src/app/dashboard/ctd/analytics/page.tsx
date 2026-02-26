
"use client";

import { PageHeader } from "@/components/dashboard/shared/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { StatsCard } from "@/components/dashboard/shared/stats-card";
import { StatsGrid } from "@/components/dashboard/shared/stats-grid";
import { BarChart2, TrendingUp, DollarSign, PieChart, Users, Download, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export default function CTDAnalyticsPage() {
    return (
        <>
            <PageHeader title="Enterprise Travel Analytics" description="Strategic insights into organizational charter spend, demand patterns, and policy compliance." >
                <Button variant="outline" className="gap-2">
                    <Download className="h-4 w-4" />
                    Export Corporate Report
                </Button>
            </PageHeader>

            <StatsGrid>
                <StatsCard title="Total Quarterly Spend" value="₹ 1.4 Cr" icon={DollarSign} description="Actual + Committed Bids" />
                <StatsCard title="Avg. Mission Cost" value="₹ 12.5 L" icon={TrendingUp} description="Per Confirmed Charter" />
                <StatsCard title="Personnel Movements" value="24" icon={Users} description="PAX coordinated this quarter" />
                <StatsCard title="Network Efficiency" value="92%" icon={PieChart} description="Approval-to-Synchronization rate" />
            </StatsGrid>

            <div className="grid gap-6 md:grid-cols-2 mt-6">
                <Card className="bg-card">
                    <CardHeader>
                        <CardTitle>Spending by Cost Center</CardTitle>
                        <CardDescription>Allocation of aviation resources across departments.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-3">
                            <div className="flex justify-between items-center text-xs">
                                <span className="font-medium">EXECUTIVE MANAGEMENT</span>
                                <span className="font-bold">₹ 82 L (58%)</span>
                            </div>
                            <div className="w-full h-2 bg-muted/20 rounded-full overflow-hidden">
                                <div className="h-full bg-accent w-[58%]" />
                            </div>
                        </div>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center text-xs">
                                <span className="font-medium">R&D SPECIAL MISSIONS</span>
                                <span className="font-bold">₹ 34 L (24%)</span>
                            </div>
                            <div className="w-full h-2 bg-muted/20 rounded-full overflow-hidden">
                                <div className="h-full bg-accent w-[24%]" />
                            </div>
                        </div>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center text-xs">
                                <span className="font-medium">GLOBAL LOGISTICS</span>
                                <span className="font-bold">₹ 24 L (18%)</span>
                            </div>
                            <div className="w-full h-2 bg-muted/20 rounded-full overflow-hidden">
                                <div className="h-full bg-accent w-[18%]" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-card">
                    <CardHeader>
                        <CardTitle>Demand Trends</CardTitle>
                        <CardDescription>Sector frequency and timing analysis.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="text-center py-12 border border-white/5 rounded-lg bg-muted/5 italic text-muted-foreground text-xs">
                            <BarChart2 className="h-8 w-8 mx-auto mb-2 opacity-20" />
                            Visual demand forecasting coming in next release.
                        </div>
                        <Separator className="my-4 bg-white/5" />
                        <div className="space-y-2">
                            <h4 className="text-[10px] font-bold uppercase text-accent tracking-widest">Primary Sectors</h4>
                            <div className="flex flex-wrap gap-2">
                                <Badge variant="outline" className="text-[9px]">MUMBAI → DELHI (12)</Badge>
                                <Badge variant="outline" className="text-[9px]">LONDON → NEW YORK (4)</Badge>
                                <Badge variant="outline" className="text-[9px]">SINGAPORE → MUMBAI (3)</Badge>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}
