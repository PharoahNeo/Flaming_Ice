import { Layout } from "@/components/layout";
import { MapPin, Phone, Mail, Clock, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";

const OFFICES = [
  { city: "San Francisco", country: "United States", address: "100 Logistics Way, Suite 400, SF, CA 94105", phone: "+1 (800) 555-0199", type: "Global HQ" },
  { city: "London", country: "United Kingdom", address: "50 Canary Wharf, Level 12, London E14 5AB", phone: "+44 20 7946 0958", type: "EMEA HQ" },
  { city: "Singapore", country: "Singapore", address: "18 Marina Boulevard, #28-01, Singapore 018981", phone: "+65 6123 4567", type: "APAC HQ" },
];

export default function Contact() {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });

  function update(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSent(true);
  }

  return (
    <Layout>
      {/* Hero */}
      <section className="pt-36 pb-16 bg-foreground text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_top_right,_#0ea5e9_0%,_transparent_60%)]" />
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 border border-primary/30 text-primary text-sm font-medium mb-6">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              24/7 Support
            </div>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-4">We're here for you.</h1>
            <p className="text-xl text-slate-300">Our global operations team is available around the clock to support your logistics needs.</p>
          </div>
        </div>
      </section>

      {/* Contact Content */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Left: Info */}
            <div>
              <h2 className="text-2xl font-bold mb-8">Get in Touch</h2>

              <div className="space-y-6 mb-12">
                <div className="flex gap-4 p-5 rounded-2xl bg-card border border-border">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <Phone className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="font-bold mb-1">Phone Support</div>
                    <div className="text-muted-foreground text-sm mb-2">Speak to a logistics expert immediately</div>
                    <a href="tel:+18005550199" className="text-primary font-mono font-medium hover:underline">+1 (800) 555-0199</a>
                  </div>
                </div>

                <div className="flex gap-4 p-5 rounded-2xl bg-card border border-border">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <Mail className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="font-bold mb-1">Email</div>
                    <div className="text-muted-foreground text-sm mb-2">We respond within 2 business hours</div>
                    <a href="mailto:support@swiftroute.com" className="text-primary font-medium hover:underline">support@swiftroute.com</a>
                  </div>
                </div>

                <div className="flex gap-4 p-5 rounded-2xl bg-card border border-border">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <Clock className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="font-bold mb-1">Operations Hours</div>
                    <div className="text-muted-foreground text-sm">24 hours a day, 7 days a week</div>
                    <div className="text-muted-foreground text-sm">365 days a year — including holidays</div>
                  </div>
                </div>
              </div>

              {/* Offices */}
              <h2 className="text-2xl font-bold mb-6">Global Offices</h2>
              <div className="space-y-4">
                {OFFICES.map((office) => (
                  <div key={office.city} className="flex gap-4 p-5 rounded-2xl bg-card border border-border">
                    <MapPin className="w-5 h-5 text-primary shrink-0 mt-1" />
                    <div>
                      <div className="font-bold">{office.city}, {office.country}</div>
                      <div className="text-xs text-primary font-medium mb-1">{office.type}</div>
                      <div className="text-sm text-muted-foreground">{office.address}</div>
                      <div className="text-sm text-muted-foreground">{office.phone}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Form */}
            <div>
              <h2 className="text-2xl font-bold mb-8">Send Us a Message</h2>
              {sent ? (
                <div className="text-center py-16 bg-card border border-border rounded-2xl animate-in fade-in">
                  <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-4" />
                  <h3 className="text-xl font-bold mb-2">Message Sent!</h3>
                  <p className="text-muted-foreground mb-6">We'll get back to you at <strong>{form.email}</strong> within 2 hours.</p>
                  <Button variant="outline" onClick={() => { setSent(false); setForm({ name: "", email: "", subject: "", message: "" }); }}>
                    Send Another Message
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="bg-card border border-border rounded-2xl p-8 space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="c-name">Name *</Label>
                      <Input id="c-name" required value={form.name} onChange={(e) => update("name", e.target.value)} placeholder="Your name" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="c-email">Email *</Label>
                      <Input id="c-email" type="email" required value={form.email} onChange={(e) => update("email", e.target.value)} placeholder="your@email.com" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="c-subject">Subject *</Label>
                    <Input id="c-subject" required value={form.subject} onChange={(e) => update("subject", e.target.value)} placeholder="How can we help?" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="c-message">Message *</Label>
                    <textarea
                      id="c-message"
                      required
                      value={form.message}
                      onChange={(e) => update("message", e.target.value)}
                      placeholder="Tell us about your shipping needs..."
                      rows={6}
                      className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none"
                    />
                  </div>
                  <Button type="submit" size="lg" className="w-full">Send Message</Button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
