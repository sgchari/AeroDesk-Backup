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
  FormDescription,
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
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { FilePlus } from "lucide-react";
import { useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useUser } from "@/hooks/use-user";

const baseRfqSchema = z.object({
  tripType: z.enum(["Onward", "Return", "Multi-City"], { required_error: "Trip type is required." }),
  departure: z.string().min(3, "Departure location is required."),
  arrival: z.string().min(3, "Arrival location is required."),
  departureDate: z.string().refine((val) => val && !isNaN(Date.parse(val)), {
    message: "Invalid date",
  }),
  returnDate: z.string().optional(),
  pax: z.coerce.number().int().positive("Number of passengers must be positive."),
  aircraftType: z.string().min(1, "Aircraft type is required."),
  catering: z.string().optional(),
  specialRequirements: z.string().optional(),
});

const ctdRfqSchema = baseRfqSchema.extend({
  businessPurpose: z.string().min(1, "Business purpose is required."),
  costCenter: z.string().min(1, "Cost center is required."),
});

type RfqFormValues = z.infer<typeof ctdRfqSchema>;


export function CreateRfqDialog() {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const { user } = useUser();
  const isCtdUser = user?.role === 'CTD Admin';

  const rfqSchema = useMemo(() => {
    const schema = isCtdUser ? ctdRfqSchema : baseRfqSchema;
    return schema.refine(data => {
        if (data.tripType === 'Return') {
            return !!data.returnDate && !isNaN(Date.parse(data.returnDate)) && new Date(data.returnDate) > new Date(data.departureDate);
        }
        return true;
    }, {
        message: "Return date must be after departure date.",
        path: ["returnDate"],
    });
  }, [isCtdUser]);

  const form = useForm<RfqFormValues>({
    resolver: zodResolver(rfqSchema),
    defaultValues: {
      tripType: "Onward",
      departure: "",
      arrival: "",
      departureDate: new Date().toISOString().split("T")[0],
      returnDate: "",
      pax: 1,
      aircraftType: "Any Light Jet",
      catering: "",
      specialRequirements: "",
      ...(isCtdUser ? { businessPurpose: "", costCenter: "" } : {}),
    },
  });

  const tripType = form.watch("tripType");

  const onSubmit = (data: RfqFormValues) => {
    if (!user) {
      toast({ title: 'Error', description: 'User not available.', variant: 'destructive'});
      return;
    }
    
    toast({
      title: "RFQ Submitted",
      description: "Your Request for Quotation has been submitted.",
    });
    setOpen(false);
    form.reset();
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
        setOpen(isOpen);
        if (!isOpen) {
            form.reset();
        }
    }}>
      <DialogTrigger asChild>
        <Button>
          <FilePlus className="mr-2 h-4 w-4" />
          Create Charter RFQ
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>New Charter Request for Quotation</DialogTitle>
          <DialogDescription>
            Complete the form to generate an RFQ. This will be sent to verified operators for quotations.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
                control={form.control}
                name="tripType"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Trip Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                        <SelectTrigger>
                            <SelectValue placeholder="Select a trip type" />
                        </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                        <SelectItem value="Onward">Onward</SelectItem>
                        <SelectItem value="Return">Return</SelectItem>
                        <SelectItem value="Multi-City">Multi-City</SelectItem>
                        </SelectContent>
                    </Select>
                    <FormMessage />
                    </FormItem>
                )}
            />
            {isCtdUser && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="businessPurpose"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Business Purpose</FormLabel>
                                <FormControl>
                                <Input placeholder="e.g., Client Meeting, Site Visit" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="costCenter"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Cost Center</FormLabel>
                                <FormControl>
                                <Input placeholder="e.g., PROJ-FIN-0123" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
            )}
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
                        <Input type="date" {...field} min={new Date().toISOString().split("T")[0]} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                {tripType === "Return" && (
                    <FormField
                        control={form.control}
                        name="returnDate"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Return Date</FormLabel>
                            <FormControl>
                            <Input type="date" {...field} min={form.getValues('departureDate') || new Date().toISOString().split("T")[0]} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            </div>
            
            <FormField
              control={form.control}
              name="catering"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Catering Request</FormLabel>
                  <FormControl>
                    <Textarea placeholder="e.g., Vegetarian meals, specific beverages..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="specialRequirements"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Special Requirements</FormLabel>
                  <FormControl>
                    <Textarea placeholder="e.g., Wheelchair access, medical equipment, pet travel. For Multi-City, please detail your itinerary here." {...field} />
                  </FormControl>
                   {tripType === 'Multi-City' && <FormDescription>Please provide the full itinerary for your multi-city trip here.</FormDescription>}
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="pt-4">
                <Button type="submit">Submit RFQ</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
