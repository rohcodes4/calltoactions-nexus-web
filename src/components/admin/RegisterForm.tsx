
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/supabase';
import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage 
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from '@/components/ui/select';

const registerSchema = z.object({
  fullName: z.string().min(3, { message: 'Full name must be at least 3 characters' }),
  email: z.string().email({ message: 'Please enter a valid email address' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
  confirmPassword: z.string(),
  role: z.enum(['admin', 'editor', 'viewer']).default('editor'),
  status: z.enum(['active', 'inactive']).default('active')
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type RegisterValues = z.infer<typeof registerSchema>;

const RegisterForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const { toast } = useToast();

  // Check if current user is admin
  useEffect(() => {
    const checkAdminStatus = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase
          .from('users')
          .select('role')
          .eq('id', user.id)
          .single();
        
        if (data && data.role === 'admin') {
          setIsAdmin(true);
        }
      }
    };
    
    checkAdminStatus();
  }, []);

  const form = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
      role: 'editor',
      status: 'active'
    },
  });

  const onSubmit = async (data: RegisterValues) => {
    if (!isAdmin) {
      toast({
        title: "Authorization Error",
        description: "Only administrators can register new users",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    try {
      // Register the user with Supabase
      const { error: signUpError, data: signUpData } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            full_name: data.fullName,
          },
        },
      });
      
      if (signUpError) {
        throw signUpError;
      }

      if (signUpData.user) {
        // Update user role and status in the users table
        const { error: updateError } = await supabase
          .from('users')
          .update({
            role: data.role,
            status: data.status
          })
          .eq('id', signUpData.user.id);
        
        if (updateError) {
          throw updateError;
        }
        
        toast({
          title: "Registration successful",
          description: "New user has been registered successfully",
        });
        form.reset();
      }
    } catch (error) {
      console.error("Registration error:", error);
      toast({
        title: "Registration error",
        description: error.message || "An unexpected error occurred during registration",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!isAdmin) {
    return (
      <Card className="glass-card p-8 max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-white mb-2">Unauthorized</h1>
          <p className="text-gray-400">Only administrators can register new users</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="glass-card p-8 max-w-md w-full">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-white mb-2">Create an Account</h1>
        <p className="text-gray-400">Register a new user for the admin dashboard</p>
      </div>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="fullName"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-300">Full Name</FormLabel>
                <FormControl>
                  <Input 
                    {...field} 
                    className="bg-white/10 border border-white/20 text-white"
                  />
                </FormControl>
                <FormMessage className="text-red-400" />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-300">Email</FormLabel>
                <FormControl>
                  <Input 
                    {...field} 
                    type="email" 
                    className="bg-white/10 border border-white/20 text-white"
                  />
                </FormControl>
                <FormMessage className="text-red-400" />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-300">Password</FormLabel>
                <FormControl>
                  <Input 
                    {...field} 
                    type="password" 
                    className="bg-white/10 border border-white/20 text-white"
                  />
                </FormControl>
                <FormMessage className="text-red-400" />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-300">Confirm Password</FormLabel>
                <FormControl>
                  <Input 
                    {...field} 
                    type="password" 
                    className="bg-white/10 border border-white/20 text-white"
                  />
                </FormControl>
                <FormMessage className="text-red-400" />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-300">Role</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="bg-white/10 border border-white/20 text-white">
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="bg-agency-dark border border-white/20">
                    <SelectItem value="admin" className="text-white">Admin</SelectItem>
                    <SelectItem value="editor" className="text-white">Editor</SelectItem>
                    <SelectItem value="viewer" className="text-white">Viewer</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage className="text-red-400" />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-300">Status</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="bg-white/10 border border-white/20 text-white">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="bg-agency-dark border border-white/20">
                    <SelectItem value="active" className="text-white">Active</SelectItem>
                    <SelectItem value="inactive" className="text-white">Inactive</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage className="text-red-400" />
              </FormItem>
            )}
          />
          
          <Button 
            type="submit"
            className="w-full bg-gradient-to-r from-agency-purple to-agency-blue hover:from-agency-blue hover:to-agency-purple"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
            ) : (
              "Register User"
            )}
          </Button>
        </form>
      </Form>
    </Card>
  );
};

export default RegisterForm;
