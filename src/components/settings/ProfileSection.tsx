
import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

interface ProfileData {
  name: string;
  email: string;
  phone: string;
  title: string;
}

interface ProfileSectionProps {
  profile: ProfileData;
  setProfile: React.Dispatch<React.SetStateAction<ProfileData>>;
  sessionId?: string;
  onProfileUpdate?: (profile: ProfileData) => Promise<{ success: boolean, error?: any }>;
}

export function ProfileSection({ profile, setProfile, sessionId, onProfileUpdate }: ProfileSectionProps) {
  const { toast } = useToast();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const handleProfileUpdate = async () => {
    if (!sessionId) return;
    
    setIsLoading(true);
    
    try {
      // First, try to use the custom update handler if provided
      if (onProfileUpdate) {
        const result = await onProfileUpdate(profile);
        if (!result.success) throw result.error || new Error('Failed to update profile');
      }
      
      // Then update the Supabase profile
      const { error } = await supabase
        .from('profiles')
        .update({ 
          name: profile.name,
          phone: profile.phone,
          title: profile.title 
        })
        .eq('id', sessionId);
      
      if (error) throw error;
      
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully",
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Update failed",
        description: "There was an error updating your profile",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-center">Profile</CardTitle>
        <CardDescription className="text-center">
          Manage your personal information
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
          <div className="mb-6 flex flex-col items-center space-y-2">
            <Avatar className="h-24 w-24">
              {/* Try to use user's name for avatar if available */}
              <AvatarFallback className="text-2xl bg-primary text-primary-foreground">
                {profile.name?.charAt(0) || profile.email?.charAt(0) || 'U'}
              </AvatarFallback>
            </Avatar>
            <Button variant="outline" size="sm">
              Change Avatar
            </Button>
          </div>
          
          <div className="flex-1 space-y-4 w-full max-w-md mx-auto">
            <div className="grid gap-2">
              <Label htmlFor="name">Full Name</Label>
              <Input 
                id="name" 
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                value={profile.email} 
                disabled
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input 
                id="phone" 
                value={profile.phone}
                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="title">Job Title</Label>
              <Input 
                id="title" 
                value={profile.title}
                onChange={(e) => setProfile({ ...profile, title: e.target.value })}
              />
            </div>
            
            <Button 
              onClick={handleProfileUpdate}
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
