import { Layout } from "@/components/layout";
import { useGetStats, useListServices } from "@workspace/api-client-react";
import { ArrowRight, Package, ShieldCheck, Timer, Globe, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import heroImg from "@/assets/images/hero.png";
import warehouseImg from "@/assets/images/warehouse.png";
import networkImg from "@/assets/images/network.png";

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

export default function Home() {
  const { data: stats } = useGetStats();
  const { data: services } = useListServices();

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

      {/* Stats Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative -mt-32 z-30">
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
            {services?.slice(0, 3).map((service, i) => (
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

      {/* Why Choose Us Split Section */}
      <section className="py-24 bg-foreground text-white overflow-hidden relative">
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <img src={networkImg} alt="" className="w-full h-full object-cover object-center" />
        </div>
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-6">Built for reliability. Designed for speed.</h2>
              <p className="text-lg text-slate-300 mb-10 leading-relaxed">
                We don't just move freight; we optimize your entire supply chain. Our proprietary routing algorithms and global network ensure your cargo takes the most efficient path possible.
              </p>
              
              <div className="space-y-8">
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                    <Timer className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold mb-2">Real-Time Optimization</h4>
                    <p className="text-slate-400">Routes are dynamically adjusted based on weather, traffic, and port congestion to guarantee delivery times.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold mb-2">Enterprise Security</h4>
                    <p className="text-slate-400">Military-grade tracking and security protocols ensure high-value shipments arrive intact and uncompromised.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                    <Globe className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold mb-2">Global Infrastructure</h4>
                    <p className="text-slate-400">Direct access to 400+ ports and 150+ automated warehouses across 120 countries.</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="relative rounded-2xl overflow-hidden shadow-2xl aspect-square lg:aspect-auto lg:h-[600px]">
              <img src={warehouseImg} alt="Automated Warehouse" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-8 left-8 right-8">
                <div className="bg-black/40 backdrop-blur-md border border-white/10 p-6 rounded-xl">
                  <div className="text-sm font-medium text-primary uppercase tracking-wider mb-1">Facility 04 • Hamburg</div>
                  <div className="text-white font-mono text-xl">99.9% Automation Uptime</div>
                </div>
              </div>
            </div>
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
