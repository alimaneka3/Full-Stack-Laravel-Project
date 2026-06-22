import { createFileRoute } from "@tanstack/react-router";
import { Edit, Trash2, Check, X } from "lucide-react";
import { useState, useEffect } from "react";
import { AdminShell } from "@/components/admin/AdminShell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { adminService } from "@/lib/adminService";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/users")({
  head: () => ({ meta: [{ title: "Users — Admin" }] }),
  component: AdminUsers,
});

function AdminUsers() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const data = await adminService.getUsers();
        setUsers(data);
      } catch (error) {
        console.error('Failed to fetch users:', error);
        toast.error('Failed to load users');
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      await adminService.updateUser(userId, { role: newRole });
      toast.success(`User role updated to ${newRole}`);
      // Refresh users
      const data = await adminService.getUsers();
      setUsers(data);
    } catch (error) {
      toast.error('Failed to update user role');
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user?')) return;
    
    try {
      await adminService.deleteUser(userId);
      toast.success('User deleted successfully');
      const data = await adminService.getUsers();
      setUsers(data);
    } catch (error) {
      toast.error('Failed to delete user');
    }
  };

  const filteredUsers = users.filter((u: any) => 
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <AdminShell title="Users" subtitle="Loading...">
        <div className="flex min-h-[400px] items-center justify-center">
          <p className="text-muted-foreground">Loading users...</p>
        </div>
      </AdminShell>
    );
  }

  return (
    <AdminShell title="Users" subtitle="Manage all users on the platform.">
      <div className="rounded-2xl border border-border bg-card p-4 shadow-soft">
        <Input 
          placeholder="Search users…" 
          className="max-w-sm" 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      
      <div className="mt-6 overflow-hidden rounded-2xl border border-border bg-card shadow-soft">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.map((u: any) => (
              <TableRow key={u.id}>
                <TableCell className="font-medium">{u.name}</TableCell>
                <TableCell className="text-sm text-muted-foreground">{u.email}</TableCell>
                <TableCell>
                  <Badge variant="outline" className="capitalize">{u.role}</Badge>
                </TableCell>
                <TableCell>
                  {u.is_approved ? (
                    <Badge className="bg-success text-success-foreground">Approved</Badge>
                  ) : (
                    <Badge variant="destructive">Pending</Badge>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    {u.role !== 'admin' && (
                      <>
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          onClick={() => handleRoleChange(u.id, 'admin')}
                        >
                          Make Admin
                        </Button>
                        {!u.is_approved && (
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            className="text-success"
                            onClick={() => {
                              adminService.updateUser(u.id, { is_approved: true });
                              toast.success('User approved');
                            }}
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                        )}
                      </>
                    )}
                    <Button 
                      size="icon" 
                      variant="ghost" 
                      className="text-destructive hover:text-destructive" 
                      onClick={() => handleDeleteUser(u.id)}
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