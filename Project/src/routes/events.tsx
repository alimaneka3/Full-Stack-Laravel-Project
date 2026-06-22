import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState, useEffect } from "react";
import { Search } from "lucide-react";
import { SiteShell } from "@/components/site/SiteShell";
import { EventCard } from "@/components/site/EventCard";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { eventService } from "@/lib/eventService";

export const Route = createFileRoute("/events")({
  head: () => ({ 
    meta: [
      { title: "Events — EventHub" }, 
      { name: "description", content: "Browse and book upcoming events on EventHub." }
    ] 
  }),
  component: EventsPage,
});

const PER_PAGE = 6;

function EventsPage() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("all");
  const [loc, setLoc] = useState("all");
  const [page, setPage] = useState(1);

  // Fetch events from API
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const data = await eventService.getAll();
        setEvents(data);
      } catch (error) {
        console.error('Failed to fetch events:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  // Get unique locations from events
  const locations = useMemo(() => {
    return Array.from(new Set(events.map((e: any) => e.location)));
  }, [events]);

  // Filter events
  const filtered = useMemo(() => {
    return events.filter((e: any) =>
      (q ? e.title.toLowerCase().includes(q.toLowerCase()) : true) &&
      (cat === "all" ? true : e.category === cat) &&
      (loc === "all" ? true : e.location === loc)
    );
  }, [events, q, cat, loc]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const pageItems = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  if (loading) {
    return (
      <SiteShell>
        <div className="flex min-h-[400px] items-center justify-center">
          <p className="text-muted-foreground">Loading events...</p>
        </div>
      </SiteShell>
    );
  }

  return (
    <SiteShell>
      <section className="relative overflow-hidden bg-gradient-hero py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold sm:text-5xl">All <span className="text-gradient">events</span></h1>
          <p className="mt-3 max-w-2xl text-muted-foreground">Discover confirmed events near you and book your seat in seconds.</p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-3 rounded-2xl border border-border bg-card p-4 shadow-soft md:grid-cols-[1fr_auto_auto_auto]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input 
              placeholder="Search by title…" 
              value={q} 
              onChange={(e) => { setQ(e.target.value); setPage(1); }} 
              className="pl-9" 
            />
          </div>
          <Select value={cat} onValueChange={(v) => { setCat(v); setPage(1); }}>
            <SelectTrigger className="md:w-44"><SelectValue placeholder="Category" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All categories</SelectItem>
              {["Conference", "Music", "Workshop", "Networking", "Sports", "Technology"].map((c) => (
                <SelectItem key={c} value={c}>{c}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={loc} onValueChange={(v) => { setLoc(v); setPage(1); }}>
            <SelectTrigger className="md:w-52"><SelectValue placeholder="Location" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All locations</SelectItem>
              {locations.map((l: string) => <SelectItem key={l} value={l}>{l}</SelectItem>)}
            </SelectContent>
          </Select>
          <Input type="date" className="md:w-44" />
        </div>

        {pageItems.length === 0 ? (
          <p className="mt-16 text-center text-muted-foreground">No events match your filters.</p>
        ) : (
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {pageItems.map((e: any) => <EventCard key={e.id} event={e} />)}
          </div>
        )}

        {totalPages > 1 && (
          <div className="mt-10 flex items-center justify-center gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              disabled={page === 1} 
              onClick={() => setPage((p) => p - 1)}
            >
              Previous
            </Button>
            {Array.from({ length: totalPages }).map((_, i) => (
              <Button 
                key={i} 
                size="sm" 
                variant={page === i + 1 ? "default" : "outline"}
                className={page === i + 1 ? "bg-gradient-primary text-primary-foreground" : ""}
                onClick={() => setPage(i + 1)}
              >
                {i + 1}
              </Button>
            ))}
            <Button 
              variant="outline" 
              size="sm" 
              disabled={page === totalPages} 
              onClick={() => setPage((p) => p + 1)}
            >
              Next
            </Button>
          </div>
        )}
      </section>
    </SiteShell>
  );
}