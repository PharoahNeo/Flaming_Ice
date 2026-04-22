import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import {
  LogOut,
  Package,
  MessageSquare,
  FileText,
  BarChart3,
  Plus,
  Trash2,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { adminFetch, clearAdminAuth, getAdminAuth } from "@/lib/admin-api";
import { cn } from "@/lib/utils";

type Tab = "overview" | "shipments" | "quotes" | "chats" | "visitors";

type Quote = {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  origin: string;
  destination: string;
  weight: string | null;
  serviceType: string;
  notes: string | null;
  status: string;
  createdAt: string;
};

type Conversation = {
  id: number;
  title: string;
  createdAt: string;
  messageCount: number;
};

type Message = {
  id: number;
  conversationId: number;
  role: string;
  content: string;
  createdAt: string;
};

type ShipmentEvent = {
  timestamp: string;
  location: string;
  description: string;
  status: string;
};

type Shipment = {
  id: number;
  trackingNumber: string;
  status: string;
  origin: string;
  destination: string;
  estimatedDelivery: string;
  events: ShipmentEvent[];
  createdAt: string;
  updatedAt: string;
};

type Analytics = {
  totals: {
    pageViews: number;
    uniqueVisitors: number;
    pageViews30d: number;
    uniqueVisitors30d: number;
    quotes: number;
    conversations: number;
    shipments: number;
  };
  topPages: { path: string; views: number }[];
  topReferrers: { referrer: string | null; views: number }[];
  daily: { day: string; views: number; uniqueVisitors: number }[];
  recent: {
    id: number;
    path: string;
    referrer: string | null;
    visitorId: string;
    createdAt: string;
  }[];
};

const TABS: { key: Tab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { key: "overview", label: "Overview", icon: BarChart3 },
  { key: "shipments", label: "Shipments", icon: Package },
  { key: "quotes", label: "Quotes", icon: FileText },
  { key: "chats", label: "Chats", icon: MessageSquare },
  { key: "visitors", label: "Visitors", icon: BarChart3 },
];

export default function Admin() {
  const [, navigate] = useLocation();
  const [tab, setTab] = useState<Tab>("overview");

  useEffect(() => {
    if (!getAdminAuth()) {
      navigate("/admin/login");
      return;
    }
    adminFetch("/me").catch(() => navigate("/admin/login"));
  }, [navigate]);

  function logout() {
    clearAdminAuth();
    navigate("/admin/login");
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card sticky top-0 z-10">
        <div className="container mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
              <Package className="w-4 h-4 text-primary" />
            </div>
            <div className="font-bold">SwiftRoute Admin</div>
          </div>
          <Button variant="outline" size="sm" onClick={logout}>
            <LogOut className="w-4 h-4 mr-2" /> Logout
          </Button>
        </div>
        <div className="container mx-auto px-4 md:px-6 flex gap-1 overflow-x-auto">
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={cn(
                "px-4 py-3 text-sm font-medium border-b-2 -mb-px flex items-center gap-2 whitespace-nowrap",
                tab === t.key
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground",
              )}
            >
              <t.icon className="w-4 h-4" />
              {t.label}
            </button>
          ))}
        </div>
      </header>

      <main className="container mx-auto px-4 md:px-6 py-8">
        {tab === "overview" && <OverviewTab />}
        {tab === "shipments" && <ShipmentsTab />}
        {tab === "quotes" && <QuotesTab />}
        {tab === "chats" && <ChatsTab />}
        {tab === "visitors" && <VisitorsTab />}
      </main>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="bg-card border border-border rounded-xl p-5">
      <div className="text-xs uppercase tracking-wide text-muted-foreground">{label}</div>
      <div className="text-3xl font-bold mt-2">{value}</div>
    </div>
  );
}

function OverviewTab() {
  const [data, setData] = useState<Analytics | null>(null);
  const [err, setErr] = useState<string | null>(null);

  async function load() {
    try {
      setData(await adminFetch<Analytics>("/analytics"));
    } catch (e) {
      setErr((e as Error).message);
    }
  }
  useEffect(() => {
    load();
  }, []);

  if (err) return <div className="text-red-500">{err}</div>;
  if (!data) return <div className="text-muted-foreground">Loading...</div>;

  const max = Math.max(1, ...data.daily.map((d) => d.views));

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Page Views (all time)" value={data.totals.pageViews} />
        <StatCard label="Unique Visitors" value={data.totals.uniqueVisitors} />
        <StatCard label="Views (30d)" value={data.totals.pageViews30d} />
        <StatCard label="Visitors (30d)" value={data.totals.uniqueVisitors30d} />
        <StatCard label="Quotes" value={data.totals.quotes} />
        <StatCard label="Chat Conversations" value={data.totals.conversations} />
        <StatCard label="Shipments" value={data.totals.shipments} />
      </div>

      <div className="bg-card border border-border rounded-xl p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-bold">Daily Traffic (last 30 days)</h2>
          <Button size="sm" variant="ghost" onClick={load}>
            <RefreshCw className="w-4 h-4" />
          </Button>
        </div>
        {data.daily.length === 0 ? (
          <div className="text-muted-foreground text-sm">No traffic recorded yet.</div>
        ) : (
          <div className="flex items-end gap-1 h-40">
            {data.daily.map((d) => (
              <div
                key={d.day}
                className="flex-1 bg-primary/70 hover:bg-primary rounded-t transition-colors relative group"
                style={{ height: `${(d.views / max) * 100}%` }}
                title={`${d.day}: ${d.views} views, ${d.uniqueVisitors} visitors`}
              >
                <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-foreground text-background text-xs px-2 py-1 rounded whitespace-nowrap">
                  {d.day}: {d.views}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-card border border-border rounded-xl p-6">
          <h2 className="font-bold mb-4">Top Pages</h2>
          {data.topPages.length === 0 ? (
            <div className="text-muted-foreground text-sm">No data yet.</div>
          ) : (
            <ul className="space-y-2">
              {data.topPages.map((p) => (
                <li key={p.path} className="flex justify-between text-sm">
                  <span className="font-mono">{p.path}</span>
                  <span className="font-bold">{p.views}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="bg-card border border-border rounded-xl p-6">
          <h2 className="font-bold mb-4">Top Referrers</h2>
          {data.topReferrers.length === 0 ? (
            <div className="text-muted-foreground text-sm">No referrers.</div>
          ) : (
            <ul className="space-y-2">
              {data.topReferrers.map((r, i) => (
                <li key={i} className="flex justify-between text-sm gap-3">
                  <span className="truncate">{r.referrer || "(direct)"}</span>
                  <span className="font-bold">{r.views}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

function ShipmentsTab() {
  const [list, setList] = useState<Shipment[]>([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Shipment | null>(null);
  const [err, setErr] = useState<string | null>(null);

  async function load() {
    setList(await adminFetch<Shipment[]>("/shipments"));
  }
  useEffect(() => {
    load().catch((e) => setErr((e as Error).message));
  }, []);

  async function remove(id: number) {
    if (!confirm("Delete this shipment?")) return;
    await adminFetch(`/shipments/${id}`, { method: "DELETE" });
    load();
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Shipments</h1>
        <Button
          onClick={() => {
            setEditing(null);
            setOpen(true);
          }}
        >
          <Plus className="w-4 h-4 mr-2" /> New Shipment
        </Button>
      </div>
      {err && <div className="text-red-500 text-sm">{err}</div>}
      <div className="bg-card border border-border rounded-xl overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-left">
            <tr>
              <th className="p-3">Tracking #</th>
              <th className="p-3">Status</th>
              <th className="p-3">Origin → Destination</th>
              <th className="p-3">ETA</th>
              <th className="p-3">Events</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {list.map((s) => (
              <tr key={s.id} className="border-t border-border">
                <td className="p-3 font-mono">{s.trackingNumber}</td>
                <td className="p-3">{s.status}</td>
                <td className="p-3">
                  {s.origin} → {s.destination}
                </td>
                <td className="p-3">{s.estimatedDelivery}</td>
                <td className="p-3">{s.events?.length ?? 0}</td>
                <td className="p-3 text-right space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setEditing(s);
                      setOpen(true);
                    }}
                  >
                    Edit
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => remove(s.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </td>
              </tr>
            ))}
            {list.length === 0 && (
              <tr>
                <td colSpan={6} className="p-6 text-center text-muted-foreground">
                  No shipments yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <ShipmentDialog
        open={open}
        onOpenChange={setOpen}
        shipment={editing}
        onSaved={() => {
          setOpen(false);
          load();
        }}
      />
    </div>
  );
}

function ShipmentDialog({
  open,
  onOpenChange,
  shipment,
  onSaved,
}: {
  open: boolean;
  onOpenChange: (b: boolean) => void;
  shipment: Shipment | null;
  onSaved: () => void;
}) {
  const [trackingNumber, setTrackingNumber] = useState("");
  const [status, setStatus] = useState("Picked Up");
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [estimatedDelivery, setEstimatedDelivery] = useState("");
  const [eventsJson, setEventsJson] = useState("[]");
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setTrackingNumber(shipment?.trackingNumber ?? "");
      setStatus(shipment?.status ?? "Picked Up");
      setOrigin(shipment?.origin ?? "");
      setDestination(shipment?.destination ?? "");
      setEstimatedDelivery(shipment?.estimatedDelivery ?? "");
      setEventsJson(JSON.stringify(shipment?.events ?? [], null, 2));
      setErr(null);
    }
  }, [open, shipment]);

  async function save() {
    setErr(null);
    let events: ShipmentEvent[] = [];
    try {
      events = JSON.parse(eventsJson);
      if (!Array.isArray(events)) throw new Error("Events must be an array");
    } catch (e) {
      setErr("Events JSON is invalid: " + (e as Error).message);
      return;
    }
    try {
      const payload = { trackingNumber, status, origin, destination, estimatedDelivery, events };
      if (shipment) {
        await adminFetch(`/shipments/${shipment.id}`, {
          method: "PATCH",
          body: JSON.stringify(payload),
        });
      } else {
        await adminFetch("/shipments", {
          method: "POST",
          body: JSON.stringify(payload),
        });
      }
      onSaved();
    } catch (e) {
      setErr((e as Error).message);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{shipment ? "Edit Shipment" : "New Shipment"}</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Tracking Number</Label>
            <Input
              value={trackingNumber}
              onChange={(e) => setTrackingNumber(e.target.value)}
              placeholder="SWR-2026-100"
              disabled={!!shipment}
            />
          </div>
          <div>
            <Label>Status</Label>
            <Input value={status} onChange={(e) => setStatus(e.target.value)} />
          </div>
          <div>
            <Label>Origin</Label>
            <Input value={origin} onChange={(e) => setOrigin(e.target.value)} />
          </div>
          <div>
            <Label>Destination</Label>
            <Input value={destination} onChange={(e) => setDestination(e.target.value)} />
          </div>
          <div className="col-span-2">
            <Label>Estimated Delivery (YYYY-MM-DD)</Label>
            <Input
              value={estimatedDelivery}
              onChange={(e) => setEstimatedDelivery(e.target.value)}
              placeholder="2026-05-01"
            />
          </div>
          <div className="col-span-2">
            <Label>Events (JSON array)</Label>
            <Textarea
              rows={8}
              value={eventsJson}
              onChange={(e) => setEventsJson(e.target.value)}
              className="font-mono text-xs"
            />
            <div className="text-xs text-muted-foreground mt-1">
              Each event: {`{ "timestamp": "ISO", "location": "...", "description": "...", "status": "..." }`}
            </div>
          </div>
        </div>
        {err && <div className="text-red-500 text-sm">{err}</div>}
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={save}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function QuotesTab() {
  const [list, setList] = useState<Quote[]>([]);
  const [err, setErr] = useState<string | null>(null);

  async function load() {
    try {
      setList(await adminFetch<Quote[]>("/quotes"));
    } catch (e) {
      setErr((e as Error).message);
    }
  }
  useEffect(() => {
    load();
  }, []);

  async function setStatus(id: number, status: string) {
    await adminFetch(`/quotes/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    });
    load();
  }

  async function remove(id: number) {
    if (!confirm("Delete this quote?")) return;
    await adminFetch(`/quotes/${id}`, { method: "DELETE" });
    load();
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Quote Requests</h1>
      {err && <div className="text-red-500 text-sm">{err}</div>}
      <div className="space-y-3">
        {list.map((q) => (
          <div key={q.id} className="bg-card border border-border rounded-xl p-5">
            <div className="flex justify-between items-start gap-4 flex-wrap">
              <div>
                <div className="font-bold">{q.name}</div>
                <div className="text-sm text-muted-foreground">
                  {q.email}
                  {q.phone ? ` · ${q.phone}` : ""}
                </div>
              </div>
              <div className="text-xs text-muted-foreground">
                {new Date(q.createdAt).toLocaleString()}
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4 text-sm">
              <div>
                <div className="text-xs text-muted-foreground">Origin</div>
                <div>{q.origin}</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Destination</div>
                <div>{q.destination}</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Service</div>
                <div>{q.serviceType}</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Weight</div>
                <div>{q.weight ?? "—"}</div>
              </div>
            </div>
            {q.notes && (
              <div className="mt-3 text-sm bg-muted/40 rounded p-3">{q.notes}</div>
            )}
            <div className="flex items-center gap-2 mt-4">
              <select
                value={q.status}
                onChange={(e) => setStatus(q.id, e.target.value)}
                className="text-sm border border-border rounded px-2 py-1 bg-background"
              >
                <option value="pending">pending</option>
                <option value="contacted">contacted</option>
                <option value="quoted">quoted</option>
                <option value="closed">closed</option>
              </select>
              <Button size="sm" variant="ghost" onClick={() => remove(q.id)}>
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ))}
        {list.length === 0 && (
          <div className="text-center text-muted-foreground py-12">No quotes yet.</div>
        )}
      </div>
    </div>
  );
}

function ChatsTab() {
  const [list, setList] = useState<Conversation[]>([]);
  const [active, setActive] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);

  async function load() {
    setList(await adminFetch<Conversation[]>("/conversations"));
  }
  useEffect(() => {
    load();
  }, []);

  async function open(c: Conversation) {
    setActive(c);
    setMessages(await adminFetch<Message[]>(`/conversations/${c.id}/messages`));
  }

  async function remove(id: number) {
    if (!confirm("Delete this conversation?")) return;
    await adminFetch(`/conversations/${id}`, { method: "DELETE" });
    if (active?.id === id) setActive(null);
    load();
  }

  return (
    <div className="grid md:grid-cols-[320px_1fr] gap-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold mb-3">Chats</h1>
        {list.map((c) => (
          <div
            key={c.id}
            className={cn(
              "bg-card border rounded-lg p-3 cursor-pointer",
              active?.id === c.id ? "border-primary" : "border-border",
            )}
            onClick={() => open(c)}
          >
            <div className="font-medium text-sm truncate">{c.title || `Conversation #${c.id}`}</div>
            <div className="text-xs text-muted-foreground flex justify-between mt-1">
              <span>{c.messageCount} msgs</span>
              <span>{new Date(c.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
        ))}
        {list.length === 0 && (
          <div className="text-sm text-muted-foreground">No conversations yet.</div>
        )}
      </div>
      <div className="bg-card border border-border rounded-xl p-6 min-h-[400px]">
        {!active ? (
          <div className="text-muted-foreground text-center py-20">
            Select a conversation to view messages.
          </div>
        ) : (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-bold">{active.title || `Conversation #${active.id}`}</h2>
              <Button size="sm" variant="ghost" onClick={() => remove(active.id)}>
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
            <div className="space-y-4">
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={cn(
                    "rounded-lg p-3 text-sm whitespace-pre-wrap",
                    m.role === "user"
                      ? "bg-primary/10 ml-8"
                      : "bg-muted/50 mr-8",
                  )}
                >
                  <div className="text-xs uppercase tracking-wide text-muted-foreground mb-1">
                    {m.role} · {new Date(m.createdAt).toLocaleString()}
                  </div>
                  {m.content}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function VisitorsTab() {
  const [data, setData] = useState<Analytics | null>(null);
  useEffect(() => {
    adminFetch<Analytics>("/analytics").then(setData);
  }, []);
  if (!data) return <div className="text-muted-foreground">Loading...</div>;
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Recent Visitors</h1>
      <div className="bg-card border border-border rounded-xl overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-left">
            <tr>
              <th className="p-3">Time</th>
              <th className="p-3">Path</th>
              <th className="p-3">Referrer</th>
              <th className="p-3">Visitor ID</th>
            </tr>
          </thead>
          <tbody>
            {data.recent.map((v) => (
              <tr key={v.id} className="border-t border-border">
                <td className="p-3 whitespace-nowrap">{new Date(v.createdAt).toLocaleString()}</td>
                <td className="p-3 font-mono">{v.path}</td>
                <td className="p-3 truncate max-w-xs">{v.referrer || "(direct)"}</td>
                <td className="p-3 font-mono text-xs text-muted-foreground">
                  {v.visitorId.slice(0, 8)}…
                </td>
              </tr>
            ))}
            {data.recent.length === 0 && (
              <tr>
                <td colSpan={4} className="p-6 text-center text-muted-foreground">
                  No visitors recorded yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
