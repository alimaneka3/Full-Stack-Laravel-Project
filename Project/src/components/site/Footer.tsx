import { Link } from "@tanstack/react-router";
import { Facebook, Instagram, Linkedin, Mail, MapPin, Phone, Sparkles, Twitter } from "lucide-react";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-border bg-gradient-to-b from-background to-accent/40">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <Link to="/" className="flex items-center gap-2">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-primary shadow-glow">
                <Sparkles className="h-5 w-5 text-primary-foreground" />
              </span>
              <span className="text-lg font-bold">
                Event<span className="text-gradient">Hub</span>
              </span>
            </Link>
            <p className="mt-4 text-sm text-muted-foreground">
              Discover, create and manage events effortlessly. Built for organisers and attendees who expect more.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold">Quick Links</h4>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
              <li><Link to="/" className="hover:text-primary">Home</Link></li>
              <li><Link to="/events" className="hover:text-primary">Events</Link></li>
              <li><Link to="/about" className="hover:text-primary">About Us</Link></li>
              <li><Link to="/contact" className="hover:text-primary">Contact Us</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold">Contact</h4>
            <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
              <li className="flex items-start gap-2"><MapPin className="mt-0.5 h-4 w-4 text-primary" /> UMT Lahore, Pakistan</li>
              <li className="flex items-start gap-2"><Phone className="mt-0.5 h-4 w-4 text-primary" /> +92 300 0294915</li>
              <li className="flex items-start gap-2"><Mail className="mt-0.5 h-4 w-4 text-primary" /> info@eventhub.com</li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold">Follow Us</h4>
            <div className="mt-4 flex gap-3">
              {[Facebook, Instagram, Linkedin, Twitter].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="grid h-10 w-10 place-items-center rounded-xl border border-border bg-card text-muted-foreground transition hover:border-primary hover:text-primary"
                  aria-label="social"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-2 border-t border-border pt-6 text-xs text-muted-foreground sm:flex-row">
          <p>© 2026 EventHub. All rights reserved.</p>
          <p>Designed &amp; developed by <span className="font-semibold text-foreground">Ali Muhammad</span> — Lahore, Pakistan</p>
        </div>
      </div>
    </footer>
  );
}
