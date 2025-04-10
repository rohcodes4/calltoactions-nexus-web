
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Lock, Check } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/supabase';

const ChangePassword = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast({
        title: "Error",
        description: "All fields are required",
        variant: "destructive"
      });
      return;
    }
    
    if (newPassword !== confirmPassword) {
      toast({
        title: "Error",
        description: "New passwords do not match",
        variant: "destructive"
      });
      return;
    }
    
    if (newPassword.length < 8) {
      toast({
        title: "Error",
        description: "Password should be at least 8 characters long",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Use Supabase to update the password
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });
      
      if (error) {
        throw error;
      }
      
      // Success
      setSuccess(true);
      
      toast({
        title: "Password updated",
        description: "Your password has been changed successfully.",
      });
      
      // Reset form after 2 seconds
      setTimeout(() => {
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setSuccess(false);
      }, 2000);
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to update password. Please try again.",
        variant: "destructive"
      });
      console.error("Password update error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="glass-card p-6">
      <h2 className="text-xl font-bold text-white mb-4">Change Password</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-sm text-gray-300 block mb-1">Current Password</label>
          <Input 
            type="password" 
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className="bg-white/5 border-white/10 focus:border-agency-purple"
            placeholder="Enter your current password"
          />
        </div>
        
        <div>
          <label className="text-sm text-gray-300 block mb-1">New Password</label>
          <Input 
            type="password" 
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="bg-white/5 border-white/10 focus:border-agency-purple"
            placeholder="Enter new password"
          />
        </div>
        
        <div>
          <label className="text-sm text-gray-300 block mb-1">Confirm New Password</label>
          <Input 
            type="password" 
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="bg-white/5 border-white/10 focus:border-agency-purple"
            placeholder="Confirm new password"
          />
        </div>
        
        <Button 
          type="submit" 
          disabled={isSubmitting || success}
          className={`w-full ${
            success
              ? 'bg-green-600 hover:bg-green-700'
              : 'bg-gradient-to-r from-agency-purple to-agency-blue hover:from-agency-blue hover:to-agency-purple'
          } transition-all`}
        >
          {isSubmitting ? (
            <span className="flex items-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Updating...
            </span>
          ) : success ? (
            <span className="flex items-center justify-center">
              <Check className="mr-2 h-4 w-4" />
              Password Updated
            </span>
          ) : (
            <span className="flex items-center justify-center">
              <Lock className="mr-2 h-4 w-4" />
              Update Password
            </span>
          )}
        </Button>
      </form>
    </Card>
  );
};

export default ChangePassword;
