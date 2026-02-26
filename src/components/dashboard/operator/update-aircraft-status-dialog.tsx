
'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useFirestore, updateDocumentNonBlocking } from '@/firebase';
import { doc } from 'firebase/firestore';
import type { Aircraft } from '@/lib/types';

interface UpdateAircraftStatusDialogProps {
  aircraft: Aircraft | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const statuses: Aircraft['status'][] = ['Available', 'Under Maintenance', 'AOG', 'Restricted'];

export function UpdateAircraftStatusDialog({ aircraft, open, onOpenChange }: UpdateAircraftStatusDialogProps) {
  const { toast } = useToast();
  const firestore = useFirestore();
  const [status, setStatus] = useState<Aircraft['status']>('Available');

  useEffect(() => {
    if (aircraft) setStatus(aircraft.status);
  }, [aircraft]);

  const handleUpdate = () => {
    if (!aircraft || !firestore) return;

    const acRef = doc(firestore, 'operators', aircraft.operatorId, 'aircrafts', aircraft.id);
    updateDocumentNonBlocking(acRef, { status });

    toast({
      title: 'Operational Status Synchronized',
      description: `${aircraft.registration} is now marked as ${status}. Platform constraints updated.`,
    });
    onOpenChange(false);
  };

  if (!aircraft) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Update Operational Status</DialogTitle>
          <DialogDescription>Modify availability for {aircraft.name} ({aircraft.registration}).</DialogDescription>
        </DialogHeader>

        <div className="py-4">
            <RadioGroup value={status} onValueChange={(val) => setStatus(val as Aircraft['status'])} className="space-y-3">
                {statuses.map(s => (
                    <div key={s} className="flex items-center space-x-3 p-3 rounded-md border border-white/5 bg-muted/20 hover:bg-muted/40 cursor-pointer">
                        <RadioGroupItem value={s} id={s} />
                        <Label htmlFor={s} className="flex-1 cursor-pointer font-medium">{s}</Label>
                    </div>
                ))}
            </RadioGroup>
        </div>

        <DialogFooter>
            <Button variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button onClick={handleUpdate} className="bg-accent text-accent-foreground hover:bg-accent/90">Synchronize State</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
