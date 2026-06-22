import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { CalendarDays, MapPin, Share2, Ticket, Users, Mail } from "lucide-react";
import { useState, useEffect } from "react";
import { SiteShell } from "@/components/site/SiteShell";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EventCard, formatDate } from "@/components/site/EventCard";
import { eventService } from "@/lib/eventService";

export const Route = createFileRoute("/events/$eventId")({
  head: ({ params }) => {
    return {
      meta: [
        { title: "Event — EventHub" },
        { name: "description", content: "Event details on EventHub." },
      ],
    };
  },
  notFoundComponent: () => (
    <SiteShell>
      <div className="mx-auto max-w-7xl px-6 py-32 text-center">
        <h1 className="text-3xl font-bold">Event not found</h1>
        <Button asChild className="mt-6"><Link to="/events">Back to events</Link></Button>
      </div>
    </SiteShell>
  ),
  loader: async ({ params }) => {
    try {
      const event = await eventService.getById(params.eventId);
      return { event };
    } catch (error) {
      throw notFound();
    }
  },
  component: EventDetail,
});

function EventDetail() {
  const { event } = Route.useLoaderData();
  const [eventData, setEventData] = useState(event);
  const [relatedEvents, setRelatedEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Refresh event data periodically to get latest bookings
  useEffect(() => {
    const refreshEvent = async () => {
      try {
        const freshEvent = await eventService.getById(event.id);
        setEventData(freshEvent);
      } catch (error) {
        console.error('Failed to refresh event:', error);
      }
    };

    // Refresh every 5 seconds
    const interval = setInterval(refreshEvent, 5000);
    
    // Initial refresh after 1 second
    const timeout = setTimeout(refreshEvent, 1000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [event.id]);

  const bookedCount = eventData.bookings?.length || 0;
  const remaining = eventData.capacity - bookedCount;
  const soldOut = remaining <= 0;

  // Fetch related events
  useEffect(() => {
    const fetchRelated = async () => {
      try {
        const allEvents = await eventService.getAll();
        const related = allEvents
          .filter((e: any) => e.id !== eventData.id)
          .slice(0, 3);
        setRelatedEvents(related);
      } catch (error) {
        console.error('Failed to fetch related events:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchRelated();
  }, [eventData.id]);

  // Update page title with event name
  useEffect(() => {
    if (eventData?.title) {
      document.title = `${eventData.title} — EventHub`;
    }
  }, [eventData]);

  return (
    <SiteShell>
      <div className="relative h-80 w-full overflow-hidden sm:h-[420px]">
        <img 
          src={eventData.image || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80'} 
          alt={eventData.title} 
          className="h-full w-full object-cover" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
      </div>

      <section className="mx-auto -mt-24 max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
          <div className="rounded-2xl border border-border bg-card p-6 shadow-soft sm:p-8">
            <div className="flex flex-wrap items-center gap-2">
              <Badge className="bg-gradient-primary text-primary-foreground">{eventData.category}</Badge>
              <Badge variant="outline">{eventData.status}</Badge>
            </div>
            <h1 className="mt-4 text-3xl font-bold sm:text-4xl">{eventData.title}</h1>
            <p className="mt-4 leading-relaxed text-muted-foreground">{eventData.description}</p>

            <dl className="mt-8 grid gap-4 sm:grid-cols-2">
              <Detail icon={CalendarDays} label="Start" value={formatDate(eventData.start_date)} />
              <Detail icon={CalendarDays} label="End" value={formatDate(eventData.end_date)} />
              <Detail icon={MapPin} label="Location" value={eventData.location} />
              <Detail icon={Users} label="Capacity" value={`${bookedCount}/${eventData.capacity} booked`} />
            </dl>

            <div className="mt-8 overflow-hidden rounded-xl border border-border">
              <iframe
                title="map"
                src={`https://www.google.com/maps?q=${encodeURIComponent(eventData.location)}&output=embed`}
                className="h-72 w-full"
                loading="lazy"
              />
            </div>
          </div>

          <aside className="space-y-6">
            <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
              <p className="text-xs uppercase tracking-wider text-muted-foreground">Ticket price</p>
              <p className="mt-1 text-3xl font-bold text-gradient">
                {Number(eventData.price) === 0 ? "Free" : `PKR ${Number(eventData.price).toLocaleString()}`}
              </p>
              <p className="mt-2 text-xs text-muted-foreground">
                {remaining > 0 ? `${remaining} seats remaining` : "No seats remaining"}
              </p>
              <div className="mt-5 flex flex-col gap-2">
                <Button 
                  asChild 
                  disabled={soldOut} 
                  className="bg-gradient-primary text-primary-foreground hover:opacity-90 disabled:bg-muted disabled:bg-none disabled:text-muted-foreground"
                >
                  <Link to="/booking/$eventId" params={{ eventId: String(eventData.id) }}>
                    <Ticket className="h-4 w-4" /> {soldOut ? "Sold out" : "Buy ticket"}
                  </Link>
                </Button>
                <Button variant="outline">
                  <Share2 className="h-4 w-4" /> Share event
                </Button>
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
              <p className="text-xs uppercase tracking-wider text-muted-foreground">Organiser</p>
              <div className="mt-4 flex items-center gap-3">
                <img 
                  src={eventData.user?.avatar || 'https://i.pravatar.cc/80?img=5'} 
                  alt="" 
                  className="h-12 w-12 rounded-full object-cover" 
                />
                <div>
                  <p className="font-semibold">{eventData.user?.name || 'Unknown Organiser'}</p>
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <Mail className="h-3 w-3" /> {eventData.user?.email || 'N/A'}
                  </p>
                </div>
              </div>
            </div>
          </aside>
        </div>

        <div className="mt-20">
          <h2 className="text-2xl font-bold">Related events</h2>
          {loading ? (
            <p className="mt-6 text-muted-foreground">Loading related events...</p>
          ) : (
            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {relatedEvents.map((e: any) => <EventCard key={e.id} event={e} />)}
            </div>
          )}
        </div>
      </section>
    </SiteShell>
  );
}

function Detail({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3 rounded-xl bg-accent/40 p-4">
      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-gradient-primary text-primary-foreground">
        <Icon className="h-4 w-4" />
      </span>
      <div className="min-w-0">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="truncate text-sm font-semibold">{value}</p>
      </div>
    </div>
  );
}