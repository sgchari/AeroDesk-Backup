
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
import { FilePlus, ArrowRight, ArrowLeft, CheckCircle2, Plane, Calendar, Users, Hotel, Clock, ShieldCheck, Briefcase } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useUser } from "@/hooks/use-user";
import { addDocumentNonBlocking, useFirestore } from "@/firebase";
import { collection } from "firebase/firestore";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const primeDestinations = [
    "Agra (AGR)", "Ahmedabad (AMD)", "Amritsar (ATQ)", "Aurangabad (IXU)", "Bagdogra (IXB)",
    "Bengaluru (BLR)", "Bhopal (BHO)", "Bhubaneswar (BBI)", "Chandigarh (IXC)", "Chennai (MAA)",
    "Cochin (COK)", "Coimbatore (CJB)", "Dehradun (DED)", "Delhi (DEL)", "Goa (GOI)",
    "Guwahati (GAU)", "Hyderabad (HYD)", "Imphal (IMF)", "Indore (IDR)", "Jaipur (JAI)",
    "Jammu (IXJ)", "Jodhpur (JDH)", "Khajuraho (HJR)", "Kolkata (CCU)", "Leh (IXL)",
    "Lucknow (LKO)", "Madurai (IXM)", "Mangalore (IXE)", "Mumbai (BOM)", "Nagpur (NAG)",
    "Patna (PAT)", "Port Blair (IXZ)", "Pune (PNQ)", "Raipur (RPR)", "Ranchi (IXR)",
    "Srinagar (SXR)", "Thiruvananthapuram (TRV)", "Tiruchirappalli (TRZ)", "Udaipur (UDR)", "Varanasi (VNS)",
    "Visakhapatnam (VTZ)", "Dubai (DXB)", "London (LHR)", "New York (JFK)", "Singapore (SIN)",
    "Bangkok (BKK)", "Male (MLE)"
];

const AutocompleteInput = ({ value, onChange, placeholder, className }: { value: string; onChange: (value: string) => void; placeholder: string; className?: string }) => {
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setShowSuggestions(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const inputValue = e.target.value;
        onChange(inputValue);

        if (inputValue.length >= 1) {
            const filtered = primeDestinations.filter(dest =>
                dest.toLowerCase().includes(inputValue.toLowerCase())
            );
            setSuggestions(filtered);
            setShowSuggestions(filtered.length > 0);
        } else {
            setSuggestions([]);
            setShowSuggestions(false);
        }
    };

    const handleSelectSuggestion = (suggestion: string) => {
        onChange(suggestion);
        setSuggestions([]);
        setShowSuggestions(false);
    };

    return (
        <div className="relative w-full" ref={containerRef}>
            <Input
                type="text"
                placeholder={placeholder}
                value={value}
                onChange={handleInputChange}
                onFocus={() => {
                    if (value.length >= 1) {
                        const filtered = primeDestinations.filter(dest =>
                            dest.toLowerCase().includes(value.toLowerCase())
                        );
                        setSuggestions(filtered);
                        setShowSuggestions(filtered.length > 0);
                    }
                }}
                className={className}
                autoComplete="off"
            />
            {showSuggestions && (
                <div className="absolute z-[100] w-full bg-popover border border-border rounded-md mt-1 shadow-lg max-h-60 overflow-y-auto">
                    {suggestions.map((suggestion, index) => (
                        <div
                            key={index}
                            className="p-2 hover:bg-accent hover:text-accent-foreground cursor-pointer text-sm"
                            onClick={() => handleSelectSuggestion(suggestion)}
                        >
                            {suggestion}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

const rfqSchema = z.object({
  tripType: z.enum(["Onward", "Return", "Multi-City"], { required_error: "Trip type is required." }),
  departure: z.string().min(3, "Departure location is required."),
  arrival: z.string().min(3, "Arrival location is required."),
  departureDate: z.string().refine((val) => val && !isNaN(Date.parse(val)), {
    message: "Invalid date",
  }),
  departureTime: z.string().min(1, "Departure time is required."),
  returnDate: z.string().optional(),
  returnTime: z.string().optional(),
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

type Step = 'ROUTE' | 'PREFERENCES' | 'GOVERNANCE' | 'STAY' | 'SUMMARY';

export function CreateRfqDialog() {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<Step>('ROUTE');
  const { toast } = useToast();
  const { user } = useUser();
  const firestore = useFirestore();
  const isCorporate = user?.role === 'CTD Admin' || user?.role === 'Corporate Admin' || user?.role === 'Requester';

  const form = useForm<RfqFormValues>({
    resolver: zodResolver(rfqSchema),
    defaultValues: {
      tripType: "Onward",
      departure: "",
      arrival: "",
      departureDate: new Date().toISOString().split("T")[0],
      departureTime: "10:00",
      returnDate: "",
      returnTime: "16:00",
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
    if (step === 'ROUTE') fieldsToValidate = ['departure', 'arrival', 'departureDate', 'departureTime', 'tripType'];
    if (step === 'PREFERENCES') fieldsToValidate = ['pax', 'aircraftType'];
    if (step === 'GOVERNANCE') fieldsToValidate = ['businessPurpose', 'costCenter'];
    
    const isValid = await form.trigger(fieldsToValidate as any);
    if (!isValid) return;

    if (step === 'ROUTE') setStep('PREFERENCES');
    else if (step === 'PREFERENCES') {
        if (isCorporate) setStep('GOVERNANCE');
        else setStep('STAY');
    }
    else if (step === 'GOVERNANCE') setStep('STAY');
    else if (step === 'STAY') setStep('SUMMARY');
  };

  const handleBack = () => {
    if (step === 'PREFERENCES') setStep('ROUTE');
    else if (step === 'GOVERNANCE') setStep('PREFERENCES');
    else if (step === 'STAY') {
        if (isCorporate) setStep('GOVERNANCE');
        else setStep('PREFERENCES');
    }
    else if (step === 'SUMMARY') setStep('STAY');
  };

  const onSubmit = (data: RfqFormValues) => {
    if (!user || !firestore) {
      toast({ title: 'Error', description: 'Action unavailable.', variant: 'destructive'});
      return;
    }

    const rfqCollectionRef = collection(firestore, 'charterRFQs');

    // Corporate logic: Requests move to 'Pending Approval' (Internal)
    const status = isCorporate ? 'Pending Approval' : 'Bidding Open';

    addDocumentNonBlocking(rfqCollectionRef, {
        customerId: user.id,
        requesterExternalAuthId: user.id,
        customerName: `${user.firstName} ${user.lastName}`,
        tripType: data.tripType,
        departure: data.departure,
        arrival: data.arrival,
        departureDate: data.departureDate,
        departureTime: data.departureTime,
        pax: data.pax,
        aircraftType: data.aircraftType,
        status: status,
        createdAt: new Date().toISOString(),
        bidsCount: 0,
        ...(data.returnDate && { returnDate: data.returnDate }),
        ...(data.returnTime && { returnTime: data.returnTime }),
        ...(data.catering && { catering: data.catering }),
        ...(data.specialRequirements && { specialRequirements: data.specialRequirements }),
        ...(data.hotelRequired && { hotelRequired: data.hotelRequired, hotelPreferences: data.hotelPreferences }),
        ...(isCorporate && { businessPurpose: data.businessPurpose, costCenter: data.costCenter, company: user.company }),
    });
    
    toast({
        title: isCorporate ? "Internal Approval Requested" : "Flight Request Submitted",
        description: isCorporate 
            ? "Your request has been sent to the Travel Desk for governance review." 
            : "Your request is now under coordination with our network operators.",
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
          {isCorporate ? "Create Travel Request" : "Request a Flight"}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] overflow-hidden flex flex-col max-h-[90vh]">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="outline" className="text-[10px] uppercase tracking-widest font-bold text-accent border-accent/20">
                Step {step === 'ROUTE' ? '1' : step === 'PREFERENCES' ? '2' : step === 'GOVERNANCE' ? '3' : step === 'STAY' ? '4' : '5'} of {isCorporate ? '5' : '4'}
            </Badge>
          </div>
          <DialogTitle>
            {step === 'ROUTE' && "Where are we going?"}
            {step === 'PREFERENCES' && "Passenger & Aircraft Preferences"}
            {step === 'GOVERNANCE' && "Enterprise Governance"}
            {step === 'STAY' && "Destination Stay Services"}
            {step === 'SUMMARY' && "Review Your Journey"}
          </DialogTitle>
          <DialogDescription>
            {step === 'ROUTE' && "Specify your route and timing details."}
            {step === 'PREFERENCES' && "Tell us about your guests and flight needs."}
            {step === 'GOVERNANCE' && "Mandatory data for corporate policy compliance."}
            {step === 'STAY' && "Optional hotel coordination at your destination."}
            {step === 'SUMMARY' && "Final check before internal submission."}
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
                          <AutocompleteInput 
                            placeholder="e.g., Mumbai (VABB)" 
                            value={field.value} 
                            onChange={field.onChange}
                          />
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
                          <AutocompleteInput 
                            placeholder="e.g., Delhi (VIDP)" 
                            value={field.value} 
                            onChange={field.onChange}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="grid grid-cols-2 gap-2">
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
                        <FormField
                            control={form.control}
                            name="departureTime"
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel>Time</FormLabel>
                                <FormControl>
                                <Input type="time" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                    </div>
                    {formData.tripType === "Return" && (
                        <div className="grid grid-cols-2 gap-2">
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
                            <FormField
                                control={form.control}
                                name="returnTime"
                                render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Time</FormLabel>
                                    <FormControl>
                                    <Input type="time" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                                )}
                            />
                        </div>
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
                        <Textarea placeholder="e.g., Specific meals, beverages..." {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            )}

            {step === 'GOVERNANCE' && (
                <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
                    <div className="flex items-center gap-3 p-3 bg-muted/20 border border-white/5 rounded-lg mb-4">
                        <ShieldCheck className="h-5 w-5 text-accent" />
                        <p className="text-xs text-muted-foreground">
                            This request is subject to the <span className="font-bold text-foreground">{user?.company}</span> Travel Policy.
                        </p>
                    </div>
                    <FormField
                        control={form.control}
                        name="costCenter"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Cost Center / Project Reference</FormLabel>
                                <FormControl>
                                    <Input placeholder="e.g., Q3-GLOBAL-SUMMIT" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="businessPurpose"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Justification / Business Purpose</FormLabel>
                                <FormControl>
                                    <Textarea placeholder="Detail the strategic requirement for this charter..." {...field} />
                                </FormControl>
                                <FormMessage />
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
                                    Coordinate hotel stays at destination?
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
                                        placeholder="Specific hotel chains, room counts, or location preferences..." 
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
                            <Label className="text-muted-foreground text-[10px] uppercase">Schedule</Label>
                            <p className="text-sm font-medium flex items-center justify-end gap-1.5">
                                <Calendar className="h-3 w-3" /> {formData.departureDate}
                                <Clock className="h-3 w-3 ml-1" /> {formData.departureTime}
                            </p>
                        </div>
                        {isCorporate && (
                            <div className="col-span-2 space-y-1 pt-2 border-t border-white/5">
                                <Label className="text-muted-foreground text-[10px] uppercase flex items-center gap-1.5"><Briefcase className="h-3 w-3" /> Governance Context</Label>
                                <p className="text-xs font-medium">Cost Center: {formData.costCenter || 'N/A'}</p>
                                <p className="text-xs text-muted-foreground truncate">{formData.businessPurpose}</p>
                            </div>
                        )}
                    </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-accent/10 border border-accent/20 rounded-lg">
                    <CheckCircle2 className="h-5 w-5 text-accent shrink-0 mt-0.5" />
                    <p className="text-xs text-accent/80 leading-relaxed">
                        {isCorporate 
                            ? "By submitting, your request enters the Enterprise Approval Workflow. Upon internal sign-off, it will be synchronized with network operators."
                            : "By submitting, your request enters our Coordination Protocol. Operators will review feasibility and submit quotations."}
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
                {isCorporate ? "Submit for Approval" : "Confirm & Submit Request"}
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
