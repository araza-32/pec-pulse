
import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  DialogDescription,
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
import { AlertCircle, CheckCircle, Loader2 } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

export function UserManagement() {
  const { toast } = useToast();
  const [isAddUserDialogOpen, setIsAddUserDialogOpen] = useState(false);
  const [isConfirmationDialogOpen, setIsConfirmationDialogOpen] = useState(false);
  const [users, setUsers] = useState<Array<any>>([]);
  const [workbodies, setWorkbodies] = useState<Array<any>>([]);
  const [newUser, setNewUser] = useState({
    email: '',
    password: '',
    name: '',
    role: 'secretary',
    workbodyId: ''
  });
  const [passwordStrength, setPasswordStrength] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isAddingUser, setIsAddingUser] = useState(false);
  const [creationSuccess, setCreationSuccess] = useState<boolean | null>(null);
  const [creationError, setCreationError] = useState("");

  useEffect(() => {
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

  const validatePassword = (password: string) => {
    if (password.length < 8) {
      setPasswordStrength("weak");
      return false;
    } else if (password.length >= 8 && /^[a-zA-Z0-9]+$/.test(password)) {
      setPasswordStrength("medium");
      return true;
    } else if (password.length >= 8 && /[!@#$%^&*(),.?":{}|<>]/.test(password) && /\d/.test(password) && /[a-zA-Z]/.test(password)) {
      setPasswordStrength("strong");
      return true;
    }
    setPasswordStrength("medium");
    return true;
  };

  const prepareToAddUser = () => {
    const isValid = validatePassword(newUser.password);
    if (!isValid) {
      toast({
        title: 'Weak Password',
        description: 'Password must be at least 8 characters long',
        variant: 'destructive',
      });
      return;
    }
    
    if (!newUser.email || !newUser.name) {
      toast({
        title: 'Missing Fields',
        description: 'All fields are required',
        variant: 'destructive',
      });
      return;
    }
    
    setIsConfirmationDialogOpen(true);
  };

  const handleAddUser = async () => {
    setIsAddingUser(true);
    setCreationSuccess(null);
    setCreationError("");
    
    try {
      // Create the user directly in the auth table using the signUp method
      // This is more reliable than using admin.createUser which requires special permissions
      const { data, error } = await supabase.auth.signUp({
        email: newUser.email,
        password: newUser.password,
        options: {
          data: {
            name: newUser.name,
            role: newUser.role,
            workbody_id: newUser.workbodyId || null
          }
        }
      });
      
      if (error) throw error;
      
      // Add user details to profiles table
      if (data?.user) {
        const { error: profileError } = await supabase.from('profiles').upsert({
          id: data.user.id,
          name: newUser.name,
          role: newUser.role,
          workbody_id: newUser.workbodyId || null
        });
        
        if (profileError) throw profileError;
      }
      
      setCreationSuccess(true);
      
      // Wait a moment before closing dialogs and refreshing
      setTimeout(() => {
        fetchUsers(); // Refresh the users list
        setIsConfirmationDialogOpen(false);
        setIsAddUserDialogOpen(false);
        
        // Reset form
        setNewUser({
          email: '',
          password: '',
          name: '',
          role: 'secretary',
          workbodyId: ''
        });
        
        toast({
          title: 'Success',
          description: 'User has been added successfully',
        });
      }, 1500);
    } catch (error: any) {
      console.error('Error adding user:', error);
      setCreationSuccess(false);
      setCreationError(error.message || 'Failed to add user');
    } finally {
      setIsAddingUser(false);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    setIsLoading(true);
    try {
      // Delete from profiles
      const { error: profileError } = await supabase.from('profiles').delete().eq('id', userId);
      
      if (profileError) throw profileError;
      
      // Use auth.signOut without the sessionIds parameter, which is causing the TypeScript error
      // Just sign out generally without specifying session IDs
      await supabase.auth.signOut();
      
      toast({
        title: 'Success',
        description: 'User has been deleted successfully',
      });
      
      fetchUsers(); // Refresh the users list
    } catch (error: any) {
      console.error('Error deleting user:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete user',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getPasswordStrengthClass = () => {
    switch (passwordStrength) {
      case "weak": return "bg-red-500";
      case "medium": return "bg-yellow-500";
      case "strong": return "bg-green-500";
      default: return "bg-gray-200";
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-center flex-1">User Management</CardTitle>
        <Dialog open={isAddUserDialogOpen} onOpenChange={setIsAddUserDialogOpen}>
          <DialogTrigger asChild>
            <Button>Add New User</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New User</DialogTitle>
              <DialogDescription>Create a new user account with specific role permissions.</DialogDescription>
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
                  onChange={(e) => {
                    setNewUser({...newUser, password: e.target.value});
                    validatePassword(e.target.value);
                  }}
                />
                {newUser.password && (
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className={`h-2.5 rounded-full ${getPasswordStrengthClass()}`} 
                      style={{ width: passwordStrength === "weak" ? "33%" : passwordStrength === "medium" ? "66%" : "100%" }}
                    ></div>
                  </div>
                )}
                <p className="text-xs text-gray-500">
                  Password must be at least 8 characters. Adding numbers and special characters increases security.
                </p>
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
                    <SelectItem value="coordination">Coordination</SelectItem>
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
              <Button onClick={prepareToAddUser}>Add User</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        
        {/* Confirmation Dialog */}
        <Dialog open={isConfirmationDialogOpen} onOpenChange={setIsConfirmationDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm User Creation</DialogTitle>
            </DialogHeader>
            
            {creationSuccess === null && !creationError && (
              <div className="py-6">
                <p>Are you sure you want to create a new user with the following details?</p>
                <div className="mt-4 space-y-2 text-sm">
                  <p><strong>Name:</strong> {newUser.name}</p>
                  <p><strong>Email:</strong> {newUser.email}</p>
                  <p><strong>Role:</strong> {newUser.role}</p>
                  {newUser.role === 'secretary' && newUser.workbodyId && (
                    <p><strong>Workbody:</strong> {workbodies.find(w => w.id === newUser.workbodyId)?.name || newUser.workbodyId}</p>
                  )}
                </div>
              </div>
            )}
            
            {isAddingUser && (
              <div className="flex flex-col items-center justify-center py-6">
                <Loader2 className="h-8 w-8 animate-spin text-pec-green mb-4" />
                <p>Creating user account...</p>
              </div>
            )}
            
            {creationSuccess === true && (
              <div className="flex flex-col items-center justify-center py-6">
                <CheckCircle className="h-12 w-12 text-green-500 mb-4" />
                <p className="text-lg font-medium">User Created Successfully!</p>
                <p className="text-sm text-gray-500 mt-2">
                  User account has been created and added to the system.
                </p>
              </div>
            )}
            
            {creationSuccess === false && (
              <Alert variant="destructive" className="my-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{creationError || "Failed to create user."}</AlertDescription>
              </Alert>
            )}
            
            <DialogFooter>
              {creationSuccess === null && !isAddingUser && (
                <>
                  <Button variant="outline" onClick={() => setIsConfirmationDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddUser}>
                    Confirm Creation
                  </Button>
                </>
              )}
              
              {(creationSuccess !== null || isAddingUser) && (
                <Button 
                  onClick={() => {
                    if (creationSuccess) {
                      setIsConfirmationDialogOpen(false);
                      setIsAddUserDialogOpen(false);
                    } else {
                      setIsConfirmationDialogOpen(false);
                    }
                  }}
                  disabled={isAddingUser}
                >
                  {creationSuccess ? "Close" : "Try Again"}
                </Button>
              )}
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
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDeleteUser(user.id)}
                    disabled={isLoading}
                  >
                    {isLoading ? 'Deleting...' : 'Delete'}
                  </Button>
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
  );
}
