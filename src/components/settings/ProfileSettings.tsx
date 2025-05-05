
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { ProfileSection } from './ProfileSection';
import { PasswordSection } from './PasswordSection';

export function ProfileSettings() {
  const { session } = useAuth();
  const [profile, setProfile] = useState({
    name: '',
    email: session?.email || '',
    phone: '',
    title: ''
  });

  // Fetch user profile data on component mount
  useEffect(() => {
    async function fetchProfile() {
      if (!session?.id) return;
      
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
      }
    }
    
    fetchProfile();
  }, [session?.id, session?.name, session?.email]);

  return (
    <>
      <ProfileSection 
        profile={profile} 
        setProfile={setProfile} 
        sessionId={session?.id}
      />
      <PasswordSection />
    </>
  );
}
