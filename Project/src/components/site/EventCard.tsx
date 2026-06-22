import { Link } from "@tanstack/react-router";
import { CalendarDays, MapPin, Ticket, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface Event {
  id: number;
  title: string;
  description: string;
  start_date: string;
  end_date: string;
  location: string;
  category: string;
  capacity: number;
  price: string | number;
  status: string;
  image: string;
  user?: {
    id: number;
    name: string;
    email: string;
  };
  bookings?: any[];
}

export function EventCard({ event }: { event: Event }) {
  const bookedCount = event.bookings?.length || 0;
  const soldOut = bookedCount >= event.capacity;
  const price = typeof event.price === 'string' ? parseFloat(event.price) : event.price;

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-soft hover-lift">
      <Link 
        to="/events/$eventId" 
        params={{ eventId: String(event.id) }} 
        className="relative block aspect-[16/10] overflow-hidden"
      >
        <img
          src={event.image || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80'}
          alt={event.title}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-x-0 top-0 flex items-start justify-between p-3">
          <Badge className="bg-background/80 text-foreground backdrop-blur">{event.category}</Badge>
          {soldOut ? (
            <Badge className="bg-destructive text-destructive-foreground">SOLD OUT</Badge>
          ) : (
            <Badge className="bg-gradient-primary text-primary-foreground">
              {price === 0 ? "Free" : `PKR ${price.toLocaleString()}`}
            </Badge>
          )}
        </div>
      </Link>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <h3 className="line-clamp-2 text-lg font-semibold leading-snug">
          <Link 
            to="/events/$eventId" 
            params={{ eventId: String(event.id) }} 
            className="hover:text-primary"
          >
            {event.title}
          </Link>
        </h3>
        <p className="line-clamp-2 text-sm text-muted-foreground">{event.description}</p>

        <ul className="mt-1 space-y-1.5 text-xs text-muted-foreground">
          <li className="flex items-center gap-2">
            <CalendarDays className="h-3.5 w-3.5 text-primary" /> 
            {formatDate(event.start_date)}
          </li>
          <li className="flex items-center gap-2">
            <MapPin className="h-3.5 w-3.5 text-primary" /> 
            {event.location}
          </li>
          <li className="flex items-center gap-2">
            <Users className="h-3.5 w-3.5 text-primary" /> 
            {bookedCount}/{event.capacity} booked
          </li>
        </ul>

        <div className="mt-auto pt-3">
          <Button 
            asChild 
            disabled={soldOut} 
            className="w-full bg-gradient-primary text-primary-foreground hover:opacity-90 disabled:bg-muted disabled:text-muted-foreground disabled:bg-none"
          >
            <Link to="/booking/$eventId" params={{ eventId: String(event.id) }}>
              <Ticket className="h-4 w-4" />
              {soldOut ? "Sold Out" : "Buy Ticket"}
            </Link>
          </Button>
        </div>
      </div>
    </article>
  );
}

export function formatDate(d: string) {
  if (!d) return 'Date TBA';
  return new Date(d).toLocaleDateString("en-GB", { 
    day: "numeric", 
    month: "short", 
    year: "numeric" 
  });
}