import { Layout } from "@/components/layout";
import { useGetStats, useListServices, useTrackShipment, getTrackShipmentQueryKey } from "@workspace/api-client-react";
import { ArrowRight, Package, ShieldCheck, Timer, Globe, ChevronRight, Search, CheckCircle2, Users, Award, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "wouter";
import heroImg from "@/assets/images/hero.png";
import warehouseImg from "@/assets/images/warehouse.png";
import networkImg from "@/assets/images/network.png";
import { useState } from "react";
import { cn } from "@/lib/utils";

function StatCard({ value, label, delay }: { value: number; label: string; delay: number }) {
  return (
    <div
      className="p-8 rounded-xl bg-card border border-border shadow-sm hover:shadow-md transition-all duration-500 animate-in fade-in slide-in-from-bottom-8 fill-mode-both"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="text-4xl md:text-5xl font-mono font-bold text-foreground mb-2">
        {value.toLocaleString()}
        <span className="text-primary">+</span>
      </div>
      <div className="text-muted-foreground font-medium text-sm tracking-wide uppercase">{label}</div>
    </div>
  );
}

const STATUS_COLORS: Record<string, string> = {
  "Delivered": "text-green-500",
  "In Transit": "text-blue-500",
  "Out for Delivery": "text-orange-500",
  "Picked Up": "text-primary",
};

export default function Home() {
  const { data: stats } = useGetStats();
  const { data: services } = useListServices();

  const [trackInput, setTrackInput] = useState("");
  const [activeTrack, setActiveTrack] = useState("");

  const { data: trackData, isLoading: trackLoading, isError: trackError } = useTrackShipment(
    activeTrack,
    { query: { enabled: !!activeTrack, queryKey: getTrackShipmentQueryKey(activeTrack) } }
  );

  function handleTrack() {
    const trimmed = trackInput.trim().toUpperCase();
    if (trimmed) setActiveTrack(trimmed);
  }

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center pt-20 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-r from-[#081226] via-[#081226]/80 to-transparent z-10" />
          <img src={heroImg} alt="SwiftRoute Logistics" className="w-full h-full object-cover object-center" />
        </div>

        <div className="container mx-auto px-4 md:px-6 relative z-20">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 border border-primary/30 text-primary text-sm font-medium mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              Global Logistics & Freight Forwarding
            </div>

            <h1 className="text-5xl md:text-7xl font-bold text-white leading-[1.1] mb-6 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100 fill-mode-both tracking-tight">
              Move at the speed of <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-cyan-400">enterprise.</span>
            </h1>

            <p className="text-lg md:text-xl text-slate-300 mb-10 max-w-xl leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200 fill-mode-both">
              Precision logistics for modern supply chains. Track shipments in real-time, get instant quotes, and deliver on time, every time.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300 fill-mode-both">
              <Button size="lg" className="h-14 px-8 text-base shadow-lg shadow-primary/25" asChild>
                <Link href="/quote">
                  Request a Quote <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="h-14 px-8 text-base bg-white/5 text-white border-white/20 hover:bg-white/10 hover:text-white" asChild>
                <Link href="/tracking">
                  Track Shipment
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Track Section */}
      <section className="py-16 bg-primary/5 border-y border-primary/10">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-xl font-bold text-center mb-6">Track Your Shipment</h2>
            <div className="flex gap-3">
              <Input
                value={trackInput}
                onChange={(e) => setTrackInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleTrack()}
                placeholder="Enter tracking number, e.g. SWR-2024-001"
                className="h-12"
              />
              <Button size="lg" className="h-12 px-6 shrink-0" onClick={handleTrack} disabled={trackLoading}>
                <Search className="w-5 h-5 mr-2" />
                Track
              </Button>
            </div>

            {trackLoading && (
              <div className="mt-4 p-4 rounded-xl bg-card border border-border text-center text-muted-foreground text-sm animate-pulse">
                Looking up shipment...
              </div>
            )}

            {trackError && (
              <div className="mt-4 p-4 rounded-xl bg-destructive/5 border border-destructive/20 text-destructive text-sm">
                No shipment found for <strong>{activeTrack}</strong>. Please check the tracking number.
              </div>
            )}

            {trackData && (
              <div className="mt-4 p-5 rounded-xl bg-card border border-border animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="flex items-center justify-between mb-3">
                  <div className="font-mono font-bold">{trackData.trackingNumber}</div>
                  <div className={cn("font-semibold text-sm", STATUS_COLORS[trackData.status] ?? "text-primary")}>
                    {trackData.status}
                  </div>
                </div>
                <div className="text-sm text-muted-foreground mb-3">
                  {trackData.origin} → {trackData.destination}
                </div>
                <div className="text-sm text-muted-foreground mb-4">
                  Est. Delivery: <span className="font-medium text-foreground">{new Date(trackData.estimatedDelivery).toLocaleDateString("en-US", { month: "long", day: "numeric" })}</span>
                </div>
                {trackData.events[0] && (
                  <div className="flex gap-2 text-sm bg-muted/50 rounded-lg p-3">
                    <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                    <div>
                      <div className="font-medium">{trackData.events[0].description}</div>
                      <div className="text-muted-foreground text-xs">{trackData.events[0].location}</div>
                    </div>
                  </div>
                )}
                <Button variant="link" className="mt-2 p-0 h-auto text-primary text-sm" asChild>
                  <Link href="/tracking">View Full Details →</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats && (
              <>
                <StatCard value={stats.shipmentsDelivered} label="Shipments Delivered" delay={0} />
                <StatCard value={stats.countriesServed} label="Countries Served" delay={100} />
                <StatCard value={stats.clientsServed} label="Enterprise Clients" delay={200} />
                <StatCard value={stats.onTimeDeliveryRate} label="On-Time Rate (%)" delay={300} />
              </>
            )}
          </div>
        </div>
      </section>

      {/* Services Overview */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <div className="max-w-2xl">
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">Precision services for every scale.</h2>
              <p className="text-lg text-muted-foreground">From single parcels to complex global supply chains, we provide the infrastructure to keep your business moving.</p>
            </div>
            <Button variant="ghost" className="hidden md:flex" asChild>
              <Link href="/services">View All Services <ArrowRight className="ml-2 w-4 h-4" /></Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {services?.slice(0, 3).map((service) => (
              <Link
                key={service.id}
                href="/services"
                className="group p-8 rounded-2xl bg-card border border-border shadow-sm hover:shadow-xl hover:border-primary/50 transition-all duration-300"
              >
                <div className="w-14 h-14 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                  <Package className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold mb-3">{service.name}</h3>
                <p className="text-muted-foreground mb-6 line-clamp-2">{service.description}</p>
                <div className="flex items-center text-primary font-medium group-hover:gap-2 transition-all">
                  Learn more <ChevronRight className="w-4 h-4 ml-1" />
                </div>
              </Link>
            ))}
          </div>

          <Button variant="outline" className="w-full mt-8 md:hidden" asChild>
            <Link href="/services">View All Services</Link>
          </Button>
        </div>
      </section>

      {/* About Us Section */}
      <section className="py-24 bg-muted/30" id="about">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6">
                About SwiftRoute
              </div>
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-6">
                Built on trust, delivered with precision.
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                Founded in 2008, SwiftRoute Logistics began with a single goal: make world-class freight logistics accessible to businesses of all sizes. What started as a regional carrier in the Bay Area is now a global logistics powerhouse serving over 18,400 enterprise clients across 152 countries.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed mb-10">
                Our proprietary routing technology, 400+ port partnerships, and network of automated warehouses allow us to guarantee industry-leading on-time rates — not as a promise, but as a standard. Every package, every time.
              </p>
              <div className="grid grid-cols-2 gap-6 mb-10">
                {[
                  { icon: Award, title: "Award-Winning", desc: "Top Logistics Provider — 5 consecutive years" },
                  { icon: ShieldCheck, title: "ISO Certified", desc: "ISO 9001:2015 operations across all facilities" },
                  { icon: Users, title: "18,400+ Clients", desc: "From startups to Fortune 500 companies" },
                  { icon: Zap, title: "Founded 2008", desc: "16+ years of logistics excellence" },
                ].map((item) => (
                  <div key={item.title} className="flex gap-3">
                    <item.icon className="w-6 h-6 text-primary shrink-0 mt-0.5" />
                    <div>
                      <div className="font-bold text-sm">{item.title}</div>
                      <div className="text-muted-foreground text-sm">{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
              <Button size="lg" asChild>
                <Link href="/about">Our Full Story <ArrowRight className="ml-2 w-5 h-5" /></Link>
              </Button>
            </div>

            <div className="relative">
              <div className="rounded-2xl overflow-hidden shadow-2xl aspect-[4/3]">
                <img src={warehouseImg} alt="SwiftRoute automated warehouse" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6">
                  <div className="bg-black/40 backdrop-blur-md border border-white/10 p-5 rounded-xl">
                    <div className="text-sm font-medium text-primary uppercase tracking-wider mb-1">Established 2008 • San Francisco</div>
                    <div className="text-white font-bold text-lg">SwiftRoute Global Headquarters</div>
                    <div className="text-white/70 text-sm mt-1">100 Logistics Way, Suite 400, SF, CA 94105</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-24 bg-foreground text-white overflow-hidden relative">
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <img src={networkImg} alt="" className="w-full h-full object-cover object-center" />
        </div>
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-6">Built for reliability. Designed for speed.</h2>
            <p className="text-lg text-slate-300 leading-relaxed">
              We don't just move freight; we optimize your entire supply chain. Our proprietary routing algorithms and global network ensure your cargo takes the most efficient path possible.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Timer, title: "Real-Time Optimization", desc: "Routes are dynamically adjusted based on weather, traffic, and port congestion to guarantee delivery times." },
              { icon: ShieldCheck, title: "Enterprise Security", desc: "Military-grade tracking and security protocols ensure high-value shipments arrive intact and uncompromised." },
              { icon: Globe, title: "Global Infrastructure", desc: "Direct access to 400+ ports and 150+ automated warehouses across 120 countries." },
            ].map((item) => (
              <div key={item.title} className="p-8 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all">
                <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center mb-6">
                  <item.icon className="w-6 h-6 text-primary" />
                </div>
                <h4 className="text-xl font-bold mb-3">{item.title}</h4>
                <p className="text-slate-400 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 bg-primary relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full opacity-10">
          <svg viewBox="0 0 100 100" className="w-full h-full text-white fill-current">
            <path d="M0,100 L100,0 L100,100 Z" />
          </svg>
        </div>
        <div className="container mx-auto px-4 md:px-6 relative z-10 text-center">
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight">Ready to move faster?</h2>
          <p className="text-xl text-primary-foreground/80 mb-10 max-w-2xl mx-auto">
            Get a customized quote for your enterprise shipping needs in minutes.
          </p>
          <Button size="lg" variant="secondary" className="h-14 px-10 text-lg font-bold" asChild>
            <Link href="/quote">Request Your Quote</Link>
          </Button>
        </div>
      </section>
    </Layout>
  );
}
