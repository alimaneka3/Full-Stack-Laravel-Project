import { createFileRoute, Link } from "@tanstack/react-router";
import { Edit, Eye, Trash2 } from "lucide-react";
import { useState, useEffect } from "react";
import { AdminShell } from "@/components/admin/AdminShell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { adminService } from "@/lib/adminService";
import { formatDate } from "@/components/site/EventCard";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/events")({
  head: () => ({ meta: [{ title: "Events — Admin" }] }),
  component: AdminEvents,
});

function AdminEvents() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const data = await adminService.getEvents();
        setEvents(data);
      } catch (error) {
        console.error('Failed to fetch events:', error);
        toast.error('Failed to load events');
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const handleDelete = async (eventId: string) => {
    if (!confirm('Are you sure you want to delete this event?')) return;
    
    try {
      await adminService.deleteEvent(eventId);
      toast.success('Event deleted successfully');
      const data = await adminService.getEvents();
      setEvents(data);
    } catch (error) {
      toast.error('Failed to delete event');
    }
  };

  if (loading) {
    return (
      <AdminShell title="Events" subtitle="Loading...">
        <div className="flex min-h-[400px] items-center justify-center">
          <p className="text-muted-foreground">Loading events...</p>
        </div>
      </AdminShell>
    );
  }

  return (
    <AdminShell title="Events" subtitle="All events across the platform.">
      <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-soft">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Event</TableHead>
              <TableHead>Organiser</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Bookings</TableHead>
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
                      className="h-10 w-14 rounded object-cover" 
                      alt="" 
                    />
                    <span className="font-medium">{e.title}</span>
                  </div>
                </TableCell>
                <TableCell className="text-sm">{e.user?.name || 'N/A'}</TableCell>
                <TableCell className="text-sm">{formatDate(e.start_date)}</TableCell>
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
                <TableCell className="text-sm">{e.bookings?.length || 0}/{e.capacity}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <Button asChild size="icon" variant="ghost">
                      <Link to="/events/$eventId" params={{ eventId: String(e.id) }}>
                        <Eye className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button asChild size="icon" variant="ghost">
                      <Link to="/admin/edit-event/$eventId" params={{ eventId: String(e.id) }}>
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
      </div>
    </AdminShell>
  );
}