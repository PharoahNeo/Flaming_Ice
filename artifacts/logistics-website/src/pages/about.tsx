import { Layout } from "@/components/layout";
import { Users, Award, Globe, Zap, ShieldCheck, Clock, MapPin, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

const TEAM = [
  {
    name: "James Whitfield",
    role: "Chief Executive Officer",
    bio: "20+ years in global logistics. Previously VP of Operations at FedEx and DHL.",
  },
  {
    name: "Aisha Okonkwo",
    role: "Chief Operations Officer",
    bio: "Supply chain transformation expert with expertise across 60+ markets worldwide.",
  },
  {
    name: "Marcus Chen",
    role: "Chief Technology Officer",
    bio: "Built proprietary routing algorithms that power SwiftRoute's 98.7% on-time rate.",
  },
  {
    name: "Sofia Reyes",
    role: "VP of Global Sales",
    bio: "Grew enterprise client base from 500 to 18,400+ over 12 years.",
  },
];

const MILESTONES = [
  { year: "2008", title: "Founded in San Francisco", desc: "SwiftRoute launched with a mission to modernize freight logistics for small businesses." },
  { year: "2012", title: "Expanded to 50 Countries", desc: "Built our first international air freight network, partnering with major carriers across 4 continents." },
  { year: "2016", title: "1 Million Shipments Delivered", desc: "Reached our first major milestone with an industry-leading 97% on-time delivery record." },
  { year: "2019", title: "Automated Warehouse Network", desc: "Opened 50+ automated distribution centers powered by robotics and real-time routing software." },
  { year: "2022", title: "Global Expansion to 150+ Countries", desc: "Extended our international network with direct partnerships in Southeast Asia, Africa, and South America." },
  { year: "2024", title: "2.8M+ Shipments Annually", desc: "Now serving 18,400+ enterprise clients with a 98.7% on-time delivery rate — our best ever." },
];

export default function About() {
  return (
    <Layout>
      {/* Hero */}
      <section className="pt-36 pb-20 bg-foreground text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_top_right,_#0ea5e9_0%,_transparent_60%)]" />
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 border border-primary/30 text-primary text-sm font-medium mb-6">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              Our Story
            </div>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
              Moving the world's cargo since <span className="text-primary">2008.</span>
            </h1>
            <p className="text-xl text-slate-300 leading-relaxed">
              SwiftRoute Logistics was founded on a simple belief: that reliable, transparent freight shouldn't be a luxury reserved for the biggest companies in the world. Today, we're proud to serve over 18,400 businesses across 152 countries.
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Values */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-6">Our Mission</h2>
              <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                We exist to eliminate the friction in global freight. Every lost package, every missed deadline, every unexplained delay — these aren't just business problems; they're failures of trust between a shipper and their customer.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed mb-10">
                SwiftRoute was built to fix that. We combine cutting-edge logistics technology with a human-first approach, ensuring that every shipment — from a single parcel to a complex multi-leg freight operation — arrives on time, every time.
              </p>
              <Button size="lg" asChild>
                <Link href="/quote">Get a Quote <ChevronRight className="ml-2 w-4 h-4" /></Link>
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-6">
              {[
                { icon: Globe, title: "Global Reach", desc: "152+ countries and territories served through our partner network." },
                { icon: Award, title: "Award-Winning", desc: "Named Top Logistics Provider by Freight Week for 5 consecutive years." },
                { icon: ShieldCheck, title: "Insured & Certified", desc: "Full cargo insurance and ISO 9001:2015 certified operations." },
                { icon: Clock, title: "24/7 Support", desc: "Round-the-clock operations center staffed by logistics experts." },
              ].map((item) => (
                <div key={item.title} className="p-6 rounded-2xl bg-card border border-border">
                  <item.icon className="w-8 h-8 text-primary mb-4" />
                  <h4 className="font-bold mb-2">{item.title}</h4>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Company Stats */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { value: "2008", label: "Year Founded" },
              { value: "18,400+", label: "Enterprise Clients" },
              { value: "152", label: "Countries Served" },
              { value: "98.7%", label: "On-Time Rate" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-4xl md:text-5xl font-bold font-mono text-primary mb-2">{stat.value}</div>
                <div className="text-muted-foreground text-sm uppercase tracking-wide font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">Our Journey</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">From a startup with a big idea to a global logistics leader.</p>
          </div>
          <div className="relative">
            <div className="absolute left-1/2 top-0 bottom-0 w-px bg-border hidden md:block" />
            <div className="space-y-12">
              {MILESTONES.map((m, i) => (
                <div key={m.year} className={`flex flex-col md:flex-row gap-6 items-start md:items-center ${i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"}`}>
                  <div className={`flex-1 ${i % 2 === 0 ? "md:text-right" : "md:text-left"}`}>
                    <div className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary font-mono font-bold text-sm mb-2">{m.year}</div>
                    <h3 className="text-xl font-bold mb-2">{m.title}</h3>
                    <p className="text-muted-foreground">{m.desc}</p>
                  </div>
                  <div className="hidden md:flex w-10 h-10 rounded-full bg-primary/10 border-4 border-background text-primary items-center justify-center shrink-0 z-10">
                    <Zap className="w-4 h-4" />
                  </div>
                  <div className="flex-1 hidden md:block" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">Leadership Team</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">Seasoned experts with decades of combined experience in global logistics.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {TEAM.map((person) => (
              <div key={person.name} className="bg-card border border-border rounded-2xl p-6 text-center">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-bold text-lg mb-1">{person.name}</h3>
                <div className="text-primary text-sm font-medium mb-3">{person.role}</div>
                <p className="text-muted-foreground text-sm leading-relaxed">{person.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HQ Info */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4 md:px-6">
          <div className="bg-foreground text-white rounded-3xl p-12 text-center">
            <MapPin className="w-12 h-12 text-primary mx-auto mb-6" />
            <h2 className="text-3xl font-bold mb-4">Global Headquarters</h2>
            <p className="text-slate-300 text-lg mb-2">100 Logistics Way, Suite 400</p>
            <p className="text-slate-300 text-lg mb-8">San Francisco, CA 94105, United States</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link href="/contact">Contact Us</Link>
              </Button>
              <Button size="lg" variant="outline" className="border-white/20 text-white hover:bg-white/10 hover:text-white" asChild>
                <Link href="/quote">Request a Quote</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
