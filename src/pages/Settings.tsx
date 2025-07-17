
import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { UserManagement } from '@/components/settings/UserManagement';
import { ProfileSettings } from '@/components/settings/ProfileSettings';
import { AppSettings } from '@/components/settings/AppSettings';
import { NotificationSettings } from '@/components/settings/NotificationSettings';
import { CleanSidebar } from '@/components/layout/CleanSidebar';

export default function Settings() {
  const { toast } = useToast();
  const { session } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  
  // Check if current user is admin
  const isAdmin = session?.role === 'admin';

  const handleSaveChanges = () => {
    toast({ 
      title: "Settings saved", 
      description: "Your changes have been saved successfully" 
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <CleanSidebar />
      
      <div className="flex-1 ml-64">
        <div className="p-8">
          <div className="space-y-6 max-w-5xl mx-auto">
            <div className="flex justify-between items-center">
              <h1 className="text-3xl font-bold">Settings</h1>
              <Button 
                onClick={handleSaveChanges}
                className="bg-green-600 hover:bg-green-700"
              >
                Save Changes
              </Button>
            </div>
            
            <Tabs 
              defaultValue="profile" 
              className="space-y-4"
              value={activeTab}
              onValueChange={setActiveTab}
            >
              <TabsList className={`grid w-full max-w-md mx-auto ${isAdmin ? 'grid-cols-4' : 'grid-cols-3'}`}>
                <TabsTrigger value="profile">Profile</TabsTrigger>
                <TabsTrigger value="notifications">Notifications</TabsTrigger>
                <TabsTrigger value="app">Application</TabsTrigger>
                {isAdmin && <TabsTrigger value="users">Users</TabsTrigger>}
              </TabsList>
              
              <TabsContent value="profile" className="space-y-4">
                <ProfileSettings />
              </TabsContent>
              
              <TabsContent value="notifications" className="space-y-4">
                <NotificationSettings />
              </TabsContent>
              
              <TabsContent value="app" className="space-y-4">
                <AppSettings />
              </TabsContent>
              
              {isAdmin && (
                <TabsContent value="users" className="space-y-4">
                  <UserManagement />
                </TabsContent>
              )}
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}
