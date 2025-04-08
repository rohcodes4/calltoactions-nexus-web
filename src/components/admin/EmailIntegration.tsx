
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { Check, Loader2 } from 'lucide-react';

type IntegrationProvider = 'klaviyo' | 'mailchimp' | 'sendgrid' | 'none';

interface EmailIntegrationProps {
  onConnect: (provider: IntegrationProvider, apiKey: string) => void;
}

const EmailIntegration = ({ onConnect }: EmailIntegrationProps) => {
  const [selectedProvider, setSelectedProvider] = useState<IntegrationProvider>('none');
  const [apiKey, setApiKey] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);
  const { toast } = useToast();

  const handleConnect = async () => {
    if (!apiKey) {
      toast({
        title: 'Error',
        description: 'Please enter an API key',
        variant: 'destructive',
      });
      return;
    }

    setIsConnecting(true);
    
    try {
      // In a real application, you would validate the API key with the provider
      // For now, we'll just simulate a connection
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      onConnect(selectedProvider, apiKey);
      
      toast({
        title: 'Success',
        description: `Connected to ${selectedProvider} successfully`,
      });
    } catch (error) {
      console.error('Error connecting to provider:', error);
      toast({
        title: 'Error',
        description: 'Failed to connect to provider. Please check your API key and try again.',
        variant: 'destructive',
      });
    } finally {
      setIsConnecting(false);
    }
  };

  const providerOptions = [
    { value: 'klaviyo', label: 'Klaviyo' },
    { value: 'mailchimp', label: 'Mailchimp' },
    { value: 'sendgrid', label: 'SendGrid' },
  ];

  return (
    <Card className="glass-card p-6">
      <h2 className="text-xl font-bold text-white mb-4">Email Marketing Integration</h2>
      <p className="text-gray-300 mb-6">Connect your newsletter subscribers to your favorite email marketing platform.</p>
      
      <div className="mb-6">
        <label className="text-sm text-gray-300 block mb-2">Select Provider</label>
        <div className="grid grid-cols-3 gap-2">
          {providerOptions.map(option => (
            <Button
              key={option.value}
              variant={selectedProvider === option.value ? "default" : "outline"}
              className={selectedProvider === option.value ? 
                "bg-gradient-to-r from-agency-purple to-agency-blue hover:from-agency-blue hover:to-agency-purple" : 
                "text-white hover:text-white hover:bg-white/10"
              }
              onClick={() => setSelectedProvider(option.value as IntegrationProvider)}
            >
              {option.label}
            </Button>
          ))}
        </div>
      </div>
      
      {selectedProvider !== 'none' && (
        <div className="space-y-4">
          <div>
            <label className="text-sm text-gray-300 block mb-2">API Key</label>
            <Input
              type="text"
              placeholder={`Enter your ${selectedProvider} API key`}
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="w-full bg-white/10 border border-white/20 text-white"
            />
          </div>
          
          <Button
            onClick={handleConnect}
            className="bg-gradient-to-r from-agency-purple to-agency-blue hover:from-agency-blue hover:to-agency-purple"
            disabled={isConnecting}
          >
            {isConnecting ? (
              <>
                <Loader2 size={16} className="mr-2 animate-spin" />
                Connecting...
              </>
            ) : (
              <>
                <Check size={16} className="mr-2" />
                Connect
              </>
            )}
          </Button>
        </div>
      )}
    </Card>
  );
};

export default EmailIntegration;
