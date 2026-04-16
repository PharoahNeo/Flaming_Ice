import { Layout } from "@/components/layout";
import { useState } from "react";
import { useTrackShipment, getTrackShipmentQueryKey } from "@workspace/api-client-react";
import { Search, Package, MapPin, Clock, CheckCircle2, Truck, Plane, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const STATUS_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  "Delivered": CheckCircle2,
  "In Transit": Truck,
  "Out for Delivery": Truck,
  "Picked Up": Package,
};

const STATUS_COLORS: Record<string, string> = {
  "Delivered": "text-green-500 bg-green-500/10",
  "In Transit": "text-blue-500 bg-blue-500/10",
  "Out for Delivery": "text-orange-500 bg-orange-500/10",
  "Picked Up": "text-primary bg-primary/10",
};

export default function Tracking() {
  const [trackingInput, setTrackingInput] = useState("");
  const [activeTracking, setActiveTracking] = useState("");

  const { data, isLoading, isError } = useTrackShipment(
    activeTracking,
    { query: { enabled: !!activeTracking, queryKey: getTrackShipmentQueryKey(activeTracking) } }
  );

  function handleSearch() {
    const trimmed = trackingInput.trim().toUpperCase();
    if (trimmed) setActiveTracking(trimmed);
  }

  return (
    <Layout>
      {/* Hero */}
      <section className="pt-36 pb-20 bg-foreground text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_top_right,_#0ea5e9_0%,_transparent_60%)]" />
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 border border-primary/30 text-primary text-sm font-medium mb-6">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              Real-Time Tracking
            </div>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
              Where is your <span className="text-primary">shipment?</span>
            </h1>
            <p className="text-xl text-slate-300 leading-relaxed mb-10">
              Enter your SwiftRoute tracking number below to see real-time status, location updates, and estimated delivery.
            </p>

            {/* Tracking Input */}
            <div className="flex gap-3 max-w-xl">
              <Input
                value={trackingInput}
                onChange={(e) => setTrackingInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                placeholder="e.g. SWR-2024-001"
                className="h-12 bg-white/10 border-white/20 text-white placeholder:text-white/50 focus-visible:ring-primary"
              />
              <Button size="lg" className="h-12 px-6 shrink-0" onClick={handleSearch} disabled={isLoading}>
                <Search className="w-5 h-5 mr-2" />
                Track
              </Button>
            </div>
            <p className="text-white/40 text-sm mt-3">Try: SWR-2024-001 or SWR-2024-002</p>
          </div>
        </div>
      </section>

      {/* Results */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 md:px-6 max-w-3xl">
          {isLoading && (
            <div className="text-center py-20">
              <div className="w-16 h-16 rounded-full border-4 border-primary/20 border-t-primary animate-spin mx-auto mb-4" />
              <p className="text-muted-foreground">Fetching shipment details...</p>
            </div>
          )}

          {isError && (
            <div className="text-center py-20">
              <AlertCircle className="w-16 h-16 text-destructive mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">Shipment Not Found</h2>
              <p className="text-muted-foreground">We couldn't find a shipment with tracking number <strong>{activeTracking}</strong>. Please check the number and try again.</p>
            </div>
          )}

          {data && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              {/* Status Card */}
              <div className="bg-card border border-border rounded-2xl p-8 mb-8">
                <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Tracking Number</div>
                    <div className="font-mono font-bold text-xl">{data.trackingNumber}</div>
                  </div>
                  <div className={cn("px-4 py-2 rounded-full font-medium text-sm flex items-center gap-2 self-start", STATUS_COLORS[data.status] ?? "text-primary bg-primary/10")}>
                    {(() => { const Icon = STATUS_ICONS[data.status] ?? Package; return <Icon className="w-4 h-4" />; })()}
                    {data.status}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  <div className="flex gap-3">
                    <MapPin className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <div>
                      <div className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Origin</div>
                      <div className="font-medium">{data.origin}</div>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <MapPin className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <div>
                      <div className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Destination</div>
                      <div className="font-medium">{data.destination}</div>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <Clock className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <div>
                      <div className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Est. Delivery</div>
                      <div className="font-medium">{new Date(data.estimatedDelivery).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Event Timeline */}
              <h3 className="font-bold text-lg mb-6">Shipment History</h3>
              <div className="space-y-0">
                {data.events.map((event, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className={cn("w-3 h-3 rounded-full mt-1 shrink-0", i === 0 ? "bg-primary" : "bg-border")} />
                      {i < data.events.length - 1 && <div className="w-px flex-1 bg-border my-1" />}
                    </div>
                    <div className={cn("pb-8", i === data.events.length - 1 && "pb-0")}>
                      <div className="text-xs text-muted-foreground mb-1">
                        {new Date(event.timestamp).toLocaleString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })}
                      </div>
                      <div className="font-medium mb-0.5">{event.description}</div>
                      <div className="text-sm text-muted-foreground flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {event.location}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {!activeTracking && !isLoading && (
            <div className="text-center py-20 text-muted-foreground">
              <Package className="w-16 h-16 mx-auto mb-4 opacity-30" />
              <p className="text-lg">Enter a tracking number above to get started.</p>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
}
