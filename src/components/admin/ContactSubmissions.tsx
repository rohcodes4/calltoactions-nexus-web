
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Mail, Calendar, CheckCircle, XCircle, User, RefreshCw } from 'lucide-react';
import { fetchContactMessages, updateContactMessage, markMessageAsRead, markMessageAsUnread } from '@/services/databaseService';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import { ContactMessage } from '@/lib/supabase';
import { useToast } from '@/components/ui/use-toast';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const ContactSubmissions = () => {
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Fetch messages from database
  const { data: messages = [], isLoading, error } = useQuery({
    queryKey: ['contactMessages'],
    queryFn: fetchContactMessages
  });

  // Update message mutation
  const updateMessageMutation = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<ContactMessage> }) => 
      updateContactMessage(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contactMessages'] });
      toast({
        title: 'Success',
        description: 'Message status updated',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: 'Failed to update message status',
        variant: 'destructive',
      });
      console.error('Error updating message:', error);
    }
  });

  const handleStatusChange = (status: string) => {
    if (!selectedMessage) return;
    
    updateMessageMutation.mutate({ 
      id: selectedMessage.id, 
      updates: { 
        status,
        isRead: status !== 'unread'
      } 
    });
  };

  const handleViewMessage = (message: ContactMessage) => {
    setSelectedMessage(message);
    
    // Mark as read if it's unread
    if (!message.isRead) {
      markMessageAsRead(message.id);
    }
  };
  
  const toggleReadStatus = (message: ContactMessage) => {
    if (message.isRead) {
      markMessageAsUnread(message.id);
    } else {
      markMessageAsRead(message.id);
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch(status) {
      case 'read': return 'bg-green-500/20 text-green-400';
      case 'unread': return 'bg-blue-500/20 text-blue-400';
      case 'archived': return 'bg-gray-500/20 text-gray-400';
      case 'spam': return 'bg-red-500/20 text-red-400';
      case 'important': return 'bg-yellow-500/20 text-yellow-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  // For debugging
  console.log('Messages:', messages);

  if (isLoading) {
    return (
      <div className="flex justify-center py-10">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-agency-purple"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 p-4">
        Error loading messages. Please try again later.
        {error instanceof Error && <div className="text-sm mt-2">{error.message}</div>}
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Contact Submissions</h1>
        <p className="text-gray-400">View and manage messages from your website's contact form</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Messages table */}
        <div className="lg:col-span-3">
          <Card className="glass-card p-4 rounded-lg overflow-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-white">Messages ({messages.length})</h2>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => queryClient.invalidateQueries({ queryKey: ['contactMessages'] })}
              >
                <RefreshCw size={16} className="mr-2" />
                Refresh
              </Button>
            </div>
            
            {messages.length === 0 ? (
              <p className="text-gray-400 text-center py-8">No messages yet.</p>
            ) : (
              <div className="rounded-md border border-white/10 overflow-hidden">
                <Table>
                  <TableHeader className="bg-white/5">
                    <TableRow className="hover:bg-white/5 border-white/10">
                      <TableHead className="text-white">Status</TableHead>
                      <TableHead className="text-white">Sender</TableHead>
                      <TableHead className="text-white">Message</TableHead>
                      <TableHead className="text-white">Date</TableHead>
                      <TableHead className="text-white text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {messages.map(message => (
                      <TableRow 
                        key={message.id} 
                        className={`hover:bg-white/5 border-white/10 cursor-pointer ${selectedMessage?.id === message.id ? 'bg-agency-purple/10' : ''}`}
                        onClick={() => handleViewMessage(message)}
                      >
                        <TableCell>
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${getStatusBadgeColor(message.status || 'unread')}`}>
                            {message.status || 'unread'}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="font-medium text-white">{message.name}</div>
                          <div className="text-sm text-gray-400">{message.email}</div>
                        </TableCell>
                        <TableCell>
                          <div className="truncate max-w-[200px] text-gray-300">
                            {message.message}
                          </div>
                        </TableCell>
                        <TableCell className="text-gray-400 text-sm">
                          {format(new Date(message.created_at), 'MMM d, yyyy')}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleReadStatus(message);
                              queryClient.invalidateQueries({ queryKey: ['contactMessages'] });
                            }}
                            title={message.isRead ? "Mark as unread" : "Mark as read"}
                          >
                            {message.isRead ? 
                              <XCircle size={16} className="text-gray-400" /> : 
                              <CheckCircle size={16} className="text-agency-purple" />
                            }
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </Card>
        </div>

        {/* Message detail */}
        <div className="lg:col-span-3">
          {selectedMessage ? (
            <Card className="glass-card p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-xl font-bold text-white">{selectedMessage.name}</h3>
                  <div className="flex items-center text-gray-400">
                    <Mail size={14} className="mr-2" />
                    <a href={`mailto:${selectedMessage.email}`} className="hover:text-agency-purple transition-colors">
                      {selectedMessage.email}
                    </a>
                  </div>
                  <div className="text-sm text-gray-500 mt-1">
                    Received on {format(new Date(selectedMessage.created_at), 'MMMM d, yyyy, h:mm a')}
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Select 
                    value={selectedMessage.status || 'unread'} 
                    onValueChange={handleStatusChange}
                  >
                    <SelectTrigger className="w-[130px] bg-white/10 border-white/20 text-white">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent className="bg-agency-darker border-white/20">
                      <SelectItem value="unread">Unread</SelectItem>
                      <SelectItem value="read">Read</SelectItem>
                      <SelectItem value="important">Important</SelectItem>
                      <SelectItem value="archived">Archived</SelectItem>
                      <SelectItem value="spam">Spam</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="bg-white/5 p-4 rounded-lg">
                <p className="text-gray-300 whitespace-pre-line">{selectedMessage.message}</p>
              </div>
              
              <div className="mt-6 flex justify-end space-x-2">
                <Button 
                  variant="outline" 
                  onClick={() => markMessageAsUnread(selectedMessage.id)}
                >
                  <XCircle size={16} className="mr-2" />
                  Mark as Unread
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => window.location.href = `mailto:${selectedMessage.email}?subject=Re: Your Message to Rohcodes`}
                >
                  <Mail size={16} className="mr-2" />
                  Reply via Email
                </Button>
              </div>
            </Card>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center p-10 bg-white/5 rounded-lg">
              <Mail size={48} className="text-gray-500 mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">No Message Selected</h3>
              <p className="text-gray-400">
                Select a message from the list to view its contents.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContactSubmissions;
