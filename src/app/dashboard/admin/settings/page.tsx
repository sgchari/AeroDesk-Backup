
'use client';

import { PageHeader } from "@/components/dashboard/shared/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useCollection, useFirestore, useMemoFirebase, updateDocumentNonBlocking } from "@/firebase";
import { FeatureFlag } from "@/lib/types";
import { collection, doc } from "firebase/firestore";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

export default function PlatformSettingsPage() {
    const firestore = useFirestore();
    const { toast } = useToast();
    const { data: featureFlags, isLoading } = useCollection<FeatureFlag>(
        useMemoFirebase(() => {
            if (!firestore || (firestore as any)._isMock) return null;
            return collection(firestore, 'featureFlags');
        }, [firestore]),
        'featureFlags'
    );
    
    const handleToggle = (flagId: string, isEnabled: boolean) => {
        if (!firestore) return;
        
        const flagDocRef = (firestore as any)._isMock
            ? { path: `featureFlags/${flagId}` } as any
            : doc(firestore, 'featureFlags', flagId);

        updateDocumentNonBlocking(flagDocRef, { isEnabled: !isEnabled });
        toast({
            title: "Feature Flag Updated",
            description: `The flag has been ${!isEnabled ? 'enabled' : 'disabled'}.`,
        });
    };

    return (
        <>
            <PageHeader title="System Controls & Platform Governance" description="Configure global settings, feature flags, and risk toggles for the AeroDesk platform." />
            <Card className="bg-card">
                <CardHeader>
                    <CardTitle>System Controls</CardTitle>
                    <CardDescription>
                        Manage global platform configurations and feature flags. Use with caution.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <div className="space-y-6">
                            <Skeleton className="h-12 w-full" />
                            <Skeleton className="h-12 w-full" />
                            <Skeleton className="h-12 w-full" />
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {featureFlags?.map((flag) => (
                                <div key={flag.id} className="flex items-center justify-between p-4 border rounded-lg">
                                    <div className="space-y-1">
                                        <Label htmlFor={`flag-${flag.id}`} className="font-semibold text-base">{flag.name}</Label>
                                        <p className="text-sm text-muted-foreground">{flag.description}</p>
                                    </div>
                                    <Switch
                                        id={`flag-${flag.id}`}
                                        checked={flag.isEnabled}
                                        onCheckedChange={() => handleToggle(flag.id, flag.isEnabled)}
                                    />
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </>
    );
}
