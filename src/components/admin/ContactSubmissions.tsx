
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trash2, Mail, Check, X } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  date: string;
  read: boolean;
}

const ContactSubmissions = () => {
  const [submissions, setSubmissions] = useState<ContactSubmission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // In a real app, this would come from a database
  useEffect(() => {
    // Simulate API fetch
    setTimeout(() => {
      const mockSubmissions = [
        {
          id: "1",
          name: "John Smith",
          email: "john@example.com",
          subject: "Website Redesign Project",
          message: "I'm interested in discussing a complete website redesign for my company. Can you provide more information about your services and pricing?",
          date: "2023-05-10T14:30:00Z",
          read: true,
        },
        {
          id: "2",
          name: "Sarah Johnson",
          email: "sarah@example.com",
          subject: "Logo Design Inquiry",
          message: "We're a startup looking for a new logo design. I would like to schedule a consultation to discuss our vision and budget.",
          date: "2023-05-12T09:15:00Z",
          read: false,
        },
        {
          id: "3",
          name: "Michael Chen",
          email: "michael@example.com",
          subject: "Video Production Services",
          message: "I need a promotional video for our new product launch in the next two months. Can you share some examples of your previous work in this area?",
          date: "2023-05-13T16:45:00Z",
          read: false,
        }
      ];
      
      setSubmissions(mockSubmissions);
      setIsLoading(false);
    }, 1000);
  }, []);

  const handleMarkAsRead = (id: string) => {
    setSubmissions(submissions.map(item => 
      item.id === id ? { ...item, read: true } : item
    ));
    
    toast({
      title: "Marked as read",
      description: "The submission has been marked as read.",
    });
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this submission?")) {
      setSubmissions(submissions.filter(item => item.id !== id));
      
      toast({
        title: "Submission deleted",
        description: "The submission has been deleted successfully.",
      });
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { 
      dateStyle: 'medium', 
      timeStyle: 'short' 
    }).format(date);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-40">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-agency-purple"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Contact Submissions</h1>
          <p className="text-gray-400">Manage messages from the contact form</p>
        </div>
      </div>

      {submissions.length === 0 ? (
        <Card className="glass-card p-6 text-center">
          <p className="text-gray-400">No contact form submissions yet.</p>
        </Card>
      ) : (
        <div className="space-y-4">
          {submissions.map(submission => (
            <Card 
              key={submission.id} 
              className={`glass-card p-6 overflow-hidden relative ${
                !submission.read ? 'border-agency-purple/30' : ''
              }`}
            >
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-start gap-2">
                    <h3 className="text-xl font-bold text-white">{submission.subject}</h3>
                    {!submission.read && (
                      <Badge variant="outline" className="bg-agency-purple/20 text-agency-purple border-agency-purple/30">
                        New
                      </Badge>
                    )}
                  </div>
                  
                  <div className="flex items-center text-gray-400 text-sm mt-1 mb-3">
                    <span className="mr-2">{submission.name}</span>
                    <span className="mr-2">•</span>
                    <a href={`mailto:${submission.email}`} className="text-agency-purple hover:underline">
                      {submission.email}
                    </a>
                    <span className="mx-2">•</span>
                    <span>{formatDate(submission.date)}</span>
                  </div>
                  
                  <p className="text-gray-300 mb-4 whitespace-pre-line">{submission.message}</p>
                </div>
                
                <div className="flex md:flex-col gap-2">
                  {!submission.read && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="border-green-500/30 text-green-500 hover:bg-green-500/10"
                      onClick={() => handleMarkAsRead(submission.id)}
                    >
                      <Check size={16} className="mr-1" />
                      Mark Read
                    </Button>
                  )}
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="border-agency-purple/30 text-agency-purple hover:bg-agency-purple/10"
                    onClick={() => window.open(`mailto:${submission.email}?subject=Re: ${submission.subject}`, '_blank')}
                  >
                    <Mail size={16} className="mr-1" />
                    Reply
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="text-red-500 hover:text-red-400 border-red-500/30 hover:bg-red-500/10"
                    onClick={() => handleDelete(submission.id)}
                  >
                    <Trash2 size={16} className="mr-1" />
                    Delete
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ContactSubmissions;
