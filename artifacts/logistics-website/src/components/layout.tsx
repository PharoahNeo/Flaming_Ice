import { Link, useLocation } from "wouter";
import { Package, Truck, Search, PhoneCall, Menu, X, ArrowRight, MapPin, BarChart3, Clock, Globe2 } from "lucide-react";
import { Button } from "./ui/button";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/tracking", label: "Tracking" },
  { href: "/contact", label: "Contact" },
];

export function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-background selection:bg-primary/30">
      {/* Header */}
      <header
        className={cn(
          "fixed top-0 w-full z-50 transition-all duration-300 border-b border-transparent",
          isScrolled
            ? "bg-background/80 backdrop-blur-xl border-border shadow-sm"
            : "bg-transparent text-white"
        )}
      >
        <div className="container mx-auto px-4 md:px-6 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-primary flex items-center justify-center rounded-[4px] rotate-3 group-hover:rotate-6 transition-transform duration-300">
              <Truck className="w-6 h-6 text-primary-foreground -rotate-3 group-hover:-rotate-6 transition-transform duration-300" />
            </div>
            <span className={cn("text-xl font-bold font-sans tracking-tight", isScrolled ? "text-foreground" : "text-white")}>
              SwiftRoute
              <span className="text-primary">.</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary",
                  location === link.href
                    ? isScrolled ? "text-primary" : "text-primary"
                    : isScrolled ? "text-foreground/80" : "text-white/80"
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-4">
            <Button variant={isScrolled ? "ghost" : "secondary"} className={cn("font-medium", !isScrolled && "bg-white/10 hover:bg-white/20 text-white border-none")} asChild>
              <Link href="/tracking">
                <Search className="w-4 h-4 mr-2" />
                Track
              </Link>
            </Button>
            <Button asChild className="font-semibold shadow-lg shadow-primary/20">
              <Link href="/quote">Get a Quote</Link>
            </Button>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className={cn("md:hidden p-2 -mr-2", isScrolled ? "text-foreground" : "text-white")}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </header>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-background/95 backdrop-blur-xl pt-24 px-6 pb-6 flex flex-col md:hidden animate-in fade-in slide-in-from-top-4 duration-300">
          <nav className="flex flex-col gap-6 text-xl font-medium">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  "border-b border-border pb-4",
                  location === link.href ? "text-primary" : "text-foreground"
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="mt-auto flex flex-col gap-4">
            <Button variant="outline" className="w-full justify-start h-12 text-lg" asChild onClick={() => setMobileMenuOpen(false)}>
              <Link href="/tracking">
                <Search className="w-5 h-5 mr-3" /> Track Shipment
              </Link>
            </Button>
            <Button className="w-full justify-start h-12 text-lg" asChild onClick={() => setMobileMenuOpen(false)}>
              <Link href="/quote">
                Get a Quote <ArrowRight className="w-5 h-5 ml-auto" />
              </Link>
            </Button>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 flex flex-col">{children}</main>

      {/* Footer */}
      <footer className="bg-[#081226] text-slate-300 border-t border-white/10 pt-20 pb-10">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
            <div className="space-y-4">
              <Link href="/" className="flex items-center gap-2 group mb-6">
                <div className="w-10 h-10 bg-primary flex items-center justify-center rounded-[4px]">
                  <Truck className="w-6 h-6 text-primary-foreground" />
                </div>
                <span className="text-xl font-bold font-sans tracking-tight text-white">
                  SwiftRoute<span className="text-primary">.</span>
                </span>
              </Link>
              <p className="text-sm text-slate-400 max-w-xs leading-relaxed">
                Enterprise-grade logistics and freight forwarding. Precise, reliable, and built for modern supply chains.
              </p>
              <div className="flex gap-4 pt-2">
                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-primary transition-colors cursor-pointer text-white">
                  <Globe2 className="w-5 h-5" />
                </div>
                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-primary transition-colors cursor-pointer text-white">
                  <MapPin className="w-5 h-5" />
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-6">Services</h4>
              <ul className="space-y-3 text-sm">
                <li><Link href="/services" className="hover:text-primary transition-colors">Standard Shipping</Link></li>
                <li><Link href="/services" className="hover:text-primary transition-colors">Express Freight</Link></li>
                <li><Link href="/services" className="hover:text-primary transition-colors">Global Logistics</Link></li>
                <li><Link href="/services" className="hover:text-primary transition-colors">Supply Chain Solutions</Link></li>
                <li><Link href="/services" className="hover:text-primary transition-colors">Warehousing</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-6">Company</h4>
              <ul className="space-y-3 text-sm">
                <li><Link href="/" className="hover:text-primary transition-colors">About Us</Link></li>
                <li><Link href="/tracking" className="hover:text-primary transition-colors">Track Shipment</Link></li>
                <li><Link href="/quote" className="hover:text-primary transition-colors">Request a Quote</Link></li>
                <li><Link href="/contact" className="hover:text-primary transition-colors">Contact Support</Link></li>
                <li><Link href="#" className="hover:text-primary transition-colors">Careers</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-6">Global HQ</h4>
              <ul className="space-y-4 text-sm">
                <li className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-primary shrink-0" />
                  <span>100 Logistics Way, Suite 400<br/>San Francisco, CA 94105<br/>United States</span>
                </li>
                <li className="flex items-center gap-3">
                  <PhoneCall className="w-5 h-5 text-primary shrink-0" />
                  <span>+1 (800) 555-0199</span>
                </li>
                <li className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-primary shrink-0" />
                  <span>24/7 Operations Center</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-500">
            <p>© {new Date().getFullYear()} SwiftRoute Logistics Inc. All rights reserved.</p>
            <div className="flex gap-6">
              <Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link>
              <Link href="#" className="hover:text-white transition-colors">Terms of Service</Link>
              <Link href="#" className="hover:text-white transition-colors">Cookie Policy</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
