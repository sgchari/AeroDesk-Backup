'use client';

import { PageHeader } from "@/components/dashboard/shared/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useCollection } from "@/firebase";
import { Skeleton } from "@/components/ui/skeleton";
import type { UserActivityLog } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { History, User, Clock, MapPin, Activity } from "lucide-react";

export default function ActivityLogsPage() {
    const { data: logs, isLoading } = useCollection<UserActivityLog>(null, 'userActivityLogs');

    return (
        <div className="space-y-6">
            <PageHeader title="Network Activity Stream" description="Immutable log of all coordination events and data transitions across the platform." />

            <Card className="bg-card border-white/5 shadow-2xl">
                <CardHeader className="border-b border-white/5 pb-4">
                    <CardTitle className="text-base flex items-center gap-2">
                        <History className="h-4 w-4 text-accent" />
                        Global Activity Log
                    </CardTitle>
                    <CardDescription>Real-time institutional signal tracking.</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                    {isLoading ? <div className="p-8"><Skeleton className="h-64 w-full" /></div> : (
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow className="border-white/5 hover:bg-transparent">
                                        <TableHead className="pl-6 text-[10px] uppercase font-black">Timestamp</TableHead>
                                        <TableHead className="text-[10px] uppercase font-black">Stakeholder</TableHead>
                                        <TableHead className="text-[10px] uppercase font-black">Action Event</TableHead>
                                        <TableHead className="text-[10px] uppercase font-black">Entity Linked</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {logs?.map((log) => (
                                        <TableRow key={log.id} className="border-white/5 hover:bg-white/[0.02] group">
                                            <TableCell className="pl-6 py-4">
                                                <div className="flex items-center gap-2 text-[10px] font-code text-muted-foreground">
                                                    <Clock className="h-3 w-3" />
                                                    {new Date(log.timestamp).toLocaleString()}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <User className="h-3.5 w-3.5 text-accent/60" />
                                                    <span className="text-xs font-bold text-white">{log.userName || log.userId}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="outline" className="text-[9px] uppercase font-black border-white/10 tracking-widest text-emerald-400">
                                                    {log.action}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <div className="space-y-0.5">
                                                    <p className="text-[10px] font-bold text-white uppercase">{log.entityType}</p>
                                                    <p className="text-[9px] text-muted-foreground font-code">{log.entityId}</p>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
