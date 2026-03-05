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
import { FilePlus, ArrowRight, ArrowLeft, CheckCircle2, Plane, Calendar, Users, Hotel, Clock, ShieldCheck, Briefcase, Sparkles } from "lucide-react";
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

type Step = 'ROUTE' | 'PREFERENCES' | 'GOVERNANCE' | 'STAY' | 'AUTOPILOT' | 'SUMMARY';

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
    else if (step === 'STAY') setStep('AUTOPILOT');
    else if (step === 'AUTOPILOT') setStep('SUMMARY');
  };

  const handleBack = () => {
    if (step === 'PREFERENCES') setStep('ROUTE');
    else if (step === 'GOVERNANCE') setStep('PREFERENCES');
    else if (step === 'STAY') {
        if (isCorporate) setStep('GOVERNANCE');
        else setStep('PREFERENCES');
    }
    else if (step === 'AUTOPILOT') setStep('STAY');
    else if (step === 'SUMMARY') setStep('AUTOPILOT');
  };

  const onSubmit = (data: RfqFormValues) => {
    if (!user || !firestore) {
      toast({ title: 'Error', description: 'Action unavailable.', variant: 'destructive'});
      return;
    }

    const rfqCollectionRef = collection(firestore, 'charterRequests');
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
        <Button className="bg-accent text-accent-foreground hover:bg-accent/90">
          <FilePlus className="mr-2 h-4 w-4" />
          {isCorporate ? "Create Travel Request" : "Request a Flight"}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[650px] overflow-hidden flex flex-col max-h-[90vh]">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="outline" className="text-[10px] uppercase tracking-widest font-black text-accent border-accent/20">
                Protocol Phase: {step}
            </Badge>
          </div>
          <DialogTitle className="text-xl font-bold font-headline">
            {step === 'ROUTE' && "Sector Identification"}
            {step === 'PREFERENCES' && "Mission Parameters"}
            {step === 'GOVERNANCE' && "Institutional Governance"}
            {step === 'STAY' && "Ancillary Stay Services"}
            {step === 'AUTOPILOT' && "AI Charter Autopilot"}
            {step === 'SUMMARY' && "Mission Finalization"}
          </DialogTitle>
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
                        <FormLabel className="text-[10px] uppercase font-black tracking-widest">Journey Profile</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                            <SelectTrigger className="bg-muted/20">
                                <SelectValue placeholder="Select a trip type" />
                            </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                            <SelectItem value="Onward">One-Way</SelectItem>
                            <SelectItem value="Return">Return Journey</SelectItem>
                            <SelectItem value="Multi-City">Multi-Sector</SelectItem>
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
                        <FormLabel className="text-[10px] uppercase font-black tracking-widest">Departure Node</FormLabel>
                        <FormControl>
                          <AutocompleteInput 
                            placeholder="e.g., Mumbai (VABB)" 
                            value={field.value} 
                            onChange={field.onChange}
                            className="bg-muted/20"
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
                        <FormLabel className="text-[10px] uppercase font-black tracking-widest">Arrival Node</FormLabel>
                        <FormControl>
                          <AutocompleteInput 
                            placeholder="e.g., Delhi (VIDP)" 
                            value={field.value} 
                            onChange={field.onChange}
                            className="bg-muted/20"
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
                                <FormLabel className="text-[10px] uppercase font-black tracking-widest">Departure Date</FormLabel>
                                <FormControl>
                                <Input type="date" {...field} min={new Date().toISOString().split("T")[0]} className="bg-muted/20" />
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
                                <FormLabel className="text-[10px] uppercase font-black tracking-widest">Time</FormLabel>
                                <FormControl>
                                <Input type="time" {...field} className="bg-muted/20" />
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
                                    <FormLabel className="text-[10px] uppercase font-black tracking-widest">Return Date</FormLabel>
                                    <FormControl>
                                    <Input type="date" {...field} min={formData.departureDate} className="bg-muted/20" />
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
                                    <FormLabel className="text-[10px] uppercase font-black tracking-widest">Time</FormLabel>
                                    <FormControl>
                                    <Input type="time" {...field} className="bg-muted/20" />
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
                            <FormLabel className="text-[10px] uppercase font-black tracking-widest">Passenger Count</FormLabel>
                            <FormControl>
                            <Input type="number" min="1" {...field} className="bg-muted/20" />
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
                            <FormLabel className="text-[10px] uppercase font-black tracking-widest">Asset Class Preference</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                <SelectTrigger className="bg-muted/20">
                                    <SelectValue placeholder="Select a type" />
                                </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectItem value="Any">Optimized Availability</SelectItem>
                                    <SelectItem value="Any Turboprop">Turboprop (Short-haul)</SelectItem>
                                    <SelectItem value="Any Light Jet">Light Jet (Executive)</SelectItem>
                                    <SelectItem value="Any Mid-size Jet">Mid-size Jet (Regional)</SelectItem>
                                    <SelectItem value="Any Heavy Jet">Heavy Jet (Inter-continental)</SelectItem>
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
                      <FormLabel className="text-[10px] uppercase font-black tracking-widest">On-board Coordination Details</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Specific dietary requirements, beverage selection, or cabin handling..." {...field} className="bg-muted/20 h-24" />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            )}

            {step === 'GOVERNANCE' && (
                <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
                    <div className="flex items-center gap-3 p-4 rounded-xl bg-accent/5 border border-accent/20 mb-4">
                        <ShieldCheck className="h-6 w-6 text-accent" />
                        <div className="space-y-0.5">
                            <p className="text-xs font-bold text-white">Institutional Compliance Active</p>
                            <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Governed by {user?.company} Policy Profile.</p>
                        </div>
                    </div>
                    <FormField
                        control={form.control}
                        name="costCenter"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-[10px] uppercase font-black tracking-widest">Cost Center Allocation</FormLabel>
                                <FormControl>
                                    <Input placeholder="e.g., GLOBAL-SUMMIT-2025" {...field} className="bg-muted/20" />
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
                                <FormLabel className="text-[10px] uppercase font-black tracking-widest">Mission Justification</FormLabel>
                                <FormControl>
                                    <Textarea placeholder="Detail the strategic business requirement for this charter..." {...field} className="bg-muted/20 h-24" />
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
                        <FormItem className="flex flex-row items-center justify-between rounded-xl border p-6 bg-muted/20 border-white/5">
                            <div className="space-y-0.5">
                                <FormLabel className="text-base flex items-center gap-2">
                                    <Hotel className="h-5 w-5 text-accent" />
                                    Destination Stay Services
                                </FormLabel>
                                <FormDescription className="text-xs">
                                    Synchronize hotel coordination with flight arrival.
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
                                <FormLabel className="text-[10px] uppercase font-black tracking-widest">Property & Room Preferences</FormLabel>
                                <FormControl>
                                    <Textarea 
                                        placeholder="Preferred hotel chains, suite configurations, or location specific requirements..." 
                                        {...field} 
                                        className="bg-muted/20 h-32"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                )}
              </div>
            )}

            {step === 'AUTOPILOT' && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
                    <div className="p-4 rounded-xl bg-accent/10 border border-accent/30 flex items-center gap-3">
                        <Sparkles className="h-6 w-6 text-accent animate-pulse" />
                        <div>
                            <p className="text-xs font-black text-accent uppercase tracking-widest">AI Charter Autopilot: Active</p>
                            <p className="text-[10px] text-accent/70">Evaluating fleet availability and positioning corridors...</p>
                        </div>
                    </div>

                    <div className="grid gap-4">
                        <p className="text-[10px] font-black uppercase text-muted-foreground tracking-[0.2em] mb-1">Instant Network Recommendations</p>
                        
                        <div className="p-4 rounded-xl border border-accent/20 bg-white/[0.02] flex items-center justify-between group hover:bg-accent/5 transition-all">
                            <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                    <Badge className="bg-accent text-black font-black text-[8px] h-4">BEST VALUE</Badge>
                                    <span className="text-sm font-bold text-white">Citation XLS (FlyCo Charter)</span>
                                </div>
                                <div className="flex items-center gap-3 text-[10px] text-muted-foreground font-medium">
                                    <span className="flex items-center gap-1"><Clock className="h-2.5 w-2.5" /> 2h 15m</span>
                                    <span className="flex items-center gap-1"><ShieldCheck className="h-2.5 w-2.5 text-emerald-500" /> NSOP Verified</span>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-[8px] uppercase font-black text-muted-foreground">Estimated Yield</p>
                                <p className="text-lg font-black text-accent">₹ 8.5 L</p>
                            </div>
                        </div>

                        <div className="p-4 rounded-xl border border-white/5 bg-white/[0.01] flex items-center justify-between opacity-60">
                            <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                    <span className="text-sm font-bold text-white">Phenom 300 (Club One Air)</span>
                                </div>
                                <div className="flex items-center gap-3 text-[10px] text-muted-foreground font-medium">
                                    <span className="flex items-center gap-1"><Clock className="h-2.5 w-2.5" /> 2h 05m</span>
                                    <span className="flex items-center gap-1">Empty Leg Sync Active</span>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-[8px] uppercase font-black text-muted-foreground">Estimated Yield</p>
                                <p className="text-lg font-black text-white">₹ 10.2 L</p>
                            </div>
                        </div>
                    </div>

                    <div className="p-3 bg-muted/20 rounded-lg italic text-[10px] text-muted-foreground text-center">
                        * Estimates are generated based on real-time positioning and historical data. Final pricing is subject to operator quotation.
                    </div>
                </div>
            )}

            {step === 'SUMMARY' && (
              <div className="space-y-4">
                <div className="rounded-xl border bg-accent/5 border-accent/20 p-6 space-y-6">
                    <div className="flex items-center justify-between border-b pb-4 border-accent/10">
                        <div>
                            <h4 className="font-black text-accent uppercase text-[10px] tracking-widest">Mission Index</h4>
                            <p className="text-lg font-bold text-white">{formData.departure.split(' (')[0]} <ArrowRight className="inline mx-2 text-accent/40" /> {formData.arrival.split(' (')[0]}</p>
                        </div>
                        <Badge variant="outline" className="h-6 border-accent/30 text-accent font-black">{formData.tripType}</Badge>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-8">
                        <div className="space-y-1">
                            <Label className="text-muted-foreground text-[10px] uppercase font-black tracking-widest">Sector Schedule</Label>
                            <p className="text-sm font-medium flex items-center gap-2">
                                <Calendar className="h-3.5 w-3.5 text-accent" /> {formData.departureDate}
                                <span className="text-white/20">|</span>
                                <Clock className="h-3.5 w-3.5 text-accent" /> {formData.departureTime}
                            </p>
                        </div>
                        <div className="space-y-1">
                            <Label className="text-muted-foreground text-[10px] uppercase font-black tracking-widest">Manifest & Class</Label>
                            <p className="text-sm font-medium flex items-center gap-2">
                                <Users className="h-3.5 w-3.5 text-accent" /> {formData.pax} PAX
                                <span className="text-white/20">|</span>
                                <Plane className="h-3.5 w-3.5 text-accent" /> {formData.aircraftType}
                            </p>
                        </div>
                    </div>

                    {isCorporate && (
                        <div className="pt-4 border-t border-accent/10 space-y-2">
                            <Label className="text-accent text-[10px] uppercase font-black tracking-widest flex items-center gap-2">
                                <ShieldCheck className="h-3.5 w-3.5" /> Governance Metadata
                            </Label>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-[9px] text-muted-foreground uppercase font-bold">Cost Center</p>
                                    <p className="text-xs font-bold text-white">{formData.costCenter || 'PENDING'}</p>
                                </div>
                                <div>
                                    <p className="text-[9px] text-muted-foreground uppercase font-bold">Justification</p>
                                    <p className="text-xs text-white/70 line-clamp-1">{formData.businessPurpose || 'Operational Requirement'}</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <div className="flex items-start gap-3 p-4 bg-accent/5 border border-accent/20 rounded-xl">
                    <CheckCircle2 className="h-5 w-5 text-accent shrink-0 mt-0.5" />
                    <p className="text-[11px] text-white/70 leading-relaxed italic">
                        {isCorporate 
                            ? "Commiting this request will initiate the Enterprise Approval Workflow. Upon internal sign-off, mission data will be synchronized with the operator network."
                            : "Committing this request will initiate the platform's RFQ Exchange protocol. Operators will review feasibility and submit technical bids."}
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
              className="text-[10px] font-black uppercase tracking-widest"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Return
            </Button>
            
            {step === 'SUMMARY' ? (
              <Button type="button" onClick={form.handleSubmit(onSubmit)} className="bg-accent text-accent-foreground hover:bg-accent/90 font-black uppercase text-[10px] tracking-widest px-8 h-10 shadow-xl shadow-accent/10">
                Commit Mission Protocol
              </Button>
            ) : (
              <Button type="button" onClick={handleNext} className="bg-accent text-accent-foreground hover:bg-accent/90 font-black uppercase text-[10px] tracking-widest h-10 px-8">
                Continue Phase
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}