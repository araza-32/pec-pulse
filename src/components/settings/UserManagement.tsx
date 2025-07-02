
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
import { Badge } from "@/components/ui/badge";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { AlertCircle, CheckCircle, Loader2, Edit, Trash2, Mail, Plus, UserPlus } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/contexts/AuthContext';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  created_at: string;
}

export function UserManagement() {
  const { toast } = useToast();
  const { session } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    role: 'member'
  });

  const [editUser, setEditUser] = useState({
    name: '',
    email: '',
    role: '',
    status: ''
  });

  // Check if current user is admin
  const isAdmin = session?.role === 'admin';

  useEffect(() => {
    if (isAdmin) {
      fetchUsers();
    }
  }, [isAdmin]);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({
        title: 'Error',
        description: 'Failed to load users',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateUser = async () => {
    if (!newUser.name || !newUser.email) {
      toast({
        title: 'Missing Fields',
        description: 'Name and email are required',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);
    try {
      // Generate invite token
      const inviteToken = crypto.randomUUID();
      const inviteExpires = new Date();
      inviteExpires.setHours(inviteExpires.getHours() + 24); // 24 hours expiry

      // Create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: newUser.email,
        password: crypto.randomUUID(), // Temporary password
        options: {
          data: {
            name: newUser.name,
            role: newUser.role
          }
        }
      });

      if (authError) throw authError;

      if (authData.user) {
        // Update profile with invite token
        const { error: profileError } = await supabase
          .from('profiles')
          .update({
            invite_token: inviteToken,
            invite_expires: inviteExpires.toISOString()
          })
          .eq('id', authData.user.id);

        if (profileError) throw profileError;

        toast({
          title: 'Success',
          description: 'User created successfully. Invitation email sent.',
        });

        setNewUser({ name: '', email: '', role: 'member' });
        setIsCreateDialogOpen(false);
        fetchUsers();
      }
    } catch (error: any) {
      console.error('Error creating user:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to create user',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditUser = async () => {
    if (!selectedUser) return;

    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          name: editUser.name,
          role: editUser.role,
          status: editUser.status
        })
        .eq('id', selectedUser.id);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'User updated successfully',
      });

      setIsEditDialogOpen(false);
      setSelectedUser(null);
      fetchUsers();
    } catch (error: any) {
      console.error('Error updating user:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to update user',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ status: 'inactive' })
        .eq('id', userId);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'User deactivated successfully',
      });

      fetchUsers();
    } catch (error: any) {
      console.error('Error deactivating user:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to deactivate user',
        variant: 'destructive',
      });
    }
  };

  const handleResetPassword = async (userId: string) => {
    try {
      const inviteToken = crypto.randomUUID();
      const inviteExpires = new Date();
      inviteExpires.setHours(inviteExpires.getHours() + 24);

      const { error } = await supabase
        .from('profiles')
        .update({
          invite_token: inviteToken,
          invite_expires: inviteExpires.toISOString()
        })
        .eq('id', userId);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Password reset email sent',
      });
    } catch (error: any) {
      console.error('Error resetting password:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to reset password',
        variant: 'destructive',
      });
    }
  };

  const openEditDialog = (user: User) => {
    setSelectedUser(user);
    setEditUser({
      name: user.name || '',
      email: user.email || '',
      role: user.role,
      status: user.status || 'active'
    });
    setIsEditDialogOpen(true);
  };

  const getStatusBadge = (status: string) => {
    return (
      <Badge variant={status === 'active' ? 'default' : 'secondary'}>
        {status || 'active'}
      </Badge>
    );
  };

  const getRoleBadge = (role: string) => {
    const roleColors: Record<string, "default" | "destructive" | "secondary" | "outline"> = {
      admin: 'destructive',
      chairman: 'default',
      secretary: 'secondary',
      registrar: 'outline',
      coordination: 'outline',
      member: 'secondary'
    };
    
    return (
      <Badge variant={roleColors[role] || 'secondary'}>
        {role}
      </Badge>
    );
  };

  if (!isAdmin) {
    return (
      <Card className="m-4">
        <CardContent className="p-8 text-center">
          <AlertCircle className="mx-auto h-16 w-16 text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Access Denied</h3>
          <p className="text-gray-500">Only administrators can access user management.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="m-4">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-left flex-1">User Management</CardTitle>
        
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add User
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="text-left">Create New User</DialogTitle>
              <DialogDescription className="text-left">
                Create a new user account. They will receive an invitation email to set their password.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="create-name" className="text-left">Full Name</Label>
                <Input 
                  id="create-name" 
                  value={newUser.name}
                  onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                  placeholder="Enter full name"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="create-email" className="text-left">Email</Label>
                <Input 
                  id="create-email" 
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                  placeholder="Enter email address"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="create-role" className="text-left">Role</Label>
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
                    <SelectItem value="member">Member</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateUser} disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <UserPlus className="h-4 w-4 mr-2" />
                    Create User
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit User Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="text-left">Edit User</DialogTitle>
              <DialogDescription className="text-left">
                Update user information and permissions.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-name" className="text-left">Full Name</Label>
                <Input 
                  id="edit-name" 
                  value={editUser.name}
                  onChange={(e) => setEditUser({...editUser, name: e.target.value})}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-email" className="text-left">Email</Label>
                <Input 
                  id="edit-email" 
                  type="email"
                  value={editUser.email}
                  disabled
                  className="bg-gray-50"
                />
                <p className="text-xs text-gray-500">Email cannot be changed</p>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-role" className="text-left">Role</Label>
                <Select 
                  value={editUser.role} 
                  onValueChange={(value) => setEditUser({...editUser, role: value})}
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
                    <SelectItem value="member">Member</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-status" className="text-left">Status</Label>
                <Select 
                  value={editUser.status} 
                  onValueChange={(value) => setEditUser({...editUser, status: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleEditUser} disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Updating...
                  </>
                ) : (
                  'Update User'
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardHeader>
      
      <CardContent className="p-4">
        {isLoading ? (
          <div className="flex justify-center items-center py-8">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-left">Name</TableHead>
                <TableHead className="text-left">Email</TableHead>
                <TableHead className="text-left">Role</TableHead>
                <TableHead className="text-left">Status</TableHead>
                <TableHead className="text-left">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="text-left">{user.name || 'N/A'}</TableCell>
                  <TableCell className="text-left">{user.email}</TableCell>
                  <TableCell className="text-left">{getRoleBadge(user.role)}</TableCell>
                  <TableCell className="text-left">{getStatusBadge(user.status)}</TableCell>
                  <TableCell className="text-left">
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openEditDialog(user)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleResetPassword(user.id)}
                      >
                        <Mail className="h-4 w-4" />
                      </Button>
                      
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="destructive"
                            size="sm"
                            disabled={user.status === 'inactive'}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Deactivate User</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to deactivate {user.name}? This will prevent them from accessing the system.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDeleteUser(user.id)}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              Deactivate
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {users.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    <UserPlus className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                    <p className="text-gray-500">No users found</p>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
