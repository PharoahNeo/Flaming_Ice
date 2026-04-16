import { Layout } from "@/components/layout";
import { useSubmitQuote } from "@workspace/api-client-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CheckCircle2, Package } from "lucide-react";

const SERVICE_OPTIONS = [
  { value: "standard", label: "Standard Freight", desc: "3-7 business days" },
  { value: "express", label: "Express Delivery", desc: "1-2 business days" },
  { value: "freight", label: "Air Freight", desc: "1-3 business days" },
  { value: "international", label: "International", desc: "5-14 business days" },
];

export default function Quote() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: "", email: "", phone: "", origin: "", destination: "", weight: "", serviceType: "standard", notes: "",
  });

  const submitQuote = useSubmitQuote();

  function update(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    await submitQuote.mutateAsync({
      data: {
        name: form.name,
        email: form.email,
        phone: form.phone || undefined,
        origin: form.origin,
        destination: form.destination,
        weight: form.weight ? Number(form.weight) : undefined,
        serviceType: form.serviceType as "standard" | "express" | "freight" | "international",
        notes: form.notes || undefined,
      }
    });
    setSubmitted(true);
  }

  return (
    <Layout>
      {/* Hero */}
      <section className="pt-36 pb-16 bg-foreground text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_bottom_left,_#0ea5e9_0%,_transparent_60%)]" />
        <div className="container mx-auto px-4 md:px-6 relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 border border-primary/30 text-primary text-sm font-medium mb-6">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            Free Quote
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">Request a Quote</h1>
          <p className="text-xl text-slate-300">Fill out the form below and our team will get back to you with a tailored shipping solution within 2 business hours.</p>
        </div>
      </section>

      {/* Form */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 md:px-6 max-w-2xl">
          {submitted ? (
            <div className="text-center py-16 animate-in fade-in slide-in-from-bottom-4">
              <div className="w-20 h-20 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-10 h-10 text-green-500" />
              </div>
              <h2 className="text-3xl font-bold mb-4">Quote Request Received!</h2>
              <p className="text-muted-foreground text-lg mb-8 max-w-md mx-auto">
                Thank you, <strong>{form.name}</strong>. Our logistics team will review your request and reach out to <strong>{form.email}</strong> within 2 business hours.
              </p>
              <Button size="lg" onClick={() => { setSubmitted(false); setForm({ name: "", email: "", phone: "", origin: "", destination: "", weight: "", serviceType: "standard", notes: "" }); }}>
                Submit Another Request
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Contact Info */}
              <div className="bg-card border border-border rounded-2xl p-6">
                <h2 className="font-bold text-lg mb-6 flex items-center gap-2">
                  <Package className="w-5 h-5 text-primary" />
                  Contact Information
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name *</Label>
                    <Input id="name" required value={form.name} onChange={(e) => update("name", e.target.value)} placeholder="John Smith" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address *</Label>
                    <Input id="email" type="email" required value={form.email} onChange={(e) => update("email", e.target.value)} placeholder="john@company.com" />
                  </div>
                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input id="phone" type="tel" value={form.phone} onChange={(e) => update("phone", e.target.value)} placeholder="+1 (555) 000-0000" />
                  </div>
                </div>
              </div>

              {/* Shipment Details */}
              <div className="bg-card border border-border rounded-2xl p-6">
                <h2 className="font-bold text-lg mb-6">Shipment Details</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="origin">Origin *</Label>
                    <Input id="origin" required value={form.origin} onChange={(e) => update("origin", e.target.value)} placeholder="City, Country" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="destination">Destination *</Label>
                    <Input id="destination" required value={form.destination} onChange={(e) => update("destination", e.target.value)} placeholder="City, Country" />
                  </div>
                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="weight">Weight (kg)</Label>
                    <Input id="weight" type="number" min="0" step="0.1" value={form.weight} onChange={(e) => update("weight", e.target.value)} placeholder="e.g. 25.5" />
                  </div>
                </div>
              </div>

              {/* Service Type */}
              <div className="bg-card border border-border rounded-2xl p-6">
                <h2 className="font-bold text-lg mb-6">Service Type *</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {SERVICE_OPTIONS.map((opt) => (
                    <label
                      key={opt.value}
                      className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                        form.serviceType === opt.value
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-border/80"
                      }`}
                    >
                      <input type="radio" name="service" value={opt.value} checked={form.serviceType === opt.value} onChange={() => update("serviceType", opt.value)} className="sr-only" />
                      <div className={`w-4 h-4 rounded-full border-2 shrink-0 ${form.serviceType === opt.value ? "border-primary bg-primary" : "border-muted-foreground"}`} />
                      <div>
                        <div className="font-medium">{opt.label}</div>
                        <div className="text-sm text-muted-foreground">{opt.desc}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Notes */}
              <div className="bg-card border border-border rounded-2xl p-6">
                <h2 className="font-bold text-lg mb-4">Additional Notes</h2>
                <textarea
                  value={form.notes}
                  onChange={(e) => update("notes", e.target.value)}
                  placeholder="Special handling requirements, cargo type, insurance needs, etc."
                  rows={4}
                  className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none"
                />
              </div>

              <Button type="submit" size="lg" className="w-full h-14 text-base" disabled={submitQuote.isPending}>
                {submitQuote.isPending ? "Submitting..." : "Submit Quote Request"}
              </Button>
            </form>
          )}
        </div>
      </section>
    </Layout>
  );
}
