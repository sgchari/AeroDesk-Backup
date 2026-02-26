
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
import { FilePlus, ArrowRight, ArrowLeft, CheckCircle2, Plane, Calendar, Users, Hotel } from "lucide-react";
import { useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useUser } from "@/hooks/use-user";
import { addDocumentNonBlocking, useFirestore } from "@/firebase";
import { collection } from "firebase/firestore";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

const rfqSchema = z.object({
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
  hotelRequired: z.boolean().default(false),
  hotelPreferences: z.string().optional(),
  businessPurpose: z.string().optional(),
  costCenter: z.string().optional(),
});

type RfqFormValues = z.infer<typeof rfqSchema>;

type Step = 'ROUTE' | 'PREFERENCES' | 'STAY' | 'SUMMARY';

export function CreateRfqDialog() {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<Step>('ROUTE');
  const { toast } = useToast();
  const { user } = useUser();
  const firestore = useFirestore();
  const isCtdUser = user?.role === 'CTD Admin';

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
      hotelRequired: false,
      hotelPreferences: "",
      businessPurpose: "",
      costCenter: "",
    },
  });

  const formData = form.watch();

  const handleNext = async () => {
    let fieldsToValidate: any[] = [];
    if (step === 'ROUTE') fieldsToValidate = ['departure', 'arrival', 'departureDate', 'tripType'];
    if (step === 'PREFERENCES') fieldsToValidate = ['pax', 'aircraftType'];
    
    const isValid = await form.trigger(fieldsToValidate as any);
    if (!isValid) return;

    if (step === 'ROUTE') setStep('PREFERENCES');
    else if (step === 'PREFERENCES') setStep('STAY');
    else if (step === 'STAY') setStep('SUMMARY');
  };

  const handleBack = () => {
    if (step === 'PREFERENCES') setStep('ROUTE');
    else if (step === 'STAY') setStep('PREFERENCES');
    else if (step === 'SUMMARY') setStep('STAY');
  };

  const onSubmit = (data: RfqFormValues) => {
    if (!user || !firestore) {
      toast({ title: 'Error', description: 'Action unavailable.', variant: 'destructive'});
      return;
    }

    const rfqCollectionRef = collection(firestore, 'charterRFQs');

    addDocumentNonBlocking(rfqCollectionRef, {
        customerId: user.id,
        requesterExternalAuthId: user.id,
        customerName: `${user.firstName} ${user.lastName}`,
        tripType: data.tripType,
        departure: data.departure,
        arrival: data.arrival,
        departureDate: data.departureDate,
        pax: data.pax,
        aircraftType: data.aircraftType,
        status: isCtdUser ? 'Pending Approval' : 'Bidding Open',
        createdAt: new Date().toISOString(),
        bidsCount: 0,
        ...(data.returnDate && { returnDate: data.returnDate }),
        ...(data.catering && { catering: data.catering }),
        ...(data.specialRequirements && { specialRequirements: data.specialRequirements }),
        ...(data.hotelRequired && { hotelRequired: data.hotelRequired, hotelPreferences: data.hotelPreferences }),
        ...(isCtdUser && { businessPurpose: data.businessPurpose, costCenter: data.costCenter, company: user.company }),
    });
    
    toast({
        title: "Flight Request Submitted",
        description: "Your request is now under coordination with our network operators.",
    });
    setOpen(false);
    form.reset();
    setStep('ROUTE');
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
        setOpen(isOpen);
        if (!isOpen) {
            form.reset();
            setStep('ROUTE');
        }
    }}>
      <DialogTrigger asChild>
        <Button>
          <FilePlus className="mr-2 h-4 w-4" />
          Request a Flight
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] overflow-hidden flex flex-col max-h-[90vh]">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="outline" className="text-[10px] uppercase tracking-widest font-bold text-accent border-accent/20">
                Step {step === 'ROUTE' ? '1' : step === 'PREFERENCES' ? '2' : step === 'STAY' ? '3' : '4'} of 4
            </Badge>
          </div>
          <DialogTitle>
            {step === 'ROUTE' && "Where are we going?"}
            {step === 'PREFERENCES' && "Passenger & Aircraft Preferences"}
            {step === 'STAY' && "Destination Stay Services"}
            {step === 'SUMMARY' && "Review Your Journey"}
          </DialogTitle>
          <DialogDescription>
            {step === 'ROUTE' && "Specify your route and timing details."}
            {step === 'PREFERENCES' && "Tell us about your guests and flight needs."}
            {step === 'STAY' && "Optional hotel coordination at your destination."}
            {step === 'SUMMARY' && "Final check before we notify our operators."}
          </DialogDescription>
        </DialogHeader>

        <Separator className="my-2" />

        <Form {...form}>
          <form className="space-y-6 py-4 flex-1 overflow-y-auto px-1">
            {step === 'ROUTE' && (
              <div className="space-y-4">
                <FormField
                    control={form.control}
                    name="tripType"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Journey Profile</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                            <SelectTrigger>
                                <SelectValue placeholder="Select a trip type" />
                            </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                            <SelectItem value="Onward">One-Way</SelectItem>
                            <SelectItem value="Return">Return</SelectItem>
                            <SelectItem value="Multi-City">Multi-City</SelectItem>
                            </SelectContent>
                        </Select>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="departure"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Departure From</FormLabel>
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
                        <FormLabel>Arrival At</FormLabel>
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
                    {formData.tripType === "Return" && (
                        <FormField
                            control={form.control}
                            name="returnDate"
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel>Return Date</FormLabel>
                                <FormControl>
                                <Input type="date" {...field} min={formData.departureDate} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                    )}
                </div>
              </div>
            )}

            {step === 'PREFERENCES' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="pax"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Number of Passengers</FormLabel>
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
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a type" />
                                </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectItem value="Any">Any Available</SelectItem>
                                    <SelectItem value="Any Turboprop">Turboprop</SelectItem>
                                    <SelectItem value="Any Light Jet">Light Jet</SelectItem>
                                    <SelectItem value="Any Mid-size Jet">Mid-size Jet</SelectItem>
                                    <SelectItem value="Any Heavy Jet">Heavy Jet</SelectItem>
                                </SelectContent>
                            </Select>
                            </FormItem>
                        )}
                    />
                </div>
                <FormField
                  control={form.control}
                  name="catering"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Catering & On-board Requirements</FormLabel>
                      <FormControl>
                        <Textarea placeholder="e.g., Specific meals, beverages, newspaper, floral arrangements..." {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="specialRequirements"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Operational Notes</FormLabel>
                      <FormControl>
                        <Textarea placeholder="e.g., Pet travel, medical equipment, ground transport needs..." {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            )}

            {step === 'STAY' && (
              <div className="space-y-6">
                <FormField
                    control={form.control}
                    name="hotelRequired"
                    render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 bg-muted/20">
                            <div className="space-y-0.5">
                                <FormLabel className="text-base flex items-center gap-2">
                                    <Hotel className="h-4 w-4 text-accent" />
                                    Destination Accommodation
                                </FormLabel>
                                <FormDescription>
                                    Would you like us to coordinate a hotel stay?
                                </FormDescription>
                            </div>
                            <FormControl>
                                <Switch
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                />
                            </FormControl>
                        </FormItem>
                    )}
                />
                {formData.hotelRequired && (
                    <FormField
                        control={form.control}
                        name="hotelPreferences"
                        render={({ field }) => (
                            <FormItem className="animate-in fade-in slide-in-from-top-2">
                                <FormLabel>Accommodation Preferences</FormLabel>
                                <FormControl>
                                    <Textarea 
                                        placeholder="e.g., Number of rooms, specific hotel chain, room category (Suite/King), proximity to city center..." 
                                        {...field} 
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                )}
              </div>
            )}

            {step === 'SUMMARY' && (
              <div className="space-y-4">
                <div className="rounded-lg border bg-muted/10 p-4 space-y-4">
                    <div className="flex items-center justify-between border-b pb-2 border-white/5">
                        <h4 className="font-bold text-accent uppercase text-[10px] tracking-widest">Journey Profile</h4>
                        <Badge variant="outline">{formData.tripType}</Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <Label className="text-muted-foreground text-[10px] uppercase">Route</Label>
                            <p className="text-sm font-medium">{formData.departure} → {formData.arrival}</p>
                        </div>
                        <div className="space-y-1 text-right">
                            <Label className="text-muted-foreground text-[10px] uppercase">Departure</Label>
                            <p className="text-sm font-medium">{formData.departureDate}</p>
                        </div>
                        <div className="space-y-1">
                            <Label className="text-muted-foreground text-[10px] uppercase">Passengers</Label>
                            <p className="text-sm font-medium flex items-center gap-1"><Users className="h-3 w-3" /> {formData.pax} Guest(s)</p>
                        </div>
                        <div className="space-y-1 text-right">
                            <Label className="text-muted-foreground text-[10px] uppercase">Aircraft</Label>
                            <p className="text-sm font-medium flex items-center justify-end gap-1"><Plane className="h-3 w-3" /> {formData.aircraftType}</p>
                        </div>
                    </div>
                    <Separator className="bg-white/5" />
                    <div className="space-y-1">
                        <Label className="text-muted-foreground text-[10px] uppercase">Hotel Stay</Label>
                        <p className="text-sm font-medium">{formData.hotelRequired ? "Requested" : "No Stay Required"}</p>
                    </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-accent/10 border border-accent/20 rounded-lg">
                    <CheckCircle2 className="h-5 w-5 text-accent shrink-0 mt-0.5" />
                    <p className="text-xs text-accent/80 leading-relaxed">
                        By submitting, your request enters our Coordination Protocol. Operators will review feasibility and submit quotations directly to your dashboard.
                    </p>
                </div>
              </div>
            )}
          </form>
        </Form>

        <DialogFooter className="border-t pt-4 gap-2 sm:gap-0">
          <div className="flex justify-between w-full">
            <Button
              type="button"
              variant="ghost"
              onClick={handleBack}
              disabled={step === 'ROUTE'}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
            
            {step === 'SUMMARY' ? (
              <Button type="button" onClick={form.handleSubmit(onSubmit)} className="bg-accent text-accent-foreground hover:bg-accent/90">
                Confirm & Submit Request
              </Button>
            ) : (
              <Button type="button" onClick={handleNext}>
                Continue
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
