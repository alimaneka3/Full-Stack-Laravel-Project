import { createFileRoute } from "@tanstack/react-router";
import { AdminShell } from "@/components/admin/AdminShell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { adminService } from "@/lib/adminService";
import { useState, useEffect } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/bookings")({
  head: () => ({ meta: [{ title: "Bookings — Admin" }] }),
  component: AdminBookings,
});

function AdminBookings() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        const data = await adminService.getBookings();
        setBookings(data);
      } catch (error) {
        console.error('Failed to fetch bookings:', error);
        toast.error('Failed to load bookings');
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  const handleStatusUpdate = async (bookingId: string, newStatus: string) => {
    try {
      await adminService.updateBookingStatus(bookingId, newStatus);
      toast.success(`Booking ${newStatus}`);
      const data = await adminService.getBookings();
      setBookings(data);
    } catch (error) {
      toast.error('Failed to update booking status');
    }
  };

  if (loading) {
    return (
      <AdminShell title="Bookings" subtitle="Loading...">
        <div className="flex min-h-[400px] items-center justify-center">
          <p className="text-muted-foreground">Loading bookings...</p>
        </div>
      </AdminShell>
    );
  }

  return (
    <AdminShell title="Bookings" subtitle="All ticket bookings.">
      <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-soft">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Reference</TableHead>
              <TableHead>Attendee</TableHead>
              <TableHead>Event</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {bookings.map((b: any) => (
              <TableRow key={b.id}>
                <TableCell className="font-mono text-xs">{b.reference}</TableCell>
                <TableCell>{b.user?.name || 'N/A'}</TableCell>
                <TableCell>{b.event?.title || 'N/A'}</TableCell>
                <TableCell>
                  {Number(b.amount) === 0 ? "Free" : `PKR ${Number(b.amount).toLocaleString()}`}
                </TableCell>
                <TableCell>
                  <Badge 
                    className={
                      b.status === "Confirmed" ? "bg-success text-success-foreground" : 
                      b.status === "Cancelled" ? "bg-destructive text-destructive-foreground" : 
                      ""
                    }
                  >
                    {b.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    {b.status !== 'Confirmed' && (
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        className="text-success"
                        onClick={() => handleStatusUpdate(b.id, 'Confirmed')}
                      >
                        Confirm
                      </Button>
                    )}
                    {b.status !== 'Cancelled' && b.status !== 'Confirmed' && (
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        className="text-destructive"
                        onClick={() => handleStatusUpdate(b.id, 'Cancelled')}
                      >
                        Cancel
                      </Button>
                    )}
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