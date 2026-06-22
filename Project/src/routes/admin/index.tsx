import { createFileRoute } from "@tanstack/react-router";
import { CalendarDays, DollarSign, TrendingUp, Users } from "lucide-react";
import { useState, useEffect } from "react";
import { AdminShell } from "@/components/admin/AdminShell";
import { Counter } from "@/components/site/Counter";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { adminService } from "@/lib/adminService";
import { formatDate } from "@/components/site/EventCard";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/")({
  head: () => ({ meta: [{ title: "Admin Dashboard — EventHub" }] }),
  component: AdminDashboard,
});

function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [statsData, usersData, bookingsData, eventsData] = await Promise.all([
        adminService.getDashboard(),
        adminService.getUsers(),
        adminService.getBookings(),
        adminService.getEvents()
      ]);
      
      setStats(statsData);
      setUsers(usersData);
      setBookings(bookingsData);
      setEvents(eventsData);
    } catch (error) {
      console.error('Failed to fetch admin data:', error);
      toast.error('Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleApproveOrganiser = async (userId: string) => {
    try {
      await adminService.updateUser(userId, { is_approved: true });
      toast.success('✅ Organiser approved successfully!');
      await fetchData();
    } catch (error: any) {
      console.error('Approve error:', error);
      toast.error(error.response?.data?.message || 'Failed to approve organiser');
    }
  };

  const handleRejectOrganiser = async (userId: string) => {
    if (!confirm('Are you sure you want to reject this organiser application?')) {
      return;
    }
    
    try {
      await adminService.deleteUser(userId);
      toast.success('❌ Organiser rejected and removed.');
      await fetchData();
    } catch (error: any) {
      console.error('Reject error:', error);
      toast.error(error.response?.data?.message || 'Failed to reject organiser');
    }
  };

  if (loading) {
    return (
      <AdminShell title="Dashboard" subtitle="Loading...">
        <div className="flex min-h-[400px] items-center justify-center">
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </AdminShell>
    );
  }

  const statItems = [
    { label: "Total Users", value: stats?.total_users || 0, icon: Users, color: "from-violet-500 to-fuchsia-500" },
    { label: "Total Events", value: stats?.total_events || 0, icon: CalendarDays, color: "from-purple-500 to-indigo-500" },
    { label: "Upcoming Events", value: stats?.upcoming_events || 0, icon: TrendingUp, color: "from-fuchsia-500 to-pink-500" },
    { label: "Total Revenue", value: stats?.total_revenue || 0, icon: DollarSign, color: "from-indigo-500 to-purple-500" },
  ];

  // Get pending organisers
  const pendingOrganisers = users.filter((u: any) => u.role === 'organiser' && !u.is_approved);

  return (
    <AdminShell title="Dashboard" subtitle="Welcome back. Here's what's happening today.">
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {statItems.map((s) => (
          <div key={s.label} className="overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-soft hover-lift">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs uppercase tracking-wider text-muted-foreground">{s.label}</p>
                <div className="mt-2">
                  <Counter value={Number(s.value)} suffix="" />
                </div>
              </div>
              <span className={`grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-br ${s.color} text-white shadow-glow`}>
                <s.icon className="h-5 w-5" />
              </span>
            </div>
          </div>
        ))}
      </div>

      {pendingOrganisers.length > 0 && (
        <div className="mt-8">
          <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-soft">
            <div className="border-b border-border px-6 py-4">
              <h3 className="font-semibold">Pending organiser approvals</h3>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pendingOrganisers.map((u: any) => (
                  <TableRow key={u.id}>
                    <TableCell className="font-medium">{u.name}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{u.email}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button 
                          size="sm" 
                          className="bg-green-600 text-white hover:bg-green-700" 
                          onClick={() => handleApproveOrganiser(u.id)}
                        >
                          Approve
                        </Button>
                        <Button 
                          size="sm" 
                          variant="destructive"
                          className="bg-red-600 text-white hover:bg-red-700" 
                          onClick={() => handleRejectOrganiser(u.id)}
                        >
                          Reject
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      )}

      <div className="mt-8 grid gap-6 xl:grid-cols-2">
        <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-soft">
          <div className="border-b border-border px-6 py-4">
            <h3 className="font-semibold">Recent bookings</h3>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Reference</TableHead>
                <TableHead>Event</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bookings.slice(0, 5).map((b: any) => (
                <TableRow key={b.id}>
                  <TableCell className="font-mono text-xs">{b.reference}</TableCell>
                  <TableCell className="text-sm">{b.event?.title || 'N/A'}</TableCell>
                  <TableCell className="text-sm">
                    {Number(b.amount) === 0 ? "Free" : `PKR ${Number(b.amount).toLocaleString()}`}
                  </TableCell>
                  <TableCell>
                    <Badge className={b.status === "Confirmed" ? "bg-success text-success-foreground" : ""}>
                      {b.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-soft">
          <div className="border-b border-border px-6 py-4">
            <h3 className="font-semibold">Recent events</h3>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Event</TableHead>
                <TableHead>Organiser</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {events.slice(0, 5).map((e: any) => (
                <TableRow key={e.id}>
                  <TableCell className="font-medium">{e.title}</TableCell>
                  <TableCell className="text-sm">{e.user?.name || 'N/A'}</TableCell>
                  <TableCell className="text-sm">{formatDate(e.start_date)}</TableCell>
                  <TableCell>
                    <Badge className={e.status === "Confirmed" ? "bg-success text-success-foreground" : ""}>
                      {e.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </AdminShell>
  );
}