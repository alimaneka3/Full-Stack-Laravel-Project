import { createFileRoute, Link } from "@tanstack/react-router";
import { CalendarDays, Download, Ticket, X } from "lucide-react";
import { useState, useEffect } from "react";
import { SiteShell } from "@/components/site/SiteShell";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { bookingService } from "@/lib/bookingService";
import { formatDate } from "@/components/site/EventCard";
import { toast } from "sonner";

export const Route = createFileRoute("/my-bookings")({
  head: () => ({ meta: [{ title: "My Bookings — EventHub" }] }),
  component: MyBookings,
});

function MyBookings() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch bookings
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        const data = await bookingService.getMyBookings();
        setBookings(data);
      } catch (error) {
        console.error('Failed to fetch bookings:', error);
        toast.error('Failed to load your bookings');
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  const handleCancel = async (bookingId: string) => {
    try {
      await bookingService.cancel(bookingId);
      toast.success('Booking cancelled successfully');
      // Refresh bookings
      const data = await bookingService.getMyBookings();
      setBookings(data);
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to cancel booking';
      toast.error(message);
    }
  };

  if (loading) {
    return (
      <SiteShell>
        <section className="bg-gradient-hero py-14">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold sm:text-4xl">My <span className="text-gradient">bookings</span></h1>
            <p className="mt-2 text-muted-foreground">All your tickets in one place.</p>
          </div>
        </section>
        <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="flex min-h-[200px] items-center justify-center">
            <p className="text-muted-foreground">Loading your bookings...</p>
          </div>
        </section>
      </SiteShell>
    );
  }

  if (bookings.length === 0) {
    return (
      <SiteShell>
        <section className="bg-gradient-hero py-14">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold sm:text-4xl">My <span className="text-gradient">bookings</span></h1>
            <p className="mt-2 text-muted-foreground">All your tickets in one place.</p>
          </div>
        </section>
        <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="flex min-h-[200px] flex-col items-center justify-center gap-4 text-center">
            <p className="text-muted-foreground">You haven't made any bookings yet.</p>
            <Button asChild className="bg-gradient-primary text-primary-foreground hover:opacity-90">
              <Link to="/events">Browse Events</Link>
            </Button>
          </div>
        </section>
      </SiteShell>
    );
  }

  return (
    <SiteShell>
      <section className="bg-gradient-hero py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold sm:text-4xl">My <span className="text-gradient">bookings</span></h1>
          <p className="mt-2 text-muted-foreground">All your tickets in one place.</p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="space-y-4">
          {bookings.map((b: any) => {
            const ev = b.event;
            const isCancelled = b.status === 'Cancelled';
            
            return (
              <article key={b.id} className="grid gap-4 overflow-hidden rounded-2xl border border-border bg-card shadow-soft sm:grid-cols-[180px_1fr_auto] sm:items-center">
                <img 
                  src={ev.image || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80'} 
                  alt={ev.title} 
                  className="h-40 w-full object-cover sm:h-full" 
                />
                <div className="p-5">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge className="bg-gradient-primary text-primary-foreground">{ev.category}</Badge>
                    <Badge 
                      variant={b.status === "Confirmed" ? "default" : "outline"} 
                      className={b.status === "Confirmed" ? "bg-success text-success-foreground" : ""}
                    >
                      {b.status}
                    </Badge>
                  </div>
                  <h3 className="mt-2 text-lg font-semibold">
                    <Link to="/events/$eventId" params={{ eventId: String(ev.id) }} className="hover:text-primary">
                      {ev.title}
                    </Link>
                  </h3>
                  <p className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                    <CalendarDays className="h-3.5 w-3.5" /> 
                    {formatDate(ev.start_date)} · {ev.location}
                  </p>
                  <p className="mt-2 text-xs text-muted-foreground">
                    Reference · <span className="font-mono font-semibold text-foreground">{b.reference}</span>
                  </p>
                </div>
                <div className="flex flex-col gap-2 p-5">
                  <p className="text-sm">Amount</p>
                  <p className="text-lg font-bold text-gradient">
                    {Number(b.amount) === 0 ? "Free" : `PKR ${Number(b.amount).toLocaleString()}`}
                  </p>
                  <div className="mt-2 flex flex-col gap-2 sm:w-44">
                    <Button size="sm" variant="outline">
                      <Ticket className="h-4 w-4" /> View ticket
                    </Button>
                    <Button size="sm" variant="outline">
                      <Download className="h-4 w-4" /> Download
                    </Button>
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      disabled={isCancelled}
                      className="text-destructive hover:text-destructive disabled:opacity-50 disabled:cursor-not-allowed" 
                      onClick={() => handleCancel(b.id)}
                    >
                      <X className="h-4 w-4" /> {isCancelled ? 'Cancelled' : 'Cancel'}
                    </Button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </SiteShell>
  );
}