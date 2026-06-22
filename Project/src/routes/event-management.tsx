import { createFileRoute, Link } from "@tanstack/react-router";
import { Edit, Eye, Plus, Trash2 } from "lucide-react";
import { useState, useEffect } from "react";
import { SiteShell } from "@/components/site/SiteShell";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { eventService } from "@/lib/eventService";
import { formatDate } from "@/components/site/EventCard";
import { toast } from "sonner";

export const Route = createFileRoute("/event-management")({
  head: () => ({ meta: [{ title: "Event Management — EventHub" }] }),
  component: EventManagement,
});

function EventManagement() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const data = await eventService.getMyEvents();
        setEvents(data);
      } catch (error) {
        console.error('Failed to fetch events:', error);
        toast.error('Failed to load your events');
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const handleDelete = async (eventId: string) => {
    if (!confirm('Are you sure you want to delete this event?')) return;
    
    try {
      await eventService.delete(eventId);
      toast.success('Event deleted successfully');
      // Refresh events
      const data = await eventService.getMyEvents();
      setEvents(data);
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to delete event';
      toast.error(message);
    }
  };

  if (loading) {
    return (
      <SiteShell>
        <div className="flex min-h-[400px] items-center justify-center">
          <p className="text-muted-foreground">Loading your events...</p>
        </div>
      </SiteShell>
    );
  }

  return (
    <SiteShell>
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-3xl font-bold sm:text-4xl">Event <span className="text-gradient">management</span></h1>
            <p className="mt-2 text-muted-foreground">Manage all events you've created.</p>
          </div>
          <Button asChild className="bg-gradient-primary text-primary-foreground hover:opacity-90">
            <Link to="/create-event"><Plus className="h-4 w-4" /> New event</Link>
          </Button>
        </div>

        <div className="mt-8 overflow-hidden rounded-2xl border border-border bg-card shadow-soft">
          {events.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-muted-foreground">You haven't created any events yet.</p>
              <Button asChild className="mt-4 bg-gradient-primary text-primary-foreground hover:opacity-90">
                <Link to="/create-event">Create your first event</Link>
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Event</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Bookings</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {events.map((e: any) => (
                  <TableRow key={e.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <img 
                          src={e.image || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80'} 
                          alt="" 
                          className="h-12 w-16 rounded-md object-cover" 
                        />
                        <div className="min-w-0">
                          <p className="truncate font-semibold">{e.title}</p>
                          <p className="truncate text-xs text-muted-foreground">{e.location}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">{formatDate(e.start_date)}</TableCell>
                    <TableCell><Badge variant="outline">{e.category}</Badge></TableCell>
                    <TableCell className="text-sm">{e.bookings?.length || 0}/{e.capacity}</TableCell>
                    <TableCell>
                      <Badge 
                        className={
                          e.status === "Confirmed" ? "bg-success text-success-foreground" : 
                          e.status === "Cancelled" ? "bg-destructive text-destructive-foreground" : 
                          ""
                        }
                      >
                        {e.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button asChild size="icon" variant="ghost">
                          <Link to="/events/$eventId" params={{ eventId: String(e.id) }}>
                            <Eye className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button size="icon" variant="ghost">
                          <Link to="/edit-event/$eventId" params={{ eventId: String(e.id) }}>
                            <Edit className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button 
                          size="icon" 
                          variant="ghost" 
                          className="text-destructive hover:text-destructive" 
                          onClick={() => handleDelete(e.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </section>
    </SiteShell>
  );
}