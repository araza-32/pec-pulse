
import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

export default function Settings() {
  const { toast } = useToast();
  const { session } = useAuth();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isAddUserDialogOpen, setIsAddUserDialogOpen] = useState(false);
  const [users, setUsers] = useState<Array<any>>([]);
  const [workbodies, setWorkbodies] = useState<Array<any>>([]);
  const [newUser, setNewUser] = useState({
    email: '',
    password: '',
    name: '',
    role: 'secretary',
    workbodyId: ''
  });

  useEffect(() => {
    // Check for dark mode in localStorage
    const savedTheme = localStorage.getItem('theme');
    setIsDarkMode(savedTheme === 'dark');
    
    // Fetch users and workbodies
    fetchUsers();
    fetchWorkbodies();
  }, []);

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase.from('profiles').select('*');
      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({
        title: 'Error',
        description: 'Failed to load users',
        variant: 'destructive',
      });
    }
  };

  const fetchWorkbodies = async () => {
    try {
      const { data, error } = await supabase.from('workbodies').select('id, name');
      if (error) throw error;
      setWorkbodies(data || []);
    } catch (error) {
      console.error('Error fetching workbodies:', error);
    }
  };

  const handleDarkModeToggle = (checked: boolean) => {
    setIsDarkMode(checked);
    
    if (checked) {
      document.documentElement.classList.add('dark');
      localStorage.theme = 'dark';
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.theme = 'light';
    }
    
    toast({
      title: `${checked ? 'Dark' : 'Light'} mode activated`,
      description: `Interface theme has been updated.`,
    });
  };

  const handleAddUser = async () => {
    try {
      // Create the user in auth
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: newUser.email,
        password: newUser.password,
        email_confirm: true,
      });
      
      if (authError) throw authError;
      
      // Add user details to profiles table
      const { error: profileError } = await supabase.from('profiles').insert({
        id: authData.user.id,
        name: newUser.name,
        role: newUser.role,
        workbody_id: newUser.workbodyId || null
      });
      
      if (profileError) throw profileError;
      
      toast({
        title: 'Success',
        description: 'User has been added successfully',
      });
      
      setIsAddUserDialogOpen(false);
      fetchUsers(); // Refresh the users list
      
      // Reset form
      setNewUser({
        email: '',
        password: '',
        name: '',
        role: 'secretary',
        workbodyId: ''
      });
    } catch (error) {
      console.error('Error adding user:', error);
      toast({
        title: 'Error',
        description: 'Failed to add user',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteUser = async (userId: string) => {
    try {
      // Delete the user from auth
      const { error: authError } = await supabase.auth.admin.deleteUser(userId);
      
      if (authError) throw authError;
      
      // Delete from profiles
      const { error: profileError } = await supabase.from('profiles').delete().eq('id', userId);
      
      if (profileError) throw profileError;
      
      toast({
        title: 'Success',
        description: 'User has been deleted successfully',
      });
      
      fetchUsers(); // Refresh the users list
    } catch (error) {
      console.error('Error deleting user:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete user',
        variant: 'destructive',
      });
    }
  };

  // Check if current user is admin
  const isAdmin = session?.role === 'admin';

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Settings</h1>
      
      <Tabs defaultValue="appearance">
        <TabsList>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
          {isAdmin && <TabsTrigger value="users">User Management</TabsTrigger>}
        </TabsList>
        
        <TabsContent value="appearance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Theme Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Switch 
                  id="dark-mode" 
                  checked={isDarkMode}
                  onCheckedChange={handleDarkModeToggle}
                />
                <Label htmlFor="dark-mode">Dark Mode</Label>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {isAdmin && (
          <TabsContent value="users" className="space-y-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>User Management</CardTitle>
                <Dialog open={isAddUserDialogOpen} onOpenChange={setIsAddUserDialogOpen}>
                  <DialogTrigger asChild>
                    <Button>Add New User</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add New User</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid gap-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input 
                          id="name" 
                          value={newUser.name}
                          onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="email">Email</Label>
                        <Input 
                          id="email" 
                          type="email"
                          value={newUser.email}
                          onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="password">Password</Label>
                        <Input 
                          id="password" 
                          type="password"
                          value={newUser.password}
                          onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="role">Role</Label>
                        <Select 
                          value={newUser.role} 
                          onValueChange={(value) => setNewUser({...newUser, role: value})}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select role" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="admin">Administrator</SelectItem>
                            <SelectItem value="chairman">Chairman</SelectItem>
                            <SelectItem value="secretary">Secretary</SelectItem>
                            <SelectItem value="registrar">Registrar</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      {newUser.role === 'secretary' && (
                        <div className="grid gap-2">
                          <Label htmlFor="workbody">Workbody</Label>
                          <Select 
                            value={newUser.workbodyId} 
                            onValueChange={(value) => setNewUser({...newUser, workbodyId: value})}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select workbody" />
                            </SelectTrigger>
                            <SelectContent>
                              {workbodies.map((workbody) => (
                                <SelectItem key={workbody.id} value={workbody.id}>
                                  {workbody.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      )}
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsAddUserDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleAddUser}>Add User</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>{user.name || 'N/A'}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell className="capitalize">{user.role}</TableCell>
                        <TableCell className="text-right">
                          {user.id !== session?.id && (
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleDeleteUser(user.id)}
                            >
                              Delete
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                    {users.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center py-4">
                          No users found
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}
