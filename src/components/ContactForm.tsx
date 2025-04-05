
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { ArrowRight, CheckCircle } from 'lucide-react';

interface ContactFormProps {
  className?: string;
  variant?: 'default' | 'footer';
}

const ContactForm = ({ className = '', variant = 'default' }: ContactFormProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // This is a placeholder for the actual form submission logic
      // In a real implementation, you would send this data to a backend API
      // For now, we'll simulate a successful submission
      
      console.log('Form submitted to rohitparakh4@gmail.com:', formData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Message sent!",
        description: "We'll get back to you as soon as possible.",
        variant: "default",
      });
      
      setSubmitted(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
      
      // Reset submission status after 3 seconds
      setTimeout(() => {
        setSubmitted(false);
      }, 3000);
    } catch (error) {
      console.error('Error submitting form:', error);
      toast({
        title: "Submission failed",
        description: "There was an error sending your message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFooter = variant === 'footer';

  return (
    <div className={`${className} ${isFooter ? 'text-white' : ''}`}>
      {!isFooter && (
        <div className="mb-6">
          <h3 className="text-2xl font-bold mb-2 text-gradient">Get in Touch</h3>
          <p className="text-gray-400">Have a project in mind? Let's discuss how we can help.</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className={`grid ${isFooter ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2'} gap-4`}>
          <div>
            <Input
              name="name"
              placeholder="Your Name"
              value={formData.name}
              onChange={handleChange}
              required
              className={`${isFooter ? 'bg-white/5 border-white/10' : 'bg-agency-darker border-agency-purple/20'} focus:border-agency-purple`}
            />
          </div>
          <div>
            <Input
              name="email"
              type="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              required
              className={`${isFooter ? 'bg-white/5 border-white/10' : 'bg-agency-darker border-agency-purple/20'} focus:border-agency-purple`}
            />
          </div>
        </div>
        <div>
          <Input
            name="subject"
            placeholder="Subject"
            value={formData.subject}
            onChange={handleChange}
            required
            className={`${isFooter ? 'bg-white/5 border-white/10' : 'bg-agency-darker border-agency-purple/20'} focus:border-agency-purple`}
          />
        </div>
        <div>
          <Textarea
            name="message"
            placeholder="Your Message"
            value={formData.message}
            onChange={handleChange}
            required
            className={`${isFooter ? 'bg-white/5 border-white/10' : 'bg-agency-darker border-agency-purple/20'} focus:border-agency-purple min-h-[100px]`}
          />
        </div>
        <Button
          type="submit"
          disabled={isSubmitting || submitted}
          className={`w-full ${
            submitted
              ? 'bg-green-600 hover:bg-green-700'
              : 'bg-gradient-to-r from-agency-purple to-agency-blue hover:from-agency-blue hover:to-agency-purple'
          } transition-all duration-300`}
        >
          {isSubmitting ? (
            <span className="flex items-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Sending...
            </span>
          ) : submitted ? (
            <span className="flex items-center justify-center">
              <CheckCircle className="mr-2 h-4 w-4" />
              Message Sent!
            </span>
          ) : (
            <span className="flex items-center justify-center">
              Send Message
              <ArrowRight className="ml-2 h-4 w-4" />
            </span>
          )}
        </Button>
      </form>
    </div>
  );
};

export default ContactForm;
