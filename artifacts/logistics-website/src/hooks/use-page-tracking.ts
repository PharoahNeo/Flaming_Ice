import { useEffect } from "react";
import { useLocation } from "wouter";

const VISITOR_KEY = "swr_visitor_id";

function getVisitorId(): string {
  let id = localStorage.getItem(VISITOR_KEY);
  if (!id) {
    id =
      (crypto.randomUUID && crypto.randomUUID()) ||
      `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    localStorage.setItem(VISITOR_KEY, id);
  }
  return id;
}

export function usePageTracking() {
  const [location] = useLocation();

  useEffect(() => {
    if (location.startsWith("/admin")) return;
    const visitorId = getVisitorId();
    fetch(`${import.meta.env.BASE_URL}api/page-views`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        path: location,
        referrer: document.referrer || null,
        visitorId,
      }),
      keepalive: true,
    }).catch(() => {
      // best-effort tracking; ignore errors
    });
  }, [location]);
}
