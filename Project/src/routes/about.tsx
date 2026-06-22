import { createFileRoute } from "@tanstack/react-router";
import { CheckCircle2, Heart, Rocket, Shield, Sparkles, Users, Zap } from "lucide-react";
import { SiteShell } from "@/components/site/SiteShell";

export const Route = createFileRoute("/about")({
  head: () => ({ 
    meta: [
      { title: "About — EventHub" }, 
      { name: "description", content: "Learn about EventHub's mission to connect people through unforgettable events." }
    ] 
  }),
  component: About,
});

function About() {
  return (
    <SiteShell>
      <section className="relative overflow-hidden bg-gradient-hero py-20">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-medium text-primary">
            <Sparkles className="h-3.5 w-3.5" /> About EventHub
          </span>
          <h1 className="mt-5 text-4xl font-bold sm:text-5xl">Connecting people through <span className="text-gradient">unforgettable events</span></h1>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">EventHub is the modern way to discover, create and manage events — built for organisers and attendees who expect more.</p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <img 
            src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=1000&q=80" 
            alt="Our story" 
            className="rounded-3xl object-cover shadow-elegant" 
          />
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-primary">Our Story</p>
            <h2 className="mt-3 text-3xl font-bold sm:text-4xl">Built for the next generation of events</h2>
            <p className="mt-4 leading-relaxed text-muted-foreground">EventHub is an innovative event management platform where organisers create engaging events and attendees discover and book them effortlessly. Born from a final-year project at UMT Lahore, it's grown into a polished, production-ready experience.</p>
            <p className="mt-3 leading-relaxed text-muted-foreground">From intimate workshops to large conferences, EventHub gives every event the spotlight it deserves.</p>
          </div>
        </div>
      </section>

      <section className="bg-accent/40 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold sm:text-4xl">Our mission</h2>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {[
              { icon: Rocket, title: "Easy Event Management", desc: "Empower organisers with a beautifully simple toolkit." },
              { icon: Shield, title: "Secure Ticket Booking", desc: "Bookings that just work — every time, on every device." },
              { icon: Heart, title: "Community Building", desc: "Help people gather, learn and grow together." },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="rounded-2xl border border-border bg-card p-7 shadow-soft hover-lift">
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

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold sm:text-4xl">Why EventHub</h2>
        </div>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { icon: Users, t: "Role-based System" },
            { icon: Shield, t: "Secure Authentication" },
            { icon: Zap, t: "Fast Booking" },
            { icon: Sparkles, t: "Responsive Design" },
            { icon: CheckCircle2, t: "User Friendly Interface" },
            { icon: Heart, t: "Made in Lahore" },
          ].map(({ icon: Icon, t }) => (
            <div key={t} className="flex items-center gap-4 rounded-2xl border border-border bg-card p-5 shadow-soft">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-accent text-primary">
                <Icon className="h-5 w-5" />
              </span>
              <p className="font-medium">{t}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Meet the Team Section - REMOVED */}

    </SiteShell>
  );
}