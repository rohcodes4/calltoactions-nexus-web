import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Save, Globe, Mail, MapPin, Phone, Edit } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase, GeneralSettings, SocialLinks } from '@/lib/supabase';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

const AdminSettings = () => {
  const [generalSettings, setGeneralSettings] = useState<GeneralSettings>({
    id: '',
    siteTitle: "CallToActions",
    siteTagline: "We Create Digital Experiences That Convert",
    adminEmail: "rohitparakh4@gmail.com",
    phoneNumber: "+1 (555) 123-4567",
    address: "123 Creative St, Digital City, 90210"
  });
  
  const [socialLinks, setSocialLinks] = useState<SocialLinks>({
    id: '',
    facebook: "https://facebook.com",
    twitter: "https://twitter.com",
    instagram: "https://instagram.com",
    linkedin: "https://linkedin.com",
    youtube: ""
  });
  
  const [isEditingGeneral, setIsEditingGeneral] = useState(false);
  const [isEditingSocial, setIsEditingSocial] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: settingsData, isLoading: isLoadingSettings } = useQuery({
    queryKey: ['generalSettings'],
    queryFn: async () => {
      console.log('Fetching general settings...');
      const { data, error } = await supabase
        .from('general_settings')
        .select('*')
        .single();
      
      if (error) {
        console.error('Error fetching general settings:', error);
        throw error;
      }
      
      console.log('General settings fetched:', data);
      return data as GeneralSettings;
    }
  });

  const { data: socialData, isLoading: isLoadingSocial } = useQuery({
    queryKey: ['socialLinks'],
    queryFn: async () => {
      console.log('Fetching social links...');
      const { data, error } = await supabase
        .from('social_links')
        .select('*')
        .single();
      
      if (error) {
        console.error('Error fetching social links:', error);
        throw error;
      }
      
      console.log('Social links fetched:', data);
      return data as SocialLinks;
    }
  });

  useEffect(() => {
    if (settingsData) {
      setGeneralSettings(settingsData);
    }
  }, [settingsData]);

  useEffect(() => {
    if (socialData) {
      setSocialLinks(socialData);
    }
  }, [socialData]);

  const saveGeneralMutation = useMutation({
    mutationFn: async (settings: GeneralSettings) => {
      console.log('Saving general settings:', settings);
      const { data, error } = await supabase
        .from('general_settings')
        .update({
          siteTitle: settings.siteTitle,
          siteTagline: settings.siteTagline,
          adminEmail: settings.adminEmail,
          phoneNumber: settings.phoneNumber,
          address: settings.address,
          updated_at: new Date().toISOString()
        })
        .eq('id', settings.id)
        .select();
      
      if (error) {
        console.error('Error saving general settings:', error);
        throw error;
      }
      
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['generalSettings'] });
      toast({
        title: "Settings Saved",
        description: "General settings have been updated successfully."
      });
      setIsEditingGeneral(false);
    },
    onError: (error) => {
      console.error('Mutation error:', error);
      toast({
        title: "Error",
        description: "Failed to save settings. Please try again.",
        variant: "destructive"
      });
    }
  });

  const saveSocialMutation = useMutation({
    mutationFn: async (links: SocialLinks) => {
      console.log('Saving social links:', links);
      const { data, error } = await supabase
        .from('social_links')
        .update({
          facebook: links.facebook,
          twitter: links.twitter,
          instagram: links.instagram,
          linkedin: links.linkedin,
          youtube: links.youtube,
          updated_at: new Date().toISOString()
        })
        .eq('id', links.id)
        .select();
      
      if (error) {
        console.error('Error saving social links:', error);
        throw error;
      }
      
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['socialLinks'] });
      toast({
        title: "Settings Saved",
        description: "Social media links have been updated successfully."
      });
      setIsEditingSocial(false);
    },
    onError: (error) => {
      console.error('Mutation error:', error);
      toast({
        title: "Error",
        description: "Failed to save social links. Please try again.",
        variant: "destructive"
      });
    }
  });

  const handleSaveGeneral = () => {
    if (!generalSettings.id) {
      console.error('Cannot save settings: No ID found');
      toast({
        title: "Error",
        description: "Settings not properly loaded. Please refresh and try again.",
        variant: "destructive"
      });
      return;
    }
    
    saveGeneralMutation.mutate(generalSettings);
  };

  const handleSaveSocial = () => {
    if (!socialLinks.id) {
      console.error('Cannot save social links: No ID found');
      toast({
        title: "Error",
        description: "Social links not properly loaded. Please refresh and try again.",
        variant: "destructive"
      });
      return;
    }
    
    saveSocialMutation.mutate(socialLinks);
  };

  if (isLoadingSettings || isLoadingSocial) {
    return <div className="flex justify-center py-10">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-agency-purple"></div>
    </div>;
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Site Settings</h1>
        <p className="text-gray-400">Manage your website's general settings and configuration</p>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="glass-card">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="social">Social Media</TabsTrigger>
        </TabsList>
        
        <TabsContent value="general">
          <Card className="glass-card p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-white">General Information</h2>
              <Button 
                variant="outline"
                onClick={() => setIsEditingGeneral(!isEditingGeneral)}
              >
                <Edit size={16} className="mr-2" />
                {isEditingGeneral ? "Cancel" : "Edit"}
              </Button>
            </div>
            
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm text-gray-300 block mb-1">Site Title</label>
                  {isEditingGeneral ? (
                    <input 
                      type="text" 
                      value={generalSettings.siteTitle}
                      onChange={e => setGeneralSettings({...generalSettings, siteTitle: e.target.value})}
                      className="w-full p-2 rounded bg-white/10 border border-white/20 text-white"
                    />
                  ) : (
                    <p className="text-white p-2 bg-white/5 rounded">{generalSettings.siteTitle}</p>
                  )}
                </div>
                
                <div>
                  <label className="text-sm text-gray-300 block mb-1">Site Tagline</label>
                  {isEditingGeneral ? (
                    <input 
                      type="text" 
                      value={generalSettings.siteTagline}
                      onChange={e => setGeneralSettings({...generalSettings, siteTagline: e.target.value})}
                      className="w-full p-2 rounded bg-white/10 border border-white/20 text-white"
                    />
                  ) : (
                    <p className="text-white p-2 bg-white/5 rounded">{generalSettings.siteTagline}</p>
                  )}
                </div>
              </div>
              
              <div>
                <label className="text-sm text-gray-300 block mb-1">
                  <div className="flex items-center">
                    <Mail size={16} className="mr-2" />
                    Admin Email
                  </div>
                </label>
                {isEditingGeneral ? (
                  <input 
                    type="email" 
                    value={generalSettings.adminEmail}
                    onChange={e => setGeneralSettings({...generalSettings, adminEmail: e.target.value})}
                    className="w-full p-2 rounded bg-white/10 border border-white/20 text-white"
                  />
                ) : (
                  <p className="text-white p-2 bg-white/5 rounded">{generalSettings.adminEmail}</p>
                )}
              </div>
              
              <div>
                <label className="text-sm text-gray-300 block mb-1">
                  <div className="flex items-center">
                    <Phone size={16} className="mr-2" />
                    Phone Number
                  </div>
                </label>
                {isEditingGeneral ? (
                  <input 
                    type="text" 
                    value={generalSettings.phoneNumber}
                    onChange={e => setGeneralSettings({...generalSettings, phoneNumber: e.target.value})}
                    className="w-full p-2 rounded bg-white/10 border border-white/20 text-white"
                  />
                ) : (
                  <p className="text-white p-2 bg-white/5 rounded">{generalSettings.phoneNumber}</p>
                )}
              </div>
              
              <div>
                <label className="text-sm text-gray-300 block mb-1">
                  <div className="flex items-center">
                    <MapPin size={16} className="mr-2" />
                    Address
                  </div>
                </label>
                {isEditingGeneral ? (
                  <textarea 
                    value={generalSettings.address}
                    onChange={e => setGeneralSettings({...generalSettings, address: e.target.value})}
                    className="w-full p-2 rounded bg-white/10 border border-white/20 text-white"
                    rows={2}
                  />
                ) : (
                  <p className="text-white p-2 bg-white/5 rounded">{generalSettings.address}</p>
                )}
              </div>
              
              {isEditingGeneral && (
                <div className="flex justify-end">
                  <Button 
                    onClick={handleSaveGeneral}
                    className="bg-gradient-to-r from-agency-purple to-agency-blue hover:from-agency-blue hover:to-agency-purple"
                    disabled={saveGeneralMutation.isPending}
                  >
                    {saveGeneralMutation.isPending ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                    ) : (
                      <Save size={16} className="mr-2" />
                    )}
                    Save Changes
                  </Button>
                </div>
              )}
            </div>
          </Card>
        </TabsContent>
        
        <TabsContent value="social">
          <Card className="glass-card p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-white">Social Media Links</h2>
              <Button 
                variant="outline"
                onClick={() => setIsEditingSocial(!isEditingSocial)}
              >
                <Edit size={16} className="mr-2" />
                {isEditingSocial ? "Cancel" : "Edit"}
              </Button>
            </div>
            
            <div className="space-y-4">
              {[
                { name: "Facebook", key: "facebook", icon: <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg> },
                { name: "Twitter", key: "twitter", icon: <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path></svg> },
                { name: "Instagram", key: "instagram", icon: <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg> },
                { name: "LinkedIn", key: "linkedin", icon: <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg> },
                { name: "YouTube", key: "youtube", icon: <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon></svg> }
              ].map((social) => (
                <div key={social.key}>
                  <label className="text-sm text-gray-300 block mb-1">
                    <div className="flex items-center">
                      {social.icon}
                      {social.name}
                    </div>
                  </label>
                  {isEditingSocial ? (
                    <input 
                      type="text" 
                      value={(socialLinks as any)[social.key]}
                      onChange={e => setSocialLinks({...socialLinks, [social.key]: e.target.value})}
                      className="w-full p-2 rounded bg-white/10 border border-white/20 text-white"
                      placeholder={`https://${social.key}.com/yourhandle`}
                    />
                  ) : (
                    <div className="flex items-center p-2 bg-white/5 rounded">
                      <p className="text-white truncate flex-1">
                        {(socialLinks as any)[social.key] || "Not set"}
                      </p>
                      {(socialLinks as any)[social.key] && (
                        <a 
                          href={(socialLinks as any)[social.key]} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-agency-purple hover:text-agency-blue ml-2"
                        >
                          <Globe size={16} />
                        </a>
                      )}
                    </div>
                  )}
                </div>
              ))}
              
              {isEditingSocial && (
                <div className="flex justify-end mt-6">
                  <Button 
                    onClick={handleSaveSocial}
                    className="bg-gradient-to-r from-agency-purple to-agency-blue hover:from-agency-blue hover:to-agency-purple"
                    disabled={saveSocialMutation.isPending}
                  >
                    {saveSocialMutation.isPending ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                    ) : (
                      <Save size={16} className="mr-2" />
                    )}
                    Save Changes
                  </Button>
                </div>
              )}
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminSettings;
