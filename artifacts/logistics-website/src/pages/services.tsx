import { Layout } from "@/components/layout";
import { useListServices } from "@workspace/api-client-react";
import { Package, Zap, Plane, Globe, CheckCircle2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Skeleton } from "@/components/ui/skeleton";

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  truck: Package,
  zap: Zap,
  plane: Plane,
  globe: Globe,
};

export default function Services() {
  const { data: services, isLoading } = useListServices();

  return (
    <Layout>
      {/* Hero */}
      <section className="pt-36 pb-20 bg-foreground text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_top_left,_#0ea5e9_0%,_transparent_60%)]" />
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 border border-primary/30 text-primary text-sm font-medium mb-6">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              What We Offer
            </div>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
              Every shipment has the <span className="text-primary">right service.</span>
            </h1>
            <p className="text-xl text-slate-300 leading-relaxed">
              From next-day domestic delivery to complex international freight operations, we offer solutions built for every stage of your supply chain.
            </p>
          </div>
        </div>
      </section>

      {/* Services List */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4 md:px-6">
          {isLoading ? (
            <div className="space-y-8">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-64 w-full rounded-2xl" />
              ))}
            </div>
          ) : (
            <div className="space-y-8">
              {services?.map((service, i) => {
                const Icon = ICON_MAP[service.icon] ?? Package;
                return (
                  <div
                    key={service.id}
                    className="group grid grid-cols-1 lg:grid-cols-3 gap-8 p-8 rounded-2xl bg-card border border-border hover:border-primary/50 hover:shadow-xl transition-all duration-300"
                  >
                    <div className="lg:col-span-2">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-14 h-14 rounded-xl bg-primary/10 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                          <Icon className="w-7 h-7" />
                        </div>
                        <div>
                          <h2 className="text-2xl font-bold">{service.name}</h2>
                          <div className="text-primary font-medium text-sm">{service.estimatedDays}</div>
                        </div>
                      </div>
                      <p className="text-muted-foreground text-lg mb-6 leading-relaxed">{service.description}</p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {service.features.map((feature) => (
                          <div key={feature} className="flex items-center gap-2 text-sm">
                            <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                            <span>{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="flex flex-col justify-between border-t lg:border-t-0 lg:border-l border-border pt-6 lg:pt-0 lg:pl-8">
                      <div>
                        <div className="text-sm text-muted-foreground mb-1">Starting from</div>
                        <div className="text-4xl font-bold font-mono text-primary mb-1">
                          ${service.startingPrice.toFixed(2)}
                        </div>
                        <div className="text-sm text-muted-foreground">per shipment</div>
                      </div>
                      <Button className="w-full mt-6" asChild>
                        <Link href="/quote">Get a Quote <ArrowRight className="ml-2 w-4 h-4" /></Link>
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Not sure which service is right for you?</h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
            Our logistics experts are available 24/7 to help you choose the best solution for your shipping needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild><Link href="/quote">Request a Quote</Link></Button>
            <Button size="lg" variant="outline" asChild><Link href="/contact">Talk to an Expert</Link></Button>
          </div>
        </div>
      </section>
    </Layout>
  );
}
