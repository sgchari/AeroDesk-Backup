"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { FilePlus, Bot, Loader2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { verifyCompliance } from "@/ai/flows/verify-compliance";
import type { ComplianceVerificationOutput } from "@/ai/flows/verify-compliance";
import { ComplianceCheckResult } from "./compliance-check-result";

const rfqSchema = z.object({
  departure: z.string().min(3, "Departure location is required."),
  arrival: z.string().min(3, "Arrival location is required."),
  departureDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Invalid date",
  }),
  pax: z.coerce.number().int().positive("Number of passengers must be positive."),
  aircraftType: z.string().min(1, "Aircraft type is required."),
});

type RfqFormValues = z.infer<typeof rfqSchema>;

export function CreateRfqDialog() {
  const [open, setOpen] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [complianceResult, setComplianceResult] = useState<ComplianceVerificationOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<RfqFormValues>({
    resolver: zodResolver(rfqSchema),
    defaultValues: {
      departure: "",
      arrival: "",
      departureDate: new Date().toISOString().split("T")[0],
      pax: 1,
      aircraftType: "Any Light Jet",
    },
  });

  const handleVerify = async () => {
    const isFormValid = await form.trigger();
    if (!isFormValid) {
        toast({
            title: "Invalid Form",
            description: "Please fill out all required fields correctly before verifying compliance.",
            variant: "destructive",
        });
        return;
    }
    
    setIsVerifying(true);
    setComplianceResult(null);
    try {
      const formData = form.getValues();
      const result = await verifyCompliance({
        itemDetails: `
            - Departure: ${formData.departure}
            - Arrival: ${formData.arrival}
            - Departure Date: ${formData.departureDate}
            - Passengers: ${formData.pax}
            - Aircraft Preference: ${formData.aircraftType}
        `,
        context:
          "Verifying a new charter flight request (RFQ) from a customer against Indian NSOP regulations and internal policies.",
      });
      setComplianceResult(result);
    } catch (error) {
      console.error("Compliance verification failed:", error);
      toast({
        title: "Verification Failed",
        description: "Could not run compliance check. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsVerifying(false);
    }
  };

  const onSubmit = (data: RfqFormValues) => {
    console.log(data);
    toast({
      title: "RFQ Submitted",
      description: "Your charter request has been submitted for bidding.",
    });
    setOpen(false);
    form.reset();
    setComplianceResult(null);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <FilePlus className="mr-2 h-4 w-4" />
          Create Charter RFQ
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>Create New Charter Request (RFQ)</DialogTitle>
          <DialogDescription>
            Fill in the details for your trip. This will be sent to verified
            operators for quotations.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="departure"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Departure</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Mumbai (VABB)" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="arrival"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Arrival</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Delhi (VIDP)" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                    control={form.control}
                    name="departureDate"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Departure Date</FormLabel>
                        <FormControl>
                        <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="pax"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Passengers</FormLabel>
                        <FormControl>
                        <Input type="number" min="1" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
            </div>
            <FormField
              control={form.control}
              name="aircraftType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Aircraft Preference</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a preferred aircraft type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Any">Any</SelectItem>
                      <SelectItem value="Any Turboprop">Any Turboprop</SelectItem>
                      <SelectItem value="Any Light Jet">Any Light Jet</SelectItem>
                      <SelectItem value="Any Mid-size Jet">Any Mid-size Jet</SelectItem>
                      <SelectItem value="Any Heavy Jet">Any Heavy Jet</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {complianceResult && <ComplianceCheckResult result={complianceResult} />}

            <DialogFooter className="pt-4">
                <Button type="button" variant="outline" onClick={handleVerify} disabled={isVerifying}>
                    {isVerifying ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Bot className="mr-2 h-4 w-4" />}
                    Verify Compliance
                </Button>
                <Button type="submit">Submit RFQ</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
