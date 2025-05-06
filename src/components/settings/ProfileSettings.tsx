
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { ProfileSection } from './ProfileSection';
import { PasswordSection } from './PasswordSection';
import { Card, CardContent } from '@/components/ui/card';

export function ProfileSettings() {
  const { session, updateUserProfile } = useAuth();
  const [profile, setProfile] = useState({
    name: '',
    email: session?.email || '',
    phone: '',
    title: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  // Fetch user profile data on component mount
  useEffect(() => {
    async function fetchProfile() {
      if (!session?.id) return;
      
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('name, phone, title')
          .eq('id', session.id)
          .single();
          
        if (error) throw error;
        
        if (data) {
          setProfile(prev => ({
            ...prev,
            name: data.name || session?.name || '',
            phone: data.phone || '',
            title: data.title || ''
          }));
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchProfile();
  }, [session?.id, session?.name, session?.email]);

  const handleProfileUpdate = async (updatedProfile) => {
    if (!session?.id) return;
    
    try {
      // Update both the Supabase profile and the auth context
      await updateUserProfile({ name: updatedProfile.name });
      
      return { success: true };
    } catch (error) {
      console.error('Error updating profile:', error);
      return { success: false, error };
    }
  };

  if (isLoading) {
    return (
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="text-center py-10">Loading profile data...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-8">
      <Card>
        <CardContent className="p-6">
          <ProfileSection 
            profile={profile} 
            setProfile={setProfile} 
            sessionId={session?.id}
            onProfileUpdate={handleProfileUpdate}
          />
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-6">
          <PasswordSection />
        </CardContent>
      </Card>
    </div>
  );
}
