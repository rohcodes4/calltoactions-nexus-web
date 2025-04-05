
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Mail, Calendar, CheckCircle, XCircle } from 'lucide-react';
import { fetchContactMessages, markMessageAsRead } from '@/services/databaseService';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import { ContactMessage } from '@/lib/supabase';

const ContactSubmissions = () => {
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const queryClient = useQueryClient();

  // Fetch messages from database
  const { data: messages = [], isLoading, error } = useQuery({
    queryKey: ['contactMessages'],
    queryFn: fetchContactMessages
  });

  // Mark message as read mutation
  const markAsReadMutation = useMutation({
    mutationFn: markMessageAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contactMessages'] });
    }
  });

  const handleViewMessage = (message: ContactMessage) => {
    setSelectedMessage(message);
    
    // Mark as read if it's unread
    if (!message.isRead) {
      markAsReadMutation.mutate(message.id);
    }
  };

  if (isLoading) {
    return <div className="flex justify-center py-10">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-agency-purple"></div>
    </div>;
  }

  if (error) {
    return <div className="text-red-500 p-4">
      Error loading messages. Please try again later.
    </div>;
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Contact Submissions</h1>
        <p className="text-gray-400">View and manage messages from your website's contact form</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Messages list */}
        <div className="lg:col-span-1 glass-card p-4 rounded-lg max-h-[70vh] overflow-y-auto">
          <h2 className="text-xl font-semibold text-white mb-4">Messages ({messages.length})</h2>
          
          {messages.length === 0 ? (
            <p className="text-gray-400 text-center py-8">No messages yet.</p>
          ) : (
            <div className="space-y-2">
              {messages.map(message => (
                <div 
                  key={message.id}
                  className={`p-3 rounded-lg cursor-pointer transition-colors ${
                    selectedMessage?.id === message.id 
                      ? 'bg-agency-purple/20' 
                      : message.isRead 
                        ? 'hover:bg-white/5' 
                        : 'bg-agency-purple/10 hover:bg-agency-purple/15'
                  }`}
                  onClick={() => handleViewMessage(message)}
                >
                  <div className="flex justify-between items-start mb-1">
                    <span className="font-medium text-white">{message.name}</span>
                    {!message.isRead && (
                      <span className="bg-agency-purple text-white text-xs px-2 py-0.5 rounded-full">New</span>
                    )}
                  </div>
                  <div className="text-sm text-gray-400 mb-1">{message.email}</div>
                  <div className="text-xs text-gray-500 flex items-center">
                    <Calendar size={12} className="mr-1" />
                    {format(new Date(message.created_at), 'MMM d, yyyy')}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Message detail */}
        <div className="lg:col-span-2">
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
                
                <div className="flex items-center">
                  {selectedMessage.isRead ? (
                    <span className="flex items-center text-gray-400 text-sm">
                      <CheckCircle size={14} className="mr-1" />
                      Read
                    </span>
                  ) : (
                    <span className="flex items-center text-agency-purple text-sm">
                      <XCircle size={14} className="mr-1" />
                      Unread
                    </span>
                  )}
                </div>
              </div>
              
              <div className="bg-white/5 p-4 rounded-lg">
                <p className="text-gray-300 whitespace-pre-line">{selectedMessage.message}</p>
              </div>
              
              <div className="mt-6 flex justify-end">
                <Button 
                  variant="outline" 
                  onClick={() => window.location.href = `mailto:${selectedMessage.email}?subject=Re: Your Message to CallToActions`}
                >
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
