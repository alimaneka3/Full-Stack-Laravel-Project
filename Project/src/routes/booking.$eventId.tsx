import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { CheckCircle2, CreditCard, Download, Lock } from "lucide-react";
import { useMemo, useState } from "react";
import { SiteShell } from "@/components/site/SiteShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { eventService } from "@/lib/eventService";
import { bookingService } from "@/lib/bookingService";
import { formatDate } from "@/components/site/EventCard";
import { toast } from "sonner";

export const Route = createFileRoute("/booking/$eventId")({
  head: () => ({ meta: [{ title: "Book Ticket — EventHub" }] }),
  loader: async ({ params }) => {
    try {
      const event = await eventService.getById(params.eventId);
      return { event };
    } catch (error) {
      throw notFound();
    }
  },
  component: BookingPage,
});

function generateRef() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let r = "";
  for (let i = 0; i < 7; i++) r += chars[Math.floor(Math.random() * chars.length)];
  return `EVT-2026-${r}`;
}

function BookingPage() {
  const { event: initialEvent } = Route.useLoaderData();
  const [event, setEvent] = useState(initialEvent);
  const [confirmed, setConfirmed] = useState(false);
  const [loading, setLoading] = useState(false);
  const reference = useMemo(() => generateRef(), []);
  const navigate = useNavigate();
  const isFree = Number(event.price) === 0;
  
  // Calculate booked count from bookings array
  const bookedCount = event.bookings?.length || 0;
  const remaining = event.capacity - bookedCount;
  const soldOut = remaining <= 0;

  const handleBooking = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      await bookingService.create(event.id);
      
      // REFRESH the event data to get updated bookings
      const refreshedEvent = await eventService.getById(event.id);
      setEvent(refreshedEvent);
      
      setConfirmed(true);
      toast.success('Booking confirmed!');
    } catch (error: any) {
      const message = error.response?.data?.message || 'Booking failed. Please try again.';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  if (confirmed) {
    return (
      <SiteShell>
        <section className="mx-auto max-w-2xl px-4 py-20 sm:px-6">
          <div className="rounded-3xl border border-border bg-card p-10 text-center shadow-elegant">
            <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-success/15 text-success">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <h1 className="mt-6 text-3xl font-bold">Booking successful!</h1>
            <p className="mt-2 text-muted-foreground">Your seat is reserved. A confirmation has been sent to your email.</p>

            <div className="mt-8 rounded-2xl border border-dashed border-primary/40 bg-accent/40 p-6 text-left">
              <p className="text-xs uppercase tracking-wider text-muted-foreground">Reference number</p>
              <p className="mt-1 font-mono text-2xl font-bold text-gradient">{reference}</p>
              <div className="mt-4 grid gap-2 text-sm sm:grid-cols-2">
                <p><span className="text-muted-foreground">Event:</span> <span className="font-semibold">{event.title}</span></p>
                <p><span className="text-muted-foreground">Date:</span> <span className="font-semibold">{formatDate(event.start_date)}</span></p>
                <p><span className="text-muted-foreground">Location:</span> <span className="font-semibold">{event.location}</span></p>
                <p><span className="text-muted-foreground">Amount:</span> <span className="font-semibold">{isFree ? "Free" : `PKR ${Number(event.price).toLocaleString()}`}</span></p>
                <p><span className="text-muted-foreground">Seats booked:</span> <span className="font-semibold">{event.bookings?.length || 0}/{event.capacity}</span></p>
              </div>
            </div>

            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Button className="bg-gradient-primary text-primary-foreground hover:opacity-90">
                <Download className="h-4 w-4" /> Download ticket
              </Button>
              <Button variant="outline" onClick={() => navigate({ to: "/my-bookings" })}>
                View my bookings
              </Button>
            </div>
          </div>
        </section>
      </SiteShell>
    );
  }

  return (
    <SiteShell>
      <section className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold sm:text-4xl">{isFree ? "Confirm your booking" : "Checkout"}</h1>
        <p className="mt-2 text-muted-foreground">
          {isFree ? "This event is free — just confirm to reserve your spot." : "Complete payment to secure your ticket."}
        </p>

        <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_360px]">
          <form
            onSubmit={handleBooking}
            className="rounded-2xl border border-border bg-card p-6 shadow-soft sm:p-8"
          >
            {isFree ? (
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <Label>Full name</Label>
                  <Input 
                    name="name"
                    required 
                    placeholder="Your name" 
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Email</Label>
                  <Input 
                    type="email" 
                    name="email"
                    required 
                    placeholder="you@example.com" 
                  />
                </div>
              </div>
            ) : (
              <>
                <p className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Lock className="h-4 w-4 text-primary" /> Secure payment · Demo simulation
                </p>
                <div className="mt-6 space-y-4">
                  <div className="space-y-1.5">
                    <Label>Card holder</Label>
                    <Input name="card_holder" required placeholder="Name on card" />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Card number</Label>
                    <div className="relative">
                      <CreditCard className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input 
                        name="card_number"
                        required 
                        placeholder="4242 4242 4242 4242" 
                        className="pl-9" 
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label>Expiry</Label>
                      <Input name="expiry" required placeholder="MM / YY" />
                    </div>
                    <div className="space-y-1.5">
                      <Label>CVV</Label>
                      <Input 
                        name="cvv"
                        required 
                        type="password" 
                        placeholder="•••" 
                      />
                    </div>
                  </div>
                </div>
              </>
            )}

            <div className="mt-8 flex flex-wrap gap-3">
              <Button 
                type="submit" 
                disabled={loading || soldOut}
                className="bg-gradient-primary text-primary-foreground hover:opacity-90 disabled:opacity-50"
              >
                {loading ? 'Processing...' : (soldOut ? "Sold Out" : (isFree ? "Confirm booking" : `Pay PKR ${Number(event.price).toLocaleString()}`))}
              </Button>
              <Button asChild type="button" variant="outline">
                <Link to="/events/$eventId" params={{ eventId: String(event.id) }}>Cancel</Link>
              </Button>
            </div>
          </form>

          <aside className="h-fit rounded-2xl border border-border bg-card p-6 shadow-soft">
            <img 
              src={event.image || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80'} 
              alt={event.title} 
              className="aspect-video w-full rounded-xl object-cover" 
            />
            <Badge className="mt-4 bg-gradient-primary text-primary-foreground">{event.category}</Badge>
            <h3 className="mt-2 text-lg font-semibold">{event.title}</h3>
            <p className="mt-1 text-xs text-muted-foreground">
              {formatDate(event.start_date)} · {event.location}
            </p>
            <div className="mt-5 space-y-2 border-t border-border pt-4 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Ticket</span>
                <span>{isFree ? "Free" : `PKR ${Number(event.price).toLocaleString()}`}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Service fee</span>
                <span>PKR 0</span>
              </div>
              <div className="flex justify-between border-t border-border pt-3 text-base font-semibold">
                <span>Total</span>
                <span className="text-gradient">{isFree ? "Free" : `PKR ${Number(event.price).toLocaleString()}`}</span>
              </div>
              <div className="flex justify-between border-t border-border pt-3 text-xs text-muted-foreground">
                <span>Available seats</span>
                <span className="font-semibold">{remaining} / {event.capacity}</span>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </SiteShell>
  );
}