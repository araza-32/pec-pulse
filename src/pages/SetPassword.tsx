
import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { AlertCircle, CheckCircle, Eye, EyeOff } from 'lucide-react';

export default function SetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isValidating, setIsValidating] = useState(true);
  const [isValidToken, setIsValidToken] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [userInfo, setUserInfo] = useState<{ name: string; email: string } | null>(null);
  
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState({
    password: '',
    confirmPassword: ''
  });

  const token = searchParams.get('token');

  useEffect(() => {
    if (token) {
      validateToken(token);
    } else {
      setIsValidating(false);
    }
  }, [token]);

  const validateToken = async (inviteToken: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('name, email, invite_expires')
        .eq('invite_token', inviteToken)
        .single();

      if (error || !data) {
        setIsValidToken(false);
        return;
      }

      // Check if token is expired
      const expiryDate = new Date(data.invite_expires);
      const now = new Date();
      
      if (now > expiryDate) {
        setIsValidToken(false);
        return;
      }

      setIsValidToken(true);
      setUserInfo({ name: data.name, email: data.email });
    } catch (error) {
      console.error('Error validating token:', error);
      setIsValidToken(false);
    } finally {
      setIsValidating(false);
    }
  };

  const validatePassword = (password: string) => {
    if (password.length < 8) {
      return 'Password must be at least 8 characters long';
    }
    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
      return 'Password must contain at least one uppercase letter, one lowercase letter, and one number';
    }
    return '';
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const password = e.target.value;
    setFormData({ ...formData, password });
    
    const error = validatePassword(password);
    setErrors({ ...errors, password: error });
  };

  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const confirmPassword = e.target.value;
    setFormData({ ...formData, confirmPassword });
    
    const error = confirmPassword !== formData.password ? 'Passwords do not match' : '';
    setErrors({ ...errors, confirmPassword: error });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    const passwordError = validatePassword(formData.password);
    const confirmPasswordError = formData.confirmPassword !== formData.password ? 'Passwords do not match' : '';
    
    if (passwordError || confirmPasswordError) {
      setErrors({
        password: passwordError,
        confirmPassword: confirmPasswordError
      });
      return;
    }

    setIsLoading(true);
    try {
      // Get user profile with the token
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('id, email')
        .eq('invite_token', token)
        .single();

      if (profileError || !profileData) {
        throw new Error('Invalid or expired invitation token');
      }

      // Update user password in Supabase auth
      const { error: updateError } = await supabase.auth.updateUser({
        password: formData.password
      });

      if (updateError) throw updateError;

      // Clear the invite token
      const { error: clearTokenError } = await supabase
        .from('profiles')
        .update({
          invite_token: null,
          invite_expires: null
        })
        .eq('id', profileData.id);

      if (clearTokenError) throw clearTokenError;

      toast({
        title: 'Success',
        description: 'Your password has been set successfully. You can now log in.',
      });

      // Redirect to login page
      navigate('/login');
    } catch (error: any) {
      console.error('Error setting password:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to set password',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isValidating) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardContent className="flex items-center justify-center p-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pec-green mx-auto mb-4"></div>
              <p>Validating invitation...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!token || !isValidToken) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center text-red-600">Invalid Invitation</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <AlertCircle className="mx-auto h-16 w-16 text-red-300 mb-4" />
            <p className="text-gray-600 mb-4">
              This invitation link is invalid or has expired.
            </p>
            <Button onClick={() => navigate('/login')}>
              Go to Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center">Set Your Password</CardTitle>
          {userInfo && (
            <p className="text-center text-gray-600">
              Welcome, {userInfo.name}! Please set your password to complete your account setup.
            </p>
          )}
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handlePasswordChange}
                  className={errors.password ? 'border-red-500' : ''}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
              {errors.password && (
                <p className="text-sm text-red-600">{errors.password}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={handleConfirmPasswordChange}
                  className={errors.confirmPassword ? 'border-red-500' : ''}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
              {errors.confirmPassword && (
                <p className="text-sm text-red-600">{errors.confirmPassword}</p>
              )}
            </div>

            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Password must be at least 8 characters long and contain uppercase, lowercase, and numeric characters.
              </AlertDescription>
            </Alert>

            <Button
              type="submit"
              className="w-full bg-pec-green hover:bg-pec-green/90"
              disabled={isLoading || !!errors.password || !!errors.confirmPassword}
            >
              {isLoading ? 'Setting Password...' : 'Set Password'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
