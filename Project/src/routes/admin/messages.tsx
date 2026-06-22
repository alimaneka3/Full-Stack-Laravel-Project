import { createFileRoute } from "@tanstack/react-router";
import { Check, Trash2 } from "lucide-react";
import { useState, useEffect } from "react";
import { AdminShell } from "@/components/admin/AdminShell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { adminService } from "@/lib/adminService";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/messages")({
  head: () => ({ meta: [{ title: "Contact Messages — Admin" }] }),
  component: AdminMessages,
});

function AdminMessages() {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        setLoading(true);
        const data = await adminService.getContactMessages();
        setMessages(data);
      } catch (error) {
        console.error('Failed to fetch messages:', error);
        toast.error('Failed to load messages');
      } finally {
        setLoading(false);
      }
    };
    fetchMessages();
  }, []);

  const handleMarkRead = async (messageId: string) => {
    try {
      await adminService.markMessageRead(messageId);
      toast.success('Marked as read');
      const data = await adminService.getContactMessages();
      setMessages(data);
    } catch (error) {
      toast.error('Failed to mark as read');
    }
  };

  const handleDelete = async (messageId: string) => {
    if (!confirm('Are you sure you want to delete this message?')) return;
    
    try {
      await adminService.deleteMessage(messageId);
      toast.success('Message deleted');
      const data = await adminService.getContactMessages();
      setMessages(data);
    } catch (error) {
      toast.error('Failed to delete message');
    }
  };

  if (loading) {
    return (
      <AdminShell title="Contact Messages" subtitle="Loading...">
        <div className="flex min-h-[400px] items-center justify-center">
          <p className="text-muted-foreground">Loading messages...</p>
        </div>
      </AdminShell>
    );
  }

  return (
    <AdminShell title="Contact Messages" subtitle="Messages submitted via the contact form.">
      <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-soft">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Subject</TableHead>
              <TableHead>Message</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {messages.map((m: any) => (
              <TableRow key={m.id}>
                <TableCell className="font-medium">{m.name}</TableCell>
                <TableCell className="text-sm text-muted-foreground">{m.email}</TableCell>
                <TableCell className="text-sm">{m.subject}</TableCell>
                <TableCell className="max-w-xs truncate text-sm text-muted-foreground">
                  {m.message}
                </TableCell>
                <TableCell>
                  <Badge 
                    className={m.status === "Unread" ? "bg-gradient-primary text-primary-foreground" : ""} 
                    variant={m.status === "Read" ? "outline" : "default"}
                  >
                    {m.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    {m.status === 'Unread' && (
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        onClick={() => handleMarkRead(m.id)}
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                    )}
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      className="text-destructive hover:text-destructive" 
                      onClick={() => handleDelete(m.id)}
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