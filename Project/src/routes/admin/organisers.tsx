import { createFileRoute } from "@tanstack/react-router";
import { Check, X } from "lucide-react";
import { useState, useEffect } from "react";
import { AdminShell } from "@/components/admin/AdminShell";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { adminService } from "@/lib/adminService";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/organisers")({
  head: () => ({ meta: [{ title: "Organiser Approvals — Admin" }] }),
  component: AdminOrganisers,
});

function AdminOrganisers() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPendingOrganisers = async () => {
    try {
      setLoading(true);
      const data = await adminService.getUsers();
      const organisers = data.filter((u: any) => u.role === 'organiser' && !u.is_approved);
      setUsers(organisers);
    } catch (error: any) {
      console.error('Failed to fetch users:', error);
      toast.error('Failed to load pending organisers');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingOrganisers();
  }, []);

  const handleApprove = async (userId: string) => {
    try {
      await adminService.updateUser(userId, { is_approved: true });
      toast.success('✅ Organiser approved successfully!');
      await fetchPendingOrganisers();
    } catch (error: any) {
      console.error('Approve error:', error);
      toast.error(error.response?.data?.message || 'Failed to approve organiser');
    }
  };

  const handleReject = async (userId: string) => {
    if (!confirm('Are you sure you want to reject this organiser?')) {
      return;
    }
    
    try {
      await adminService.deleteUser(userId);
      toast.success('❌ Organiser rejected and removed.');
      await fetchPendingOrganisers();
    } catch (error: any) {
      console.error('Reject error:', error);
      toast.error(error.response?.data?.message || 'Failed to reject organiser');
    }
  };

  if (loading) {
    return (
      <AdminShell title="Organiser Approvals" subtitle="Loading...">
        <div className="flex min-h-[400px] items-center justify-center">
          <p className="text-muted-foreground">Loading pending organisers...</p>
        </div>
      </AdminShell>
    );
  }

  if (users.length === 0) {
    return (
      <AdminShell title="Organiser Approvals" subtitle="Review and approve organiser applications.">
        <div className="flex min-h-[200px] items-center justify-center rounded-2xl border border-border bg-card">
          <div className="text-center">
            <Check className="mx-auto h-12 w-12 text-green-500" />
            <p className="mt-2 text-muted-foreground">No pending organiser approvals</p>
            <p className="text-sm text-muted-foreground">All organiser applications have been reviewed.</p>
          </div>
        </div>
      </AdminShell>
    );
  }

  return (
    <AdminShell title="Organiser Approvals" subtitle="Review and approve organiser applications.">
      <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-soft">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Applied</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((u: any) => (
              <TableRow key={u.id}>
                <TableCell className="font-medium">{u.name}</TableCell>
                <TableCell className="text-sm text-muted-foreground">{u.email}</TableCell>
                <TableCell className="text-sm">
                  {new Date(u.created_at).toLocaleDateString('en-GB', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric'
                  })}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button 
                      size="sm" 
                      className="bg-green-600 text-white hover:bg-green-700" 
                      onClick={() => handleApprove(u.id)}
                    >
                      <Check className="h-4 w-4 mr-1" /> Approve
                    </Button>
                    <Button 
                      size="sm" 
                      variant="destructive"
                      className="bg-red-600 text-white hover:bg-red-700" 
                      onClick={() => handleReject(u.id)}
                    >
                      <X className="h-4 w-4 mr-1" /> Reject
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