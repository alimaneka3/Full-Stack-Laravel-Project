import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, CalendarCheck, LayoutDashboard, ShieldCheck, Smartphone, Sparkles, Star } from "lucide-react";
import { SiteShell } from "@/components/site/SiteShell";
import { Button } from "@/components/ui/button";
import { EventCard } from "@/components/site/EventCard";
import { Counter } from "@/components/site/Counter";
import { useState, useEffect } from "react";
import { eventService } from "@/lib/eventService";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "EventHub — Discover, Create and Manage Events" },
      { name: "description", content: "Create, manage and attend events through one powerful and seamless platform." },
    ],
  }),
  component: Home,
});

function Home() {
  const [featuredEvents, setFeaturedEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const data = await eventService.getAll();
        setFeaturedEvents(data.slice(0, 2));
      } catch (error) {
        console.error('Failed to fetch events:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const TESTIMONIALS = [
    {
      name: "Ahmed Khan",
      role: "Event Organiser",
      quote: "EventHub made it incredibly easy to manage my conference. Highly recommended!",
      rating: 5,
      avatar: "https://i.pravatar.cc/100?img=11"
    },
    {
      name: "Fatima Ali",
      role: "Attendee",
      quote: "I discovered so many amazing events through this platform. The booking process is seamless.",
      rating: 5,
      avatar: "https://i.pravatar.cc/100?img=12"
    },
    {
      name: "Usman Malik",
      role: "Business Owner",
      quote: "A game-changer for networking events in Lahore. EventHub is the future of event management.",
      rating: 5,
      avatar: "https://i.pravatar.cc/100?img=13"
    }
  ];

  return (
    <SiteShell>
      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-hero">
        <div className="pointer-events-none absolute -top-32 -left-24 h-96 w-96 rounded-full bg-primary/20 blur-3xl animate-blob" />
        <div className="pointer-events-none absolute -bottom-32 -right-24 h-96 w-96 rounded-full bg-primary-glow/20 blur-3xl animate-blob" />
        <div className="relative mx-auto grid max-w-7xl gap-12 px-4 py-20 sm:px-6 md:py-28 lg:grid-cols-2 lg:px-8">
          <div className="animate-fade-in-up">
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-medium text-primary">
              <Sparkles className="h-3.5 w-3.5" /> The all-in-one event platform
            </span>
            <h1 className="mt-5 text-4xl font-bold leading-[1.05] sm:text-5xl lg:text-6xl">
              Discover amazing events with <span className="text-gradient">EventHub</span>
            </h1>
            <p className="mt-5 max-w-xl text-base text-muted-foreground sm:text-lg">
              Create, manage and attend events through one powerful and seamless platform — built for organisers and attendees.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg" className="bg-gradient-primary text-primary-foreground shadow-glow hover:opacity-90">
                <Link to="/events">Explore Events <ArrowRight className="h-4 w-4" /></Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-primary/30">
                <Link to="/register">Become Organiser</Link>
              </Button>
            </div>
            <div className="mt-10 flex items-center gap-6 text-sm text-muted-foreground">
              <div className="flex -space-x-2">
                {[12, 32, 47, 5].map((i) => (
                  <img key={i} src={`https://i.pravatar.cc/40?img=${i}`} alt="" className="h-9 w-9 rounded-full border-2 border-background object-cover" />
                ))}
              </div>
              <div>
                <div className="flex items-center gap-1 text-warning">
                  {Array.from({ length: 5 }).map((_, i) => <Star key={i} className="h-3.5 w-3.5 fill-current" />)}
                </div>
                Loved by 1,000+ users
              </div>
            </div>
          </div>

          <div className="relative animate-fade-in-up">
            <div className="absolute -inset-6 rounded-3xl bg-gradient-primary opacity-20 blur-2xl" />
            <div className="relative grid grid-cols-2 gap-4">
              <img src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&q=80" alt="Conference" className="aspect-[3/4] w-full rounded-2xl object-cover shadow-elegant animate-float" />
              <img src="https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=600&q=80" alt="Music" className="mt-8 aspect-[3/4] w-full rounded-2xl object-cover shadow-elegant animate-float" style={{ animationDelay: "1s" }} />
              <img src="https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=600&q=80" alt="Networking" className="-mt-4 aspect-[3/4] w-full rounded-2xl object-cover shadow-elegant animate-float" style={{ animationDelay: "2s" }} />
              <img src="https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&q=80" alt="Tech" className="aspect-[3/4] w-full rounded-2xl object-cover shadow-elegant animate-float" style={{ animationDelay: "3s" }} />
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED EVENTS */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold sm:text-4xl">Featured events</h2>
            <p className="mt-2 text-muted-foreground">Handpicked experiences happening near you.</p>
          </div>
          <Button asChild variant="ghost"><Link to="/events">View all <ArrowRight className="h-4 w-4" /></Link></Button>
        </div>
        {loading ? (
          <div className="mt-10 flex justify-center">
            <p className="text-muted-foreground">Loading events...</p>
          </div>
        ) : (
          <div className="mt-10 grid gap-6 sm:grid-cols-2">
            {featuredEvents.length > 0 ? (
              featuredEvents.map((e: any) => <EventCard key={e.id} event={e} />)
            ) : (
              <p className="text-muted-foreground">No featured events available</p>
            )}
          </div>
        )}
      </section>

      {/* WHY CHOOSE EVENTHUB */}
      <section className="bg-accent/40 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold sm:text-4xl">Why choose <span className="text-gradient">EventHub</span></h2>
            <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">Everything you need to host beautiful events and delight your attendees.</p>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: CalendarCheck, title: "Easy Event Management", desc: "Create, edit and publish events in minutes with a beautiful dashboard." },
              { icon: ShieldCheck, title: "Secure Ticket Booking", desc: "Encrypted bookings and reliable confirmations every time." },
              { icon: LayoutDashboard, title: "Smart Dashboard", desc: "Real-time analytics, attendees, and revenue at a glance." },
              { icon: Smartphone, title: "Responsive Experience", desc: "Pixel-perfect on every device — desktop, tablet, or phone." },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="group rounded-2xl border border-border bg-card p-6 shadow-soft hover-lift">
                <div className="grid h-12 w-12 place-items-center rounded-xl bg-gradient-primary text-primary-foreground shadow-glow">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-5 text-lg font-semibold">{title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="grid gap-8 rounded-3xl border border-border bg-card p-10 shadow-soft sm:grid-cols-2 lg:grid-cols-4">
          {[
            { v: 100, l: "Events Hosted" },
            { v: 1000, l: "Active Users" },
            { v: 5000, l: "Tickets Sold" },
            { v: 50, l: "Organisers" },
          ].map((s) => (
            <div key={s.l} className="text-center">
              <Counter value={s.v} />
              <p className="mt-2 text-sm font-medium text-muted-foreground">{s.l}</p>
            </div>
          ))}
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="bg-accent/40 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold sm:text-4xl">Loved by organisers and attendees</h2>
            <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">Real stories from people who chose EventHub.</p>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {TESTIMONIALS.map((t) => (
              <div key={t.name} className="glass-card rounded-2xl p-6 shadow-soft hover-lift">
                <div className="flex items-center gap-1 text-warning">
                  {Array.from({ length: t.rating }).map((_, i) => <Star key={i} className="h-4 w-4 fill-current" />)}
                </div>
                <p className="mt-4 text-sm leading-relaxed text-foreground/90">"{t.quote}"</p>
                <div className="mt-6 flex items-center gap-3">
                  <img src={t.avatar} alt={t.name} className="h-11 w-11 rounded-full object-cover" />
                  <div>
                    <p className="text-sm font-semibold">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>


    </SiteShell>
  );
}